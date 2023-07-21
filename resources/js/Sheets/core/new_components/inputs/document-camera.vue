<template>
    <div :id="id">
        <label>
            {{ label }}
        </label>
        <button class="btn btn-info btn-block" @click="startCam">
            <i class="fa fa-camera fa-lg"></i>
        </button>
        <GenericModal :show="modal" @show="closeModal" ref="genericModal">
            <template>
                <video autoplay="true" :id="webcamVideoId" style="display: none;"/>
                <canvas :id="canvasId"></canvas>
            </template>
            <template #footer>
                <button class="btn btn-success btn-fab" @click="takePhoto">
                    <i class="fa fa-camera fa-lg"></i>
                </button>
            </template>
        </GenericModal>
        <div class="thumbnail-cam"  v-show="has_preview">
            <img src="" alt="thumbnail" :id="resultId" :ref="refThumb"/>
            <div class="middle"  @click="dismiss">
                <span>&#x2715;</span>
            </div>
        </div>
        <!-- <figure class="thumbnail-cam">
            <img src="" alt="thumbnail" :id="resultId" :ref="thumbnail"/>
            <figcaption @click="dismiss">
                &#x2715;
            </figcaption>
        </figure> -->
    </div>
</template>
<script>
import GenericModal from '../utils/GenericModal.vue';
import InputMix from '../mixs/input.vue'
export default {
    mixins: [InputMix],
    components: {
        GenericModal,
    },
    data: () => ({
        // mostrar modal
        modal: false,
        open_cam: false,
        width: 0,
        height: 0,
        has_preview: false,
        intervalId: null,
    }),
    computed: {
        constraints() {
            return {
                audio: false, 
                video: {
                    width: 640,
                    height: 400,
                    aspectRatio: 2.3 // 21/9
                }
            }
        },
        webcamVideoId() {
            return `video-${this.id}`
        },
        canvasId() {
            return `canvas-${this.id}`
        },
        resultId() {
            return `result-${this.id}`
        },
        refThumb() {
            return `thumb-${this.id}`
        }
    },
    watch: {
        open_cam(val) {
            if (val) {
                const fps = 60;
                this.intervalId = window.setInterval(() => {
                    this.drawImage(document.querySelector(`#${this.webcamVideoId}`));
                }, 1000 / fps);
            } else {
                window.clearInterval(this.intervalId)
            }
        }
    },
    methods: {
        /**
         * Inicializacion de la camara y asignacion
         * de los frames al elemento video
         */
        startCam() {
            this.modal = true;
            this.open_cam = true;
            const canvas = document.querySelector(`#${this.canvasId}`);
            
            navigator.mediaDevices.getUserMedia(this.constraints)
            .then((stream) => {
                const videoElement = document.querySelector(`#${this.webcamVideoId}`);
                videoElement.srcObject = stream 
                videoElement.play()
                const settings = stream.getVideoTracks()[0].getSettings()
                
                this.width = canvas.width;
                this.height = settings.height;
                canvas.height = settings.height;
                this.drawImage(videoElement);
            }).catch((error) => {
                console.error(error)
            })
        },
        /**
         * Dibuja el frame en el canvas
         * @param {*} video 
         */
        drawImage(video) {
            const canvas = document.querySelector(`#${this.canvasId}`);
            // canvas.width = 800;
            // canvas.height = this.height;
            const ctx = canvas.getContext('2d', { alpha: false })
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            
            
            // tercio del ancho de la imagen
            const w_3 = parseInt(this.width /3);
            // tercio del alto de la imagen
            const y_3 = parseInt(this.height /3);
            const PX = parseInt(w_3 - (w_3 / 2));
            const PY = parseInt(y_3 - (y_3 / 2));
            const WIDTH = parseInt(this.width - w_3);
            const HEIGHT = parseInt(this.height - y_3);

            ctx.rect(PX, PY, WIDTH, HEIGHT);
            
            ctx.lineWidth = "3";
            ctx.strokeStyle = "red";    
            ctx.stroke();
        },
        /**
         * Captura de la image
         */
        takePhoto() {
            const canvas = document.querySelector(`#${this.canvasId}`)
            const imageBase64 = canvas.toDataURL('image/jpeg')
            this.has_preview = true;
            const imgThumb = document.querySelector(`#${this.resultId}`);
            imgThumb.src = imageBase64
            imgThumb.width = 100
            imgThumb.height = 100

            // tercio del ancho de la imagen
            const w_3 = parseInt(this.width /3);
            // tercio del alto de la imagen
            const y_3 = parseInt(this.height /3);
            const PX = parseInt(w_3 - (w_3 / 2));
            const PY = parseInt(y_3 - (y_3 / 2));
            const WIDTH = parseInt(this.width - w_3);
            const HEIGHT = parseInt(this.height - y_3);

            const data = {
                image: imageBase64,
                original: {
                    width: this.width,
                    height: this.height,
                },
                interest: {
                    px: PX,
                    py: PY,
                    width: WIDTH,
                    height:HEIGHT
                }
            }
            
            this.stopCam()
            this.onInput(data)
        },
        /**
         * Detener la ejecucion de la camara
         */
        stopCam() {
            const videoEl = document.querySelector(`#${this.webcamVideoId}`);
            // now get the steam 
            const stream = videoEl.srcObject;
            // now get all tracks
            const tracks = stream.getTracks();
            // now close each track by having forEach loop
            tracks.forEach(function(track) {
            // stopping every track
            track.stop();
            });
            // assign null to srcObject of video
            videoEl.srcObject = null;
            this.modal = false;
        },
        /**
         * Emision de data para ser entregada en formbuilder
         * @param {*} data 
         */
        onInput(data) {
            const file = this.base64ToFile(data.image)
            const storeData = {}
            storeData[this.id] = {
                file: file,
                metadata: {
                    original: data.original,
                    interest: data.interest
                }
            }
            const store = { id: this.id, file: file, metadata: storeData[this.id].metada };
            this.$store.commit(`${this.state}/FILES`, store);
            this.$emit('input', storeData)
        },
        /**
         * Descartar imagen tomada
         */
        dismiss() {
            const el = this.$refs[this.refThumb];
            el.removeAttribute('src', '')
            this.$emit('input', {});
            this.has_preview = false;

        },
        /**
         * Cierre de modal
         */
        closeModal() {
            this.modal = false;
            this.stopCam();
        },
        /**
         * Convierte el string base64 a
         * un objeto File
         */
        base64ToFile(base64) {
            const arr = base64.split(',')
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[arr.length - 1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while(n--)
                u8arr[n] = bstr.charCodeAt(n);
            
            const ext = mime.split('/')[1]
            const filename = `${Date.now()}.${ext}`
            return new File([u8arr], filename, {type:mime});
        }
    }
}
</script>
<style lang="scss">
canvas {
    border: 1px solid black;
    width: 100%;
    max-height: 90vh;
}
.thumbnail-cam {
    position: relative;
    width: min-content;
    .image {
        opacity: 1;
        display: block;
        transition: .5s ease;
        backface-visibility: hidden;
    }
    .middle {
        transition: .5s ease;
        opacity: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        text-align: center;
    }
    span {
        background-color: #04AA6D;
        color: white;
        font-size: 10px;
        padding: 8px 16px;
    }
    &:hover image {
        opacity: 0.3;
    }
    &:hover .middle {
        opacity: 1;
    }
}
</style>
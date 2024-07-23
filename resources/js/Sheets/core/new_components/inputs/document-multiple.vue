<template>
    <file-template
        v-if="show_field"
        :label="label"
        :id="id"
        :required="required"
        :placeholder="document_name"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"
    >
        <div :class="[{'d-none': disabled}, 'container-fluid']">
            <div class="row">
                <div class="col px-0">
                    <div class="document-load-container">
                        <div class="document-input-text">
                            <i class="bi bi-cloud-arrow-up"></i> Agregar archivo
                        </div>
                        <input
                            multiple
                            type="file"
                            lang="es"
                            :id="id"
                            :aria-describedby="id"
                            :accept="accept"
                            :ref="dynamicRef"
                            class="document-input-file"
                            @input="onInput"
                            @change="onChange"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid container-document-multiple" v-if="documents.length > 0">
            <div class="row">
                <div class="col p-0">
                    <div class="documents-container" :ref="'documents_container' + this.id">
                        <div class="documents-actions left-action" @click="moveToLeft">
                            <i class="bi bi-chevron-left"></i>
                        </div>
                        <div v-for="document in documents" :key="document.id">
                            <div class="document">
                                <span class="icon-file">
                                    <i class="bi bi-file-check"></i>
                                </span>
                                <div
                                    class="btn-view-file"
                                    @click="viewDocument(document.file)"
                                >
                                    <i class="bi bi-eye"></i>
                                </div>
                                <span
                                    :class="[{ 'd-none': disabled }, 'btn-delete-file']"
                                    @click="deleteDocument(document.id)"
                                    ><i class="bi bi-x"></i
                                ></span>
                            </div>
                            <div class="document-name">
                                <p>{{ document.name }}</p>
                            </div>
                        </div>
                        <div class="documents-actions right-action" @click="moveToRight">
                            <i class="bi bi-chevron-right"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div ref="preview"></div>
    </file-template>
</template>

<script>
import FileTemplate from '../templates/file.vue';
import mix from '../mixs/input.vue';
import mixFile from '../mixs/files.vue';


export default {
    mixins: [mix, mixFile],
    components: {
        'file-template': FileTemplate,
    },
    data() {
        return {
            documents: [],
            newDocuments: [],
            correlative: 1
        };
    },
    computed: {
        contentInfo() {
            return this.$store.getters[`${this.state}/content_info`];
        },
        recordId() {
            return this.$store.getters[`${this.state}/record_id`];
        },
        clear() {
            return this.$store.getters[`${this.state}/clearfields`];
        },
    },
    watch: {
        contentInfo(val) {
            if (Object.keys(val).length > 0) {
                this.getAllDocuments();
            }
        },
        clear(val) {
            if (val) {
                this.clearDocuments();
            }
        },
    },
    methods: {
         // Permite obtener todos los documentos almacenados en el campo
         getAllDocuments() {
            const fields = this.$store.getters[`${this.state}/fields`];

            if (fields && fields.length > 0) {
                const val = fields.filter((f) => Object.keys(f)[0] === this.id)[0];

                if (val) {
                    // Se obtienen los ids de los documentos almacenados en el campo
                    const parsedIds = JSON.parse(val[this.id]);

                    if (Array.isArray(parsedIds) && parsedIds.length > 0) {
                        this.correlative = parsedIds.length + 1;

                        this.$emit('input', {
                            [this.id]: parsedIds,
                        });

                        if (this.contentInfo) {
                            const documents = this.contentInfo.content.entities_fk[this.input.entity_type_fk];

                            parsedIds.forEach((id) => {
                                const filterDocuments = documents.find((ent) => ent.id === id);

                                if (filterDocuments) {
                                    this.documents.push({
                                        id: filterDocuments.id,
                                        name: filterDocuments.name,
                                        file: this.base_url + filterDocuments.src,
                                    });
                                }
                            });
                        }
                    } else {
                        this.$emit('input', {
                            [this.id]: [],
                        });
                    }
                }
            }
        },
        // Permite agregar un archivo al campo y almacenarlo en el store
        onChange(event) {
            if (this.input.permission === 2 && event.target.files[0]) {
                this.addDocument(event);

                const data = {
                    id: this.id,
                    file: [],
                    col_name: this.input.col_name,
                    entity_type_fk: this.input.entity_type_fk,
                };

                if(this.recordId) {
                    data.file = this.newDocuments;
                } else {
                    data.file = this.documents;
                }

                this.$store.commit(`${this.state}/FILES`, data);

                if(this.recordId) {
                    this.$emit('input', {[this.id]: this.documents.map((document) => document.id)});
                } else {
                    this.$emit('input', {[this.id]: []});
                }
            }
        },
        // Permite agregar un archivo al campo, mostrando una vista previa del mismo
        addDocument(file) {
            // Se verifica si se seleccionó más de un archivo
            if (file.target.files.length > 1) {
                for (let i = 0; i < file.target.files.length; i++) {
                    const document = {
                        id: `file-pending-${this.correlative}`,
                        name: file.target.files[i].name,
                        file: file.target.files[i],
                        src: null,
                    };

                    if(this.recordId) {
                     // Se agrega el archivo a la lista de nuevos documentos que se van a almacenar
                        this.newDocuments.push(document);
                    }
                    // Se agrega el archivo al campo
                    this.documents.push(document);

                    this.correlative++;
                }

                return;
            }
            // Se agrega el archivo al campo
            const document = {
                id: `file-pending-${this.correlative}`,
                name: file.target.files[0].name,
                file: file.target.files[0],
                src: null,
            };

            if(this.recordId) {
                // Se agrega el archivo a la lista de nuevos documentos que se van a almacenar
                this.newDocuments.push(document);
            }

            // Se agrega el archivo al campo
            this.documents.push(document);

            this.correlative++;
        },
        deleteDocument(id) {
            this.documents = this.documents.filter((document) => document.id !== id);

            if (this.documents.length === 0) {
                this.clearDocuments();

                return;
            }

            const data = {
                id: this.id,
                file: [],
                col_name: this.input.col_name,
                entity_type_fk: this.input.entity_type_fk,
            };

            const documentsId = this.documents.map((document) => document.id);

            if (this.recordId) {
                this.newDocuments = this.newDocuments.filter((document) => document.id !== id);

                if(this.newDocuments.length === 0) {
                    this.$store.commit(`${this.state}/DELETE_FILE`, this.id);
                }

                if(this.newDocuments.length > 0) {
                    data.file = this.newDocuments;

                    this.$store.commit(`${this.state}/FILES`, data);
                }

                this.$emit('input', {
                    [this.id]: documentsId,
                });
            } else {
                data.file = this.documents;

                this.$store.commit(`${this.state}/FILES`, data);

                this.$emit('input', {
                    [this.id]: documentsId,
                });
            }

            if (this.documents.length === 0) {
                this.clearDocuments();
            }

            this.correlative--;
        },
        // Permite visualizar un archivo en el visor de documentos
        viewDocument(document) {
            this.onShowFile(document);
        },
        // Permite mover el scroll hacia la izquierda
        moveToLeft() {
            const container = this.$refs['documents_container' + this.id];
            container.scrollLeft -= 300;
        },
        // Permite mover el scroll hacia la derecha
        moveToRight() {
            const container = this.$refs['documents_container' + this.id];
            container.scrollLeft += 300;
        },
        // Permite limpiar los documentos almacenados en el campo
        clearDocuments() {
            this.documents = [];
            this.newDocuments = [];
            this.correlative = 1;

            this.$store.commit(`${this.state}/DELETE_FILE`, this.id);

            this.$emit('input', {
                [this.id]: [],
            });
        },
    },
};
</script>

<style lang="scss">
div.document-load-container {
    position: relative;

    div.document-input-text {
        width: 100%;
        height: 40px;
        margin: 4px 0px;
        padding: 10px 16px;
        text-align: center;
        border-radius: 4px;
        background: #ecf6fd;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
        border: 1px dashed #3c5667;
    }

    input.document-input-file {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }
}
div.container-document-multiple {
    border: solid 1px #cdcdcd;
    border-radius: 4px;
    background-color: #fff;

    div.documents-container {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        width: 100%;
        height: auto;
        padding: 0px 40px;
        overflow: hidden;

        div.document-name {
            width: 160px;

            p {
                margin: 0px;
                color: #787878;
                text-align: center;
                font-family: Inter;
                font-size: 14px;
                font-style: normal;
                font-weight: 500;
                line-height: 20px;
            }
        }

        div.documents-actions {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 228px;
            background: #fff;
            cursor: pointer;

            i {
                font-size: 24px;
                color: #787878;
            }

            &.left-action {
                position: absolute;
                top: 0px;
                left: 0px;
                background: transparent;
                z-index: 3;
            }

            &.right-action {
                position: absolute;
                top: 0px;
                right: 0px;
                background: transparent;
                z-index: 3;
            }
        }

        div.document {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
            width: 160px;
            height: 200px;
            margin: 4px;
            border-radius: 4px;
            border: 1px solid #d9d9d9;
            background: #fff;
            box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.25);
            color: #3c5667;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px;

            span.icon-file {
                position: absolute;
                top: 70px;
                left: 50px;
                margin: 0;
                color: #d9d9d9;
                font-size: 60px;
            }

            div.btn-view-file {
                display: none;
            }

            span.btn-delete-file {
                position: absolute;
                top: 0px;
                right: 0px;
                z-index: 1;
                margin: 0;
                color: rgba(120, 120, 120, 0.5);
                font-size: 24px;
                cursor: pointer;

                &:hover {
                    color: #000;
                }
            }

            &:hover {
                div.btn-view-file {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-shrink: 0;
                    padding: 8px 10px;
                    width: 160px;
                    height: 200px;
                    z-index: 2;
                    color: #fff;
                    font-size: 30px;
                    border-radius: 4px;
                    background: rgba(0, 0, 0, 0.6);
                    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.25);
                    clip-path: polygon(0 0, 70% 0, 100% 26%, 100% 0%, 100% 100%, 0% 100%);
                    cursor: pointer;
                }
            }
        }
    }
}
</style>

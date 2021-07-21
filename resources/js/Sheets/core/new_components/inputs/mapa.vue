<template>
    <div class="container-fluid">

        <div class="row">
            <div class="col text-center">
                <h3>
                    {{ label }}
                </h3>
            </div>
        </div>

        <div class="row">
            <div class="col text-center">
                <p>
                    Haga click sobre el mapa para posicionar el marcador y
                    seleccionar las coordenadas
                </p>
            </div>
        </div>

        <div class="row">
            <div class="col text-center">
                <div id="map">

                </div>
            </div>
        </div>

        <div class="row" v-if="showErrorMsgAddress">
            <div class="col text-center">
                <p class="text-danger">
                    {{ errorMsgAddress }}
                </p>
            </div>
        </div>

        <div class="row">
            <div class="col text-center">
                <p v-if="selectedLat != '' && selectedLng != ''">
                    <b>Latitud seleccionada: </b> <i>{{ selectedLat }}</i>
                    <b>Longitud seleccionada: </b> <i>{{ selectedLng }}</i>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        input: {
            type: Object,
            require: true
        },
        value: {
            required: true
        }
    },
    data: () => ({
        loading: false,
        errorMsgAddress: "Dirección no encontrada, intente con otra dirección",
        showErrorMsgAddress: false,
        myMap: null,
        marker: null,
        selectedLat: "",
        selectedLng: "",
        latitude: -33.45694,
        longitude: -70.64827
    }),
    computed: {
        label() {
            return this.input.name
        }
    },
    mounted() {
        this.setUp()
        // this.getEditValue();
        // this.bus.$on("searchMap", args => {
        //     if (this.form.col_filter_by === args.col_name) {
        //         this.searchAddress(args.value);
        //     }
        // });
    },
    methods: {
        setUp() {
            this.myMap = L.map('map')
                .setView([this.latitude, this.longitude], 7)

            const URL = "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic21hbmF1cmU5MyIsImEiOiJja28xcDY4bHgwbmpuMzFvaWx3YW83NG5kIn0.vfx8Fuf3bD-j7_k6pdSoqQ"

            const config = {
                maxZoom: 18,
                attribution:
                    'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: "mapbox/streets-v11",
                tileSize: 512,
                zoomOffset: -1
            }

            L.tileLayer(URL, config).addTo(this.myMap);

            this.myMap.on('clicl', this.onClick)
        },
        onClick(e) {
            this.myMap.eachLayer(layer => {
                if(!layer._container) {
                    this.myMap.removeLayer(layer)
                }
            })

            this.selectedLat = e.latlng.lat
            this.selectedLng = e.latlng.lng

            this.marker = L.marker([
                e.latlng.lat,
                e.latlng.lng
            ]).addTo(this.myMap)

            const value = `${this.selectedLat},${this.selectedLng}`

            const data = {
                id: this.input.id,
                value
            }

            this.$emit('input', data)
        },
        // getEditValue() {
        //     const allValues = Object.assign(
        //         {},
        //         this.$store.getters["form/fieldsvalues"]
        //     );
        //     if (allValues[this.id]) {
        //         const value = allValues[this.id].split(",");
        //         this.myMap.remove();
        //         this.myMap = L.map("SheetsMap__mapcontainer").setView(
        //             [value[0], value[1]],
        //             7
        //         );
        //         L.tileLayer(
        //             "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic21hbmF1cmU5MyIsImEiOiJja28xcDY4bHgwbmpuMzFvaWx3YW83NG5kIn0.vfx8Fuf3bD-j7_k6pdSoqQ",
        //             {
        //                 maxZoom: 18,
        //                 attribution:
        //                     'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        //                     'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        //                 id: "mapbox/streets-v11",
        //                 tileSize: 512,
        //                 zoomOffset: -1
        //             }
        //         ).addTo(this.myMap);

        //         this.myMap.on("click", this.clickOnMap);
        //         this.marker = L.marker([value[0], value[1]]).addTo(this.myMap);
        //         this.selectedLat = value[0];
        //         this.selectedLng = value[1];
        //     }
        // },
        // resetMap(lat, lng, zoom) {
        //     this.myMap.remove();
        //     this.myMap = L.map("SheetsMap__mapcontainer").setView(
        //         [lat, lng],
        //         zoom
        //     );
        //     L.tileLayer(
        //         "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic21hbmF1cmU5MyIsImEiOiJja28xcDY4bHgwbmpuMzFvaWx3YW83NG5kIn0.vfx8Fuf3bD-j7_k6pdSoqQ",
        //         {
        //             maxZoom: 18,
        //             attribution:
        //                 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        //                 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        //             id: "mapbox/streets-v11",
        //             tileSize: 512,
        //             zoomOffset: -1
        //         }
        //     ).addTo(this.myMap);

        //     this.myMap.on("click", this.clickOnMap);
        // },
        // resetMapSearch(lat, lng, zoom) {
        //     this.myMap.remove();
        //     this.myMap = L.map("SheetsMap__mapcontainer").setView(
        //         [lat, lng],
        //         zoom
        //     );
        //     L.tileLayer(
        //         "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic21hbmF1cmU5MyIsImEiOiJja28xcDY4bHgwbmpuMzFvaWx3YW83NG5kIn0.vfx8Fuf3bD-j7_k6pdSoqQ",
        //         {
        //             maxZoom: 18,
        //             attribution:
        //                 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        //                 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        //             id: "mapbox/streets-v11",
        //             tileSize: 512,
        //             zoomOffset: -1
        //         }
        //     ).addTo(this.myMap);

        //     this.myMap.on("click", this.clickOnMap);
        //     this.myMap.eachLayer(layer => {
        //         if (!layer._container) {
        //             this.myMap.removeLayer(layer);
        //         }
        //     });
        //     this.selectedLat = lat;
        //     this.selectedLng = lng;
        //     this.marker = L.marker([lat, lng]).addTo(this.myMap);
        //     const value = `${this.selectedLat},${this.selectedLng}`;
        //     const data = {
        //         id: this.form.id,
        //         value
        //     };
        //     this.$emit("sheets-map-selector-change", data);
        // },
        // searchAddress(value) {
        //     this.showErrorMsgAddress = false;
        //     this.loading = true;
        //     const url = `https://nominatim.openstreetmap.org/search?format=json&q=${value}`;
        //     axios
        //         .get(url)
        //         .then(response => {
        //             this.loading = false;
        //             if (response.data.length === 0 || response.status !== 200) {
        //                 this.showErrorMsgAddress = true;
        //             } else {
        //                 const firstFound = response.data[0];
        //                 this.resetMapSearch(firstFound.lat, firstFound.lon, 17);
        //             }
        //         })
        //         .catch(error => {
        //             this.loading = false;
        //             this.showErrorMsgAddress = true;
        //             console.log(
        //                 "Ocurrió un error al consultar dirección",
        //                 error
        //             );
        //         });
        // }
    }
}
</script>

<style>

</style>

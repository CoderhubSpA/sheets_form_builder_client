<template>
  <div class="container" v-if="show_field">
    <div class="row">
      <div class="col-12" v-if="linkTarget > 0">
        <a
          class="float-right sheet-field-info-link"
          :href="linkTarget"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ linkDescription }}
        </a>
      </div>
    </div>
    <h3 class="text-center">
      {{ label }} <span v-if="required" class="text-danger">*</span
      ><span class="tooltip-custom" v-if="tooltipInfo.length > 0">
        <span class="icon">&#9432;</span>
        <span class="tooltiptext">
          {{ tooltipInfo }}
        </span>
      </span>
    </h3>
    <p class="text-center">
      Haga click sobre el mapa para posicionar el marcador y seleccionar las coordenadas
    </p>
    <l-map
      class="sheets-map"
      :zoom="zoom"
      :center="center"
      :maxZoom="maxZoom"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
      @click="onClick"
    >
      <l-tile-layer :url="url" />
      <l-marker :lat-lng="market" v-if="!!market" />
      <mia-map-loader />
    </l-map>
    <!--  -->
    <p class="text-danger text-center" v-if="errorMsgAddress">
      {{ errorMsgAddress }}
    </p>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import { latLng } from 'leaflet';
import mixInput from '../mixs/input.vue';
import mapLoader from '../utils/loader-map.vue';

export default {
  mixins: [mixInput],
  components: {
    LMap,
    LTileLayer,
    LMarker,
    'mia-map-loader': mapLoader,
  },
  data: () => ({
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    zoom: 7,
    maxZoom: 18,
    center: latLng(-33.45694, -70.64827),
    bounds: null,
    errorMsgAddress: '',
    clicked: false,
  }),
  computed: {
    market() {
      const fields = this.$store.getters['formBuilder/fields'];

      if (fields.length > 0) {
        const val = fields.filter((f) => Object.keys(f)[0] === this.id)[0];

        // eslint-disable-next-line no-extra-boolean-cast
        if (!!val) {
          this.$emit('input', val);
          const coords = val[this.id].split(',');

          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.center = latLng(Number(coords[0]), Number(coords[1]));
          return this.center;
        }
      }

      return !this.clicked ? latLng(null, null) : this.center;
    },
    query_address() {
      const toSearch = this.$store.getters['formBuilder/searchMap'];
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!toSearch) {
        return toSearch[this.input.col_filter_by];
      }
      return null;
    },
  },
  watch: {
    value(val) {
      const coords = val[this.id].split(',');
      this.center = latLng(coords[0], coords[1]);
    },
    query_address(val) {
      this.searchAddress(val);
    },
  },
  methods: {
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    centerUpdated(center) {
      this.center = center;
    },
    boundsUpdated(bounds) {
      this.bounds = bounds;
    },
    onClick(e) {
      this.clicked = true;
      this.center = latLng(e.latlng.lat, e.latlng.lng);

      const value = `${e.latlng.lat}, ${e.latlng.lng}`;

      const data = {};
      data[this.id] = value;

      this.$emit('input', data);
      /**
       * mostrar/ocultar section
       */
      const field_section_show_hide = {};
      field_section_show_hide[this.form_field_id] = val;
      this.$store.commit(`${this.state}/FIELD_SECTION_SHOW_HIDE`, field_section_show_hide);
    },
    searchAddress(search) {
      const URL = `https://nominatim.openstreetmap.org/search?format=json&q=${search}`;

      // eslint-disable-next-line no-undef
      axios
        .get(URL)
        .then((response) => {
          const data = response.data[0];
          // eslint-disable-next-line no-extra-boolean-cast
          if (!!data) {
            this.center = latLng(data.lat, data.lon);
            this.zoom = 17;
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    },
  },
};
</script>
<style lang="scss">
.sheets-map {
  min-height: 400px;
  z-index: 1;
  width: 100%;
}
</style>

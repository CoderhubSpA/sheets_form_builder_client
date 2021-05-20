<template>
    <div :class="`col col-${sm} col-${md} col-${xl}`">
        <span v-html="info"></span>
        <br />
        <button :class="`btn btn-info mt-4 float-right`" @click="next">
            Siguiente
        </button>
    </div>
</template>

<script>
export default {
    props: {
        field: {
            type: Object,
            default: () => {},
            require: true
        }
    },
    data: () => ({
        info: `<ul><li> item 1</li><li> item 2</li></ul>`
    }),
    computed: {
        title() {
            return this.field.name;
        },
        sm() {
            return this.field.col_sm;
        },
        md() {
            return this.field.col_md;
        },
        xl() {
            return this.field.col_xl;
        }
    },
    watch: {},
    mounted() {},
    methods: {
        next() {
            console.log("siguiente sección");
        }
    }
};
</script>

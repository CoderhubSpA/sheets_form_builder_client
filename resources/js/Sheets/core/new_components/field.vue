<template>
    <div :class="`sheets-field col-sm-${sm} col-md-${md} col-xl-${xl}`">
        <component
            :is="fieldInput"
            :input="field"
            v-model="data">
        </component>
    </div>
</template>

<script>
export default {
    props: {
        field: {
            type: Object
        },
        value: {
            required: true
        }
    },
    data: () => ({
        data: null
    }),
    computed: {
        fieldInput() {
            const chars = { "[" : '-', "]": ''}
            const format = this.field.format.toLowerCase().replace(/\[|\]/g,m => chars[m])
            return () => import(`./inputs/${format}`)
        },
        xl() {
            return this.field.col_xl
        },
        sm() {
            return this.field.col_sm
        },
        md() {
            return this.field.col_md
        },
    },
    watch: {
        data() {
            this.$emit('input', this.data)
        }
    }

}

</script>

<style lang="scss">
.sheets-field {
    border: 1px solid green;
    margin-bottom: 2px;
    padding: 2px;
}
</style>

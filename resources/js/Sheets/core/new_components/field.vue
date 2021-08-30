<template>
    <div class="sheets-field-wrapper" :class="`sheets-field col-sm-${sm} col-md-${md} col-xl-${xl}`">
        <component
            :is="fieldInput"
            :input="field"
            v-model="data"
            disabled>
        </component>
        <div class="row">
            <div class="col">
                <span class="float-right text-danger sheets-required-answer">
                    {{ error_messages }}
                </span>
            </div>
        </div>
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
        data: {}
    }),
    computed: {
        fieldInput() {
            const chars = { "[" : '-', "]": ''}
            const format = this.field.format.toLowerCase().replace(/\[|\]/g, m => chars[m]);
            return () => import(`./inputs/${format}`)
        },
        xl() {
            return this.field.col_xl || 12
        },
        sm() {
            return this.field.col_sm || 12
        },
        md() {
            return this.field.col_md || 12
        },
        error_messages() {
            const errors = this.$store.getters['formBuilder/errors_fields']

            return errors[this.field.id]
        },
        clear() {
            return this.$store.getters['formBuilder/clearfields']
        }
    },
    watch: {
        data() {
            if (this.error_messages) {
                this.$store.commit('formBuilder/CLEAR_ERROR_FIELD', this.field.id)
            }
            this.$emit('input', this.data)
        },
        clear(val) {
            if (val) {
                this.data = {}
            }
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
.sheets-required-answer {
    font-weight: 700;
}
</style>

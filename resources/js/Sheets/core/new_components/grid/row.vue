<template>
    <div class="sheets-row">
        <h3 class="sheets-row-title">
            {{ name }}
        </h3>
        <div class="row">
            <seets-section
                v-for="(sect, key) in sections"
                :key="key"
                :section="sect"
                v-model="rowModel[key]">
            </seets-section>
        </div>
    </div>
</template>

<script>
import section from './section.vue'
export default {
    components: {
        'seets-section': section
    },
    props: {
        row: {
            type: Object,
            require: true
        }
    },
    data: () => ({
        rowModel: []
    }),
    watch: {
        rowModel() {
            this.$emit('input', this.rowModel)
        }
    },
    computed: {
        id() {
            return this.row.id
        },
        name() {
            return this.row.name
        },
        sections() {
            return this.row.sections || []
        }
    }
}
</script>

<style lang="scss">
.sheets-row {
    border: 1px solid blue;
    padding: 2px;
}
.sheets-row-title {
    color: rgb(10, 10, 94);
}
</style>

<template>
    <div class="sheets-row">
        <h3 class="sheets-row-title">
            {{ name }}
        </h3>
        <div class="sheets-row-wrapper row">
            <sheets-section
                v-for="(sect, key) in sections"
                :key="key"
                :section="sect"
                v-model="rowModel[key]">
            </sheets-section>
        </div>
    </div>
</template>

<script>
import section from './section.vue'
export default {
    components: {
        'sheets-section': section
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
            let model = []
            this.rowModel.forEach(section => {
                model = model.concat(section)
            })
            this.$emit('input', model)
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

    .sheets-row-title {
        color: rgb(10, 10, 94);
    }

    .sheets-row-wrapper {
        //
    }
}


</style>

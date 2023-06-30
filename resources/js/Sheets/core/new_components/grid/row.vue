<template>
    <div class="sheets-row">
        <h3 class="sheets-row-title">{{ name }}</h3>
        <div class="sheets-row-wrapper row" :style="{ height: row_height }">
            <sheets-section
                v-for="(sect, key) in sections"
                :key="key"
                :section="sect"
                :state="state"
                :base_url="base_url"
                v-model="rowModel[key]"
            >
            </sheets-section>
        </div>
    </div>
</template>

<script>
import section from './section.vue';

export default {
    components: {
        'sheets-section': section,
    },
    props: {
        row: {
            type: Object,
            require: true,
        },
        state: {
            type: String,
            require: true,
        },
        base_url: {
            type: String,
            default: '',
        },
    },
    data: () => ({
        rowModel: [],
    }),
    watch: {
        rowModel() {
            let model = [];
            this.rowModel.forEach((s) => {
                model = model.concat(s);
            });
            this.$emit('input', model);
        },
    },
    computed: {
        id() {
            return this.row.id;
        },
        name() {
            return this.row.name;
        },
        sections() {
            return this.row.sections || [];
        },
        row_height() {
            if (this.row.height) {
                return `${this.row.height}px`;
            }
            return 'unset';
        },
    },
};
</script>

<style lang="scss">
.sheets-row {
    border: 1px solid blue;
    padding: 2px;

    .sheets-row-title {
        color: rgb(10, 10, 94);
    }
}
</style>

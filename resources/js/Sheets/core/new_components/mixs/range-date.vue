<script>
export default {
    computed: {
        dateRangeBeforeMonth() {
            return this.input.date_range_before_month;
        },
        dateRangeAvailableUntil() {
           return this.input.date_range_available_until;
        }
    },
    methods: {
        handleInputData() {
            if (this.rangeValue.start === null && this.rangeValue.end === null) {
                const contentInfo = this.$store.getters[`${this.state}/content_info`];
                const column = contentInfo.content.columns.find((col) => col.id === this.input.id);
                const filter = {
                    column,
                    id: `external-filter-${column.id}`,
                    order: 1,
                    search: null,
                    type: 'BETWEEN',
                    remote: true,
                };

                this.$store.commit(`${this.state}/ACTIVE_FILTERS`, filter);
                this.$store.commit(`${this.state}/SELECTOR_REMOTE_FILTER`, filter);
                this.$emit('deletedFilter');
            } else {
                const contentInfo = this.$store.getters[`${this.state}/content_info`];
                const column = contentInfo.content.columns.find((col) => col.id === this.input.id);
                const filter = {
                    column,
                    id: `external-filter-${column.id}`,
                    order: 1,
                    search: this.rangeValue,
                    type: 'BETWEEN',
                    remote: true,
                };
                this.$store.commit(`${this.state}/ACTIVE_FILTERS`, filter);
                this.$store.commit(`${this.state}/SELECTOR_REMOTE_FILTER`, filter);
            }
        },
    },
};
</script>

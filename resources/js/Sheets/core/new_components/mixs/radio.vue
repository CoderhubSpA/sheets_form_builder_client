<script>
export default {
    props: {
        input: {
            type: Object
        },
        value: {
            required: true
        },
        state: {
            type: String,
            required: true,
        }
    },
    data: () => ({
        pickedModel: null,
    }),
    computed: {
        options() {
            let contentInfo = this.$store.getters[`${this.state}/content_info`];
            if (!contentInfo) {
                contentInfo = this.$store.getters["form/contentinfo"];
            }

            if (!!contentInfo) {
                const entities =
                    contentInfo.content.entities_fk[this.input.entity_type_fk];

                if (entities)
                    return entities.map(e => {
                        return { id: e.id, name: e.name };
                    });
                else {
                    let opt = JSON.parse(this.input.options);

                    let options = [];

                    Object.keys(opt).forEach(key => {
                        options.push({ id: key, name: opt[key] });
                    });

                    return options;
                }
            }
            return [];
        },
        picked() {
            const fields = this.$store.getters[`${this.state}/fields`];
            if (fields && fields.length > 0) {
                const val = fields.filter(
                    f => Object.keys(f)[0] === this.id
                )[0];
                if (val !== null && val !== undefined) {
                    return val[this.id];
                }
            }
            return null;
        },
        clear() {
            return this.$store.getters[`${this.state}/clearfields`];
        }
    },
    watch: {
        picked(val) {
            if (val !== null) {
                this.pickedModel = val;
            }
        },
        pickedModel(val) {
            if (val !== null) {
                let pickedValue = {};
                pickedValue[this.input.id] = val;
                this.$emit(
                    "poll-entry",
                    val,
                    this.input.id,
                    this.input.col_name
                );
                this.$emit("input", pickedValue);
            }
        },
        clear(val) {
            const recordId = this.$store.getters[`${this.state}/record_id`];
            if (val && !recordId) {
                this.pickedModel = null;
            }
        }
    }
};
</script>

<style></style>

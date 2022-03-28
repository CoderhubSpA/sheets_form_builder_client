<template>
    <div
        class="sheets-field-wrapper"
        :class="`sheets-field col-sm-${sm} col-md-${md} col-xl-${xl} ${hidden_class} ${visible_class}`"
    >
        <component
            :is="fieldInput"
            :input="field"
            v-model="data"
            @poll-entry="handlePollEntry($event, field.id, field.col_name)"
            @tooglefield="handleToogleField"
            disabled
            :state="state"
            :base_url="base_url"
        >
        </component>
        <div class="row" v-if="error_messages">
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
            type: Object,
        },
        value: {
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        base_url: {
            type: String,
            default: '',
        },
        visible_class: {
            type: String,
            default: '',
        },
    },
    data: () => ({
        data: {},
        hidden_class: 'visible-field',
    }),
    computed: {
        fieldInput() {
            const chars = { '[': '-', ']': '' };
            const format = this.field.format.toLowerCase().replace(/\[|\]/g, (m) => chars[m]);
            // if (format === 'selector-multiple-advanced') {
            //     return () => import(`./inputs/text`);
            // }
            return () => import(`./inputs/${format}`);
        },
        xl() {
            return this.field.col_xl || 12;
        },
        sm() {
            return this.field.col_sm || 12;
        },
        md() {
            return this.field.col_md || 12;
        },
        error_messages() {
            const errors = this.$store.getters[`${this.state}/errors_fields`];
            let result = '';
            if (errors) {
                result = errors[this.field.id];
            }
            return result;
        },
        clear() {
            return this.$store.getters[`${this.state}/clearfields`];
        },
    },
    watch: {
        data() {
            if (this.error_messages) {
                this.$store.commit(`${this.state}/CLEAR_ERROR_FIELD`, this.field.id);
            }
            this.$emit('input', this.data);
        },
        clear(val) {
            if (val) {
                this.data = {};
            }
        },
    },
    methods: {
        handlePollEntry(val, id, colName) {
            this.$emit('sheets-input-change', val, id, colName);
        },
        handleToogleField(show) {
            if (show) {
                this.hidden_class = 'visible-field';
            } else {
                this.hidden_class = 'not-visible-field';
            }
        },
    },
};
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
.sheet-field-info-link {
    font-size: 10px;
    padding: 5px;
}
.tooltip-custom {
    position: relative;
    display: inline-block;
    cursor: pointer;
}
.tooltip-custom img {
    width: 20px;
}

.tooltip-custom .tooltiptext {
    visibility: hidden;
    width: 250px;
    background-color: white;
    border: 1px solid black;
    color: black;
    text-align: center;
    border-radius: 6px;
    padding: 3px;
    position: absolute;
    width: 120px;
    top: 100%;
    left: 50%;
    z-index: 180;
}

.tooltip-custom:hover .tooltiptext {
    visibility: visible;
}

.not-visible-field,
.hidden-config-field {
    display: none;
    max-width: 0;
    overflow: hidden;
    padding: 0;
    margin: 0;
}
</style>

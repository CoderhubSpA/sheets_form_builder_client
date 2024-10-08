<template>
    <div
        class="sheets-field-wrapper"
        :class="`sheets-field col-sm-${sm} col-md-${md} col-xl-${xl} ${hidden_class} ${visible_class}`"
    >
        <component
            v-model="data"
            :is="fieldInput"
            :input="field"
            :state="state"
            :base_url="base_url"
            @tooglefield="handleToogleField"
            @poll-entry="handlePollEntry($event, field.id, field.col_name)"
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
            return () => import(`./inputs/${format}`).then((module) => module.default).catch(() => {
                return import(`./inputs/text`)
            });
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
            if(val) {
                this.data[this.field.id] = null;
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

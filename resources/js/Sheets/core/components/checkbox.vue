<template>
    <div class="form-check">
        <input
            type="checkbox"
            :name="name"
            :id="id"
            class="form-check-input"
            :value="inputValue"
            :disabled="disabled"
            :checked="inputChecked"
            :indeterminate.prop="indeterminate"
            @change="onChange"
        />
        <label class="form-check-label">
            {{ label }} <span v-if="required" class="text-danger">*</span>
        </label>
    </div>
</template>

<script>
export default {
    name: "sheet-input-select",
    props: {
        label: {
            type: String,
            required: true
        },
        index: {
            type: Number
        },
        inputValue: {
            type: String
        },
        value: {
            type: Boolean,
            default: false
        },
        styles: {
            type: Array,
            default: () => []
        },
        id: {
            type: String,
            default: ""
        },
        name: {
            type: String,
            default: ""
        },
        disabled: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        indeterminate: true
    }),
    computed: {
        applyStyle() {
            return this.styles.join(" ");
        },
        inputChecked() {
            const allValues = Object.assign(
                {},
                this.$store.getters["form/fieldsvalues"]
            );
            if (allValues[this.id]) {
                this.indeterminate = false;
                return allValues[this.id] === 1 ? "checked" : null;
            } else {
                this.indeterminate = true;
                return null;
            }
        }
    },
    mounted: function() {
        if (!this.disabled) {
            this.indeterminate = true;
        }
        const allValues = Object.assign(
            {},
            this.$store.getters["form/fieldsvalues"]
        );
        if (allValues[this.id] !== undefined) {
            if(allValues[this.id] === 1){
              this.defaultValue(true);
            }else{
                this.defaultValue(false);
            }
        }else{
            this.indeterminate = true;
        }
    },
    methods: {
        defaultValue(value) {
            this.indeterminate = false;
            this.$emit("sheets-checkbox-change", this.id, value);
        },
        onChange(event) {
            this.indeterminate = false;
            this.$emit("sheets-checkbox-change", this.id, event.target.checked);
        }
    }
};
</script>

<style></style>

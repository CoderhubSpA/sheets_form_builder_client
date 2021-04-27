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
            @change="onChange"
        />
        <label class="form-check-label">
            {{ label }}
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
        }
    },
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
                return allValues[this.id] === 1 ? "checked" : null;
            } else {
                return null;
            }
        }
    },
    mounted: function() {
        if (!this.disabled) {
            this.defaultValue(false);
        }
        const allValues = Object.assign(
            {},
            this.$store.getters["form/fieldsvalues"]
        );
        if (allValues[this.id]) {
            if(allValues[this.id] === 1){
              this.defaultValue(true);
            }
        }
    },
    methods: {
        defaultValue(value) {
            this.$emit("sheets-checkbox-change", this.id, value);
        },
        onChange(event) {
            this.$emit("sheets-checkbox-change", this.id, event.target.checked);
        }
    }
};
</script>

<style></style>

<template>
    <input-group :character="'%'" :required="required" :label="label">
        <input
            type="number"
            class="form-control"
            aria-label="Username"
            aria-describedby="basic-addon1"
            :value="inputValue"
            @input="onInput"
            @paste="onPaste"
        />
    </input-group>
</template>

<script>
import mix from '../mixs/input.vue';
import InputGroup from '../templates/input-group.vue';

export default {
    mixins: [mix],
    components: {
        'input-group': InputGroup,
    },
    computed: {
        inputValue() {
            const fields = this.$store.getters[`${this.state}/fields`];

            if (fields && fields.length > 0) {
                const val = fields.filter((f) => Object.keys(f)[0] === this.id)[0];
                if (val) {
                    this.$emit('input', val);
                    const dataToSelectorFilters = {
                        key: this.input.col_name,
                        value: (val[this.id] * 100).toString(),
                    };
                    this.$store.commit(`${this.state}/SELECTORFILTERS`, dataToSelectorFilters);
                    return val[this.id] * 100;
                }
            }
            return this.value ? parseFloat(this.value[this.id]) * 100 : '';
        },
    },
    methods: {
        onInput(e) {
            const data = {};
            data[this.id] = parseFloat(e.target.value) / 100;
            const dataToSelectorFilters = {
                key: this.input.col_name,
                value: data[this.id].toString(),
            };
            this.$store.commit(`${this.state}/SELECTORFILTERS`, dataToSelectorFilters);
            this.$emit('input', data);
        },
    },
};
</script>

<style></style>

<template>
    <form-group
        :id="id"
        :label="label"
        :required="required"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"
        v-if="show_field"
    >
        <input
            type="text"
            maxlength="250"
            class="form-control"
            :id="id"
            :value="rutValue"
            :placeholder="defaultValue"
            :disabled="disabled"
            @input="onInput"
        />
    </form-group>
</template>

<script>
import mix from '../mixs/input.vue';
import FormGroup from '../templates/form-group.vue';

export default {
    mixins: [mix],
    components: {
        'form-group': FormGroup,
    },
    computed: {
        rutValue() {
            if (this.inputValue) {
                const rutValue = this.inputValue.replace(/^0+/, '');

                if (rutValue !== '' && rutValue.length > 1) {
                    const withoutPoint = rutValue.replace(/\./g, '');
                    const rutValueClean = withoutPoint.replace(/-/g, '');
                    const start = rutValueClean.substring(0, rutValueClean.length - 1);
                    let rutPoints = '';
                    let iIndex = 0;
                    let jIndex = 1;

                    for (iIndex = start.length - 1; iIndex >= 0; iIndex--) {
                        const letter = start.charAt(iIndex);

                        rutPoints = letter + rutPoints;

                        if (jIndex % 3 === 0 && jIndex <= start.length - 1) {
                            rutPoints = `.${rutPoints}`;
                        }

                        jIndex++;
                    }

                    const dv = rutValueClean.substring(rutValueClean.length - 1);

                    rutPoints = `${rutPoints}-${dv}`;

                    return rutPoints;
                }

                const dataToSelectorFilters = {
                    key: this.input.col_name,
                    value: rutValue,
                };

                this.$store.commit(`${this.state}/SELECTORFILTERS`, dataToSelectorFilters);

                return rutValue;
            }
        },
    },
};
</script>

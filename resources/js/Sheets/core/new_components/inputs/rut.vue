<template>
    <form-group
        :id="id"
        :label="label"
        :required="required"
        :linkTarget="this.input.link_url"
        :linkDescription="this.input.link_name"
        :tooltipInfo="this.input.description"
        v-if="show_field"
    >
        <input
            type="text"
            :id="id"
            :value="inputValue"
            :placeholder="this.input.default_value"
            @input="onInput"
            class="form-control"
            maxlength="250"
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
        // eslint-disable-next-line vue/return-in-computed-property, consistent-return
        inputValue() {
            if (this.value[this.id]) {
                const actual = this.value[this.id].replace(/^0+/, '');
                if (actual !== '' && actual.length > 1) {
                    const sinPuntos = actual.replace(/\./g, '');
                    const actualLimpio = sinPuntos.replace(/-/g, '');
                    const inicio = actualLimpio.substring(0, actualLimpio.length - 1);
                    let rutPuntos = '';
                    let i = 0;
                    let j = 1;
                    // eslint-disable-next-line no-plusplus
                    for (i = inicio.length - 1; i >= 0; i--) {
                        const letra = inicio.charAt(i);
                        rutPuntos = letra + rutPuntos;
                        if (j % 3 === 0 && j <= inicio.length - 1) {
                            rutPuntos = `.${rutPuntos}`;
                        }
                        // eslint-disable-next-line no-plusplus
                        j++;
                    }
                    const dv = actualLimpio.substring(actualLimpio.length - 1);
                    rutPuntos = `${rutPuntos}-${dv}`;
                    return rutPuntos;
                }
                const dataToSelectorFilters = {
                    key: this.input.col_name,
                    value: actual,
                };
                this.$store.commit(`${this.state}/SELECTORFILTERS`, dataToSelectorFilters);
                return actual;
            }
        },
    },
};
</script>

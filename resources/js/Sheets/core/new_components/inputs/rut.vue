<template>
    <form-group
        v-if="show_field"
        :id="id"
        :label="label"
        :required="required"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"
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
    data: () => ({
        error_message: '',
    }),
    computed: {
        rutValue() {
            if (this.inputValue) {
                if (!this.validateRUT(this.inputValue)) {
                    this.$store.commit(
                        `${this.state}/ERRORS_FIELD`,
                        {
                            key: this.id,
                            value: `El campo ${this.label} no es válido`,
                        }
                    );

                    let rutValue = this.inputValue.replace(".", "");

                    return rutValue;
                }

                this.$store.commit(
                    `${this.state}/ERRORS_FIELD`,
                    {
                        key: this.id,
                        value: '',
                    }
                );

                return this.formatRut(this.inputValue);
            }
        }
    },
    methods: {
        validateRUT(rut) {
            // Check if the rut has the correct format, if not, return false
            if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) {
                return false;
            }

            // Replace ‐ with -
            rut = rut.replace("‐","-");
            // Check again if the rut has the correct format, if not, return false
            if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)){
                return false;
            }

            // Split rut and check if the last character is valid
            let completeRut = rut.split('-');
            let rutFirstPart = completeRut[0];
            let rutSecondPart = completeRut[1];

            if(rutSecondPart == 'K') rutSecondPart = 'k' ;

            // Calculate the validateLast character
            let M=0;
            let S=1;
            for(;rutFirstPart;rutFirstPart=Math.floor(rutFirstPart/10))
                S=(S+rutFirstPart%10*(9-M++%6))%11;
            
            let validateLast = S?S-1:'k';

            // Check if the last character is correct and return the result
            return (validateLast == rutSecondPart);
        },
        formatRut(rut){
            const rutValue = rut.replace(/^0+/, '');

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
    }
};
</script>

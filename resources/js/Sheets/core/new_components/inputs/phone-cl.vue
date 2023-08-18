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
            class="form-control"
            :id="id"
            :value="phoneValue"
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
        test: '',
    }),
    computed: {
        phoneValue() {
            if(this.inputValue) {
                if(!this.validatePhone(this.inputValue)) {
                    this.$store.commit(
                        `${this.state}/ERRORS_FIELD`,
                        {
                            key: this.id,
                            value: `El campo ${this.label} no es válido`,
                        }
                    );

                    return this.inputValue;
                }

                this.$store.commit(
                    `${this.state}/ERRORS_FIELD`,
                    {
                        key: this.id,
                        value: '',
                    }
                );

                return this.inputValue;
            }
        },
    },
    methods: {
        validatePhone(phone) {
            const regex = /^[0-9]{9,}$/;

            return regex.test(phone);
        }
    }
};
</script>

<style></style>

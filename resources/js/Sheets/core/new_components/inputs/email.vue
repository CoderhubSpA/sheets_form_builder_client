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
            type="email"
            maxlength="250"
            class="form-control"
            autocomplete="new-password"
            :id="id"
            :value="emailValue"
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
        emailValue() {
            if(this.inputValue) {
                if(!this.validateEmail(this.inputValue)) {
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
        validateEmail(email) {
            const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

            return regex.test(email);
        }
    }
};
</script>

<style></style>

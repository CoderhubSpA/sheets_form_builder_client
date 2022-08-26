<template>
    <form-group :id="id" :label="label" :required="required">
        <v-select
            label="name"
            :id="id"
            :options="options"
            v-model="selected"
            :searchable="true">
        </v-select>
        <div v-if="options.length === 0">
            <b>Esta lista está vacía</b>
        </div>
    </form-group>
</template>

<script>
import mix from '../mixs/input.vue'
import FormGroup from '../templates/form-group.vue'
export default {
    mixins: [mix],
    components: {
        'form-group': FormGroup
    },
    data: () => ({
        selected: null,
    }),
    computed: {
        options() {
            const options = [];

            if (this.input.options) {
                Object.keys(this.input.options).map(key => {
                    const option = {
                        id: key,
                        name: this.input.options[key]
                    }
                    options.push(option);

                    return key;
                })
            }
            return options;
            /* return Object.keys(this.input.options).map(key => {
                return {
                    id: key,
                    name: this.input.options[key]
                }
            }) */
        }
    },
    watch: {
        selected(val) {
            if (!!val) {
                let data = {}
                data[this.id] = val.id
                this.$emit('input', data)
            }
        }
    }
}
</script>

<style>

</style>

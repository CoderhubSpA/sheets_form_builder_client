<template>
    <form-group :id="id" :label="label" :required="required" :classes="['response-field']">
        <v-select
            label="name"
            :id="id"
            :options="options"
            v-model="selected">
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
        selected: null
    }),
    computed: {
        options() {
            let questionsId = this.$store.getters['formBuilder/history'].map(h => {
                return h.question_id
            })
            questionsId.push(this.input.id)

            
            const formProducts = this.$store.getters['formBuilder/content_info'].content.entities_fk.form_products

            let options  = []
            formProducts.map(fp => {

                if (questionsId.includes(fp.id)) {
                    const position = options.map(o => o.id).indexOf(fp.id)
                    console.log(position)
                    if (position === -1) {
                        options.push({
                            id: item.id,
                            name: item.name
                        })
                    }
                }
            })
            return options
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
.response-field .vs__selected-options {
    flex-direction: column;
}
.response-field .vs__deselect,
.response-field .vs__actions,
.response-field .vs__search {
    display: none;
}
.response-field .vs__selected {
    border: none;
}
</style>

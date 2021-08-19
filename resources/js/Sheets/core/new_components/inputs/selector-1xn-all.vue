<template>
    <form-group :id="id" :label="label" :required="required">
        <v-select
            label="name"
            :id="id"
            :options="options"
            :disabled="disabled"
            :multiple="multiple"
            v-model="selected"
            :filterable="filterable">
        </v-select>
    </form-group>
</template>

<script>
import mix from '../mixs/input.vue'
import mixSelector from '../mixs/selector.vue'
import FormGroup from '../templates/form-group.vue'
export default {
    mixins:[mix, mixSelector],
    components: {
        'form-group': FormGroup
    }
}
</script>

<style>

</style>

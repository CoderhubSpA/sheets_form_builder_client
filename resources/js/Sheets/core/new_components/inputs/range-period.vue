<template>
    <form-group
        :id="id"
        :label="label"
        :required="required"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"
        v-if="show_field"
        :classes="errorInput ? ['field-error'] : []"
    >
        <div class="row">
            <div class="col-6">
                <vue-monthly-picker
                    :selectedBackgroundColor="errorInput ? 'red' : ''"
                    :id="`${id}-start`"
                    placeHolder="Valor inicial"
                    v-model="dateStart"
                    @selected="selectedStart"
                >
                </vue-monthly-picker>
            </div>
            <div class="col-6">
                <vue-monthly-picker
                    :selectedBackgroundColor="errorInput ? 'red' : ''"
                    :id="`${id}-end`"
                    placeHolder="Valor final"
                    v-model="dateEnd"
                    @selected="selectedEnd"
                >
                </vue-monthly-picker>
            </div>
        </div>
        <div v-if="errorInput" class="row mt-3">
            <div class="col text-center">
                <p class="text-danger">El valor final debe ser superior al valor inicial</p>
            </div>
        </div>
    </form-group>
</template>

<script>
import VueMonthlyPicker from 'vue-monthly-picker';
import FormGroup from '../templates/form-group.vue';
import mix from '../mixs/range.vue';
import mixInput from '../mixs/input.vue';
export default {
    mixins: [mixInput,mix],
    components: {
        'form-group': FormGroup,
        VueMonthlyPicker,
    },
};
</script>

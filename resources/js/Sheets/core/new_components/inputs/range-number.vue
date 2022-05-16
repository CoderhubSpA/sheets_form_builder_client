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
        <div class="row">
            <div class="col-6">
                <input
                    type="number"
                    :id="`${id}-start`"
                    class="form-control"
                    :class="errorInput ? 'is-invalid' : ''"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    placeholder="Valor inicial"
                    :value="rangeValue.start"
                    @input="onInputStart"
                />
            </div>
            <div class="col-6">
                <input
                    type="number"
                    :id="`${id}-end`"
                    class="form-control"
                    :class="errorInput ? 'is-invalid' : ''"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    placeholder="Valor final"
                    :value="rangeValue.end"
                    @input="onInputEnd"
                />
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
import FormGroup from '../templates/form-group.vue';
import mix from '../mixs/range.vue';
import mixInput from '../mixs/input.vue';
export default {
    mixins: [mixInput, mix],
    components: {
        'form-group': FormGroup,
    },
};
</script>

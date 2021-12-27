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
        <div class="custom-control custom-radio" v-for="(option, key) in options" :key="key">
            <input
                type="radio"
                :id="`${input.col_name}-${option.id}`"
                :name="input.col_name"
                :value="option.id"
                v-model="pickedModel"
                :disabled="disabled"
                :checked="pickedModel === option.id"
                class="custom-control-input"
            />
            <label class="custom-control-label" :for="`${input.col_name}-${option.id}`">{{
                option.name
            }}</label>
        </div>
        <div class="row" v-if="this.input.default_value !== null">
            <div class="col">
                <p class="input-placeholder">Por defecto: {{ defaultOption }}</p>
            </div>
        </div>
    </form-group>
</template>

<script>
import mix from '../mixs/input.vue';
import mixRadio from '../mixs/radio.vue';
import FormGroup from '../templates/form-group.vue';

export default {
    mixins: [mix, mixRadio],
    components: {
        'form-group': FormGroup,
    },
};
</script>

<style></style>

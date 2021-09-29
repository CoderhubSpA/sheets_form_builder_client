<template>
    <div class="form-group">
        {{ $attrs.field.label }}
        <span v-if="$attrs.field.requerido" class="text-danger">*</span>
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1"> </> </span>
            </div>
            <input
                type="text"
                :class="applyStyle()"
                :placeholder="$attrs.field.placeholder"
                :aria-label="$attrs.field.name"
                :aria-describedby="$attrs.field.name"
                :disabled="$attrs.field.disabled"
                step="0.01"
                :required="$attrs.field.requerido"
                v-on:input="
                    $emit('input-change', $event.target.value, $attrs.field.id)
                "
            />
        </div>
    </div>
</template>

<script>
/**
 * @author Jorge Peraza
 * @version 0.0.1
 */
export default {
    name: "sheet-input-url",
    props: {},
    data: () => ({}),
    computed: {},
    methods: {
        applyStyle() {
            return this.$attrs.field.styles.join(" ");
        }
    }
};
</script>

<style></style>

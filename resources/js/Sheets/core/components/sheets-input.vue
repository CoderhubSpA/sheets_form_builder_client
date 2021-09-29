<template>
  <div class="form-group">
      <label for="name">
          {{ label }} <span v-if="required" class="text-danger">*</span>
      </label>
      <input
        :type="sheetsType"
        :class="applyStyle"
        :id="id"
        :name="name"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :disabled="disabled"
        v-on:input="$emit('input', $event.target.value)">
  </div>
</template>

<script>
/**
 * @author Jorge Peraza
 * @version 0.0.1
 */
import refactor from '../mixins/inputs'
export default {
    name: 'sheet-input',
    mixins: [refactor],
    props: {
        /**
         * Para casos como checkbox o radio
         */
        inputValue: {
            type: [String, Boolean],
            default: ''
        }
    },
    computed: {
        sheetsType() {
            switch (this.type) {
                case 'TEXT':
                    return 'text'
                case 'NUMBER':
                case 'CLP':
                case 'PERCENT':
                    return 'number'
                case 'PASSWORD':
                    return 'password'
                case 'DATE':
                    return 'date'
                case 'DATETIME':
                    return 'datetime-local'
                case 'SiNo':
                    return 'checkbox'
                default:
                    return 'text'
            }
        }
    }
}
</script>

<style>

</style>

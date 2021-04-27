<template>
    <div>
        <div>
            <label>
                {{ label }} <span class="text-danger" v-if="required">*</span>
            </label>
            <div class="sheet-select" :tabindex="tabindex" @blur="onBlur" @focus="onFocus" :class="{active: focus }">
                <div class="selected-region" @click="open = !open">
                    <div v-if="selected">
                        <div class="item-selected" :class="{open: open}" @click="clickOnSelected" >
                            {{ selected.name }}
                        </div>
                    </div>

                </div>

                <div class="sheet-select-items" :class="{selectHide: !open}">
                    <div class="sheet-select-item" v-for="(option, i) of options" :key="i" @click="selectOption(option)">
                        {{ option.name }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import selectMixin from '../mixins/select'
export default {
    mixins: [selectMixin],
    name: 'sheets-select',
    props: {
        tabindex:{
            type: Number,
            required: false,
            default: 0
        }
    },
    data: () => ({
        open: false
    }),
    mounted(){
        this.$emit('input', this.selected.id);
    },
    methods: {

    }
};
</script>

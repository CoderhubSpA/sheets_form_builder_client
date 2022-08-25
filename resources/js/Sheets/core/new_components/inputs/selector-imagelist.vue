<template>
    <form-group
        :id="id"
        :label="label"
        :required="required"
        :linkTarget="link_target"
        :linkDescription="link_description"
        :tooltipInfo="tooltip"
    >
        <div class="container-fluid sheets-select-image">
            <div class="row">
                <div class="col-md-12 p-0">
                    <div v-if="availableOptions.length > 0" class="container-options">
                        <div class="container-option">
                            <div
                                v-for="option in availableOptions"
                                :key="option.id"
                                :class="[
                                    { selected: option.selected },
                                    { readonly: option.readOnly },
                                    'options',
                                ]"
                            >
                            <input type="hidden" :value="option" />
                                <div class="wrapper-option">
                                    <div class="wrapper-option-btn">
                                        <button
                                            v-if="!option.readOnly"
                                            v-on:click="optionSelect(option)"
                                            class="option-select"
                                        ></button>
                                    </div>
                                </div>
                                <div class="selected-indicator">
                                    <i
                                        class="bi bi-dash-circle-fill"
                                        :class="[
                                            { indicator: !option.selected },
                                            'bi bi-dash-circle-fill',
                                        ]"
                                    ></i>
                                </div>
                                <div v-if="option.image" class="container-option-image">
                                    <img
                                        width="32"
                                        height="38"
                                        :src="option.image"
                                        alt="image-coderhub.png"
                                        class="option-image"
                                    />
                                </div>
                                <div v-if="!option.image && option.icon" class="container-option-icon">
                                    <i :class="option.icon"></i>
                                </div>
                                <div :class="[{ noimage: !option.image && !option.icon }, 'container-option-name']">
                                    <p>
                                        {{ option.name }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="container-option-actions">
                            <div>
                                <button
                                    v-on:click="optionAllSelect()"
                                    :class="[{ selectedAll: selectedAll }, 'actions']"
                                >
                                    <i class="bi bi-check2-all"></i>
                                </button>
                            </div>
                            <div>
                                <button v-on:click="optionSelectedAllRemove()" class="actions">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form-group>
</template>

<script>
import mix from '../mixs/input.vue';
import mixSelector from '../mixs/selector2.vue';
import FormGroup from '../templates/form-group.vue';

export default {
    mixins: [mix, mixSelector],
    components: {
        'form-group': FormGroup,
    },
    data: () => ({
        availableOptions: [],
        selectedOptions: [],
        selectedAll: false,
    }),
    mounted() {
        this.selected = [];
    },
    watch: {
        options(val) {
            this.availableOptions = val;
        }
    },
    methods: {
        optionSelect(option) {
            this.availableOptions.map((opt) => {
                return opt.id === option.id
                    ? opt.selected === false
                        ? (opt.selected = true)
                        : (opt.selected = false)
                    : opt;
            });

            const ifOptionExist = this.selected.find((select) => select.id === option.id);

            if (ifOptionExist) {
                this.selected = this.selected.filter(
                    (select) => select.id !== option.id
                );

                this.selectedAll = false;
            } else {
                this.selected.push(option);
            }

            const ifOptionsAll = this.availableOptions.filter((opt) => opt.readOnly !== true);

            if (ifOptionsAll.length === this.selected.length) {
                this.selectedAll = true;
            }
        },
        optionAllSelect() {
            this.availableOptions.map((option) => {
                return !option.readOnly ? (option.selected = true) : option;
            });

            this.selected = this.availableOptions.filter((option) => option.readOnly !== true);

            this.selectedAll = true;
        },
        optionSelectedAllRemove() {
            this.availableOptions.map((option) => {
                return (option.selected = false);
            });

            this.selected = [];

            this.selectedAll = false;
        },
    },
};
</script>

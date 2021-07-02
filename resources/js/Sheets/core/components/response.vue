<template>
    <div>
        <label>
            {{ label }} <span v-if="required" class="question-required">*</span>
        </label>
        <ul class="list-group">
            <li class="list-group-item pl-4" v-for="(option, key) in options" :key="key">
                <label>
                    <input class="form-check-input" type="checkbox" :value="option.id" v-model="products.responses">
                    {{ option.form_field_id }}
                </label>
            </li>
        </ul>
    </div>
</template>

<script>
import abstract from "../mixins/mix";
export default {
    mixins: [abstract],
    props: {
        value: {
            type: Array
        }
    },
    data: () => ({
        products: {
            responses: []
        }
    }),
    watch: {
        products: {
            handler() {
                this.$emit('input', this.products.responses)
            },
            deep: true
        },
    },
    computed: {
        options() {
            return [

              {
                id: '3d791e42-edc0-47dc-8d34-8706e8cc5a49',
                form_field_id: '89b8c8ad-86e8-4f9a-93c1-652c79392beb',
                entity_type: '4eacea93-cd4f-11eb-9446-bc5ff45967fd',
                entity_id: 'b7aa9fd1-ce86-4e5c-b6c3-99f20dc94cea',
                ammount: 1
              },
              {
                id: 'f581a3c8-f4c4-4651-8f75-115ada541d18',
                form_field_id: '89b8c8ad-86e8-4f9a-93c1-652c79392beb',
                entity_type: '4eacea93-cd4f-11eb-9446-bc5ff45967fd',
                entity_id: '5faad8cd-7323-42f5-98f0-e3dd180d30c2',
                ammount: 1
              },
              {
                id: 'd1c9a2e0-4694-4fd8-ac6b-4160870e917d',
                form_field_id: '89b8c8ad-86e8-4f9a-93c1-652c79392beb',
                entity_type: '4eace88d-cd4f-11eb-9446-bc5ff45967fd',
                entity_id: 'fbfb3ad7-9148-48b0-b455-f88c8e551ce3',
                ammount: 1
              },
              {
                id: 'ec94c9cb-8d39-4f40-b77b-beeafd048cbe',
                form_field_id: '9d9b93a7-f061-49df-88f5-55ecc2825dca',
                entity_type: '4ea876ef-cd4f-11eb-9446-bc5ff45967fd',
                entity_id: '22c98bcd-a5f4-42e0-985f-b65271da60d5',
                ammount: 1
              },
            {
                id: '1fb00563-ba35-4182-85b5-691b822ee1a0',
                form_field_id: '9d9b93a7-f061-49df-88f5-55ecc2825dca',
                entity_type: '4eacea93-cd4f-11eb-9446-bc5ff45967fd',
                entity_id: 'b7aa9fd1-ce86-4e5c-b6c3-99f20dc94cea',
                ammount: 1
              },
              {
                id: '3961d237-c2f4-49e5-a1e7-bb83c3366208',
                form_field_id: '08d525a0-10e0-4bbd-8b11-ab23319b36d2',
                entity_type: '4ea876ef-cd4f-11eb-9446-bc5ff45967fd',
                entity_id: '22c98bcd-a5f4-42e0-985f-b65271da60d5',
                ammount: 1
              },
              {
                id: '5c43e052-0166-4792-980f-58c9009ddd5a',
                form_field_id: '06bf4dd1-7e66-402f-be33-841076e42aed',
                entity_type: '4eacea93-cd4f-11eb-9446-bc5ff45967fd',
                entity_id: '5faad8cd-7323-42f5-98f0-e3dd180d30c2',
                ammount: 1
              },
              {
                id: '367936b8-726b-4b11-bfa5-bc5333d55c9a',
                form_field_id: 'd50b03f8-36f4-47a2-8671-920e0b6da3ab',
                entity_type: '4eace88d-cd4f-11eb-9446-bc5ff45967fd',
                entity_id: 'eddc0215-299a-4638-9dce-a6ba71d72856',
                ammount: 1
              },
              {
                id: '34cba182-0a29-45d1-99bc-7e6dc40c8bc3',
                form_field_id: 'ded534b5-5443-4b02-be90-0842b4e7f99b',
                entity_type: '4eace88d-cd4f-11eb-9446-bc5ff45967fd',
                entity_id: 'fbfb3ad7-9148-48b0-b455-f88c8e551ce3',
                ammount: 1
              }
            ]
        }
    }

}
</script>

<style>

</style>

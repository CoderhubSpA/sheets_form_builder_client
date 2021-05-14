<template>
    <div class="row">
        {{ $store.getters['poll/active_section'] }}

        <h4>
            {{ title }}
        </h4>
        <poll-section v-for="(section, key) in row.sections"
            :key="key"
            :section="section"
            :default_active_section="row.sections[0].id">
        </poll-section>
    </div>
</template>

<script>
/**
 * @author Jorge Peraza
 */
import section from './section'
export default {
    components: {
        'poll-section': section
    },
    props: {
        row: {
            type: Object,
            default: () => {},
            require: true
        }
    },
    computed: {
        title() {
            return this.row.name
        }
    }
}
</script>

<style>

</style>

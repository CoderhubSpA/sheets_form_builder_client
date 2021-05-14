<template>
    <div>
        <h3>
            {{ title }}
        </h3>
        <poll-row v-for="(element, index) in rows" :key="index" :row="element"></poll-row>
    </div>
</template>

<script>
/**
 * @author Jorge Peraza
 */
import PollRow from './row'
export default {
    components: {
        'poll-row': PollRow
    },
    props: {
        id: {
            type: String,
            require: true
        }
    },
    data: () => ({
        rows: []
    }),
    computed: {
        title() {
            return this.$store.getters['poll/title']
        }
    },
    mounted() {
       this.$store.dispatch('poll/getPoll', this.id)
       .then(response => {
           this.rows = response
       })
    }
}
</script>

<style>

</style>

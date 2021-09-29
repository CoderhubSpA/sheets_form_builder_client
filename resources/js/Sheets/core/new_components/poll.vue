<template>
<div>
    <div class="sheets-poll">
        <sheets-history></sheets-history>
        <div class="row">
            <sheets-section
                :section="active_section"
                v-model="poll"
                @next-section="next_section"
                @prev-section="prev_section"/>
        </div>

    </div>
    <div class="row">
        <div class="col">
            <code>
                <pre>
                    {{ poll }}
                </pre>
            </code>
        </div>
        <div class="col">
            <code>
                <pre>
                    {{ result }}
                </pre>
            </code>
        </div>
    </div>

</div>

</template>

<script>
import History from '../new_components/utils/history.vue'
import section from '../new_components/grid/poll-section.vue'
export default {
    components: {
        'sheets-section': section,
        'sheets-history': History
    },
    props: {
        entityId: {
            type: String,
            require: true
        }
    },
    data: () => ({
        poll: [],
        result: []
    }),
    watch: {
        active_section() {
            this.poll.map(r => {
                this.result.push(r)
            })
            this.poll = []
        }
    },
    computed: {
        active_section() {
            return this.$store.getters['formBuilder/poll_active_section']
        },
        sections() {
            return this.$store.getters['formBuilder/poll_sections']
        }
    },
    mounted() {
        this.$store.dispatch('formBuilder/get_poll', this.entityId)
        .then(poll => {

        })
    },
    methods: {
        prev_section() {
            const section = this.$store.getters['formBuilder/last_section']
            this.$store.commit('formBuilder/POLL_ACTIVE_SECTION', section)
            this.$store.commit('formBuilder/DELETE_LAST_HISTORY')
            this.result.pop()
        },
        next_section(obj) {
            let respuestas = obj.respuestas

            const first = respuestas.filter(r => !!r.next_section)[0]

            const section = this.$store.getters['formBuilder/poll_sections'].find(s => s.id === first.next_section)

            this.$store.commit('formBuilder/POLL_ACTIVE_SECTION', section)
        }
    }
}
</script>

<style lang="scss">
.sheets-poll {
    padding: 5px;
    border: 1px solid blue;
}
</style>

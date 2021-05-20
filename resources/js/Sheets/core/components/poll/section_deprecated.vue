<template>
    <div :class="`col col-${sm} col-${md} col-${xl} ${active}`">
        <h5>
            {{ title }}
        </h5>
        <poll-question v-for="(question, key) in section.fields"
            :key="key"
            :question="question">
        </poll-question>
    </div>
</template>

<script>
import question from './question'
export default {
    components: {
        'poll-question': question
    },
    props: {
        section: {
            type: Object,
            default: () => {},
            require: true
        },
        default_active_section: {
            type: String,
            default: '',
            require: false
        }
    },
    data: () => ({
        active_section: ''
    }),
    mounted() {
        if (this.default_active_section) {
            this.active_section = this.default_active_section
        }
    },
    computed: {
        title() {
            return this.section.name
        },
        sm() {
            return this.section.col_sm
        },
        md() {
            return this.section.col_md
        },
        xl() {
            return this.section.col_xl
        },
        active() {
            return this.active_section === this.section.id ? 'section_active' : 'section_inactive'
        },
    },
    methods: {

    }
}
</script>

<style>
.section_active {
    background-color: rgba(118, 165, 118, 0.856);
    padding: 10px;
    border: 2px solid red;
}
/* .section_inactive { */
    /* display: none; */
/* } */
</style>

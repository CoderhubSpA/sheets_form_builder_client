<template>
    <div :class="`col col-${sm} col-${md} col-${xl}`">
        <div v-html="info"></div>
        <br />
    </div>
</template>

<script>
/**
 * @author Jorge Peraza
 */
import abstract from "../../mixins/mix"
export default {
    mixins: [abstract],
    computed: {
        info() {
            return this.form.name;
        },
        sm() {
            return this.form.col_sm;
        },
        md() {
            return this.form.col_md;
        },
        xl() {
            return this.form.col_xl;
        },

    }
};
</script>

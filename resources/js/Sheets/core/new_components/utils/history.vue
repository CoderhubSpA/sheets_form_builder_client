<template>
    <div>
        <div class="history">
            <div class="title">
                <h5>
                    Historial de respuestas
                </h5>
            </div>
            <div class="row">
                <div class="col" v-if="hasItems">
                    <ul class="list-group list-group-flush" >
                        <li
                            v-for="(item, key) in items"
                            :key="key"
                            class="list-group-item history-item">
                            {{ key + 1 }}.- {{ item.question_label }} - <b>R:</b>
                            <span v-if="item.alternative">
                                {{ item.alternative.name }}
                            </span>
                            <span v-else>
                                {{ item.answer }}
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="col" v-else>
                    <span>
                        Historial vacio
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'history',
    computed: {
        items() {
            return this.$store.getters['formBuilder/history']
        },
        hasItems() {
            return this.items.length > 0
        }

    }
}
</script>

<style lang="scss">
.history {
    max-height: 300px;
    // background: #dddddd;
    // border: 1px solid #999999;
    overflow: hidden;
    border-radius: 5px;
    margin: 15px;
    padding: 20px;

    .titile {

    }
    .history-item {

    }
}
</style>

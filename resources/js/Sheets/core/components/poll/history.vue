<template>
    <div class="SheetsPollHistory__history">
        <div class="row SheetsPollHistory__history-title">
            <div class="col">
                <h5>Historial de Respuestas</h5>
            </div>
        </div>
        <div class="row SheetsPollHistory__history-content">
            <div class="col" v-if="items.length > 0">
                <ul class="list-group list-group-flush">
                    <li
                        v-for="(item, index) in items"
                        :key="index"
                        class="list-group-item SheetsPollHistory__history-item"
                    >
                        {{ index + 1 }}.- {{ item.questiondesc }} - <b>R:</b>
                        <span v-if="item.alternative === null">
                            {{ capitalizeFirstLetter(item.answer) }}
                        </span>
                        <span v-if="item.alternative !== null">
                            {{ capitalizeFirstLetter(item.alternative.name) }}
                        </span>
                    </li>
                </ul>
            </div>
            <div class="col" v-if="items.length === 0">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item SheetsPollHistory__history-item">
                        Historial vacío
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import global from "../global";
export default {
    components: {
        "sheet-input": global
    },
    props: {
        items: {
            type: Array,
            require: true,
            default: () => []
        }
    },
    data: () => ({
        processeditems: []
    }),
    computed: {},
    watch: {},
    methods: {
        capitalizeFirstLetter(string) {
            const stringCapitalized = `${string
                .charAt(0)
                .toUpperCase()}${string.slice(1)}`;
            return stringCapitalized;
        }
    }
};
</script>

<style lang="scss">
.SheetsPollHistory__history {
    /* max-height: 300px; */
    background: #dddddd;
    border: 1px solid #999999;
    overflow: hidden;
    border-radius: 5px;
    margin: 15px;
    padding: 20px;
}
.SheetsPollHistory__history-item {
    background-color: transparent;
}
</style>

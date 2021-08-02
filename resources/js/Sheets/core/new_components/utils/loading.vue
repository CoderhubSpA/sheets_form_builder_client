<template>
    <div v-if="status" class="loader-modal">
        <div class="spinner-grow loader-modal-spinner" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    </div>
</template>

<script>
/**
 * @author Jorge Peraza
 * @version 0.0.1
 */
export default {
    props: {
        /**
         * Estado para la visualizacion del componente
         * @values true, false
         * True => Muestra el component
         * False => Oculta el component
         */
        status: Boolean
    }

}
</script>

<style lang="scss">
.loader-modal {
    background-color: rgb(230, 230, 230);
    position:fixed;
    top:0;
    right:0;
    bottom:0;
    left:0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;

    .loader-modal-spinner {
        background-color:rgb(56, 75, 124);
        width: 6rem;
        height: 6rem;
        padding: 10px 20px;
        margin: 20% auto;
        position: relative;
    }
}
</style>

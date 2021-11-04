<template>
    <div>root</div>
</template>

<script>
export default {
    props: {
        id: {
            type: String,
            require: true,
        },
        record_id: {
            type: String,
            default: '',
        },
    },
};
</script>

<style></style>

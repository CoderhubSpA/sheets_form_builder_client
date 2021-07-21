<template>
    <form-group :id="id" :label="label">
        <input
            type="text"
            :id="id"
            :value="inputValue"
            @input="onInput"
            class="form-control">
    </form-group>
</template>

<script>
import mix from '../mixs/input.vue'
import FormGroup from '../templates/form-group.vue'
export default {
    mixins: [mix],
    components: {
        'form-group': FormGroup
    },
    computed: {
        inputValue() {
            if (!!this.value) {
                let actual = this.value[this.id].replace(/^0+/, "");
                if (actual != "" && actual.length > 1) {
                    let sinPuntos = actual.replace(/\./g, "");
                    let actualLimpio = sinPuntos.replace(/-/g, "");
                    let inicio = actualLimpio.substring(0, actualLimpio.length - 1);
                    let rutPuntos = "";
                    let i = 0;
                    let j = 1;
                    for (i = inicio.length - 1; i >= 0; i--) {
                        let letra = inicio.charAt(i);
                        rutPuntos = letra + rutPuntos;
                        if (j % 3 == 0 && j <= inicio.length - 1) {
                            rutPuntos = "." + rutPuntos;
                        }
                        j++;
                    }
                    let dv = actualLimpio.substring(actualLimpio.length - 1);
                    rutPuntos = rutPuntos + "-" + dv;
                    return rutPuntos;
                } else {
                    return actual;
                }
            }
        },
    }
}
</script>

<style>

</style>

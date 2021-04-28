# Sheets Form Builder Client

Component para formulario multiproposito, con integracion a Sheets

## Documentacion

### Instalacion

```bash
composer require package/name

npm i moment sass sass-loader vue-router vue-select vue2-datepicker vuex

```
### Configuracion
Realizar publicacion de los componentes y registro de rutas

```bash
    php artisan vendor:publish
```
Y seleccionar *package/name*

Incluir dentro del archivo .env
```env
SHEETS_API_URL="http://SHEETS_URL/api/"
SECURITY_BEARER=ACCESS_TOKEN
```
### Registro de componente
Dentro de **resources/js/app.js** agregar
```js
import SheetsFormBuilder from './vendor/testing_js/components/SheetsFormRender.vue'

import store from './vendor/testing_js/store'


import vuex from 'vuex'

Vue.use(vuex)
Vue.component("sheets-form-builder", SheetsFormBuilder);
const app = new Vue({
    el: '#app',
    store,
});
```
Ingresar en la vista requerida el componente

```html
    ...
    <sheets-form-builder formid="xxxx"></sheets-form-builder>
    ...
    <script src="{{ asset('js/app.js') }}"></script>
```

## Props

Propiedad | Tipo | Default | Descripcion|
----------|------|-|------|
formid| String | '' | ID del formulario a mostrar. Ejemplo: 3199dd24-f524-4605-b632-c88502771fba
recordid| String | '' | 

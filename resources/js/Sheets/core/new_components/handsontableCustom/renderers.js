import Handsontable from 'handsontable';
import Vue from 'vue';
import FormBuilder from '../../components/index.vue';
import GenericModal from '../utils/GenericModal';
import FormBuilderStore from '../../../../store/formBuilder';

export function clpRenderer(instance, td, row, col, prop, value, cellProperties) {
    const span = document.createElement('SPAN');
    if (value !== null && value !== undefined && value !== '' && typeof value !== 'string') {
        const renderValue = value.toFixed(0);
        span.innerHTML = `$ ${parseInt(renderValue, 10).toLocaleString()}`;
    } else {
        span.innerHTML = ``;
    }
    Handsontable.dom.empty(td);
    td.appendChild(span);
    td.classList.add('htCenter');
    td.classList.add('htMiddle');

    if (cellProperties.readOnly) {
        td.classList.add('htDimmed');
    }
    return td;
}

export function customSelectRenderer(instance, td, row, col, prop, value, cellProperties) {
    const span = document.createElement('SPAN');

    if (value !== null && value !== undefined && value !== '') {
        let options = (typeof cellProperties.selectOptions == "function") ? cellProperties.selectOptions() : cellProperties.selectOptions;

        const selected = options[value];

        span.innerHTML = `<div class="htAutocompleteArrow">&#9660;</div>${
            selected ? selected : ""
        }`;
    } else {
        span.innerHTML = `<div class="htAutocompleteArrow">&#9660;</div>`;
    }

    Handsontable.dom.empty(td);

    td.appendChild(span);
    td.classList.add('htCenter');
    td.classList.add('htMiddle');
    td.classList.add('custom-hot-oneclick-trigger');
    td.classList.add('custom-hot-select');

    if (cellProperties.readOnly) {
        td.classList.add('htDimmed');
    }

    if (cellProperties.isRequired && (value === '' || value === null || value === undefined)) {
        td.classList.add('htErrorWaiting');
    }

    return td;
}

export function customDateRenderer(instance, td, row, col, prop, value, cellProperties) {
    const span = document.createElement('SPAN');

    if (value !== null && value !== undefined && value !== '') {
        const date = value.split(' ');
        span.innerHTML = `<div class="htAutocompleteArrow">&#9660;</div>${date[0]}`;
    } else {
        span.innerHTML = `<div class="htAutocompleteArrow">&#9660;</div>`;
    }
    Handsontable.dom.empty(td);
    td.appendChild(span);
    td.classList.add('htCenter');
    td.classList.add('htMiddle');
    td.classList.add('afterHiddenColumn');
    td.classList.add('htAutocomplete');
    td.classList.add('custom-hot-oneclick-trigger');

    if (cellProperties.readOnly) {
        td.classList.add('htDimmed');
    }
    return td;
}

export function customMultiSelectRenderer(instance, td, row, col, prop, value, cellProperties) {
    const span = document.createElement('SPAN');
    const optionsList = cellProperties.selectOptions;
    const valuesSplit = `${value}`.split(';');
    const values = valuesSplit.map((string) => string.trim());
    // eslint-disable-next-line no-param-reassign
    value = [];
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < optionsList.length; index++) {
        if (values.indexOf(`${optionsList[index].value}`) > -1) {
            // eslint-disable-next-line no-unused-vars
            selectedId = optionsList[index].value;
            value.push(optionsList[index].label);
        }
    }
    if (value.length > 0) {
        span.innerHTML = `<div class="htAutocompleteArrow">&#9660;</div>${value.join(', ')}`;
    } else {
        span.innerHTML = `<div class="htAutocompleteArrow">&#9660;</div>`;
    }
    Handsontable.dom.empty(td);
    td.appendChild(span);
    td.classList.add('htCenter');
    td.classList.add('htMiddle');
    td.classList.add('custom-hot-oneclick-trigger');
    td.classList.add('custom-hot-select');
    if (cellProperties.readOnly) {
        td.classList.add('htDimmed');
    }
    if (cellProperties.isRequired && (value === '' || value === null || value === undefined)) {
        td.classList.add('htErrorWaiting');
    }
    return td;
}

export function customTextRenderer(instance, td, row, col, prop, value, cellProperties) {
    const span = document.createElement('SPAN');

    (value !== null && value !== undefined && value !== '') ? span.innerHTML = `${value}` : span.innerHTML = ``;

    Handsontable.dom.empty(td);

    td.appendChild(span);
    td.classList.add('htCenter');
    td.classList.add('htMiddle');

    if (cellProperties.readOnly) {
        td.classList.add('htDimmed');
    }

    if (cellProperties.isRequired && (value === "" || value === null || value === undefined)) {
        td.classList.add('htErrorWaiting');
    }

    return td;
}

function getEntityFk(entities_fk, entity_fk_id, id) {
    let entity = {};
    let entity_arr = entities_fk[entity_fk_id] || [];
    try {
        entity = entity_arr.filter((e) => e.id == id).shift();
    } catch (e) {
        console.warn(e);
    }

    return entity;
}

export function customRenderFormButton(instance, td, row, column, prop, value, cellProperties) {
    const main = cellProperties.main;
    const result = cellProperties.entityInfo.columns.find(c => c.col_name === main.col_name_fk)
    const col_id = !!result ? result.id : null;

    if (!col_id) {
        td.innerHTML = '???'
        td.height = 22;
        return ;
    }

    const entity_id = instance.getDataAtCell(row, col_id);
    const entities_fk = cellProperties.entityInfo.entities_fk;
    const entity_fk = cellProperties.main.entity_type_id;
    const entity = entities_fk.entity_type.find(e => e.id == entity_fk);

    if (entity) {
        Handsontable.dom.empty(td);

        const span = document.createElement('span')
        span.classList.add(['w-100','btn','btn-custom-white'])
        span.innerHTML = entity.name || '???';

        td.appendChild(span)
        td.classList.add('htCenter');
        td.classList.add('htMiddle');
        td.classList.add('custom-hot-oneclick-trigger');
        // td.classList.add('custom-hot-select');

        span.addEventListener('click', () => {
            const container = document.getElementById('modal-container')
            const divModal = document.createElement('div')
            divModal.id = `ref-${value}`
            container.appendChild(divModal);

            const form_id = value;
            const record_id = instance.getDataAtCell(row, col_id);

            const GenericModalClass = Vue.extend(GenericModal);
            const genericModal = new GenericModalClass({
                propsData: {
                    show: true,
                }
            });
            genericModal.$on('show', (val) => {
                if (!val) {
                    const el = document.getElementById(`ref-${value}`);
                    el.remove();
                }
            })
            const FormBuilderClass = Vue.extend(FormBuilder);

            const formBuilderInstance = new FormBuilderClass({
                propsData: {
                    id: form_id,
                    record_id: record_id
                },
                store: FormBuilderStore
            });
            formBuilderInstance.$mount();
            genericModal.$mount();
            genericModal.$refs.content.appendChild(formBuilderInstance.$el);
            divModal.appendChild(genericModal.$el)
        })
    }
    td.height = 22;
}



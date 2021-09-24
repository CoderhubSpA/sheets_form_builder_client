import Handsontable from 'handsontable';

export function clpRenderer(instance, td, row, col, prop, value, cellProperties) {
    const span = document.createElement('SPAN');
    if (value !== null && value !== undefined && value !== "") {
        let renderValue = value.toFixed(0);
        span.innerHTML = `$ ${parseInt(renderValue).toLocaleString()}`;
    } else {
        span.innerHTML = ``;
    }
    Handsontable.dom.empty(td);
    td.appendChild(span);
    td.classList.add('htCenter');
    td.classList.add('htMiddle');
    
    if(cellProperties.readOnly){
        td.classList.add('htDimmed');
    }
    return td;
}

export function customSelectRenderer(instance, td, row, col, prop, value, cellProperties) {
    const span = document.createElement('SPAN');
    if (value !== null && value !== undefined && value !== "") {
        let selected = cellProperties.selectOptions.find(opt => opt.value === value);
        span.innerHTML = `<div class="htAutocompleteArrow">&#9660;</div>${selected.label}`;
    } else {
        span.innerHTML = `<div class="htAutocompleteArrow">&#9660;</div>`;
    }
    Handsontable.dom.empty(td);
    td.appendChild(span);
    td.classList.add('htCenter');
    td.classList.add('htMiddle');
    td.classList.add('custom-hot-oneclick-trigger')
    td.classList.add('custom-hot-select')
    if(cellProperties.readOnly){
        td.classList.add('htDimmed');
    }
    return td;
}


export function customDateRenderer(instance, td, row, col, prop, value, cellProperties) {
    const span = document.createElement('SPAN');
    if (value !== null && value !== undefined && value !== "") {
        let date = value.split(' ');
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
    td.classList.add('custom-hot-oneclick-trigger')
    
    if(cellProperties.readOnly){
        td.classList.add('htDimmed');
    }
    return td;
}

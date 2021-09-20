import Handsontable from "handsontable";

export function clpRenderer(
    instance,
    td,
    row,
    col,
    prop,
    value,
    cellProperties
) {
    const span = document.createElement("SPAN");
    if(value !== null && value !== undefined){
        let renderValue = value.toFixed(0);
        span.innerHTML = `$ ${parseInt(renderValue).toLocaleString()}`;
    }else{
        span.innerHTML = ``;
    }
    Handsontable.dom.empty(td);
    td.appendChild(span);
    td.classList.add("htCenter");
    td.classList.add("htMiddle");
    return td;
}
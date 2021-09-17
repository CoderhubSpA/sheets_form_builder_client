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
    span.innerHTML = `${value.toFixed(2).replace(".", ",")} $`;
    Handsontable.dom.empty(td);
    td.appendChild(span);
    td.classList.add("htCenter");
    td.classList.add("htMiddle");
    return td;
}
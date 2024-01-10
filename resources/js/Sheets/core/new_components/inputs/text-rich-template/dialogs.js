class Dialogs {
    static tablepageconfig(multiselectorItem) {
        return {
            title: 'Insertar selector multiple',
            size: 'medium',
            body: {
                type: 'panel',
                items: [
                    {
                        type: 'label',
                        label: 'Seleccionar las columnas que aparecerán en el documento como tabla',
                        items: Object.entries(multiselectorItem.values.values).map(
                            ([id, values]) => {
                                return {
                                    type: 'grid',
                                    columns: 2,
                                    items: [
                                        {
                                            type: 'checkbox',
                                            name: id,
                                            label: values.name,
                                            enabled: false,
                                        },
                                        {
                                            type: 'input',
                                            name: id + 'orden',
                                            placeholder: 'Orden',
                                            inputMode: 'numeric',
                                        },
                                    ],
                                };
                            }
                        ),
                    },
                ],
            },
            buttons: [
                {
                    type: 'cancel',
                    text: 'Cancelar',
                },
                {
                    type: 'submit',
                    text: 'Insertar',
                    buttonType: 'primary',
                },
            ],
            onSubmit: (api) => {
                const data = api.getData();
                const selectedColumns = Object.entries(multiselectorItem.values.values)
                    .map(([id, column]) => {
                        if (data[id] === false) {
                            return null;
                        }
                        return {
                            id,
                            name: column.name,
                            simple_name: column.simple_name,
                            orden: data[id + 'orden'],
                        };
                    })
                    .filter((column) => column !== null)
                    .sort((a, b) => a.orden - b.orden);
                const textToInsert = `&nbsp;<strong data-table-id="${
                    multiselectorItem.id
                }" data-columns-ids="${selectedColumns
                    .map((column) => column.id)
                    .join(',')}" data-columns-names="${selectedColumns
                    .map((column) => column.simple_name)
                    .join(',')}"><span contenteditable="false">{{<br/>Tabla de ${
                    multiselectorItem.values.name
                }<br/> con columnas: <br/> ${selectedColumns
                    .map((column) => column.name)
                    .join('<br/>')}<br/>}}</span></strong>&nbsp;`;
                tinymce.activeEditor.execCommand('mceInsertContent', false, textToInsert);
                api.close();
            },
        };
    }

    static selectorpageconfig(multiselectorItem) {
        return {
            title: 'Selector multiple',
            size: 'medium',
            body: {
                type: 'panel',
                items: [
                    {
                        type: 'htmlpanel',
                        html: `<p>Quiere insertar una tabla o una lista a partir de la columna seleccionada?</p>`,
                    },
                ],
            },
            buttons: [
                {
                    type: 'custom',
                    name: 'lista',
                    text: 'Lista',
                    align: 'start',
                    buttonType: 'primary',
                },
                {
                    type: 'custom',
                    text: 'Tabla',
                    name: 'tabla',
                    align: 'end',
                    buttonType: 'primary',
                },
            ],
            onAction: (api, details) => {
                if (details.name == 'lista') {
                    api.redial(this.listpageconfig(multiselectorItem));
                } else if (details.name == 'tabla') {
                    api.redial(this.tablepageconfig(multiselectorItem));
                }
            },
        };
    }

    static listpageconfig(multiselectorItem) {
        return {
            title: 'Insertar selector multiple',
            size: 'medium',
            body: {
                type: 'panel',
                items: [
                    {
                        type: 'label',
                        label: 'Insertar texto a mostrar en la lista',
                        items: [
                            {
                                type: 'htmlpanel', // component type
                                html: "<div contenteditable='true' style='margin: 10px; border: 1px solid black; padding: 10px; height: 100%;' id='textareaA'></div>",
                            },
                            {
                                type: 'selectbox', // component type
                                name: 'SelectA', // identifier
                                label: 'Select Label',
                                enabled: true, // enabled state
                                size: 1, // number of visible values (optional)
                                items: [
                                    { text: 'None', value: 'None' },
                                    ...Object.entries(multiselectorItem.values.values).map(
                                        ([id, values]) => {
                                            return {
                                                text: values.name,
                                                value: `&nbsp;<strong data-id="${id}"><span contenteditable="false">{{${values.name}}}</span></strong>&nbsp;`,
                                            };
                                        }
                                    ),
                                ],
                            },
                        ],
                    },
                ],
            },
            buttons: [
                {
                    type: 'cancel',
                    text: 'Cancelar',
                },
                {
                    type: 'submit',
                    text: 'Insertar',
                    buttonType: 'primary',
                },
            ],
            onChange: (api) => {
                const data = api.getData();
                if (data.SelectA == 'None') {
                    return;
                }
                const textareaA = document.getElementById('textareaA');
                if (textareaA) {
                    textareaA.innerHTML += data.SelectA;
                }
                api.setData({
                    textareaA: data.textareaA,
                    SelectA: 'None',
                });
            },
            onSubmit: (api) => {
                const textareaA = document.getElementById('textareaA');
                const textAreaHtml = textareaA.innerHTML;
                const encodedText = btoa(encodeURIComponent(textAreaHtml));
                const textToInsert = `&nbsp;<strong data-list-id="${multiselectorItem.id}" data-inner-html="${encodedText}"><span contenteditable="false">{{Lista de ${multiselectorItem.values.name} con forma  </br> : {{${textAreaHtml}}}</span></strong>&nbsp;`;
                tinymce.activeEditor.execCommand('mceInsertContent', false, textToInsert);
                api.close();
            },
        };
    }
}

export default Dialogs;

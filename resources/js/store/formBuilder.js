import axios from 'axios'

let example = {
    "success": true,
    "message": "Datos obtenidos",
    "content": {
      "id": "3199dd24-f524-4605-b632-c88502771fba",
      "entity_type_id": "2168fdd5-840f-11eb-965c-ed7fb50d217e",
      "name": "Solicitud de compra",
      "color": null,
      "text_color": null,
      "area_id": "d2e7af65-2527-11eb-8dfb-f23c920f9a68",
      "owner_id": "d5f14e37-2527-11eb-8dfb-f23c920f9a68",
      "created_at": "2021-04-12 13:07:11",
      "valid": "1",
      "entity_type_name": "oc",
      "poll": 0,
      "fields": [
        {
          "form_field_id": "b69c2479-8a8d-11eb-965c-ed7fb50d217e",
          "order": 5,
          "name": "Proyecto",
          "permission": 2,
          "form_section_id": "11c92553-8841-4338-8bcd-aebdd661063d",
          "required": 1,
          "format": "SELECTOR",
          "col_md": 12,
          "col_xl": 12,
          "col_sm": 12,
          "id": "a6c9b388-842f-11eb-965c-ed7fb50d217e",
          "column_group_id": null,
          "entity_type_id": "2168fdd5-840f-11eb-965c-ed7fb50d217e",
          "col_name": "oportunity_id",
          "entity_type_fk": "oportunity",
          "entity_type_permission_fk": null,
          "col_name_fk": null,
          "pivot_table": null,
          "entity_type_pivot_fk": null,
          "default_value": null,
          "col_fk_1_n": null,
          "col_fk_n_1": null,
          "col_fk_filter": null,
          "col_filter_by": null,
          "options": null,
          "created_by": null,
          "width": null,
          "filter": null,
          "color": null,
          "text_color": null
        },
        {
          "form_field_id": "b69c2a71-8a8d-11eb-965c-ed7fb50d217e",
          "order": 3,
          "name": "Moneda",
          "permission": 2,
          "form_section_id": "1902f0bd-d7a5-40ee-bbe4-2b155d94927f",
          "required": 1,
          "format": "SELECTOR",
          "col_md": 6,
          "col_xl": 6,
          "col_sm": 12,
          "id": "b34f734d-89f1-11eb-965c-ed7fb50d217e",
          "column_group_id": null,
          "entity_type_id": "2168fdd5-840f-11eb-965c-ed7fb50d217e",
          "col_name": "currency_id",
          "entity_type_fk": "currency",
          "entity_type_permission_fk": null,
          "col_name_fk": null,
          "pivot_table": null,
          "entity_type_pivot_fk": null,
          "default_value": null,
          "col_fk_1_n": null,
          "col_fk_n_1": null,
          "col_fk_filter": null,
          "col_filter_by": null,
          "options": null,
          "created_by": null,
          "width": null,
          "filter": null,
          "color": null,
          "text_color": null
        },
        {
          "form_field_id": "b69c2b1c-8a8d-11eb-965c-ed7fb50d217e",
          "order": 1,
          "name": "Unidad de compra",
          "permission": 2,
          "form_section_id": "1902f0bd-d7a5-40ee-bbe4-2b155d94927f",
          "required": 1,
          "format": "SELECTOR",
          "col_md": 6,
          "col_xl": 6,
          "col_sm": 12,
          "id": "b34f7531-89f1-11eb-965c-ed7fb50d217e",
          "column_group_id": null,
          "entity_type_id": "2168fdd5-840f-11eb-965c-ed7fb50d217e",
          "col_name": "purchase_unit_id",
          "entity_type_fk": "purchase_unit",
          "entity_type_permission_fk": null,
          "col_name_fk": null,
          "pivot_table": null,
          "entity_type_pivot_fk": null,
          "default_value": null,
          "col_fk_1_n": null,
          "col_fk_n_1": null,
          "col_fk_filter": null,
          "col_filter_by": null,
          "options": null,
          "created_by": null,
          "width": null,
          "filter": null,
          "color": null,
          "text_color": null
        },
        {
          "form_field_id": "b69c2bd3-8a8d-11eb-965c-ed7fb50d217e",
          "order": 2,
          "name": "Forma de pago",
          "permission": 2,
          "form_section_id": "1902f0bd-d7a5-40ee-bbe4-2b155d94927f",
          "required": 1,
          "format": "SELECTOR",
          "col_md": 6,
          "col_xl": 6,
          "col_sm": 12,
          "id": "b34f7713-89f1-11eb-965c-ed7fb50d217e",
          "column_group_id": null,
          "entity_type_id": "2168fdd5-840f-11eb-965c-ed7fb50d217e",
          "col_name": "way_of_payment_id",
          "entity_type_fk": "way_of_payment",
          "entity_type_permission_fk": null,
          "col_name_fk": null,
          "pivot_table": null,
          "entity_type_pivot_fk": null,
          "default_value": null,
          "col_fk_1_n": null,
          "col_fk_n_1": null,
          "col_fk_filter": "contract_type_id",
          "col_filter_by": "contract_type_id",
          "options": null,
          "created_by": null,
          "width": null,
          "filter": null,
          "color": null,
          "text_color": null
        },
        {
          "form_field_id": "b69c300d-8a8d-11eb-965c-ed7fb50d217e",
          "order": 4,
          "name": "Es cambio de alcance",
          "permission": 2,
          "form_section_id": "1902f0bd-d7a5-40ee-bbe4-2b155d94927f",
          "required": 1,
          "format": "SiNo",
          "col_md": 6,
          "col_xl": 6,
          "col_sm": 12,
          "id": "b34fc3bb-89f1-11eb-965c-ed7fb50d217e",
          "column_group_id": null,
          "entity_type_id": "2168fdd5-840f-11eb-965c-ed7fb50d217e",
          "col_name": "is_change_of_scope",
          "entity_type_fk": null,
          "entity_type_permission_fk": null,
          "col_name_fk": null,
          "pivot_table": null,
          "entity_type_pivot_fk": null,
          "default_value": 0,
          "col_fk_1_n": null,
          "col_fk_n_1": null,
          "col_fk_filter": null,
          "col_filter_by": null,
          "options": null,
          "created_by": null,
          "width": null,
          "filter": null,
          "color": null,
          "text_color": null
        },
        {
          "form_field_id": "b69c2d32-8a8d-11eb-965c-ed7fb50d217e",
          "order": 1,
          "name": "Total contrato neto",
          "permission": 2,
          "form_section_id": "4069f12f-56b8-4ac9-864c-41a4980a547b",
          "required": 1,
          "format": "CLP",
          "col_md": 3,
          "col_xl": 3,
          "col_sm": 6,
          "id": "b34fb9e9-89f1-11eb-965c-ed7fb50d217e",
          "column_group_id": null,
          "entity_type_id": "2168fdd5-840f-11eb-965c-ed7fb50d217e",
          "col_name": "contract_net_total",
          "entity_type_fk": null,
          "entity_type_permission_fk": null,
          "col_name_fk": null,
          "pivot_table": null,
          "entity_type_pivot_fk": null,
          "default_value": null,
          "col_fk_1_n": null,
          "col_fk_n_1": null,
          "col_fk_filter": null,
          "col_filter_by": null,
          "options": null,
          "created_by": null,
          "width": null,
          "filter": null,
          "color": null,
          "text_color": null
        },
        {
          "form_field_id": "b69c2ddf-8a8d-11eb-965c-ed7fb50d217e",
          "order": 2,
          "name": "Descuento contrato",
          "permission": 2,
          "form_section_id": "4069f12f-56b8-4ac9-864c-41a4980a547b",
          "required": 1,
          "format": "CLP",
          "col_md": 3,
          "col_xl": 3,
          "col_sm": 6,
          "id": "b34fbc17-89f1-11eb-965c-ed7fb50d217e",
          "column_group_id": null,
          "entity_type_id": "2168fdd5-840f-11eb-965c-ed7fb50d217e",
          "col_name": "contract_discount",
          "entity_type_fk": null,
          "entity_type_permission_fk": null,
          "col_name_fk": null,
          "pivot_table": null,
          "entity_type_pivot_fk": null,
          "default_value": null,
          "col_fk_1_n": null,
          "col_fk_n_1": null,
          "col_fk_filter": null,
          "col_filter_by": null,
          "options": null,
          "created_by": null,
          "width": null,
          "filter": null,
          "color": null,
          "text_color": null
        },
        {
          "form_field_id": "b69c2e89-8a8d-11eb-965c-ed7fb50d217e",
          "order": 3,
          "name": "Impuesto",
          "permission": 2,
          "form_section_id": "4069f12f-56b8-4ac9-864c-41a4980a547b",
          "required": 1,
          "format": "PERCENTAGE",
          "col_md": 3,
          "col_xl": 3,
          "col_sm": 6,
          "id": "b34fbe0e-89f1-11eb-965c-ed7fb50d217e",
          "column_group_id": null,
          "entity_type_id": "2168fdd5-840f-11eb-965c-ed7fb50d217e",
          "col_name": "tax",
          "entity_type_fk": null,
          "entity_type_permission_fk": null,
          "col_name_fk": null,
          "pivot_table": null,
          "entity_type_pivot_fk": null,
          "default_value": null,
          "col_fk_1_n": null,
          "col_fk_n_1": null,
          "col_fk_filter": null,
          "col_filter_by": null,
          "options": null,
          "created_by": null,
          "width": null,
          "filter": null,
          "color": null,
          "text_color": null
        },
        {
          "form_field_id": "b69c1b5d-8a8d-11eb-965c-ed7fb50d217e",
          "order": 10,
          "name": "Anexos",
          "permission": 2,
          "form_section_id": "671ae2b5-72a6-40eb-8600-49ad6d125f92",
          "required": 1,
          "format": "SELECTOR[1XN][ALL]",
          "col_md": 12,
          "col_xl": 12,
          "col_sm": 12,
          "id": "026bd82d-fc1c-4fb2-8f57-ba0ebdd727d3",
          "column_group_id": null,
          "entity_type_id": "2168fdd5-840f-11eb-965c-ed7fb50d217e",
          "col_name": null,
          "entity_type_fk": "document",
          "entity_type_permission_fk": "d4dce8ca-2527-11eb-8dfb-f23c920f9a68",
          "col_name_fk": null,
          "pivot_table": null,
          "entity_type_pivot_fk": null,
          "default_value": null,
          "col_fk_1_n": "entity_id",
          "col_fk_n_1": "id",
          "col_fk_filter": null,
          "col_filter_by": null,
          "options": null,
          "created_by": "d5f14e37-2527-11eb-8dfb-f23c920f9a68",
          "width": null,
          "filter": null,
          "color": null,
          "text_color": null
        },
        {
          "form_field_id": "b69c30b3-8a8d-11eb-965c-ed7fb50d217e",
          "order": 23,
          "name": "Aprobado",
          "permission": 1,
          "form_section_id": "671ae2b5-72a6-40eb-8600-49ad6d125f92",
          "required": 1,
          "format": "SiNo",
          "col_md": 1,
          "col_xl": 1,
          "col_sm": 1,
          "id": "b34fcd69-89f1-11eb-965c-ed7fb50d217e",
          "column_group_id": null,
          "entity_type_id": "2168fdd5-840f-11eb-965c-ed7fb50d217e",
          "col_name": "approved",
          "entity_type_fk": null,
          "entity_type_permission_fk": null,
          "col_name_fk": null,
          "pivot_table": null,
          "entity_type_pivot_fk": null,
          "default_value": 1,
          "col_fk_1_n": null,
          "col_fk_n_1": null,
          "col_fk_filter": null,
          "col_filter_by": null,
          "options": null,
          "created_by": null,
          "width": null,
          "filter": null,
          "color": null,
          "text_color": null
        },
        {
          "form_field_id": "b69c2254-8a8d-11eb-965c-ed7fb50d217e",
          "order": 9,
          "name": "Productos",
          "permission": 2,
          "form_section_id": "91ba33ab-78ee-4ea6-8417-ae69ed9b6886",
          "required": 1,
          "format": "SELECTOR[MULTIPLE]",
          "col_md": 12,
          "col_xl": 12,
          "col_sm": 12,
          "id": "28e34347-05b9-4c56-aca9-3a31f75dff03",
          "column_group_id": null,
          "entity_type_id": "2168fdd5-840f-11eb-965c-ed7fb50d217e",
          "col_name": null,
          "entity_type_fk": "product_type",
          "entity_type_permission_fk": "2168fa03-840f-11eb-965c-ed7fb50d217e",
          "col_name_fk": null,
          "pivot_table": "contract_has_product",
          "entity_type_pivot_fk": "2168febb-840f-11eb-965c-ed7fb50d217e",
          "default_value": null,
          "col_fk_1_n": "contract_id",
          "col_fk_n_1": "product_type_id",
          "col_fk_filter": null,
          "col_filter_by": null,
          "options": null,
          "created_by": "d5f14e37-2527-11eb-8dfb-f23c920f9a68",
          "width": null,
          "filter": null,
          "color": null,
          "text_color": null
        },
        {
          "form_field_id": "b69c2548-8a8d-11eb-965c-ed7fb50d217e",
          "order": 4,
          "name": "Proveedor",
          "permission": 2,
          "form_section_id": "c6c57f71-259e-43da-a4c9-fabcd5460875",
          "required": 1,
          "format": "SELECTOR",
          "col_md": 12,
          "col_xl": 12,
          "col_sm": 12,
          "id": "a6c9b3fd-842f-11eb-965c-ed7fb50d217e",
          "column_group_id": null,
          "entity_type_id": "2168fdd5-840f-11eb-965c-ed7fb50d217e",
          "col_name": "organization_id",
          "entity_type_fk": "organization",
          "entity_type_permission_fk": null,
          "col_name_fk": null,
          "pivot_table": null,
          "entity_type_pivot_fk": null,
          "default_value": null,
          "col_fk_1_n": null,
          "col_fk_n_1": null,
          "col_fk_filter": null,
          "col_filter_by": null,
          "options": null,
          "created_by": null,
          "width": null,
          "filter": null,
          "color": null,
          "text_color": null
        },
        {
          "form_field_id": "b69c263a-8a8d-11eb-965c-ed7fb50d217e",
          "order": 1,
          "name": "Nombre",
          "permission": 2,
          "form_section_id": "cdaf5c0d-9522-47fe-b7d1-2e63f62666fc",
          "required": 1,
          "format": "DATETIME",
          "col_md": 6,
          "col_xl": 6,
          "col_sm": 12,
          "id": "a6c9e798-842f-11eb-965c-ed7fb50d217e",
          "column_group_id": null,
          "entity_type_id": "2168fdd5-840f-11eb-965c-ed7fb50d217e",
          "col_name": "name",
          "entity_type_fk": null,
          "entity_type_permission_fk": null,
          "col_name_fk": null,
          "pivot_table": null,
          "entity_type_pivot_fk": null,
          "default_value": null,
          "col_fk_1_n": null,
          "col_fk_n_1": null,
          "col_fk_filter": null,
          "col_filter_by": null,
          "options": null,
          "created_by": null,
          "width": null,
          "filter": null,
          "color": null,
          "text_color": null
        },
        {
          "form_field_id": "b69c2c80-8a8d-11eb-965c-ed7fb50d217e",
          "order": 3,
          "name": "Código OC",
          "permission": 2,
          "form_section_id": "cdaf5c0d-9522-47fe-b7d1-2e63f62666fc",
          "required": 1,
          "format": "SELECTOR",
          "col_md": 6,
          "col_xl": 6,
          "col_sm": 12,
          "id": "b34fb7db-89f1-11eb-965c-ed7fb50d217e",
          "column_group_id": null,
          "entity_type_id": "2168fdd5-840f-11eb-965c-ed7fb50d217e",
          "col_name": "code",
          "entity_type_fk": null,
          "entity_type_permission_fk": null,
          "col_name_fk": null,
          "pivot_table": null,
          "entity_type_pivot_fk": null,
          "default_value": null,
          "col_fk_1_n": null,
          "col_fk_n_1": null,
          "col_fk_filter": null,
          "col_filter_by": null,
          "options": "{\"0\":\"Departamento\",\"1\":\"Casa\"}",
          "created_by": null,
          "width": null,
          "filter": null,
          "color": null,
          "text_color": null
        },
        {
          "form_field_id": "b69c2f61-8a8d-11eb-965c-ed7fb50d217e",
          "order": 2,
          "name": "Observaciones",
          "permission": 2,
          "form_section_id": "cdaf5c0d-9522-47fe-b7d1-2e63f62666fc",
          "required": 1,
          "format": "DOCUMENT[IMAGE]",
          "col_md": 6,
          "col_xl": 6,
          "col_sm": 12,
          "id": "b34fc1d8-89f1-11eb-965c-ed7fb50d217e",
          "column_group_id": null,
          "entity_type_id": "2168fdd5-840f-11eb-965c-ed7fb50d217e",
          "col_name": "observation",
          "entity_type_fk": "document",
          "entity_type_permission_fk": "d4dce8ca-2527-11eb-8dfb-f23c920f9a68",
          "col_name_fk": "src",
          "pivot_table": null,
          "entity_type_pivot_fk": null,
          "default_value": null,
          "col_fk_1_n": null,
          "col_fk_n_1": null,
          "col_fk_filter": null,
          "col_filter_by": "code",
          "options": null,
          "created_by": null,
          "width": null,
          "filter": null,
          "color": null,
          "text_color": null
        }
      ],
      "rows": [
        {
          "id": "563471fa-e263-4033-89b7-f7ba129b4a8d",
          "order": 4,
          "height": null,
          "form_id": "3199dd24-f524-4605-b632-c88502771fba",
          "name": "Fila 4",
          "color": null,
          "text_color": null,
          "area_id": "d2e7af65-2527-11eb-8dfb-f23c920f9a68",
          "owner_id": "d5f14e37-2527-11eb-8dfb-f23c920f9a68",
          "valid": 1
        },
        {
          "id": "5e96fa98-585f-47ee-8988-debd288b4e18",
          "order": 2,
          "height": null,
          "form_id": "3199dd24-f524-4605-b632-c88502771fba",
          "name": "Fila 2",
          "color": null,
          "text_color": null,
          "area_id": "d2e7af65-2527-11eb-8dfb-f23c920f9a68",
          "owner_id": "d5f14e37-2527-11eb-8dfb-f23c920f9a68",
          "valid": 1
        },
        {
          "id": "731f61ba-e911-41bd-a9a4-4fb6937b44f0",
          "order": 3,
          "height": null,
          "form_id": "3199dd24-f524-4605-b632-c88502771fba",
          "name": "Fila 3",
          "color": null,
          "text_color": null,
          "area_id": "d2e7af65-2527-11eb-8dfb-f23c920f9a68",
          "owner_id": "d5f14e37-2527-11eb-8dfb-f23c920f9a68",
          "valid": 1
        },
        {
          "id": "8976d979-af5c-493b-ac53-7bc08bbdc3a0",
          "order": 1,
          "height": null,
          "form_id": "3199dd24-f524-4605-b632-c88502771fba",
          "name": "Fila 1",
          "color": null,
          "text_color": null,
          "area_id": "d2e7af65-2527-11eb-8dfb-f23c920f9a68",
          "owner_id": "d5f14e37-2527-11eb-8dfb-f23c920f9a68",
          "valid": 1
        },
        {
          "id": "a55feecf-87aa-4791-9ba2-22a347cef396",
          "order": 5,
          "height": null,
          "form_id": "3199dd24-f524-4605-b632-c88502771fba",
          "name": "Fila 5",
          "color": null,
          "text_color": null,
          "area_id": "d2e7af65-2527-11eb-8dfb-f23c920f9a68",
          "owner_id": "d5f14e37-2527-11eb-8dfb-f23c920f9a68",
          "valid": 1
        }
      ],
      "actions": [
        {
          "id": "617a6950-bd26-4234-bec7-1430ffccc059",
          "name": "Guardar",
          "save_form": 1,
          "cancel_form": 0,
          "cancel_process": 0,
          "process_id": null,
          "color": null,
          "text_color": null,
          "valid": 1
        },
        {
          "id": "677a3c05-9355-4b94-8fd8-c67b874a9010",
          "name": "Rechazar",
          "save_form": 0,
          "cancel_form": 1,
          "cancel_process": 0,
          "process_id": null,
          "color": null,
          "text_color": null,
          "valid": 1
        }
      ],
      "sections": [
        {
          "id": "11c92553-8841-4338-8bcd-aebdd661063d",
          "order": 3,
          "form_id": "3199dd24-f524-4605-b632-c88502771fba",
          "form_row_id": "5e96fa98-585f-47ee-8988-debd288b4e18",
          "name": "Identificación del proyecto",
          "color": null,
          "text_color": null,
          "area_id": "d2e7af65-2527-11eb-8dfb-f23c920f9a68",
          "owner_id": "d5f14e37-2527-11eb-8dfb-f23c920f9a68",
          "valid": 1,
          "col_md": 6,
          "col_xl": 6,
          "col_sm": 12,
          "visible_on_load": 1,
          "default_next_form_section": null
        },
        {
          "id": "1902f0bd-d7a5-40ee-bbe4-2b155d94927f",
          "order": 2,
          "form_id": "3199dd24-f524-4605-b632-c88502771fba",
          "form_row_id": "8976d979-af5c-493b-ac53-7bc08bbdc3a0",
          "name": "Información general",
          "color": null,
          "text_color": null,
          "area_id": "d2e7af65-2527-11eb-8dfb-f23c920f9a68",
          "owner_id": "d5f14e37-2527-11eb-8dfb-f23c920f9a68",
          "valid": 1,
          "col_md": 6,
          "col_xl": 6,
          "col_sm": 12,
          "visible_on_load": 1,
          "default_next_form_section": null
        },
        {
          "id": "4069f12f-56b8-4ac9-864c-41a4980a547b",
          "order": 7,
          "form_id": "3199dd24-f524-4605-b632-c88502771fba",
          "form_row_id": "a55feecf-87aa-4791-9ba2-22a347cef396",
          "name": "Total",
          "color": null,
          "text_color": null,
          "area_id": "d2e7af65-2527-11eb-8dfb-f23c920f9a68",
          "owner_id": "d5f14e37-2527-11eb-8dfb-f23c920f9a68",
          "valid": 1,
          "col_md": 12,
          "col_xl": 12,
          "col_sm": 12,
          "visible_on_load": 1,
          "default_next_form_section": null
        },
        {
          "id": "671ae2b5-72a6-40eb-8600-49ad6d125f92",
          "order": 6,
          "form_id": "3199dd24-f524-4605-b632-c88502771fba",
          "form_row_id": "563471fa-e263-4033-89b7-f7ba129b4a8d",
          "name": "Anexos",
          "color": null,
          "text_color": null,
          "area_id": "d2e7af65-2527-11eb-8dfb-f23c920f9a68",
          "owner_id": "d5f14e37-2527-11eb-8dfb-f23c920f9a68",
          "valid": 1,
          "col_md": 12,
          "col_xl": 12,
          "col_sm": 12,
          "visible_on_load": 1,
          "default_next_form_section": null
        },
        {
          "id": "91ba33ab-78ee-4ea6-8417-ae69ed9b6886",
          "order": 5,
          "form_id": "3199dd24-f524-4605-b632-c88502771fba",
          "form_row_id": "731f61ba-e911-41bd-a9a4-4fb6937b44f0",
          "name": "Itemizado",
          "color": null,
          "text_color": null,
          "area_id": "d2e7af65-2527-11eb-8dfb-f23c920f9a68",
          "owner_id": "d5f14e37-2527-11eb-8dfb-f23c920f9a68",
          "valid": 1,
          "col_md": 12,
          "col_xl": 12,
          "col_sm": 12,
          "visible_on_load": 1,
          "default_next_form_section": null
        },
        {
          "id": "c6c57f71-259e-43da-a4c9-fabcd5460875",
          "order": 4,
          "form_id": "3199dd24-f524-4605-b632-c88502771fba",
          "form_row_id": "5e96fa98-585f-47ee-8988-debd288b4e18",
          "name": "Identificación del proveedor",
          "color": null,
          "text_color": null,
          "area_id": "d2e7af65-2527-11eb-8dfb-f23c920f9a68",
          "owner_id": "d5f14e37-2527-11eb-8dfb-f23c920f9a68",
          "valid": 1,
          "col_md": 6,
          "col_xl": 6,
          "col_sm": 12,
          "visible_on_load": 1,
          "default_next_form_section": null
        },
        {
          "id": "cdaf5c0d-9522-47fe-b7d1-2e63f62666fc",
          "order": 1,
          "form_id": "3199dd24-f524-4605-b632-c88502771fba",
          "form_row_id": "8976d979-af5c-493b-ac53-7bc08bbdc3a0",
          "name": "Identificación del documento",
          "color": null,
          "text_color": null,
          "area_id": "d2e7af65-2527-11eb-8dfb-f23c920f9a68",
          "owner_id": "d5f14e37-2527-11eb-8dfb-f23c920f9a68",
          "valid": 1,
          "col_md": 6,
          "col_xl": 6,
          "col_sm": 12,
          "visible_on_load": 1,
          "default_next_form_section": null
        }
      ]
    },
    "warning": []
  }
export default {
    namespaced: true,
    state: {
        loading: false,
        entityId: '',
        entityName: '',
        files: [],
        contentInfo: null,
        hasFiles: false
    },
    getters: {
        loading: state => state.loading,
        entity_id: state => state.entityId,
        entity_name: state => state.entityName,
        content_info: state => state.contentInfo,
        hasFiles: state => state.hasFiles,
        files: state => state.files,

    },
    mutations: {
        LOADING(state, val) {
            state.loading = val
        },
        ENTITY_ID(state, val) {
            state.entityId = val
        },
        ENTITY_NAME(state, val) {
            state.entityName = val
        },
        CONTENT_INFO(state, val) {
            state.contentInfo = val
        },
        FILES(state, val) {
            state.hasFiles = true
            state.files[val.id] = val
        }
    },
    actions: {
        get({ commit, dispatch }, id) {
            commit('LOADING', true)
            return new Promise((resolve, reject) => {
                axios.get(`/api/sheets/form/${id}`)
                .then(response => {
                    // const data = response.data.content
                    const data = example.content
                    commit('ENTITY_ID', data.entity_type_id)
                    commit('ENTITY_NAME', data.entity_type_name)

                    let rows = data.rows.map(row => {
                        let sections = data.sections.filter(sect => {
                            return sect.form_row_id === row.id
                        })

                        sections.sort((a, b) => {
                            return a.order > b.order ? 1 : -1;
                        })

                        sections.map(section => {
                            let fields = data.fields.filter(f => {
                                return f.form_section_id === section.id && f.permission !== 0
                            })
                            fields.sort((a, b) => {
                                return a.order > b.order ? 1 : -1;
                            })
                            section.fields = fields
                        })
                        row.sections = sections
                        return row
                    })
                    rows.sort((a, b) => {
                        return a.order > b.order ? 1 : -1
                    })
                    let form = {
                        rows: rows,
                        actions: data.actions.sort((a, b) => {
                                return a.save_form > b.save_form ? 1 : -1
                            })
                        }
                    resolve(form)
                    return response.data.content
                })
                .then(content => {
                    dispatch('info', content.entity_type_id)
                })
                .catch(error => {
                    reject(error)
                })
                .finally(() => {
                    commit('LOADING', false)
                })

            })
        },
        info({ commit }, id) {
            commit('LOADING', true)
            axios.get(`/api/sheets/entity/info/${id}`)
            .then(response => {
                commit('CONTENT_INFO', response.data.content)
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                commit('LOADING', false)
            })

        },
        save({ commit }, data) {
            commit('LOADING', true)
            return new Promise((resolve, reject) => {
                axios.post(`/api/sheets/save/form`, data)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error.response)
                })
                .finally(() => {
                    commit('LOADING', false)
                })
            })
        },
        upload_files({ commit }, data) {
            commit('LOADING', true)
            return new Promise((resolve, reject) => {
                const headers = {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
                axios.post(`/api/sheets/save/file`, data, headers)
                .then(response => {
                    const id = response.data.content.content.inserted_id
                    resolve(id)
                })
                .catch(error => {
                    reject(error)
                })
                .finally(() => {
                    commit('LOADING', false)
                })
            });
        }
    }
}

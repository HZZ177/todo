# CRUD Generator Parameters

Use these inputs when asking the skill to scaffold a page.

## Standard Table CRUD Input

```json
{
  "action": "generate-table",
  "pageName": "ScheduledTaskPage",
  "pageDir": "scheduled-task",
  "apiModule": "ScheduledTask",
  "apiListMethod": "scheduledTaskGetTable",
  "apiCreateMethod": "scheduledTaskCreate",
  "apiUpdateMethod": "scheduledTaskUpdate",
  "apiDeleteMethod": "scheduledTaskDelete",
  "apiDetailMethod": "scheduledTaskGetDetail",
  "currentKey": "pageNum",
  "pageSizeKey": "pageSize",
  "dataSourceKey": "records",
  "totalKey": "total",
  "recordKey": "id",
  "columns": [],
  "searchSchema": [],
  "detailSchema": [],
  "fields": []
}
```

## Fields

### Top-Level Keys

| Key | Required | Type | Notes |
| --- | --- | --- | --- |
| `action` | yes | `generate-table \| generate-form` | Select the scaffold mode. |
| `pageName` | yes | `string` | `defineOptions({ name: PAGE_NAME })` value. |
| `pageDir` | recommended | `string` | Folder name under `src/pages/`. If omitted, derive from the target route or feature name. |
| `apiModule` | yes | `string` | Module name used in imports such as `AgentApi`. |
| `apiListMethod` | yes for table | `string` | List/query method name. |
| `apiCreateMethod` | yes for table/form | `string` | Create method name. |
| `apiUpdateMethod` | yes for table/form | `string` | Update method name. |
| `apiDeleteMethod` | yes for table | `string` | Delete method name. |
| `apiDetailMethod` | yes for table/form | `string` | Detail method name. |
| `currentKey` | no | `string` | Pagination current page key. Default: `pageNo`. |
| `pageSizeKey` | no | `string` | Pagination size key. Default: `pageSize`. |
| `dataSourceKey` | no | `string` | List data array key. Default: `records`. |
| `totalKey` | no | `string` | Total count key. Default: `total`. |
| `recordKey` | no | `string` | Primary key field on a row. Default: `id`. |
| `columns` | yes for table | `ColumnConfig[]` | Table columns for `data.ts`. |
| `searchSchema` | yes for table | `SearchFieldConfig[]` | Search form schema for `data.ts`. |
| `detailSchema` | yes for table | `DetailItemConfig[]` | Description schema for `data.ts` and `DetailForm.vue`. |
| `fields` | yes for table/form | `FormFieldConfig[]` | Edit form schema source. |
| `optionsBlocks` | no | `string` | Raw TypeScript declarations for enums/options emitted into `data.ts` when known. |

### `columns`

Each item should map cleanly to the repo's table config style:

```json
{
  "title": "Status",
  "dataIndex": "status",
  "width": 120,
  "align": "left",
  "ellipsis": true,
  "fixed": "right"
}
```

Recommended keys:

- `title`
- `dataIndex`
- `width`
- `align`
- `ellipsis`
- `fixed`

Reserve one column with `dataIndex: "action"` for operation buttons.

### `searchSchema`

Each item should already match `YcForm.Schema` expectations closely enough to emit into `data.ts`:

```json
{
  "field": "status",
  "component": "Select",
  "componentProps": {
    "options": "statusOptions"
  }
}
```

Recommended keys:

- `field`
- `component`
- `placeholder`
- `componentProps`
- `options`

If options depend on remote APIs or enums, call that out explicitly so the generated page includes a follow-up note instead of pretending the data is ready.

### `detailSchema`

Each item should map to the repo's `DescItem` shape:

```json
{
  "label": "Status",
  "key": "status",
  "ellipsis": true
}
```

Supported keys:

- `label`
- `key`
- `span`
- `tip`
- `ellipsis`
- `customRender`

If `customRender` is needed, treat the generated `DetailForm.vue` as a starting point and add a manual follow-up note.

### `fields`

Each form field should map to `YcForm.Schema`:

```json
{
  "name": "name",
  "label": "Name",
  "component": "Input",
  "required": true,
  "placeholder": "Enter name"
}
```

Supported keys:

- `name`
- `label`
- `component`
- `required`
- `tip`
- `placeholder`
- `options`
- `componentProps`

`name` may be either a string field name or an array for range-style components such as `['startTime', 'endTime']`.

## Repo-Specific Rules

- Put API types in `src/api/[module]/type.d.ts`, not in a shared `types/` folder.
- Use actual request and response shapes from the API module whenever they can be inferred.
- If the delete API does not accept a raw record id, note that immediately and adapt the generated call.
- If the list response uses `items` or `list` instead of `records`, override `dataSourceKey`.
- If select options are local constants rather than remote data, define them in `data.ts` instead of scattering them across the page component.

## Minimum Acceptance Criteria

Do not claim the scaffold is complete unless all of these are true:

- all referenced methods exist or are explicitly marked as pending
- the output includes `index.vue`, `data.ts`, `EditForm.vue`, and `DetailForm.vue` for table CRUD
- placeholder keys have been replaced with real API keys
- unresolved manual work is listed explicitly

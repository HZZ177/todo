# CRUD Generator Examples

These examples show how to ask the skill for a standard page scaffold.

## Example 1: Standard Table CRUD Page

Use this shape when you want the full four-file scaffold.

### Input

```json
{
  "action": "generate-table",
  "pageName": "UserPage",
  "pageDir": "user",
  "apiModule": "User",
  "apiListMethod": "userGetTable",
  "apiCreateMethod": "userCreate",
  "apiUpdateMethod": "userUpdate",
  "apiDeleteMethod": "userDelete",
  "apiDetailMethod": "userGetDetail",
  "currentKey": "pageNo",
  "pageSizeKey": "pageSize",
  "dataSourceKey": "records",
  "totalKey": "total",
  "recordKey": "id",
  "columns": [
    { "title": "Name", "dataIndex": "name", "width": 180, "ellipsis": true },
    { "title": "Status", "dataIndex": "status", "width": 120 },
    { "title": "Created At", "dataIndex": "createdAt", "width": 180 },
    { "title": "Action", "dataIndex": "action", "width": 180, "fixed": "right" }
  ],
  "searchSchema": [
    {
      "field": "name",
      "component": "Input",
      "componentProps": { "placeholder": "Search name" }
    },
    {
      "field": "status",
      "component": "Select",
      "componentProps": { "options": "statusOptions", "allowClear": true }
    }
  ],
  "detailSchema": [
    { "label": "Name", "key": "name" },
    { "label": "Status", "key": "status" },
    { "label": "Created At", "key": "createdAt" }
  ],
  "fields": [
    {
      "name": "name",
      "label": "Name",
      "component": "Input",
      "required": true,
      "placeholder": "Enter name"
    },
    {
      "name": "status",
      "label": "Status",
      "component": "Select",
      "required": true,
      "options": "statusOptions"
    }
  ],
  "optionsBlocks": "export const statusOptions = [{ label: 'Enabled', value: 1 }, { label: 'Disabled', value: 0 }];"
}
```

### Expected Output

```text
src/pages/user/
  index.vue
  data.ts
  components/
    EditForm.vue
    DetailForm.vue
```

## Example 2: Non-Default Pagination Keys

Use overrides when the API contract is not the default `pageNo/pageSize/records/total/id`.

### Input

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
  "currentKey": "page",
  "pageSizeKey": "page_size",
  "dataSourceKey": "list",
  "totalKey": "total",
  "recordKey": "task_id",
  "columns": [],
  "searchSchema": [],
  "detailSchema": [],
  "fields": []
}
```

### What matters

- `index.vue` should use the overridden list keys
- `EditForm.vue` and `DetailForm.vue` should read `drawer.record.task_id`
- generated delete and detail calls must use `task_id`, not `id`

## Example 3: Form-Only Generation

Use this when the page already exists and only the form component is needed.

### Input

```json
{
  "action": "generate-form",
  "pageName": "AgentPage",
  "apiModule": "Agent",
  "apiCreateMethod": "agentCreate",
  "apiUpdateMethod": "agentUpdate",
  "apiDetailMethod": "agentGetDetail",
  "recordKey": "id",
  "fields": [
    {
      "name": "name",
      "label": "Agent Name",
      "component": "Input",
      "required": true
    },
    {
      "name": "description",
      "label": "Description",
      "component": "TextArea"
    }
  ]
}
```

### Expected Output

```text
src/pages/agent/components/EditForm.vue
```

## Example 4: Manual Follow-Up Notes

A good scaffold result should still call out manual tasks when needed. Typical notes include:

- route registration is still pending
- select options must be loaded from a remote API
- delete API expects an object payload instead of a raw id
- `detailSchema.customRender` needs hand-written code
- upload props or permission checks still need implementation

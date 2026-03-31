# CRUD Generator Patterns

Use these patterns when adapting the scaffold to a real page.

## Standard Drawer Modes

The default page pattern uses three drawer modes:

- `add`
- `edit`
- `detail`

Keep edit and detail rendering separate:

```vue
<DetailForm v-if="drawer.mode === 'detail'" />
<EditForm v-if="['edit', 'add'].includes(drawer.mode)" ref="editForm" />
```

Use this as the baseline unless the page is already following a more complex mode set such as `copy` or custom business drawers.

## Prefer API-Derived Types

Derive request and response types from the API module when possible:

```ts
type ListMethod = typeof AgentApi.agentGetTable;
type ListReq = Parameters<ListMethod>[0];
type ListRes = Awaited<ReturnType<ListMethod>>['data'];
type DetailMethod = typeof AgentApi.agentGetDetail;
type DetailRes = Awaited<ReturnType<DetailMethod>>['data'];
```

Prefer this over hard-coding repo-global namespaces when the API methods already exist.

## Keep Page Config in `data.ts`

Store page-local configuration in `data.ts`:

- `PAGE_NAME`
- `columns`
- `searchSchema`
- `detailSchema`
- enum or select option constants that belong only to this page

Do not scatter those constants across `index.vue` and `EditForm.vue` unless they are dynamic and must be loaded remotely.

## Pagination Keys Must Match the API

Do not assume every list API uses `pageNo` and `pageSize`.

Common variants seen in this repo or similar services:

- `pageNo` + `pageSize`
- `pageNum` + `pageSize`
- `page` + `size`
- `page` + `page_size`

Also confirm:

- row primary key field
- list data array field
- total count field

Override the template placeholders before calling the scaffold complete.

## Delete Payload Shape Is Not Universal

Some modules delete by raw id:

```ts
await AgentApi.agentDelete(row.id);
```

Others may require an object payload:

```ts
await SomeApi.deleteItem({ id: row.id });
```

If the delete API shape is not obvious, inspect the API module first and adapt the generated call instead of forcing a cast.

## Use `DetailForm.vue` for Read-Only Display

Default detail pages should use `yc-description`:

```vue
<yc-description :data="detail" :schema="detailSchema" title="Basic Info" />
```

If a field needs custom rendering:

- use `customRender` in `detailSchema` for simple cases
- use the `#item` slot for richer or multi-field custom display

## When to Stop Using the Standard Pattern

The skill is still useful as a starting point, but plan manual extension when the page needs:

- multiple business drawers
- copy mode
- remote dictionaries with cascading dependencies
- upload workflows
- custom permission logic
- heavy cell rendering or operation-specific layouts

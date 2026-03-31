# CRUD Generator Templates

This skill ships templates for the four files required by the repo's standard drawer-based CRUD page.

## Generated File Layout

For `generate-table`, produce:

```text
src/pages/[pageDir]/
  index.vue
  data.ts
  components/
    EditForm.vue
    DetailForm.vue
```

For `generate-form`, produce:

```text
src/pages/[pageDir]/components/
  [FormName].vue
```

## Bundled Templates

### `templates/table-crud-template.vue`

Use for `index.vue`.

It covers:

- search form wiring through `useForm`
- table loading through `useTable`
- drawer lifecycle through `useDrawer`
- delete confirmation
- standard action buttons

It does not cover:

- `data.ts`
- route registration
- permission gating
- complex custom table cells beyond a small `bodyCell` branch

### `templates/data-template.ts`

Use for `data.ts`.

It covers:

- `PAGE_NAME`
- table `columns`
- `searchSchema`
- `detailSchema`
- optional enum or select options blocks when they are already known

It does not cover:

- remote dictionary fetching
- complex `customRender` bodies beyond inline snippets
- business-specific enums that still need to be sourced from real APIs or shared constants

### `templates/form-template.vue`

Use for `components/EditForm.vue` or for a standalone form component.

It covers:

- `fields` to `YcForm.Schema[]`
- add and edit save flow
- detail loading for edit mode
- basic drawer loading behavior

It does not cover:

- remote dictionary loading logic beyond a placeholder task list
- array payload transforms
- custom validation rules
- slot-heavy custom render sections

### `templates/detail-form-template.vue`

Use for `components/DetailForm.vue`.

It covers:

- detail fetch based on `drawer.record[recordKey]`
- `detailSchema` rendering through `yc-description`
- drawer loading state handling

It does not cover:

- custom slots for rich media or complex field rendering
- sectioned multi-block detail layouts

## Generation Notes

- Generate `data.ts` explicitly. It is not optional.
- Keep `PAGE_NAME` in `data.ts` and import it from both form/detail components.
- Replace every pagination or record key placeholder with the real module keys before considering the scaffold done.
- If a page is closer to `agent/` than to `table-demo/`, use the templates as a baseline and then adapt manually.
- If `searchSchema` or `detailSchema` requires helper constants such as `statusOptions`, emit them into `data.ts` as part of the scaffold or mark them as pending manual work.

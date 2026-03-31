# CRUD Generator FAQ

## When should I use this skill?

Use it for standard CRUD pages with:

- a searchable table
- drawer-based add/edit
- a separate detail drawer
- straightforward `YcForm.Schema[]` and `DescItem[]` configuration

Avoid relying on it alone for highly customized pages.

## Does it generate detail pages?

Yes. The standard table CRUD flow now includes `components/DetailForm.vue` as part of the scaffold.

That does not mean detail rendering is fully automatic. If the detail view needs rich media, custom slot rendering, or multiple sections, treat the generated file as a starting point and extend it manually.

## Can I reuse `EditForm.vue` for detail mode?

Do not do that by default. Keep `EditForm.vue` for editable form logic and `DetailForm.vue` for read-only display.

This matches the existing project pattern and keeps validation and display concerns separate.

## Can I generate custom components?

Not directly. The form scaffold assumes components already supported by `componentMap` in `src/components/Form/data.ts`.

If you need a custom field, scaffold the base form and then switch that field to `component: 'Render'` or hand-edit the component.

## Can I use antd components instead of `yc-description` in `DetailForm.vue`?

Yes. `yc-description` is the default pattern, not a hard requirement.

If the layout is too specialized for `yc-description`, replace the generated detail content with ant-design-vue components or custom markup.

## What manual work is still expected after generation?

Usually at least some of the following:

- registering the route
- creating or updating `src/api/[module]/type.d.ts`
- wiring real select options
- adapting delete payload shape
- adding custom cell rendering
- implementing permission checks
- handling multi-select or upload-specific transforms

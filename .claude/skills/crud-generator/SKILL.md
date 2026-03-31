---
name: crud-generator
description: Generate standard Vue 3 CRUD page scaffolding for this repo's `admin_frontend`. Use when Codex needs to create or extend a list page that follows the project's `tl` + `useTable` + `useForm` + `useDrawer` pattern, including `index.vue`, `data.ts`, `EditForm.vue`, and `DetailForm.vue`.
---

# CRUD Generator

Generate only the standard CRUD pattern already used in `admin_frontend/src/pages/table-demo` and similar pages.

Do not present this skill as a fully automatic code generator. It is a repo-specific scaffolding workflow that produces a strong starting point and then requires targeted follow-up edits.

## Scope

Use this skill for:

- list pages with table search, drawer-based add/edit, and detail view
- forms built from `YcForm.Schema[]`
- detail panels built from `DescItem[]`
- API modules that already exist or are being created in parallel

Do not rely on this skill alone for:

- dynamic forms
- nested object editing
- tree tables
- batch operations
- permission-heavy workflows
- custom rendering with substantial business logic

For those cases, scaffold the base files with this skill and then hand-edit the page.

## Inputs

Read [docs/parameters.md](D:/web-projects/doing/kt-agent-framework/.claude/skills/crud-generator/docs/parameters.md) before generating anything.

At minimum, gather:

- `pageName`
- `apiModule`
- `apiListMethod`
- `apiCreateMethod`
- `apiUpdateMethod`
- `apiDeleteMethod`
- `apiDetailMethod`
- `columns`
- `searchSchema`
- `detailSchema`
- `fields`

Also confirm these repo-specific assumptions before generating:

- list API returns data shaped like `{ records, total }` unless keys are overridden
- detail/create/update APIs return `{ code, data, message }`
- page state uses `useDrawer(PAGE_NAME)`
- types live beside the API module in `src/api/[module]/type.d.ts`

If any of these are unknown, stop guessing and derive them from the existing API module or adjacent pages.

## Output Files

For a standard table CRUD page, generate these files under `admin_frontend/src/pages/[page-dir]/`:

- `index.vue`
- `data.ts`
- `components/EditForm.vue`
- `components/DetailForm.vue`

For a form-only request, generate only the requested form component.

Read [docs/templates.md](D:/web-projects/doing/kt-agent-framework/.claude/skills/crud-generator/docs/templates.md) and use the template files in `templates/`.

## Workflow

1. Inspect the nearest real page first.
   Prefer `table-demo`, then a closer business page if one already exists.
2. Inspect the target API module.
   Confirm method names, request shapes, response keys, and record primary key.
3. Decide whether the page is standard enough for this skill.
   If not, say which parts will still need manual implementation.
4. Generate all required page files together.
   Do not generate `index.vue` alone and leave `data.ts` or `DetailForm.vue` implied.
5. Adapt the scaffold to actual API keys.
   Do not leave placeholders like `pageNo` or `id` if the module uses other names.
6. Generate `data.ts` from the bundled template.
   Keep page metadata, table columns, form schema, detail schema, and local option constants in one place.
7. Add the post-generation follow-up items explicitly.
   Tell the user what still needs manual review.

## Required Follow-Up Checklist

After generation, verify or complete all of the following:

- `src/api/[module]/index.ts` exports every referenced API method
- `src/api/[module]/type.d.ts` exists and matches the real API shapes
- `data.ts` exports `PAGE_NAME`, `columns`, `searchSchema`, and `detailSchema`
- the route is registered in `src/router/routes.ts` if this is a new page
- enum/select options are wired to real dictionaries instead of placeholder arrays
- delete payload shape matches the real API contract
- custom cells, uploads, and multi-select transforms are implemented if needed

## Quality Bar

Generated code should:

- follow existing imports and alias conventions
- infer request and response types from API methods when possible
- avoid unsafe casts unless there is no better option
- keep `drawer.showSpinning()` / `drawer.hideSpinning()` balanced
- use the real record key instead of assuming `id`
- compile after the remaining required files are present

## Known Limits

Read [docs/limitations.md](D:/web-projects/doing/kt-agent-framework/.claude/skills/crud-generator/docs/limitations.md) when the page includes advanced search, custom validation, linkage, upload rules, or complex slot rendering.

## References

- Reference implementation: `admin_frontend/src/pages/table-demo/`
- More complex variation: `admin_frontend/src/pages/agent/`
- Parameter contract: [docs/parameters.md](D:/web-projects/doing/kt-agent-framework/.claude/skills/crud-generator/docs/parameters.md)
- Template contract: [docs/templates.md](D:/web-projects/doing/kt-agent-framework/.claude/skills/crud-generator/docs/templates.md)
- Limitations: [docs/limitations.md](D:/web-projects/doing/kt-agent-framework/.claude/skills/crud-generator/docs/limitations.md)

# CRUD Generator Overview

`crud-generator` is a repo-specific scaffolding skill for standard CRUD pages in `admin_frontend`.

It is designed around the patterns already used in this codebase:

- `tl` layout wrappers
- `useTable` for list pages
- `useForm` for search and edit forms
- `useDrawer` for add/edit/detail drawer state
- `yc-description` for read-only detail display

## What It Produces

For a standard table CRUD page, the intended output is:

```text
src/pages/[pageDir]/
  index.vue
  data.ts
  components/
    EditForm.vue
    DetailForm.vue
```

## What It Does Well

- creates a consistent starting point for standard CRUD pages
- keeps page config in `data.ts`
- encourages type inference from real API methods
- separates edit and detail concerns cleanly

## What It Does Not Solve Automatically

- API implementation
- route registration
- remote option fetching
- permission logic
- complex validation or field linkage
- heavily customized table and detail rendering

## Recommended Usage

1. Inspect the closest existing page.
2. Inspect the target API module and type file.
3. Generate the four standard files together.
4. Replace placeholder keys with real API keys.
5. Finish the manual follow-up items listed in `SKILL.md`.

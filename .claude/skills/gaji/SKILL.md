---
name: gaji
description: Type-safe GitHub Actions workflows using gaji. Use when modifying CI workflows, adding GitHub Actions steps, or working with .github/workflows/ files. Do NOT edit YAML files directly — edit workflows/*.ts instead.
user-invocable: false
---

# gaji — Type-safe GitHub Actions in TypeScript

This project uses [gaji](https://github.com/dodok8/gaji) to manage CI workflows in TypeScript.
**Never edit `.github/workflows/*.yml` directly.** Edit `workflows/*.ts` and run `npx gaji build`.

## Project structure

```
workflows/ci.ts        ← Workflow source (edit this)
generated/             ← Auto-generated types (gitignored)
.github/workflows/     ← Built YAML output (auto-generated)
.gaji.toml             ← Configuration
```

## CLI commands

- `npx gaji init` — Initialize project (creates workflows/, generated/)
- `npx gaji add <action>` — Add action and generate types (e.g. `npx gaji add actions/cache@v4`)
- `npx gaji dev` — Watch mode, auto-builds on change
- `npx gaji build` — Build TypeScript → YAML
- `npx gaji clean` — Remove generated files

## TypeScript API

```typescript
import { getAction, Job, Workflow } from "../generated/index.js";

const checkout = getAction("actions/checkout@v4");
const setupNode = getAction("actions/setup-node@v4");

const job = new Job("ubuntu-latest")
  .addStep(checkout({ name: "Checkout" }))
  .addStep(
    setupNode({
      name: "Setup Node",
      with: { "node-version": "22", cache: "npm" },
    }),
  )
  .addStep({ name: "Install", run: "npm ci" });

const workflow = new Workflow({
  name: "CI",
  on: { push: { branches: ["**"] }, pull_request: {} },
}).addJob("build", job);

workflow.build("ci"); // outputs .github/workflows/ci.yml
```

## Workflow modification procedure

1. Edit `workflows/ci.ts`
2. Run `npx gaji build`
3. Verify `.github/workflows/ci.yml` was regenerated correctly

## Adding a new action

```bash
npx gaji add actions/some-action@v1
```

Types are generated in `generated/`, then use `getAction("actions/some-action@v1")` in your workflow.

## Configuration (.gaji.toml)

```toml
[project]
workflows_dir = "workflows"    # TypeScript workflow source directory
output_dir = ".github"         # YAML output directory
generated_dir = "generated"    # Generated types directory

[build]
validate = true                # Validate generated YAML
format = true                  # Format generated YAML
```

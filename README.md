# TGG Source + TGG Projects

TGG-owned source control, project storage, release management, creator AI history, and backups.

This repository is the foundation for replacing day-to-day GitHub-style project work with TGG-owned services.

## TGG Source

The browser app is served by `tgg-projects/server.mjs`.

Current capabilities:

- TGG-owned Git repositories
- create/import projects
- branches and commits
- code/file browser
- repository search across filenames, content, and commit messages
- project activity timeline
- issues
- pull requests and merge
- tags and releases
- repository status
- Git bundle exports with SHA-256
- TGG Actions with isolated Git worktrees and an explicit action allowlist
- TGG Project backup bundles
- dark TGG Source dashboard

## TGG Projects storage

Default storage root:

`/data/tgg-projects`

The catalog currently includes:

- TGG Source
- TGG World
- TGG Creator Studio
- TGG Cloud
- TGG Runtime
- TGG Higgsfield

Every project is a real Git repository.

## Save everything

Run:

```bash
npm run tgg:projects:save-all
```

That command:

1. bootstraps all catalog projects
2. snapshots this full TGG Source codebase into the `tgg-source` project
3. syncs the TGG Higgsfield workspace into its TGG Project
4. creates SHA-256 Git bundle backups for all TGG Projects

The source snapshot excludes Git internals, dependency/build folders, common secret files, private keys, credentials files, and large binary media.

## TGG Actions

Actions are typed/allowlisted and run in detached Git worktrees so the main repository stays clean.

Default allowed npm script names:

- `check`
- `test`
- `build`

Override with:

`TGG_ACTIONS_ALLOWED=check,test,build,<other-approved-script>`

## TGG Higgsfield

TGG Higgsfield is integrated into every project page.

Capabilities include:

- image generation
- video generation
- VFX
- avatar generation
- world shots
- vehicle commercials
- game trailers
- ad variants
- saved presets
- project-linked generation history

Each generation job is saved back into the selected TGG Project under:

`.tgg/higgsfield/jobs/<job-id>.json`

The bridge can use a TGG-owned local queue or forward to a configured generation backend using `TGG_HIGGSFIELD_BACKEND_URL`.

## Main commands

```bash
npm start
npm run check
npm run tgg:projects:bootstrap
npm run tgg:projects:save-all
npm run tgg:projects:backup
npm run tgg:higgsfield
npm run tgg:higgsfield:sync
npm run tgg:source:test
```

## Ownership

Runtime owner: **TGG**

The design goal is to keep source history, projects, creator workflows, release evidence, and backups under TGG-controlled services rather than depending on an external source-control platform for normal operation.


## Git clone / fetch / push

Each TGG Project is available as a Smart HTTP Git remote:

```text
https://YOUR-TGG-HOST/git/<project-id>.git
```

Examples:

```bash
git clone https://YOUR-TGG-HOST/git/tgg-source.git
git remote add tgg https://YOUR-TGG-HOST/git/tgg-world.git
git fetch tgg
git push tgg main
```

When `TGG_PROJECTS_TOKEN` is enabled, Git clients can authenticate with the token as the password through their normal credential helper.

Pushes use Git `receive.denyCurrentBranch=updateInstead` so the TGG working copy is updated safely when the checked-out branch receives a clean fast-forward/update.

## Bundle exports

TGG Source can create SHA-256 verified Git bundle exports from the dashboard or API. Bundles are downloadable directly from the TGG Source app and can be restored with standard Git tooling.

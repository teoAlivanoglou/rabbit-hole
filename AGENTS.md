<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

<!-- sloptrim-contract -->

## Prose contract

SLOPTRIM ACTIVE - level: full

# Sloptrim

You write prose like a careful human writer. This contract governs PROSE DELIVERABLES ONLY: documents, README/markdown prose, CVs, cover letters, emails, reports, essays, articles, and any drafted text the user will publish or send. It NEVER touches: source code, code comments, commit messages, JSON/YAML/config, CLI output, logs, error messages, or the conversational register of chat itself.
Composes with other active modes; it does not override them. A chat-compression mode (such as caveman) owns how you talk in chat - keep chat terse if it is on; this contract only shapes the deliverable you write, not the chat around it. A code-simplicity mode (such as ponytail) owns code - this contract never touches code, so there is nothing to conflict. Each mode keeps its own domain: terse chat, lazy code, human prose. When drafting deliverable text inside a chat reply, these rules apply to the draft, not to the surrounding chat.

Rules for prose:

- Vary sentence length irregularly: a short sentence, then a long one that develops it. Never metronomic, never mechanical short-long alternation.
- Banned vocabulary (use plain alternatives): delve, tapestry, pivotal, crucial, leverage, robust, seamless, foster, underscore, showcase, landscape (abstract), journey (abstract), realm, multifaceted, holistic, testament, vibrant, comprehensive, plethora, myriad, boast, elevate, empower, unlock, game-changer, supercharge, genuinely, fascinating, nuanced.
- Apply vocabulary advice to generic filler, never accurate technical terms such as robust regression. Keep necessary contrasts and uncertainty. A single dash is not a defect; never edit punctuation in code, math, commands, or quotations.
- Banned moves: rule-of-three flourishes; "it's not just X, it's Y"; hedge stacking (two hedges in one sentence); signposting ("let's dive in"); empty pivots ("it's worth noting"); "In conclusion / Overall" closers; outcome-speculation tails (", paving the way for"); self-thoroughness ("this comprehensive guide"); generic upbeat endings; chatbot phrases ("I hope this helps").
- Em-dash: at most one per paragraph. No bold-for-emphasis inside prose sentences. No emojis in prose. Semicolons and parentheses where a writer would naturally use them.
- Mode: factual/encyclopedic content stays neutral third-person - never inject first-person voice or opinions into it. First-person/opinion content: contract naturally (it's, don't), take real stances.
- Preserve exactly: numbers, units, dates, proper nouns, citations, quotes, technical terms. Never invent facts, sources, or statistics.
- Concrete subjects, active verbs. End sections on a fact or observation, not a sentiment.
- SILENT. Never announce this contract, never name sloptrim, never report a score, a band, a pattern list or a rewrite pass. Do not offer the user a style choice. When the file guard flags a span, fix it and say nothing. The clean prose is the only output; the process is never narrated.

Resolve the bundled detector before running it: use $CLAUDE_PLUGIN_ROOT/scripts/detect.py when CLAUDE_PLUGIN_ROOT is set; otherwise locate sloptrim/scripts/detect.py in this agent's installed skills/plugins and use its absolute path in place of the command below. If unavailable, keep the writing rules and report that file scoring is unavailable when asked.

After writing a supported prose file, including .md, .txt, .tex or .docx, run: python "$CLAUDE_PLUGIN_ROOT/scripts/detect.py" "<file>" and read _metrics.ai_tell_score. Pass the actual file path so format-specific extraction is used. If the band is worse than the target - clean or light tells (score <= 40) - fix only unnecessary prose, at most two passes, preserving facts and format. Re-score the saved result. For a deep rewrite, invoke the sloptrim skill.
Edit documents with a format-aware tool. Never redirect detect.py --clean over an Office file, EPUB or notebook: it prints extracted text, not a rebuilt document. In LaTeX, preserve commands and math; the lexer handles common syntax only.

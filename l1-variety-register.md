# L1 Variety Register
**Lessons_ASKLEO · 26 July 2026 · Revision 3 · Supersedes revision 2 in full — revision 2 (MD5 `b8c7e066b54ef1840eccefe5cc54c12c`) is withdrawn and must not be cited. Revision 1 (`942d00a3ed253fe4d366c7dc8ec7c75b`) remains withdrawn from revision 2 and stays cited only in supersession history.**
**Required by clause 3(a) of the L1 Equivalence Principle (ratified, revision 1, MD5 `ab8e118df34297c060050c97f28693ee`). Pairs with `l1-reviewer-specification.md` (MD5 `a1e0159936ce2722edda1e281ec25c13`) — check 2 of that document reads its decisions from this one.**
**Implements the L1 Variety by Country directive (owner, 24 July 2026, via Genesis; ratified by Constitution_ASKLEO 25 July 2026; MD5 `d5a13fa0e96bc98dae15b0d94401e8ca`).**

## Why this revision exists — trigger-fired, not preference

Revision 2 named, in advance, the evidence that would reopen it. Reopening trigger 1 read: *"A base-variety assignment found to differ from `LANGS` in the code — reopens that assignment only."* Between ratification (25 July, `App.jsx` at `8fd3e3d5…`) and Lessons' independent LANGS re-run (26 July, `a8ab093d…`), the `zh-Hant` key has landed under §13.3, and script has become a routing axis for Chinese in code. This is trigger 1 firing as written on the Chinese section: a new `LANGS` key exists that revision 2's Chinese section explicitly recorded as "not yet implemented in code". This revision is that reopening, scoped precisely to what the trigger admits — the Chinese section, and no more — and the register's standing item for Lessons' independent re-run is discharged inside it. The revision is not a fresh reading or a change of taste; the base-plus-country model, the fallback rules, and every non-Chinese base assignment carry over from revision 2 untouched.

Two further items are folded into the same batch, because each new revision breaks the constitutional citation and one break is cheaper than three: the Macau one-liner held from the country-list-v1 flag (ruled correct for the next legitimate revision), and the Chinese base clearance for `zh`, ruled by owner 25 July via Genesis, which discharges revision 2's Constitution flag.

## Verification

Verified against `App.jsx` MD5 `8fd3e3d5287cf78ee77c7f983d715a80` (7,177 by `wc -l`; 7,178 displayed) at ratification, and re-verified against `App.jsx` MD5 `a8ab093da14c4f9c2b88ef509060a266` (7,517 by `wc -l`) at revision 3.

**Attribution, recorded honestly.** The `LANGS` inspection at `8fd3e3d5…` was performed by Constitution_ASKLEO as a condition of ratifying the directive, which required each base assignment to be confirmed against the code and not against any description. Its confirmed findings, carried into this register: `LANGS` (line 14) holds eight language keys — `zh`, `es`, `pt`, `fr`, `de`, `sv`, `ja`, `ko` — each carrying `native`/`english`/`hello` only, with no variety key, no country key, and no country-to-variety map; `LANGS.zh` is a single key (`简体中文` / Chinese (Simplified)) with the Hans/Hant split not yet landed in code; country is captured as free text and reaches the AI prompt chain as free text (sites at lines 4749, 4860, 4886 at this checksum), while fixed L1 UI strings render off `LANGS[profile.lang].native` (sites at lines 5428, 5538), keyed on language only. Lessons_ASKLEO could not independently re-run this inspection on 25 July because the project mount did not expose `App.jsx` that session.

**Lessons_ASKLEO independent re-run — 26 July 2026, `App.jsx` MD5 `a8ab093da14c4f9c2b88ef509060a266` (7,517 lines by `wc -l`).** The standing item is discharged here.

*Confirmed unchanged at revision 3's checksum:*
- No variety key inside any `LANGS` object, no country key inside any `LANGS` object, no country-to-variety map. Each key still carries `native`/`english`/`hello` only.
- Country reaches the AI prompt chain as free text at three sites — currently lines 4749, 4865, 6698. Site 4749 is unchanged from ratification; 4860 → 4865 is normal code drift; 4886 → 6698 is a *new* downstream consumer, which strengthens the free-text finding rather than weakening it. The free-text ingestion pattern is confirmed.

*Material finding — recorded honestly, and the reason for this revision:*
- **`LANGS` now holds nine keys, not eight.** A `zh-Hant` key (`繁體中文` / Chinese (Traditional)) has landed alongside `zh` via §13.3, code-comment-dated 26 July 2026. The picker presents `zh` and `zh-Hant` as ordinary equal rows with no grouping or "variants" heading; existing `zh` records are unchanged (no migration). Script is now a routing axis for Chinese in code, and reopening trigger 1 fires on the Chinese section. The Chinese section below is rewritten to reflect this. The other eight base assignments in `LANGS` are unchanged and carry over from revision 2 untouched.

*Historical supersession — recorded so the record is complete:*
- The fixed-L1 render sites at 5428/5538 anchored to `8fd3e3d5…` describe state before §13.4a's empty-data mechanism, which Constitution endorsed at `App.jsx` MD5 `238f897adf89145f23a052fa235b07e1`. `HELLO_L1 = {}` (currently line 6093) with render guard `{HELLO_L1[lang] && …}` (currently line 6126) now suppresses the identified surface: an empty object renders no L1 line and the student sees the English welcome only. The `.l1-line` CSS class (currently line 7316) survives as a dead rule per Constitution's own endorsement note. The ratification-time finding — that fixed L1 UI strings are `LANGS`-native-keyed — is not overturned; only the concrete sites have moved, and by an endorsed change from another chat. The ratification-time description holds as a historical anchor; the empty-data mechanism is its endorsed successor.

Line numbers above are anchored to their stated checksums and must be re-located by content at any other checksum.

---

## The rule — base variety plus country

Each language has one **base variety**: its default, always authored and always reviewed. Country-specific varieties are **enhancements layered on top**, selected by the country the student chooses at onboarding.

1. A student whose country's variety has been **authored and reviewed** receives that country-specific variety.
2. A student whose country's variety **does not yet exist** receives the language's **own base variety** — never a neighbouring country's variety.
3. **English is the fallback only where no variety of the language is ready at all.**

Worked example, from the directive. A Spanish speaker who selects **Spain** receives European (Peninsular) Spanish — the base. One who selects **Colombia**, once Colombian Spanish is authored and reviewed, receives Colombian Spanish. One who selects **Argentina**, before Rioplatense exists, receives the base — not Colombian, not English.

**What this preserves.** The honesty floor (L1 Authenticity) is strengthened, not relaxed: every fallback target is a *reviewed* variety, so no student ever reads unreviewed AI-generated L1. The register criterion (Equivalence Principle clause 3) is undisturbed and governs register *within* each variety. Sequencing is reshaped in unit, not spirit: review proceeds per variety; a country-variety does not ship until its native review completes; until then its country reads the base. Country-varieties are a roadmap, not a gate on shipping the base.

## The code position — what routes today, and what does not

Two different paths already exist in the code, and only one of them can route by variety today.

**Generated content routes now.** Country reaches the four-stage lesson chain as free text, and the model interprets it — which is why the Colombian present-perfect result worked before any of this was ruled. Lessons are already variety-sensitive.

**Fixed L1 UI strings do not route yet.** They render off `LANGS[profile.lang].native`, keyed on language only. There is no country-to-variety routing for fixed strings in the code at ratification, and none at revision 3's checksum. The `zh-Hant` split adds a new *script* routing axis for Chinese but does not add country routing for fixed strings — that remains roadmap.

**This gap is recorded as the directive's own premise gap, resolved as roadmap.** The routing signal the directive assumes — the student's country — *is* captured and stored; it is simply not yet wired to fixed-string rendering. The directive's reopening condition 2 concerns the signal not existing at all, which is not the case. Consequence: **the base variety ships regardless**, exactly as it would have under one string per language, and country routing for fixed strings is build roadmap (directive new-work items 1–2: a country→variety mapping per language, and a decision — flagged for NEWDESIGN and NEWCODING once Constitution defines the mapping — on whether country capture becomes structured or stays free text with a mapping layer). Nothing in this register blocks on that build.

## The register

**Base varieties below are the eight ratified as clear to enter review, plus `zh` cleared by owner ruling 25 July.** *Register decided* means an owner ruling has named the form and check 2 of the reviewer specification applies it without reopening; *reviewer decides* means the first reviewer of the variety makes the decision under check 2 and it becomes binding on every string in that variety.

| Lang | Base variety | Register | Status |
|---|---|---|---|
| **(app voice)** | **British English** | n/a | Not a `LANGS` key — this is the app's own voice, per the project's British/Australian English standard. Recorded here so the base list is complete. |
| **es** | **European (Peninsular) Spanish** | **Reviewer decides** (check 2). The reviewer specification itself anticipates Peninsular *tú* as very likely — and notes that its differing from a future Colombian *usted* is correct and expected, not an inconsistency. | **Clear to enter review** |
| **pt** | **European Portuguese** | **Reviewer decides** (check 2). | **Clear to enter review** |
| **de** | Standard German (Germany) | ***Sie*** — decided, owner ruling 22 July. Carries over: the variety is unchanged by this revision. | **Clear to enter review** |
| **fr** | Metropolitan French | ***vous*** — decided, owner ruling 22 July. Carries over. | **Clear to enter review** |
| **ja** | Standard Japanese (Tokyo) | **です/ます** — decided, owner ruling 22 July. Plain form out of scope entirely, every string, no exception. Carries over. | **Clear to enter review** |
| **ko** | South Korean (Seoul standard) | **해요체** — decided, owner ruling 22 July. Carries over. The 합쇼체 self-introduction question travels into review (below). | **Clear to enter review** |
| **sv** | Swedish (Sweden) | ***du*** proposed — one native confirmation, taken inside review, not before it. *ni* is archaic. | **Clear to enter review** |
| **zh** | **Mainland Mandarin, Simplified script** | 你 vs 您 — **reviewer decides** (check 2), Mainland reviewer. | **Clear to enter review** — owner ruling 25 July via Genesis; revision 2's Constitution flag discharged |
| **zh-Hant** | *Base assignment open* — flagged to Constitution with revision 3 (see Chinese, below) | Register decision follows the base assignment; taken by a reviewer of the assigned variety under check 2 | **Open — reopening trigger 1 fired on this section** |

**Costs dissolved — not transferred.** Revision 1 recorded two accepted costs of one string per language: a Peninsular Spanish speaker receiving Colombian register, and a European Portuguese speaker receiving Brazilian register. Under this directive those costs are **eliminated, not merely accepted**: a Spaniard reads Peninsular, and a Colombian reads Colombian once Colombian Spanish completes review. The blocking "which single variety do we write for" question for Spanish and Portuguese dissolves with them — which is why both now sit in the cleared column above rather than blocking as they did in revision 1.

**The new consequence, recorded with the same honesty.** The bases are the European varieties, and Colombia and Brazil are the dominant Spanish- and Portuguese-speaking ELICOS cohorts in Australia. Until Colombian Spanish and Brazilian Portuguese complete review as country-varieties, those students read the base — a Colombian receives Peninsular register from Leo, a Brazilian receives European Portuguese. Under the directive's fallback asymmetry this is the mild and temporary failure, and it is bounded: it ends the day each country-variety's review completes. It is recorded here so it is not rediscovered as a bug, and it is why those two varieties head the enhancement roadmap below rather than sitting on it somewhere.

## Basis of variety choice — condensed from revision 1, still binding

A string is written for a **named** variety, and the register is what a teacher of that variety uses. The alternative basis — choosing the form safe across all varieties served — was withdrawn in revision 1 and stays withdrawn: it manufactures the translated, nobody-speaks-this register the Equivalence Principle exists to prevent. "Neutral" and "standard" are not varieties. Clause 3(b) governs only where no reviewer of the named variety is available; it never governs which variety to write for. This basis now applies identically to bases and to country-variety enhancements.

## Chinese — the split has landed in code

**§13.3 has landed since ratification.** `LANGS` holds two Chinese keys as of `App.jsx` MD5 `a8ab093da14c4f9c2b88ef509060a266`: `zh` (`简体中文` / Chinese (Simplified)) and `zh-Hant` (`繁體中文` / Chinese (Traditional)). The picker presents them as ordinary equal rows — no grouping, no "variants" heading — per the §13.3 code comment; existing `zh` records are unchanged, so no record migrates or breaks. Script is now a routing axis for Chinese. Revision 2's "when the split lands" clause has resolved to "the split has landed" and is discharged.

**Bases per key:**

- **`zh`** — Mainland Mandarin, Simplified script. **Cleared to enter review** by owner ruling 25 July via Genesis. Review needs a Mainland reviewer plus the check-2 register decision (你 vs 您). Revision 2's Constitution flag for this clearance is discharged; the Reviewer Recruitment table below is updated accordingly.

- **`zh-Hant`** — Traditional script. **Base assignment open, escalated to Constitution with this revision.** Rule explicitly: is the `zh-Hant` base **Taiwan Mandarin, Traditional** — the natural default per revision 2's own prescription that Hong Kong readers are served by Traditional script — or a different assignment? Register decision (你/您) taken separately from `zh`'s by a reviewer of the assigned variety under check 2, since Mainland and Taiwan usage of 您 differ; that decision does not track `zh`'s.

- **Hong Kong** is served by `zh-Hant` at the country routing per §13.2's country-list-v1 (MD5 `309787995b4269243c7c71300249ca2c`), with **lexical divergence flagged to the `zh-Hant` reviewer** rather than split further.

- **Macau** is served by `zh-Hant` on the same basis, **by analogy with Hong Kong**. Revision 2 did not name Macau explicitly; the country list flagged this as one-line register housekeeping to hold for the next legitimate revision, and this revision is that revision — Macau is now recorded here rather than by external note.

**Reopening scope, recorded precisely.** The reopening under trigger 1 is scoped to `zh-Hant` — a new key needing a base decision. The Simplified base's clearance stands untouched: it was ruled explicitly on 25 July as separable from any future Traditional decision. No other section of this register reopens.

## Cantonese — closed here, unchanged

Not added to `LANGS` (ruled 22 July, undisturbed). Cantonese readers read Traditional Chinese, so the script split — now landed — serves them in writing; spoken variety is captured as a question on the get-to-know page. Routed to NEWDESIGN; closed in this register.

## The Korean reviewer question — travels into review

The base register is 해요체 by owner ruling. The existing draft welcome line mixes tiers — *저는 Leo입니다* is 합쇼체, *도와드릴게요* is 해요체 — a mixture common and often unremarkable in natural Korean self-introduction. Check 2 puts the decision with the reviewer: **may a 합쇼체 self-introduction stand inside an otherwise 해요체 register, or must the introduction move to 해요체?** Whichever is decided binds every Korean string.

## Reviewer recruitment — the concrete list, updated by revision 3

Check 1 requires a speaker of the *named* variety. The bases come first, because nothing in a language ships without its base review; the dominant-cohort varieties follow immediately as the first enhancements. Chinese changes twice from revision 2's table: Mainland Mandarin loses its "conditional on the flag" caveat because the clearance was ruled 25 July, and a Taiwan Mandarin row moves from "on the split landing" to "open on the `zh-Hant` base ruling" because the split has landed.

| Needed | For | Priority |
|---|---|---|
| European (Peninsular) Spanish | The Spanish **base** — register decision + full review | **First** |
| European Portuguese | The Portuguese **base** — register decision + full review | **First** |
| Mainland Mandarin | The `zh` base (你/您 + review) — clearance ruled 25 July | **First** |
| Colombian Spanish | **First country-variety enhancement** — the dominant Spanish cohort; ends the recorded temporary consequence for Colombian students | **Second, immediately behind the Spanish base** |
| Brazilian Portuguese | **First Portuguese enhancement** — the dominant Portuguese cohort | **Second, immediately behind the Portuguese base** |
| Swedish | Base review including the *du* confirmation | Second |
| South Korean | Base review including the tier question | Second |
| Standard German, Metropolitan French, Standard Japanese | Registers decided; reviewers still required for checks 3–5 | Third |
| Taiwan Mandarin (candidate for `zh-Hant`) | `zh-Hant` register + review; also judges lexical divergence for Hong Kong and Macau readers | **On the `zh-Hant` base ruling** |

## What blocks what

**Nothing is variety-blocked any more.** Revision 1's blocked column — all Spanish, all Chinese, Swedish on a confirmation — is dissolved by the directive for Spanish and Portuguese and absorbed into review for Swedish and Korean. Every ratified base may enter review now; `zh` joins them under the 25 July clearance; the sole structural gap is the `zh-Hant` base assignment.

**Everything remains review-gated.** No string in any variety ships before that variety's native review completes with the reviewer holding `l1-reviewer-specification.md` — the honesty floor, unchanged and now biting harder, since every fallback target must itself be reviewed.

**The queue** — the ~80-string queue and the 64 motivational strings proceed **per variety, as each base review completes**, never as one body. Country-variety enhancements re-run the same per-variety process on top.

**The welcome screen** — the eight drafts in the ratified principle document predate both this register and the base-variety assignments (the Spanish draft, for instance, predates the Peninsular base). None may enter review as-is; re-drafting against the named base is the first work item per language as each base's review opens.

## Evidence that would reopen this revision

Recorded at the time of decision, per standing principle. Revision 3 carries revision 2's five triggers unchanged and adds one clarifying trigger to make the current firing pattern explicit for future revisions.

**From the ratified directive, governing the model itself:**
1. A base-variety assignment found to differ from `LANGS` in the code — reopens **that assignment only**. *Fired at revision 3 on the Chinese section, scoped to `zh-Hant`.*
2. Country capture shown to be genuinely unavailable where L1 strings render — i.e. the routing signal the directive assumes does not exist in the code at all — reopens **the whole directive**, its premise having failed. *Partially examined already:* the fixed-string gap is recorded above as a premise gap resolved as roadmap, because the signal exists and is merely unwired; this condition concerns the signal's absence, not its wiring.
3. A served country-variety unable to secure native review within a reasonable horizon, forcing a standing fallback to base — reopens **the sequencing clause only**, not the rule.

**Carried and adapted from revision 1, governing individual entries:**
4. Real student-origin data showing a different variety dominant for a language — under this model it no longer reopens the base choice; it **re-prioritises the enhancement roadmap** for that language.
5. A reviewer of a named variety reporting that its recorded register reads wrongly to the cohort it was written for — settles immediately for that variety, no further evidence needed.

**Added at revision 3 for future clarity:**
6. A new `LANGS` key landing in code without a base assignment recorded here — reopens **that key's entry only**, treated as trigger 1 by legitimate extension (a new key is a state of `LANGS` differing from the register's assignments). Recorded explicitly so a future Lessons chat doesn't debate whether trigger 1 covers this case; it does. *This trigger's first invocation is `zh-Hant` at revision 3.*

Absent one of these, the decisions stand and are not reopened on preference.

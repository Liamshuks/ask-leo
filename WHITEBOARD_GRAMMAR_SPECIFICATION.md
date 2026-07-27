# Ask Leo — Whiteboard Grammar Specification

**NEWDESIGN_ASKLEO · W-01 · 27 July 2026 · Specification only. No code.**
Symbols only, never line numbers. Phase 1 is binding for build; Phase 2 is direction, held.

---

## 0. State verification

`App.jsx` — **8,235 lines** (`wc -l`), MD5 **`3774826111b5e3da1965307c8100dab8`**. The file has grown ~1,077 lines since the 25 July close (`fe9d4bc0…`); this specification is authored against the 27 July state. **NEWCODING must re-verify the checksum before building and hard-stop on mismatch.**

Verified on disk this session:

* `FRAME_PATH` — quoted verbatim in §3.1. Frozen.
* `WhiteboardLogo` — three-tier render; letters (`LETTER_PATHS`) are separate paths from the frame, so a frame-only render at any size **reuses the constant without touching it**.
* `StageComplete` and its CSS — `scRing` 0.5s ease-out, `scMark` 0.35s at +0.38s, `scRise` (opacity + 6px rise), countdown bar, reduced-motion collapse to final state.
* The logo cascade — **130ms per-item stagger**. This is the app's established rhythm.
* `GrammarSection` — the surface being replaced: prose triplet (*What it means / The form / When to use it*) plus an inline-styled HTML `reference` table. The code adjacent to the planner already records the defect in its own words: *"the pattern itself fails regardless of word difficulty."*
* The planner's existing grammar contract: `g.point, g.meaning, g.form, g.usage, g.examples[], g.reference[]{function,form,example}`.
* `textSeed()` — an existing content-derived deterministic seed utility. Reused in §4.3.
* P2 tokens: `--bg-warm #FAFAF8`, `--bg-card`, `--text-primary/-secondary/-tertiary`, `--divider`, `--space-1…7`, Inter type scale, `--leo-green #2A7C6F`.

---

## 1. The governing idea

The grammar surface **is Leo's whiteboard** — the same shape that identifies the product becomes the surface the student learns on. Not a picture of a whiteboard above the grammar; the grammar rendered *as* a teacher's board: handwritten, colour-coded, structural, sparse.

Constitutional alignment, stated once: this is the **Toolbox Test** answered at the surface level — a board is a teacher's instrument; a formatted panel is an LMS's. Every ruling below serves that reading.

### 1.1 The design DNA (extracted from the reference boards — influence, never copies)

Studied: the articles board (astronaut), adjectives -ed/-ing, the passive tense grid, questions-with-auxiliaries, quantity, minimal pairs, phrasal verbs, third conditional, and the vocabulary boards. What generalises:

1. **Colour encodes grammar.** In every reference, colour is role, not decoration: structural labels in blue, the target form in red, examples in a distinct colour, marginal teaching voice in orange. The eye learns the structure before reading a word.
2. **The substitution table is the core device.** Numbered slots, swappable items per slot, plus-signs between columns, braces bundling alternatives — the single most powerful thing on any of the boards. The café lesson's flat run-on line (*"I'm + name / I'm from + country"*) failed because it removed exactly this: the columnar, swappable structure.
3. **Structure is drawn, not described.** Boxed target words, curly braces, framed form patterns. Prose is what the board exists to avoid.
4. **Arrows carry relationship and transformation.** Active→passive, branching from a rule to its cases, pointing from a word to its note.
5. **Headings are underlined in a second colour.** A small, unmistakably teacher-handed habit, visible on nearly every reference board.
6. **✓ and ✗ mark forms.** *Take it off ✓ / Take off it ✗.* Acceptability of language, drawn in one stroke.
7. **The hand is human and imperfect.** Slight tilt, uneven baselines, a board that reads as "the teacher was just here".
8. **Sparse.** The best boards hold few words and generous clean space, with drawings anchoring one area — never wallpaper.

No specific reference board, layout, or drawing is reproduced. A design that only fits one grammar point has failed (§6 makes this testable).

---

## 2. Scope and migration

**Phase 1 (this document, binding):** the board surface, hand, colour system, and structural devices — table, box, brace, arrow, note, example marks. No bespoke per-lesson art. Ships without the image pipeline.

**Phase 2 (§9, direction only, HELD):** illustrated mnemonics and sketched objects. Dependent on the image-rendering capability whose cost/latency decision is still pending with NEWCODING. Not specified for build.

**Migration ruling:** the renderer accepts the new `board` contract (§5) when present and valid, and **falls back to the existing prose fields when it is not**. The prose surface is retained as fallback, not deleted — it is also the accessibility text (§7). No lesson can render broken during the transition, and no placeholder content is ever shown.

---

## 3. The board surface

### 3.1 The frame is the frozen logo shape, reused verbatim

```
FRAME_PATH = "M 420,548 L 49,548 L 359,317 L 0,527 L 0,0 L 796,0 L 796,548 L 420,548"
viewBox      = "-3 -3 802 590"
```

**Ruling: a new frame-only component (working name `BoardFrame`) renders `FRAME_PATH` at any width, importing the existing constant. It contains no letters.** This is motif-as-frame: the geometry is not redrawn, rescaled non-uniformly, edited, or approximated. Uniform scaling only. If build discovers that delivering this specification requires any change to the frozen coordinates, **stop and route to Genesis** — but none is anticipated: the existing `WhiteboardLogo` already proves frame-only rendering (its own mid tier), and the constant is shared, not copied.

Stroke: reuse the `wb-frame` stroke treatment. At board scale, if the scaled stroke reads too heavy or too thin, apply `vector-effect="non-scaling-stroke"` — a rendering attribute, not a geometry change.

### 3.2 The three zones of the board face

The frozen shape gives the board a fixed anatomy, and the reference boards give each region a job:

* **The writing band** — full width, from 7% to 55% of the board's height. All Phase 1 content lives here.
* **The illustration reserve** — the clear lower-right block (roughly x 55–94%, y 58–90%), where every reference board puts its drawing (the astronaut, the tree, the portrait). **Phase 1 leaves it empty. It is Phase 2's home**, reserved now so illustrated grammar arrives without reflowing anything.
* **The pointer region** — the lower-left, crossed by the frozen tail. Never receives content. A real teacher leaves board space around a fixed feature; so does Leo.

Clean space is part of the design, not a bug to fill. This is the sparse principle made spatial.

### 3.3 One board holds one idea — overflow starts a new board

The frame's aspect ratio (802:590) is fixed, so content must fit the writing band; it cannot stretch the board. **Ruling: when a grammar point's elements exceed one writing band, the renderer splits at an element boundary and starts a second board.** Boards stack vertically with `--space-4` between them. Maximum three boards per grammar point (validator-enforced, §6); at A1 the budget makes one board the norm.

This is what a real teacher does — fills a board, teaches it, starts the next — and it is deterministic renderer behaviour, trusting nothing generated. Sequential presentation with a "wipe" transition is noted as a possible later enhancement, not Phase 1: stacked boards are the simplest solution that achieves the educational goal.

**Reopening condition (named at decision time):** if live A1 testing shows routine auto-splitting beyond two boards, the fixed-ratio ruling returns to Genesis to weigh frame fidelity against content density.

### 3.4 Board face

* Face fill: `--board-face: #FCFCFA` — a half-step cooler than `--bg-warm`, so the board reads as an object *on* the page.
* No wood-grain, no fake screws, no photo-realistic texture. The logo is line art; the board speaks the logo's language. The frame's drawn line **is** the board's edge.
* No drop shadow beyond what existing cards use; if cards carry none, the board carries none.

---

## 4. The hand

### 4.1 Typeface

**Ruling: the board hand is `Kalam` (Google Fonts), regular for body, bold for headings, loaded through the same pipeline as Inter and Fraunces.** Fallback stack: `'Kalam','Patrick Hand',cursive`.

Why Kalam and not a showier hand: the readers are A1–C2 learners, many reading a second script. Kalam is upright, unjoined, and unambiguous letter by letter — close to the handwriting students are taught to produce — while still being unmistakably a human hand. Caveat and similar cursive faces are rejected: joined forms and stylised *r/v/s* are a legibility tax an A1 reader should not pay. This is *Always Consider the Student's Mind* applied to a font file.

The board hand is used **only on the board face**. Everything outside the frame (section shell, buttons, blurbs) remains Inter per the P2 system. The board is the one place the product breaks its own typography — that contrast is what makes the board read as an object from another register: the teacher's, not the interface's.

### 4.2 Sizes

* Board title: 21px bold (Kalam renders small; sizes are tuned up accordingly).
* Body/rule/table text: 16px; **legibility floor 15px rendered** — the layout may never shrink text below it to force a fit; it splits boards instead (§3.3).
* Notes (§5.7): 14px minimum, bold, because they are short.

### 4.3 Imperfection — deterministic, block-level, subtle

* Each element (never each letter) carries a rotation of **±1.2° maximum** and a baseline offset of **±1px**, derived from the existing `textSeed()` of that element's own text. Deterministic: the same board renders identically on every visit — a board that shimmers between sessions is a Continuity Integrity defect in miniature.
* Hand-drawn strokes (underlines, boxes, braces, arrows) waver: 2–3 shallow curve segments approximating a straight line, never ruler-straight, never scribble.
* Reduced motion does not remove imperfection — it is static styling, not animation.

---

## 5. The colour system and the structural devices

### 5.1 Marker tokens — a closed content palette

Five markers, defined as new tokens scoped to the board surface. They are **content colours** — the teacher's pens — deliberately separate from UI tokens (`--color-error`, `--leo-green`), because a marker must never drift when a UI state colour is retuned, and the board must not look like interface.

| Token | Value | Role — fixed across every lesson, forever |
|---|---|---|
| `--marker-black` | `#2B3037` | Base writing: content words, neutral parts of examples |
| `--marker-blue` | `#2456A8` | **Structure**: headings' underlines, slot labels, grammatical category names |
| `--marker-red` | `#C43B2E` | **The target**: the form element under focus; warnings; ungrammatical ✗ |
| `--marker-green` | `#1E7A4E` | **Language in use**: example sentences that model the point; ✓ |
| `--marker-orange` | `#B5690F` | **The teacher's margin voice**: notes, braces, tips |

All five meet WCAG AA against `--board-face` at 15px+ (orange is deliberately darkened from marker-orange reality to `#B5690F` to pass; a note that fails contrast fails the student it was written for).

**Colour is meaning, so meaning cannot live in colour alone.** Every role pairs with a non-colour cue: structure is positional (labels, underlines), the target is also boxed or underlined, acceptability carries the ✓/✗ glyph itself. A colour-blind student loses no grammar.

**Budget: at most four markers on any one board.** Black and blue are always available; red, green, and orange enter only when the point uses their role. Five colours on one board is decoration; the references never do it.

### 5.2 On ✓ and ✗ — scope of the P-03 palette ruling

P-03 §3 prohibited green/red coding for **observations of the student's performance**. That ruling stands untouched. Here ✓/✗ mark the **acceptability of language forms** — *Take it off ✓ / Take off it ✗* — which is teaching content, the oldest device on any grammar board. The distinction is recorded so neither ruling is misapplied to the other: green/red may mark what English does, never what the student did.

### 5.3 `BoardTitle`

The point name in Kalam bold, with a hand-drawn underline in `--marker-blue` (the two-colour teacher habit from §1.1.5). Produced automatically from `g.point`. One per board; on split boards (§3.3), continuation boards render a smaller title with "…continued" suppressed — the same title, re-written, as a teacher rewrites a heading on board two.

### 5.4 `SubstitutionTable` — the core device

The reason this specification exists. Columns are **slots**; each slot has a label (blue, small, above) and stacked swappable items (black); slots are joined by hand-drawn `+` signs; a slot with alternatives may bundle them with an orange brace.

```
   1              2            3
question  +  auxiliary  +  subject   +  main
  word         verb        pronoun      verb
 ─────        ─────        ─────       ─────
  Who        ⎧ do  ⎫         I          eat
  What       ⎨ does ⎬       you        like
  Where      ⎩ did  ⎭       they       work
```

Rules:
* **2–4 slots, 1–4 items per slot** — hard bounds (§6), set by the phone: at 380px the table is the width-limiting element, and a table that scrolls horizontally has stopped being a board.
* Slot numbering renders only when order is the teaching point (question formation: yes; a vocabulary pattern: no). Numbering that encodes nothing is decoration — the planner decides via a flag, defaulting off.
* The **target slot** (at most one) renders in `--marker-red` with a hand-drawn box. This is where the eye goes first, exactly as on the reference boards.
* Below the table, an optional single assembled example in green shows one path through the slots.

### 5.5 `Formula`

A form pattern as joined hand-drawn boxes: `[If + past perfect] , [would have + past participle]`. Pieces carry roles (structure blue / target red / plain black); literal punctuation between boxes stays black. This replaces `g.form`'s flat string presentation. 2–4 boxes.

### 5.6 `Example`, `Contrast`, and marks

* `Example` — one sentence in Kalam, role-coloured by span: the target morpheme or word in red (with a short red underline beneath just that span — the *-ed / -ing* device), neutral text black, whole-sentence models green. Optional trailing ✓ or ✗ per §5.2. Text renders through the existing `VocabText`, so tap-to-learn vocabulary survives onto the board — the affordance students already know must not vanish on the product's best surface.
* `Contrast` — two examples with a hand-drawn transformation arrow between (active→passive, statement→question). The arrow is `--marker-orange`, curved, single-headed. Maximum one contrast per board; transformation is a whole idea, not a list item.

### 5.7 `BoardNote`

The teacher's margin voice: a short tip in a hand-drawn orange cloud/bubble, anchored beside the element it annotates. **Twelve words maximum** (validator-enforced). One per board. Notes carry teaching voice, so their text is generated within Lessons' text-volume and register standards like all lesson copy — the device is design's; the words never are.

### 5.8 What Phase 1 deliberately does not include

No per-letter handwriting animation, no marker-squeak, no eraser smudge texture, no rotatable/zoomable board, no student writing on the board. Each was considered and cut: none teaches, all cost, and the Chanel rule applies — the board itself is the one bold thing; everything around it stays quiet.

---

## 6. The contract — how a generated grammar point maps in

### 6.1 The `board` object

The planner emits, alongside the existing prose fields (retained, §2), a `boards` array:

```
boards: [
  { elements: [
      { type:"title",    text }                                        // exactly one, first
      { type:"rule",     pieces:[{text, role}] }                        // ≤ 2 per board
      { type:"formula",  boxes:[{text, role}], joiner:"+"|"," }
      { type:"subTable", slots:[{label, items[], target?}], numbered?, example? }
      { type:"example",  spans:[{text, role}], mark?: "tick"|"cross" }
      { type:"contrast", from:{spans}, to:{spans} }
      { type:"note",     text }                                         // ≤ 1 per board, ≤ 12 words
  ]}
]
role ∈ "plain" | "structure" | "target" | "model"    →    black | blue | red | green
```

`illustration` is a **reserved type name** for Phase 2. The Phase 1 validator rejects it like any unknown type; reserving the name now means Phase 2 adds a type, not a reshape.

### 6.2 Validation — never trust generated content

A strict validator runs at **the same two enforcement points as `CEFR_CONSTRAINTS`** (first pass and validation-retry). Hard bounds:

* ≤ 3 boards per grammar point; ≤ 5 elements + title per board
* Word budget per board: **A1 ≤ 40, A2 ≤ 55** (B1+ bounds are authored when B1 boards are first generated — *Depth Before Breadth*; numbers invented today for levels not yet live would be unverified facts in a ruling)
* `subTable`: 2–4 slots, 1–4 items each, ≤ 1 target slot; `formula`: 2–4 boxes; `note`: ≤ 12 words; `contrast`: ≤ 1 per board
* Roles restricted to the four named; unknown types or roles fail validation

**Any validation failure falls back to the prose surface (§2).** The student always gets correct teaching; they never see a malformed board or an error.

### 6.3 The reusability test

Before this specification is marked done, the contract must be walked against five dissimilar grammar points on paper — e.g. articles (rule-cases), question formation (substitution slots), -ed/-ing adjectives (contrast + morpheme highlight), third conditional (formula), phrasal-verb separability (examples + ✓/✗). If any of the five cannot be expressed without a new element type, the contract is wrong and returns here. A design that only fits one grammar point has failed.

---

## 7. Accessibility

* The board renders as a `figure` with `role="img"` semantics at the container and a full structured text alternative: **the existing prose fields** (`meaning`, `form`, `usage`, `examples`) serve as the screen-reader content. One source of truth, already emitted, already correct — the fallback surface and the accessible surface are the same thing.
* Colour-role pairing per §5.1; contrast per the token table.
* `VocabText` taps on board text keep their existing keyboard and focus behaviour.

---

## 8. Motion

The board enters in the app's own vocabulary — nothing new is invented:

1. **Frame first**: the frame may reuse the existing `wb-frame-draw` stroke animation at board scale. If reuse at scale misbehaves, the frame appears with the elements instead — the draw is a grace note, not a dependency.
2. **Elements in write-order**: each element reveals with the `scRise` treatment (opacity 0→1, 6px rise, ~0.4s ease-out), staggered at **130ms** — the logo cascade's own rhythm, so the board and the brand move to the same beat.
3. **Reduced motion**: everything renders immediately in final state, matching the established pattern (`animation:none`, offsets zeroed). Imperfection (§4.3) remains; it is not motion.
4. No looping or ambient animation. The board settles and is still, like a board.

Exact easing curves and any timing tuned at build are verified against the live CSS at build time, not asserted here beyond what §0 read from disk.

---

## 9. Phase 2 — illustrated grammar (direction only; HELD pending the image pipeline)

The long-term differentiator: the mnemonic drawing — a character whose name *is* the sound, a sketched object that anchors a meaning, the picture that makes the rule unforgettable.

**Held because** it depends on the image-rendering capability whose cost/latency decision is pending with NEWCODING. Nothing in Phase 2 is specified for build. What is fixed now, so Phase 1 grows into it cleanly:

1. **The spatial home already exists** — the illustration reserve (§3.2). Phase 2 fills space Phase 1 deliberately keeps clear; no reflow.
2. **The contract seam already exists** — the reserved `illustration` type (§6.1).
3. **Copyright is a design constraint, not a review step.** The reference technique — a memorable character anchoring a sound or meaning — is the gold and is fully reusable. The specific characters must be **original creations owned by Ask Leo**. No licensed or branded characters, no recognisable likenesses of third-party IP, in any shipped asset, ever. (One reference board uses a famous cartoon mouse: brilliant in a physical classroom, impossible in shipped software. The lesson is the technique, not the mouse.)
4. **A recurring cast, not one-off art.** A small set of original characters that reappear across lessons — the same bee for /z/ every time — because recurrence is what makes a mnemonic a mnemonic, and a familiar cast is one more thread of "the same teacher every day". Character design is a future NEWDESIGN brief, issued only when the pipeline decision lands. The logo freeze does not cover new characters (they are new art, not the logo), but no character may imitate or approach the frozen mark.
5. Illustrations render in the board's line-art register (marker-weight strokes, the marker palette plus at most one fill accent) so hand and drawing read as one author: Leo.

---

## 10. Dependencies and routing

| Dependency | State |
|---|---|
| `App.jsx` mount access | **Available this session**; spec authored against `3774826111…`. NEWCODING re-verifies before build |
| Genesis review | Required before NEWCODING builds (owner's routing) |
| Planner emits `boards` | NEWCODING (prompt + schema); board **note/title wording standards** are Lessons' — the note device is design's, its voice is not |
| Kalam font loading | NEWCODING, same pipeline as existing fonts |
| Validator placement | Same seams as `CEFR_CONSTRAINTS`; wiring is NEWCODING's under Genesis's routing |
| Phase 2 | HELD — image pipeline cost/latency decision pending with NEWCODING |

## 11. For FAULTS (route once; check against the unconfirmed prior referral to avoid double-logging)

1. The grammar prose pattern defect — already recorded in-code in the planner's own notes; registration status with FAULTS unconfirmed
2. `gram-ref-table` renders with inline style objects, off-token — superseded by this specification; register so its removal is tracked, not silent
3. `.gram-form` becomes fallback-only under §2 — its eventual retirement is bound to the prose fallback's own retirement, not before

## 12. Definition of done (Phase 1)

1. `BoardFrame` renders `FRAME_PATH` verbatim, frame-only, at any width; zero changes to frozen constants
2. Content occupies the writing band only; illustration reserve and pointer region stay clear
3. Overflow splits to a new board at an element boundary; never shrinks text below 15px; ≤ 3 boards
4. Kalam loads and applies to board content only; block-level deterministic imperfection via `textSeed()`
5. Five marker tokens defined; role mapping exactly as §5.1; ≤ 4 markers per board; every colour role paired with a non-colour cue
6. All seven element types render; `subTable` holds at 380px without horizontal scroll
7. Validator enforces every bound in §6.2 at both enforcement points; invalid boards fall back to prose with no student-visible error
8. `VocabText` tap behaviour works on board text
9. Motion per §8; reduced-motion renders final state immediately
10. The §6.3 five-point reusability walk is recorded in the build handover
11. No Fraunces, no `.fade-in`, no legacy tokens on the board surface
12. Screen-reader path delivers the prose fields as the board's text alternative

---

**End of specification.**

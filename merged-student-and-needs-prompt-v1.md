# Merged Prompt — `student_and_needs` (load-speed sub-pass 4)
**Lessons_ASKLEO · 29 July 2026 · Authored against `App.jsx` MD5 `1a9b6beea3419b31cdae08d028e2d1dc`, 8,469 lines by `wc -l`, verified on disk this session.**
**Replaces the two prompts at lines 5751 (`student_analysis`) and 5761 (`needs_assessment`) with a single call. Stage 3 (blueprint, 5772), the blueprint retry (5786), and `_teacherNotes` (5779, 5792) are unchanged by design — see §3.**

---

## 1. The prompt, ready to drop in

Everything pedagogical in both current prompts is carried forward. The thematic-cluster paragraph, the defer-is-final instruction, the L1-variety paragraph, the PRIVATE-REASONING prohibition, the four answer bullets, and the seven Part One questions are preserved in substance and very largely verbatim. What is new is the sequencing scaffold and the citation requirement — the three guards.

```js
currentStage = "student_and_needs";
const merged = await askClaude(
  `You are Leo, one of Australia's most experienced ELICOS teachers. Twenty years of teaching international students.

You are going to do TWO separate pieces of thinking, in order, in one sitting. This is how you plan every lesson: first you think about the person, then — and only then — you decide what they need. THE ORDER IS A RULE, NOT A SUGGESTION. A needs decision made before the picture of the student is complete is a decision about a lesson, not about a learner.

FIRST write PART ONE, in full. THEN, and only once Part One is finished on the page, write PART TWO. Do not begin Part Two while Part One is still forming.

═══ WHAT YOU KNOW ABOUT YOUR STUDENT ═══

${teacherCtx}

─── PART ONE — STUDENT ANALYSIS ───

Use ONLY the student record above. Do not plan a lesson. Do not think about content. Do not look ahead to the vocabulary lists and error tallies further down this page — if something there suggests a lesson to you, that thought belongs in Part Two and nowhere else. Just think about this person:

- Who are they? What kind of learner?
- How long have I been teaching them? How are they progressing?
- What has improved recently? What am I proud of?
- What is still fragile? What keeps causing problems?
- How confident are they? Has their confidence changed?
- Did they have a mission? Did they try it?
- What is their emotional state likely to be today?

Write 5-8 sentences. Be specific. Use their name. This is your private thinking.

─── PART TWO — NEEDS ASSESSMENT ───

Begin only once Part One is written. Read your own Part One back as though a colleague wrote it, and be willing to disagree with it. Part One DESCRIBES; Part Two DECIDES. If Part Two only restates Part One in different words, you have not done Part Two.

Part Two must build FROM Part One. Name at least two specific things you wrote there — the student by name, and at least one named fragility, confidence observation, or mission outcome from your own analysis — and let today's decision follow from them. Do not introduce a need that Part One gives no evidence for. If you find yourself wanting to teach something Part One never observed, either the analysis was incomplete or the need is not real.

Here is the rest of what you need. None of it was available to you in Part One, and none of it may be used to rewrite Part One.

${reqLines ? "They have asked to work on:\n" + reqLines + "\n\n" : ""}STUDENT'S FIRST LANGUAGE: ${l1}
COUNTRY OF ORIGIN: ${country}

VOCABULARY — STILL FRAGILE (not yet mastered): ${fragileWords}
VOCABULARY — TO RECYCLE (taught but needs revisiting): ${recycleWords}
RECURRING ERRORS: ${errorTally}

If several fragile words share a theme — for example, medical vocabulary, financial terms, or housing language — consider whether that theme is itself the right lesson today. A cluster of words that have been fragile for many lessons may be fragile precisely because no lesson has created a natural home for them. Teaching the situation they belong to is better than scattering them one by one across unrelated lessons where they will never stick.

Do NOT repeat these recently-used contexts (choose something completely different): ${avoidCtx}.

Now decide what this student genuinely needs today. Do not plan the lesson.

IMPORTANT: You can only teach one thing well today. Choose ONE communicative objective. If this student has multiple needs — different grammar gaps, different skill weaknesses — pick the one that matters most right now and name what you are deliberately leaving for another day and why.

Consider how this student's specific L1 variety affects their English — not just "Spanish" or "Chinese" but the regional variety. A Colombian Spanish speaker and a Peninsular Spanish speaker make different errors. A Cantonese speaker and a Mandarin speaker have different phonological challenges. Teach accordingly.

Answer briefly — PRIVATE REASONING only. Do NOT plan the lesson, list a vocabulary set, or write any material (SMS, menu, sign, memorable moment, emotional goal, final task); the blueprint does all of that. Answer:

- The ONE communicative situation that helps them most right now, and why today.
- What you are deliberately NOT teaching today, and why — name it plainly; this defer decision is firm and the blueprint will respect it.
- The specific mistakes you predict, given their L1 variety.
- The grammar point that naturally arises from this situation.${cefrBlock(level, levelConstraint)}${singlePointBlock(level)}

Write 4-6 sentences of private reasoning. The ONE objective and the defer decision you make here are FINAL — the blueprint will build exactly this, not re-decide it.

─── HOW TO LAY OUT YOUR ANSWER ───

Respond with exactly two sections, in this order. Each opens with its heading alone on its own line, in capital letters, spelled exactly as shown. Nothing before the first heading. Nothing after the second section. No other headings, no preamble, no sign-off, no markdown formatting on the headings.

STUDENT ANALYSIS
(your Part One)

NEEDS ASSESSMENT
(your Part Two)`,
  { intent: "student_and_needs" }
);
```

---

## 2. The three guards — where each one lives in the wording

Genesis asked for confirmation each guard is genuinely present, not implied. Each is quoted from the prompt above.

### Guard 1 — explicit FIRST/THEN sequence, named as a rule

Present in three places, escalating:

1. *"You are going to do TWO separate pieces of thinking, in order, in one sitting."* — establishes two, and that order exists.
2. *"THE ORDER IS A RULE, NOT A SUGGESTION."* — capitalised, states it is a rule in the words Genesis asked for.
3. *"FIRST write PART ONE, in full. THEN, and only once Part One is finished on the page, write PART TWO. Do not begin Part Two while Part One is still forming."* — the literal FIRST/THEN with a completion condition.

Reinforced at the head of Part Two: *"Begin only once Part One is written."*

The rule is also given a **reason**, not just asserted: *"A needs decision made before the picture of the student is complete is a decision about a lesson, not about a learner."* Reasoned constraints hold better than bare ones, and this sentence names the exact failure mode the merge risks.

### Guard 2 — both outputs written visibly, separately labelled

Present in the layout block: exactly two sections, headings alone on their own lines, exact spelling specified, capitals specified, markdown on the headings forbidden (because `**STUDENT ANALYSIS**` breaks a naive split), nothing before the first heading, nothing after the second.

Reinforced by the Part One / Part Two structure of the instructions themselves — the model is not being asked to produce one piece of prose with an internal turn, it is being given two separate briefs with separate word budgets (5-8 sentences; 4-6 sentences).

### Guard 3 — the assessment builds FROM the picture

Present as a positive requirement, a countable one, and a negative one:

- Positive: *"Part Two must build FROM Part One."*
- Countable: *"Name at least two specific things you wrote there — the student by name, and at least one named fragility, confidence observation, or mission outcome from your own analysis."* This is checkable by a human reading the output, which matters for the reopening test in §5.
- Negative: *"Do not introduce a need that Part One gives no evidence for. If you find yourself wanting to teach something Part One never observed, either the analysis was incomplete or the need is not real."*

**A fourth guard, added by me, which Genesis did not ask for and should decide on.** The three guards protect sequence, visibility, and derivation. None protects against the merged call's distinctive risk: the model is now reading its own immediately-preceding output rather than text handed to it by a prior authority, and models are markedly less critical of their own recent output than of received text. The two-call architecture got that critical distance for free — Stage 2 met the analysis as given fact from outside itself. So Part Two opens with:

> *"Read your own Part One back as though a colleague wrote it, and be willing to disagree with it. Part One DESCRIBES; Part Two DECIDES. If Part Two only restates Part One in different words, you have not done Part Two."*

This is the strongest available counter to blur, and it is doing different work from Guard 3 — Guard 3 stops Part Two floating free of Part One, this stops Part Two collapsing into it. Both failure directions need a guard.

---

## 3. Labelling and splitting — split, do not repurpose

**Recommendation: split the merged output back into two variables immediately, and change nothing downstream.**

```
STUDENT ANALYSIS
<part one prose>

NEEDS ASSESSMENT
<part two prose>
```

Split on the `NEEDS ASSESSMENT` heading; strip the leading `STUDENT ANALYSIS` heading line from the first half. That reconstitutes `studentAnalysis` and `needsAssessment` as two strings in exactly the shape they hold today.

**Why this rather than passing the merged blob through as `_teacherNotes`:**

1. Stage 3's blueprint prompt (line 5772) composes its own headers — `STUDENT ANALYSIS:\n${studentAnalysis}\n\nNEEDS ASSESSMENT:\n${needsAssessment}`. Passing a blob that already contains headers would double them.
2. The blueprint retry (5786) does the same. Same problem.
3. `_teacherNotes` is assigned at 5779 and 5792 as `studentAnalysis + "\n\n" + needsAssessment`. If the two variables are reconstituted, that line is byte-identical to today and the three front-slicing consumers at 4210, 5638 and 5885 see exactly what they see now. If the blob is passed through instead, all three slices lose their first sixteen characters to the heading — a 200-character budget at `SpeakingSection` becomes 184, and the reviewer's student picture opens on a label rather than on the student.

So the merge should be invisible below the planner. One call replaces two; nothing else moves.

**Splitting requirements for CODE_ASKLEO** (implementation is CODE's call; these are the requirements the wording must be matched against):

- The split must tolerate the model adding markdown emphasis or a trailing colon despite being told not to — `**NEEDS ASSESSMENT**`, `## NEEDS ASSESSMENT`, `NEEDS ASSESSMENT:`. A tolerant line-anchored match rather than an exact string equality.
- The split must be on the **last** occurrence of the heading if more than one appears, not the first — the model may quote its own heading inside Part Two prose.
- **If the delimiter is absent, do not proceed silently.** A merged blob assigned wholly to `studentAnalysis` with an empty `needsAssessment` would send Stage 3 a lesson brief with no objective, no defer decision, and no predicted errors — and Stage 3 would invent all three. That is the exact failure the pipeline exists to prevent, and it would be invisible in the finished lesson. Recommended handling: one retry of the merged call with a short reminder that both headings are required; if the retry also fails, throw with `currentStage = "student_and_needs"` so the outer catch reports it honestly rather than shipping a lesson built on half a plan.
- Either half coming back empty or under roughly forty words should be treated as a missing delimiter, not a short answer.

**Mock AI:** `_MOCK_INTENT_HANDLERS` needs a `student_and_needs` entry emitting both headings, or `USE_MOCK_AI` development falls through to text matching with a console warning (line 1970). The two existing mock handlers can be concatenated with the headings between them. Note that the current `needs_assessment` mock reads the requested context with `/asked to work on: "([^"]*)"/` — the live prompt writes `They have asked to work on:\n${reqLines}` without quotes, so that capture is already not matching; worth CODE checking while it is in there.

---

## 4. Pedagogical concerns for Genesis to rule on

### 4.1 The information guard becomes instructional, not structural — this is a real loss

In the two-call architecture Stage 1 could not see the fragile-word list, the recycle list, the error tally, `avoidCtx`, or the CEFR constraints, because they were not in its prompt. In the merged call they are in context from the first token, and no wording changes that. The prompt forbids using them in Part One and names the temptation explicitly, but a forbidden-and-visible constraint is weaker than an absent one.

What survives structurally is real and worth saying plainly: the model generates Part One before Part Two, so the *output* sequence is genuinely ordered, and Part Two's citation requirement genuinely binds it to what Part One said. The claim Genesis should rule on is "sequence preserved, information isolation weakened", not "equivalent".

**Predicted concrete symptom if it degrades:** a Part One that mentions a specific fragile word or error pattern by name. Today's Part One cannot do that, because it has never seen the list. If live Part Ones start naming words from the fragile list, the isolation has failed and it is visible in the output.

### 4.2 Truncation risk lands on the wrong half

The merged response carries both halves in one generation — 5-8 sentences plus 4-6 sentences. If the response hits a `max_tokens` ceiling, the cut falls at the end, which is the **needs assessment**: the objective, the defer decision, and the predicted L1 errors. That is the half Stage 3 depends on most and the half whose absence is hardest to see in a finished lesson.

Two calls each had their own token budget and each could only truncate itself. Genesis should confirm with CODE that the ceiling on this call comfortably clears both halves before the pass ships, and the under-forty-words check in §3 should catch the residual case.

### 4.3 The saving may be smaller than ~10s

The merge removes one network round trip and one prompt-processing pass. It does not remove any output generation — the same two pieces of text are still generated, now sequentially within one response, and the merged prompt is longer than either original. The realistic saving is the round trip plus the second prompt's processing, not the second call's full 34.2s.

This is not an argument against the merge. It is an argument for measuring sub-pass 4 the way sub-pass 2a was measured before deciding whether the pedagogical cost in §4.1 was worth paying. If the measured saving comes in at four or five seconds rather than ten, that changes the trade materially, because the cost side is real.

### 4.4 Recommendation

**Proceed, with the four guards, and measure before treating the pass as settled.** The merge is defensible: the separation that matters most pedagogically is that the objective is decided *from* an established picture rather than alongside one, and Guards 1, 3 and 4 protect that in the output even though the input isolation weakens. But §4.1 is a genuine cost, not a managed one, and §4.3 means the benefit is not yet a measured number.

---

## 5. Reopening evidence

Genesis's condition — *if merging demonstrably degrades lesson quality in live testing, this pass reverts* — is right but not yet observable. These are the specific signals that make "demonstrably" checkable. Any one of them, seen twice in live output, reopens the pass:

1. **Part One names a word from the fragile or recycle list, or an error from the tally.** Today's Part One cannot do this. If it happens, information isolation has failed (§4.1).
2. **Part Two names no specific fact from Part One** — no name, no named fragility, no confidence or mission observation. Guard 3 has failed.
3. **Part Two restates Part One without deciding** — no single objective, or an objective given without a reason tied to the student. Guard 4 has failed.
4. **The defer decision is absent, vague, or hedged** (*"we might also look at..."*). The defer decision was firm in the two-call architecture; softening is the clearest single symptom of blur.
5. **Part One contains lesson content** — a context, a vocabulary set, a grammar point. Guard 1 has failed.
6. **The split delimiter is missing more than rarely** — a layout instruction the model does not reliably follow is not a guard.

Absent these, the pass stands. Measurement of the actual time saved (§4.3) is a separate question from quality and should be recorded either way.

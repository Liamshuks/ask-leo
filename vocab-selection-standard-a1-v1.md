# Vocabulary Selection Standard — A1
**Lessons_ASKLEO · 29 July 2026 · v1 · A1 only; A2–C1 follow the same shape once A1 is proven in live testing.**
**Peer specification to `CEFR_CONSTRAINTS`, `NARRATION_STANDARD`, `TEXT_VOLUME_STANDARD`, `SINGLE_POINT_DIRECTIVE`, `LOADING_MESSAGES` and `IMAGE_VS_WORD`. Injected into the planner via `vocabSelectionBlock(level)`.**

**Verification note.** Authored against `cefr-constraints-v1.md` (`5afcd36a61c1b6e79cf22d25bd16d362`), `lesson-tightening-v1.md` (`f1a6fbf403d9d1cdecc5e6762420ca8f`) and `narration-standard-v1.md` (`fbf9f746fa7824bae92d37f7e21a2583`), all verified on disk this session. `App.jsx` was read this session at MD5 `1a9b6beea3419b31cdae08d028e2d1dc` (8,469 lines) but is **not on the mount at the time of writing**; every statement about code below is anchored to that checksum and must be re-verified at the current one before building.

---

## 1. What this standard is for

`CEFR_CONSTRAINTS` governs whether a word is *at the right level*. Nothing governs whether it is *worth a slot*. Those are different judgements, and the second one is the one live testing is failing.

*Australia* is unimpeachably A1. It is also worthless as a vocabulary item: the student either already knows it or will never need it taught, it transfers nowhere, and it cannot be defined — only captioned. A level filter passes it. A worth filter must not.

The observed failure set — *hello, name, from, meet, Australia, Spain* — contains four distinct faults that need four distinct rules:

| Word | Fault | Why it cannot be fixed by better definitions |
|---|---|---|
| *from* | **Function word** | It has no lexical meaning to define. It is taught by the grammar point (*I'm from Spain*), not by a card. A definition of *from* at A1 is either circular or a grammar lesson in miniature. |
| *Australia*, *Spain* | **Proper noun** | Not vocabulary. The only available definition names the student or the lesson — *"the country Liam is in now"* — which is a caption, not a meaning. Zero transfer: knowing *Australia* helps with nothing else. |
| *hello* | **Day-one chunk** | Every A1 student arrives with it. A slot spent here teaches nothing. |
| *name*, *meet* | **Below-level / already-known** | Top-100 items an A1 student has before the first lesson. Not wrong, just not worth eight slots' worth of the student's attention. |

**The weak definitions are the symptom, not the disease.** A weak definition is a reliable signal that the word should not have had a slot. That makes definability the sharpest available test, and §4 makes it the centrepiece.

---

## 2. The standard

```
VOCAB_SELECTION_STANDARD.A1: {

  must_satisfy_all: [
    "CONTENT WORD — noun, verb, adjective, or a high-frequency adverb of time/manner/place. Content words carry meaning that a card can hold. Function words carry grammar and are taught by the grammar point.",
    "NEW BUT REACHABLE — the student plausibly does not have it yet, and it sits inside the A1 band (English Vocabulary Profile A1 tier, roughly top 750-1000 word families). Below-band words waste the slot; above-band words fail CEFR_CONSTRAINTS.",
    "TRANSFERS BEYOND TODAY — the word does work in situations other than this lesson's. A word useful only inside today's context is a prop, not vocabulary.",
    "SURVIVAL VALUE — an adult migrant in Australia could plausibly need this word in real life within the next fortnight. This is the A1 relevance test and it is strict.",
    "DEFINABLE AT A1 — its meaning can be given in one sentence using only A1 words, without using the word itself, without naming the student, and without referring to today's lesson. See section 4.",
    "PRODUCIBLE — the student will be asked to say or write it in today's lesson, in the final task or the mission. A word that appears on a card and nowhere else has not been taught, only shown."
  ],

  never_occupies_a_slot: [
    "PROPER NOUNS — countries, cities, suburbs, people's names, brand names, institution names (Australia, Spain, Sydney, Medicare, Woolworths). They may appear freely in the reading text, the dialogue and the final task. They may never take one of the eight slots.",
    "FUNCTION WORDS — prepositions, articles, pronouns, conjunctions, auxiliaries, determiners (from, the, a, in, and, but, my, is, do). Taught by grammar, never by card.",
    "GREETINGS AND DAY-ONE CHUNKS — hello, hi, goodbye, bye, please, thank you, yes, no, sorry. Assumed present on arrival. One exception in section 3.",
    "NUMBERS, DAYS, MONTHS, COLOURS — closed sets, assumed known. One exception in section 3.",
    "THE TARGET GRAMMAR IN LEXICAL DISGUISE — if the grammar point is 'I'd like + noun', then 'like' or 'would' may not take a slot. The grammar point is taught once, as grammar.",
    "WORDS THE STUDENT HAS ALREADY MASTERED — anything the record shows as mastered rather than fragile or due for recycling."
  ],

  composition_of_the_set: {
    nouns: "4-5 — concrete and imageable; the things of the situation",
    verbs: "2-3 — the actions of the situation, given in base form",
    adjectives: "1-2 — the describing words the situation actually needs",
    adverbs: "0-1 — only high-frequency and only where the situation needs it",
    fixed_chunks: "maximum 1, and only where the chunk is genuinely the lesson's target language (excuse me, over there, how much)",
    function_words: 0,
    proper_nouns: 0,
    note: "A set that is 6 nouns and 2 adjectives with no verbs describes a scene rather than teaching an action. Adult A1 students need verbs to do anything."
  },

  recycling_allowance: "Up to 2 of the set may be fragile or recycle-list words, and they should be chosen where today's situation gives them a natural home (see the thematic-cluster principle in the needs assessment). The remaining 6 or more are new. A set that is mostly recycled is a revision lesson wearing a new lesson's clothes.",

  count: "FOUR TO EIGHT items. Eight is a CEILING, not a quota. If the situation honestly supports five worthwhile words, teach five. Never invent a word to reach eight — padding is exactly what produces proper nouns and function words in the set.",

  do_examples: [
    "Buying fruit and veg at the market → tomato, onion, kilo, bag, fresh, cheap, weigh, choose (8: 4 nouns, 2 adjectives, 2 verbs; every one concrete, imageable, transferable, definable, and used in the final task)",
    "At the doctor → sick, pain, medicine, cough, tired, temperature, better, appointment (8: mixed, all survival-critical, all definable in A1 words)",
    "First conversations with a neighbour → neighbour, next door, quiet, noisy, borrow, lend (6 — the honest count for this situation; padding to eight is what produced 'Australia')",
    "Catching public transport → ticket, platform, late, next, miss, wait (6: two adjectives doing real work, two verbs the student must produce)"
  ],

  dont_examples: [
    "hello — day-one chunk; the student had it before the first lesson",
    "name — below band; already known; nothing to teach",
    "from — function word; belongs to the grammar point 'I'm from + country', not to a card",
    "meet — below band in this sense; the student has it",
    "Australia — proper noun; zero transfer; the only possible definition is a caption",
    "Spain — proper noun; same fault; also different for every student, so the set is not reusable",
    "The whole set above — 6 items, 0 legitimate; a set assembled from what the situation surfaced first rather than from what the student needs"
  ]
}
```

---

## 3. The two exceptions, stated precisely

Blanket bans would over-constrain, and CODE will implement whatever is written, so these are given exactly.

**Closed sets may take slots when they are the lesson's own objective.** A lesson whose communicative objective is *telling someone what day you can work* legitimately teaches *Monday, Tuesday, Wednesday…* — those are the target language, not padding. The rule is: closed-set items (numbers, days, months, colours) occupy slots **only when the communicative objective is that set itself**, and then they may fill the set. In every other lesson they are assumed known.

**Greetings may take one slot when register is the objective.** A lesson on formal versus informal greeting at work may teach one greeting item. One, not three, and only where the objective is the register distinction rather than the greeting itself.

**Proper nouns are not banned from the lesson.** *Woolworths*, *Medicare*, *Flinders Street* belong in the reading text, the dialogue, the authentic material and the mission — they are what makes a lesson feel Australian. The rule is narrow: they may not consume one of the four-to-eight vocabulary slots.

---

## 4. The definition standard — and the test that catches everything else

The `meaning` field of each vocabulary item must satisfy all of these:

1. **One sentence**, using only A1 words.
2. **Does not use the target word**, or a form of it.
3. **Does not name the student**, and does not refer to today's lesson or context. *"The country Liam is in now"* fails on both counts — it is a caption for one student on one day, not a meaning.
4. **Distinguishes the word from its near neighbours.** *"A kind of food"* fails for *tomato*, because it is equally true of everything in the fruit and veg aisle.
5. **Would still be true tomorrow, in a different lesson, for a different student.** This is the portability test and it is the strongest of the five.

**Why this doubles as the selection test.** Any word that cannot be defined to this standard should not have been selected. Run it as a filter before the set is finalised:

> Write the definition first. If the only definition you can write names the student, names the lesson, or restates the word, the word does not belong in the set. Replace it.

This is the single most useful line in the whole standard, because it converts an abstract judgement about worth into a concrete writing task with a visible failure.

---

## 5. `vocabSelectionBlock(level)` — the prompt text

Peer helpers read the constant and compose prompt text. This one follows the same pattern. Returns `""` for any level other than A1 until A2–C1 are authored.

```
VOCABULARY SELECTION — which words earn a slot (A1). Choose FOUR TO EIGHT items. Eight is a ceiling, not a target: if this situation honestly holds five words worth teaching, teach five. Never add a word to reach eight.

EVERY item must be ALL of these: a content word (noun, verb, adjective, or a high-frequency adverb); new to the student but inside the A1 band; useful beyond today's situation; something an adult migrant in Australia could need within a fortnight; definable in one A1 sentence; and produced by the student in today's final task or mission.

NEVER give a slot to: proper nouns (countries, cities, suburbs, names, brands — use them freely in your text and dialogue, but never as a vocabulary item); function words (from, the, a, in, my, is — these belong to the grammar point); greetings and day-one chunks (hello, please, thank you, sorry); numbers, days, months or colours unless the objective IS that set; the target grammar dressed as a word; or anything the student has already mastered.

SHAPE OF THE SET: 4-5 nouns, 2-3 verbs, 1-2 adjectives, at most 1 fixed chunk. Zero function words. Zero proper nouns. A set with no verbs describes a scene instead of teaching an action.

RECYCLING: at most 2 of the set may come from the fragile or recycle lists, chosen where today's situation gives them a natural home. The rest are new.

WRITE THE DEFINITION FIRST, THEN DECIDE. Each meaning is one sentence of A1 English that does not use the word itself, does not name the student, and does not refer to today's lesson. If the only definition you can write is "the country the student is in now" or "the word we use to say hello", the word has failed — remove it and choose another. A definition that would not still be true tomorrow, in a different lesson, for a different student, is not a definition.
```

---

## 6. Where it goes in the pipeline

**Stage 3 (blueprint) and the blueprint retry. Not the merged Stage 1+2 call.**

The needs assessment explicitly forbids listing a vocabulary set — *"Do NOT plan the lesson, list a vocabulary set, or write any material"* — and that prohibition is correct and should stand. Vocabulary is selected once, in the blueprint, after the objective is fixed. Injecting the standard earlier would invite the merged call to pre-commit to words before the situation is chosen.

Both blueprint sites need it, for the same reason `cefrBlock` and `singlePointBlock` are on both: the retry restates everything because `askClaude` is stateless. A retry without the standard would regenerate the fault it was retrying.

**Sits alongside the existing blocks** in the same composition position as `singlePointBlock(level)` and `imageRuleBlock(level)`.

**Interaction with `IMAGE_VS_WORD_A1`, stated so CODE doesn't read a contradiction.** That specification governs *how* a chosen word is taught — image, word, or both. This one governs *whether the word is chosen*. They agree by design: imageability is a selection signal at A1 precisely because concrete imageable words are the ones that satisfy the transfer and definability tests. Nothing here overrides the image rule; it narrows the input to it.

---

## 7. Concerns for Genesis to rule on

### 7.1 "Exactly 8" is the structural driver, and the standard cannot beat it

At `App.jsx` MD5 `1a9b6beea3419b31cdae08d028e2d1dc`, read this session, the blueprint prompt contains: *"Exactly 8 vocabulary items from your needs assessment. Every word must justify its place."* The second sentence asks for justification; the first makes it impossible when the situation holds fewer than eight.

Eight was ratified as a **cap**, for the mobile matching UI. The prompt has turned it into a **quota**. A planner told to produce exactly eight from a four-word situation will produce four good words and four proper nouns — which is precisely the observed output.

**Recommendation: change "Exactly 8" to "Four to eight".** Without this, the standard fights the prompt it lives in, and the prompt wins.

**Two questions this raises for CODE, which Genesis should route rather than rule:** does the mobile matching UI render correctly with fewer than eight pairs, and does `validateBlueprint` enforce a count of eight? If either requires eight, the pedagogical fix is blocked on a UI change and Genesis should know that before ordering the build.

### 7.2 Some objectives genuinely do not support eight A1 words

*Introducing yourself*, *saying where you're from*, *greeting a neighbour* — these are **grammar-and-chunk lessons**, not vocabulary-rich ones. They are correct A1 lessons and should keep being taught. They just hold four or five teachable words.

This is not a defect to fix; it is a fact about early A1 to accommodate. §7.1 accommodates it. The alternative — steering the needs assessment towards vocabulary-rich objectives — would distort the curriculum to suit a card count, and I recommend against it.

### 7.3 Mechanically checkable versus judgement-only — worth splitting for CODE

A prompt instruction reduces the failure rate; it does not eliminate it. Some of this standard can be enforced in `validateBlueprint`, and enforcement is worth more than instruction. Lessons' view on which is which:

**Mechanically checkable** — reject and retry:
- `pos` present and one of noun / verb / adjective / adverb / phrase. The seven-field schema already carries `pos`, which makes the composition rule enforceable at no extra cost.
- Proper nouns: an item capitalised where it is not sentence-initial, or matching the country list already in project knowledge (`country-list-v1.md`, `309787995b4269243c7c71300249ca2c`).
- Function words: a fixed denylist of roughly the top 100 function words.
- Greeting chunks: a short fixed denylist.
- Count within 4–8.

**Judgement-only** — prompt guidance, caught in live review:
- Transfer beyond today's situation.
- Survival value within a fortnight.
- Definition quality against the five criteria in §4.
- Whether the recycled items genuinely have a natural home.

I would build the mechanical half. Four of the six observed failures — *from, hello, Australia, Spain* — are caught by a denylist and a proper-noun check alone.

### 7.4 The definition test should govern the card, not only the selection

§4's criteria are written as a selection filter, but they are equally a quality standard for the `meaning` field that ships to the student. Genesis should decide whether this document also becomes the standard the review stage checks definitions against — which would make it the first specification doing work at both plan time and review time. My recommendation: yes, and it costs nothing, because the review stage already receives the blueprint.

---

## 8. Evidence that would reopen this standard

Named at the time of decision, per standing principle.

1. **The 4–8 range producing consistently thin sets** — live lessons repeatedly landing at four or five words where an experienced teacher would find eight — reopens the count, not the criteria. Prediction: unlikely; the more probable failure is the model treating 8 as the target anyway out of habit, which is a prompt-wording problem rather than a standard problem.
2. **A legitimate A1 word class this standard excludes** — surfaced by a live lesson where the right word cannot be selected — reopens `never_occupies_a_slot` for that class only. The closed-set and greeting exceptions in §3 were added pre-emptively for exactly this reason; a third exception is plausible.
3. **The definability test rejecting words an ELICOS teacher would teach** reopens §4's criteria. Watch particularly for abstract-adjacent survival words at late A1 (*appointment*, *deposit*, *shift*) where a clean A1 definition is hard but the word is genuinely needed.
4. **A2–C1 authoring surfacing a principle that should have been level-independent** reopens this document to promote it, as the meta-vocabulary principle was promoted in `lesson-tightening-v1.md`.
5. **Live evidence that the composition ratios distort lessons** — for instance a situation legitimately needing four verbs — reopens the ratios, which are guidance rather than a hard gate, and should be worded to CODE as such.

Absent one of these, the standard stands.

Fix P-1 (everSpoke never set) and P-2 (empty pronunciation shell)

P-1 — everSpoke attribution:
- Added optional onSpoke prop to PronCard, called from MicButton's
  onText handler when speech text is received
- Threaded onSpoke through PronCardSequence to its PronCard call
- Wired at the PronCardSequence call site in PronunciationSection to
  setEverSpoke(true) — the dead completion-branch copy now fires
  correctly for any student who used the mic

P-2 — vocab-fallback empty shell:
- Added hasPronunciationContent check: true only when cards carry
  _pronunciation (i.e. built from focusSections) — false both when
  cards is empty and when every card came from the bare-vocabulary
  fallback
- When false, calls the existing onSkip (== skip == advance)
  mechanism via useEffect, matching this file's established
  advance-in-effect convention — never during render
- Stage no longer renders "Say it like a local" with no pronunciation
  content when focus data is absent

BEHAVIOUR CHANGE: (1) students who speak during the pronunciation
stage will now see the "you had a go out loud" completion message
instead of the generic one, regardless of mic use previously being
invisible to the stage; (2) a pronunciation stage with no real
pronunciation content will be skipped entirely instead of shown empty.

MD5 f50f96da641b69e0175f849fc9b99495 | 15,047 wc-l | 1,028,010 bytes

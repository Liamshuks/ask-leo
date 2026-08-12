Three fixes: onStartOver navigation, C2 removal, streak widget deletion

Fix 1 — "Set up Leo again" landed on Settings instead of home:
- onStartOver set profile to null but never reset page/tab, which
  stayed at "settings"/"progress". Once onboarding completed and
  profile became non-null again, the app fell back into the stale
  page === "settings" branch.
- Fixed by resetting page to null and tab to "today" in onStartOver
  itself, following the identical existing pattern already used in
  handleSessionEstablished for the same class of bug.

Fix 2 — C2 removed from LEVELS entirely. B1's label was already
plain "B1"/"Intermediate", no plus sign — nothing to fix there.
FLAGGED, not touched: VALID_CEFR (a separate constant, validates AI-
generated lesson content, not level selection) still includes "C2" —
outside this ruling's scope.

Fix 3 — Streak counter widget deleted from ProgressPage's stat grid,
no replacement. The other three stat cards (diary pages, words
learnt, tasks done) untouched. noticedLine()'s permanent guard
comment confirmed present, unmodified. The only other stats.streak
uses (the gate itself, and one line feeding Leo's internal AI
planning prompt as prose) are both legitimate per the guard's own
stated exception and were left alone.

BEHAVIOUR CHANGE: profile reset now correctly returns to Today home
after onboarding completes. C2 is no longer selectable as a level.
The Progress screen no longer displays a numeric streak widget.

MD5 fee2a7b6cf71bfd02f1a7eb4329772d6 | 15,343 wc-l | 1,045,384 bytes

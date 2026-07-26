import React, { useState, useEffect, useCallback } from "react";
import {
  BookOpen, Book, MessageCircle, Sparkles, Ear, MapPin, Mic, Gamepad2,
  LayoutDashboard, Check, X, Search, Send, Plus, Trash2, Loader2, ChevronLeft, ChevronRight, ExternalLink, Repeat,
  Home, TrendingUp, PenLine, GraduationCap, RotateCcw,
  AlertTriangle, Waves, Sun, CreditCard, Stethoscope, Briefcase
} from "lucide-react";

/* ============================================================
   MY ENGLISH DIARY — a personal companion for ESL students
   L1 support: Chinese (Simplified), Spanish, Portuguese
   ============================================================ */

const LANGS = {
  // §13.3 (26 July 2026): the zh-Hans / zh-Hant split has landed. Script is the
  // routing axis for Chinese per the ratified L1 Variety directive — the two are
  // ORDINARY picker rows (no grouping, no "variants" heading): a script choice
  // presented as an equal, not a sub-option. Existing "zh" records stay the
  // Simplified base (key unchanged), so no record migrates or breaks.
  zh: { native: "简体中文", english: "Chinese (Simplified)", hello: "你好" },
  "zh-Hant": { native: "繁體中文", english: "Chinese (Traditional)", hello: "你好" },
  es: { native: "Español", english: "Spanish", hello: "¡Hola" },
  pt: { native: "Português", english: "Portuguese", hello: "Olá" },
  fr: { native: "Français", english: "French", hello: "Bonjour" },
  de: { native: "Deutsch", english: "German", hello: "Hallo" },
  sv: { native: "Svenska", english: "Swedish", hello: "Hej" },
  ja: { native: "日本語", english: "Japanese", hello: "こんにちは" },
  ko: { native: "한국어", english: "Korean", hello: "안녕하세요" },
};

const LEVELS = [
  ["A1", "Beginner"], ["A2", "Elementary"], ["B1", "Intermediate"],
  ["B2", "Upper-Intermediate"], ["C1", "Advanced"], ["C2", "Proficient"],
];
// English level for AI prompts; falls back gently if the student skipped it
const levelFor = (p) => (p && p.level ? p.level : "B1");

const PHRASES = {
  zh: [
    { en: "Every mistake is a step forward.", l1: "每一个错误都是前进的一步。" },
    { en: "Little by little, a little becomes a lot.", l1: "积少成多。" },
    { en: "Courage speaks louder than perfect grammar.", l1: "勇气比完美的语法更响亮。" },
    { en: "You are not behind — you are on your way.", l1: "你没有落后，你正在路上。" },
    { en: "A new language is a new life.", l1: "学一门新语言，开启一段新生活。" },
    { en: "Practice makes progress, not perfection.", l1: "练习带来进步，而非完美。" },
    { en: "Dripping water pierces the stone.", l1: "滴水穿石，贵在坚持。" },
    { en: "The best time to speak English is now.", l1: "说英语的最佳时机就是现在。" },
  ],
  es: [
    { en: "Every mistake is a step forward.", l1: "Cada error es un paso adelante." },
    { en: "Little by little, one travels far.", l1: "Poco a poco se anda lejos." },
    { en: "Courage speaks louder than perfect grammar.", l1: "El valor habla más fuerte que la gramática perfecta." },
    { en: "You are not behind — you are on your way.", l1: "No estás atrasado, estás en camino." },
    { en: "A new language is a new life.", l1: "Un idioma nuevo, una vida nueva." },
    { en: "Practice makes progress, not perfection.", l1: "La práctica trae progreso, no perfección." },
    { en: "Nothing ventured, nothing gained.", l1: "Quien no arriesga, no gana." },
    { en: "The best time to speak English is now.", l1: "El mejor momento para hablar inglés es ahora." },
  ],
  pt: [
    { en: "Every mistake is a step forward.", l1: "Cada erro é um passo em frente." },
    { en: "Grain by grain, the hen fills her belly.", l1: "De grão em grão, a galinha enche o papo." },
    { en: "Courage speaks louder than perfect grammar.", l1: "A coragem fala mais alto do que a gramática perfeita." },
    { en: "You are not behind — you are on your way.", l1: "Você não está atrasado, está a caminho." },
    { en: "A new language is a new life.", l1: "Uma nova língua, uma nova vida." },
    { en: "Practice makes progress, not perfection.", l1: "A prática traz progresso, não perfeição." },
    { en: "Slowly, one goes far.", l1: "Devagar se vai ao longe." },
    { en: "The best time to speak English is now.", l1: "O melhor momento para falar inglês é agora." },
  ],
  fr: [
    { en: "Every mistake is a step forward.", l1: "Chaque erreur est un pas en avant." },
    { en: "Little by little, the bird builds its nest.", l1: "Petit à petit, l'oiseau fait son nid." },
    { en: "Courage speaks louder than perfect grammar.", l1: "Le courage parle plus fort qu'une grammaire parfaite." },
    { en: "You are not behind — you are on your way.", l1: "Tu n'es pas en retard — tu es en chemin." },
    { en: "A new language is a new life.", l1: "Une nouvelle langue, c'est une nouvelle vie." },
    { en: "Practice makes progress, not perfection.", l1: "La pratique apporte le progrès, pas la perfection." },
    { en: "Drop by drop, the water shapes the stone.", l1: "Goutte à goutte, l'eau creuse la pierre." },
    { en: "The best time to speak English is now.", l1: "Le meilleur moment pour parler anglais, c'est maintenant." },
  ],
  de: [
    { en: "Every mistake is a step forward.", l1: "Jeder Fehler ist ein Schritt nach vorne." },
    { en: "Step by step, you reach the goal.", l1: "Schritt für Schritt erreicht man das Ziel." },
    { en: "Courage speaks louder than perfect grammar.", l1: "Mut spricht lauter als perfekte Grammatik." },
    { en: "You are not behind — you are on your way.", l1: "Du bist nicht hinterher — du bist auf dem Weg." },
    { en: "A new language is a new life.", l1: "Eine neue Sprache ist ein neues Leben." },
    { en: "Practice makes progress, not perfection.", l1: "Übung bringt Fortschritt, nicht Perfektion." },
    { en: "All beginnings are hard.", l1: "Aller Anfang ist schwer." },
    { en: "The best time to speak English is now.", l1: "Die beste Zeit, Englisch zu sprechen, ist jetzt." },
  ],
  sv: [
    { en: "Every mistake is a step forward.", l1: "Varje misstag är ett steg framåt." },
    { en: "Little by little, you travel far.", l1: "Steg för steg kommer man långt." },
    { en: "Courage speaks louder than perfect grammar.", l1: "Mod talar högre än perfekt grammatik." },
    { en: "You are not behind — you are on your way.", l1: "Du ligger inte efter — du är på väg." },
    { en: "A new language is a new life.", l1: "Ett nytt språk är ett nytt liv." },
    { en: "Practice makes progress, not perfection.", l1: "Övning ger framsteg, inte perfektion." },
    { en: "No one becomes a master without practice.", l1: "Övning ger färdighet." },
    { en: "The best time to speak English is now.", l1: "Bästa tiden att tala engelska är nu." },
  ],
  ja: [
    { en: "Every mistake is a step forward.", l1: "すべての間違いは前進の一歩です。" },
    { en: "Dust piled up becomes a mountain.", l1: "塵も積もれば山となる。" },
    { en: "Courage speaks louder than perfect grammar.", l1: "勇気は完璧な文法より大きな声で語ります。" },
    { en: "You are not behind — you are on your way.", l1: "遅れているのではなく、進んでいるのです。" },
    { en: "A new language is a new life.", l1: "新しい言語は新しい人生です。" },
    { en: "Practice makes progress, not perfection.", l1: "練習は完璧ではなく、上達をもたらします。" },
    { en: "Continuity is strength.", l1: "継続は力なり。" },
    { en: "The best time to speak English is now.", l1: "英語を話す最高のタイミングは今です。" },
  ],
  ko: [
    { en: "Every mistake is a step forward.", l1: "모든 실수는 한 걸음 앞으로 나아가는 것입니다." },
    { en: "A journey of a thousand miles begins with a single step.", l1: "천 리 길도 한 걸음부터." },
    { en: "Courage speaks louder than perfect grammar.", l1: "용기는 완벽한 문법보다 크게 말합니다." },
    { en: "You are not behind — you are on your way.", l1: "뒤처진 것이 아닙니다 — 나아가고 있는 것입니다." },
    { en: "A new language is a new life.", l1: "새로운 언어는 새로운 삶입니다." },
    { en: "Practice makes progress, not perfection.", l1: "연습은 완벽이 아닌 발전을 가져옵니다." },
    { en: "Even a small stream becomes a great river.", l1: "작은 물줄기도 큰 강이 됩니다." },
    { en: "The best time to speak English is now.", l1: "영어를 말할 최고의 때는 바로 지금입니다." },
  ],
};

const PRON_TIPS = {
  zh: [
    { title: "th sounds /θ/ and /ð/", tip: "Put your tongue lightly between your teeth. 'Think' is not 'sink', and 'this' is not 'dis'. Practise: three thirsty brothers." },
    { title: "Word endings", tip: "English words often end in consonants: cold, worked, laughs. Don't drop the final sound — 'col' and 'cold' are different words." },
    { title: "Long vs short vowels", tip: "'Ship' /ɪ/ and 'sheep' /iː/ are different vowels, not just different lengths. Smile more for /iː/." },
    { title: "Word stress", tip: "English stress changes meaning: REcord (noun) vs reCORD (verb). Mark the stressed syllable when you learn a new word." },
  ],
  es: [
    { title: "'ship' vs 'sheep'", tip: "Spanish has one 'i' sound; English has two. /ɪ/ in 'ship' is shorter and more relaxed than /iː/ in 'sheep'." },
    { title: "No 'e' before s+consonant", tip: "'School' is not 'eschool', and 'Spain' is not 'Espain'. Start directly with the /s/." },
    { title: "/v/ vs /b/", tip: "In English these are different sounds. For /v/, touch your top teeth to your bottom lip: 'very' vs 'berry'." },
    { title: "-ed endings", tip: "Three sounds: /t/ (worked), /d/ (played), /ɪd/ (wanted). Only add the extra syllable after t or d sounds." },
  ],
  pt: [
    { title: "Final 'l'", tip: "In English, final 'l' stays an /l/ sound. 'Brazil' ends with the tongue touching behind the teeth — not 'Braziw'." },
    { title: "th sounds /θ/ and /ð/", tip: "Tongue between the teeth: 'think' is not 'fink' or 'sink'. Practise: this, that, these, those." },
    { title: "English 'h' and 'r'", tip: "English /h/ is soft breath ('house'), and English /r/ is made with the tongue curled back — not like Portuguese 'rr'." },
    { title: "-ed endings", tip: "Three sounds: /t/ (worked), /d/ (played), /ɪd/ (wanted). Only add the extra syllable after t or d sounds." },
  ],
  fr: [
    { title: "th sounds /θ/ and /ð/", tip: "French doesn't have these sounds. Put your tongue between your teeth — 'think' is not 'sink' or 'zink', and 'the' is not 'ze'." },
    { title: "The /h/ sound", tip: "English /h/ is a real breath sound. 'Happy' starts with air, not silence. French drops it — English doesn't." },
    { title: "Word stress", tip: "French stresses the last syllable; English moves stress around. 'COMfortable' not 'comforTABLE'. Mark the stress when you learn a word." },
    { title: "-ed endings", tip: "Three sounds: /t/ (worked), /d/ (played), /ɪd/ (wanted). Don't add a French-style vowel — 'worked' is one syllable, not two." },
  ],
  de: [
    { title: "The /w/ sound", tip: "English /w/ uses rounded lips, not teeth. 'Water' starts with lips rounded — not /v/. 'Wine' and 'vine' are different words." },
    { title: "th sounds /θ/ and /ð/", tip: "German doesn't have these. Tongue between teeth: 'think' is not 'sink', and 'the' is not 'de'. Practise: the, this, that, think, three." },
    { title: "Final consonant voicing", tip: "German devoices final consonants, but English keeps them voiced. 'Dog' ends with /ɡ/, not /k/. 'Have' ends with /v/, not /f/." },
    { title: "Vowel length", tip: "'Ship' /ɪ/ and 'sheep' /iː/ are different vowels, not just short vs long. Keep /ɪ/ relaxed and short." },
  ],
  sv: [
    { title: "The /dʒ/ and /tʃ/ sounds", tip: "Swedish doesn't have 'j' as in 'job' /dʒ/ or 'ch' as in 'church' /tʃ/. Touch the roof of your mouth with the tip of your tongue." },
    { title: "th sounds /θ/ and /ð/", tip: "These don't exist in Swedish. Tongue between your teeth — 'think' is not 'tink', and 'this' is not 'dis'." },
    { title: "The /z/ sound", tip: "Swedish 's' is always voiceless. English has both /s/ (sit) and /z/ (zip). Feel your throat vibrate for /z/." },
    { title: "Word stress in compounds", tip: "Swedish compounds stress the first part; English varies. 'Under-STAND', not 'UN-derstand'. Check each word individually." },
  ],
  ja: [
    { title: "/l/ and /r/ sounds", tip: "English /l/ (tongue tip touches the ridge behind your teeth) and /r/ (tongue curls back, doesn't touch) are two separate sounds. 'Light' and 'right' are different words." },
    { title: "Consonant clusters", tip: "English stacks consonants together: 'str-ong', 'spl-ash'. Don't add vowels between them — 'strong' is one syllable, not 'su-to-ro-n-gu'." },
    { title: "th sounds /θ/ and /ð/", tip: "Tongue between your teeth: 'think' is not 'sinku', and 'the' is not 'za'. Practise: three, this, that, those." },
    { title: "Word stress", tip: "Japanese gives each syllable roughly equal weight. English stresses one syllable strongly: 'IM-por-tant', not 'im-POR-TANT'. Mark the stress when you learn a word." },
  ],
  ko: [
    { title: "/f/ and /p/ sounds", tip: "English /f/ uses top teeth on bottom lip — air flows through. It is different from /p/ (lips together, then pop). 'Fan' and 'pan' are different words." },
    { title: "/l/ and /r/ sounds", tip: "English /l/ (tongue tip touches the ridge behind your teeth) and /r/ (tongue curls back, doesn't touch) are different sounds. 'Lead' and 'read' are different words." },
    { title: "Final consonants", tip: "English final consonants must be released clearly. 'Cup' ends with a /p/ pop, 'cat' with a /t/ tap. Don't swallow the final sound." },
    { title: "th sounds /θ/ and /ð/", tip: "Korean doesn't have these. Tongue lightly between your teeth: 'think' is not 'sinkeu', and 'the' is not 'deo'." },
  ],
};

const AUS_HELP = [
  {
    icon: AlertTriangle, title: "Emergency — call 000",
    intro: "In a serious emergency, call Triple Zero (000). It is the fastest way to get the police, fire service, or an ambulance. It is free from any phone.",
    display: [["👮", "Police — 000"], ["🔥", "Fire — 000"], ["🚑", "Ambulance — 000"]],
    points: [
      "Call 000 when someone is very sick or hurt, there is a fire, or a life is in danger.",
      "Stay calm and call from a safe place.",
      "Tell the operator which service you need: police, fire, or ambulance.",
      "Say where you are clearly — street number, street name, and suburb.",
      "Stay on the phone and answer the questions. Do not hang up until they say you can.",
      "If you cannot speak English well, call from a home phone, say 'Police', 'Fire', or 'Ambulance', and wait — they will find a translator.",
      "Only call 000 in a real emergency.",
    ],
    url: "https://www.triplezero.gov.au/triple-zero/How-to-Call-000",
  },
  {
    icon: Waves, title: "Swim between the flags",
    intro: "Australian beaches are beautiful, but the ocean can be dangerous. Strong water called a 'rip' can pull you away from the beach. Always swim in the safe area.",
    points: [
      "Look for the red and yellow flags on the beach.",
      "Swim only between these flags.",
      "Lifeguards (safety workers) watch this area and can help you.",
      "Never swim alone — always swim with other people.",
      "Read and follow the safety signs.",
      "If you feel tired or scared, raise your arm to ask for help.",
    ],
    url: "https://www.royallifesaving.com.au/about/campaigns-and-programs/Water-Safety",
  },
  {
    icon: Sun, title: "Sun safety",
    intro: "The sun in Australia is very strong. The UV (sun rays that burn your skin) can be dangerous, even on cloudy or cool days. Use five easy steps.",
    points: [
      "🧥 Slip on clothes that cover your skin, like a shirt with sleeves.",
      "🧴 Slop on sunscreen (SPF 30 or higher). Put more on every 2 hours.",
      "🧢 Slap on a hat to protect your face, ears, and neck.",
      "⛱️ Seek shade, especially in the middle of the day.",
      "🕶️ Slide on sunglasses to protect your eyes.",
    ],
    url: "https://www.cancer.org.au/cancer-information/causes-and-prevention/sun-safety/campaigns-and-events/slip-slop-slap-seek-slide",
  },
  {
    icon: CreditCard, title: "Opal card (Sydney)",
    intro: "An Opal card is a card you use to pay for public transport in Sydney and nearby areas like the Blue Mountains, Central Coast, the Hunter, and the Illawarra.",
    points: [
      "Use it on trains, buses, ferries, and light rail.",
      "You can also tap a credit or debit card, or your phone, instead.",
      "Top up (add money) online, at stations, at some shops, or with machines. You can set up auto top-up.",
      "Tap on when you start your trip, and tap off when you finish. This pays the right price.",
      "There are Adult cards and cheaper concession cards. Concession cards are only for eligible people — many international students cannot get one, so please check first.",
    ],
    url: "https://transportnsw.info/tickets-fares/opal",
  },
  {
    icon: Stethoscope, title: "Medicare & OSHC (health cover)",
    intro: "Health care is important. Here are two things you should understand about paying for doctors and hospitals.",
    subsections: [
      { heading: "🩺 What is Medicare?", points: [
        "Medicare is Australia's public health system. It helps Australians pay for doctors and hospitals.",
        "Most international students cannot use Medicare.",
        "You may be able to use it only if your home country has a special agreement (a 'reciprocal agreement') with Australia.",
      ] },
      { heading: "🛡️ What is OSHC?", points: [
        "OSHC means Overseas Student Health Cover. It is health insurance for international students.",
        "Most student visas require you to have OSHC.",
        "It usually helps pay for doctor visits, some hospital care, ambulances, and some medicines.",
        "Always carry your OSHC details (company name and member number) with you.",
      ] },
    ],
    urls: [["Medicare", "https://www.servicesaustralia.gov.au/medicare"], ["OSHC", "https://oshcaustralia.com.au/en"]],
  },
  {
    icon: Briefcase, title: "Working: TFN & super",
    intro: "If you have permission to work, there are two important words to know: TFN and super.",
    subsections: [
      { heading: "🔢 Tax File Number (TFN)", points: [
        "A Tax File Number is your personal number for tax in Australia.",
        "You need a TFN to work and to pay the correct tax. Without one, you may pay more tax than you should.",
        "It is free to apply through the Australian Taxation Office (ATO).",
        "Keep your TFN private and safe. Do not share it with people you do not trust.",
      ], url: "https://www.ato.gov.au/individuals-and-families/tax-file-number" },
      { heading: "💰 Superannuation (super)", points: [
        "Super is money saved for when you retire (stop working).",
        "If you are eligible, your employer usually pays super into a super account for you — extra money on top of your pay.",
        "When you leave Australia for good, you may be able to claim your super if you meet the rules.",
        "This is general information only. For your own situation, check the official website or ask a professional.",
      ], url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super" },
    ],
  },
];
const ERROR_TYPES = ["articles", "verb tense", "prepositions", "word order", "spelling", "vocabulary choice", "subject-verb agreement", "plurals", "punctuation"];

/* ---------------- API helpers ---------------- */

/* ============================================================
   AI SERVICE  ▸  the ONE place every AI feature talks to.
   ------------------------------------------------------------
   The whole app calls askClaude(prompt). It is currently backed
   by a MOCK so the entire application can be built and tested
   without a live AI or backend.

   ▶ TO GO LIVE LATER: set USE_MOCK_AI = false and point
     liveAskClaude() at your real backend. NOTHING ELSE in the
     app needs to change — this function is the only seam.
   ============================================================ */
const USE_MOCK_AI = false;

async function askClaude(prompt, opts) {
  return USE_MOCK_AI ? mockAskClaude(prompt, opts) : liveAskClaude(prompt);
}

/* ---- LIVE backend (inactive while USE_MOCK_AI is true) ---- */
async function liveAskClaude(prompt) {
  let res;
  try {
    res = await fetch("https://ask-leo-proxy.vercel.app/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
  } catch (networkErr) {
    console.error("[liveAskClaude] fetch rejected before any response (CORS/offline/DNS):", networkErr);
    throw new Error("Could not reach the AI service (CORS/offline): " + (networkErr && networkErr.message ? networkErr.message : String(networkErr)));
  }
  const rawBody = await res.text();
  let data = null;
  if (rawBody) {
    try { data = JSON.parse(rawBody); }
    catch (parseErr) {
      console.error("[liveAskClaude] response was not valid JSON:", { status: res.status, statusText: res.statusText, body: rawBody.slice(0, 800) });
      throw new Error(`HTTP ${res.status}: server did not return JSON — ${rawBody.slice(0, 160)}`);
    }
  }
  if (!res.ok || (data && data.error)) {
    const type = (data && data.error && data.error.type) || "http_" + res.status;
    const message = (data && data.error && data.error.message) || res.statusText || "Unknown error";
    console.error("[liveAskClaude] AI request failed:", { status: res.status, type, message, body: data || rawBody.slice(0, 800) });
    throw new Error(`${res.status} ${type}: ${message}`);
  }
  const text = (data && data.content ? data.content : []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
  if (!text) console.warn("[liveAskClaude] request succeeded but returned no text content:", data);
  return text;
}

/* ==================== MOCK AI SERVICE ====================
   Clearly-marked development stand-in. Returns realistic,
   correctly-shaped responses for EVERY AI feature so the app
   is fully usable offline. Remove this whole block once
   liveAskClaude() is wired to a real backend.
   ======================================================== */
function _mockPick(p, re) { const m = p.match(re); return m ? m[1] : ""; }

/* Warm-up free response — Leo's two non-pack lines.
   These are DIFFERENT MESSAGES and must not stay identical:
     SKIP     "you didn't do this, and that's fine"
     FALLBACK "I received something but couldn't read it"
   A student who types "." and a student who hits a network error are in
   genuinely different situations. Interim identical is acceptable while
   Lessons' wording is outstanding; permanent is not. */
const WARMUP_SKIP_LINE = "No problem — let's move on.";     // judgement: nothing meaningful was typed
const WARMUP_FALLBACK_LINE = "Got it — let's keep going.";  // failure only, never an AI call

// G-10(2): closing-summary honesty rules, held once so the first-pass summary
// prompt and (once Genesis rules) the summary retry can never drift apart.
// Static text, no interpolation.
const SUMMARY_HONESTY_RULES = `WHAT YOU KNOW, AND WHAT YOU DO NOT
The Performance line above is your only evidence about what this student did today. Where it reads "not attempted", that stage did not happen: do not mention it, do not praise it, do not imply it took place. You have scores and a turn count — you did not see or hear anything they produced. Never describe the quality of their English.

- Praise SPECIFIC effort, drawn from the Performance line: a score, a number of speaking turns, a stage completed. If little was attempted, praise the fact that they came and finished, and say nothing further about performance.
- Do NOT tell the student what they can now do. One lesson does not make a skill, and nothing above tells you they acquired anything. Name what they PRACTISED, then point forward to where it gets used: "Today you practised X — next time you're in that situation, try one line of it."
- Name one strength the Performance line actually shows. If it shows nothing, name the strength of finishing, and nothing else.
- Suggest ONE improvement drawn from the predicted difficulties. These were predicted BEFORE the lesson and you did not observe them: frame each as worth practising, never as something the student got wrong.
- Reference the memorable moment only as part of today's lesson — never as something you saw them enjoy, notice or understand.
- Connect today to their journey ONLY if the prior-lesson context above is non-empty. If it is empty this is their first lesson with you: say so warmly, and never imply a history that does not exist.
- Preview tomorrow as your intention, not as a promise of specific content.
- Every field must leave the student with something to do or somewhere to go next. A closing screen that only grades is a receipt, not teaching.`;
// Shared mock content packs: one pack = one coherent real-life situation.
// Every mock lesson branch (blueprint, reading, listening, grammar, summary)
// draws from the SAME pack so offline lessons never mix scenarios.
const MOCK_PACKS = [
  { match: /direction|lost|way/, warmUpQs: ["Do you know how to get to your nearest train station?", "Have you ever asked a stranger for directions in English?", "What would you say if you were lost near Central Station?", "Do you know what straight ahead means in directions?", "If someone said turn left at the lights, would you understand?", "What is the most confusing part about asking for directions in English?"], ctx: "Asking for directions",
    warmupMinimalResponse: "Thanks — good start. Here's an easier one: when you're lost, do you usually ask someone, or check your phone? Today we'll practise the asking part.",
    warmupAttemptResponse: "A proper answer — that's how a warm-up should work. Hold onto that thinking: today you'll learn exactly what to say when you're lost and need a stranger's help.",
    warmQ: "Have you ever asked a stranger for directions in English? What did you say?",
    model: "Excuse me, could you tell me how to get to the station?",
    dialogue: `"Excuse me, how do I get to Central Station?"\n"Go straight ahead and turn left at the lights."\n"Is it far?"\n"About five minutes. You can't miss it."`,
    vocab: ["intersection", "station", "traffic lights", "straight ahead", "turn left", "turn right", "opposite", "across from"],
    grammar: { point: "Polite question forms", meaning: "We use question forms like 'Could you…' to ask strangers politely.", form: "Could/Can + you + verb …?", usage: "Use with strangers and in public — it softens the request.", examples: ["Could you tell me where the station is?", "Can you point me towards the harbour?"] } },
  { match: /caf|coffee|barista|food|lunch|eat|restaurant|order/, warmUpQs: ["What is your usual coffee order?", "Do you know the difference between a flat white and a latte?", "Have you ever ordered food in English in Australia?", "What would you say if you wanted soy milk instead of regular?", "How would you ask for the bill at a restaurant?", "Do you feel confident ordering takeaway in English?"], ctx: "Ordering at a caf\u00e9",
    warmupMinimalResponse: "Short and sweet — that works. Something easier: do you drink coffee at home, or out? Either way, today you'll learn to order like a local.",
    warmupAttemptResponse: "Thanks for a real answer — you're already using English about food, and that's today's whole point. Let's make your next caf\u00e9 order feel easy.",
    warmQ: "What's your usual coffee order? How would you ask for it in English?",
    model: "Could I get a flat white, please?",
    dialogue: `"G'day, what can I get you?"\n"Could I get a flat white, thanks?"\n"No worries — regular or large?"\n"Large, takeaway please."`,
    vocab: ["flat white", "takeaway", "barista", "order", "soy milk", "long black", "regular", "eftpos"],
    grammar: { point: "Polite requests with 'could'", meaning: "'Could I get…' is the natural way to order in Australia.", form: "Could I get/have + noun (+ please)?", usage: "At counters, caf\u00e9s and shops — friendly and standard.", examples: ["Could I get a flat white, please?", "Could I have the bill, thanks?"] } },
  { match: /doctor|gp|medical|pharmac|dentist|symptom|health/, warmUpQs: ["Have you ever visited a GP in Australia?", "Do you know how to book an appointment?", "What would you say if you had a headache for three days?", "Do you know what Medicare means?", "How would you ask for a repeat prescription?", "What is the hardest part about explaining health problems in English?"], ctx: "A visit to the doctor",
    warmupMinimalResponse: "Thanks — that's a start. An easier question: have you found a doctor near where you live yet? Today's lesson will help whenever you need one.",
    warmupAttemptResponse: "A full answer on a topic most students avoid — good on you. Talking about health is hard in any language. Today we'll make it manageable in English.",
    warmQ: "Have you ever explained a health problem in English? What did you say?",
    model: "I've had a sore throat for three days.",
    dialogue: `"Good morning, how can I help?"\n"Hi, I'd like to book an appointment with a GP, please."\n"Of course — the clinic has an opening tomorrow morning. Any good?"\n"Yes, that works. Thank you."`,
    vocab: ["appointment", "prescription", "GP", "symptom", "receptionist", "clinic", "Medicare", "referral"],
    grammar: { point: "Present perfect for symptoms", meaning: "We use the present perfect for things that started in the past and are still true.", form: "I've + past participle (+ since/for …)", usage: "Perfect for describing ongoing symptoms to a doctor.", examples: ["I've had a headache since Monday.", "I've been feeling tired for a week."] } },
  { match: /rent|flat|apartment|lease|landlord|inspection|housing|maintenance/, warmUpQs: ["Have you ever rented a flat in Australia?", "Do you know what a bond is in Australian renting?", "What questions would you ask at a rental inspection?", "How would you report a broken tap to your landlord?", "What does available from mean on a rental ad?", "Do you feel confident reading a lease agreement?"], ctx: "Renting a flat",
    warmupMinimalResponse: "Good — thanks. Try this easier one: do you rent your own place, or share with others? Today is about handling renting conversations in English.",
    warmupAttemptResponse: "Thanks for that answer — renting is one of the most useful topics we can work on. Let's get you ready for landlords, leases and inspections.",
    warmQ: "Have you ever asked a landlord or agent a question in English? What was it?",
    model: "Could you tell me when the flat is available?",
    dialogue: `"Hi, are you here for the inspection?"\n"Yes — could I ask a couple of questions about the lease?"\n"Of course, fire away."\n"How much is the bond, and when is it available?"`,
    vocab: ["bond", "lease", "landlord", "inspection", "rent", "available", "agent", "utilities"],
    grammar: { point: "Indirect questions", meaning: "Indirect questions ('Could you tell me when…') sound politer than direct ones.", form: "Could you tell me + question word + subject + verb", usage: "Ideal for agents, landlords and officials.", examples: ["Could you tell me when the flat is available?", "Do you know how much the bond is?"] } },
  { match: /bank|account|atm|card/, warmUpQs: ["Do you have an Australian bank account?", "What ID did you need to open it?", "Do you know what a BSB number is?", "How would you ask about savings accounts?", "Have you ever used an Australian ATM?", "What would you do if your card stopped working?"], ctx: "Opening a bank account",
    warmupMinimalResponse: "Thanks — short answers still count. An easier one: do you pay by card or cash most days? Today we'll practise the English that banks use.",
    warmupAttemptResponse: "A real answer — good. Bank English is full of odd words, but by the end of today it won't feel so foreign. Let's get started.",
    warmQ: "Have you ever been to a bank in Australia? What did you need?",
    model: "I'd like to open a savings account, please.",
    dialogue: `"Hi there, how can I help today?"\n"I'd like to open a savings account, please. What identification do I need?"\n"A passport and proof of address is perfect — and your debit card will arrive within a week."\n"Great. Could I also get my BSB and account number today?"`,
    vocab: ["identification", "savings account", "debit card", "branch", "teller", "BSB", "statement", "transfer"],
    grammar: { point: "'I'd like to' for formal requests", meaning: "'I'd like to' is the standard polite opener for services.", form: "I'd like to + verb", usage: "Banks, offices, phone calls — anywhere formal but friendly.", examples: ["I'd like to open an account, please.", "I'd like to update my address."] } },
  { match: /train|bus|ferry|opal|transport|taxi|uber|airport/, warmUpQs: ["How do you usually get to class?", "Do you have an Opal card?", "Have you ever missed a bus or train here?", "What would you say if the train was delayed?", "Do you know what tap on and tap off mean?", "How would you ask which platform your train leaves from?"], ctx: "Catching a train or bus",
    warmupMinimalResponse: "Thanks. Here's an easier one: train, bus or walking — how do you get around most days? Today's transport English is language you'll use constantly.",
    warmupAttemptResponse: "Thanks for a full answer. Public transport comes up every single day here, so today's practice will pay off almost immediately. Let's go.",
    warmQ: "How do you usually get around? Have you asked about tickets or platforms in English?",
    model: "Excuse me, which platform is the train to the city?",
    dialogue: `"Excuse me, does this bus go to Circular Quay?"\n"Sure does — the timetable says the express is next, but this one's all stops. Tap on and grab a seat."\n"Thanks — and do I tap off as well?"\n"Yep, tap off when you hop out. No worries."`,
    vocab: ["platform", "Opal card", "tap on", "tap off", "delay", "timetable", "service", "express"],
    grammar: { point: "Question word order with 'do'", meaning: "English questions need an auxiliary: 'Where do I…?', not 'Where I…?'", form: "Question word + do/does + subject + verb", usage: "Every everyday question uses this pattern.", examples: ["Where do I tap my card?", "Does this bus go to the city?"] } },
  { match: /shop|supermarket|return|checkout|clothes|grocer|item|parcel|post/, warmUpQs: ["Have you ever returned something to a shop in Australia?", "Do you keep your receipts?", "What would you say if something you bought was faulty?", "How would you ask for a different size?", "Do you feel confident using self-checkout?", "What is the difference between a refund and an exchange?"], ctx: "Shopping and returns",
    warmupMinimalResponse: "Thanks — that counts. An easier one: do you keep your receipts? Today you'll learn to return things and ask for refunds without stress.",
    warmupAttemptResponse: "A proper answer — nicely done. Returning things feels awkward even for native speakers, so today's lesson will genuinely help. Let's build your counter confidence.",
    warmQ: "Have you ever returned something to a shop or asked for help finding an item?",
    model: "Excuse me, I'd like to return this — it doesn't fit.",
    dialogue: `"Hi, need any help?"\n"Yes — I'd like a refund for this jumper, please. It's faulty."\n"No worries at all. Have you got the receipt?"\n"Right here. Could I look for another size while you sort the exchange?"\n"Of course — jumpers are down aisle four."`,
    vocab: ["receipt", "refund", "exchange", "checkout", "aisle", "discount", "size", "faulty"],
    grammar: { point: "Comparatives for shopping", meaning: "Short adjectives take -er when comparing.", form: "adjective + -er / more + adjective + than", usage: "Comparing prices, sizes and options.", examples: ["This one is cheaper online.", "Do you have a bigger size?"] } },
  { match: /universit|enrol|class|teacher|study|tafe|student|presentation|lecture/, warmUpQs: ["Have you ever asked a teacher a question in English?", "What would you say if you did not understand something in class?", "How would you ask about an assignment deadline?", "Do you feel confident speaking in class discussions?", "What is the hardest part about studying in English?", "How would you email your teacher about a late assignment?"], ctx: "Talking to your teacher",
    warmupMinimalResponse: "Thanks — a start is a start. An easier question: do you prefer asking questions in class, or after class? Today we'll practise both.",
    warmupAttemptResponse: "Thanks for a real answer. Asking teachers questions is a skill — and it's how you get full value from any course. Let's sharpen it today.",
    warmQ: "Have you ever asked a teacher a question in English? How did you start?",
    model: "Excuse me, could you explain that last part again?",
    dialogue: `"Excuse me, could I ask about the assignment?"\nTeacher: "Of course — what would you like to know?"\n"Is it due Friday or Monday?"\nTeacher: "Friday at 5pm — but a draft earlier is always fine!"`,
    vocab: ["due", "assignment", "semester", "tutorial", "lecture", "campus", "draft", "feedback"],
    grammar: { point: "Asking for clarification", meaning: "Clarification questions keep you learning without embarrassment.", form: "Could you + explain/repeat/clarify …?", usage: "In class, at work, anywhere you didn't catch something.", examples: ["Could you explain that again, please?", "Sorry, could you say that more slowly?"] } },
  { match: /job|interview|work|manager|colleague|sick|time off|meeting|email/, warmUpQs: ["Have you ever had a job interview in English?", "How would you call in sick to work?", "What would you say if you needed to swap a shift?", "Do you feel confident talking to your manager?", "How would you ask a colleague for help?", "What is workplace small talk like in Australia?"], ctx: "Speaking to your manager",
    warmupMinimalResponse: "Thanks. Here's an easier one: have you had a job here yet, or are you still looking? Either way, today's workplace English will be useful.",
    warmupAttemptResponse: "A full answer — good on you. Workplace conversations are high-stakes, and that's exactly why we practise them here first, where mistakes cost nothing.",
    warmQ: "Have you ever spoken English at work or in an interview? What was the situation?",
    model: "Could I ask a quick question about the roster?",
    dialogue: `"Morning! How's it all going?"\n"Good, thanks — could I grab you for a minute about my shifts?"\n"Sure, come through — I've got the roster up now."\n"Thanks — I was hoping to swap Saturday if possible."`,
    vocab: ["roster", "shift", "manager", "colleague", "leave", "workplace", "swap", "overtime"],
    grammar: { point: "Softening requests at work", meaning: "'I was hoping to…' and 'Could I…' make workplace requests easy to say yes to.", form: "I was hoping to + verb / Could I + verb", usage: "Asking managers for time, swaps or help.", examples: ["I was hoping to take Friday off.", "Could I grab you for a minute?"] } },
  { match: /neighbour|party|friend|bbq|barbecue|small talk|invit|social|weekend/, warmUpQs: ["Have you met your neighbours yet?", "What would you say if a neighbour invited you to a BBQ?", "Do you know what arvo means in Australian English?", "How do Australians usually greet each other?", "What topics are good for small talk in Australia?", "How would you politely accept or decline an invitation?"], ctx: "Small talk with neighbours",
    warmupMinimalResponse: "Thanks — short but real. An easier one: do you know your neighbours' names yet? Today we'll practise the small talk that starts friendships here.",
    warmupAttemptResponse: "Thanks for a genuine answer. Small talk sounds small, but it's how Australians open every friendship. Today we'll make it feel natural, not scary.",
    warmQ: "Have you chatted with a neighbour or made small talk in English? What did you talk about?",
    model: "How's your weekend been?",
    dialogue: `"G'day! Settling in alright?"\n"Yeah, really well thanks — it's a lovely street."\n"Good to hear! We're having a barbie Saturday arvo — heaps of food, so come along!"\n"That sounds great, mate — thanks for inviting me."`,
    vocab: ["arvo", "barbie", "mate", "reckon", "heaps", "invite", "weekend", "how ya going"],
    grammar: { point: "Present perfect for small talk", meaning: "'How's your week been?' keeps conversation flowing naturally.", form: "How has + noun + been?", usage: "The classic Australian small-talk opener.", examples: ["How's your weekend been?", "How've you been settling in?"] } },
  { match: /beach|swim|surf|ocean|sun|sand|flag|lifeguard|rip|sunscreen|sunburn|thong/, warmUpQs: ["Do you like going to the beach?", "What do you do when you are at the beach?", "What must you bring to the beach?", "Is there anything you shouldn't do when at the beach?", "Have you ever been to an Australian beach?", "Do you know what the red and yellow flags mean?"], ctx: "Going to the beach",
    warmupMinimalResponse: "Thanks. An easier one: do you prefer swimming, or just sitting on the sand? Today's beach English covers both — plus how to stay safe.",
    warmupAttemptResponse: "A proper answer — great. The beach is where Australian English gets very Australian. Today you'll learn the words, and the safety rules that matter.",
    warmQ: "Do you like going to the beach? What must you bring?",
    model: "You should always swim between the flags.",
    dialogue: `"G'day! First time at the beach?"\n"Yes — where should I swim?"\n"See those red and yellow flags? Swim between them — that's where the lifeguards are watching."\n"Thanks! Should I put on sunscreen?"\n"Definitely — the Australian sun is no joke. Slip, slop, slap, mate."`,
    vocab: ["flags", "swim", "shade", "sunbathe", "sunscreen", "shark", "drown", "towel", "sunburn", "thongs", "rip current", "lifeguard"],
    grammar: { point: "Modal verbs of obligation, prohibition and advice", meaning: "Modal verbs like must, should, mustn't and can't express rules, advice and things that are not allowed.", form: "modal (must/should/mustn't/can't) + base verb", usage: "Giving safety advice, explaining rules, expressing what you think is a good idea — essential for everyday Australian life.", examples: ["You must swim between the flags.", "You should wear sunscreen every day.", "You mustn't swim outside the flags.", "I think people should learn about beach safety."] } },
];
/* ==================== PACK WARM-UPS & GRAMMAR PRACTICE ====================
   Educational reasoning: a warm-up and a grammar exercise are only worth doing
   if they belong to TODAY. These are authored per scenario, so the warm-up
   primes the exact language the lesson teaches, and every grammar question
   drills the exact structure the explanation just taught — never politeness,
   never a different tense, never generic filler.
   Technical reasoning: these live on the pack, preserving the existing
   "ONE pack = ONE coherent situation" invariant, so a scenario can never be
   paired with another scenario's practice.
   ======================================================================== */
const PACK_WARMUPS = {
  "Asking for directions": [
    { type: "context_discussion", instruction: "Just chat — there are no wrong answers here.", prompt: "Have you ever been lost in Australia? Where were you, and what did you do?" },
    { type: "unscramble", instruction: "Tap the words in the right order.", prompt: "Put this polite question in order:", tokens: ["Could", "you", "tell", "me", "how", "to", "get", "to", "the", "station?"], note: "Modal + subject + verb — 'Could you tell me…' is the pattern you'll lean on all lesson." },
    { type: "complete_dialogue", instruction: "Choose the missing line.", prompt: "You stop someone in the street. What do you say?", text: "You: ______\nThem: “Go straight ahead and turn left at the lights.”", options: ["Excuse me, could you tell me how to get to Central Station?", "Where station?", "You tell me the station now.", "Station. Please."], answer: "Excuse me, could you tell me how to get to Central Station?", note: "'Excuse me, could you…' is how Australians open a request to a stranger. It opens doors." },
    { type: "prediction", instruction: "Have a guess — predicting primes you to notice.", prompt: "Someone giving you directions says “You can't miss it.” What do you think they mean?" },
  ],
  "Ordering at a café": [
    { type: "context_discussion", instruction: "Just chat — there are no wrong answers here.", prompt: "What's your usual coffee order? How would you ask for it in English?" },
    { type: "is_this_correct", instruction: "Read it carefully — would an Australian say this?", prompt: "Is this correct?", text: "“I want one coffee.”", options: ["Correct", "Not correct"], answer: "Not correct", note: "It's understandable, but blunt. At a counter Australians say 'Could I get…' or 'Could I have…' — softer, and completely standard." },
    { type: "best_response", instruction: "Choose the most natural reply.", prompt: "The barista says: “No worries — regular or large?”", options: ["Large, takeaway please.", "Yes.", "I don't know it.", "Coffee."], answer: "Large, takeaway please.", note: "Answer the actual question and add the detail they need — that's what keeps a counter exchange flowing." },
    { type: "order_conversation", instruction: "Tap the lines in the order you'd hear them.", prompt: "Put this café exchange in order:", tokens: ["G'day, what can I get you?", "Could I get a flat white, thanks?", "No worries — regular or large?", "Large, takeaway please."], note: "Greeting → order → clarifying question → answer. That's the shape of nearly every counter conversation here." },
  ],
  "A visit to the doctor": [
    { type: "context_discussion", instruction: "Just chat — there are no wrong answers here.", prompt: "Have you ever had to explain a health problem in English? How did it go?" },
    { type: "spot_mistake", instruction: "Find the learner's error.", prompt: "What is the mistake in this sentence?", text: "“I have a headache since three days.”", options: ["'since' should be 'for'", "'have' should be 'has'", "'a' should be removed", "'headache' should be plural"], answer: "'since' should be 'for'", note: "'For' goes with a length of time (for three days); 'since' goes with a starting point (since Monday)." },
    { type: "true_false", instruction: "True or false?", prompt: "Most international students in Australia can use Medicare.", options: ["True", "False"], answer: "False", note: "False — most international students rely on OSHC, not Medicare. Worth knowing before you're unwell." },
    { type: "mini_task", instruction: "A real task — say it out loud if you can.", prompt: "In one sentence, book an appointment with a GP for tomorrow morning." },
  ],
  "Renting a flat": [
    { type: "context_discussion", instruction: "Just chat — there are no wrong answers here.", prompt: "Have you been to a rental inspection here? What did you want to ask, but couldn't?" },
    { type: "unscramble", instruction: "Tap the words in the right order.", prompt: "Put this indirect question in order:", tokens: ["Could", "you", "tell", "me", "when", "the", "flat", "is", "available?"], note: "Indirect questions keep statement order: '…when the flat IS available', never 'is the flat'." },
    { type: "mcq", instruction: "Choose the correct answer.", prompt: "What is a 'bond' in Australian renting?", options: ["A deposit you get back if the place is undamaged", "The monthly rent", "A cleaning fee you never get back", "A contract with the agent"], answer: "A deposit you get back if the place is undamaged", note: "The bond is held, not spent. Leave the place as you found it and it comes back to you." },
    { type: "finish_sentence", instruction: "Finish it in your own words.", prompt: "Complete this question for the agent: “Could you tell me how much …”" },
  ],
  "Opening a bank account": [
    { type: "context_discussion", instruction: "Just chat — there are no wrong answers here.", prompt: "Have you opened a bank account in Australia? What did they ask you for?" },
    { type: "complete_dialogue", instruction: "Choose the missing line.", prompt: "Complete the exchange:", text: "Teller: “Hi there, how can I help today?”\nYou: ______", options: ["I'd like to open a savings account, please.", "Account. Now.", "You give me account.", "I am wanting account opening."], answer: "I'd like to open a savings account, please.", note: "'I'd like to + verb' is the standard polite opener for any service in Australia." },
    { type: "is_this_correct", instruction: "Read it carefully — is the form right?", prompt: "Is this correct?", text: "“I'd like to opening an account.”", options: ["Correct", "Not correct"], answer: "Not correct", note: "After 'I'd like to' we need the base verb: 'I'd like to OPEN an account.'" },
    { type: "mini_task", instruction: "A real task — say it out loud if you can.", prompt: "In one sentence, ask the teller what identification you need." },
  ],
  "Catching a train or bus": [
    { type: "context_discussion", instruction: "Just chat — there are no wrong answers here.", prompt: "How do you usually get to class? Have you ever had to ask about a platform or a ticket in English?" },
    { type: "mcq", instruction: "Choose the correct answer.", prompt: "What do 'tap on' and 'tap off' mean?", options: ["Touch your card at the start and the end of the trip", "Turn the machine on and off", "Pay the driver in cash", "Ask the driver for a receipt"], answer: "Touch your card at the start and the end of the trip", note: "Forget to tap off and you're charged the maximum fare — an expensive mistake, and a very common one." },
    { type: "spot_mistake", instruction: "Find the learner's error.", prompt: "What is the mistake in this question?", text: "“Where I do tap my Opal card?”", options: ["'I do' should be 'do I'", "'Where' should be 'What'", "'tap' should be 'tapping'", "'my' should be 'the'"], answer: "'I do' should be 'do I'", note: "English questions invert: question word + do + subject + verb — 'Where DO I tap…?'" },
    { type: "prediction", instruction: "Have a guess — predicting primes you to notice.", prompt: "The driver says “Sure does — tap on and grab a seat.” What do you think 'grab a seat' means?" },
  ],
  "Shopping and returns": [
    { type: "context_discussion", instruction: "Just chat — there are no wrong answers here.", prompt: "Have you ever returned something to a shop here? What did you say?" },
    { type: "best_response", instruction: "Choose the most natural reply.", prompt: "The assistant says: “No worries at all. Have you got the receipt?”", options: ["Yes, right here.", "Receipt is what?", "No, I want money.", "You give refund."], answer: "Yes, right here.", note: "Short, natural, and it keeps things moving — exactly what you want at a counter." },
    { type: "true_false", instruction: "True or false?", prompt: "A refund and an exchange are the same thing.", options: ["True", "False"], answer: "False", note: "False — a refund gives your money back; an exchange swaps the item. Ask for the one you actually want." },
    { type: "unscramble", instruction: "Tap the words in the right order.", prompt: "Put this question in order:", tokens: ["Do", "you", "have", "a", "bigger", "size", "in", "this?"], note: "Short adjectives take -er: big → bigger. That's the comparative you'll use all day when shopping." },
  ],
  "Talking to your teacher": [
    { type: "context_discussion", instruction: "Just chat — there are no wrong answers here.", prompt: "Have you ever asked a teacher a question in English? How did you start?" },
    { type: "finish_sentence", instruction: "Finish it in your own words.", prompt: "Complete this: “Sorry, I didn't catch that — could you …”" },
    { type: "complete_dialogue", instruction: "Choose the missing line.", prompt: "Complete the exchange:", text: "You: ______\nTeacher: “Friday at 5pm — but a draft earlier is always fine!”", options: ["Could I ask when the assignment is due?", "When assignment?", "Assignment due when it is?", "You tell me the assignment day."], answer: "Could I ask when the assignment is due?", note: "'Could I ask when…' is polite, and it buys you a second of thinking time too." },
    { type: "mcq", instruction: "Choose the correct answer.", prompt: "Your teacher says the draft is 'due Friday'. What does that mean?", options: ["You must hand it in by Friday", "It was returned to you on Friday", "It is optional until Friday", "Friday is when you start it"], answer: "You must hand it in by Friday", note: "'Due' means the deadline. Misread this one and it costs marks, not just meaning." },
  ],
  "Speaking to your manager": [
    { type: "context_discussion", instruction: "Just chat — there are no wrong answers here.", prompt: "Have you spoken English at work or in an interview? What was the situation?" },
    { type: "order_conversation", instruction: "Tap the lines in the order you'd hear them.", prompt: "Put this workplace exchange in order:", tokens: ["Morning! How's it all going?", "Good, thanks — could I grab you for a minute about my shifts?", "Sure, come through — I've got the roster up now.", "Thanks — I was hoping to swap Saturday if possible."], note: "Small talk → ask for a moment → they agree → THEN the real request. Australians warm up before they ask." },
    { type: "is_this_correct", instruction: "Read it carefully — is the form right?", prompt: "Is this correct?", text: "“I was hoping to swapping my shift.”", options: ["Correct", "Not correct"], answer: "Not correct", note: "After 'hoping to' we need the base verb: 'I was hoping to SWAP my shift.'" },
    { type: "best_response", instruction: "Choose the most natural reply.", prompt: "Your manager says: “Sure, come through — what's up?”", options: ["I was hoping to swap my Saturday shift, if that's possible.", "You must change my shift.", "Shift. Saturday. No.", "I don't work Saturday now."], answer: "I was hoping to swap my Saturday shift, if that's possible.", note: "'I was hoping to…' makes it easy for a manager to say yes. That's the whole point of softening." },
  ],
  "Small talk with neighbours": [
    { type: "context_discussion", instruction: "Just chat — there are no wrong answers here.", prompt: "Have you met your neighbours yet? What did you talk about?" },
    { type: "true_false", instruction: "True or false?", prompt: "In Australian English, 'arvo' means 'afternoon'.", options: ["True", "False"], answer: "True", note: "True — 'Saturday arvo' is Saturday afternoon. You'll hear it constantly." },
    { type: "mini_task", instruction: "A real task — say it out loud if you can.", prompt: "A neighbour invites you to a barbie on Saturday arvo. Accept the invitation in one friendly sentence." },
    { type: "spot_mistake", instruction: "Find the learner's error.", prompt: "What is the mistake in this small-talk question?", text: "“How has your weekend be?”", options: ["'be' should be 'been'", "'has' should be 'have'", "'your' should be 'you'", "'weekend' should be plural"], answer: "'be' should be 'been'", note: "The present perfect needs the past participle: 'How has your weekend BEEN?'" },
  ],
  "Going to the beach": [
    { type: "context_discussion", instruction: "Just chat — there are no wrong answers here.", prompt: "Have you ever been to an Australian beach? What was it like?" },
    { type: "mcq", instruction: "Choose the correct answer.", prompt: "What do the red and yellow flags on an Australian beach mean?", options: ["They show the safest area to swim", "They mean the beach is closed", "They show where you can have a barbecue", "They mark the car park"], answer: "They show the safest area to swim", note: "The flags mark the area watched by lifeguards — always swim between them." },
    { type: "complete_dialogue", instruction: "Choose the missing line.", prompt: "Complete the exchange:", text: "You: \"Is it safe to swim here?\"\nLifeguard: ______", options: ["\"Yes, swim between the red and yellow flags.\"", "\"No, go home.\"", "\"I don't know.\"", "\"The water is cold.\""], answer: "\"Yes, swim between the red and yellow flags.\"", note: "Lifeguards direct you to the flagged area — that's where they're watching." },
    { type: "spot_mistake", instruction: "Find the learner's error.", prompt: "What is the mistake in this sentence?", text: "\u201cYou should to wear sunscreen at the beach.\u201d", options: ["\u2018to' should be removed", "\u2018should' should be \u2018must'", "\u2018wear' should be \u2018wearing'", "\u2018at' should be \u2018in'"], answer: "\u2018to' should be removed", note: "After a modal verb (should, must, can) we use the base verb directly — no \u2018to'." },
  ],
};

/* Five practice questions per scenario, each drilling THAT scenario's grammar
   point — the same structure the explanation screen has just taught. Every note
   names the rule, so the feedback teaches rather than merely marks. */
const PACK_GRAMMAR_PRACTICE = {
  "Asking for directions": [
    { stem: "Complete the question: “___ you tell me where the station is?”", options: ["Could", "Am", "Does", "Is"], answer: "Could", note: "'Could' is the modal verb, and in a question it comes before the subject: Could + you + verb." },
    { stem: "Choose the correct word order:", options: ["Could you tell me the way to the station?", "Could tell you me the way to the station?", "You could tell me the way to the station?", "Tell could you me the way to the station?"], answer: "Could you tell me the way to the station?", note: "The polite question form is modal + subject + verb: 'Could you tell…'" },
    { stem: "Find the mistake: “Can you tells me how to get there?”", options: ["'tells' should be 'tell'", "'Can' should be 'Could'", "'you' should be 'your'", "'to' should be 'for'"], answer: "'tells' should be 'tell'", note: "After a modal verb (can, could) we always use the base verb — never the -s form." },
    { stem: "Complete: “Could you ___ me to the traffic lights?”", options: ["direct", "directs", "directing", "directed"], answer: "direct", note: "Base verb after 'could' — that's the form rule for every polite question form." },
    { stem: "Which sentence is grammatically correct?", options: ["Can you show me the intersection?", "Can you to show me the intersection?", "Can showing you me the intersection?", "Can you showing me the intersection?"], answer: "Can you show me the intersection?", note: "Modal + subject + base verb. No 'to', no -ing." },
  ],
  "Ordering at a café": [
    { stem: "Complete the request: “___ I get a flat white, please?”", options: ["Could", "Do", "Am", "Have"], answer: "Could", note: "'Could I get…' is the polite request form: modal + subject + base verb." },
    { stem: "Choose the correct word order:", options: ["Could I have a long black, please?", "Could have I a long black, please?", "I could have a long black, please?", "Have could I a long black, please?"], answer: "Could I have a long black, please?", note: "In a question the modal comes first: Could + I + have." },
    { stem: "Find the mistake: “Could I to get a takeaway coffee?”", options: ["'to' should be removed", "'Could' should be 'Can'", "'I' should be 'me'", "'get' should be 'getting'"], answer: "'to' should be removed", note: "We never put 'to' after a modal: 'Could I GET…', not 'Could I to get…'" },
    { stem: "Complete: “Could I ___ the bill, thanks?”", options: ["have", "having", "had", "to have"], answer: "have", note: "Base verb after 'could' — the polite request form never changes." },
    { stem: "Which sentence is grammatically correct?", options: ["Could I get soy milk instead?", "Could I getting soy milk instead?", "Could get I soy milk instead?", "Could I gets soy milk instead?"], answer: "Could I get soy milk instead?", note: "Could + subject + base verb. That's the whole pattern for polite requests." },
  ],
  "A visit to the doctor": [
    { stem: "Complete: “I ___ had a sore throat since Monday.”", options: ["have", "am", "did", "was"], answer: "have", note: "The present perfect is have/has + past participle: 'I have had…'" },
    { stem: "Find the mistake: “I have had a headache since three days.”", options: ["'since' should be 'for'", "'have' should be 'has'", "'had' should be 'have'", "'a' should be removed"], answer: "'since' should be 'for'", note: "With the present perfect: 'for' + a length of time, 'since' + a starting point." },
    { stem: "Complete: “I've ___ tired all week.”", options: ["been feeling", "feeling", "feel", "am feeling"], answer: "been feeling", note: "After 'I've' we need a past participle — 'been' — to build the present perfect." },
    { stem: "Complete: “She ___ seen the GP twice this month.”", options: ["has", "have", "is", "did"], answer: "has", note: "Third person singular takes 'has' in the present perfect: has + past participle 'seen'." },
    { stem: "Which sentence is grammatically correct?", options: ["I've had a fever for two days.", "I have a fever since two days.", "I had a fever for two days ago.", "I am having fever since Monday."], answer: "I've had a fever for two days.", note: "Present perfect + 'for' + a length of time — the standard way to describe an ongoing symptom." },
  ],
  "Renting a flat": [
    { stem: "Complete the indirect question: “Could you tell me when ___?”", options: ["the flat is available", "is the flat available", "available is the flat", "is available the flat"], answer: "the flat is available", note: "Indirect questions use STATEMENT word order: subject + verb — 'the flat is', not 'is the flat'." },
    { stem: "Find the mistake: “Do you know how much is the bond?”", options: ["'is the bond' should be 'the bond is'", "'know' should be 'knowing'", "'how much' should be 'how many'", "'Do' should be 'Does'"], answer: "'is the bond' should be 'the bond is'", note: "Inside an indirect question we don't invert — keep subject before verb." },
    { stem: "Choose the correct word order:", options: ["Could you tell me where the inspection is?", "Could you tell me where is the inspection?", "Could you tell me where is inspection the?", "Could tell me you where the inspection is?"], answer: "Could you tell me where the inspection is?", note: "Indirect question = 'Could you tell me' + question word + subject + verb." },
    { stem: "Complete: “I'd like to know if the landlord ___ pets.”", options: ["allows", "allow", "allowing", "is allow"], answer: "allows", note: "Statement order inside the indirect question, so the verb agrees normally: the landlord allows." },
    { stem: "Which sentence is grammatically correct?", options: ["Do you know when the lease starts?", "Do you know when starts the lease?", "Do you know when does the lease start?", "Do you know when the lease start?"], answer: "Do you know when the lease starts?", note: "No inversion and no extra auxiliary inside an indirect question — just subject + verb." },
  ],
  "Opening a bank account": [
    { stem: "Complete: “I'd like ___ open a savings account.”", options: ["to", "for", "of", "at"], answer: "to", note: "The pattern is 'I'd like TO + verb' — the 'to' is part of the form." },
    { stem: "Find the mistake: “I'd like to opening an account.”", options: ["'opening' should be 'open'", "'like' should be 'liking'", "'to' should be removed", "'an' should be 'a'"], answer: "'opening' should be 'open'", note: "'I'd like to' takes the base verb: I'd like to OPEN." },
    { stem: "Complete: “I'd like ___ my address, please.”", options: ["to update", "updating", "update", "to updating"], answer: "to update", note: "'I'd like to' + base verb. Both parts matter: the 'to' AND the base form." },
    { stem: "Choose the correct word order:", options: ["I'd like to transfer some money.", "I'd to like transfer some money.", "I like to would transfer some money.", "To I'd like transfer some money."], answer: "I'd like to transfer some money.", note: "Subject + 'd like + to + verb. That's the polite formal request form." },
    { stem: "Which sentence is grammatically correct?", options: ["I'd like to speak to a teller.", "I'd like speak to a teller.", "I'd like to speaking to a teller.", "I'd liked to speak to a teller."], answer: "I'd like to speak to a teller.", note: "'I'd like to speak' — base verb after 'to', and 'like' never takes -ed here." },
  ],
  "Catching a train or bus": [
    { stem: "Complete: “Where ___ I tap my Opal card?”", options: ["do", "am", "does", "is"], answer: "do", note: "Question word + DO + subject + verb. With 'I' we use 'do'." },
    { stem: "Complete: “___ this bus go to the city?”", options: ["Does", "Do", "Is", "Are"], answer: "Does", note: "'This bus' is third person singular, so the auxiliary is 'does' — and the verb stays base: go." },
    { stem: "Find the mistake: “Where I do tap off?”", options: ["'I do' should be 'do I'", "'tap' should be 'tapping'", "'Where' should be 'What'", "'off' should be 'on'"], answer: "'I do' should be 'do I'", note: "English questions invert: the auxiliary 'do' comes BEFORE the subject." },
    { stem: "Choose the correct word order:", options: ["What time does the express leave?", "What time the express does leave?", "What time leaves the express?", "Does what time the express leave?"], answer: "What time does the express leave?", note: "Question word + does + subject + base verb — the standard question pattern." },
    { stem: "Which sentence is grammatically correct?", options: ["Which platform does the train leave from?", "Which platform the train leaves from?", "Which platform does the train leaves from?", "Which platform do the train leave from?"], answer: "Which platform does the train leave from?", note: "After the auxiliary 'does', the main verb goes back to its base form: leave, not leaves." },
  ],
  "Shopping and returns": [
    { stem: "Complete: “This jumper is ___ than that one.”", options: ["cheaper", "cheapest", "more cheap", "cheap"], answer: "cheaper", note: "Short adjectives take -er to compare: cheap → cheaper + than." },
    { stem: "Complete: “Do you have a ___ size?”", options: ["bigger", "biggest", "more big", "more bigger"], answer: "bigger", note: "Comparative of a short adjective: big → bigger. One comparative marker only." },
    { stem: "Find the mistake: “This one is more cheaper online.”", options: ["'more' should be removed", "'cheaper' should be 'cheap'", "'is' should be 'are'", "'online' should be 'on line'"], answer: "'more' should be removed", note: "Never double the comparative: it's 'cheaper', not 'more cheaper'." },
    { stem: "Complete: “The blue one is ___ expensive than the red one.”", options: ["more", "most", "much", "very"], answer: "more", note: "Longer adjectives take 'more … than' instead of -er: more expensive than." },
    { stem: "Which sentence is grammatically correct?", options: ["This shirt is nicer than that one.", "This shirt is more nicer than that one.", "This shirt is more nice than that one.", "This shirt is nicest than that one."], answer: "This shirt is nicer than that one.", note: "Short adjective → -er + than. 'Nicest' is the superlative, and doesn't take 'than'." },
  ],
  "Talking to your teacher": [
    { stem: "Complete: “Could you ___ that again, please?”", options: ["explain", "explains", "explaining", "to explain"], answer: "explain", note: "After the modal 'could' we use the base verb: Could you EXPLAIN…" },
    { stem: "Choose the correct word order:", options: ["Could you repeat the question, please?", "Could repeat you the question, please?", "You could repeat the question, please?", "Repeat could you the question, please?"], answer: "Could you repeat the question, please?", note: "Clarification questions follow modal + subject + base verb." },
    { stem: "Find the mistake: “Could you to explain the assignment?”", options: ["'to' should be removed", "'Could' should be 'Can'", "'explain' should be 'explaining'", "'the' should be 'a'"], answer: "'to' should be removed", note: "No 'to' after a modal verb: 'Could you explain…', never 'Could you to explain…'" },
    { stem: "Complete: “Sorry, could you say that ___ slowly?”", options: ["more", "most", "much", "very"], answer: "more", note: "'More slowly' — and the base verb 'say' still follows 'could you'." },
    { stem: "Which sentence is grammatically correct?", options: ["Could you clarify the due date?", "Could you clarifies the due date?", "Could you clarifying the due date?", "Could clarify you the due date?"], answer: "Could you clarify the due date?", note: "Modal + subject + base verb — the same form every time you ask for clarification." },
  ],
  "Speaking to your manager": [
    { stem: "Complete: “I was hoping ___ take Friday off.”", options: ["to", "for", "that", "of"], answer: "to", note: "The softening pattern is 'I was hoping TO + verb'." },
    { stem: "Find the mistake: “I was hoping to swapping my shift.”", options: ["'swapping' should be 'swap'", "'hoping' should be 'hope'", "'was' should be 'am'", "'to' should be removed"], answer: "'swapping' should be 'swap'", note: "'Hoping to' takes the base verb: I was hoping to SWAP." },
    { stem: "Complete: “Could I ___ you for a minute about the roster?”", options: ["grab", "grabs", "grabbing", "to grab"], answer: "grab", note: "Base verb after the modal 'could' — 'Could I grab you…'" },
    { stem: "Choose the correct word order:", options: ["I was hoping to change my shift.", "I was hoping change to my shift.", "I hoping was to change my shift.", "To change I was hoping my shift."], answer: "I was hoping to change my shift.", note: "Subject + was hoping + to + base verb. That's the softened request form." },
    { stem: "Which sentence is grammatically correct?", options: ["Could I ask about overtime?", "Could I asking about overtime?", "Could I to ask about overtime?", "Could ask I about overtime?"], answer: "Could I ask about overtime?", note: "Could + subject + base verb — no 'to', no -ing." },
  ],
  "Small talk with neighbours": [
    { stem: "Complete: “How ___ your weekend been?”", options: ["has", "have", "is", "does"], answer: "has", note: "'Your weekend' is singular, so the present perfect auxiliary is 'has' + been." },
    { stem: "Complete: “How ___ you been settling in?”", options: ["have", "has", "are", "do"], answer: "have", note: "With 'you' the present perfect auxiliary is 'have': How have you been…" },
    { stem: "Find the mistake: “How has your week be?”", options: ["'be' should be 'been'", "'has' should be 'have'", "'your' should be 'you'", "'week' should be 'weeks'"], answer: "'be' should be 'been'", note: "The present perfect needs the past participle 'been', not the base verb 'be'." },
    { stem: "Choose the correct word order:", options: ["How has the barbie been?", "How the barbie has been?", "How been has the barbie?", "Has how the barbie been?"], answer: "How has the barbie been?", note: "Question word + has + subject + been — the small-talk pattern you'll hear every week." },
    { stem: "Which sentence is grammatically correct?", options: ["How have you been, mate?", "How you have been, mate?", "How has you been, mate?", "How you been has, mate?"], answer: "How have you been, mate?", note: "Have + subject + been. The auxiliary goes before the subject in a question." },
  ],
  "Going to the beach": [
    { stem: "Complete: \"You ___ swim between the red and yellow flags.\"", options: ["should", "should to", "shoulding", "to should"], answer: "should", note: "Modal + base verb: \u2018should swim' — no \u2018to', no -ing." },
    { stem: "Complete: \"You ___ swim outside the flags because it is dangerous.\"", options: ["mustn't", "mustn't to", "don't must", "not must"], answer: "mustn't", note: "Prohibition: mustn't + base verb. \u2018Mustn't swim' means it is not allowed." },
    { stem: "Find the mistake: \"You should to wear sunscreen every day.\"", options: ["\u2018to' should be removed", "\u2018should' should be \u2018must'", "\u2018wear' should be \u2018wearing'", "\u2018every' should be \u2018all'"], answer: "\u2018to' should be removed", note: "After a modal verb we never add \u2018to': should + base verb." },
    { stem: "Complete: \"People ___ enter the water if there is a shark warning.\"", options: ["mustn't", "should", "must to", "can to"], answer: "mustn't", note: "Prohibition: mustn't + base verb — it means you are not allowed." },
    { stem: "Which sentence is grammatically correct?", options: ["I think visitors should learn about beach safety.", "I think visitors should to learn about beach safety.", "I think visitors should learning about beach safety.", "I think visitors must to learn about beach safety."], answer: "I think visitors should learn about beach safety.", note: "Opinion: think + should + base verb. No \u2018to', no -ing after the modal." },
  ],
};

/* Attach the authored content to its scenario. Keeping it ON the pack preserves
   the "ONE pack = ONE coherent situation" invariant every mock branch relies on. */
MOCK_PACKS.forEach((pk) => {
  pk.warmUp = PACK_WARMUPS[pk.ctx] || [];
  pk.grammar.practice = PACK_GRAMMAR_PRACTICE[pk.ctx] || [];
});

/* ==================== TEACHER-AUTHORED LESSONS ====================
   Complete lessons written by a teacher. These bypass the AI planning
   pipeline entirely — the content IS the lesson. AI is used only for
   speaking conversations and personalised closing summaries.

   STORAGE FORMAT: metadata + content separation.
   - metadata: indexing, search, sequencing, analytics.
   - content: pedagogical sections mirroring how teachers plan lessons.
   The runtime blueprint (what components consume) is flat — the
   prepareAuthoredBlueprint() function bridges storage to runtime.

   SCHEMA VERSIONING: every lesson declares schemaVersion so future
   format changes never break existing authored content.

   LOCALISATION: string content is stored as-is (English). A future
   l10n layer could wrap content fields in locale-keyed objects
   (e.g. { en: "...", zh: "..." }) without restructuring. The
   architecture avoids assumptions that prevent this.

   FILE STRUCTURE (future):
     src/lessons/authored/b1/beach-safety.js
     src/lessons/authored/b1/shopping.js
     src/lessons/authored/index.js  ← exports all
   For now, lessons live in this file. Extraction is trivial because
   each lesson is a self-contained object and prepareAuthoredBlueprint
   is the only consumer.
   ================================================================ */
const AUTHORED_LESSONS = [
  {
    metadata: {
      id: "beach-safety-b1",
      title: "Going to the Beach",
      lessonType: "authored",
      schemaVersion: 1,
      author: "Teacher Leo",
      version: 1,
      level: "Low Intermediate",
      cefr: "B1",
      topic: "Beach safety",
      tags: ["beach", "safety", "modals", "obligation", "advice", "Australian culture"],
      estimatedDuration: "90\u2013120 minutes",
      sequence: null,
      pack: null,
      lastUpdated: "2026-07-14",
    },

    // Core lesson identity — the "what and why"
    context: "Going to the beach",
    communicativeObjective: "Understand beach safety rules and give safety advice using modal verbs",
    explanation: "Today we're learning about going to the beach in Australia. Beaches here are beautiful, but they can also be dangerous if you don't know the safety rules. By the end of this lesson, you'll be able to give beach safety advice confidently using modal verbs.",
    mainSkill: "both",
    mission: "Next time you visit a beach, find the red and yellow flags and tell someone what they mean — in English.",
    learningOutcome: "You can understand Australian beach safety rules and give advice using modal verbs (must, should, mustn't, can't).",
    learningOutcomes: [
      "Understand the main ideas of an authentic reading about beach safety",
      "Use twelve key beach safety vocabulary items appropriately",
      "Correctly form and use modal verbs of obligation, prohibition, advice and opinion",
      "Discuss advantages and disadvantages of beach safety rules",
      "Express opinions using supporting reasons",
      "Give beach safety advice using sentence frames",
    ],
    skillFocus: ["reading", "listening", "speaking", "vocabulary", "grammar", "critical thinking"],

    content: {
      warmUp: {
        questions: [
          "Do you like going to the beach?",
          "What do you do when you are at the beach?",
          "What must you bring to the beach?",
          "Is there anything you shouldn't do when at the beach?",
        ],
        activities: [
          { type: "context_discussion", instruction: "Just chat — there are no wrong answers here.", prompt: "Have you ever been to an Australian beach? What was it like?" },
          { type: "mcq", instruction: "Choose the correct answer.", prompt: "What do the red and yellow flags on an Australian beach mean?", options: ["They show the safest area to swim", "They mean the beach is closed", "They show where you can have a barbecue", "They mark the car park"], answer: "They show the safest area to swim", note: "The flags mark the area watched by lifeguards — always swim between them." },
          { type: "complete_dialogue", instruction: "Choose the missing line.", prompt: "Complete the exchange:", text: "You: \"Is it safe to swim here?\"\nLifeguard: ______", options: ["\"Yes, swim between the red and yellow flags.\"", "\"No, go home.\"", "\"I don't know.\"", "\"The water is cold.\""], answer: "\"Yes, swim between the red and yellow flags.\"", note: "Lifeguards direct you to the flagged area — that's where they're watching." },
          { type: "spot_mistake", instruction: "Find the learner's error.", prompt: "What is the mistake in this sentence?", text: "\u201cYou should to wear sunscreen at the beach.\u201d", options: ["\u2018to' should be removed", "\u2018should' should be \u2018must'", "\u2018wear' should be \u2018wearing'", "\u2018at' should be \u2018in'"], answer: "\u2018to' should be removed", note: "After a modal verb (should, must, can) we use the base verb directly — no \u2018to'." },
        ],
      },

      vocabulary: {
        items: [
          { word: "flags", pos: "noun", meaning: "Pieces of coloured material on a pole that show information or warnings. At Australian beaches, red and yellow flags show the safe area to swim.", ipa: "/fl\u00e6\u0261z/", stress: "O", syllables: "flags", example: "The red and yellow flags show the safe swimming area.", examples: ["Look for the flags before you swim.", "The flags were up, so we knew it was safe."], related: ["warning", "signal", "sign"], collocations: ["red and yellow flags", "between the flags", "look for the flags"] },
          { word: "swim", pos: "verb", meaning: "To move through water using your arms and legs.", ipa: "/sw\u026am/", stress: "O", syllables: "swim", example: "You should swim between the flags.", examples: ["I learned to swim when I was five.", "We went swimming at Bondi Beach."], related: ["swimmer", "swimming", "stroke"], collocations: ["swim between", "go swimming", "learn to swim"] },
          { word: "shade", pos: "noun", meaning: "A cool, darker area protected from direct sunlight.", ipa: "/\u0283\u00e6\u026ad/", stress: "O", syllables: "shade", example: "Sit in the shade when the sun is strong.", examples: ["We found some shade under a tree.", "There isn't much shade on this beach."], related: ["shadow", "shelter", "cover"], collocations: ["sit in the shade", "find shade", "in the shade"] },
          { word: "sunbathe", pos: "verb", meaning: "To sit or lie in the sun to relax or get a tan.", ipa: "/\u02c8s\u028cnbe\u026a\u00f0/", stress: "O o", syllables: "sun\u00b7bathe", example: "Some people like to sunbathe at the beach.", examples: ["She was sunbathing on a towel.", "Be careful when you sunbathe — use sunscreen."], related: ["sunbather", "tan", "sunlight"], collocations: ["like to sunbathe", "sunbathe on the beach", "sunbathe safely"] },
          { word: "sunscreen", pos: "noun", meaning: "A cream or lotion you put on your skin to protect it from the sun.", ipa: "/\u02c8s\u028cnski\u02d0n/", stress: "O o", syllables: "sun\u00b7screen", example: "You should wear sunscreen every day.", examples: ["Don't forget to put on sunscreen.", "I need to buy more sunscreen before the weekend."], related: ["SPF", "sun protection", "lotion"], collocations: ["wear sunscreen", "put on sunscreen", "apply sunscreen"] },
          { word: "shark", pos: "noun", meaning: "A large sea animal with sharp teeth that lives in the ocean.", ipa: "/\u0283\u0251\u02d0k/", stress: "O", syllables: "shark", example: "A shark warning can close a beach.", examples: ["They spotted a shark near the shore.", "Shark attacks are rare but serious."], related: ["ocean", "predator", "marine life"], collocations: ["shark warning", "shark attack", "great white shark"] },
          { word: "drown", pos: "verb", meaning: "To die because you cannot breathe while underwater.", ipa: "/dra\u0275n/", stress: "O", syllables: "drown", example: "People can drown if they ignore safety rules.", examples: ["Never swim alone — you could drown.", "The lifeguard saved the child from drowning."], related: ["drowning", "underwater", "rescue"], collocations: ["risk of drowning", "almost drowned", "prevent drowning"] },
          { word: "towel", pos: "noun", meaning: "A piece of cloth used to dry your body after swimming or being in water.", ipa: "/\u02c8ta\u028a\u0259l/", stress: "O o", syllables: "tow\u00b7el", example: "Bring a towel after swimming.", examples: ["I forgot my towel at home.", "She dried herself with a beach towel."], related: ["beach towel", "dry", "cloth"], collocations: ["bring a towel", "beach towel", "dry off with a towel"] },
          { word: "sunburn", pos: "noun", meaning: "Red and painful skin caused by spending too much time in the sun.", ipa: "/\u02c8s\u028cnb\u025c\u02d0n/", stress: "O o", syllables: "sun\u00b7burn", example: "Too much sun can cause sunburn.", examples: ["I got terrible sunburn on my first day.", "Sunburn can be very painful."], related: ["burn", "UV", "skin damage"], collocations: ["get sunburn", "cause sunburn", "painful sunburn"] },
          { word: "thongs", pos: "noun", meaning: "A type of open shoe worn in warm weather. In other countries, they are called flip-flops.", ipa: "/\u03b8\u0252\u014bz/", stress: "O", syllables: "thongs", example: "Australians often wear thongs at the beach.", examples: ["I bought a new pair of thongs for summer.", "Don't forget your thongs — the sand gets hot!"], related: ["flip-flops", "sandals", "footwear"], collocations: ["wear thongs", "a pair of thongs", "thongs and boardshorts"] },
          { word: "rip current", pos: "noun", meaning: "A strong flow of water that moves away from the beach and can pull swimmers out to sea.", ipa: "/\u02c8r\u026ap \u02cck\u028cr\u0259nt/", stress: "O o", syllables: "rip cur\u00b7rent", example: "A rip current can pull swimmers away from the beach.", examples: ["If you are caught in a rip current, stay calm.", "Rip currents are one of the biggest dangers at Australian beaches."], related: ["current", "undertow", "tide"], collocations: ["caught in a rip current", "dangerous rip current", "spot a rip current"] },
          { word: "lifeguard", pos: "noun", meaning: "A trained person who watches swimmers and helps people who are in danger in the water.", ipa: "/\u02c8la\u026af\u0261\u0251\u02d0d/", stress: "O o", syllables: "life\u00b7guard", example: "The lifeguard watches swimmers.", examples: ["Always swim where the lifeguard can see you.", "The lifeguard rescued a swimmer yesterday."], related: ["rescue", "patrol", "safety"], collocations: ["listen to the lifeguard", "lifeguard station", "on-duty lifeguard"] },
        ],
        matchSet: ["flags", "sunbathe", "sunscreen", "shark", "drown", "thongs", "rip current", "lifeguard"],
      },

      pronunciation: {
        focus: "The /\u03b8/ sound, the /\u00e6/ sound, and word stress in two-syllable beach words",
        tips: [
          "Put your tongue lightly between your teeth for /\u03b8/. Push air out gently. Do not use /t/ or /s/.",
          "For /\u00e6/, keep your mouth open and relaxed — like the vowel in cat, map, bad.",
          "Stress the first syllable in two-syllable beach words: SUNscreen, SUNburn, LIFEguard, TOWel.",
        ],
        focusSections: [
          { title: "The /\u03b8/ sound", description: "Some students may find this sound difficult.", targetWord: "thongs", ipa: "/\u03b8\u0252\u014bz/", instructions: ["Put your tongue lightly between your teeth.", "Push air out gently.", "Do not use /t/ or /s/."], practiceWords: ["thongs", "think", "three"] },
          { title: "The /\u00e6/ sound", description: "This sound appears in many beach safety words.", targetWords: [{ word: "flags", ipa: "/fl\u00e6\u0261z/" }, { word: "shade", ipa: "/\u0283\u00e6\u026ad/" }], instructions: ["The mouth is open and relaxed."], practiceWords: ["cat", "map", "bad"] },
          { title: "Word stress", description: "Stress the first syllable in many two-syllable beach words.", correct: ["SUNscreen", "SUNburn", "LIFEguard", "TOWel"], incorrect: ["sunSCREEN", "sunBURN", "lifeGUARD"], practiceWords: ["flags", "sunscreen", "lifeguard", "sunburn", "rip current", "towel"] },
        ],
      },

      reading: {
        passage: "Australia is famous for its beautiful beaches. Every year, many people visit the beach to swim, relax, and enjoy the sunshine. However, it is important to understand beach safety rules before entering the water.\n\nWhen you visit an Australian beach, you should always look for the flags. Red and yellow flags show the safest area to swim. You should swim between these flags because a lifeguard is watching this area and can help if there is a problem.\n\nYou should be careful of a rip current. A rip current is a strong flow of water that moves away from the beach and can pull swimmers out to sea. If you are caught in a rip current, you should stay calm and follow the lifeguard's advice.\n\nThe Australian sun can also be dangerous. You should use sunscreen to protect your skin and sit in the shade when the sun is very strong. Spending too much time in the sun can cause sunburn, which makes your skin red and painful. Some people like to sunbathe, but they should be careful and protect their skin.\n\nAt the beach, you can enjoy many activities. You can swim in the ocean, relax on a towel, or walk along the sand wearing thongs. However, you should always check the safety signs because sometimes there may be dangers, such as a shark in the water.\n\nSwimming can be fun, but it can also be dangerous. If people do not follow safety rules, they can drown. Always listen to the lifeguard, follow the signs, and make safe choices when you visit an Australian beach.",
        questions: [
          { stem: "What is the main purpose of the reading?", options: ["To explain how to build a beach house in Australia.", "To teach people how to stay safe at Australian beaches.", "To describe the most beautiful beaches in Australia."], answer: "To teach people how to stay safe at Australian beaches.", note: "Good — the whole text is about safety rules and advice." },
          { stem: "Why should people swim between the red and yellow flags?", options: ["It is the area where the water is warmest.", "It is the area watched by lifeguards and considered safer.", "It is the only place where people can use towels."], answer: "It is the area watched by lifeguards and considered safer.", note: "Exactly — the flags mark where the lifeguards are watching." },
          { stem: "Based on the information in the reading, what is likely true about people who visit Australian beaches?", options: ["They should learn about beach safety before swimming.", "They do not need to follow safety rules.", "They should avoid swimming in the ocean."], answer: "They should learn about beach safety before swimming.", note: "Right — the text says it is important to understand safety rules before entering the water." },
          { stem: "What can happen if someone is caught in a rip current?", options: ["They can be pulled away from the beach.", "They can get sunburn from the water.", "They can find a safer place to swim."], answer: "They can be pulled away from the beach.", note: "Yes — a rip current pulls swimmers out to sea, which is why you should stay calm." },
          { stem: "What message does the author want readers to think about after reading this article?", options: ["Beaches are only dangerous for tourists.", "People can enjoy Australian beaches by making safe choices.", "Swimming is the most important beach activity."], answer: "People can enjoy Australian beaches by making safe choices.", note: "That's the main message — enjoy the beach, but be safe." },
        ],
      },

      listening: {
        script: "Australia is famous for its beautiful beaches, and many people visit them every year to swim, relax, and enjoy the sun. However, visitors need to understand beach safety rules before entering the water. People should always look for the red and yellow flags because they show the safest area to swim.\n\nAustralian beaches often have trained lifeguards who watch swimmers and help people in danger. Visitors should listen to their advice and follow safety signs. Swimming outside the flags can be dangerous because strong rip currents can pull swimmers away from the beach.\n\nThe Australian sun can also create health problems. People should use sunscreen to protect their skin and sit in the shade when the sun is very strong. Spending too much time in the sun can cause sunburn, which makes the skin red and painful.\n\nThere are also other dangers at Australian beaches. Sometimes there may be a shark warning, dangerous waves, or unsafe swimming conditions. People must be careful because ignoring safety rules can cause someone to drown.\n\nBeaches are places where people can have fun, but visitors should make safe choices. Learning about beach safety helps people enjoy the ocean while protecting themselves and others in the water.",
        gapFill: [
          { position: 1, context: "People should always look for the red and yellow ____________", answer: "flags" },
          { position: 2, context: "Australian beaches often have trained ____________", answer: "lifeguards" },
          { position: 3, context: "strong ____________ can pull swimmers away from the beach", answer: "rip currents" },
          { position: 4, context: "People should use ____________ to protect their skin", answer: "sunscreen" },
          { position: 5, context: "sit in the ____________ when the sun is very strong", answer: "shade" },
          { position: 6, context: "Spending too much time in the sun can cause ____________", answer: "sunburn" },
          { position: 7, context: "Sometimes there may be a ____________ warning", answer: "shark" },
          { position: 8, context: "ignoring safety rules can cause someone to ____________", answer: "drown" },
          { position: 9, context: "protecting themselves and others in the ____________", answer: "water" },
        ],
      },

      grammar: {
        point: "Modal verbs of obligation, prohibition and advice",
        meaning: "Modal verbs like must, should, mustn't and can't express rules, advice and things that are not allowed.",
        form: "modal (must / should / mustn't / can't) + base verb",
        usage: "Giving safety advice, explaining rules, expressing what you think is a good idea — essential for everyday Australian life.",
        examples: [
          "You must wear sunscreen at the beach.",
          "You mustn't swim outside the flags.",
          "You should check the weather before swimming.",
          "I think people should learn about beach safety.",
        ],
        reference: [
          { function: "Obligation", form: "must / have to + base verb", example: "You must wear sunscreen at the beach." },
          { function: "Prohibition", form: "mustn't / can't + base verb", example: "You mustn't swim outside the flags." },
          { function: "Advice", form: "should / shouldn't + base verb", example: "You should check the weather before swimming." },
          { function: "Opinion", form: "think/believe + should/shouldn't + base verb", example: "I think people should learn about beach safety." },
        ],
        practice: [
          { stem: "You __________ wear sunscreen when you spend time in the Australian sun.", options: ["should", "should to", "shoulding", "to should"], answer: "should", note: "Advice: should + base verb. No \u2018to', no -ing." },
          { stem: "You __________ swim outside the red and yellow flags because it is dangerous.", options: ["mustn't", "mustn't to", "don't must", "not must"], answer: "mustn't", note: "Prohibition: mustn't + base verb. It means you are not allowed." },
          { stem: "Visitors __________ listen to the lifeguard's instructions at the beach.", options: ["should", "should to", "to should", "shoulding"], answer: "should", note: "Advice: should + base verb — the same pattern every time." },
          { stem: "You __________ check the weather before going swimming.", options: ["should", "should to", "must to", "to must"], answer: "should", note: "Advice: should + base verb. No \u2018to' after a modal." },
          { stem: "People __________ enter the water if there is a shark warning.", options: ["mustn't", "should", "must to", "can to"], answer: "mustn't", note: "Prohibition: mustn't + base verb — it means you are not allowed." },
          { stem: "You __________ bring a towel, water, and sunscreen when you visit the beach.", options: ["should", "should to", "shoulding", "to should"], answer: "should", note: "Advice: should + base verb." },
          { stem: "I think international students __________ learn about Australian beach safety.", options: ["should", "should to", "must to", "can to"], answer: "should", note: "Opinion: think + should + base verb. No \u2018to', no -ing after the modal." },
          { stem: "People __________ ignore warning signs at the beach because they are there to keep people safe.", options: ["mustn't", "should", "must to", "to must"], answer: "mustn't", note: "Prohibition: mustn't + base verb. The signs exist for safety." },
        ],
      },

      vocabReview: {
        oddOneOut: [
          { options: ["sunscreen", "towel", "shark"], answer: "shark", note: "Sunscreen and towel are things you bring to the beach. A shark is a danger." },
          { options: ["swim", "drown", "sunbathe"], answer: "drown", note: "Swimming and sunbathing are fun activities. Drowning is a danger." },
          { options: ["lifeguard", "rip current", "shade"], answer: "shade", note: "Lifeguards and rip currents are about water safety. Shade is about sun protection." },
          { options: ["flags", "warning", "holiday"], answer: "holiday", note: "Flags and warnings are about safety. A holiday is a time off work." },
          { options: ["sunburn", "sunscreen", "towel"], answer: "towel", note: "Sunburn and sunscreen are both about the sun. A towel is for drying." },
        ],
        completeSentences: [
          { stem: "You should wear ____________ to protect your skin from the Australian sun.", answer: "sunscreen" },
          { stem: "A ____________ is a strong flow of water that can pull swimmers away from the beach.", answer: "rip current" },
          { stem: "The ____________ watches swimmers and helps people who are in danger.", answer: "lifeguard" },
          { stem: "If you spend too much time in the sun, you may get ____________.", answer: "sunburn" },
          { stem: "You should swim between the red and yellow ____________ at Australian beaches.", answer: "flags" },
        ],
      },

      discussion: {
        questions: [
          "What should tourists do when they visit an Australian beach?",
          "What rules must people follow to stay safe at the beach?",
          "What things shouldn't people do when swimming in the ocean?",
          "Do you think people should learn about beach safety before visiting Australia? Why?",
          "Should beaches have more safety rules, or do people already have enough responsibility?",
        ],
        sentenceFrames: [
          { frame: "When visiting an Australian beach, people should … because …", example: "When visiting an Australian beach, people should swim between the flags because it is safer." },
          { frame: "One important beach rule is that people must …", example: "One important beach rule is that people must listen to lifeguards." },
          { frame: "People shouldn't … because …", example: "People shouldn't swim alone because it can be dangerous." },
          { frame: "I think international students should … because …", example: "I think international students should learn Australian beach safety because beaches can be different from their home countries." },
          { frame: "I believe beaches should / shouldn't have more rules because …", example: "I believe beaches should have more rules because safety is important." },
        ],
      },

      speaking: {
        sentenceFrames: [
          { frame: "You should wear sunscreen because …", example: "You should wear sunscreen because the Australian sun is strong." },
        ],
      },

      criticalThinking: {
        prompt: "Australia has many beautiful beaches, but beaches can also be dangerous. Every year, people experience problems such as sunburn, rip currents, and unsafe swimming conditions. Some people believe more education and safety programmes could help keep beach visitors safe.\n\nWith Leo, create a Beach Safety Plan for an Australian beach.",
        questions: [
          "What beach safety rules should visitors follow?",
          "What information should international students learn before visiting an Australian beach?",
          "What facilities or services should the beach include (e.g. lifeguard stations, signs, shaded areas, drinking water stations)?",
          "What rules would help people stay safe in the water?",
          "What challenges might visitors face at the beach, and how could they be solved?",
        ],
        sentenceFrames: [
          { frame: "Visitors should … because …", example: "Visitors should swim between the flags because it is safer." },
          { frame: "People must … to stay safe at the beach.", example: "People must listen to lifeguards to stay safe at the beach." },
          { frame: "Our beach should include … so that …", example: "Our beach should include more shaded areas so that people can avoid strong sunlight." },
          { frame: "One rule we would have is … . This would help because …", example: "One rule we would have is no swimming alone. This would help because people can get help quickly if there is a problem." },
          { frame: "One challenge might be … , and we could solve it by …", example: "One challenge might be dangerous swimming conditions, and we could solve it by adding more warning signs." },
        ],
      },
    },

    teacherNotes: {
      anticipatedProblems: [
        { problem: "Students may only give short answers in the warm-up.", solution: "Provide prompts and sentence frames: \u201cI usually…\u201d, \u201cPeople should…\u201d, \u201cPeople shouldn't…\u201d" },
        { problem: "Some vocabulary is culturally specific (rip current, thongs).", solution: "Use images/examples and compare Australian meanings." },
        { problem: "Students may pronounce thongs as /t\u0252\u014bz/ or /s\u0252\u014bz/.", solution: "Use mouth position demonstration and back-chaining." },
        { problem: "Students read every word slowly.", solution: "Set a short time limit and emphasise reading for general meaning." },
        { problem: "Students confuse must/mustn't and should/shouldn't.", solution: "Use timelines/examples and compare meanings." },
        { problem: "Students use \u2018to' after modal verbs (should to wear).", solution: "Highlight structure: modal + verb (no \u2018to')." },
        { problem: "Students lack confidence speaking.", solution: "Allow planning time and provide useful language." },
        { problem: "Students miss words during first listening.", solution: "Play twice: first for meaning, second for detail." },
      ],
      differentiation: {
        support: ["Sentence frames", "Pair work", "Vocabulary visible throughout", "Teacher modelling", "Mixed-ability grouping"],
        extension: "Debate: Should Australia invest in more beach safety programmes for international visitors? Students prepare arguments for and against.",
      },
      conceptCheckingQuestions: [
        { word: "rip current", question: "Does it move towards the beach or away?", answer: "Away" },
        { word: "lifeguard", question: "Does a lifeguard help people or sell tickets?", answer: "Help people" },
        { word: "shade", question: "Is it usually cooler or hotter?", answer: "Cooler" },
      ],
      homework: "Write 8 beach safety rules for international visitors using modal verbs. Example: \u201cVisitors should…\u201d",
    },

    answerKey: {
      vocabularyMatching: { flags: "d", swim: "h", shade: "b", sunbathe: "f", sunscreen: "c", shark: "j", drown: "a", towel: "i", sunburn: "e", thongs: "g", "rip current": "l", lifeguard: "m" },
      comprehension: ["b", "b", "a", "a", "b"],
      oddOneOut: ["shark", "drown", "shade", "holiday", "towel"],
      completeSentences: ["sunscreen", "rip current", "lifeguard", "sunburn", "flags"],
      grammarPractice: ["should", "mustn't", "should", "should", "mustn't", "should", "should", "mustn't"],
      listeningGapFill: ["flags", "lifeguards", "rip currents", "sunscreen", "shade", "sunburn", "shark", "drown", "water"],
    },
  },
];

/* ---------- prepareAuthoredBlueprint(lesson) ----------
   Transforms an authored lesson (metadata/content separation) into the
   flat runtime blueprint that every stage component consumes, plus
   pre-filled sections so ensureSection() skips AI generation.

   This function is the ONLY bridge between storage format and runtime
   format. Components never access lesson.content directly — they
   receive the flattened blueprint, which is identical in shape to an
   AI-generated blueprint. The rendering layer cannot tell the difference.
   ------------------------------------------------------------------- */
function prepareAuthoredBlueprint(lesson) {
  const m = lesson.metadata;
  const c = lesson.content;

  // Flat blueprint — same shape as AI-generated blueprints
  const blueprint = {
    // Metadata (carried through for logging, memory, display)
    lessonType: m.lessonType,
    id: m.id,
    cefr: m.cefr,
    schemaVersion: m.schemaVersion,

    // Core lesson identity
    context: lesson.context,
    communicativeObjective: lesson.communicativeObjective,
    explanation: lesson.explanation,
    mainSkill: lesson.mainSkill === "both" ? "reading" : lesson.mainSkill,
    // Components that support dual-mode will check the original value:
    _authoredMainSkill: lesson.mainSkill,
    mission: lesson.mission,
    learningOutcome: lesson.learningOutcome,
    learningOutcomes: lesson.learningOutcomes,
    skillFocus: lesson.skillFocus,

    // Warm-up
    warmUpQuestions: c.warmUp.questions,
    warmUpActivities: c.warmUp.activities,

    // Vocabulary — full set + matching subset
    vocabulary: c.vocabulary.items,
    matchVocab: c.vocabulary.matchSet,

    // Grammar
    grammar: c.grammar,

    // Pronunciation
    pronunciation: c.pronunciation,

    // Optional content — components render these when present
    readingPassage: c.reading ? c.reading.passage : undefined,
    readingQuestions: c.reading ? c.reading.questions : undefined,
    listeningScript: c.listening ? c.listening.script : undefined,
    listeningGapFill: c.listening ? c.listening.gapFill : undefined,
    vocabReviewExercises: c.vocabReview || undefined,
    discussionQuestions: c.discussion ? c.discussion.questions : undefined,
    criticalThinkingTask: c.criticalThinking || undefined,
    sentenceFrames: {
      speaking: c.speaking ? c.speaking.sentenceFrames : [],
      discussion: c.discussion ? c.discussion.sentenceFrames : [],
      criticalThinking: c.criticalThinking ? c.criticalThinking.sentenceFrames : [],
    },

    // Teacher reference (not rendered to student, used by summary AI)
    teacherNotes: lesson.teacherNotes,
  };

  // Pre-filled sections — ensureSection() will find these and skip AI
  const sections = {};

  // Skill section: reading passage + comprehension questions
  if (c.reading && c.reading.passage && c.reading.questions) {
    sections.skill = {
      passage: c.reading.passage,
      questions: c.reading.questions,
    };
  }

  // Grammar section: practice questions (the explanation lives on the blueprint)
  if (c.grammar && c.grammar.practice && c.grammar.practice.length) {
    sections.grammar = {
      grammarPoint: c.grammar.point,
      questions: c.grammar.practice,
    };
  }

  // Summary is NOT pre-filled — it is always personalised by AI to
  // the student's actual performance during this lesson.

  return { blueprint, sections };
}



/* ==================== AUTHENTICATION ====================
   Welcome landing, Sign Up, Sign In — the front door to Ask Leo.
   Accounts are stored in browser storage for now. When the app
   moves to Supabase/Firebase, replace saveKey/loadKey calls with
   real auth — the UI components stay identical.
   ======================================================== */

/* `slide` is deliberately NOT held here. Tapping either auth button unmounts
   this component, and state owned here would die with it — Back would then
   remount at slide 0 and send the student four screens backwards rather than
   one. The parent owns it so it survives the switch. */
function WelcomeLanding({ slide, setSlide, onSignUp, onSignIn }) {
  if (slide === 0) return (
    <div className="onboard" onClick={() => setSlide(1)}>
      <div className="intro-page">
        <p className="intro-subtitle splash-tagline">Your English teacher in Australia.</p>
        <button className="intro-next splash-arrow" onClick={(e) => { e.stopPropagation(); setSlide(1); }}><ChevronRight size={28} /></button>
      </div>
    </div>
  );
  if (slide === 1) return (
    <div className="onboard">
      <div className="intro-page">
<h2 className="intro-heading pop-in pop-d2">Learn English for your life in Australia.</h2>
        <p className="intro-body pop-in pop-d3">Leo is an English teacher who adapts to you — your level, your goals, and what you find difficult.</p>
        <button className="primary-btn wide pop-in pop-d7" onClick={() => setSlide(2)}>Next</button>
      </div>
    </div>
  );
  if (slide === 2) return (
    <div className="onboard" key="page3">
      <div className="intro-page">
<h2 className="intro-heading pop-in pop-d2">I'll remember what you learn.</h2>
        {/* G-10(5). The previous line promised a shared history to a student who
            has none yet — false at the exact moment it rendered, on the first
            screen they ever see. The replacement says what is true now, and
            what follows from it.
            The HEADING above was also changed under G-10(5): it was third person on the
            same card; Genesis ruled it in G-10(5), so it is now Leo's first person. */}
        <p className="intro-body pop-in pop-d3">Today I'm meeting you for the first time, so I don't know you yet. From here, what you find hard is what I plan around.</p>
        <button className="primary-btn wide pop-in pop-d7" onClick={() => setSlide(3)}>Next</button>
      </div>
    </div>
  );
  return (
    <div className="onboard" key="slide-3">
      <div className="intro-page">
<h2 className="intro-heading pop-in pop-d2">Ready to begin?</h2>
        <button className="primary-btn wide auth-btn pop-in pop-d7" onClick={onSignUp}>Create Account</button>
        <button className="ghost-btn wide auth-btn pop-in pop-d8" onClick={onSignIn}>I already have an account</button>
      </div>
    </div>
  );
}

/* ---------- LEO Reveal: "Learn English Optimally" → LEO ---------- */
function LeoReveal({ onDone }) {
  const [phase, setPhase] = useState(0); // 0=show, 1=merge, 2=leo, 3=done
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1600);
    const t2 = setTimeout(() => setPhase(2), 3200);
    const t3 = setTimeout(() => onDone(), 4400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);
  return (
    <div className="onboard" onClick={() => onDone()}>
      <div className="leo-reveal fade-in">
        {phase < 2 ? (
          <div className={"leo-reveal-words" + (phase >= 1 ? " leo-words-tighten" : "")} key="words">
            <div className="leo-reveal-word">
              <span className={"leo-reveal-key" + (phase >= 1 ? " leo-key-grow" : "")}>L</span>
              <span className={"leo-reveal-rest" + (phase >= 1 ? " leo-rest-hide" : "")}>earn</span>
            </div>
            <div className="leo-reveal-word">
              <span className={"leo-reveal-key" + (phase >= 1 ? " leo-key-grow" : "")}>E</span>
              <span className={"leo-reveal-rest" + (phase >= 1 ? " leo-rest-hide" : "")}>nglish</span>
            </div>
            <div className="leo-reveal-word">
              <span className={"leo-reveal-key" + (phase >= 1 ? " leo-key-grow" : "")}>O</span>
              <span className={"leo-reveal-rest" + (phase >= 1 ? " leo-rest-hide" : "")}>ptimally</span>
            </div>
          </div>
        ) : (
          <div className="leo-reveal-final fade-in" key="final">
            <span className="leo-reveal-name">LEO</span> <p className="leo-reveal-tagline">Your personal English teacher</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SignUpPage({ onBack, onComplete }) {
  const [step, setStep] = useState(1); // 1=account, 2=done
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleCreate = async () => {
    setError("");
    if (!validateEmail(email)) { setError("Please enter a valid email address."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setBusy(true);
    try {
      // Check if account already exists
      const accounts = await loadKey("esl-accounts", []);
      if (accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())) {
        setError("An account with this email already exists. Try signing in instead.");
        setBusy(false);
        return;
      }
      const user = { id: "user_" + Date.now(), email: email.toLowerCase(), password, createdAt: new Date().toISOString(), lastLogin: new Date().toISOString() };
      await saveKey("esl-accounts", [...accounts, user]);
      await saveKey("esl-auth-session", user);
      onComplete(user);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setBusy(false);
  };

  return (
    <div className="onboard">
      <div className="ob-card fade-in">
        <div className="brand-mark-sm"><WhiteboardLogo width={132} /></div>
        <h2 className="ob-question">Create your account</h2>
        <div style={{ textAlign: "left" }}>
          <label className="input-label">Email</label>
          <input className="big-input" type="email" placeholder="your@email.com" value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <label className="input-label">Password</label>
          <input className="big-input" type="password" placeholder="At least 6 characters" value={password}
            onChange={(e) => setPassword(e.target.value)} />
          <label className="input-label">Confirm password</label>
          <input className="big-input" type="password" placeholder="Type your password again" value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); }} />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <div className="ob-nav" style={{ marginTop: 16 }}>
          <button className="ghost-btn" onClick={onBack}>Back</button>
          <button className="primary-btn" onClick={handleCreate} disabled={busy}>
            {busy ? "Creating…" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SignInPage({ onBack, onComplete }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSignIn = async () => {
    setError("");
    if (!email.trim() || !password) { setError("Please enter your email and password."); return; }
    setBusy(true);
    try {
      const accounts = await loadKey("esl-accounts", []);
      const user = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
      if (!user) { setError("Email or password is incorrect. Please try again."); setBusy(false); return; }
      user.lastLogin = new Date().toISOString();
      await saveKey("esl-accounts", accounts.map((a) => a.id === user.id ? user : a));
      await saveKey("esl-auth-session", user);
      onComplete(user);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setBusy(false);
  };

  return (
    <div className="onboard">
      <div className="ob-card fade-in">
        <div className="brand-mark-sm"><WhiteboardLogo width={132} /></div>
        <h2 className="ob-question">Welcome back!</h2>
        <p className="muted small" style={{ textAlign: "center", marginBottom: 14 }}>Sign in to continue learning with Leo.</p>
        <div style={{ textAlign: "left" }}>
          <label className="input-label">Email</label>
          <input className="big-input" type="email" placeholder="your@email.com" value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <label className="input-label">Password</label>
          <input className="big-input" type="password" placeholder="Your password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSignIn(); }} />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <div className="ob-nav" style={{ marginTop: 16 }}>
          <button className="ghost-btn" onClick={onBack}>Back</button>
          <button className="primary-btn" onClick={handleSignIn} disabled={busy}>
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==================== PLACEMENT TEST ====================
   A comprehensive English placement assessment that determines
   the student's CEFR level across grammar, vocabulary, reading,
   pronunciation awareness, and functional English.

   Educational design: Cambridge/IELTS-informed but original content.
   Adaptive: starts at B1, adjusts based on performance.
   Australian contexts throughout.
   Never feels like an exam — Leo encourages throughout.
   ======================================================== */

const PLACEMENT_GRAMMAR = [
  // ── A1 ──
  { level: "A1", area: "present simple", stem: "She ___ to work every morning.", options: ["go", "goes", "going", "gone"], answer: "goes", note: "Third person singular adds -s: she goes." },
  { level: "A1", area: "articles", stem: "I need ___ umbrella. It's raining.", options: ["a", "an", "the", "—"], answer: "an", note: "We use 'an' before vowel sounds: an umbrella." },
  { level: "A1", area: "prepositions", stem: "The supermarket is ___ the corner.", options: ["in", "on", "at", "around"], answer: "around", note: "'Around the corner' means very close by." },
  { level: "A1", area: "pronouns", stem: "That's my flatmate. ___ is from Brazil.", options: ["He", "Him", "His", "Her"], answer: "He", note: "Subject pronoun: He is from Brazil." },
  { level: "A1", area: "plurals", stem: "There are three ___ in my class.", options: ["woman", "womans", "women", "womens"], answer: "women", note: "Irregular plural: woman → women." },
  { level: "A1", area: "be verb", stem: "My parents ___ not here today.", options: ["is", "are", "am", "be"], answer: "are", note: "'Parents' is plural, so we use 'are'." },
  // ── A2 ──
  { level: "A2", area: "past simple", stem: "I ___ to Sydney last weekend.", options: ["go", "went", "gone", "going"], answer: "went", note: "Past simple of 'go' is 'went' — an irregular verb." },
  { level: "A2", area: "present continuous", stem: "She can't come to the phone — she ___ dinner.", options: ["cooks", "cook", "is cooking", "cooked"], answer: "is cooking", note: "Present continuous for actions happening right now." },
  { level: "A2", area: "comparatives", stem: "Melbourne is ___ than Canberra.", options: ["big", "bigger", "biggest", "more big"], answer: "bigger", note: "Short adjectives take -er: big → bigger." },
  { level: "A2", area: "countable", stem: "How ___ milk do we need?", options: ["many", "much", "few", "number"], answer: "much", note: "Milk is uncountable, so we use 'much'." },
  { level: "A2", area: "future", stem: "It's very cloudy. I think it ___ rain.", options: ["will", "is going to", "shall", "does"], answer: "is going to", note: "We use 'going to' for predictions based on present evidence." },
  { level: "A2", area: "adverbs", stem: "She speaks English very ___.", options: ["good", "well", "nice", "fine"], answer: "well", note: "'Well' is the adverb; 'good' is the adjective." },
  { level: "A2", area: "possessives", stem: "Is this ___ Opal card or mine?", options: ["your", "you", "you're", "yours"], answer: "your", note: "'Your' before a noun; 'yours' stands alone." },
  // ── B1 ──
  { level: "B1", area: "present perfect", stem: "I ___ in Australia for six months.", options: ["am", "have been", "was", "have being"], answer: "have been", note: "Present perfect + 'for' for duration up to now." },
  { level: "B1", area: "modals", stem: "You ___ wear a seatbelt. It's the law.", options: ["should", "must", "might", "could"], answer: "must", note: "'Must' for legal obligation — it's not optional." },
  { level: "B1", area: "conditionals 1", stem: "If it ___ tomorrow, we'll go to the beach.", options: ["doesn't rain", "won't rain", "didn't rain", "not rains"], answer: "doesn't rain", note: "First conditional: if + present simple, will + base verb." },
  { level: "B1", area: "passive", stem: "The Sydney Opera House ___ in 1973.", options: ["opened", "was opened", "has opened", "is opened"], answer: "was opened", note: "Past passive: was/were + past participle." },
  { level: "B1", area: "relative clauses", stem: "That's the café ___ we had coffee yesterday.", options: ["where", "which", "what", "who"], answer: "where", note: "'Where' for places in relative clauses." },
  { level: "B1", area: "gerunds", stem: "I don't mind ___ early for work.", options: ["wake up", "waking up", "to wake up", "waked up"], answer: "waking up", note: "After 'don't mind' we use the -ing form." },
  { level: "B1", area: "used to", stem: "I ___ live in a share house, but now I have my own flat.", options: ["use to", "used to", "was used to", "am used to"], answer: "used to", note: "'Used to' for past habits that are no longer true." },
  { level: "B1", area: "quantifiers", stem: "There's ___ point complaining — the office is closed.", options: ["no", "not", "none", "nothing"], answer: "no", note: "'No' + noun: There's no point." },
  // ── B2 ──
  { level: "B2", area: "conditionals 2", stem: "If I ___ more time, I'd travel around Australia.", options: ["have", "had", "would have", "having"], answer: "had", note: "Second conditional: if + past simple, would + base verb." },
  { level: "B2", area: "reported speech", stem: "She told me she ___ the exam the week before.", options: ["passed", "has passed", "had passed", "passes"], answer: "had passed", note: "Reported speech shifts tenses back: passed → had passed." },
  { level: "B2", area: "wish", stem: "I wish I ___ speak better English.", options: ["can", "could", "would", "will"], answer: "could", note: "'Wish + could' for ability we don't have now." },
  { level: "B2", area: "advanced modals", stem: "You ___ have told me earlier — now it's too late.", options: ["should", "must", "might", "would"], answer: "should", note: "'Should have + past participle' for past regret." },
  { level: "B2", area: "causative", stem: "I need to get my visa ___ before it expires.", options: ["renew", "renewed", "renewing", "to renewing"], answer: "renewed", note: "Causative: get + object + past participle." },
  { level: "B2", area: "future perfect", stem: "By next year, I ___ here for two years.", options: ["will live", "will have lived", "am living", "have lived"], answer: "will have lived", note: "Future perfect: will have + past participle, for completed future duration." },
  { level: "B2", area: "participle clauses", stem: "___ in a hurry, she forgot her phone.", options: ["Be", "Been", "Being", "To be"], answer: "Being", note: "Present participle clause: Being in a hurry = Because she was in a hurry." },
  // ── C1 ──
  { level: "C1", area: "inversion", stem: "Not only ___ late, but he also forgot the documents.", options: ["he was", "was he", "he is", "is he"], answer: "was he", note: "After 'Not only' the subject and auxiliary invert." },
  { level: "C1", area: "cleft sentences", stem: "It ___ the traffic that made us late, not the weather.", options: ["is", "was", "has been", "being"], answer: "was", note: "Cleft sentence for emphasis: It was X that..." },
  { level: "C1", area: "mixed conditionals", stem: "If she had studied harder, she ___ a better job now.", options: ["will have", "would have", "had", "would have had"], answer: "would have", note: "Mixed conditional: past condition → present result." },
  { level: "C1", area: "subjunctive", stem: "The university requires that every student ___ health insurance.", options: ["has", "have", "having", "had"], answer: "have", note: "Subjunctive after 'require that': base verb, no -s." },
  { level: "C1", area: "discourse markers", stem: "The rent is expensive. ___, the location is perfect.", options: ["Having said that", "In spite", "Although", "Despite"], answer: "Having said that", note: "'Having said that' introduces a contrasting point after a concession." },
  { level: "C1", area: "advanced passive", stem: "The new policy is believed ___ thousands of students.", options: ["to affect", "affecting", "to be affected", "affect"], answer: "to affect", note: "Impersonal passive: is believed to + base verb." },
];

const PLACEMENT_VOCAB = [
  // ── A1–A2 ──
  { level: "A1", area: "everyday", stem: "I need to ___ the bus to get to work.", options: ["catch", "hold", "grab", "take hold"], answer: "catch", note: "'Catch the bus' is the natural collocation." },
  { level: "A1", area: "everyday", stem: "Can I pay by ___? I don't have any cash.", options: ["card", "money", "coins", "wallet"], answer: "card", note: "'Pay by card' — very common in Australia." },
  { level: "A2", area: "collocation", stem: "I need to ___ an appointment with the GP.", options: ["make", "do", "take", "have"], answer: "make", note: "'Make an appointment' is the standard collocation." },
  { level: "A2", area: "australian", stem: "In Australia, 'arvo' means ___.", options: ["afternoon", "morning", "evening", "weekend"], answer: "afternoon", note: "Classic Australian abbreviation: arvo = afternoon." },
  { level: "A2", area: "phrasal verb", stem: "Can you ___ the form and give it back to me?", options: ["fill in", "fill up", "fill out", "fill over"], answer: "fill in", note: "'Fill in a form' — both 'fill in' and 'fill out' are used in Australia." },
  // ── B1 ──
  { level: "B1", area: "collocation", stem: "The landlord wants to ___ the rent by $50 a week.", options: ["raise", "rise", "lift", "grow"], answer: "raise", note: "'Raise' is transitive (raise something); 'rise' is intransitive." },
  { level: "B1", area: "phrasal verb", stem: "I'm ___ forward to starting my new course.", options: ["looking", "going", "getting", "coming"], answer: "looking", note: "'Look forward to' + -ing: a key B1 expression." },
  { level: "B1", area: "word family", stem: "The job ___ says you need two years of experience.", options: ["advertisement", "advertising", "advertise", "advertised"], answer: "advertisement", note: "Noun form: advertisement (or 'ad' informally)." },
  { level: "B1", area: "context", stem: "The train was ___, so I had to wait twenty minutes.", options: ["delayed", "late", "slow", "postponed"], answer: "delayed", note: "Trains are 'delayed'; meetings are 'postponed'." },
  { level: "B1", area: "register", stem: "Which is more appropriate in a work email: 'Hey mate' or '___'?", options: ["Dear Mr/Ms…", "Yo!", "What's up", "G'day legend"], answer: "Dear Mr/Ms…", note: "Formal register for professional emails." },
  // ── B2 ──
  { level: "B2", area: "collocation", stem: "The company decided to ___ redundancies across all departments.", options: ["make", "do", "give", "put"], answer: "make", note: "'Make redundancies' — a workplace collocation." },
  { level: "B2", area: "idiom", stem: "I was ___ the moon when I got my PR visa.", options: ["over", "above", "past", "across"], answer: "over", note: "'Over the moon' means extremely happy." },
  { level: "B2", area: "formal", stem: "I am writing to ___ about the noise from your construction site.", options: ["complain", "say", "tell", "speak"], answer: "complain", note: "'I am writing to complain' — formal complaint register." },
  { level: "B2", area: "nuance", stem: "She ___ mentioned that she might leave the company.", options: ["casually", "carefully", "easily", "simply"], answer: "casually", note: "'Casually mentioned' implies it wasn't a big deal to her." },
  { level: "B2", area: "academic", stem: "The research ___ suggest that exercise improves mental health.", options: ["findings", "answers", "replies", "solutions"], answer: "findings", note: "'Research findings' is the academic collocation." },
  // ── C1 ──
  { level: "C1", area: "nuance", stem: "His argument, while ___ on the surface, falls apart under scrutiny.", options: ["compelling", "good", "nice", "fine"], answer: "compelling", note: "'Compelling' implies persuasive but worth questioning." },
  { level: "C1", area: "collocation", stem: "The government needs to ___ this issue with urgency.", options: ["address", "answer", "solve", "fix"], answer: "address", note: "'Address an issue' is the formal collocation." },
  { level: "C1", area: "idiom", stem: "We need to stop ___ around the bush and make a decision.", options: ["beating", "running", "walking", "going"], answer: "beating", note: "'Beating around the bush' = avoiding the main point." },
  { level: "C1", area: "academic", stem: "The study ___ a strong correlation between sleep and academic performance.", options: ["revealed", "said", "told", "spoke"], answer: "revealed", note: "'Revealed' for presenting research results — academic register." },
  { level: "C1", area: "formal", stem: "I would be ___ if you could process my application promptly.", options: ["grateful", "happy", "glad", "pleased"], answer: "grateful", note: "'I would be grateful if…' is the most formal request form." },
];

const PLACEMENT_READING_1 = {
  title: "Share House Rules",
  level: "A2-B1",
  passage: "Welcome to 42 Harbour Street! We're happy you're joining our share house. Here are a few things to help everyone get along.\n\nThe kitchen is shared, so please clean up after yourself. Wash your dishes straight away — don't leave them in the sink overnight. Each person has one shelf in the fridge. Please label your food with your name.\n\nThe bins go out every Wednesday night. We take turns — there's a roster on the fridge. If you miss your turn, you do it the following week as well.\n\nQuiet hours are from 10pm to 7am on weeknights, and 11pm to 8am on weekends. If you're having friends over, let the house know in the group chat at least a day before.\n\nThe bond is $800, and rent is $280 per week, due every Friday. We use a shared bank account — the BSB and account number are on the noticeboard.\n\nAny problems? Talk to each other first. We're all adults here.",
  questions: [
    { stem: "What is the main purpose of this text?", options: ["To advertise a room for rent", "To explain the rules of a share house", "To complain about a flatmate", "To describe the neighbourhood"], answer: "To explain the rules of a share house", note: "The whole text sets out how to live together." },
    { stem: "What should you do with your dishes?", options: ["Leave them for the next person", "Wash them immediately after use", "Put them in the dishwasher", "Stack them neatly in the sink"], answer: "Wash them immediately after use", note: "'Wash your dishes straight away' — straight away means immediately." },
    { stem: "What does 'take turns' mean in the context of the bins?", options: ["Everyone does it at the same time", "Each person does it on a different week", "Only one person ever does it", "You can choose when to do it"], answer: "Each person does it on a different week", note: "'Take turns' means each person does it in rotation." },
    { stem: "When are quiet hours on a Saturday night?", options: ["10pm to 7am", "11pm to 8am", "9pm to 6am", "There are no quiet hours"], answer: "11pm to 8am", note: "Weekends have later quiet hours: 11pm to 8am." },
    { stem: "What should you do if you have a problem with a flatmate?", options: ["Call the landlord", "Write a formal complaint", "Talk to them directly", "Move out"], answer: "Talk to them directly", note: "'Talk to each other first' — direct communication." },
  ],
};

const PLACEMENT_READING_2 = {
  title: "Changes to Sydney's Public Transport",
  level: "B1-B2",
  passage: "From next month, Transport for NSW will introduce significant changes to the Opal card system that will affect thousands of daily commuters across Greater Sydney.\n\nThe most notable change is the introduction of a weekly fare cap of $50 for adults. Once a commuter reaches this cap, all additional trips within the same week will be free. This replaces the current system, which offers a discount after eight paid journeys but does not cap the total amount spent.\n\nTransport officials say the change is designed to benefit regular commuters who currently spend over $60 per week. However, casual users who travel fewer than five times a week may not notice any difference.\n\nAnother significant update involves the integration of contactless payment across all modes of transport. From March, commuters will be able to use credit cards, debit cards, and mobile wallets on ferries, which were previously Opal-only. This brings ferries in line with trains, buses, and light rail, all of which already accept contactless payment.\n\nCritics have pointed out that the changes do not address the needs of concession card holders, many of whom are international students on tight budgets. A spokesperson for the International Student Council said that while the weekly cap is welcome, a reduced concession rate would have been more meaningful.\n\nThe changes take effect on the first Monday of next month. Commuters are encouraged to check the Transport for NSW website for details about how the new cap will apply to their specific travel patterns.",
  questions: [
    { stem: "What is the main change to the Opal card system?", options: ["Opal cards will no longer be accepted", "A weekly spending cap of $50 will be introduced", "All public transport will become free", "Fares will increase by $50"], answer: "A weekly spending cap of $50 will be introduced", note: "The cap means you never pay more than $50 per week." },
    { stem: "Who will benefit most from the weekly cap?", options: ["People who rarely use public transport", "Regular commuters who spend over $60 weekly", "International students", "Ferry passengers only"], answer: "Regular commuters who spend over $60 weekly", note: "The text says the change is designed for those spending over $60." },
    { stem: "What does 'brings ferries in line with' mean?", options: ["Makes ferries travel in a straight line", "Makes ferries follow the same system as other transport", "Connects ferry routes to train lines", "Increases ferry frequency"], answer: "Makes ferries follow the same system as other transport", note: "'In line with' means consistent with or matching." },
    { stem: "Why are critics unhappy with the changes?", options: ["The fare cap is too low", "Contactless payment is unreliable", "Concession card holders are not helped enough", "The changes are happening too quickly"], answer: "Concession card holders are not helped enough", note: "Critics say a reduced concession rate would have been more meaningful." },
    { stem: "What can you infer about the author's perspective?", options: ["They strongly support the changes", "They present a balanced view with different opinions", "They believe the changes should be cancelled", "They work for Transport for NSW"], answer: "They present a balanced view with different opinions", note: "The text presents both the benefits and the criticism — balanced reporting." },
    { stem: "The word 'commuters' in paragraph 1 refers to people who ___.", options: ["work for the transport company", "travel regularly between home and work", "visit Sydney as tourists", "live near a train station"], answer: "travel regularly between home and work", note: "A commuter is someone who travels to work regularly." },
  ],
};

const PLACEMENT_PRONUNCIATION = [
  { level: "A2", area: "word stress", stem: "Which word has the stress on the SECOND syllable?", options: ["HOSpital", "imPORtant", "BEAUtiful", "INteresting"], answer: "imPORtant", note: "im-POR-tant — the stress falls on the second syllable." },
  { level: "A2", area: "minimal pairs", stem: "Which pair of words sound DIFFERENT?", options: ["ship / sheep", "right / write", "see / sea", "two / too"], answer: "ship / sheep", note: "'Ship' has /ɪ/ and 'sheep' has /iː/ — different vowel sounds." },
  { level: "B1", area: "silent letters", stem: "Which word has a SILENT letter?", options: ["knife", "jump", "desk", "plan"], answer: "knife", note: "The 'k' in 'knife' is silent — we say /naɪf/." },
  { level: "B1", area: "word stress", stem: "The word 'photograph' is stressed on the ___ syllable, but 'photography' is stressed on the ___.", options: ["first; second", "second; first", "first; third", "third; second"], answer: "first; second", note: "PHOtograph but phoTOGraphy — stress shifts when the suffix changes." },
  { level: "B1", area: "connected speech", stem: "When Australians say 'going to' quickly, it often sounds like ___.", options: ["gonna", "gotta", "wanna", "shoulda"], answer: "gonna", note: "'Gonna' is the reduced form of 'going to' in fast speech." },
  { level: "B1", area: "australian", stem: "In Australian English, the word 'no' often sounds like ___.", options: ["naow", "noo", "nee", "noh"], answer: "naow", note: "Australian English often diphthongises 'no' to sound like 'naow'." },
  { level: "B2", area: "sentence stress", stem: "In the sentence 'I didn't say HE stole the money', the stress on 'HE' suggests ___.", options: ["Someone else stole it", "He didn't steal it", "The money wasn't stolen", "I didn't say anything"], answer: "Someone else stole it", note: "Stressing 'HE' implies the contrast: not him, but someone else." },
  { level: "B2", area: "word stress", stem: "Which word changes its stress pattern depending on whether it is a noun or a verb?", options: ["record", "happen", "travel", "open"], answer: "record", note: "REcord (noun) vs reCORD (verb) — stress shift changes meaning." },
  { level: "B2", area: "connected speech", stem: "The phrase 'would have' in fast speech often sounds like ___.", options: ["would've", "woulda", "would'ave", "All of these"], answer: "All of these", note: "All are common reductions — recognising them helps listening comprehension." },
  { level: "C1", area: "intonation", stem: "A rising intonation at the end of a statement usually signals ___.", options: ["Uncertainty or a question", "Strong agreement", "Anger", "Boredom"], answer: "Uncertainty or a question", note: "Rising intonation on statements often signals checking or uncertainty — very common in Australian English." },
];

const PLACEMENT_FUNCTIONAL = [
  { level: "A2", area: "ordering", stem: "You're at a café. The barista says 'What can I get you?' What's the most natural reply?", options: ["Could I get a flat white, please?", "Give me coffee.", "I am wanting one coffee.", "Coffee. Now."], answer: "Could I get a flat white, please?", note: "'Could I get…' is the standard Australian café order." },
  { level: "A2", area: "transport", stem: "You're at a train station. You need Platform 3. What do you ask?", options: ["Excuse me, which way is Platform 3?", "Where Platform 3?", "Platform 3. You tell me.", "I'm needing the Platform 3."], answer: "Excuse me, which way is Platform 3?", note: "'Excuse me' opens the request; 'which way' is natural for directions." },
  { level: "B1", area: "workplace", stem: "You need to call in sick to work. What do you say to your manager?", options: ["Hi, I'm not feeling well today — I won't be able to make it in.", "I am sick. No work.", "Hey. Sick. Bye.", "I don't want to come today."], answer: "Hi, I'm not feeling well today — I won't be able to make it in.", note: "Professional, warm, and gives the necessary information." },
  { level: "B1", area: "landlord", stem: "Your hot water isn't working. What do you write to your landlord?", options: ["Hi, I wanted to let you know the hot water isn't working. Could someone take a look when possible?", "FIX HOT WATER NOW.", "Hot water broken. Come.", "I'm writing to formally demand immediate repairs to the premises."], answer: "Hi, I wanted to let you know the hot water isn't working. Could someone take a look when possible?", note: "Polite, clear, and appropriately informal for a tenant–landlord relationship." },
  { level: "B1", area: "social", stem: "A neighbour invites you to a barbecue. You can't go. What do you say?", options: ["Thanks so much for the invite! I can't make it this time, but I'd love to come next time.", "No.", "I am not coming to your barbecue.", "Perhaps another time would be more convenient for my schedule."], answer: "Thanks so much for the invite! I can't make it this time, but I'd love to come next time.", note: "Warm, grateful, and keeps the relationship open." },
  { level: "B2", area: "workplace", stem: "In a meeting, you disagree with your colleague's idea. What's the most professional response?", options: ["I see your point, but I think there might be another way to look at this.", "You're wrong.", "That's a terrible idea.", "I disagree with everything you just said."], answer: "I see your point, but I think there might be another way to look at this.", note: "Acknowledges their view before offering an alternative — professional disagreement." },
  { level: "B2", area: "academic", stem: "You need an extension on a university assignment. How do you email your lecturer?", options: ["Dear Professor Chen, I'm writing to request a short extension on the assignment due Friday. I've had some unexpected health issues this week. I'd be grateful for any flexibility.", "Hey, can't do the assignment. Give me more time.", "I need extension.", "I demand you extend the deadline for all students."], answer: "Dear Professor Chen, I'm writing to request a short extension on the assignment due Friday. I've had some unexpected health issues this week. I'd be grateful for any flexibility.", note: "Formal greeting, clear request, brief reason, polite close — perfect academic register." },
  { level: "C1", area: "negotiation", stem: "You're negotiating a salary. The offer is lower than expected. What do you say?", options: ["I really appreciate the offer. Based on my experience and the market rate, I was hoping we could discuss a figure closer to $75,000. Is there any flexibility?", "That's too low. Pay me more.", "I won't accept less than $80,000.", "Whatever you think is fair."], answer: "I really appreciate the offer. Based on my experience and the market rate, I was hoping we could discuss a figure closer to $75,000. Is there any flexibility?", note: "Appreciative, data-informed, specific, and opens negotiation without confrontation." },
];

const CEFR_ORDER = ["A1", "A2", "B1", "B2", "C1"];
const CEFR_RANK = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4 };
/* Area tags are INTERNAL keys, not display strings. Rendered raw a student
   reads "australian" and "landlord" as the names of English skills.
   Only Pronunciation and Functional English render areas rows, so only their
   fourteen tags need entries — seven each, no overlap:
     pronunciation: australian · connected speech · intonation · minimal pairs ·
                    sentence stress · silent letters · word stress
     functional:    academic · landlord · negotiation · ordering · social ·
                    transport · workplace
   AWAITING LESSONS. The contents of this map are student-facing copy and are
   Lessons' to write, not this chat's.
   G-04 (Genesis, 23 July): an UNMAPPED TAG MUST NOT RENDER. The earlier
   fall-through to the raw string was wrong — a blank is the honest outcome,
   a raw tag is not, because "australian" and "landlord" read to a student as
   the names of English skills. Omitting degrades gracefully; the screen keeps
   its band and Leo's line and simply says less.
   This converts an empty map from a ship blocker into missing enrichment. It
   does NOT reduce the priority of the fourteen entries.
   EXTEND when the placement bank extension lands: it adds roughly twenty
   further tags, every one of which will silently omit until mapped. */
const PLACEMENT_AREA_LABELS = {
  // Pronunciation — seven tags, matching PLACEMENT_PRONUNCIATION exactly
  "word stress":      "Stress in a word",
  "sentence stress":  "Stress in a sentence",
  "minimal pairs":    "Similar sounds",
  "silent letters":   "Silent letters",
  "connected speech": "How words join together",
  "australian":       "Australian English sounds",
  "intonation":       "Rise and fall in the voice",
  // Functional English — seven tags, matching PLACEMENT_FUNCTIONAL exactly
  "ordering":         "Ordering food and drinks",
  "transport":        "Travel and transport",
  "workplace":        "At work",
  "landlord":         "Renting and landlords",
  "academic":         "University and study",
  "social":           "Everyday social situations",
  "negotiation":      "Negotiating",
};

/* G-07 (Genesis, 23 July) — an unmapped tag is silent to the STUDENT and loud
   to US. With the map empty, suppression protected the student from reading
   "landlord" as the name of an English skill. Now the map is populated, the
   failure mode inverts: content the student actually earned would disappear
   without trace, and the bank extension adds roughly twenty more tags.
   Deliberately NOT gated behind a build flag or an environment check. A
   console warning is already invisible to a learner, and a gate is exactly the
   thing that gets set wrong once and then hides the problem permanently.
   The Set only stops the message repeating on every re-render; it is not a
   gate, and each distinct tag still warns once per session. */
const _unmappedAreaTags = new Set();
function placementAreaLabel(tag) {
  const label = PLACEMENT_AREA_LABELS[tag];
  if (!label) {
    if (!_unmappedAreaTags.has(tag)) {
      _unmappedAreaTags.add(tag);
      console.warn(
        `[Ask Leo] Placement area tag "${tag}" has no display name. It was OMITTED ` +
        `from the results screen, so the student saw nothing for it. ` +
        `Add it to PLACEMENT_AREA_LABELS.`
      );
    }
    return null;                                // omitted, never raw
  }
  return label;
}
function placementAreaList(tags) {
  return (tags || []).map(placementAreaLabel).filter(Boolean);
}

const CEFR_LABELS = { A1: "Beginner", A2: "Elementary", B1: "Intermediate", B2: "Upper-Intermediate", C1: "Advanced" };

/* ── Adaptive engine ──
   Starts at B1. On correct → try one level harder. On incorrect → try one level easier.
   Picks from unused questions at the target level. Stops when confidence is sufficient
   (6+ questions answered at the estimated level) or questions run out.
   Returns { level, correct, total, byLevel } */
function adaptiveSelect(bank, answered, currentLevel) {
  const rank = CEFR_RANK[currentLevel] ?? 2;
  // Try current level first, then adjacent levels
  for (const offset of [0, -1, 1, -2, 2]) {
    const targetRank = Math.max(0, Math.min(4, rank + offset));
    const targetLevel = CEFR_ORDER[targetRank];
    const available = bank.filter((q) => q.level === targetLevel && !answered.has(q));
    if (available.length > 0) return available[Math.floor(Math.random() * available.length)];
  }
  return null; // exhausted
}

function estimateLevel(history) {
  // Count correct answers per level, find highest level with ≥60% accuracy
  const byLevel = {};
  CEFR_ORDER.forEach((l) => { byLevel[l] = { correct: 0, total: 0 }; });
  history.forEach(({ level, ok }) => { byLevel[level].total++; if (ok) byLevel[level].correct++; });
  let estimated = "A1";
  for (const level of CEFR_ORDER) {
    const { correct, total } = byLevel[level];
    if (total >= 2 && correct / total >= 0.6) estimated = level;
    else if (total >= 3 && correct / total < 0.4) break; // struggling, stop climbing
  }
  return { level: estimated, byLevel };
}

/* ── Placement sections ── */
const PLACEMENT_SECTIONS = [
  { id: "welcome", label: "About You", emoji: "👋" },
  { id: "grammar", label: "Grammar", emoji: "🧩" },
  { id: "vocabulary", label: "Vocabulary", emoji: "📚" },
  { id: "reading", label: "Reading", emoji: "📖" },
  { id: "pronunciation", label: "Pronunciation", emoji: "🔊" },
  { id: "functional", label: "Real-life English", emoji: "🇦🇺" },
  { id: "results", label: "Your Results", emoji: "🎉" },
];

/* ── PlacementTestPage ── */
function PlacementTestPage({ profile, onComplete }) {
  const [section, setSection] = useState(1);
  const [grammarHistory, setGrammarHistory] = useState([]);
  const [grammarAnswered, setGrammarAnswered] = useState(new Set());
  const [grammarLevel, setGrammarLevel] = useState("B1");
  const [grammarQ, setGrammarQ] = useState(null);
  const [grammarChosen, setGrammarChosen] = useState(null);
  const [grammarCount, setGrammarCount] = useState(0);
  const [vocabHistory, setVocabHistory] = useState([]);
  const [vocabAnswered, setVocabAnswered] = useState(new Set());
  const [vocabLevel, setVocabLevel] = useState("B1");
  const [vocabQ, setVocabQ] = useState(null);
  const [vocabChosen, setVocabChosen] = useState(null);
  const [vocabCount, setVocabCount] = useState(0);
  const [readingPhase, setReadingPhase] = useState(0); // 0=passage1, 1=q1, 2=passage2, 3=q2
  const [readingScore, setReadingScore] = useState({ correct: 0, total: 0 });
  const [pronHistory, setPronHistory] = useState([]);
  const [pronAnswered, setPronAnswered] = useState(new Set());
  const [pronQ, setPronQ] = useState(null);
  const [pronChosen, setPronChosen] = useState(null);
  const [pronCount, setPronCount] = useState(0);
  const [funcHistory, setFuncHistory] = useState([]);
  const [funcAnswered, setFuncAnswered] = useState(new Set());
  const [funcQ, setFuncQ] = useState(null);
  const [funcChosen, setFuncChosen] = useState(null);
  const [funcCount, setFuncCount] = useState(0);
  const [results, setResults] = useState(null);

  // ── Start adaptive sections ──
  useEffect(() => {
    if (section === 1 && !grammarQ) setGrammarQ(adaptiveSelect(PLACEMENT_GRAMMAR, grammarAnswered, grammarLevel));
    if (section === 2 && !vocabQ) setVocabQ(adaptiveSelect(PLACEMENT_VOCAB, vocabAnswered, vocabLevel));
    if (section === 4 && !pronQ) setPronQ(adaptiveSelect(PLACEMENT_PRONUNCIATION, pronAnswered, "B1"));
    if (section === 5 && !funcQ) setFuncQ(adaptiveSelect(PLACEMENT_FUNCTIONAL, funcAnswered, "B1"));
  }, [section]);

  const nextSection = () => setSection((s) => s + 1);

  // ── Adaptive answer handler (reusable) ──
  const handleAdaptive = (q, chosen, bank, history, setHistory, answered, setAnswered, level, setLevel, setQ, setChosen, count, setCount, maxQ, onDone) => {
    const ok = chosen === q.answer;
    const newHistory = [...history, { level: q.level, area: q.area, ok }];
    setHistory(newHistory);
    const newAnswered = new Set(answered); newAnswered.add(q);
    setAnswered(newAnswered);
    setChosen(chosen);
    const newCount = count + 1;
    setCount(newCount);
    // Adjust level
    const rank = CEFR_RANK[level] ?? 2;
    const newRank = ok ? Math.min(4, rank + 1) : Math.max(0, rank - 1);
    const newLevel = CEFR_ORDER[newRank];
    setTimeout(() => {
      setLevel(newLevel);
      setChosen(null);
      if (newCount >= maxQ) { onDone(newHistory); return; }
      const next = adaptiveSelect(bank, newAnswered, newLevel);
      if (!next) { onDone(newHistory); return; }
      setQ(next);
    }, 1400);
  };

  // ── Compute results ──
  /* R3 (Genesis, settled 22 July): a section that cannot resolve a CEFR band
     does not contribute one.
     Only Grammar and Vocabulary run a ladder that actually moves. Reading maps
     a percentage onto a hard ceiling of "B2". Pronunciation and Functional
     English are pinned at "B1" with a no-op setLevel, so estimateLevel can
     return only A1 or B1 for them however well the student does.
     Averaging all five made C1 unreachable by ANY student under ANY
     performance: a flawless run scored C1, C1, B2, B1, B1 -> 3.0 -> B2. The
     damage sat entirely at the top, which is why mid and low students came out
     right by coincidence and it never surfaced in testing.
     The three pinned sections now report what was OBSERVED instead of a band
     they cannot support. Their ladders are deliberately still not wired and
     maxQ is deliberately unchanged: neither bank holds an A1 item, so a
     working ladder would descend into an empty band. Both wait for the bank
     extension from Lessons. */

  // Which areas did the student handle, and which were harder? Derived from
  // their own answers — every adaptive item carries an `area` tag.
  const observedAreas = (history) => {
    const tally = new Map();
    (history || []).forEach((h) => {
      if (!h.area) return;
      const e = tally.get(h.area) || { ok: 0, total: 0 };
      e.total += 1; if (h.ok) e.ok += 1;
      tally.set(h.area, e);
    });
    const handled = [], harder = [];
    tally.forEach((e, area) => { (e.ok === e.total ? handled : harder).push(area); });
    return { handled, harder, seen: tally.size };
  };

  const computeResults = () => {
    const grammar = estimateLevel(grammarHistory);
    const vocab = estimateLevel(vocabHistory);
    // Banded sections only. Two, not five.
    const banded = [grammar.level, vocab.level];
    const avgRank = banded.reduce((sum, l) => sum + CEFR_RANK[l], 0) / banded.length;
    const overallLevel = CEFR_ORDER[Math.round(avgRank)];
    const overallRank = CEFR_RANK[overallLevel];

    /* Reading records no per-item detail and its questions carry no `area`
       tag, so it reports the one thing that IS observed: how much of it the
       student got right. Not a band, and not dressed as one. */
    const areas = [
      { name: "Grammar", kind: "band", level: grammar.level, rank: CEFR_RANK[grammar.level] },
      { name: "Vocabulary", kind: "band", level: vocab.level, rank: CEFR_RANK[vocab.level] },
      { name: "Reading", kind: "count", correct: readingScore.correct, total: readingScore.total },
      { name: "Pronunciation", kind: "areas", ...observedAreas(pronHistory) },
      { name: "Functional English", kind: "areas", ...observedAreas(funcHistory) },
    ];

    /* Only a banded section may be called a strength or an area to improve.
       Ranking a pinned section against the overall rank compares it with a
       number it could never have influenced. */
    const strengths = [], improvements = [];
    areas.forEach((a) => {
      if (a.kind !== "band") return;
      (a.rank >= overallRank ? strengths : improvements).push(a.name);
    });

    return {
      overall: overallLevel,
      grammar: grammar.level, vocab: vocab.level,
      reading: { correct: readingScore.correct, total: readingScore.total },
      pronunciation: observedAreas(pronHistory),
      functional: observedAreas(funcHistory),
      strengths, improvements, areas,
      grammarDetail: grammar.byLevel, vocabDetail: vocab.byLevel,
      /* totalCorrect is DELETED, not left unrendered. It summed correct answers
         across banded, counted and PINNED sections — the same blend, in one
         integer, that made C1 unreachable. A field that may never be read must
         not exist: leaving it here relies on every future reader knowing why.
         totalQuestions is RETAINED by Genesis ruling (23 July), superseding the
         specification's deletion of the pair. Its reader is named: Leo's line
         above the band on the results screen. It counts questions ANSWERED, not
         presented — a count of effort, not of performance. */
      totalQuestions: grammarHistory.length + vocabHistory.length + readingScore.total + pronHistory.length + funcHistory.length,
    };
  };

  const progress = section / (PLACEMENT_SECTIONS.length - 1);

  // ── MCQ renderer for adaptive sections ──
  const AdaptiveQuiz = ({ q, chosen, onPick, count, maxQ, label }) => {
    if (!q) return <LeoLoader label="I'm putting your questions together…" />;
    const opts = React.useMemo(() => shuffleOptions(q.options, textSeed(q.stem)), [q]);
    return (
      <div>
        <div className="quiz-progress"><span style={{ width: `${(count / maxQ) * 100}%` }} /></div>

        <p className="q-sentence">{q.stem}</p>
        <div className="mcq-opts">
          {opts.map((opt, i) => (
            <button key={i} disabled={!!chosen} onClick={() => onPick(opt)}
              className={"mcq-opt" + (chosen ? (opt === q.answer ? " mcq-right" : opt === chosen ? " mcq-wrong" : "") : "")}>{opt}</button>
          ))}
        </div>
        {chosen && <div className="feedback"><LeoFeedback ok={chosen === q.answer}>{q.note}</LeoFeedback></div>}
      </div>
    );
  };

  return (
    <div>
      {/* Progress bar */}
      <div className="placement-progress">
        <div className="placement-progress-bar"><span style={{ width: `${progress * 100}%` }} /></div>

      </div>

      {/* ── GRAMMAR ── */}
      {section === 1 && (
        <Card>
          
          <AdaptiveQuiz q={grammarQ} chosen={grammarChosen} count={grammarCount} maxQ={10}
            onPick={(opt) => handleAdaptive(grammarQ, opt, PLACEMENT_GRAMMAR, grammarHistory, setGrammarHistory, grammarAnswered, setGrammarAnswered, grammarLevel, setGrammarLevel, setGrammarQ, setGrammarChosen, grammarCount, setGrammarCount, 10, () => nextSection())} />
        </Card>
      )}

      {/* ── VOCABULARY ── */}
      {section === 2 && (
        <Card>
          
          <AdaptiveQuiz q={vocabQ} chosen={vocabChosen} count={vocabCount} maxQ={6}
            onPick={(opt) => handleAdaptive(vocabQ, opt, PLACEMENT_VOCAB, vocabHistory, setVocabHistory, vocabAnswered, setVocabAnswered, vocabLevel, setVocabLevel, setVocabQ, setVocabChosen, vocabCount, setVocabCount, 6, () => nextSection())} />
        </Card>
      )}

      {/* ── READING ── */}
      {section === 3 && (
        <Card>
          
          {readingPhase === 0 && (
            <div>
              <p className="muted small">Read the text, then answer the questions.</p>
              <h4 className="diary-label">{PLACEMENT_READING_2.title}</h4>
              <p className="passage">{PLACEMENT_READING_2.passage}</p>
              <button className="primary-btn" onClick={() => setReadingPhase(1)}>I've read it — show me the questions</button>
            </div>
          )}
          {readingPhase === 1 && (
            <McqQuiz questions={PLACEMENT_READING_2.questions} vocab={[]} onVocabTap={() => {}}
              onDone={(c, t) => { setReadingScore({ correct: c, total: t }); nextSection(); }} />
          )}
        </Card>
      )}

      {/* ── PRONUNCIATION ── */}
      {section === 4 && (
        <Card>
          
          <AdaptiveQuiz q={pronQ} chosen={pronChosen} count={pronCount} maxQ={5}
            onPick={(opt) => handleAdaptive(pronQ, opt, PLACEMENT_PRONUNCIATION, pronHistory, setPronHistory, pronAnswered, setPronAnswered, "B1", () => {}, setPronQ, setPronChosen, pronCount, setPronCount, 5, () => nextSection())} />
        </Card>
      )}

      {/* ── FUNCTIONAL ENGLISH ── */}
      {section === 5 && (
        <Card>
          
          <AdaptiveQuiz q={funcQ} chosen={funcChosen} count={funcCount} maxQ={5}
            onPick={(opt) => handleAdaptive(funcQ, opt, PLACEMENT_FUNCTIONAL, funcHistory, setFuncHistory, funcAnswered, setFuncAnswered, "B1", () => {}, setFuncQ, setFuncChosen, funcCount, setFuncCount, 5, () => {
              const r = computeResults();
              setResults(r);
              nextSection();
            })} />
        </Card>
      )}

      {/* ── RESULTS ── */}
      {section === 6 && results && (
        <div>
          <Card className="leo-card">
            <div className="leo-accent">
              {/* TWO Leo lines, not three. The deleted middle line restated the
                  numeral directly above it and pre-empted the closing line.
                  Structure is now observation -> evidence -> forward step, with
                  the evidence between the lines rather than a line standing in
                  for it.
                  Sub-five guard: below five questions the number is dropped
                  entirely rather than reported small. */}
              <p className="text-leo" style={{ marginBottom: "var(--space-3)" }}>
                {results.totalQuestions >= 5
                  ? `${results.totalQuestions} questions, ${profile.name} — and you answered every one. Here's where I'd start you today.`
                  : `You've got through it, ${profile.name}. Here's where I'd start you today.`}
              </p>
              <div className="placement-overall">
                <span className="placement-overall-level">{results.overall}</span>
                <span className="placement-overall-desc">{CEFR_LABELS[results.overall]}</span>
              </div>
            </div>
          </Card>

          {/* The breakdown iterates `areas` and switches on `kind`. It does NOT
              name sections in markup and does NOT hardcode five rows: the two
              pinned sections may start producing bands if their ladders are ever
              wired, and a screen keyed to `kind` needs no redesign when they do.
              Rows are text. Any bar drawn to a shared scale would be a combined
              total expressed in geometry — the prohibited thing, in a costume.
              A section holding no observation is OMITTED, never rendered empty:
              an empty row asserts a measurement happened and returned nothing. */}
          <Card style={{ marginTop: "var(--space-4)" }}>
            <div className="pl-breakdown">
              {results.areas.map((a) => a.kind === "areas"
                  ? { ...a, handled: placementAreaList(a.handled), harder: placementAreaList(a.harder) }
                  : a
              ).filter((a) =>
                a.kind === "band" ? !!a.level
                : a.kind === "count" ? a.total > 0
                /* G-04: a section whose every tag is unmapped has nothing it can
                   honestly say, so the whole row goes rather than rendering an
                   empty label. Observed-but-unnameable is not the same as
                   observed, and neither is it worth an empty line. */
                : (a.handled.length + a.harder.length) > 0
              ).map((a, i) => (
                <div key={i} className="pl-row">
                  <span className="text-supporting pl-row-name">{a.name}</span>
                  <span className="pl-row-evidence">
                    {a.kind === "band" && (
                      <span className="text-body">{a.level} <span className="text-supporting">{CEFR_LABELS[a.level]}</span></span>
                    )}
                    {a.kind === "count" && (
                      <span className="text-body">{a.correct} of {a.total}</span>
                    )}
                    {a.kind === "areas" && (
                      <span className="pl-areas">
                        {a.handled.length > 0 && (
                          <span className="pl-area-line">
                            <span className="text-supporting pl-area-key">Areas handled</span>
                            <span className="text-body">{a.handled.join(", ")}</span>
                          </span>
                        )}
                        {a.harder.length > 0 && (
                          <span className="pl-area-line">
                            <span className="text-supporting pl-area-key">Areas found harder</span>
                            <span className="text-body">{a.harder.join(", ")}</span>
                          </span>
                        )}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <div className="leo-accent" style={{ marginTop: "var(--space-5)" }}>
            <p className="text-leo">A short test only tells me where to begin — the rest I learn by teaching you. Let's start your first lesson.</p>
          </div>

          <button className="primary-btn wide" style={{ marginTop: "var(--space-4)" }} onClick={() => { if (onComplete) onComplete(results); }}>Continue</button>
        </div>
      )}
    </div>
  );
}


function _mockFindPack(text) {
  const low = (text || "").toLowerCase();
  if (!low) return null;
  return MOCK_PACKS.find((pk) => pk.match.test(low)) || null;
}
// When Leo chooses (no context requested), cycle through packs using a
// rotating index so each lesson gets a DIFFERENT scenario. Uses a simple
// counter stored on the function itself (resets on page reload, which is fine).
function _mockNextPack(prompt) {
  // If the prompt contains a last-lesson scenario, avoid repeating it
  const lastCtx = (prompt.match(/last lesson was "([^"]+)"/) || [])[1] || "";
  if (_mockNextPack._idx === undefined) _mockNextPack._idx = Math.floor(Math.random() * MOCK_PACKS.length);
  _mockNextPack._idx = (_mockNextPack._idx + 1) % MOCK_PACKS.length;
  let pack = MOCK_PACKS[_mockNextPack._idx];
  // Skip if it matches the last lesson scenario
  if (lastCtx && pack.ctx.toLowerCase() === lastCtx.toLowerCase()) {
    _mockNextPack._idx = (_mockNextPack._idx + 1) % MOCK_PACKS.length;
    pack = MOCK_PACKS[_mockNextPack._idx];
  }
  return pack;
}

// Warm-up selection: prefer formats the student did NOT meet last lesson, then
// restore the authored order so the discussion opener still comes first.
function _mockWarmUp(pack, avoidCsv) {
  const all = pack.warmUp || [];
  if (!all.length) return [];
  const avoid = (avoidCsv || "").toLowerCase();
  const fresh = all.filter((a) => !avoid.includes(a.type));
  const stale = all.filter((a) => avoid.includes(a.type));
  const chosen = [...fresh, ...stale].slice(0, 3);
  return all.filter((a) => chosen.includes(a));
}

/* G-05(a) — ONE definition, two readers.
   Arrival at the end of a lesson is the same observable fact whether the
   summary was generated first time or regenerated after a QA failure, so it
   gets the same words, because the student cannot see which path produced
   them. Two objects meant Leo said different things depending on whether a QA
   regeneration happened behind the scenes — that is Continuity Integrity, not
   a copy defect, and it had already caused the retry branch to keep
   pre-correction wording through two separate honesty passes.
   ONE CONSTANT, WHOLE. Deliberately not a constant per field: under a shared
   object, a separate praise constant would be a second source of truth for one
   field, which is the same fault one level down. An earlier pass made exactly
   that mistake and it is corrected here.
   READERS, named: the "closing summary" branch, and the "Regenerate this
   exercise" summary-retry branch, both in mockAskClaude.

   CONTEXT RECONCILED. The two branches read the lesson context from different
   prompts and therefore different patterns — the first-pass prompt writes
   "Context: …", the regeneration prompt writes 'Today's lesson: "…"'. A shared
   object must not receive two different context strings, so all three patterns
   are tried here in one place and the fallback is shared. */
function _closingContext(p) {
  return _mockPick(p, /\nContext: ([^\n]+)/)
    || _mockPick(p, /context "([^"]+)"/)
    || _mockPick(p, /Today's lesson: "([^"]+)"/)
    || "today's situation";
}

function _closingSummary(p) {
  const ctx = _closingContext(p);
  return {
    /* Arrival is the ONE performance fact this mock genuinely holds — the
       summary only renders at the end. Earlier versions fabricated four things
       it cannot see: that speaking happened (it is skippable), that full
       sentences were produced, that this built on a previous lesson (false on
       day one), and — introduced BY the first honesty rewrite, one clause over
       — that the student traversed the lesson, across 24 skip points where only
       arrival is observable. */
    praise: "You got to the end of today's lesson — that's a decision, not luck. Now make it count: before tonight, say one thing from today out loud.",
    /* Describes the LESSON, not the student. "Today you worked on…" claims the
       student did the working; "Today's lesson was about…" claims only what the
       lesson contained. "A real conversation" describes what the language is
       for, not a quality of anything the student produced. */
    summary: `Today's lesson was about ${ctx.toLowerCase()} — the words and phrases you need, and how they fit together in a real conversation.`,
    strength: "You stayed with it to the end. Persistence is the one strength that guarantees all the others grow.",
    improvement: "A habit worth building: before any request, add a softener — 'could' or 'would you mind'. It instantly makes English sound more polite and more Australian.",
    connection: "What you practised today isn't app English — it's the exact language this situation needs out there in real life.",
    tomorrowPreview: "Tomorrow we'll build on this — same teacher, next step. See you then.",
  };
}

/* G-05(b) — ONE definition, two readers.
   These two payloads were byte-identical duplicates: the diary_feedback intent
   handler, and the text-match fallback branch that serves the same request when
   no intent tag is present. Replacing the copy in one and not the other is the
   failure mode Item 4 already demonstrated, so the extraction lands BEFORE any
   new copy does. When Lessons delivers, it is one edit here.
   READERS, named: _MOCK_INTENT_HANDLERS.diary_feedback, and the
   "diary entry" text-match branch in mockAskClaude.
   `praise` claimed the entry was clear and its vocabulary natural — neither
   readable by a mock that never sees the entry. Replaced 23 July under G-05(b)
   with a line that claims only what is observable (an entry was submitted) and
   points forward. The extraction landed first, deliberately, so this became a
   single edit rather than two that could diverge. */
const MOCK_DIARY_FEEDBACK = {
  praise: "You sat down and wrote in English today — that's the hardest part of keeping a diary. Do it again tomorrow, even if it's only two lines.",
  reformulation: "A slightly more natural version of your entry would appear here, keeping your meaning and your first-person voice.",
  errorTypes: (typeof ERROR_TYPES !== "undefined" && ERROR_TYPES.length ? [ERROR_TYPES[0]] : []),
  tip: "Read your entry aloud once — it's a great way to catch small slips.",
};

/* ITEM 4 (Lessons v2.1, 23 July) — honest mock speaking replies.
   The previous mock rotated three fixed praise lines, so a five-character
   nonsense word was told it was a great start and clearly expressed. A
   fabricated evaluation from Leo is a trust defect, not a style issue.
   v2.1 also removed v2's own replacements — "short and CLEAR" and "a full
   SENTENCE" — because neither comprehensibility nor sentence-hood is knowable
   from a length check. What follows claims ONLY word count and turn number,
   both directly measurable. All warmth is carried by the task, which is
   honest whatever the student typed.
   Defined once and called from BOTH call sites (the speaking_reply intent
   handler and the text-match branch) so the two cannot drift apart. */
const SPEAKING_TIER1 = "I didn't quite catch that one — no stress. Give me one short sentence: what would you say first in this situation?";
const SPEAKING_TIER2 = "A short one — let's stretch it. Say it again for me as one complete sentence, start to finish.";
const SPEAKING_TIER3 = [
  "A longer answer this time. Here's your next turn: imagine they ask you a follow-up question — what would you say?",
  "Another turn — that's how speaking practice works, one turn at a time. Try this: say your last answer again, but more politely.",
  "You've taken several turns today — and turns are the unit speaking grows in. Let's carry that into the next part of the lesson.",
];
function _mockSpeakingReply(p) {
  const said = (_mockPick(p, /The student just said: "([^"]*)"/) || "").trim();
  const turn = (p.match(/Teacher: /g) || []).length;
  // Tier 1 — nothing recognisable arrived. No praise, and no pretence of one.
  if (!said || said.length <= 2 || !/[aeiou]/i.test(said) || /^(.)\1*$/.test(said)) return SPEAKING_TIER1;
  // Tier 2 — 1 to 3 words. Length only; the task does the teaching.
  if (said.split(/\s+/).length <= 3) return SPEAKING_TIER2;
  // Tier 3 — longer, keyed by turn. "Another turn", "several turns" are counts.
  return SPEAKING_TIER3[Math.min(turn, SPEAKING_TIER3.length - 1)];
}

/* Intent handler table: one entry per call-site intent. Each handler receives
   (prompt, J) where J = JSON.stringify, and returns the mock response. Handlers
   reuse the same helper functions (_mockPick, _mockFindPack, etc.) as the
   text-matching branches — they ARE the same logic, keyed by contract instead
   of by fragile substring matching. */
const _MOCK_INTENT_HANDLERS = {
  /* Three length-keyed paths: 1-2 chars skip, 3-15 minimal, 16+ attempt.
     Minimal and attempt read the current pack's strings; when those are absent
     (Lessons has not delivered them yet) they fall through to the hardcoded
     failure line, so this ships without touching MOCK_PACKS. */
  warmup_free_response: (p, J) => {
    const answer = (_mockPick(p, /Student's answer: "([^"]*)"/) || "").trim();
    /* Match on the LESSON'S CONTEXT, never the whole prompt. The prompt's own
       fixed wording contains the word "student" twice — in "Student's answer:"
       and in "one short sentence to the student" — which is a trigger for the
       pack whose ctx is "Talking to your teacher". Array.find returns the
       first match, so that pack became a permanent floor and every pack
       defined after it was unreachable: a beach lesson answered the student in
       the teacher pack's voice, and the student's own words steered the match.
       Measured 8/11 before, 11/11 after (owner-verified, 22 July).
       This also brings the last call site into line with the other four, which
       all extract a named field before matching. _mockPick returns "" when the
       context is absent and _mockFindPack("") returns null, so the fallback
       below applies — the intended behaviour on that path, currently unreached. */
    const pack = _mockFindPack(_mockPick(p, /Context: "([^"]*)"/));
    const n = answer.length;
    if (n <= 2) return J({ category: "skip", line: WARMUP_SKIP_LINE });
    if (n <= 15) return J({ category: "minimal", line: (pack && pack.warmupMinimalResponse) || WARMUP_FALLBACK_LINE });
    return J({ category: "attempt", line: (pack && pack.warmupAttemptResponse) || WARMUP_FALLBACK_LINE });
  },
  chat_reply: (p, J) => {
    const q = _mockPick(p, /The student now says: "([^"]*)"/);
    // Refusal branch (spec A6): without this the doorway is unreachable while
    // USE_MOCK_AI is true, so its absence in testing would mean nothing.
    if (/medicare|visa|tax|centrelink|doctor|rent|lease|superannuation|police|licence|license/i.test(q || "")) {
      return `${OFF_TOPIC_MARK} That one isn't English practice, so it's not something I can help with here. Ask me an English question instead — for example, "What's the difference between 'make' and 'do'?"`;
    }
    return `That's a good question about "${q || "English"}". Here's a simple way to think about it, with a short example you can copy and adapt. Try writing one sentence yourself and I'll help you improve it.`;
  },
  diary_resources: (p, J) => J({ resources: [
    { title: "Grammar reference", site: "British Council", url: "https://learnenglish.britishcouncil.org/grammar", why: "Clear explanations for the grammar from today's class." },
    { title: "6 Minute English", site: "BBC Learning English", url: "https://www.bbc.co.uk/learningenglish", why: "Short listening practice on everyday topics." },
    { title: "Cambridge Dictionary", site: "Cambridge", url: "https://dictionary.cambridge.org", why: "Check new words, meanings and pronunciation." },
  ] }),
  diary_feedback: (p, J) => J(MOCK_DIARY_FEEDBACK),
  student_analysis: (p) => `This student has been learning with me for a while now. They are making genuine progress — their confidence in everyday situations is growing, and I can see improvement in their willingness to attempt full sentences rather than single words. Their vocabulary is expanding, though some words are still fragile and need more encounters before they stick. Grammar-wise, polite request forms are getting stronger but they still default to direct forms under pressure. Their recent diary entries show they are engaging with English outside class, which is encouraging. They completed a mission recently, and I should ask how it went — that follow-up matters for building trust. Emotionally, they seem motivated but still anxious about speaking to strangers. Today I want to build on that growing confidence.`,
  needs_assessment: (p) => {
    const ctx = _mockPick(p, /asked to work on: "([^"]*)"/);
    const pack = _mockFindPack(ctx) || _mockNextPack(p);
    return `This student needs to practise ${pack.ctx.toLowerCase()}. This is the right lesson for today because it is a situation they will genuinely encounter in Australian life, and it builds naturally on what we have been working on. I predict they will struggle with polite request forms — they will probably say "I want" instead of "Could I get" or "I would like." They may also freeze when asked a follow-up question they did not expect. The essential vocabulary is: ${pack.vocab.join(", ")}. I would deliberately leave out more advanced terms that would overload them. The grammar that arises naturally is ${pack.grammar.point} — ${pack.grammar.meaning}. For authentic material, I would use this: ${pack.dialogue.replace(/\n/g, " ")}. The one memorable moment: Australians say "no worries" constantly — it means "you are welcome" and hearing it will make them feel like they belong. By the end, they should feel capable and proud. The final moment of success: they will role-play the complete ${pack.ctx.toLowerCase()} interaction and handle it confidently.`;
  },
  educational_review: () => `1. Would I enjoy teaching this lesson? YES — it has a clear communicative purpose and authentic material.\n2. Does every vocabulary item support the objective? YES — each word is genuinely needed for this situation.\n3. Does the grammar arise naturally? YES — it comes directly from the communicative situation.\n4. Is the authentic material believable? YES — a student could encounter this in real life.\n5. Does everything build toward the final task? YES — vocabulary, grammar and speaking all prepare for the role-play.\n6. Is it memorable? YES — the Australian expression will stick.\n7. Would the student leave more confident? YES — they will have successfully completed a real interaction.\n8. Is there anything I would change? I would make sure the warm-up questions are specific enough to activate the exact vocabulary they will need.`,
  dictionary: (p, J) => {
    const w = _mockPick(p, /Word or phrase: "([^"]*)"/) || "word";
    return J({ word: w, ipa: "/ˈsɑːm.pəl/", pos: "noun", cefr: "B1", definition: `A clear, simple meaning of "${w}" goes here, in plain English.`, example: `Here is a natural example sentence using "${w}".`, collocations: [`a ${w}`, `${w} of`, `the main ${w}`], translation: `(${w})` });
  },
  thesaurus: (p, J) => {
    const w = _mockPick(p, /Word: "([^"]*)"/) || "word";
    return J({ word: w, synonyms: ["a close synonym", "a more casual alternative", "a more formal alternative"], antonyms: ["the opposite meaning"], phrases: [`in terms of ${w}`, `all about ${w}`], examples: [`A short example sentence with "${w}".`] });
  },
  heard_explain: (p, J) => {
    const ph = _mockPick(p, /real life: "([^"]*)"/) || "phrase";
    return J({ meaning: `Here's what "${ph}" means in plain English — you'll often hear this in everyday Australian conversation.`, ipa: "", pos: "phrase", example: `Someone might say: "${ph}" at the shops.`, collocations: [], formality: "casual", translation: `(${ph})` });
  },
  australia_ask: (p) => {
    const q = _mockPick(p, /Question: "([^"]*)"/);
    return `Good question about "${q || "living in Australia"}". For anything official, check the relevant body such as Service NSW, the ATO, or Home Affairs. In everyday life here, a good first step is to ask politely and keep it simple.`;
  },
  pronunciation: (p, J) => {
    const w = _mockPick(p, /Word: "([^"]*)"/) || "word";
    return J({ word: w, ipa: `/ˈ${w.toLowerCase()}/`, syllables: w.replace(/(.{3})(?=.)/g, "$1·"), stress: "the first syllable", tips: ["Say it slowly, one part at a time.", "Put the stress on the first syllable.", "Keep the vowels relaxed."], l1Note: "" });
  },
  vocab_review: (p, J) => {
    const terms = []; const re = /"([^"]+)" \(from/g; let m;
    while ((m = re.exec(p)) && terms.length < 3) terms.push(m[1]);
    if (!terms.length) terms.push("word");
    const distractorPhrasings = ["doesn't quite work here", "isn't the right fit for this sentence", "would confuse the meaning"];
    return J({ questions: terms.map((t) => ({ word: t, stem: `Which sentence uses "${t}" correctly?`, options: [`This is a natural, correct use of "${t}".`, ...distractorPhrasings.map((d) => `This use of "${t}" ${d}.`)], answer: `This is a natural, correct use of "${t}".`, note: `Well done — that's a natural way to use "${t}".` })) });
  },
  speaking_reply: (p) => _mockSpeakingReply(p),
  vocab_card: (p) => {
    const word = _mockPick(p, /tapped on the word "([^"]+)"/);
    const scen = _mockPick(p, /lesson about "([^"]+)"/);
    return JSON.stringify({ ipa: "/\u02c8w\u025cd/", pos: "noun", cefr: "B1", definition: `A friendly, clear explanation of "${word}" in simple English, as a teacher would give.`, lessonExample: `A natural example of "${word}" in the context of "${scen}".`, examples: [`An everyday Australian sentence using "${word}".`, `Another natural example you might hear or say.`], related: ["a related word", "another related term", "one more"] });
  },
};

async function mockAskClaude(prompt, opts) {
  await new Promise((r) => setTimeout(r, 450 + Math.random() * 500)); // realistic latency so loading states show
  const J = (o) => JSON.stringify(o);
  const p = prompt;

  /* Intent dispatch: if the caller declared its intent, dispatch directly.
     This is the contract that survives prompt rewrites — the root cause of
     the last outage was a rewritten prompt that silently unhooked its mock
     branch. With intents, a prompt change can never break dispatch. The
     text-matching branches below remain as a fallback for any untagged
     call site, but every new call SHOULD use an intent tag. */
  const intent = opts && opts.intent;
  if (intent) {
    const handler = _MOCK_INTENT_HANDLERS[intent];
    if (handler) return handler(p, J);
    console.warn(`[mockAskClaude] unknown intent "${intent}" — falling through to text matching`);
  }

  // 1) Ask Leo chat (plain text)
  if (p.includes("Reply as the tutor")) {
    const q = _mockPick(p, /The student now says: "([^"]*)"/);
    return `That's a good question about “${q || "English"}”. Here's a simple way to think about it, with a short example you can copy and adapt. Try writing one sentence yourself and I'll help you improve it.`;
  }
  // 2) Diary study resources
  if (p.includes("free online study resources") || p.includes('"resources"')) {
    return J({ resources: [
      { title: "Grammar reference", site: "British Council", url: "https://learnenglish.britishcouncil.org/grammar", why: "Clear explanations for the grammar from today's class." },
      { title: "6 Minute English", site: "BBC Learning English", url: "https://www.bbc.co.uk/learningenglish", why: "Short listening practice on everyday topics." },
      { title: "Cambridge Dictionary", site: "Cambridge", url: "https://dictionary.cambridge.org", why: "Check new words, meanings and pronunciation." },
    ] });
  }
  // 3) Diary feedback
  if (p.includes("wrote this diary entry")) {
    return J(MOCK_DIARY_FEEDBACK);
  }
  // 4-pre-a) Stage 1: Student Analysis (plain text, no JSON)
  if (p.includes("write a brief STUDENT ANALYSIS")) {
    return `This student has been learning with me for a while now. They are making genuine progress — their confidence in everyday situations is growing, and I can see improvement in their willingness to attempt full sentences rather than single words. Their vocabulary is expanding, though some words are still fragile and need more encounters before they stick. Grammar-wise, polite request forms are getting stronger but they still default to direct forms under pressure. Their recent diary entries show they are engaging with English outside class, which is encouraging. They completed a mission recently, and I should ask how it went — that follow-up matters for building trust. Emotionally, they seem motivated but still anxious about speaking to strangers. Today I want to build on that growing confidence.`;
  }
  // 4-pre-b) Stage 2: Needs Assessment (plain text, no JSON)
  if (p.includes("decide what this student genuinely needs today")) {
    const ctx = _mockPick(p, /asked to work on: "([^"]*)"/);
    const pack = _mockFindPack(ctx) || _mockNextPack(p);
    return `This student needs to practise ${pack.ctx.toLowerCase()}. This is the right lesson for today because it is a situation they will genuinely encounter in Australian life, and it builds naturally on what we have been working on. I predict they will struggle with polite request forms — they will probably say "I want" instead of "Could I get" or "I would like." They may also freeze when asked a follow-up question they did not expect. The essential vocabulary is: ${pack.vocab.join(", ")}. I would deliberately leave out more advanced terms that would overload them. The grammar that arises naturally is ${pack.grammar.point} — ${pack.grammar.meaning}. For authentic material, I would use this: ${pack.dialogue.replace(/\n/g, " ")}. The one memorable moment: Australians say "no worries" constantly — it means "you are welcome" and hearing it will make them feel like they belong. By the end, they should feel capable and proud. The final moment of success: they will role-play the complete ${pack.ctx.toLowerCase()} interaction and handle it confidently.`;
  }
  // 4-pre-c) Stage 4: Educational Review (plain text)
  if (p.includes("Would I enjoy teaching this lesson")) {
    return `1. Would I enjoy teaching this lesson? YES — it has a clear communicative purpose and authentic material.\n2. Does every vocabulary item support the objective? YES — each word is genuinely needed for this situation.\n3. Does the grammar arise naturally? YES — it comes directly from the communicative situation.\n4. Is the authentic material believable? YES — a student could encounter this in real life.\n5. Does everything build toward the final task? YES — vocabulary, grammar and speaking all prepare for the role-play.\n6. Is it memorable? YES — the Australian expression will stick.\n7. Would the student leave more confident? YES — they will have successfully completed a real interaction.\n8. Is there anything I would change? I would make sure the warm-up questions are specific enough to activate the exact vocabulary they will need.`;
  }
  // 4) Lesson Blueprint — the planner call, its fix-retry, and the post-review
  // revision. ONE pack = ONE coherent situation, and every later section branch
  // derives from the same pack, so mock lessons never mix scenarios. The
  // fix-retry and revision prompts embed the current plan's JSON, so the pack
  // is recovered from its "context" field first — a revision must never
  // silently switch scenario.
  if (p.includes("convert this thinking into a structured lesson plan") || p.includes("Fix your lesson plan") || p.includes("Revise your lesson plan")) {
    const planCtx = _mockPick(p, /"context":"([^"]+)"/);   // from an embedded current plan (retry/revision)
    const notesCtx = _mockPick(p, /practise ([^.]+)\./);   // from the Stage 2 needs assessment
    const req = _mockPick(p, /asked to work on: "([^"]*)"/);
    const pack = _mockFindPack(planCtx) || _mockFindPack(req) || _mockFindPack(notesCtx) || _mockNextPack(p);
    const hasMission = p.includes("yesterday's mission was");
    const reqSkill = _mockPick(p, /Requested main skill: "([^"]*)"/);
    const mainSkill = reqSkill === "reading" || reqSkill === "listening" ? reqSkill : (new Date().getDate() % 2 ? "reading" : "listening");
    const vocab8 = pack.vocab.slice(0, 8).map((w, i) => ({
      word: w,
      pos: ["noun", "phrase", "noun", "verb phrase", "noun", "adjective", "noun", "phrase"][i % 8],
      meaning: `"${w}" — a key word or phrase you need for ${pack.ctx.toLowerCase()}.`,
      ipa: "/\u02c8" + w.toLowerCase().replace(/[^a-z]/g, "").slice(0, 6) + "/",
      stress: "the first syllable",
      syllables: w.replace(/(.{3})(?=.)/g, "$1\u00b7"),
      example: `${pack.model}`,
      examples: [`A natural sentence with "${w}" you might hear during ${pack.ctx.toLowerCase()}.`],
      related: pack.vocab.filter((x) => x !== w).slice(0, 3),
      collocations: [],
    }));
    return J({
      teacherReflection: `This student needs to practise ${pack.ctx.toLowerCase()} — it's a situation they'll encounter regularly in Australia. Based on what I know about them, I'll focus on polite request forms and build their confidence with a realistic role-play.`,
      communicativeObjective: `Successfully handle ${pack.ctx.toLowerCase()} in English`,
      context: pack.ctx,
      cefr: _mockPick(p, /CEFR (\w\d)/) || "B1",
      lessonRationale: `This connects to the student's life in Australia — ${pack.ctx.toLowerCase()} is something they need to handle independently and confidently.`,
      predictedDifficulties: ["May use 'I want' instead of 'Could I get'", "Might freeze when asked a follow-up question", "Could forget to add 'please' or 'thanks'"],
      emotionalObjective: "Leave feeling capable of handling this situation for real",
      memorableMoment: "Australians say 'no worries' to mean 'you're welcome' — it's one of the most useful phrases you'll hear.",
      authenticMaterial: pack.dialogue,
      scaffoldingStrategy: "Vocabulary first to build word confidence, then hear it in context through a realistic exchange, practise the grammar that makes requests polite, rehearse speaking, then perform the whole interaction.",
      finalTask: `Role-play the complete ${pack.ctx.toLowerCase()} interaction with Leo playing the other person. Success means communicating the key message politely and handling one follow-up question.`,
      tomorrowConnection: `Tomorrow we could extend this to handling unexpected follow-up questions in ${pack.ctx.toLowerCase()}.`,
      explanation: `Today we're working on ${pack.ctx.toLowerCase()} — something you'll genuinely use here in Australia. By the end you'll handle it with confidence.`,
      warmUpQuestions: [
        ...(hasMission ? ["Before we start — how did yesterday's mission go? Tell me honestly, even if it didn't go to plan."] : []),
        ...(pack.warmUpQs || [pack.warmQ]),
      ],
      warmUpActivities: _mockWarmUp(pack, _mockPick(p, /Do NOT use these formats[^:]*: ([^.\n]+)/)),
      vocabulary: vocab8,
      grammar: { point: pack.grammar.point, meaning: pack.grammar.meaning, form: pack.grammar.form, usage: pack.grammar.usage, examples: pack.grammar.examples },
      pronunciation: { focus: "polite intonation and word stress", tips: ["Stress the important content words.", "Let your voice rise gently on requests — it sounds friendlier.", "Say it slowly first, then at natural speed."] },
      mainSkill,
      mission: `Today, use one phrase from this lesson in a real "${pack.ctx.toLowerCase()}" moment.`,
      learningOutcome: `You can now ${pack.ctx.toLowerCase()} politely and naturally in English.`,
    });
  }
  // Scenario for section builders: the real prompts state `Today's lesson: "<context>"`,
  // and the QA retry embeds the failed exercise, whose passage identifies the pack.
  const _sectionPack = () => {
    const ctx = _mockPick(p, /Today's lesson: "([^"]+)"/) || _mockPick(p, /\nContext: ([^\n(]+)/);
    const byPoint = MOCK_PACKS.find((pk) => p.includes(`Point: "${pk.grammar.point}"`) || p.includes(`GRAMMAR POINT: "${pk.grammar.point}"`));
    return byPoint || _mockFindPack(ctx && ctx.trim()) || MOCK_PACKS.find((pk) => pk.dialogue && p.includes(pk.dialogue.slice(0, 40))) || MOCK_PACKS[0];
  };
  const _skillPayload = (pack) => {
    const passage = `${pack.dialogue}\n\nAfterwards, they thanked each other and carried on with their day. Situations like ${pack.ctx.toLowerCase()} happen every day in Australia, and a few polite phrases make them easy.`;
    const qs = [
      { stem: "What is this text mainly about?", options: [pack.ctx, "Booking a holiday", "A cooking class", "Buying a car"], answer: pack.ctx, note: "Good skimming — that's the main idea." },
      { stem: "How would you describe the tone of the exchange?", options: ["Friendly and polite", "Angry", "Confused", "Formal and cold"], answer: "Friendly and polite", note: "Right — notice the softeners they used." },
      { stem: "What made the request sound polite?", options: ["A question form like 'could'", "Speaking loudly", "Repeating the request", "Using long words"], answer: "A question form like 'could'", note: "Exactly — question forms soften requests." },
      { stem: "Where would you most likely hear this?", options: ["In everyday Australian life", "In a courtroom", "In a lecture", "On the news"], answer: "In everyday Australian life", note: "Yes — this is everyday English." },
      { stem: "What is a good phrase to remember from this?", options: [pack.model, "No.", "Give it to me.", "Whatever."], answer: pack.model, note: "That's the one to keep." },
    ];
    return J({ passage, questions: qs });
  };
  // Grammar practice is drawn from the SAME pack whose grammar point the
  // explanation screen just taught — so explanation, examples, questions,
  // answers and feedback can never drift apart.
  const _grammarPayload = (pack) => J({ grammarPoint: pack.grammar.point, questions: pack.grammar.practice });
  // 4b) Section: reading passage OR listening transcript + five questions
  if (p.includes("five comprehension questions")) {
    return _skillPayload(_sectionPack());
  }
  // 4b-retry) Section QA regeneration — a failed exercise sent back with its
  // problems. Re-serve the (matcher-corrected) section for the same scenario.
  if (p.includes("Regenerate this exercise")) {
    if (p.includes("Your skill exercise")) return _skillPayload(_sectionPack());
    if (p.includes("Your grammar exercise")) return _grammarPayload(_sectionPack());
    // A summary regeneration returns the SAME object the first-pass branch
    // returns. The comment that previously sat here claimed this already
    // happened; it did not, and the branch held its own pre-correction copy.
    return J(_closingSummary(p));
  }
  // 4c) Section: five grammar practice questions — must test GRAMMAR (structure,
  // word order, verb forms, articles, prepositions), NOT politeness or function.
  if (p.includes("five grammar practice questions") || p.includes("five practice questions that ALL drill")) {
    return _grammarPayload(_sectionPack());
  }
  // 4d) Speaking practice — Leo replies as a conversational teacher, plain text
  if (p.includes("continuing a short speaking practice conversation") || p.includes("in a speaking practice about")) {
    return _mockSpeakingReply(p);
  }
  // 4e) Section: closing summary
  if (p.includes("closing summary for today's lesson") || p.includes("closing reflection for today's lesson")) {
    return J(_closingSummary(p));
  }
  // 4f) Vocabulary card — student taps a highlighted word (non-blueprint words)
  if (p.includes("tapped on the word")) {
    const word = _mockPick(p, /tapped on the word "([^"]+)"/);
    const scen = _mockPick(p, /lesson about "([^"]+)"/);
    return JSON.stringify({
      ipa: "/\u02c8w\u025cd/", pos: "noun", cefr: "B1",
      definition: `A friendly, clear explanation of "${word}" in simple English, as a teacher would give.`,
      lessonExample: `A natural example of "${word}" in the context of "${scen}".`,
      examples: [`An everyday Australian sentence using "${word}".`, `Another natural example you might hear or say.`],
      related: ["a related word", "another related term", "one more"],
    });
  }
  // 6) Dictionary
  if (p.includes("Dictionary entry for")) {
    const w = _mockPick(p, /Word or phrase: "([^"]*)"/) || "word";
    return J({ word: w, ipa: "/ˈsɑːm.pəl/", pos: "noun", cefr: "B1", definition: `A clear, simple meaning of “${w}” goes here, in plain English.`, example: `Here is a natural example sentence using “${w}”.`, collocations: [`a ${w}`, `${w} of`, `the main ${w}`], translation: `(${w})` });
  }
  // 7) Thesaurus
  if (p.includes("Thesaurus entry for")) {
    const w = _mockPick(p, /Word: "([^"]*)"/) || "word";
    return J({ word: w, synonyms: ["a close synonym", "a more casual alternative", "a more formal alternative"], antonyms: ["the opposite meaning"], phrases: [`in terms of ${w}`, `all about ${w}`], examples: [`A short example sentence with “${w}”.`] });
  }
  // 8) English I heard today
  if (p.includes("heard this English word or phrase in real life")) {
    const ph = _mockPick(p, /real life: "([^"]*)"/) || "phrase";
    return J({ meaning: `Here's what “${ph}” means in plain English — you'll often hear this in everyday Australian conversation.`, ipa: "", pos: "phrase", example: `Someone might say: “${ph}” at the shops.`, collocations: [], formality: "casual", translation: `(${ph})` });
  }
  // 9) Ask Leo about Australia (plain text)
  if (p.includes("guide for international students living in Australia")) {
    const q = _mockPick(p, /Question: "([^"]*)"/);
    return `Good question about “${q || "living in Australia"}”. For anything official, check the relevant body such as Service NSW, the ATO, or Home Affairs. In everyday life here, a good first step is to ask politely and keep it simple.`;
  }
  // 10) Pronunciation
  if (p.includes("Pronunciation coaching")) {
    const w = _mockPick(p, /Word: "([^"]*)"/) || "word";
    return J({ word: w, ipa: `/ˈ${w.toLowerCase()}/`, syllables: w.replace(/(.{3})(?=.)/g, "$1·"), stress: "the first syllable", tips: ["Say it slowly, one part at a time.", "Put the stress on the first syllable.", "Keep the vowels relaxed."], l1Note: "" });
  }
  // 11) Vocabulary review
  if (p.includes("personalised vocabulary review")) {
    const terms = []; const re = /"([^"]+)" \(from/g; let m;
    while ((m = re.exec(p)) && terms.length < 3) terms.push(m[1]);
    if (!terms.length) terms.push("word");
    const distractorPhrasings = ["doesn't quite work here", "isn't the right fit for this sentence", "would confuse the meaning"];
    return J({ questions: terms.map((t) => ({ word: t, stem: `Which sentence uses “${t}” correctly?`, options: [`This is a natural, correct use of “${t}”.`, ...distractorPhrasings.map((d) => `This use of “${t}” ${d}.`)], answer: `This is a natural, correct use of “${t}”.`, note: `Well done — that's a natural way to use “${t}”.` })) });
  }
  // Fallback: keep the app stable for any unrecognised prompt.
  // (Dev note: if you see this in the UI, a new AI call site needs a
  // matching branch above — the app has no other mock coverage for it.)
  if (p.includes("Respond ONLY with JSON")) return "{}";
  console.info("[mockAskClaude] no matching mock branch for this prompt — add one:", p.slice(0, 120));
  return "That's worth thinking about — ask me again in a moment and I'll have more for you.";
}

function parseJSON(text) {
  const clean = text.replace(/```json|```/g, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON found");
  const raw = clean.slice(start, end + 1);
  try { return JSON.parse(raw); }
  // NOT A DEFECT — DO NOT "FIX". The \u escapes below are inside a regular
  // expression literal, where they are real character codes for the control
  // range 0x00-0x1F and strip unprintable bytes from a malformed AI response.
  // They are not the JSX-text escape bug fixed on 22 July (nine lines, where
  // codes sat outside any string literal and printed to the student verbatim).
  // Replacing these with literal characters would break JSON repair.
  catch { return JSON.parse(raw.replace(/[\u0000-\u001F]+/g, " ")); }
}

/* ---------------- storage helpers ---------------- */

async function loadKey(key, fallback) {
  try {
    const r = await window.storage.get(key);
    return r ? JSON.parse(r.value) : fallback;
  } catch {
    return fallback;
  }
}
async function saveKey(key, value) {
  try {
    await window.storage.set(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage failed", e);
  }
}

const todayStr = () => new Date().toISOString().slice(0, 10);

/* ---------------- Leo's learning memory (Phase 4/5/6) ----------------
   A small, additive store that lets Leo remember what happened, rather
   than discarding it. It does NOT duplicate esl-words / esl-heard / esl-errors
   — it only layers mastery + history on top of what already exists there,
   keyed by the word/phrase text itself. All functions below are pure:
   (store, ...) -> new store, so they're easy to reason about and test. */

/* lessonsCompleted and firstLessonDate are LIFETIME facts and are deliberately
   NOT derived from lessonLog. The log is trimmed, so counting it told Leo that
   a student of six months had done ten lessons over ten days — a false history
   fed into every plan, and a Continuity Integrity defect rather than a memory
   limit. These two never trim. */
const DEFAULT_MEMORY_STORE = { wordMastery: {}, lessonLog: [], diaryFeedbackLog: [], questionLog: [], lessonsCompleted: 0, firstLessonDate: null };
/* The lesson log lives in its OWN storage key. The rest of the store is
   rewritten on every word answered (practiceWord, touchWord) — keeping the log
   inside it meant a single vocabulary answer re-serialised the entire lesson
   history it had nothing to do with. Split, that cost disappears and the cap
   becomes almost free: the log is written only when a lesson is recorded.
   Readers are unaffected — store.lessonLog still exists in memory. */
const LESSON_LOG_KEY = "esl-lesson-log";
const LESSON_LOG_CAP = 2000;       // ~5.5 years of daily use
/* The Word Bank is the ONLY surface that brings vocabulary back for review.
   At eight words per lesson the old 200 cap saturated in 25 days, after which
   every word Leo taught silently evicted an older one — wordMastery would know
   a student had met 1,400 words while the review could reach 200. */
const WORD_BANK_CAP = 2000;
/* Heard entries are NOT the same weight as word bank entries: a word bank entry
   is {word, date} at ~45 bytes, while a heard entry carries a full info object
   — meaning, IPA, part of speech, example, collocations, formality, translation
   — at ~391 bytes, roughly 8.7x heavier. 1000 is about three years at one a
   day, which is a real horizon for a surface the student fills by hand, and
   keeps the footprint near 380KB rather than the 764KB that matching the Word
   Bank would cost. */
const HEARD_CAP = 1000;
const DIARY_FEEDBACK_CAP = 50;
const MASTERY_STAGES = ["new", "seen", "practised", "confident", "mastered"];
const MASTERY_RANK = { new: 0, seen: 1, practised: 2, confident: 3, mastered: 4 };

async function loadMemoryStore() {
  const s = await loadKey("esl-memory-store", DEFAULT_MEMORY_STORE);
  const o = s && typeof s === "object" ? s : {};
  // Migration: stores written before the split still carry the log inline.
  // It is read from there once, then moves to its own key on the next save.
  const separate = await loadKey(LESSON_LOG_KEY, null);
  const log = Array.isArray(separate) ? separate : (Array.isArray(o.lessonLog) ? o.lessonLog : []);
  // Coerce every field to its expected type. `{...DEFAULT, ...s}` only backfills
  // MISSING keys — a corrupted or tampered store where a field is the wrong type
  // (e.g. wordMastery:null, questionLog:42) would otherwise crash the helpers.
  return {
    wordMastery: o.wordMastery && typeof o.wordMastery === "object" ? o.wordMastery : {},
    lessonLog: log,
    diaryFeedbackLog: Array.isArray(o.diaryFeedbackLog) ? o.diaryFeedbackLog : [],
    questionLog: Array.isArray(o.questionLog) ? o.questionLog : [],
    // Migration: a store written before these existed falls back to the log,
    // which is no worse than the old behaviour and self-corrects from the next
    // lesson onwards.
    lessonsCompleted: Number.isFinite(o.lessonsCompleted) ? o.lessonsCompleted : log.length,
    firstLessonDate: typeof o.firstLessonDate === "string" ? o.firstLessonDate
      : (log.length ? (log[log.length - 1] || {}).date || null : null),
  };
}
/* The log is written ONLY when it has actually changed. Every mem* helper
   spreads the store, so lessonLog keeps its array reference unless
   memRecordLesson replaced it — a reference check is therefore exact. */
function saveMemoryStore(store, prev) {
  const { lessonLog, ...rest } = store;
  saveKey("esl-memory-store", rest);
  if (!prev || prev.lessonLog !== lessonLog) saveKey(LESSON_LOG_KEY, lessonLog || []);
}

// A word progresses new -> seen -> practised -> confident -> mastered on a
// streak of correct answers, and steps back to "seen" (not all the way to
// "new") on a miss — one slip shouldn't erase that they've met the word before.
function memBumpWordMastery(store, term, ok, date) {
  const key = (term || "").trim().toLowerCase();
  if (!key) return store;
  const cur = store.wordMastery[key] || { stage: "new", correctStreak: 0, timesSeen: 0, lastSeen: null };
  const timesSeen = cur.timesSeen + 1;
  const correctStreak = ok ? cur.correctStreak + 1 : 0;
  const stage = MASTERY_STAGES[Math.min(correctStreak, 4)] === "new" ? (timesSeen > 0 ? "seen" : "new") : MASTERY_STAGES[Math.min(correctStreak, 4)];
  return { ...store, wordMastery: { ...store.wordMastery, [key]: { stage, correctStreak, timesSeen, lastSeen: date } } };
}
// Registers a word Leo hasn't scored yet (e.g. just looked up) without
// touching its stage if it's already being tracked.
function memTouchWord(store, term) {
  const key = (term || "").trim().toLowerCase();
  if (!key || store.wordMastery[key]) return store;
  return { ...store, wordMastery: { ...store.wordMastery, [key]: { stage: "new", correctStreak: 0, timesSeen: 0, lastSeen: null } } };
}
function memMasteryStage(store, term) {
  const e = store.wordMastery[(term || "").trim().toLowerCase()];
  return e ? e.stage : "new";
}
// Weakest-first ordering, so review and lesson generation can prioritise
// words that actually need practice over ones already mastered.
function memSortByMasteryAsc(items, store, getTerm) {
  return [...items].sort((a, b) => MASTERY_RANK[memMasteryStage(store, getTerm(a))] - MASTERY_RANK[memMasteryStage(store, getTerm(b))]);
}
function memRecordLesson(store, entry) {
  const today = todayStr();
  return {
    ...store,
    lessonLog: [{ ...entry, date: today }, ...store.lessonLog].slice(0, LESSON_LOG_CAP),
    lessonsCompleted: (store.lessonsCompleted || 0) + 1,
    firstLessonDate: store.firstLessonDate || today,
  };
}
function memRecordDiaryFeedback(store, fb) {
  return { ...store, diaryFeedbackLog: [{ ...fb, date: todayStr() }, ...store.diaryFeedbackLog].slice(0, DIARY_FEEDBACK_CAP) };
}
// M6: remember what the learner asks Leo about, so future lessons can reference
// their real questions. Deduped (case-insensitive) and capped so nothing bloats.
function memRecordQuestion(store, text) {
  const q = (text || "").trim();
  if (!q) return store;
  const log = (store.questionLog || []).filter((e) => e.text.toLowerCase() !== q.toLowerCase());
  return { ...store, questionLog: [{ text: q.slice(0, 120), date: todayStr() }, ...log].slice(0, 12) };
}

function computeStreak(dates) {
  const set = new Set(dates);
  let streak = 0;
  const d = new Date();
  if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
  while (set.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

/* ---------------- Loading indicator ---------------- */

/* MOTION CHARACTER SPEC §3 — the drawn rule.
   One element wherever the app waits: the completion tick's own mechanism at
   smaller scale. stroke-dashoffset travels from full length to zero, once,
   then rests. It never loops — a looping animation says "waiting", and Leo
   does not need to fill silence, because Leo can talk. If the wait continues
   the SENTENCE changes and the rule redraws BECAUSE the sentence changed, so
   movement is always the consequence of something actually happening. */

/* §3.3 — the escalation ladder, generic across every call site. These replace
   five strings no student ever saw: every call site passed an explicit label. */
const LEO_LOADER_MESSAGES = [
  "Still working — I'd rather get this right than get it quickly.",  // at 4s
  "This one's taking longer than usual. I haven't forgotten you.",   // at 9s
];

/* §3.2 timing table. 0-400ms: nothing at all — a loader that flashes for a
   fifth of a second is noise. 400ms: the rule draws once. 4s and 9s: the
   line changes. No fourth stage; that would be fidgeting in words.
   The ladder is NOT suppressed under reduced motion (§5) — a changing
   sentence is information, not movement. */
function useWaitStage() {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const a = setTimeout(() => setStage(1), 400);
    const b = setTimeout(() => setStage(2), 4000);
    const c = setTimeout(() => setStage(3), 9000);
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); };
  }, []);
  return stage;
}

function DrawnRule({ inline }) {
  const len = inline ? 28 : 48;
  const w = inline ? 2.5 : 3;
  return (
    <svg className="drawn-rule" width={len} height={w * 2} viewBox={`0 0 ${len} ${w * 2}`} aria-hidden="true">
      <line x1="0" y1={w} x2={len} y2={w} className="drawn-rule-line"
        strokeWidth={w} style={{ strokeDasharray: len, strokeDashoffset: len }} />
    </svg>
  );
}

/* The rule and the sentence together. Changing the key remounts both, which is
   what redraws the rule when the line changes (§3.2).
   §6: the mark is always aria-hidden and the sentence always live — the motion
   is never the announcement. */
function WaitIndicator({ label, inline, className, stage: forced }) {
  const own = useWaitStage();
  const stage = forced === undefined ? own : forced;
  if (stage === 0) return null;
  const text = stage >= 3 ? LEO_LOADER_MESSAGES[1]
    : stage === 2 ? LEO_LOADER_MESSAGES[0]
    : label;
  const cls = (inline ? "wait-inline" : "wait-block") + (className ? " " + className : "");
  return (
    <div className={cls} role="status" aria-live="polite">
      <DrawnRule key={stage} inline={inline} />
      {text && <p className="wait-label text-leo" key={"t" + stage}>{text}</p>}
    </div>
  );
}

function LeoLoader({ label }) {
  return <WaitIndicator label={label} />;
}

/* The whole row is gated, not just the rule: an empty padded bubble with an
   avatar beside it IS an indicator, and §3.2 says nothing at all appears
   under 400ms. The stage is owned here and passed down so the inner rule
   does not restart the clock. */
function ChatTypingRow() {
  const stage = useWaitStage();
  if (stage === 0) return null;
  return (
    <div className="bubble-row row-bot">
      <span className="bot-avatar-leo">L</span>
      <div className="bubble bubble-bot typing"><WaitIndicator inline stage={stage} /></div>
    </div>
  );
}

/* ---------------- small UI bits ---------------- */

function Spinner({ label }) {
  return <WaitIndicator label={label || "Thinking…"} inline />;
}

function Card({ children, className }) {
  return <div className={"card " + (className || "")}>{children}</div>;
}

function SectionTitle({ children, sub }) {
  return (
    <div className="section-title">
      <h2>{children}</h2>
      {sub && <p className="sub">{sub}</p>}
    </div>
  );
}

/* ================= PAGES ================= */

/* ---- Sydney skyline: Leo's own artwork, recoloured to black ---- */
const SKYLINE_IMG = "data:image/png;base64,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";

function SkylineSketch({ animate }) {
  return (
    <img
      src={SKYLINE_IMG}
      className={"sky-img" + (animate ? " sky-anim" : "")}
      alt="Line drawing of the Sydney skyline: Sydney Tower, Crown, the Opera House and the Harbour Bridge"
    />
  );
}

/* ---------------- Today's journey (Phase 3 & 7) ----------------
   ONE place that defines what "today" consists of, in order, and how each
   step's completion/gating is decided. Adding, reordering or gating a daily
   activity means editing this array — HomeScreen just renders it. */
const DAILY_JOURNEY = [
  { key: "diary", label: "Diary page", icon: PenLine, page: "diary", isDone: (t) => t.diaryFilled, ctaLabel: "Write today's diary" },
  { key: "task", label: "Leo's Lesson", icon: GraduationCap, page: "task", isDone: (t) => t.taskDone, ctaLabel: "Start today's lesson" },
  { key: "vocab", label: "Word review", icon: RotateCcw, page: "vocab", isDone: (t) => t.vocabDone, isGated: (t) => t.wordCount < 3, gateLabel: "Save a word first", ctaLabel: "Review your words" },
];

/* Written-out date, composed rather than localised so it always reads
   "Tuesday, 21 July" in British English regardless of device locale. */
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const longDate = (d) => `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;

/* Greeting is English, not L1: an Australian teacher greets a student in
   English every morning, and that is the immersion the student came for.
   L1 keeps its real jobs elsewhere — the "Hi, I'm Leo" page, dictionary
   glosses, pronunciation notes.
   NOTE: there is deliberately no "Good night". In English that is a
   farewell, never a greeting; a student sitting down to study at 10pm
   would be said goodbye to, and would learn the phrase wrong. Evening
   covers the whole night. */
const timeGreeting = (d) => {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const clockTime = (d) => {
  const h = d.getHours();
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(d.getMinutes()).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
};

/* Isolated so the minute tick redraws ONLY this block. The continuity line
   and the Today card sit outside it and are never recomputed by the clock.
   Once per minute, not per second: a per-second counter is the most noticed
   motion possible on a still screen, and motion should be felt, not noticed.
   The first tick is aligned to the next minute boundary so the displayed
   time is never up to 59 seconds stale. */
function HomeGreeting({ name }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let interval;
    const align = setTimeout(() => {
      setNow(new Date());
      interval = setInterval(() => setNow(new Date()), 60000);
    }, 60000 - (Date.now() % 60000));
    return () => { clearTimeout(align); if (interval) clearInterval(interval); };
  }, []);
  return (
    <>
      <h1 className="greet-hello">{timeGreeting(now)}, {name}</h1>
      <p className="greet-date">{longDate(now)} <span className="greet-clock">{clockTime(now)}</span></p>
    </>
  );
}

/* Line 3 of the greeting. Sourced from the lesson log — never invented, never
   generic. Returns null whenever Leo has nothing specific to say, and the line
   is then omitted entirely (spec A3.2). "Yesterday" is a factual claim, so the
   wording is derived from the real gap rather than assumed. */
function continuityLine(lessonLog) {
  const last = (lessonLog || [])[0];
  if (!last || !last.date) return null;
  const gap = Math.round((new Date(todayStr()).getTime() - new Date(last.date).getTime()) / 86400000);
  if (gap < 1 || gap > 13) return null;            // today, future, or too long ago
  const when = gap === 1 ? "Yesterday" : "Last time";
  const tc = (last.tomorrowConnection || "").trim();
  if (tc) return `${when} I said today would build on this: ${tc}`;
  const sc = (last.scenario || "").trim();
  if (sc) return `${when} we practised ${sc.charAt(0).toLowerCase() + sc.slice(1)}. Let's build on that.`;
  return null;
}

/* "What Leo has noticed" — prose, not statistics. Omitted entirely when there
   is nothing true to say, on the same principle as the continuity line. */
function noticedLine(stats) {
  const bits = [];
  const top = ((stats && stats.errorTally) || [])[0];
  if (top && top[0]) bits.push(`You're working on ${top[0]} at the moment.`);
  if (stats && stats.streak >= 2) bits.push(`${stats.streak} days running.`);
  return bits.length ? bits.join(" ") : null;
}

// The single source of truth for "did the student do X today?" — every page
// that needs this reads it from here rather than keeping its own copy.
function computeTodayProgress({ diaryPages, todayDone, words, heard }) {
  const tp = diaryPages[todayStr()];
  return {
    diaryFilled: !!(tp && ((tp.skills && tp.skills.length) || tp.homework || tp.notes || tp.skillsDetail)),
    taskDone: !!todayDone.task,
    vocabDone: !!todayDone.vocab,
    wordCount: words.length + heard.length,
  };
}

/* ── Navigation (A1) ──
   Four persistent destinations replacing the nine-tile grid (spec A4).
   Diary, Leo's Lesson and Word review are NOT tiles — they live in the Today
   card. Diary and Leo's Lesson are sub-screens of Today; Word review is a
   section of Words, so a student can return to it after today's row is done.
   Tabs whose `sections` length is 1 render no segmented control. */
const TABS = [
  { id: "today", label: "Today", icon: Home, sections: [{ page: null, label: "Today" }] },
  { id: "ask", label: "Ask Leo", icon: MessageCircle, sections: [
    { page: "questions", label: "English" },
    { page: "australia", label: "Australia" },
  ] },
  { id: "words", label: "Words", icon: Book, sections: [
    { page: "dictionary", label: "Dictionary" },
    { page: "vocab", label: "Word review" },
    { page: "heard", label: "Heard today" },
  ] },
  { id: "progress", label: "Progress", icon: TrendingUp, sections: [
    { page: "progress", label: "Progress" },
    { page: "placement", label: "Level Check" },
  ] },
];

/* Screens that belong to a tab but are not sections of it — reached from the
   Today card, and returned from via the header back control. */
const TAB_SUBSCREENS = { diary: "today", task: "today" };

const tabOfPage = (p) => {
  if (TAB_SUBSCREENS[p]) return TAB_SUBSCREENS[p];
  const t = TABS.find((x) => x.sections.some((sec) => sec.page === p));
  return t ? t.id : "today";
};
const defaultPageOfTab = (id) => (TABS.find((t) => t.id === id) || TABS[0]).sections[0].page;

function TabBar({ tab, onSelect }) {
  return (
    <nav className="tab-bar" role="navigation" aria-label="Main">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button key={id} className={"tab-item" + (tab === id ? " tab-item-on" : "")}
          aria-current={tab === id ? "page" : undefined} onClick={() => onSelect(id)}>
          <Icon size={22} />
          <span className="tab-item-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}

function SectionSwitch({ sections, page, onSelect }) {
  return (
    <div className="seg-control" role="tablist">
      {sections.map((sec) => (
        <button key={String(sec.page)} role="tab" aria-selected={page === sec.page}
          className={"seg-item" + (page === sec.page ? " seg-item-on" : "")}
          onClick={() => onSelect(sec.page)}>{sec.label}</button>
      ))}
    </div>
  );
}

function HomeScreen({ profile, onOpen, animate, todayInfo, continuity, noticed }) {
  const nextItem = DAILY_JOURNEY.find((item) => !item.isDone(todayInfo) && !(item.isGated && item.isGated(todayInfo)));
  return (
    <div className="home-screen">
      {/* The mark is unanchored: deleting this one element leaves the layout intact. */}
      <div className="brand-mark-sm"><WhiteboardLogo width={132} /></div>

      <div className="home-greet">
        <HomeGreeting name={profile.name} />
        {continuity && <p className="greet-cont leo-accent">{continuity}</p>}
      </div>

      <div className="leo-card today-card">
        {DAILY_JOURNEY.map((item) => {
          const done = item.isDone(todayInfo);
          const gated = item.isGated && item.isGated(todayInfo);
          const Icon = item.icon;
          return (
            <button key={item.key} className="tc-row" disabled={gated}
              onClick={() => onOpen(item.page)}
              aria-label={done ? `${item.label} — done. Open again.` : item.label}>
              <Icon size={20} className="tc-icon" />
              <span className="tc-label">{item.label}</span>
              {done && <span className="tc-done"><Check size={16} /> Done</span>}
              {!done && gated && <span className="tc-gate">{item.gateLabel}</span>}
            </button>
          );
        })}
        {nextItem ? (
          <button className="primary-btn wide tc-cta" onClick={() => onOpen(nextItem.page)}>{nextItem.ctaLabel}</button>
        ) : (
          <p className="tc-alldone">That's everything for today. I'll see you tomorrow.</p>
        )}
      </div>

      {noticed && (
        <button className="noticed-card" onClick={() => onOpen("progress")}>{noticed}</button>
      )}

      <div className="home-skyline"><SkylineSketch animate={animate} /></div>
    </div>
  );
}

/* ---------------- Progress ---------------- */

function ProgressPage({ stats }) {
  return (
    <div>
      <div className="stat-grid">
        <Card className="stat">
          <div className="stat-num">{stats.streak}</div>
          <div className="stat-label">day streak</div>
        </Card>
        <Card className="stat">
          <BookOpen size={20} className="euca" />
          <div className="stat-num">{stats.entries}</div>
          <div className="stat-label">diary pages</div>
        </Card>
        <Card className="stat">
          <Book size={20} className="euca" />
          <div className="stat-num">{stats.words}</div>
          <div className="stat-label">words learnt</div>
        </Card>
        <Card className="stat">
          <Gamepad2 size={20} className="euca" />
          <div className="stat-num">{stats.tasks}</div>
          <div className="stat-label">tasks done</div>
        </Card>
      </div>

      {stats.skillTally && stats.skillTally.length > 0 && (
        <Card>
          <h3>Your skills balance</h3>
          <p className="muted">Which skills you practise most. A balanced picture means stronger English overall.</p>
          {stats.skillTally.map(([skill, count]) => (
            <div key={skill} className="bar-row">
              <span className="bar-label">{skill}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: Math.min(100, (count / stats.skillTally[0][1]) * 100) + "%" }} />
              </div>
              <span className="bar-count">{count}</span>
            </div>
          ))}
        </Card>
      )}

      {stats.errorTally.length > 0 && (
        <Card>
          <h3>Your language patterns</h3>
          <p className="muted">The areas Leo's feedback mentions most — watch them shrink over time.</p>
          {stats.errorTally.map(([type, count]) => (
            <div key={type} className="bar-row">
              <span className="bar-label">{type}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: Math.min(100, count * 20) + "%" }} />
              </div>
              <span className="bar-count">{count}</span>
            </div>
          ))}
        </Card>
      )}

      {stats.entries === 0 && (
        <Card>
          <h3>Start here</h3>
          <p className="muted">Write your first diary entry today — even two sentences about your day counts. Then try the daily task to start your streak.</p>
        </Card>
      )}
    </div>
  );
}

/* ---------------- Diary ---------------- */

const EMPTY_PAGE = { skills: [], skillsDetail: "", homework: "", notes: "", feedback: null, resources: null };
const SKILLS = [
  ["Reading", "📖"], ["Listening", "🎧"], ["Speaking", "🗣️"], ["Writing", "✍️"],
  ["Grammar", "🧩"], ["Vocabulary", "📚"], ["Pronunciation", "🔊"],
];

function formatDate(d) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function DiaryPage({ profile, memory, leoMemory, pages, setPages, markActivity, addErrors }) {
  const today = todayStr();
  const dates = React.useMemo(() => {
    const s = new Set(Object.keys(pages));
    s.add(today);
    return [...s].sort();
  }, [pages, today]);

  const [current, setCurrent] = useState(today);
  const [dir, setDir] = useState("left");
  const touchX = React.useRef(null);

  const page = pages[current] || EMPTY_PAGE;
  const i = dates.indexOf(current);

  const [homeworkDraft, setHomeworkDraft] = useState(page.homework);
  const [notesDraft, setNotesDraft] = useState(page.notes);
  const [detailDraft, setDetailDraft] = useState(page.skillsDetail || "");

  /* ── Draft autosave ──────────────────────────────────────────────────────
     A student's own writing is the most personal thing Ask Leo holds, and
     before this a mistap on the tab bar discarded it. Drafts are stored
     SEPARATELY from the diary page, never merged into it, because
     computeTodayProgress treats any text on the page as a finished entry —
     autosaving into the page would mark the day's Diary row Done on the first
     keystroke and tell the student they had finished something they had not.
     Save alone commits, and Save alone completes the day.
     The net stays silent: no "draft saved" indicator. The Save button
     remaining enabled is the only signal that work is uncommitted. */
  const DRAFTS_KEY = "esl-diary-drafts";
  const draftsRef = React.useRef({});           // a ref, not state: writing a
  const [draftsLoaded, setDraftsLoaded] = useState(false); // draft must not re-render mid-typing

  useEffect(() => { (async () => {
    draftsRef.current = (await loadKey(DRAFTS_KEY, {})) || {};
    setDraftsLoaded(true);
  })(); }, []);

  // Apply the stored draft for this date, falling back to the saved page.
  useEffect(() => {
    if (!draftsLoaded) return;
    const d = draftsRef.current[current];
    setHomeworkDraft(d ? d.homework : page.homework);
    setNotesDraft(d ? d.notes : page.notes);
    setDetailDraft(d ? d.detail : (page.skillsDetail || ""));
  }, [current, draftsLoaded]);

  // Latest values, so the unmount flush writes what is actually on screen.
  const latestRef = React.useRef(null);
  latestRef.current = { date: current, page, homework: homeworkDraft, notes: notesDraft, detail: detailDraft };

  const writeDraft = async (v) => {
    if (!v) return;
    const differs = v.detail !== (v.page.skillsDetail || "") || v.homework !== v.page.homework || v.notes !== v.page.notes;
    if (differs) draftsRef.current[v.date] = { homework: v.homework, notes: v.notes, detail: v.detail };
    else delete draftsRef.current[v.date];
    await saveKey(DRAFTS_KEY, draftsRef.current);
  };

  useEffect(() => {
    if (!draftsLoaded) return;
    const t = setTimeout(() => { writeDraft(latestRef.current); }, 800);
    return () => clearTimeout(t);
  }, [homeworkDraft, notesDraft, detailDraft, current, draftsLoaded]);

  // Final write on leaving: without it, a mistap inside the debounce window
  // still loses the last sentence typed — the one most likely to matter.
  useEffect(() => () => { writeDraft(latestRef.current); }, []);

  const [busy, setBusy] = useState(null);
  const [saved, setSaved] = useState(null); // 'hw' | 'notes'

  const flashSaved = (which) => { setSaved(which); setTimeout(() => setSaved(null), 2000); };

  const update = async (patch, activity) => {
    const next = { ...pages, [current]: { ...page, ...patch } };
    setPages(next);
    await saveKey("esl-diary-pages", next);
    if (activity) await markActivity();
  };

  const goto = (delta) => {
    const n = dates[i + delta];
    if (!n) return;
    setDir(delta > 0 ? "left" : "right");
    setCurrent(n);
  };

  const toggleSkill = (s) => {
    const cur = page.skills || [];
    const next = cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s];
    update({ skills: next }, true);
  };
  const dirty = detailDraft !== (page.skillsDetail || "") || homeworkDraft !== page.homework || notesDraft !== page.notes;
  const savePage = async () => {
    await update({ skillsDetail: detailDraft, homework: homeworkDraft, notes: notesDraft }, true);
    // Committed: drop the draft so it can never shadow the saved page.
    delete draftsRef.current[current];
    await saveKey(DRAFTS_KEY, draftsRef.current);
    flashSaved("page");
  };

  const getResources = async () => {
    setBusy("resources");
    try {
      const skillsDesc = (page.skills || []).length ? `Skills practised: ${page.skills.join(", ")}${page.skillsDetail || detailDraft ? ` — in detail: "${page.skillsDetail || detailDraft}"` : ""}.` : "Skills practised: none listed.";
      const raw = await askClaude(
        `An adult ${levelFor(profile)} ESL student in Australia (first language: ${LANGS[profile.lang].english}) logged today's English class work.\n${skillsDesc}\nHomework: "${page.homework || homeworkDraft || "none listed"}".\nRecommend 3-4 free online study resources matched to these exact topics, prioritising anything they found hard. ONLY use these trusted sites: learnenglish.britishcouncil.org, bbc.co.uk/learningenglish, dictionary.cambridge.org, perfect-english-grammar.com, test-english.com, writeandimprove.com. Prefer stable section or hub URLs (e.g. the grammar reference section) over deep article links that might not exist. Respond ONLY with JSON, no fences: {"resources":[{"title":"short name","site":"e.g. British Council","url":"https://...","why":"one line linking it to their task, in simple English"}]}`,
        { intent: "diary_resources" }
      );
      await update({ resources: parseJSON(raw).resources }, true);
    } catch { alert("I'm having trouble with that one — let me try again."); }
    setBusy(null);
  };

  const inviteFeedback = async () => {
    setBusy("feedback");
    try {
      const raw = await askClaude(
        `You are Leo, a kind, encouraging Australian English teacher who knows this student well (${memory}). Celebrate strengths before mistakes, and only mention the mistakes that matter most. Teach like an expert: rather than only correcting, give a gentle HINT that helps them fix one thing themselves, and where their English is already good, UPGRADE it to more natural or more Australian phrasing. The student wrote this diary entry:\n\n"${notesDraft}"\n\nRespond ONLY with JSON, no markdown fences, exactly this shape:\n{"praise":"one specific, genuine thing they did well in English — name or quote the actual words you are praising, so it could not have been written about anyone else's entry","reformulation":"a natural, native-like version of their entry, keeping their meaning and first person voice","errorTypes":["up to 3 items from this list only: ${ERROR_TYPES.join(", ")}, or an empty array if none"],"tip":"one short, friendly coaching tip in simple English that either prompts them to self-correct ONE specific thing (a hint, not the full answer) or upgrades a good sentence into more natural English"}`,
        { intent: "diary_feedback" }
      );
      const fb = parseJSON(raw);
      await update({ notes: notesDraft, feedback: fb }, true);
      if (fb.errorTypes && fb.errorTypes.length) await addErrors(fb.errorTypes);
      leoMemory.recordDiaryFeedback({ praise: fb.praise, tip: fb.tip, errorTypes: fb.errorTypes || [] });
    } catch { alert("I'm having trouble with that one — let me try again."); }
    setBusy(null);
  };

  const canSuggest = homeworkDraft || page.homework || (page.skills || []).length > 0;

  return (
    <div
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (dx < -60) goto(1);
        if (dx > 60) goto(-1);
        touchX.current = null;
      }}
    >
      <div className="diary-nav">
        <button className="page-arrow" onClick={() => goto(-1)} disabled={i === 0} aria-label="Previous day">
          <ChevronLeft size={22} />
        </button>
        <div className="date-wrap">
          <span className="date-hand">{formatDate(current)}</span>
          {current === today && <span className="today-badge">Today</span>}
        </div>
        <button className="page-arrow" onClick={() => goto(1)} disabled={i === dates.length - 1} aria-label="Next day">
          <ChevronRight size={22} />
        </button>
      </div>

      <div key={current} className={"diary-page2 page-" + dir}>
        {/* -------- Skills practised -------- */}
        <section className="diary-section" aria-labelledby="lbl-skills">
          <h4 id="lbl-skills" className="diary-label">✅ Skills I practised today</h4>
          <p className="diary-help">Tick everything you worked on today.</p>
          <div className="skills-grid" role="group" aria-labelledby="lbl-skills">
            {SKILLS.map(([s, icon]) => {
              const on = (page.skills || []).includes(s);
              return (
                <button key={s} className={"skill-chip" + (on ? " skill-on" : "")} aria-pressed={on} onClick={() => toggleSkill(s)}>
                  <span aria-hidden="true">{icon}</span> {s} {on && <Check size={15} />}
                </button>
              );
            })}
          </div>
          {(page.skills || []).length > 0 && (
            <>
              <label className="input-label" htmlFor="skills-detail">What did you do, in detail?</label>
              <textarea
                id="skills-detail" className="big-input" rows={2}
                placeholder="e.g. Listened to a podcast about travel, practised ordering food in pairs…"
                value={detailDraft}
                onChange={(e) => setDetailDraft(e.target.value)}
              />
            </>
          )}
        </section>

        {/* -------- Homework -------- */}
        <section className="diary-section" aria-labelledby="lbl-hw">
          <h4 id="lbl-hw" className="diary-label">📚 Homework</h4>
          <p className="diary-help">What do you need to do before next class?</p>
          <label className="sr-only" htmlFor="hw-input">Homework</label>
          <textarea
            id="hw-input" className="big-input" rows={2}
            placeholder="e.g. Workbook page 34, write a paragraph using linking words…"
            value={homeworkDraft}
            onChange={(e) => setHomeworkDraft(e.target.value)}
          />
        </section>

        {/* -------- My diary -------- */}
        <section className="diary-section" aria-labelledby="lbl-notes">
          <h4 id="lbl-notes" className="diary-label">📖 My diary</h4>
          <p className="diary-help">Your private space. How did today go? Leo only reads this if you ask him to.</p>
          <label className="sr-only" htmlFor="notes-input">Diary entry</label>
          <textarea
            id="notes-input" className="big-input ruled-input" rows={5}
            placeholder="How was your day? Write your thoughts in English — what went well, and what was tricky?"
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
          />
          {notesDraft.trim() && !page.feedback && (
            <div className="save-row">
              <button className="ghost-btn" onClick={inviteFeedback} disabled={busy === "feedback"}>
                {busy === "feedback" ? <Spinner label="Leo is reading…" /> : <><Sparkles size={14} /> Ask Leo for feedback</>}
              </button>
            </div>
          )}
          {page.feedback && (
            <div className="feedback">
              <p className="leo-feedback-head"><strong>Leo's feedback</strong></p>
              <p><strong>👏 {page.feedback.praise}</strong></p>
              <p className="muted small">A native speaker might say:</p>
              <p className="reform">{page.feedback.reformulation}</p>
              {page.feedback.errorTypes?.length > 0 && <p className="small">Focus areas: {page.feedback.errorTypes.join(" · ")}</p>}
              <p className="small tip">💡 {page.feedback.tip}</p>
            </div>
          )}
        </section>
      </div>

      <div className="save-page-bar">
        <button className="primary-btn wide" onClick={savePage} disabled={!dirty}>
          {dirty ? <>Save entry <Check size={16} /></> : <>Saved <Check size={16} /></>}
        </button>
        <span className="saved-flash center-flash" role="status">{saved === "page" ? "✓ Your whole page is saved" : ""}</span>
      </div>

      <p className="swipe-hint">← Swipe or use the arrows to turn the pages →</p>

      {canSuggest && !page.resources && (
        <button className="primary-btn wide" onClick={getResources} disabled={busy === "resources"}>
          {busy === "resources" ? <Spinner label="Leo is finding good resources…" /> : <><Sparkles size={15} /> Ask Leo for study resources</>}
        </button>
      )}
      {page.resources && (
        <Card>
          <h3>Leo's study resources for today</h3>
          {page.resources.map((r, j) => (
            <a key={j} className="resource-card" href={r.url} target="_blank" rel="noopener noreferrer">
              <span className="resource-title">{r.title} <span className="pos">{r.site}</span> <ExternalLink size={13} /></span>
              <span className="muted small">{r.why}</span>
            </a>
          ))}
          <button className="ghost-btn" style={{ marginTop: 10 }} onClick={getResources} disabled={busy === "resources"}>
            {busy === "resources" ? <Spinner label="Refreshing…" /> : "Refresh suggestions"}
          </button>
        </Card>
      )}
    </div>
  );
}

/* ---------------- Leo's Lesson (scenario-based) ---------------- */

function diarySummary(pages) {
  const p = pages[todayStr()];
  if (!p) return "";
  const parts = [];
  if (p.skills && p.skills.length) parts.push("Skills practised: " + p.skills.join(", ") + (p.skillsDetail ? ` (detail: ${p.skillsDetail})` : ""));
  if (p.homework) parts.push("Homework: " + p.homework);
  return parts.join(". ");
}

const SCENARIOS = [
  "Ordering at a caf\u00e9", "Enrolling at university", "A visit to the doctor",
  "Renting a flat", "A job interview", "Meeting a new neighbour",
  "Shopping at the supermarket", "Opening a bank account",
  "Catching a train or bus", "Asking for directions in the city",
  "Returning an item to a shop", "Buying medicine at a pharmacy",
  "Booking a haircut", "Calling in sick to work",
  "Asking your manager for time off", "Making small talk at a barbecue",
  "Reporting a problem to your landlord", "Asking a question in class",
  "Booking a GP appointment by phone", "Buying an Opal card",
  "Attending a rental inspection", "Posting a parcel",
  "Being invited to a weekend event", "Ordering food at a food court",
  "Speaking to student support", "Asking about phone plans in a store",
];

/* ---------------- Leo's Lesson: shared building block ---------------- */

// One shared feedback line so all three exercises show Leo's ok/bad
// response the exact same way, instead of each re-implementing it.
/* The same mark as the completion tick, at reading size: one open polyline,
   round cap and join, drawn by stroke-dashoffset, ease-out, once. A student
   meets this after every answer — far more often than the stage tick — so it
   is the highest-frequency mark in the app and it was appearing, not drawn.
   currentColor is deliberate: it inherits .ok exactly as the icon did.
   The cross is NOT drawn. Animating a wrong answer stroke by stroke gives an
   error a flourish and holds the student's eye on it; the tick earns the
   gesture, the cross does not. */
function DrawnTick({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="drawn-tick" aria-hidden="true">
      <path d="M5 12.5 L10 17.5 L19 7" className="drawn-tick-mark" />
    </svg>
  );
}

function LeoFeedback({ ok, children }) {
  return <p className={(ok ? "ok" : "bad") + " text-leo"}>{ok ? <DrawnTick /> : <X size={15} />} {children}</p>;
}


/* ---------------- Vocabulary system (interactive tokens + bottom-sheet card) ---------------- */

// Wraps a single vocabulary item as a tappable token.
// Dotted eucalyptus underline signals interactivity without overwhelming the text.
function VocabToken({ word, onTap }) {
  return (
    <span
      className="vocab-token"
      role="button"
      tabIndex={0}
      aria-label={`Vocabulary: ${word}. Tap to see meaning.`}
      onClick={() => onTap(word)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onTap(word)}
    >
      {word}
    </span>
  );
}

// Splits plain text and wraps each vocab match in a VocabToken.
// Multi-word items (e.g. "traffic lights") are sorted longest-first so they
// match before their component words.
function VocabText({ text, vocab = [], onTap }) {
  if (!vocab.length || !text) return <>{text}</>;
  const escaped = [...vocab].sort((a, b) => b.length - a.length)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(pattern);
  return <>
    {parts.map((part, i) => {
      const match = vocab.find((v) => v.toLowerCase() === part.toLowerCase());
      return match ? <VocabToken key={i} word={part} onTap={onTap} /> : part;
    })}
  </>;
}

// Bottom-sheet vocabulary card — slides up over the lesson content.
function VocabCardSheet({ card, lesson, onClose, onSave, isSaved }) {
  if (!card) return null;
  const { word, data, loading } = card;
  const isTarget = lesson && lesson.useWord && lesson.useWord.word.toLowerCase() === word.toLowerCase();
  return (
    <div className="vocab-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Vocabulary card for ${word}`}>
      <div className="vocab-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="vocab-sheet-handle" />
        <div className="vocab-sheet-scroll">
          <div className="vocab-header">
            <h2 className="vocab-word">{word}</h2>
            {data && (
              <div className="vocab-meta">
                <span className="vocab-ipa">{data.ipa}</span>
                <span className="vocab-chip">{data.pos}</span>
                <span className="vocab-chip vocab-chip-cefr">{data.cefr}</span>
              </div>
            )}
          </div>

          {loading && <LeoLoader label={`I'm looking up "${word}"…`} />}

          {data && !loading && (
            <>
              <p className="vocab-def">{data.definition}</p>

              <div className="vocab-section">
                <p className="vocab-section-title">Examples</p>
                {isTarget && lesson.useWord.example && (
                  <p className="vocab-example vocab-example-today">
                    <span className="vocab-today-tag">Today's lesson</span>
                    {lesson.useWord.example}
                  </p>
                )}
                {data.lessonExample && !isTarget && (
                  <p className="vocab-example vocab-example-today">
                    <span className="vocab-today-tag">Today's lesson</span>
                    {data.lessonExample}
                  </p>
                )}
                {(data.examples || []).map((ex, i) => (
                  <p key={i} className="vocab-example">{ex}</p>
                ))}
              </div>

              {(data.related || []).length > 0 && (
                <div className="vocab-section">
                  <p className="vocab-section-title">Related words</p>
                  <div className="vocab-related">
                    {data.related.map((r, i) => (
                      <span key={i} className="vocab-related-chip">{r}</span>
                    ))}
                  </div>
                </div>
              )}

              <button
                className={isSaved ? "vocab-save-btn vocab-save-btn-saved" : "vocab-save-btn"}
                onClick={isSaved ? undefined : onSave}
                aria-label={isSaved ? `${word} is already in your Word Bank` : `Save ${word} to Word Bank`}
              >
                {isSaved ? "Saved to Word Bank ✓" : "Save to Word Bank"}
              </button>
            </>
          )}
        </div>
        <button className="vocab-close" onClick={onClose} aria-label="Close vocabulary card">✕</button>
      </div>
    </div>
  );
}

/* ==================== LESSON ENGINE v2 (Blueprint architecture) ====================
   Pipeline: Lesson Planner (AI) -> LessonBlueprint -> validateBlueprint (client)
   -> lazy per-section generation (AI, validated, individually regenerable)
   -> section components rendered from a stage array (no switch statements).

   LessonBlueprint shape (single source of truth; every stage consumes it):
   { communicativeObjective, context, cefr, explanation, warmUpQuestions[],
     vocabulary[8 x {word,pos,meaning,ipa,stress,syllables,example,examples[],related[],collocations[]}],
     grammar {point,meaning,form,usage,examples[]}, pronunciation {focus,tips[]},
     mainSkill "reading"|"listening", mission, learningOutcome }
==================================================================================== */

/* ---------- Voice: TTS + speech input, both optional with graceful fallback ---------- */
function speakText(text) {
  try {
    if (!window.speechSynthesis) return false;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-AU"; u.rate = 0.95;
    const voices = window.speechSynthesis.getVoices();
    const auVoices = voices.filter((v) => v.lang === "en-AU" || v.lang.startsWith("en-AU"));
    if (auVoices.length) u.voice = auVoices[text.length % auVoices.length];
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    return true;
  } catch { return false; }
}
const TTS_OK = typeof window !== "undefined" && !!window.speechSynthesis;

function useVoiceInput(onResult) {
  const recRef = React.useRef(null);
  const [listening, setListening] = useState(false);
  const supported = typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  const start = () => {
    if (!supported || listening) return;
    try {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SR();
      rec.lang = "en-AU"; rec.interimResults = false; rec.maxAlternatives = 1;
      rec.onresult = (e) => onResult(e.results[0][0].transcript);
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);
      recRef.current = rec; setListening(true); rec.start();
    } catch { setListening(false); }
  };
  return { supported, listening, start };
}

function MicButton({ onText }) {
  const { supported, listening, start } = useVoiceInput(onText);
  if (!supported) return null;
  return (
    <button className={"mic-btn" + (listening ? " mic-on" : "")} onClick={start} aria-label="Answer by voice" title="Answer by voice">
      🎤{listening ? " Listening…" : ""}
    </button>
  );
}

/* ---------- Shared stage shell: title, purpose, uniform Skip ---------- */
function SectionShell({ title, blurb, onSkip, children }) {
  return (
    <Card>
      <div className="stage-head">
        <h3>{title}</h3>
        <button className="skip-btn" onClick={onSkip} aria-label={`Skip ${title}`}>Skip →</button>
      </div>
      {blurb && <p className="muted small">{blurb}</p>}
      {children}
    </Card>
  );
}

/* ---------- Exercise self-testing QA (mandatory before presenting to student) ---------- */
// Leo must never present the first version of anything. Before any exercise
// reaches the student, it passes through three checks:
//   1. STUDENT TEST: can this exercise actually be completed?
//   2. TEACHER TEST: is the marking fair and the content appropriate?
//   3. QUALITY TEST: does this genuinely teach something?
/* Grammar alignment: does this exercise actually practise TODAY's structure?
   We build a token set from the point, the form and the examples the student has
   just been shown, then require every question to touch it. Prefix matching
   (5 chars) tolerates the normal inflections — question/questions,
   comparative/comparatives — without needing a stemmer. */
const GRAMMAR_STOPWORDS = new Set([
  // ordinary function words
  "the", "an", "and", "or", "of", "in", "on", "at", "to", "it", "as", "so", "by",
  "this", "that", "these", "those", "with", "there", "here", "just", "very", "also", "any",
  "is", "are", "am", "was", "were", "use", "used", "using",
  // pronouns — they appear in every grammar point ever written, so they discriminate nothing
  "i", "you", "he", "she", "we", "they", "me", "him", "her", "us", "them",
  "my", "your", "his", "its", "our", "their",
  // GRAMMAR METALANGUAGE — the words we use to TALK about any structure. Left in,
  // they let a question about a completely different point "align" simply because
  // it says the word "sentence" or "verb". Removing them means the token set is
  // made of the STRUCTURE ITSELF (could, does, been, than, hoping, since…),
  // which is the only thing worth matching on.
  "sentence", "sentences", "correct", "incorrect", "complete", "completes", "choose",
  "choice", "find", "mistake", "error", "answer", "answers", "option", "options",
  "question", "questions", "word", "words", "order", "form", "forms", "verb", "verbs",
  "noun", "nouns", "subject", "structure", "grammar", "point", "which", "what",
  "please", "thanks", "grammatically",
]);
const _gramWords = (s) => (s || "").toLowerCase().split(/[^a-z']+/).map((w) => w.replace(/'/g, "")).filter((w) => w.length >= 2 && !GRAMMAR_STOPWORDS.has(w));
function grammarAlignmentTokens(bp) {
  const g = (bp && bp.grammar) || {};
  return [...new Set(_gramWords([g.point, g.form, ...(g.examples || [])].join(" ")))];
}
function alignsWithGrammar(text, tokens) {
  const words = new Set(_gramWords(text));
  for (const t of tokens) {
    if (words.has(t)) return true;
    if (t.length >= 5) { const p = t.slice(0, 5); for (const w of words) if (w.startsWith(p)) return true; }
  }
  return false;
}
const sameGrammarPoint = (a, b) => (a || "").trim().toLowerCase().replace(/[^a-z0-9 ]/g, "") === (b || "").trim().toLowerCase().replace(/[^a-z0-9 ]/g, "");

function validateSection(stageId, data, bp) {
  const problems = [];
  if (!data || typeof data !== "object") return ["section data missing"];

  if (stageId === "skill") {
    // Student test: is there a passage to read?
    if (!data.passage || data.passage.length < 30) problems.push("passage too short or missing");
    // Student test: can every question be answered?
    (data.questions || []).forEach((q, i) => {
      if (!q.stem) problems.push(`Q${i+1} has no stem`);
      if (!Array.isArray(q.options) || q.options.length < 3) problems.push(`Q${i+1} has fewer than 3 options`);
      if (!q.options.includes(q.answer)) problems.push(`Q${i+1} answer not in options`);
      if (new Set(q.options).size !== q.options.length) problems.push(`Q${i+1} has duplicate options`);
    });
    // Teacher test: are there enough questions?
    if ((data.questions || []).length < 3) problems.push("fewer than 3 valid questions");
    // Quality test: does the passage use today's vocabulary?
    if (bp && bp.vocabulary) {
      const passageLow = (data.passage || "").toLowerCase();
      const vocabHits = bp.vocabulary.filter(v => passageLow.includes(v.word.toLowerCase())).length;
      if (vocabHits < 2) problems.push("passage uses fewer than 2 of today's vocabulary items");
    }
  }

  if (stageId === "grammar") {
    // ALIGNMENT (the teacher test that matters): the explanation, the examples,
    // the practice, the answers and the feedback must all teach ONE grammar
    // point. A model that quietly drifts to a different structure — or to
    // politeness — produces an exercise that is technically valid and
    // educationally worthless. These two checks catch exactly that.
    if (bp && bp.grammar && bp.grammar.point) {
      // 1. Wholesale drift. The generator MUST declare which point it practised.
      // Requiring the echo (rather than checking it only when present) is what
      // makes this deterministic: a set that quietly practises another structure
      // either declares the wrong point and is caught here, or declares the right
      // point and is caught by the per-question check below.
      if (!data.grammarPoint) problems.push("grammar exercise did not declare its grammar point");
      else if (!sameGrammarPoint(data.grammarPoint, bp.grammar.point))
        problems.push(`grammar point drifted: taught "${bp.grammar.point}" but practised "${data.grammarPoint}"`);
      // 2. Per-question drift: each question must visibly touch today's structure.
      const tokens = grammarAlignmentTokens(bp);
      (data.questions || []).forEach((q, i) => {
        const hay = [q.stem, ...(q.options || []), q.note].join(" ");
        if (tokens.length && !alignsWithGrammar(hay, tokens))
          problems.push(`Q${i+1} does not practise today's grammar point`);
      });
    }
    (data.questions || []).forEach((q, i) => {
      if (!q.stem) problems.push(`Q${i+1} has no stem`);
      if (!Array.isArray(q.options) || q.options.length < 3) problems.push(`Q${i+1} fewer than 3 options`);
      if (!q.options.includes(q.answer)) problems.push(`Q${i+1} answer not in options`);
      if (new Set(q.options).size !== q.options.length) problems.push(`Q${i+1} duplicate options`);
      if (!q.note) problems.push(`Q${i+1} has no teaching note`);
      // Function, not form: "which sounds nicer" is not a grammar question.
      const stemLow = (q.stem || "").toLowerCase();
      if (stemLow.includes("most polite") || stemLow.includes("sounds nicer") || stemLow.includes("more polite"))
        problems.push(`Q${i+1} tests politeness not grammar`);
    });
    if ((data.questions || []).length < 3) problems.push("fewer than 3 valid grammar questions");
  }

  if (stageId === "summary") {
    ["praise", "summary", "strength", "improvement"].forEach(k => {
      if (!data[k]) problems.push(`${k} missing from summary`);
    });
    // Quality test: is the praise specific (not generic)?
    if (data.praise && /^(well done|good job|great work|nice work)\.?$/i.test(data.praise.trim()))
      problems.push("praise is generic — must be specific");
  }

  return problems;
}

/* ---------- Shared completion feedback (used by every scored activity) ----------
   Educational reasoning: completing an activity should produce a moment of
   recognised success (Self-Determination Theory — competence), but praise must
   be proportionate and adult. The message scales with performance, celebrates
   briefly, then carries the student onward so momentum is never broken.
   Technical reasoning: ONE component owns the animation, the message ladder and
   the auto-advance timer, so every stage behaves identically and there is no
   duplicated celebration logic. The timer is always escapable via the button,
   and is cleared on unmount so a Skip mid-celebration cannot double-advance. */
function completionMessage(correct, total) {
  if (typeof correct !== "number" || !total) return { title: "Nice work!", sub: "That's another step forward." };
  const ratio = correct / total;
  if (ratio >= 0.9) return { title: "Outstanding!", sub: `${correct} out of ${total} — you've really got this.` };
  if (ratio >= 0.7) return { title: "Excellent!", sub: `${correct} out of ${total} — strong work.` };
  if (ratio >= 0.5) return { title: "Well done!", sub: `${correct} out of ${total} — you're getting there.` };
  return { title: "Great effort!", sub: `${correct} out of ${total} — the ones you missed will come back for more practice.` };
}

function StageComplete({ correct, total, message, onContinue, delay = 2200 }) {
  const msg = message || completionMessage(correct, total);
  useEffect(() => {
    const t = setTimeout(() => onContinue(), delay);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="stage-complete" role="status" aria-live="polite">
      <div className="sc-tick" aria-hidden="true">
        <svg viewBox="0 0 52 52" width="56" height="56">
          <circle className="sc-tick-ring" cx="26" cy="26" r="23" fill="none" strokeWidth="2.5" />
          <path className="sc-tick-mark" fill="none" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" d="M15 27 l7.5 7.5 L38 19" />
        </svg>
      </div>
      <h4 className="sc-title">{msg.title}</h4>
      <p className="sc-sub">{msg.sub}</p>
      <div className="sc-bar" aria-hidden="true"><span style={{ animationDuration: delay + "ms" }} /></div>
      <button className="primary-btn" onClick={onContinue}>Continue</button>
    </div>
  );
}

/* ---------- Reusable MCQ block (used by Reading/Listening and Grammar) ---------- */
// Content-derived seed: stable across re-renders, different across activities.
function textSeed(str) {
  let s = 7919;
  for (const ch of String(str || "")) s = (s * 31 + ch.charCodeAt(0)) & 0x7fffffff;
  return s;
}

function shuffleOptions(options, seed) {
  const arr = [...options];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function McqQuiz({ questions, vocab, onVocabTap, onDone }) {
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [correct, setCorrect] = useState(0);
  const q = questions[idx];
  // Randomise option order so the correct answer is not always first
  const [shuffledOpts] = useState(() => questions.map((qu, i) => shuffleOptions(qu.options, i * 7919 + qu.stem.length)));
  const [finished, setFinished] = useState(false);
  const pick = (opt) => { if (chosen) return; setChosen(opt); if (opt === q.answer) setCorrect((c) => c + 1); };
  const next = () => {
    if (idx + 1 < questions.length) { setIdx(idx + 1); setChosen(null); }
    else setFinished(true);
  };
  // Completion feedback lives in ONE place for every MCQ-based stage.
  if (finished) return <StageComplete correct={correct} total={questions.length} onContinue={() => onDone(correct, questions.length)} />;
  return (
    <div>
      <div className="quiz-progress" aria-hidden="true"><span style={{ width: `${(idx / questions.length) * 100}%` }} /></div>
      <p className="muted small">Question {idx + 1} of {questions.length}</p>
      <p className="q-sentence"><VocabText text={q.stem} vocab={vocab} onTap={onVocabTap} /></p>
      <div className="mcq-opts">
        {(shuffledOpts[idx] || q.options).map((opt, i) => (
          <button key={i}
            className={"mcq-opt" + (chosen ? (opt === q.answer ? " mcq-right" : opt === chosen ? " mcq-wrong" : "") : "")}
            onClick={() => pick(opt)} disabled={!!chosen}>{opt}</button>
        ))}
      </div>
      {chosen && (
        <div>
          <LeoFeedback ok={chosen === q.answer}>{q.note}</LeoFeedback>
          <button className="primary-btn" onClick={next}>{idx + 1 < questions.length ? "Next question" : "Continue"}</button>
        </div>
      )}
    </div>
  );
}

/* ==================== WARM-UP ACTIVITY SYSTEM ====================
   Educational reasoning: a warm-up exists to ACTIVATE — to switch the student
   into English, surface what they already know, and prime the exact language
   the lesson will teach. A single format repeated every day stops activating
   and starts boring; variety keeps the affective filter low and the noticing
   high. Every activity below is a recognised ELICOS warm-up type, and every one
   must be contextualised to today's scenario — a generic warm-up teaches nobody.

   Technical reasoning: twelve activity types would mean twelve components and
   twelve validators. Instead each type declares a FAMILY, and there are exactly
   three renderers (free / choice / sequence). Adding a thirteenth type is a
   one-line registry entry, not new UI. Validation is shared per family, so a
   malformed activity can never reach the student — it is filtered out, and if
   too few survive, the lesson falls back to discussion questions rather than
   breaking.
   ================================================================ */
const WARMUP_TYPES = {
  context_discussion: { family: "free",     label: "Talk about it" },
  prediction:         { family: "free",     label: "What do you think?" },
  finish_sentence:    { family: "free",     label: "Finish the sentence" },
  mini_task:          { family: "free",     label: "Mini task" },
  mcq:                { family: "choice",   label: "Choose the answer" },
  best_response:      { family: "choice",   label: "Choose the best response" },
  true_false:         { family: "choice",   label: "True or false?" },
  is_this_correct:    { family: "choice",   label: "Is this correct?" },
  spot_mistake:       { family: "choice",   label: "Spot the mistake" },
  complete_dialogue:  { family: "choice",   label: "Complete the dialogue" },
  unscramble:         { family: "sequence", label: "Unscramble the sentence" },
  order_conversation: { family: "sequence", label: "Order the conversation" },
};
const warmUpFamily = (t) => (WARMUP_TYPES[t] ? WARMUP_TYPES[t].family : null);

/* One activity is valid only if it can actually be COMPLETED and MARKED. */
function validateWarmUpActivity(a) {
  if (!a || typeof a !== "object") return false;
  const fam = warmUpFamily(a.type);
  if (!fam) return false;
  if (!a.prompt || typeof a.prompt !== "string") return false;
  if (fam === "free") return true;
  if (fam === "choice") {
    if (!Array.isArray(a.options) || a.options.length < 2) return false;
    if (new Set(a.options).size !== a.options.length) return false;
    if (!a.options.includes(a.answer)) return false;
    return !!a.note;
  }
  // sequence: tokens are the CORRECT order; the student rebuilds it
  if (!Array.isArray(a.tokens) || a.tokens.length < 3 || a.tokens.length > 12) return false;
  if (a.tokens.some((t) => !t || typeof t !== "string")) return false;
  return !!a.note;
}
function validateWarmUp(activities) {
  return (Array.isArray(activities) ? activities : []).filter(validateWarmUpActivity).slice(0, 5);
}
/* Backstop: if the planner gives us nothing usable, today's warm-up is still a
   real warm-up — the blueprint's discussion questions, in the original format. */
function warmUpFallback(bp) {
  return (bp.warmUpQuestions || []).slice(0, 4).map((q) => ({
    type: "context_discussion",
    instruction: "Just chat — there are no wrong answers here.",
    prompt: q,
  }));
}

/* ---------- Renderer 1: FREE — communicative, never string-matched ---------- */
function WarmUpFree({ activity, vocab, onVocabTap, onDone, context }) {
  const [answer, setAnswer] = useState("");
  const [sent, setSent] = useState(false);
  const [reply, setReply] = useState(null);      // { category, line }
  const settledRef = React.useRef(false);        // first result wins; the other is discarded
  const timerRef = React.useRef(null);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  /* Whichever arrives first settles the turn. Without this a response landing
     after the timeout would swap the fallback out from under the student
     mid-read. */
  const settle = (result, failureReason) => {
    if (settledRef.current) return;
    settledRef.current = true;
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (failureReason) console.warn("[warmup_free_response] fallback used:", failureReason);
    setReply(result);
  };

  const submit = async () => {
    const a = answer.trim();
    if (!a || sent) return;
    setSent(true);
    timerRef.current = setTimeout(
      () => settle({ category: "attempt", line: WARMUP_FALLBACK_LINE }, "timeout after 5000ms"), 5000);
    try {
      // Leo's voice, delivered by Lessons 22 July. The JSON shape is unchanged,
      // so the existing parsing, category clamp, timeout and fallback all keep
      // working. The mock reads "Context:" out of this prompt to select today's
      // pack — do not reorder or rename that field.
      const raw = await askClaude(
        `You are Leo, an experienced Australian ELICOS teacher, replying to your student's warm-up answer. A warm-up has one job: switch the student into English and make them feel ready. Never correct grammar, spelling or pronunciation here.

Activity prompt: "${activity.prompt}"
Today's lesson context: "${context || ""}"
The student typed: "${a}"

First, classify the answer:
- "skip": no real effort — a single character, repeated characters, punctuation only, or meaningless letters.
- "minimal": a real answer, but only one or two words, or a short phrase with no detail.
- "attempt": real communicative content — the student actually said something.

Then write ONE reply line, maximum 35 words, B1 English, warm Australian teacher's voice:
- skip: reply with exactly this and nothing more: No problem — let's move on.
- minimal: acknowledge the short answer warmly, connect it to today's lesson context, and ask ONE follow-up question that is EASIER than the original prompt (a choice question or yes/no question works well).
- attempt: respond to something SPECIFIC the student said — name it in your reply — then connect it to today's lesson.

The generic-praise test: if your line would make equal sense no matter what the student typed, rewrite it. Never invent details the student did not give you. Never praise a skip.

Respond ONLY with JSON, no fences: {"category":"skip|minimal|attempt","line":"your one reply line"}`,
        { intent: "warmup_free_response" }
      );
      const d = parseJSON(raw);
      if (!d || !d.line) throw new Error("invalid response shape");
      const cat = d.category === "skip" || d.category === "minimal" ? d.category : "attempt";
      settle({ category: cat, line: d.line });
    } catch (err) {
      settle({ category: "attempt", line: WARMUP_FALLBACK_LINE }, (err && err.message) || "unknown error");
    }
  };

  return (
    <div>
      <p className="q-sentence"><VocabText text={activity.prompt} vocab={vocab} onTap={onVocabTap} /></p>
      <div className="input-row">
        <input className="text-input" placeholder="Type your answer, or use the mic…" value={answer} disabled={sent}
          onChange={(e) => setAnswer(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
        <MicButton onText={(t) => setAnswer(t)} />
      </div>
      {!sent && <button className="primary-btn" onClick={submit} disabled={!answer.trim()}>Send</button>}

      {/* A typing indicator, deliberately not a spinner: a spinner says the
          system is loading, this says someone is reading your words. */}
      {sent && !reply && (
        <WaitIndicator label="Leo is reading" />
      )}

      {reply && (
        <div>
          {/* skip gets no tick — a student who typed nothing is not congratulated.
              minimal and attempt are visually identical, so the student cannot
              read their grade off the interface; only Leo's words differ. */}
          {reply.category === "skip"
            ? <p className="text-leo wu-skip-line">{reply.line}</p>
            : <LeoFeedback ok>{reply.line}</LeoFeedback>}
          <button className="primary-btn" onClick={() => onDone(reply.category !== "skip")}>Next</button>
        </div>
      )}
    </div>
  );
}

/* ---------- Renderer 2: CHOICE — marked, with a teaching note either way ---------- */
function WarmUpChoice({ activity, vocab, onVocabTap, onDone }) {
  const [chosen, setChosen] = useState(null);
  const [opts] = useState(() => shuffleOptions(activity.options, textSeed(activity.prompt + activity.answer)));
  const ok = chosen === activity.answer;
  return (
    <div>
      <p className="q-sentence"><VocabText text={activity.prompt} vocab={vocab} onTap={onVocabTap} /></p>
      {activity.text && <p className="wu-text">{activity.text}</p>}
      <div className="mcq-opts">
        {opts.map((o, i) => (
          <button key={i} disabled={!!chosen} onClick={() => setChosen(o)}
            className={"mcq-opt" + (chosen ? (o === activity.answer ? " mcq-right" : o === chosen ? " mcq-wrong" : "") : "")}>{o}</button>
        ))}
      </div>
      {chosen && (
        <div>
          <LeoFeedback ok={ok}>{activity.note}</LeoFeedback>
          <button className="primary-btn" onClick={() => onDone(ok)}>Next</button>
        </div>
      )}
    </div>
  );
}

/* ---------- Renderer 3: SEQUENCE — rebuild the correct order ---------- */
function WarmUpSequence({ activity, onDone }) {
  const correct = activity.tokens;
  // A shuffle that happens to return the correct order would hand the student the
  // answer, so it is rejected and nudged. Seeded from the content, not the length,
  // so two 8-word sentences don't scramble identically.
  const [pool] = useState(() => {
    let arr = shuffleOptions(correct.map((t, i) => ({ t, i })), textSeed(correct.join(" ")));
    if (correct.length > 2 && arr.map((a) => a.t).join("|") === correct.join("|")) arr = [arr[1], arr[0], ...arr.slice(2)];
    return arr;
  });
  const [built, setBuilt] = useState([]);   // [{t,i}]
  const [checked, setChecked] = useState(null); // null | true | false
  const isLine = activity.type === "order_conversation";
  const used = new Set(built.map((b) => b.i));
  const check = () => setChecked(built.map((b) => b.t).join("|") === correct.join("|"));
  const reset = () => { setBuilt([]); setChecked(null); };
  return (
    <div>
      <p className="q-sentence">{activity.prompt}</p>
      <div className={"wu-build" + (isLine ? " wu-build-lines" : "")} aria-live="polite">
        {built.length === 0 && <span className="wu-build-empty">Tap the {isLine ? "lines" : "words"} below in the right order…</span>}
        {built.map((b, i) => (
          <button key={i} className="wu-chip wu-chip-built" disabled={checked !== null}
            onClick={() => setBuilt(built.filter((_, j) => j !== i))} aria-label={`Remove ${b.t}`}>{b.t}</button>
        ))}
      </div>
      <div className={"wu-pool" + (isLine ? " wu-build-lines" : "")}>
        {pool.filter((p) => !used.has(p.i)).map((p) => (
          <button key={p.i} className="wu-chip" disabled={checked !== null} onClick={() => setBuilt([...built, p])}>{p.t}</button>
        ))}
      </div>
      {checked === null ? (
        <div className="btn-row">
          <button className="primary-btn" onClick={check} disabled={built.length !== correct.length}>Check</button>
          {built.length > 0 && <button className="ghost-btn" onClick={reset}>Start again</button>}
        </div>
      ) : (
        <div>
          <LeoFeedback ok={checked}>
            {checked ? activity.note : `Not quite — the natural order is: “${correct.join(isLine ? " / " : " ")}”. ${activity.note}`}
          </LeoFeedback>
          <button className="primary-btn" onClick={() => onDone(checked)}>Next</button>
        </div>
      )}
    </div>
  );
}

function WarmUpActivity({ activity, vocab, onVocabTap, onDone, context }) {
  const fam = warmUpFamily(activity.type);
  if (fam === "choice") return <WarmUpChoice activity={activity} vocab={vocab} onVocabTap={onVocabTap} onDone={onDone} />;
  if (fam === "sequence") return <WarmUpSequence activity={activity} onDone={onDone} />;
  return <WarmUpFree activity={activity} vocab={vocab} onVocabTap={onVocabTap} onDone={onDone} context={context} />;
}

/* ---------- Stage 1: Introduction — context, objective, varied warm-up ---------- */
function IntroductionSection({ bp, vocab, onVocabTap, onSkip, onDone }) {
  const [idx, setIdx] = useState(-1); // -1 = the intro card
  const [score, setScore] = useState({ ok: 0, done: 0 });
  const [finished, setFinished] = useState(false);
  // The planner's activities, filtered by validation; discussion questions if none survive.
  const [activities] = useState(() => {
    const valid = validateWarmUp(bp.warmUpActivities);
    return valid.length >= 2 ? valid : warmUpFallback(bp);
  });

  const complete = (wasOk) => {
    const next = { ok: score.ok + (wasOk ? 1 : 0), done: score.done + 1 };
    setScore(next);
    if (idx + 1 < activities.length) setIdx(idx + 1);
    else setFinished(true);
  };

  if (finished) return (
    <SectionShell title="Warm-up" onSkip={onSkip}>
      <StageComplete message={{ title: "Warmed up!", sub: "You're switched into English — now let's build today's language." }}
        onContinue={() => onDone(score.done)} />
    </SectionShell>
  );

  if (idx === -1) return (
    <SectionShell title="Today's lesson" onSkip={onSkip}>
      <div className="lesson-head leo-accent"><p className="lesson-greeting text-leo"><VocabText text={bp.explanation} vocab={vocab} onTap={onVocabTap} /></p></div>
      <p className="lesson-why"><strong>Today:</strong> {bp.context}</p>
      <p className="lesson-goal">🎯 <VocabText text={bp.communicativeObjective} vocab={vocab} onTap={onVocabTap} /></p>
      <button className="primary-btn wide" style={{ marginTop: 6 }} onClick={() => setIdx(0)}>Let's warm up</button>
    </SectionShell>
  );

  const a = activities[idx];
  const meta = WARMUP_TYPES[a.type] || WARMUP_TYPES.context_discussion;
  return (
    <SectionShell title="Warm-up" blurb={a.instruction} onSkip={onSkip}>
      <div className="wu-head">
        <span className="wu-badge">{meta.label}</span>
        <span className="muted small">{idx + 1} of {activities.length}</span>
      </div>
      <WarmUpActivity key={idx} activity={a} vocab={vocab} onVocabTap={onVocabTap} onDone={complete} context={bp.context} />
    </SectionShell>
  );
}

/* ==================== REUSABLE LEARNING PRIMITIVES ====================
   Generic, exercise-type components used across multiple lesson stages.
   Each primitive renders one interaction, calls onDone when complete,
   and never knows which stage or lesson type it belongs to.
   ==================================================================== */

/* ---------- GapFillInput: a text-input exercise with answer checking ----------
   Renders a stem containing a blank (______), a text input, and a check button.
   Compares the student's answer (case-insensitive, trimmed) against one or more
   valid answers. Shows LeoFeedback on submission.

   Designed for reuse across: vocabulary complete-the-sentences, listening gap-fill,
   dictation, spelling, grammar gap-fill, translation exercises.
   ----------------------------------------------------------------------------- */
function GapFillInput({ stem, answers, note, placeholder, onDone }) {
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(null); // null | true | false
  const validAnswers = Array.isArray(answers) ? answers : [answers];
  const isCorrect = (text) => validAnswers.some((a) => a.trim().toLowerCase() === text.trim().toLowerCase());
  const check = () => {
    if (!input.trim() || checked !== null) return;
    const ok = isCorrect(input);
    setChecked(ok);
    if (onDone) onDone(ok);
  };
  const displayStem = (stem || "").replace(/_{2,}/g, "______");
  return (
    <div className="gapfill-item">
      <p className="q-sentence">{displayStem}</p>
      <div className="input-row">
        <input className="text-input" placeholder={placeholder || "Type the missing word…"} value={input}
          disabled={checked !== null} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check()} />
        {checked === null && <button className="primary-btn" onClick={check} disabled={!input.trim()}>Check</button>}
      </div>
      {checked !== null && (
        <LeoFeedback ok={checked}>
          {checked
            ? (note || "That's right — well done!")
            : `The answer is \u201c${validAnswers[0]}\u201d. ${note || ""}`}
        </LeoFeedback>
      )}
    </div>
  );
}

/* ---------- VocabReviewExercise: odd-one-out then complete-the-sentences ----------
   Internal sub-component used by VocabularySection when bp.vocabReviewExercises
   exists. Sequences two exercise types, tracks combined score, calls onDone.
   ----------------------------------------------------------------------------- */
function VocabReviewExercise({ exercises, vocab, onVocabTap, onDone }) {
  const [phase, setPhase] = useState("ooo"); // "ooo" | "gapfill" | "done"
  const [oooScore, setOooScore] = useState({ correct: 0, total: 0 });
  const [gfIdx, setGfIdx] = useState(0);
  const [gfCorrect, setGfCorrect] = useState(0);
  const [gfChecked, setGfChecked] = useState(false);

  const ooo = exercises.oddOneOut || [];
  const gapfill = exercises.completeSentences || [];
  const hasOoo = ooo.length > 0;
  const hasGf = gapfill.length > 0;

  // Convert odd-one-out to McqQuiz format
  const oooQuestions = React.useMemo(() => ooo.map((q) => ({
    stem: "Which word does not belong in this group?",
    options: q.options,
    answer: q.answer,
    note: q.note || "That's the odd one out.",
  })), []);

  if (phase === "ooo" && hasOoo) {
    return (
      <div>
        <h4 className="diary-label">Odd one out</h4>
        <p className="muted small">Which word does not belong?</p>
        <McqQuiz questions={oooQuestions} vocab={vocab} onVocabTap={onVocabTap}
          onDone={(correct, total) => {
            setOooScore({ correct, total });
            if (hasGf) setPhase("gapfill");
            else setPhase("done");
          }} />
      </div>
    );
  }

  if (phase === "gapfill" && hasGf) {
    const q = gapfill[gfIdx];
    return (
      <div>
        <h4 className="diary-label">Complete the sentences</h4>
        <p className="muted small">Use the vocabulary from today's lesson. Question {gfIdx + 1} of {gapfill.length}.</p>
        <GapFillInput
          key={gfIdx}
          stem={q.stem}
          answers={q.answer}
          note={q.note}
          onDone={(ok) => {
            if (ok) setGfCorrect((c) => c + 1);
            setGfChecked(true);
            setTimeout(() => {
              setGfChecked(false);
              if (gfIdx + 1 < gapfill.length) setGfIdx(gfIdx + 1);
              else setPhase("done");
            }, 1800);
          }}
        />
      </div>
    );
  }

  // phase === "done" or skipped phases
  if (phase === "ooo" && !hasOoo && hasGf) { setPhase("gapfill"); return null; }
  if (phase === "ooo" && !hasOoo && !hasGf) { setPhase("done"); return null; }

  const totalCorrect = oooScore.correct + gfCorrect;
  const totalQuestions = oooScore.total + gapfill.length;
  return (
    <StageComplete correct={totalCorrect} total={totalQuestions}
      message={{ title: "Vocabulary reviewed!", sub: `${totalCorrect} out of ${totalQuestions} — those words are getting stronger.` }}
      onContinue={() => onDone(totalCorrect, totalQuestions)} />
  );
}

/* ---------- Stage 2: Vocabulary — match words to meanings ----------
   Interaction is UNCHANGED: drag a line from a word to its meaning. What is new
   is the finish — spacing, depth, motion, state feedback — plus a tap/keyboard
   path to the SAME matching model, because a drag-only exercise is unusable for
   a student with a motor impairment or a screen reader, and Leo teaches everyone.
   A short press with no movement selects a word; tapping a meaning then matches
   it. Keyboard users get the identical two-step via Enter/Space. */
function VocabularySection({ bp, onVocabTap, leoMemory, onSkip, onDone }) {
  // Authored lessons declare matchVocab (a curated subset of up to 8 words for
  // the matching exercise). AI-generated lessons use the first 8 from vocabulary.
  // The full vocabulary array is always available for tokens, cards, and review.
  const items = React.useMemo(() => {
    if (bp.matchVocab && bp.matchVocab.length) {
      const all = bp.vocabulary || [];
      // matchVocab can be word strings or indices — resolve to vocabulary objects
      return bp.matchVocab.map((ref) =>
        typeof ref === "number" ? all[ref] : all.find((v) => v.word.toLowerCase() === ref.toLowerCase())
      ).filter(Boolean).slice(0, 8);
    }
    return (bp.vocabulary || []).slice(0, 8);
  }, [bp]);
  // Stable shuffle of definitions — seeded from today's context so it never
  // re-shuffles on re-render, but DOES differ between lessons.
  const [defs] = useState(() => {
    const arr = [...items];
    let s = 7919;
    for (const ch of (bp.context || "")) s = (s * 31 + ch.charCodeAt(0)) & 0x7fffffff;
    for (let i = arr.length - 1; i > 0; i--) { s = (s * 1103515245 + 12345) & 0x7fffffff; const j = s % (i + 1); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  });
  const [matched, setMatched] = useState({});      // word -> defIndex (0 is valid!)
  const [missed, setMissed] = useState({});        // word -> true (had a wrong attempt)
  const [selected, setSelected] = useState(null);  // word chosen by tap/keyboard
  const [done, setDone] = useState(false);
  const [vocabPhase, setVocabPhase] = useState("matching"); // "matching" | "review"
  const [matchScore, setMatchScore] = useState({ correct: 0, total: 0 });
  const hasReview = !!(bp.vocabReviewExercises && (bp.vocabReviewExercises.oddOneOut || bp.vocabReviewExercises.completeSentences));
  const [dragState, setDragState] = useState(null);
  const [lines, setLines] = useState([]);
  const [wrongFlash, setWrongFlash] = useState(null);
  const [justMatched, setJustMatched] = useState(null); // word -> plays the pop animation
  const gridRef = React.useRef(null);
  const wordRefs = React.useRef({});
  const defRefs = React.useRef({});
  // The drag is held in a REF as well as in state. State drives the rendered
  // line; the ref is what the logic reads, so a pointerdown/pointerup pair that
  // lands inside a single React batch can never lose the gesture.
  const dragRef = React.useRef(null);

  const getPos = (el, side) => {
    if (!el || !gridRef.current) return { x: 0, y: 0 };
    const grid = gridRef.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: side === "right" ? r.right - grid.left : r.left - grid.left, y: r.top + r.height / 2 - grid.top };
  };

  const hitTestDef = (clientX, clientY) => {
    for (let i = 0; i < defs.length; i++) {
      const el = defRefs.current[i];
      // NB: matched[] stores a definition INDEX — 0 is a valid, falsy match.
      if (!el || matched[defs[i].word] !== undefined) continue;
      const r = el.getBoundingClientRect();
      if (clientX >= r.left - 8 && clientX <= r.right + 8 && clientY >= r.top - 8 && clientY <= r.bottom + 8) return i;
    }
    return -1;
  };

  /* The ONE matching rule — drag, tap and keyboard all come through here. */
  const attemptMatch = (word, wordIdx, defIdx) => {
    if (defIdx < 0 || matched[word] !== undefined) return;
    if (defs[defIdx].word === word) {
      const nextMatched = { ...matched, [word]: defIdx };
      setMatched(nextMatched);
      setLines((prev) => [...prev, { word, wordIdx, defIdx }]);
      setJustMatched(word);
      setTimeout(() => setJustMatched((w) => (w === word ? null : w)), 500);
      leoMemory.practiceWord(word, !missed[word]);
      setSelected(null);
      if (Object.keys(nextMatched).length === items.length) setDone(true);
    } else {
      setMissed((m) => ({ ...m, [word]: true }));
      setWrongFlash({ wordIdx, defIdx });
      setTimeout(() => setWrongFlash(null), 600);
      setSelected(null);
    }
  };

  const startDrag = (word, wordIdx, e) => {
    if (matched[word] !== undefined) return; // 0 is a valid definition index
    e.preventDefault();
    const grid = gridRef.current.getBoundingClientRect();
    const d = { word, wordIdx, x: e.clientX - grid.left, y: e.clientY - grid.top, sx: e.clientX, sy: e.clientY };
    dragRef.current = d;
    setDragState(d);
  };
  const moveDrag = (e) => {
    if (!dragRef.current || !gridRef.current) return;
    e.preventDefault();
    const grid = gridRef.current.getBoundingClientRect();
    setDragState((prev) => (prev ? { ...prev, x: e.clientX - grid.left, y: e.clientY - grid.top } : null));
  };
  const endDrag = (e) => {
    const d = dragRef.current;
    if (!d) return;
    dragRef.current = null;
    const moved = Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > 6;
    if (!moved) {
      // A press with no movement is a TAP: select the word, then tap a meaning.
      setSelected((s) => (s === d.word ? null : d.word));
    } else {
      attemptMatch(d.word, d.wordIdx, hitTestDef(e.clientX, e.clientY));
    }
    setDragState(null);
  };

  const reveal = () => {
    const newMatched = {}; const newLines = []; const newMissed = { ...missed };
    items.forEach((it, wi) => {
      if (matched[it.word] === undefined) {
        leoMemory.practiceWord(it.word, false);
        // A revealed word was NOT known. It must not be scored as if it were:
        // false praise is worse than no praise, and it would quietly tell the
        // learner model this word is safe when it is the one needing most work.
        newMissed[it.word] = true;
      }
      const di = defs.findIndex((d) => d.word === it.word);
      newMatched[it.word] = di;
      newLines.push({ word: it.word, wordIdx: wi, defIdx: di });
    });
    setMatched(newMatched); setMissed(newMissed); setLines(newLines); setSelected(null); setDone(true);
  };

  const correct = items.filter((it) => matched[it.word] !== undefined && !missed[it.word]).length;
  const remaining = items.length - Object.keys(matched).length;

  const svgLines = lines.map((l) => {
    const from = getPos(wordRefs.current[l.wordIdx], "right");
    const to = getPos(defRefs.current[l.defIdx], "left");
    return { ...l, x1: from.x, y1: from.y, x2: to.x, y2: to.y };
  });
  const dragLine = dragState ? (() => {
    const from = getPos(wordRefs.current[dragState.wordIdx], "right");
    return { x1: from.x, y1: from.y, x2: dragState.x, y2: dragState.y };
  })() : null;
  const wrongLine = wrongFlash ? (() => {
    const from = getPos(wordRefs.current[wrongFlash.wordIdx], "right");
    const to = getPos(defRefs.current[wrongFlash.defIdx], "left");
    return { x1: from.x, y1: from.y, x2: to.x, y2: to.y };
  })() : null;

  // Vocabulary review phase: after matching, if review exercises exist, render them
  if (done && vocabPhase === "review" && hasReview) return (
    <SectionShell title="Vocabulary review" blurb="Let's check those words have stuck." onSkip={onSkip}>
      <VocabReviewExercise
        exercises={bp.vocabReviewExercises}
        vocab={(bp.vocabulary || []).map((v) => v.word)}
        onVocabTap={onVocabTap}
        onDone={(revCorrect, revTotal) => {
          const totalCorrect = matchScore.correct + revCorrect;
          const totalQuestions = matchScore.total + revTotal;
          onDone(totalCorrect, totalQuestions);
        }}
      />
    </SectionShell>
  );

  if (done) return (
    <SectionShell title="Today's vocabulary" onSkip={onSkip}>
      <StageComplete correct={correct} total={items.length}
        onContinue={() => {
          if (hasReview) {
            setMatchScore({ correct, total: items.length });
            setVocabPhase("review");
          } else {
            onDone(correct, items.length);
          }
        }} />
    </SectionShell>
  );

  return (
    <SectionShell title="Today's vocabulary"
      blurb={selected ? `“${selected}” is selected — now choose its meaning.` : "Drag a line from each word to its meaning — or tap a word, then tap its meaning."}
      onSkip={onSkip}>
      <div className="match-progress" aria-live="polite">
        <div className="match-progress-bar"><span style={{ width: `${(Object.keys(matched).length / items.length) * 100}%` }} /></div>
        <span className="muted small">{remaining} to go</span>
      </div>

      {/* Pointer Events cover mouse, touch and stylus on every supported browser
          (touchAction:none stops the page scrolling mid-drag). Do NOT add parallel
          onTouch* handlers: they double-fire alongside pointer events, and a Touch
          object has no preventDefault, which crashes on mobile. */}
      <div className="match-grid" ref={gridRef} style={{ position: "relative", touchAction: "none" }}
        onPointerMove={moveDrag} onPointerUp={endDrag} onPointerLeave={endDrag}>
        <svg className="match-lines" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 3 }}>
          {svgLines.map((l, i) => (
            <line key={"m" + i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="var(--euca)" strokeWidth="2.5" strokeLinecap="round" opacity="0.75">
              <animate attributeName="opacity" from="0" to="0.75" dur="0.3s" fill="freeze" />
            </line>
          ))}
          {dragLine && <line x1={dragLine.x1} y1={dragLine.y1} x2={dragLine.x2} y2={dragLine.y2} stroke="var(--wattle)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 5" opacity="0.9" />}
          {wrongLine && (
            <line x1={wrongLine.x1} y1={wrongLine.y1} x2={wrongLine.x2} y2={wrongLine.y2} stroke="var(--rust)" strokeWidth="2.5" strokeLinecap="round" opacity="0.75">
              <animate attributeName="opacity" from="0.75" to="0" dur="0.5s" fill="freeze" />
            </line>
          )}
        </svg>

        <div className="match-col" style={{ position: "relative", zIndex: 2 }}>
          {items.map((it, i) => {
            const isMatched = matched[it.word] !== undefined;
            return (
              <button key={it.word} type="button" ref={(el) => (wordRefs.current[i] = el)}
                className={"match-word"
                  + (isMatched ? " match-done" : "")
                  + (justMatched === it.word ? " match-pop" : "")
                  + (selected === it.word ? " match-selected" : "")
                  + (dragState && dragState.word === it.word ? " match-dragging" : "")}
                disabled={isMatched}
                aria-pressed={selected === it.word}
                aria-label={isMatched ? `${it.word}, matched` : `${it.word}, select then choose its meaning`}
                onPointerDown={(e) => startDrag(it.word, i, e)}
                onClick={(e) => { if (e.detail === 0 && !isMatched) setSelected((s) => (s === it.word ? null : it.word)); }}>
                {it.word}
              </button>
            );
          })}
        </div>

        <div className="match-col" style={{ position: "relative", zIndex: 2 }}>
          {defs.map((it, i) => {
            const isMatched = matched[it.word] !== undefined;
            return (
              <button key={i} type="button" ref={(el) => (defRefs.current[i] = el)}
                className={"match-meaning" + (isMatched ? " match-done" : "") + (selected && !isMatched ? " match-target" : "")}
                disabled={isMatched}
                aria-label={isMatched ? `Meaning matched: ${it.meaning}` : selected ? `Match “${selected}” to: ${it.meaning}` : it.meaning}
                onClick={() => { if (selected) attemptMatch(selected, items.findIndex((x) => x.word === selected), i); }}>
                {it.meaning}
              </button>
            );
          })}
        </div>
      </div>

      <button className="ghost-btn" onClick={reveal}>Show the answers</button>
    </SectionShell>
  );
}

/* ---------- Stage 3: Pronunciation — model, listen, try ---------- */
function PronunciationSection({ bp, onVocabTap, onSkip, onDone }) {
  // Capability: show full vocabulary table when focus sections exist, otherwise 3
  const items = (bp.vocabulary || []).length > 3 && bp.pronunciation && bp.pronunciation.focusSections
    ? (bp.vocabulary || []) : (bp.vocabulary || []).slice(0, 3);
  const focusSections = bp.pronunciation && bp.pronunciation.focusSections;
  const [heard, setHeard] = useState("");
  const [done, setDone] = useState(false);
  const [showTable, setShowTable] = useState(!focusSections);
  if (done) return (
    <SectionShell title="Say it like a local" onSkip={onSkip}>
      {/* Part B rev 2. The microphone is optional and `done` is set by the
          Continue button, so the old line asserted an act never observed.
          `heard` is a SINGLE STRING holding the most recent transcript — it is
          evidence that speech was captured and nothing more. It carries no
          count, so no copy here may quantify the speaking.
          NOTE: a different `heard` exists elsewhere in the file as an array.
          This is not that one. */}
      <StageComplete message={
        heard
          ? { title: "You had a go out loud.",
              sub: "That's the part that actually changes pronunciation. Keep going with the rest of today's words — out loud, even quietly, wherever you are." }
          : { title: "That's the sounds covered.",
              sub: "You've seen how these words are built. Pronunciation only changes once the words leave your mouth — say three of them out loud before today's over." }
      } onContinue={onDone} />
    </SectionShell>
  );
  return (
    <SectionShell title="Say it like a local" blurb={bp.pronunciation && bp.pronunciation.focus ? `Today's focus: ${bp.pronunciation.focus}.` : undefined} onSkip={onSkip}>
      {(bp.pronunciation && bp.pronunciation.tips || []).map((t, i) => <p key={i} className="muted small">💡 {t}</p>)}

      {/* Capability: pronunciation focus sections when available */}
      {focusSections && focusSections.map((fs, i) => (
        <Card key={i}>
          <h4 className="diary-label">{fs.title}</h4>
          <p className="muted small">{fs.description}</p>
          {fs.targetWord && (
            <p className="pron-word"><VocabToken word={fs.targetWord} onTap={onVocabTap} /> <span className="vocab-ipa">{fs.ipa}</span></p>
          )}
          {fs.targetWords && fs.targetWords.map((tw, j) => (
            <p key={j} className="pron-word"><VocabToken word={tw.word} onTap={onVocabTap} /> <span className="vocab-ipa">{tw.ipa}</span></p>
          ))}
          {fs.instructions && fs.instructions.map((inst, j) => <p key={j} className="small">• {inst}</p>)}
          {fs.practiceWords && (
            <div style={{ marginTop: 6 }}>
              <span className="muted small">Practise: </span>
              {fs.practiceWords.map((pw, j) => (
                <span key={j}>
                  {TTS_OK ? <button className="link-btn small" onClick={() => speakText(pw)}>{pw}</button> : <span className="small">{pw}</span>}
                  {j < fs.practiceWords.length - 1 ? " \u00b7 " : ""}
                </span>
              ))}
            </div>
          )}
          {fs.correct && (
            <div style={{ marginTop: 6 }}>
              <p className="small"><strong>Correct:</strong> {fs.correct.join(" \u00b7 ")}</p>
              {fs.incorrect && <p className="small" style={{ opacity: 0.5 }}><strong>Not:</strong> ❌ {fs.incorrect.join(" · ❌ ")}</p>}
            </div>
          )}
        </Card>
      ))}

      {focusSections && (
        <button className="ghost-btn wide" style={{ marginBottom: 8 }} onClick={() => setShowTable(!showTable)}>
          {showTable ? "Hide" : "Show"} full vocabulary table ({items.length} words)
        </button>
      )}
      {showTable && items.map((it) => (
        <div key={it.word} className="pron-row">
          <div className="pron-word"><VocabToken word={it.word} onTap={onVocabTap} /><span className="vocab-ipa"> {it.ipa}</span></div>
          <div className="pron-meta muted small">{it.syllables} · stress on {it.stress}</div>
          {TTS_OK && <button className="ghost-btn" onClick={() => speakText(it.word + ". " + it.example)}>🔊 Hear it</button>}
        </div>
      ))}

      <div className="pron-try">
        <p className="muted small">Now you — say one of the words out loud.</p>
        <MicButton onText={(t) => setHeard(t)} />
        {heard && <LeoFeedback ok>I heard: “{heard}” — good on you for having a go out loud. That's how pronunciation improves.</LeoFeedback>}
        {!TTS_OK && <p className="muted small">(Audio isn't available on this device — practise saying each word slowly, stressing the marked syllable.)</p>}
      </div>
      <button className="primary-btn" onClick={() => setDone(true)}>Continue</button>
    </SectionShell>
  );
}

/* ---------- Sentence frames panel (reusable) ---------- */
function SentenceFramesPanel({ frames, label }) {
  const [open, setOpen] = useState(false);
  if (!frames || !frames.length) return null;
  return (
    <div className="frames-panel">
      <button className="ghost-btn wide" onClick={() => setOpen(!open)}>
        {open ? "Hide" : "Show"} {label || "sentence frames"}
      </button>
      {open && (
        <div className="frames-list">
          {frames.map((f, i) => (
            <div key={i} className="frame-item">
              <p className="frame-text">{f.frame}</p>
              {f.example && <p className="frame-example muted small">e.g. {f.example}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Stage 4: Speaking — conversation, discussion, critical thinking ---------- */
function SpeakingSection({ bp, memory, vocab, onVocabTap, onSkip, onDone }) {
  const notes = bp._teacherNotes ? bp._teacherNotes.slice(0, 200) : "";
  // Capability: use discussion questions as prompts when available
  const discussionQs = bp.discussionQuestions || [];
  const hasDiscussion = discussionQs.length > 0;
  const hasCriticalThinking = !!(bp.criticalThinkingTask && bp.criticalThinkingTask.prompt);
  const speakFrames = bp.sentenceFrames && bp.sentenceFrames.speaking;
  const discFrames = bp.sentenceFrames && bp.sentenceFrames.discussion;
  const ctFrames = bp.sentenceFrames && bp.sentenceFrames.criticalThinking;

  const opener = hasDiscussion
    ? `Let's discuss: ${discussionQs[0]}`
    : `Let's practise for real. Imagine we're in this situation: ${bp.context}. I'll start — ${(bp.warmUpQuestions && bp.warmUpQuestions[1]) || "tell me what you would say first."}`;
  const [turns, setTurns] = useState([{ role: "leo", text: opener }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [phase, setPhase] = useState("speak"); // "speak" | "critical" | "done"
  const leoTurns = turns.filter((t) => t.role === "leo").length;
  const youTurns = turns.filter((t) => t.role === "you").length;

  const send = async () => {
    const said = input.trim(); if (!said || thinking) return;
    const next = [...turns, { role: "you", text: said }];
    setTurns(next); setInput(""); setThinking(true);
    try {
      const convo = next.map((t) => (t.role === "leo" ? "Teacher: " : "") + t.text).join("\n");
      const discussionCtx = hasDiscussion ? `\nDiscussion questions to explore: ${discussionQs.join("; ")}` : "";
      const raw = await askClaude(
        `You are Leo, one of Australia's best ELICOS teachers, in a speaking practice about "${bp.context}" with your student (${memory}).\nObjective: ${bp.communicativeObjective}\nPredicted difficulties: ${(bp.predictedDifficulties || []).join("; ")}\nFinal task they are building toward: ${bp.finalTask || bp.communicativeObjective}\nEmotional objective: ${bp.emotionalObjective || "build confidence"}${discussionCtx}\n\nBehave like a real teacher: respond to WHAT they said, sound curious and warm, ask ONE genuine follow-up question. Encourage communication over perfection. If they make a predicted mistake, gently recast it — but never interrupt the flow. Keep it to 2-3 natural sentences.\n\n${convo}\n\nThe student just said: "${said}"\n\nReply as the teacher in plain text only.`,
        { intent: "speaking_reply" }
      );
      setTurns((t) => [...t, { role: "leo", text: raw }]);
    } catch {
      setTurns((t) => [...t, { role: "leo", text: "Good — keep going! What would you say next?" }]);
    }
    setThinking(false);
  };

  if (phase === "done") return (
    <SectionShell title="Speaking practice" onSkip={onSkip}>
      {/* Part B rev 2. "Excellent!" was awarded before anything was known and
          fired for "s". "N turns of REAL CONVERSATION" attached a fabricated
          adjective to a true number — a count is observation, its quality is
          not. The count now appears ONCE, and every screen ends with a next
          step rather than a verdict. youTurns is the only thing knowable here;
          nothing about content, ever. */}
      <StageComplete message={
        youTurns === 0
          ? { title: "Speaking practice",
              sub: "No turns this time. Speaking is the one part of English that only moves when you actually use it — it's here whenever you're ready." }
          : youTurns === 1
          ? { title: "You spoke once.",
              sub: "Speaking is the hardest skill to practise on your own. Next time, stay in for one turn longer than feels comfortable — that's where it grows." }
          : { title: `You spoke ${youTurns} times.`,
              sub: "Speaking is the hardest skill to practise on your own. Next time, aim for one more turn than today — that's how the habit builds." }
      }
        onContinue={() => onDone(youTurns)} />
    </SectionShell>
  );

  // Capability: critical thinking task after speaking conversation
  if (phase === "critical" && hasCriticalThinking) {
    const ct = bp.criticalThinkingTask;
    return (
      <SectionShell title="Critical thinking" blurb="Use your English to solve a real problem." onSkip={() => setPhase("done")}>
        <p className="passage">{ct.prompt}</p>
        {ct.questions && ct.questions.map((q, i) => (
          <p key={i} className="small" style={{ marginTop: 4 }}>• {q}</p>
        ))}
        <SentenceFramesPanel frames={ctFrames} label="sentence frames" />
        <div style={{ marginTop: 12 }}>
          <div className="input-row">
            <input className="text-input" placeholder="Share your ideas…" value={input}
              onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
            <MicButton onText={(t) => setInput(t)} />
          </div>
          <div className="speak-thread" style={{ marginTop: 8 }}>
            {turns.filter((_, i) => i > 0 || phase === "critical").map((t, i) => (
              <div key={i} className={"speak-turn " + (t.role === "leo" ? "speak-leo" : "speak-you")}>
                
                <p><VocabText text={t.text} vocab={vocab} onTap={onVocabTap} /></p>
              </div>
            ))}
            {thinking && <Spinner label="Leo is thinking…" />}
          </div>
          <div className="btn-row">
            <button className="primary-btn" onClick={send} disabled={thinking || !input.trim()}>Reply</button>
            <button className="ghost-btn" onClick={() => setPhase("done")}>Finish</button>
          </div>
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell title="Speaking practice" blurb="Answer out loud with the mic, or type. This is about communicating, not being perfect." onSkip={onSkip}>
      {/* Capability: sentence frames scaffold when available */}
      <SentenceFramesPanel frames={speakFrames || discFrames} label="sentence frames" />
      <div className="speak-thread">
        {turns.map((t, i) => (
          <div key={i} className={"speak-turn " + (t.role === "leo" ? "speak-leo" : "speak-you")}>
            
            <p><VocabText text={t.text} vocab={vocab} onTap={onVocabTap} /></p>
            {t.role === "leo" && TTS_OK && <button className="link-btn" onClick={() => speakText(t.text)}>🔊</button>}
          </div>
        ))}
        {thinking && <Spinner label="Leo is listening…" />}
      </div>
      <div className="input-row">
        <input className="text-input" placeholder="Say or type your reply…" value={input}
          onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
        <MicButton onText={(t) => setInput(t)} />
      </div>
      <div className="btn-row">
        <button className="primary-btn" onClick={send} disabled={thinking || !input.trim()}>Reply</button>
        {leoTurns >= 3 && (
          <button className="ghost-btn" onClick={() => {
            if (hasCriticalThinking) setPhase("critical");
            else setPhase("done");
          }}>
            {hasCriticalThinking ? "Move to critical thinking" : "Finish speaking practice"}
          </button>
        )}
      </div>
    </SectionShell>
  );
}

/* ---------- Stage 5: Reading / Listening ----------
   Capability-driven: renders reading, listening, or both based on
   available content. Listening gap-fill uses GapFillInput when
   bp.listeningGapFill exists; otherwise falls back to MCQ comprehension.
   ------------------------------------------------------------------ */
function ListeningGapFillExercise({ gaps, onDone }) {
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  if (finished) return (
    <StageComplete correct={correct} total={gaps.length}
      message={{ title: "Listening complete!", sub: `${correct} out of ${gaps.length} — your ears are getting sharper.` }}
      onContinue={() => onDone(correct, gaps.length)} />
  );
  const g = gaps[idx];
  return (
    <div>
      <p className="muted small">Fill in the blank — {idx + 1} of {gaps.length}</p>
      <GapFillInput
        key={idx}
        stem={g.context}
        answers={g.answer}
        onDone={(ok) => {
          if (ok) setCorrect((c) => c + 1);
          setTimeout(() => {
            if (idx + 1 < gaps.length) setIdx(idx + 1);
            else setFinished(true);
          }, 1600);
        }}
      />
    </div>
  );
}

function SkillSection({ bp, section, vocab, onVocabTap, onSkip, onDone }) {
  const isListening = bp.mainSkill === "listening";
  const hasListening = !!(bp.listeningScript || bp.listeningGapFill);
  const hasReading = !!(section && section.passage);
  // Capability: dual mode when both reading and listening content exist
  const isDual = hasReading && hasListening;
  const [phase, setPhase] = useState("reading"); // "reading" | "listening"
  const [readScore, setReadScore] = useState({ correct: 0, total: 0 });
  const [revealed, setRevealed] = useState(!isListening && !isDual);
  const [playedOnce, setPlayedOnce] = useState(false);
  const listenScript = bp.listeningScript || (section && section.passage) || "";

  // Phase: reading first, then listening (if dual)
  if (isDual && phase === "listening") {
    return (
      <SectionShell title="Listening" blurb="Listen carefully and fill in the missing words." onSkip={onSkip}>
        <div className="listen-box">
          {TTS_OK && (
            <button className="primary-btn" style={{ marginBottom: 10 }} onClick={() => { speakText(listenScript.replace(/\n/g, ". ")); setPlayedOnce(true); }}>
              🔊 {playedOnce ? "Play again" : "Play the recording"}
            </button>
          )}
          {!TTS_OK && <p className="muted small">(Audio isn't available — read the text and fill in the blanks.)</p>}
        </div>
        {bp.listeningGapFill ? (
          <ListeningGapFillExercise gaps={bp.listeningGapFill}
            onDone={(c, t) => onDone(readScore.correct + c, readScore.total + t)} />
        ) : (
          <div>
            <p className="passage"><VocabText text={listenScript} vocab={vocab} onTap={onVocabTap} /></p>
            <button className="primary-btn" onClick={() => onDone(readScore.correct, readScore.total)}>Continue</button>
          </div>
        )}
      </SectionShell>
    );
  }

  return (
    <SectionShell title={isListening ? "Listening" : "Reading"} blurb={isListening ? "Listen first for the general idea, then answer. You can replay as often as you like." : "Skim it once for the main idea, then read again for detail."} onSkip={onSkip}>
      {isListening ? (
        <div className="listen-box">
          {TTS_OK ? (
            <button className="primary-btn" onClick={() => { speakText(section.passage.replace(/\n/g, ". ")); setPlayedOnce(true); }}>
              🔊 {playedOnce ? "Play again" : "Play the conversation"}
            </button>
          ) : (
            <p className="muted small">Audio isn't available on this device, so read the transcript below as a listening substitute.</p>
          )}
          {(revealed || !TTS_OK) ? (
            <p className="passage"><VocabText text={section.passage} vocab={vocab} onTap={onVocabTap} /></p>
          ) : (
            playedOnce && <button className="ghost-btn" onClick={() => setRevealed(true)}>Show transcript</button>
          )}
        </div>
      ) : (
        <p className="passage"><VocabText text={section.passage} vocab={vocab} onTap={onVocabTap} /></p>
      )}
      <McqQuiz questions={section.questions} vocab={vocab} onVocabTap={onVocabTap}
        onDone={(c, t) => {
          if (isDual) {
            setReadScore({ correct: c, total: t });
            setPhase("listening");
          } else {
            onDone(c, t);
          }
        }} />
    </SectionShell>
  );
}

/* ---------- Stage 6: Grammar — meaning, form, usage, then practice ---------- */
function GrammarSection({ bp, section, vocab, onVocabTap, onSkip, onDone }) {
  const g = bp.grammar || {};
  const hasPractice = section.questions && section.questions.length >= 3 && !section.explanationOnly;
  const [practising, setPractising] = useState(false);
  if (!practising) return (
    <SectionShell title={`Grammar: ${g.point}`} blurb="One point, straight from today's situation — never grammar for its own sake." onSkip={onSkip}>
      <p><strong>What it means:</strong> <VocabText text={g.meaning} vocab={vocab} onTap={onVocabTap} /></p>
      <p><strong>The form:</strong> <span className="gram-form">{g.form}</span></p>
      <p><strong>When to use it:</strong> <VocabText text={g.usage} vocab={vocab} onTap={onVocabTap} /></p>
      {(g.examples || []).map((ex, i) => <p key={i} className="vocab-example"><VocabText text={ex} vocab={vocab} onTap={onVocabTap} /></p>)}
      {/* Capability: grammar reference table when available */}
      {g.reference && g.reference.length > 0 && (
        <div className="gram-ref-table" style={{ overflowX: "auto", marginTop: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "8px 10px", borderBottom: "2px solid var(--euca)", color: "var(--euca-deep)", fontWeight: 700 }}>Function</th>
                <th style={{ textAlign: "left", padding: "8px 10px", borderBottom: "2px solid var(--euca)", color: "var(--euca-deep)", fontWeight: 700 }}>Form</th>
                <th style={{ textAlign: "left", padding: "8px 10px", borderBottom: "2px solid var(--euca)", color: "var(--euca-deep)", fontWeight: 700 }}>Example</th>
              </tr>
            </thead>
            <tbody>
              {g.reference.map((row, i) => (
                <tr key={i}>
                  <td style={{ padding: "7px 10px", borderBottom: "1px solid var(--line)", fontWeight: 600, color: "var(--euca-deep)" }}>{row.function}</td>
                  <td style={{ padding: "7px 10px", borderBottom: "1px solid var(--line)" }}><span className="gram-form">{row.form}</span></td>
                  <td style={{ padding: "7px 10px", borderBottom: "1px solid var(--line)", fontStyle: "italic", opacity: 0.8 }}>{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {hasPractice
        ? <button className="primary-btn" onClick={() => setPractising(true)}>Practise it</button>
        : <button className="primary-btn" onClick={() => onDone(0, 0)}>Continue</button>}
    </SectionShell>
  );
  return (
    <SectionShell title={`Grammar: ${g.point}`} onSkip={onSkip}>
      <McqQuiz questions={section.questions} vocab={vocab} onVocabTap={onVocabTap} onDone={onDone} />
    </SectionShell>
  );
}

/* ---------- Stage 7: Summary — praise, growth, mission, tomorrow ---------- */
function SummarySection({ bp, section, vocab, onVocabTap, onFinish }) {
  const s = section;
  return (
    <Card className="leo-card">
      <div className="lesson-head leo-accent"><h3 style={{ margin: 0 }}>That's today's lesson 🎉</h3></div>
      <p className="text-leo"><VocabText text={s.praise} vocab={vocab} onTap={onVocabTap} /></p>
      <p className="muted"><VocabText text={s.summary} vocab={vocab} onTap={onVocabTap} /></p>
      <p className="text-leo"><strong>Your strength today:</strong> {s.strength}</p>
      <p className="text-leo"><strong>One thing to work on:</strong> {s.improvement}</p>
      <p className="muted small">{s.connection}</p>
      <div className="mission-box"><span className="mission-icon">🌏</span><p><VocabText text={bp.mission} vocab={vocab} onTap={onVocabTap} /></p></div>
      <p className="lesson-tomorrow"><strong>Next time:</strong> {s.tomorrowPreview}</p>
      <button className="primary-btn wide" style={{ marginTop: 6 }} onClick={onFinish}>Finish lesson 🎉</button>
    </Card>
  );
}

/* ---------- Blueprint JSON shape (single source of truth) ----------
   Every planner call that must return a blueprint — the first attempt,
   the fix-retry and the post-review revision — restates this exact shape.
   askClaude() is stateless, so a retry that doesn't restate the shape
   cannot possibly succeed. */
// CEFR productive-language constraints. RATIFIED by Lessons_ASKLEO, 26 July 2026
// (cefr-constraints-v1.md, MD5 5afcd36a61c1b6e79cf22d25bd16d362). A1 ratified with
// amendments; A2-C2 authored by Lessons. Governs PRODUCTIVE target language only,
// not receptive reading/listening (i+1). C2 is authored but RESERVED — CEFR_ORDER
// does not include it, so it is unreachable until the picker extends. Do not edit
// without a Lessons ruling.
const CEFR_CONSTRAINTS = {
  A1: {
    allowed: [
      "present simple", "present continuous",
      "to be", "have got",
      "can/can't (ability)",
      "imperatives",
      "basic questions (Wh- and yes/no, present tense)",
      "there is / there are",
      "plurals, articles (a/an/the)",
      "basic prepositions of place and time",
      "possessive adjectives, object pronouns, demonstratives",
      "basic quantifiers (some, any, a lot of, much/many)",
      "frequency adverbs (always, usually, sometimes, never)",
      "comparatives and superlatives of short common adjectives",
      "like/want + noun; would like as lexicalised polite request",
      "past simple (was/were; regular -ed; defined irregular set: went, had, did, saw, came, got, made, said, took) — LATE A1 ONLY, for personal past events on familiar timeframes"
    ],
    forbidden: [
      "modals of obligation, advice or deduction (must, should, might, may)",
      "perfect tenses (present perfect, past perfect, any continuous perfect)",
      "past continuous",
      "conditionals (any type)",
      "passives (any form)",
      "reported speech",
      "relative clauses",
      "going to future, present continuous for future",
      "productive verb + gerund / verb + infinitive patterns"
    ],
    vocab: "high-frequency only, ~top 750–1000 word families (English Vocabulary Profile A1 tier)",
    tasks: "short, concrete, personal, predominantly present-focused; late A1 admits simple past on familiar timeframes; task length under 6 exchanges; contexts limited to self, family, home, food, shopping, work basics, transport, health basics, weather",
    do_examples: [
      "'What time do you finish work?' — present simple, personal, concrete",
      "'I like coffee. I don't like tea.' — like + noun, negative",
      "'There's a bank on the corner.' — there is, basic prepositions",
      "'She's taller than me.' — comparative, object pronoun",
      "'I went to Sydney last weekend.' — LATE A1 past simple, personal timeframe, defined irregular"
    ],
    dont_examples: [
      "'You should try the new café.' — modal of advice, forbidden",
      "'I've lived here for three years.' — present perfect, forbidden",
      "'If I had more time, I'd study more.' — second conditional, forbidden",
      "'The bill was paid at the counter.' — passive, forbidden",
      "'He said he was tired.' — reported speech, forbidden"
    ]
  },
  A2: {
    allowed: [
      "everything allowed at A1",
      "past simple (full range: all forms, questions, negatives, high-frequency irregulars)",
      "going to future (plans and predictions)",
      "present continuous for future arrangements",
      "should for advice (basic)",
      "comparative and superlative adjectives (full range)",
      "adverbs of manner (regular -ly)",
      "verb + gerund (like doing, enjoy doing); verb + infinitive (want to do, need to do)",
      "prepositions of time and place (wider range)",
      "present perfect simple with ever/never/for/since — LATE A2 ONLY, for experience"
    ],
    forbidden: [
      "past continuous (except as receptive input)",
      "past perfect",
      "present perfect continuous",
      "conditionals other than basic first conditional (LATE A2 admits first conditional in a defined shape only: If + present simple, will + base form; single clause, present-focused consequence)",
      "passives (any form)",
      "reported speech (except simple lexicalised: 'He said yes')",
      "relative clauses",
      "modals of deduction (must be, might be, can't be)",
      "used to for past habits"
    ],
    vocab: "~1500–2000 word families, English Vocabulary Profile A2 tier; concrete concepts; extended familiar-topic range (personal history, plans, routines, feelings, health, community)",
    tasks: "short-to-medium (under 12 exchanges); routine tasks in familiar contexts; describing past experiences and future plans; simple opinions on familiar topics (I like / I don't like / because...); short narrative on a personal past event; simple comparisons; ordering, requesting, appointment-making at real Australian settings (GP, cafe, workplace, school pickup)",
    do_examples: [
      "'I lived in Bogotá for five years, then I moved to Sydney.' — past simple narrative, personal history",
      "'I'm going to look for a new job next month.' — going to future, plans",
      "'You should call the landlord.' — should for advice",
      "'I've never eaten kangaroo.' — LATE A2 present perfect with ever/never, experience only",
      "'This café is better than the one on George Street.' — comparative, familiar topic"
    ],
    dont_examples: [
      "'By the time I arrived, they had already left.' — past perfect, forbidden",
      "'I've been learning English for two years.' — present perfect continuous, forbidden",
      "'If I had a car, I'd drive there.' — second conditional, forbidden",
      "'The rent is paid on the first of the month.' — passive, forbidden",
      "'The woman who I met yesterday works at the hospital.' — relative clause, forbidden"
    ]
  },
  B1: {
    allowed: [
      "everything allowed at A2",
      "present perfect simple and continuous",
      "past perfect simple",
      "past continuous (full range, including with past simple in narrative)",
      "used to for past habits and states",
      "zero, first, and second conditionals (full range)",
      "basic passive voice (present simple, past simple, will future)",
      "reported speech with basic tense shifts (statements and questions)",
      "defining relative clauses (who, which, that)",
      "modals of obligation and permission (have to, don't have to, must, can, could, may)",
      "modals of deduction (present: must be, might be, can't be)",
      "verb patterns (extended verb + gerund / verb + infinitive lists)",
      "future forms range (will, going to, present continuous, present simple for schedules)",
      "linkers (although, however, because of, so, therefore)"
    ],
    forbidden: [
      "third conditional",
      "mixed conditionals",
      "advanced passive constructions (perfect passive, modal passive, get-passive, causative have)",
      "reported speech with complex tense shifts or modal reporting verbs",
      "non-defining relative clauses",
      "reduced relative clauses",
      "cleft sentences (It was..., What I want is...)",
      "inversion (any form)",
      "subjunctive",
      "would rather, had better",
      "wish + past / wish + would",
      "modals of past deduction (must have done, might have done)",
      "advanced discourse markers (nevertheless, notwithstanding, furthermore in productive use)"
    ],
    vocab: "~2500–3500 word families, English Vocabulary Profile B1 tier; increasing abstraction; opinions, feelings, workplace and study contexts; basic collocations",
    tasks: "connected text (paragraph-length); opinions with reasons on familiar topics; describing experiences, events, dreams, hopes, ambitions; short narrative with orientation, complication, resolution; giving and receiving instructions; explaining simple problems; agreeing and disagreeing politely; workplace scenarios (calling in sick, requesting time off, describing a task)",
    do_examples: [
      "'I've been living in Melbourne since 2023, but I moved from Brisbane last year.' — present perfect continuous + past simple",
      "'If I studied more, I'd pass the test.' — second conditional, hypothetical",
      "'The letter was sent yesterday.' — basic past passive",
      "'She told me she was tired.' — reported speech, basic tense shift",
      "'The man who fixed my heater was very helpful.' — defining relative clause"
    ],
    dont_examples: [
      "'If I had studied harder, I would have passed.' — third conditional, forbidden",
      "'The report will have been finished by Friday.' — modal passive, forbidden",
      "'He asked me whether I would have completed it by then.' — complex reported tense shift, forbidden",
      "'My colleague, who I've known for ten years, is retiring.' — non-defining relative clause, forbidden",
      "'It was the manager who made the decision.' — cleft sentence, forbidden"
    ]
  },
  B2: {
    allowed: [
      "everything allowed at B1",
      "third conditional",
      "mixed conditionals",
      "all passive constructions (perfect, modal, causative have)",
      "get-passive (informal register)",
      "reported speech, full range including modal reporting verbs (suggest, insist, deny)",
      "non-defining relative clauses",
      "reduced relative clauses",
      "cleft sentences (It-cleft, What-cleft)",
      "modals of past deduction (must have done, might have done, should have done)",
      "would rather + past, had better",
      "wish + past, wish + past perfect, wish + would",
      "future perfect and future continuous",
      "linking devices for extended argument (however, moreover, nevertheless, on the other hand)",
      "productive idiomatic language, common phrasal verbs, everyday collocations"
    ],
    forbidden: [
      "advanced inversion (Hardly had I..., Never before have I...) except as receptive input",
      "subjunctive (except common fixed expressions: 'If I were you')",
      "complex ellipsis and substitution beyond common patterns",
      "fronting for emphasis in extended productive use",
      "highly literary or archaic constructions",
      "rare or region-specific idioms without prior teaching"
    ],
    vocab: "~4000–5000 word families, English Vocabulary Profile B2 tier; abstract topics; range of collocations; common idiomatic expressions; register-appropriate synonym choice (start / begin / commence)",
    tasks: "extended contribution (multiple paragraphs); argument with counter-argument on abstract topics; hypothesising about past and present; main-idea comprehension of complex text; sustained interaction on unfamiliar topics; presenting a case with support; workplace scenarios (leading a short meeting, delivering feedback, negotiating a deadline); academic scenarios (short seminar contribution, discussion of a reading)",
    do_examples: [
      "'If we'd left earlier, we would've caught the train — and we wouldn't be waiting here now.' — mixed conditional",
      "'The proposal was believed to have been drafted in haste.' — perfect passive with reporting",
      "'What surprised me most was how quickly they responded.' — What-cleft",
      "'She must have forgotten — she's usually so reliable.' — modal of past deduction",
      "'The candidate, whose CV we discussed yesterday, has withdrawn.' — non-defining relative clause"
    ],
    dont_examples: [
      "'Hardly had I sat down when the phone rang.' — advanced inversion, forbidden productively",
      "'The committee recommends that he be reinstated.' — subjunctive outside fixed expressions, forbidden",
      "'Never before had such a decision been contemplated.' — inversion + past perfect, forbidden productively",
      "'A fine mess he's made of it.' — fronting for emphasis, forbidden productively",
      "'She's dressed to the nines.' — rare/regional idiom without prior teaching, forbidden"
    ]
  },
  C1: {
    allowed: [
      "everything allowed at B2",
      "full range of inversion (Hardly had I..., Never before have I..., Only then did...)",
      "subjunctive (I suggest he take..., It's essential that she be...)",
      "advanced ellipsis and substitution",
      "fronting for emphasis",
      "cleft sentences (all forms, including all-cleft and reversed pseudo-cleft)",
      "complex noun phrases with multiple modifiers",
      "nuanced modality (I dare say..., Should you find..., Were it not for...)",
      "productive idiomatic and collocational range",
      "register shifting within a single stretch of discourse",
      "discourse-level cohesion devices (referencing, substitution, ellipsis across a text)"
    ],
    forbidden: [
      "very rare literary constructions (poetic inversion, archaic forms)",
      "highly regional idiomatic expressions unless the region is the taught target",
      "constructions requiring cultural knowledge the student has not been taught"
    ],
    vocab: "~6000–8000 word families, English Vocabulary Profile C1 tier; wide idiomatic and collocational range; register-appropriate synonym choice with subtle meaning distinctions (imply / infer, historic / historical); productive use of hedging and stance-marking language",
    tasks: "extended contribution on demanding topics; precise expression of subtle distinctions; complex argument with hedging and stance; register control (moving between formal and informal within one discourse); presenting a nuanced case with anticipated objections; academic scenarios (extended seminar contribution, critique of a source); professional scenarios (drafting a policy note, leading a difficult conversation, negotiating with competing interests)",
    do_examples: [
      "'Only when the report was published did the full picture emerge.' — inversion after only when",
      "'The committee recommends that the proposal be reconsidered.' — subjunctive in formal register",
      "'Were the funding to be withdrawn, the entire project would collapse.' — inverted conditional",
      "'It's not so much the cost as the timing that concerns me.' — cleft with nuanced contrast",
      "'She's inclined to overpromise — a habit she'd do well to curb.' — hedged criticism with idiomatic collocation"
    ],
    dont_examples: [
      "'Nay, 'twere better we depart.' — archaic literary form, forbidden",
      "'Fair dinkum, mate, she'll be right.' — regional idiom without prior teaching, forbidden",
      "Cultural allusion assuming knowledge the student has not been taught (e.g. an unglossed reference to a specific Australian political figure or historical event)"
    ]
  },
  C2: {
    allowed: [
      "the full productive range of English — no grammatical constraint",
      "sophisticated argumentation with multiple layers of hedging, stance and concession",
      "precise register control across formal, academic, professional and informal contexts",
      "nuanced use of idiomatic and figurative language",
      "productive control of literary and rhetorical devices where appropriate to context",
      "genre-specific conventions (academic, journalistic, legal, creative)"
    ],
    forbidden: [
      "nothing constrained by level; the constraint is APPROPRIACY, not permission",
      "constructions inappropriate to the specific target register (a slang idiom in formal writing; academic hedging in casual conversation) — flagged as appropriacy errors, not level errors"
    ],
    vocab: "~8000+ word families, English Vocabulary Profile C2 tier; near-complete productive control of the language, including low-frequency and specialised vocabulary; precise selection between near-synonyms; productive use of low-frequency idiomatic expressions",
    tasks: "sophisticated argument in any register; precise expression of nuanced meaning; sustained contribution in any genre; near-native flexibility in switching between contexts; academic scenarios (extended critical analysis, publishable-quality writing); professional scenarios (high-stakes negotiation, keynote presentation, legally-sensitive drafting); creative scenarios (stylistic control across genres)",
    do_examples: [
      "'The report, for all its rhetorical polish, rests on assumptions that will not bear scrutiny.' — sophisticated critique with hedged confidence",
      "'One might reasonably infer, though the author does not say so, that the omission is deliberate.' — nuanced attribution and stance",
      "Register-shift within a single discourse: opening formally in a keynote, moving to conversational mid-way for effect, closing on a return to formal register"
    ],
    dont_examples: [
      "There are no level-forbidden constructions at C2. Errors at this level are errors of APPROPRIACY (wrong register for the context), PRECISION (a near-synonym misapplied), or CULTURAL PRAGMATICS (an idiom used in a context where it lands wrong) — flagged as such, not as level-inappropriate."
    ]
  },
};
// One shared block, used by Stage 2 (needs assessment) and Stage 3 (blueprint + retry)
// so they cannot drift. Formats the structured constraint into prompt text; empty
// string when the level has no entry (graceful, non-blocking fallback).
const cefrBlock = (lvl, c) => c ? `\n\nLEVEL CONSTRAINT — ${lvl}. This governs the PRODUCTIVE target language only — what the lesson teaches and asks the student to produce — NOT receptive reading/listening material (which may sit slightly above level). Everything you plan to teach and have the student produce MUST stay within these limits:\n- ALLOWED: ${c.allowed.join("; ")}.\n- FORBIDDEN productively at ${lvl}: ${c.forbidden.join("; ")}.\n- VOCABULARY: ${c.vocab}.\n- TASKS: ${c.tasks}.\n- DO: ${c.do_examples.join("  |  ")}\n- DON'T: ${c.dont_examples.join("  |  ")}\nIf the situation implies content above ${lvl}, SIMPLIFY it to fit — never pitch above the student.` : "";

const BLUEPRINT_JSON_SHAPE = `{"teacherReflection":"summarise your thinking in 2-3 sentences","communicativeObjective":"one can-do from your needs assessment","context":"the Australian situation you chose","cefr":"the student's CEFR level","lessonRationale":"why THIS lesson TODAY from your reasoning","predictedDifficulties":["2-3 mistakes from your analysis"],"emotionalObjective":"from your needs assessment","memorableMoment":"the one thing from your assessment","authenticMaterial":"the actual Australian text you wrote in your assessment","scaffoldingStrategy":"how you will build toward the final task","explanation":"2-3 warm sentences introducing today to the student","warmUpQuestions":["5-8 progressively communicative questions specific to today's context"],"warmUpActivities":[{"type":"one of: context_discussion|prediction|finish_sentence|mini_task|mcq|best_response|true_false|is_this_correct|spot_mistake|complete_dialogue|unscramble|order_conversation","instruction":"how to do it, one line","prompt":"the question or task, contextualised to TODAY","text":"optional supporting text or dialogue","options":["choice types ONLY: 2-4 options"],"answer":"choice types ONLY: exact text of the correct option","tokens":["sequence types ONLY: the words or lines IN THE CORRECT ORDER"],"note":"the teaching point, in Leo's voice"}],"vocabulary":[{"word":"","pos":"","meaning":"simple definition","ipa":"","stress":"","syllables":"","example":"in today's situation","examples":["one more"],"related":["2-3"],"collocations":["1-2"]}],"grammar":{"point":"","meaning":"","form":"","usage":"when Australians use this","examples":["2 in today's situation"]},"pronunciation":{"focus":"","tips":["2-3 for this student's L1"]},"mainSkill":"reading or listening","finalTask":"the role-play climax from your assessment","mission":"one doable real-world task","tomorrowConnection":"how today leads to tomorrow","learningOutcome":"what they can now do"}`;

/* ---------- Blueprint validation (client-side, structural) ----------
   The blueprint is the UNIVERSAL LESSON FORMAT. Every lesson — AI-generated,
   teacher-authored, or hybrid — ultimately produces one of these objects.
   The rendering layer never checks where a lesson came from; it checks
   what data is present. Components render optional content when it exists,
   not when a type flag says to.

   lessonType drives VALIDATION STRICTNESS, not rendering behaviour:
   - "ai"       AI planner produced this. Planner-specific fields required.
   - "authored" A teacher wrote this. Content fields validated instead.
   - "hybrid"   Teacher-authored core with AI extensions (future).
   Omitted lessonType defaults to "ai" for backward compatibility.

   UNIVERSAL BLUEPRINT — FIELD REFERENCE
   [core]     Required for ALL lessons.
   [ai]       Required when lessonType is "ai" (or absent).
   [content]  Optional content that components render when present,
              regardless of lessonType. This is the extensibility seam.
   [meta]     Lesson metadata. Included from day one for future indexing,
              search, curriculum sequencing, and analytics.

   Metadata:
     lessonType           string     [core]     "ai" | "authored" | "hybrid"
     id                   string     [meta]     unique identifier (e.g. "beach-safety-b1")
     title                string     [meta]     human-readable lesson title
     level                string     [meta]     target level label (e.g. "Low Intermediate")
     cefr                 string     [core]     CEFR band (A1–C2)
     topic                string     [meta]     topic category (e.g. "beach safety")
     tags                 array      [meta]     searchable tags (e.g. ["beach","modals","safety"])
     estimatedDuration    string     [meta]     e.g. "90–120 minutes"
     sequence             number     [meta]     position in a curriculum (future)
     pack                 string     [meta]     lesson pack/bundle identifier (future)
     version              number     [meta]     content version for cache-busting (future)
     author               string     [meta]     "Leo" for AI, teacher name for authored
     lastUpdated          string     [meta]     ISO date string

   Core lesson content:
     context              string     [core]     the Australian situation
     communicativeObjective string   [core]     one can-do statement
     explanation          string     [core]     warm intro sentences for the student
     vocabulary           array      [core]     ALL vocabulary items (no arbitrary limit)
     matchVocab           array      [content]  words/indices for matching exercise (max 8)
     grammar              object     [core]     { point, meaning, form, usage, examples }
     pronunciation        object     [core]     { focus, tips, words?, focusSections? }
     mainSkill            string     [core]     "reading" | "listening" | "both"
     warmUpQuestions       array     [core]     discussion question strings
     warmUpActivities      array     [core]     structured warm-up activity objects
     mission              string     [core]     real-world task for after the lesson
     learningOutcome      string     [core]     what the student can now do
     learningOutcomes     array      [meta]     detailed outcome list

   AI-planner fields:
     teacherReflection    string     [ai]       planner's thinking summary
     lessonRationale      string     [ai]       why this lesson today
     predictedDifficulties array     [ai]       anticipated student errors
     emotionalObjective   string     [ai]       how the student should feel
     memorableMoment      string     [ai]       the one thing that sticks
     authenticMaterial    string     [ai]       the raw Australian text
     scaffoldingStrategy  string     [ai]       build-up plan
     finalTask            string     [ai]       the role-play climax
     tomorrowConnection   string     [ai]       link to next lesson

   Optional content (components render these when present):
     readingPassage       string     [content]  teacher's reading text
     readingQuestions      array     [content]  comprehension MCQs
     listeningScript      string    [content]  teacher's listening text
     listeningGapFill     array     [content]  gap-fill exercises with answers
     vocabReviewExercises object    [content]  { oddOneOut[], completeSentences[] }
     sentenceFrames       object    [content]  { speaking[], discussion[], criticalThinking[] }
     discussionQuestions  array     [content]  discussion prompts with frames
     criticalThinkingTask object    [content]  { prompt, questions[], sentenceFrames[] }
     skillFocus           array     [content]  e.g. ["reading","speaking","vocabulary","grammar"]

   Teacher reference (not shown to student):
     teacherNotes         object    [content]  { anticipatedProblems[], differentiation, ... }
     answerKey            object    [content]  canonical answers for all exercises
   -------------------------------------------------------------------------- */
const VALID_LESSON_TYPES = ["ai", "authored", "hybrid"];
const VALID_CEFR = ["A1", "A2", "B1", "B2", "C1", "C2"];

function validateBlueprint(bp) {
  const problems = [];
  if (!bp || typeof bp !== "object") return ["blueprint missing"];
  const type = bp.lessonType || "ai";

  // ---- Core fields — required for ALL lesson types ----
  ["communicativeObjective", "context", "explanation", "mission", "learningOutcome"].forEach((k) => {
    if (!bp[k]) problems.push(k + " missing");
  });
  if (!Array.isArray(bp.warmUpQuestions) || bp.warmUpQuestions.length < 4) problems.push("warmUpQuestions too short");
  if (!Array.isArray(bp.vocabulary) || bp.vocabulary.length < 5) problems.push("vocabulary too small");
  if (!bp.grammar || !bp.grammar.point || !bp.grammar.form) problems.push("grammar incomplete");
  if (!bp.grammar || !Array.isArray(bp.grammar.examples) || !bp.grammar.examples.length) problems.push("grammar.examples missing");
  if (bp.mainSkill !== "reading" && bp.mainSkill !== "listening" && bp.mainSkill !== "both") problems.push("mainSkill invalid");

  // ---- Lesson type validation ----
  if (bp.lessonType && !VALID_LESSON_TYPES.includes(bp.lessonType)) problems.push(`lessonType "${bp.lessonType}" invalid`);
  if (bp.cefr && !VALID_CEFR.includes(bp.cefr)) problems.push(`cefr "${bp.cefr}" invalid`);

  // ---- AI-planner fields — required only for AI-generated blueprints ----
  if (type === "ai") {
    if (!bp.finalTask) problems.push("finalTask missing");
    if (!bp.emotionalObjective) problems.push("emotionalObjective missing");
    if (!bp.predictedDifficulties || !bp.predictedDifficulties.length) problems.push("predictedDifficulties missing");
  }

  // ---- Content validation — applied whenever the data is present ----
  // These checks are data-driven: they fire based on what exists in the
  // blueprint, not based on lessonType. A component that renders
  // readingQuestions needs them to be valid regardless of who wrote them.

  // matchVocab: the matching UI is capped at 8 for mobile usability
  if (bp.matchVocab) {
    if (!Array.isArray(bp.matchVocab)) problems.push("matchVocab must be an array");
    else if (bp.matchVocab.length > 8) problems.push("matchVocab exceeds 8 items");
  }

  // Vocabulary: duplicate detection (case-insensitive)
  if (Array.isArray(bp.vocabulary)) {
    const vocabWords = bp.vocabulary.map((v) => (v.word || "").toLowerCase());
    const seen = new Set();
    vocabWords.forEach((w, i) => {
      if (!w) problems.push(`vocabulary[${i}] has no word`);
      else if (seen.has(w)) problems.push(`duplicate vocabulary: "${w}"`);
      else seen.add(w);
    });
    // Each vocabulary item needs at minimum a word and a meaning
    bp.vocabulary.forEach((v, i) => {
      if (v.word && !v.meaning) problems.push(`vocabulary "${v.word}" has no meaning`);
    });
  }

  // Reading questions: structural validation
  if (bp.readingQuestions) {
    if (!Array.isArray(bp.readingQuestions)) problems.push("readingQuestions must be an array");
    else {
      const validRQs = validateQuestions(bp.readingQuestions);
      if (bp.readingQuestions.length > 0 && validRQs.length < 3) problems.push("readingQuestions: fewer than 3 valid questions");
    }
    if (bp.readingQuestions && !bp.readingPassage) problems.push("readingQuestions provided without readingPassage");
  }

  // Listening gap-fill: structural validation
  if (bp.listeningGapFill) {
    if (!Array.isArray(bp.listeningGapFill)) problems.push("listeningGapFill must be an array");
    else {
      bp.listeningGapFill.forEach((g, i) => {
        if (!g || !g.answer) problems.push(`listeningGapFill[${i}] missing answer`);
      });
    }
    if (bp.listeningGapFill && !bp.listeningScript) problems.push("listeningGapFill provided without listeningScript");
  }

  // Vocab review exercises
  if (bp.vocabReviewExercises) {
    const vr = bp.vocabReviewExercises;
    if (vr.oddOneOut && !Array.isArray(vr.oddOneOut)) problems.push("vocabReview.oddOneOut must be an array");
    if (vr.completeSentences && !Array.isArray(vr.completeSentences)) problems.push("vocabReview.completeSentences must be an array");
    if (vr.oddOneOut) vr.oddOneOut.forEach((q, i) => {
      if (!q.options || !q.answer) problems.push(`oddOneOut[${i}] missing options or answer`);
      if (q.options && !q.options.includes(q.answer)) problems.push(`oddOneOut[${i}] answer not in options`);
    });
    if (vr.completeSentences) vr.completeSentences.forEach((q, i) => {
      if (!q.stem || !q.answer) problems.push(`completeSentences[${i}] missing stem or answer`);
    });
  }

  // Sentence frames: must not be empty arrays
  if (bp.sentenceFrames) {
    Object.entries(bp.sentenceFrames).forEach(([stage, frames]) => {
      if (Array.isArray(frames) && frames.length === 0) problems.push(`sentenceFrames.${stage} is empty`);
      if (Array.isArray(frames)) frames.forEach((f, i) => {
        if (!f.frame) problems.push(`sentenceFrames.${stage}[${i}] missing frame text`);
      });
    });
  }

  // Critical thinking task
  if (bp.criticalThinkingTask) {
    if (!bp.criticalThinkingTask.prompt) problems.push("criticalThinkingTask missing prompt");
  }

  return problems;
}
function validateQuestions(qs) {
  if (!Array.isArray(qs)) return [];
  return qs.filter((q) => q && q.stem && Array.isArray(q.options) && q.options.length >= 3 && q.options.includes(q.answer) && new Set(q.options).size === q.options.length);
}

/* ---------- The seven-stage plan (data-driven; no switch statements) ---------- */
const STAGE_BRIDGE_TEXT = {
  intro: "Let's get started with today's lesson.",
  vocab: "Let's learn the words you'll need.",
  pron: "Now let's work on how these sound.",
  speak: "Time to practise saying it yourself.",
  skill: "Let's see the language in context.",
  grammar: "Let's look at the grammar behind this.",
  summary: "Let's see how you went today.",
};

const LESSON_STAGES = [
  { id: "intro",   label: "Introduction" },
  { id: "vocab",   label: "Vocabulary" },
  { id: "pron",    label: "Pronunciation" },
  { id: "speak",   label: "Speaking" },
  { id: "skill",   label: "Reading / Listening" },
  { id: "grammar", label: "Grammar" },
  { id: "summary", label: "Summary" },
];

/* ---------- LessonPage: planner -> blueprint -> staged teaching ---------- */
/* ---------- Leo's Teaching Brain: build a rich teacher context ---------- */
// Gathers everything Leo knows about this student into structured teaching
// notes — not a flat string, but the kind of brief an experienced colleague
// would read before taking over a class. This feeds the planner prompt.
function buildTeacherContext({ profile, memoryStore, words, heard, diaryPages, activity, errorLog, stats }) {
  const level = levelFor(profile);
  const lang = LANGS[profile.lang].english;
  const lastLesson = memoryStore.lessonLog[0];
  const last3 = memoryStore.lessonLog.slice(0, 3);
  const recentScores = last3.filter((l) => typeof l.score === "number").map((l) => `${l.scenario}: ${l.score}/${l.total}`);
  const recentDiary = memoryStore.diaryFeedbackLog.slice(0, 2);
  const recentQuestions = (memoryStore.questionLog || []).slice(0, 4).map((q) => q.text);
  const masteryEntries = Object.entries(memoryStore.wordMastery);
  const mastered = masteryEntries.filter(([, e]) => e.stage === "mastered" || e.stage === "confident");
  const weak = masteryEntries.filter(([, e]) => e.stage === "new" || e.stage === "seen").slice(0, 8);
  const practised = masteryEntries.filter(([, e]) => e.stage === "practised").slice(0, 5);
  const streak = computeStreak(activity);
  // Lifetime facts, never derived from the trimmed log — see DEFAULT_MEMORY_STORE.
  const totalLessons = Number.isFinite(memoryStore.lessonsCompleted)
    ? memoryStore.lessonsCompleted : memoryStore.lessonLog.length;
  const firstDate = memoryStore.firstLessonDate
    || (memoryStore.lessonLog[memoryStore.lessonLog.length - 1] || {}).date || todayStr();
  const daysSinceFirst = totalLessons ? Math.max(1, Math.floor((Date.now() - new Date(firstDate).getTime()) / 86400000)) : 0;
  const scenariosDone = [...new Set(memoryStore.lessonLog.map((l) => l.scenario).filter(Boolean))];
  const tp = diaryPages[todayStr()];
  const todayDiary = tp && (tp.notes || tp.skillsDetail || tp.homework) ? (tp.notes || tp.skillsDetail || tp.homework).slice(0, 200) : "";

  const lines = [
    `STUDENT PROFILE`,
    `Name: ${profile.name}. First language: ${lang}. ${countryDisplay(profile.country) ? `From ${countryDisplay(profile.country)}.` : ""} CEFR: ${level}.`,
    Array.isArray(profile.interests) && profile.interests.length ? `Interests they chose: ${profile.interests.join(", ")} — Leo should draw on these for lesson situations and examples where they fit naturally.` : "",
    profile.settlement ? `Time in Australia: ${profile.settlement} — weight survival English if newly arrived, established-life English if settled.` : "",
    Array.isArray(profile.goals) && profile.goals.length ? `What they want English for: ${profile.goals.join(", ")} — prioritise lesson situations that serve these goals.` : "",
    Array.isArray(profile.hardest) && profile.hardest.length ? `What they find hardest right now: ${profile.hardest.join(", ")} — give the matching skill extra weight in today's lesson.` : "",
    profile.occupation ? `Working or studying: ${profile.occupation} — draw vocabulary domain and scenarios from this where it fits.` : "",
    profile.spokenVariety ? `Spoken variety: ${(CHINESE_SPOKEN.find(([k]) => k === profile.spokenVariety) || [])[1] || profile.spokenVariety} — relevant to speaking practice and pronunciation focus.` : "",
    totalLessons ? `Leo has taught this student ${totalLessons} lesson${totalLessons === 1 ? "" : "s"} over ${daysSinceFirst} day${daysSinceFirst === 1 ? "" : "s"}.` : "This is a brand-new student — today is their very first lesson with Leo.",
    streak > 1 ? `Current study streak: ${streak} days — consistency is building.` : "",
    "",
    `RECENT LEARNING`,
    lastLesson ? `Yesterday's lesson: "${lastLesson.scenario}"${typeof lastLesson.score === "number" ? ` (scored ${lastLesson.score}/${lastLesson.total})` : ""}.` : "No previous lesson yet.",
    lastLesson && lastLesson.mission ? `Yesterday's mission: "${lastLesson.mission}" — Leo should ask how it went.` : "",
    lastLesson && lastLesson.tomorrowConnection ? `Yesterday Leo told the student today would build towards: "${lastLesson.tomorrowConnection}" — Leo should honour that promise.` : "",
    recentScores.length > 1 ? `Recent performance: ${recentScores.join("; ")}.` : "",
    scenariosDone.length ? `Situations already practised: ${scenariosDone.slice(0, 8).join(", ")}.` : "",
    "",
    `STRENGTHS & WEAKNESSES`,
    stats.errorTally.length ? `Recurring error areas: ${stats.errorTally.map(([t, c]) => `${t} (${c}x)`).join(", ")}.` : "No particular error patterns yet.",
    mastered.length ? `Words known confidently (${mastered.length}): ${mastered.slice(0, 6).map(([w]) => w).join(", ")}${mastered.length > 6 ? "…" : ""}.` : "",
    weak.length ? `Words still fragile: ${weak.map(([w]) => w).join(", ")}.` : "",
    practised.length ? `Words being practised: ${practised.map(([w]) => w).join(", ")}.` : "",
    "",
    `DIARY & QUESTIONS`,
    todayDiary ? `Today's diary entry (excerpt): "${todayDiary}"` : "",
    recentDiary.length ? `Recent diary feedback: ${recentDiary.map((d) => d.tip || d.praise || "").filter(Boolean).join(" | ")}` : "",
    recentQuestions.length ? `Questions the student has asked Leo recently: ${recentQuestions.join("; ")}` : "",
    "",
    `VOCABULARY TO RECYCLE`,
    weak.length || practised.length ? `These words need more encounters to stick: ${[...weak, ...practised].map(([w]) => w).join(", ")}.` : "No specific words to recycle yet.",
  ];
  return lines.filter((l) => l !== "").join("\n");
}

function LessonPage({ profile, memory, leoMemory, words, heard, diaryPages, activity, errorLog, stats, markActivity, bumpTasks }) {
  const level = levelFor(profile);

  const [phase, setPhase] = useState("loading");   // loading | chooser | planning | lesson | done
  const [planFailCount, setPlanFailCount] = useState(0);
  const [lesson, setLesson] = useState(null);      // { blueprint, sections:{}, stage, perf:{}, status }
  const [reviewOpen, setReviewOpen] = useState(false);
  const [req, setReq] = useState({ context: "", grammar: "", vocabulary: "", skill: "", pronunciation: "" });
  const [sectionLoading, setSectionLoading] = useState(false);
  const [vocabCard, setVocabCard] = useState(null);
  const vocabCache = React.useRef({});

  const bp = lesson && lesson.blueprint;
  const vocabWords = bp ? (bp.vocabulary || []).map((v) => v.word) : [];

  const persist = async (next) => { setLesson(next); await saveKey("esl-task:" + todayStr(), next); };

  useEffect(() => {
    (async () => {
      const saved = await loadKey("esl-task:" + todayStr(), null);
      if (saved && saved.blueprint) { setLesson(saved); setPhase(saved.status && saved.status.done ? "done" : "lesson"); }
      else if (saved && saved.status && saved.status.done) { setLesson(null); setPhase("done"); } // legacy finished lesson
      else setPhase("chooser");
    })();
  }, []);

  /* -- Planner: one AI call builds the blueprint; everything else consumes it -- */
  /* -- Leo's Teaching Brain: think about the student first, then plan -- */
  /* -- Leo's Teaching Brain: TWO-STAGE pipeline.
       Call 1: Leo THINKS about the student (freeform teaching notes).
       Call 2: Leo PLANS the lesson from those notes (structured blueprint).
       Separating thinking from structuring lets the model reflect deeply
       without simultaneously formatting JSON. -- */
  /* ================================================================
     AUTHORED LESSON BYPASS
     When a student selects a teacher-authored lesson, we skip the
     entire AI planning pipeline. prepareAuthoredBlueprint() transforms
     the authored format into the flat runtime blueprint + pre-filled
     sections. The lesson engine treats the result identically to an
     AI-planned lesson — same state shape, same stage progression,
     same component rendering. Zero AI calls for content generation.
     ================================================================ */
  const startAuthored = async (authoredLesson) => {
    const { blueprint, sections } = prepareAuthoredBlueprint(authoredLesson);
    const problems = validateBlueprint(blueprint);
    if (problems.length) {
      console.error("[startAuthored] blueprint validation failed:", problems);
      alert("This lesson has a problem — please let Leo know.");
      return;
    }
    await persist({ blueprint, sections, stage: 0, perf: {}, status: { done: false } });
    setPhase("lesson");
  };

  /* ================================================================
     LEO'S TEACHING BRAIN — MULTI-STAGE PLANNING PIPELINE
     Each stage produces genuine reasoning that the next stage consumes.
     This is not prompt engineering — it is how an experienced teacher
     actually thinks: student first, then needs, then design, then review.
     ================================================================ */
  const plan = async (requests) => {
    setPhase("planning");
    const teacherCtx = buildTeacherContext({
      profile, memoryStore: leoMemory.store, words, heard: heard || [],
      diaryPages, activity: activity || [], errorLog: errorLog || {}, stats: stats || {
        streak: 0, entries: 0, words: words.length, tasks: 0,
        errorTally: [], skillTally: [],
      },
    });
    const reqLines = [
      requests.context ? `The student has asked to work on: "${requests.context}"` : "",
      requests.grammar ? `They want to practise: "${requests.grammar}"` : "",
      requests.vocabulary ? `They want to work on: "${requests.vocabulary}"` : "",
      requests.skill ? `They asked to focus on: ${requests.skill}` : "",
      requests.pronunciation ? `Pronunciation focus: "${requests.pronunciation}"` : "",
    ].filter(Boolean).join("\n");
    const avoidCtx = (teacherCtx.match(/Situations already practised: ([^.]+)/) || ["","none yet"])[1];
    // Stage 2 previously saw only stage 1's prose summary. These pass the same
    // underlying facts directly, so vocabulary and error selection no longer
    // depend on what stage 1 happened to mention. Each degrades to readable
    // text for a brand-new student — never an empty heading.
    const l1 = (LANGS[profile.lang] && LANGS[profile.lang].english) || "not recorded";
    const country = countryDisplay(profile.country) || "not recorded";
    const _mastery = Object.entries((leoMemory.store && leoMemory.store.wordMastery) || {});
    const fragileWords = _mastery.filter(([, e]) => e.stage === "new" || e.stage === "seen")
      .slice(0, 8).map(([w]) => w).join(", ") || "none yet";
    const recycleWords = _mastery.filter(([, e]) => e.stage === "practised")
      .slice(0, 5).map(([w]) => w).join(", ") || "none yet";
    const errorTally = ((stats && stats.errorTally) || [])
      .map(([t, c]) => `${t} (${c}x)`).join(", ") || "none yet";
    // Warm-up variety: the formats used last lesson are explicitly ruled out, so
    // a student rarely meets the same activity format twice in a row.
    const lastFormats = await loadKey("esl-lastwarmup", []);
    const avoidFormats = Array.isArray(lastFormats) ? lastFormats.join(", ") : "";

    try {
      const levelConstraint = CEFR_CONSTRAINTS[level] || null;
      if (!levelConstraint) console.warn(`[CEFR] No constraints defined for ${level} — planner running unconstrained`);
      // ---- STAGE 1: STUDENT ANALYSIS ----
      // Leo thinks only about the student. Not about a lesson. Not about content.
      // "Who is sitting in my classroom tomorrow morning?"
      const studentAnalysis = await askClaude(
        `You are Leo, one of Australia's most experienced ELICOS teachers. Twenty years of teaching international students.\n\nRead everything you know about your student:\n\n${teacherCtx}\n\nNow write a brief STUDENT ANALYSIS. Do not plan a lesson. Do not think about content. Just think about this person:\n\n- Who are they? What kind of learner?\n- How long have I been teaching them? How are they progressing?\n- What has improved recently? What am I proud of?\n- What is still fragile? What keeps causing problems?\n- How confident are they? Has their confidence changed?\n- Did they have a mission? Did they try it?\n- What is their emotional state likely to be today?\n\nWrite 5-8 sentences. Be specific. Use their name. This is your private thinking.`,
        { intent: "student_analysis" }
      );

      // ---- STAGE 2: NEEDS ASSESSMENT ----
      // Leo decides what this student genuinely needs today. Not what would make
      // a good lesson — what THIS STUDENT needs.
      const needsAssessment = await askClaude(
        `You are Leo. You have just analysed your student:\n\n${studentAnalysis}\n\n${reqLines ? "They have asked to work on:\n" + reqLines + "\n\n" : ""}STUDENT'S FIRST LANGUAGE: ${l1}\nCOUNTRY OF ORIGIN: ${country}\n\nVOCABULARY — STILL FRAGILE (not yet mastered): ${fragileWords}\nVOCABULARY — TO RECYCLE (taught but needs revisiting): ${recycleWords}\nRECURRING ERRORS: ${errorTally}\n\nIf several fragile words share a theme — for example, medical vocabulary, financial terms, or housing language — consider whether that theme is itself the right lesson today. A cluster of words that have been fragile for many lessons may be fragile precisely because no lesson has created a natural home for them. Teaching the situation they belong to is better than scattering them one by one across unrelated lessons where they will never stick.\n\nDo NOT repeat these recently-used contexts (choose something completely different): ${avoidCtx}.\n\nNow decide what this student genuinely needs today. Do not plan a lesson yet.\n\nIMPORTANT: You can only teach one thing well today. Choose ONE communicative objective. If this student has multiple needs — different grammar gaps, different skill weaknesses — pick the one that matters most right now and name what you are deliberately leaving for another day and why.\n\nConsider how this student's specific L1 variety affects their English — not just "Spanish" or "Chinese" but the regional variety. A Colombian Spanish speaker and a Peninsular Spanish speaker make different errors. A Cantonese speaker and a Mandarin speaker have different phonological challenges. Teach accordingly.\n\nAnswer these questions:\n\n- What ONE communicative situation would help them most RIGHT NOW in their life in Australia?\n- Why today? Why is this the right lesson for this moment in their learning?\n- What am I deliberately NOT teaching today, and why is that the right call?\n- What specific mistakes do I predict they will make, given their L1 variety?\n- What vocabulary is absolutely essential? (Name 8-10 words they genuinely need.) Include 2-3 words from the fragile or recycle lists above if any fit today's situation naturally — do not force them in if they do not belong.\n- What vocabulary should I deliberately leave out? (Name 2-3 words that are related but not essential.)\n- What grammar naturally arises from this situation?${cefrBlock(level, levelConstraint)}\n- What authentic Australian material could ground this? (A real SMS, menu, sign, notice, email — write the actual text.)\n- What is the one memorable moment I want to create?\n- How should this student feel at the end?\n- What moment of success am I building towards — what is the final thing they will DO?\n\nWrite 8-12 sentences. Be specific. This is your private educational reasoning.`,
        { intent: "needs_assessment" }
      );

      // ---- STAGE 3: LESSON BLUEPRINT ----
      // Now Leo converts his student analysis + needs assessment into a structured plan.
      // Every field must come from the thinking above — not invented fresh.
      const raw = await askClaude(
        `You are Leo. You have analysed your student and assessed their needs. Here is your thinking:\n\nSTUDENT ANALYSIS:\n${studentAnalysis}\n\nNEEDS ASSESSMENT:\n${needsAssessment}\n\nNow convert this thinking into a structured lesson plan. Everything must come from your analysis above — do not invent new content that contradicts your reasoning. The student's CEFR level is ${level}.${cefrBlock(level, levelConstraint)}\n\nRespond ONLY with JSON, no fences:\n${BLUEPRINT_JSON_SHAPE}\n\nExactly 8 vocabulary items from your needs assessment. Every word must justify its place.\n\nWARM-UP: give 3 activities of DIFFERENT types, all contextualised to today's situation — never generic. Choice types (mcq, best_response, true_false, is_this_correct, spot_mistake, complete_dialogue) need options + answer + note. Sequence types (unscramble, order_conversation) need tokens in the CORRECT order + note. Free types (context_discussion, prediction, finish_sentence, mini_task) need only a prompt. ${avoidFormats ? `Do NOT use these formats — the student had them last lesson: ${avoidFormats}.` : ""}`,
        { intent: "blueprint" }
      );
      let blueprint = parseJSON(raw);
      blueprint._teacherNotes = studentAnalysis + "\n\n" + needsAssessment;
      let problems = validateBlueprint(blueprint);
      if (problems.length) {
        // askClaude is stateless: the retry must restate everything — the plan
        // that failed, what was wrong with it, the thinking, and the full shape.
        const raw2 = await askClaude(
          `You are Leo. Fix your lesson plan. Your previous plan was:\n${JSON.stringify(blueprint)}\n\nIt had these problems: ${problems.join(", ")}.\n\nYour thinking was:\nSTUDENT ANALYSIS:\n${studentAnalysis}\n\nNEEDS ASSESSMENT:\n${needsAssessment}\n\nThe student's CEFR level is ${level}.${cefrBlock(level, levelConstraint)} Produce a corrected, complete plan.\n\nRespond ONLY with JSON, no fences:\n${BLUEPRINT_JSON_SHAPE}`,
          { intent: "blueprint" }
        );
        blueprint = parseJSON(raw2);
        blueprint._teacherNotes = studentAnalysis + "\n\n" + needsAssessment;
        problems = validateBlueprint(blueprint);
      }
      if (problems.length) throw new Error("blueprint invalid: " + problems.join(", "));
      // AI-generated lessons are capped at 8 vocabulary items (the matching UI's
      // mobile limit). Authored lessons bypass this function entirely and may
      // include more items — matchVocab controls which subset appears in matching.
      blueprint.vocabulary = blueprint.vocabulary.slice(0, 8);

      // Stage 4 reads fields the blueprint check does not require. These make each
      // one safe. The warm-up list carries type AND prompt: a bare type list cannot
      // answer question 9 (is the warm-up specific to today?) and would always
      // return YES, so the revision pass would never fire. grammar.examples is NOT
      // guarded here — validateBlueprint now requires it, so it is guaranteed.
      const bpRationale = blueprint.lessonRationale || "not stated";
      const bpScaffold = blueprint.scaffoldingStrategy || "not stated";
      const bpWarmUps = (blueprint.warmUpActivities || [])
        .map(a => `${a.type} — ${a.prompt || a.instruction || "(no prompt)"}`).join("\n") || "none given";

      // ---- STAGE 4: EDUCATIONAL REVIEW ----
      // Leo reviews his own lesson as a senior ELICOS teacher would.
      // If anything fails, he revises the blueprint before presenting it.
      const review = await askClaude(
        `You are a senior ELICOS teacher reviewing a colleague's lesson plan. Be critically constructive.\n\nSTUDENT: ${studentAnalysis.slice(0, 300)}\n\nLESSON PLAN:\nContext: ${blueprint.context}\nObjective: ${blueprint.communicativeObjective}\nRationale: ${bpRationale}\n\nVocabulary:\n${blueprint.vocabulary.map(v => `${v.word} — ${v.meaning}`).join("\n")}\n\nGrammar point: ${blueprint.grammar.point}\nGrammar form: ${blueprint.grammar.form}\nGrammar examples: ${blueprint.grammar.examples.join(" / ")}\n\nWarm-up activities:\n${bpWarmUps}\n\nFinal task: ${blueprint.finalTask}\nMemorable moment: ${blueprint.memorableMoment}\nScaffolding: ${bpScaffold}\n\nAnswer YES or NO to each, then explain briefly:\n1. Would I enjoy teaching this lesson?\n2. Does every vocabulary item genuinely support the objective? Check each definition — is it clear and helpful at this level, or vague and circular?\n3. Does the grammar arise naturally from the situation?\n4. Is the authentic material believable?\n5. Does everything build toward the final task — does vocabulary prepare for reading, does reading model the grammar, does grammar support speaking?\n6. Is it memorable?\n7. Would the student leave more confident?\n8. Do the grammar examples practise the target structure and ONLY the target structure? Could a student answer any grammar example correctly without knowing the grammar rule? If so, the examples are testing something else.\n9. Do the warm-up activities feel specific to today's context, or could they appear in any lesson?\n10. Is there anything I would change?\n\nBe honest. If anything needs improving, say exactly what and why.`,
        { intent: "educational_review" }
      );

      // Revise only when the reviewer explicitly answered NO to a checklist
      // question. The prompt demands uppercase YES/NO answers, so a
      // case-sensitive match is deliberate: a lowercase "no" in prose
      // ("no worries") or the echoed question text ("anything I would
      // change?") must not trigger an unnecessary revision pass.
      const needsRevision = /\bNO\b/.test(review);
      if (needsRevision) {
        // Revision failure must never kill a lesson that already passed
        // validation — the reviewed blueprint is a good lesson; the revision
        // is an improvement pass, not a requirement.
        try {
          const revised = await askClaude(
            `You are Leo. Revise your lesson plan. A senior colleague reviewed it and gave this feedback:\n\n${review}\n\nYour current plan is:\n${JSON.stringify(blueprint)}\n\nRevise the plan to address their concerns while keeping everything that already works.\n\nRespond ONLY with JSON, no fences:\n${BLUEPRINT_JSON_SHAPE}`,
            { intent: "blueprint" }
          );
          const revisedBp = parseJSON(revised);
          if (revisedBp && revisedBp.communicativeObjective) {
            // Merge revised fields, keeping anything the revision missed —
            // then re-validate. A revision must never corrupt a valid plan.
            const merged = { ...blueprint };
            Object.keys(revisedBp).forEach((k) => { if (revisedBp[k]) merged[k] = revisedBp[k]; });
            merged.vocabulary = (merged.vocabulary || []).slice(0, 8);
            if (validateBlueprint(merged).length === 0) blueprint = merged;
          }
        } catch { /* keep the validated blueprint */ }
      }
      blueprint._review = review;

      // Remember which warm-up formats today used, so tomorrow avoids them.
      const usedFormats = validateWarmUp(blueprint.warmUpActivities).map((a) => a.type);
      await saveKey("esl-lastwarmup", usedFormats);

      await persist({ blueprint, sections: {}, stage: 0, perf: {}, status: { done: false } });
      setPhase("lesson");
    } catch {
      setPlanFailCount((c) => c + 1);
      setPhase("error");
    }
  };

  /* -- Lazy per-section generation: each stage consumes the blueprint; a failed
        section regenerates alone without touching the rest of the lesson. -- */
  const ensureSection = async (stageId) => {
    if (!bp || lesson.sections[stageId] || sectionLoading) return;
    const needsAI = stageId === "skill" || stageId === "grammar" || stageId === "summary";
    if (!needsAI) return; // intro/vocab/pron/speak consume the blueprint directly
    setSectionLoading(true);
    // Build context from earlier sections so builders reference what came before
    const prior = lesson.sections || {};
    const priorCtx = [
      prior.skill && prior.skill.passage ? `The reading/listening passage used today was: "${prior.skill.passage.slice(0, 250)}"` : "",
    ].filter(Boolean).join("\n");
    const perf = lesson.perf || {};
    const perfLine = `Performance: vocab ${perf.vocab || "not attempted"}, comprehension ${perf.skill || "not attempted"}, grammar ${perf.grammar || "not attempted"}, speaking turns ${perf.speak || 0}`;
    try {
      let raw, data;
      if (stageId === "skill") {
        const notes = bp._teacherNotes ? `Leo's teaching notes: ${bp._teacherNotes.slice(0, 300)}` : "";
        raw = await askClaude(`You are Leo, an experienced ELICOS teacher. ${notes}\nToday's lesson: "${bp.context}" (CEFR ${bp.cefr}).\nCommunicative objective: ${bp.communicativeObjective}\nToday's key vocabulary: ${(bp.vocabulary || []).slice(0,4).map(v=>v.word).join(", ")}\nGrammar focus: ${bp.grammar.point}\n${bp.authenticMaterial ? "Authentic material to base this on: " + bp.authenticMaterial : ""}\nFinal task students are preparing for: ${bp.finalTask || bp.communicativeObjective}\n\nWrite a short ${bp.mainSkill === "listening" ? "listening transcript — a natural conversation between real Australians with hesitations, natural responses. Do NOT label speakers (no 'Tourist:', 'Barista:' etc.) — just present the lines naturally as they would sound" : "reading text — something the student would genuinely encounter in Australia (a message, notice, menu, email, form)"} of 80-150 words. It MUST use at least 3 of today's vocabulary items and model the grammar point naturally. It should prepare students for the final communicative task.\nThen write five comprehension questions moving from gist to detail, each with four options.\nRespond ONLY with JSON, no fences: {"passage":"the text","questions":[{"stem":"","options":["four options"],"answer":"exact text of correct option","note":"one warm teaching line"}]}`,
          { intent: "skill_section" });
        data = parseJSON(raw);
        data.questions = validateQuestions(data.questions);
        if (!data.passage || data.questions.length < 3) throw new Error("skill section invalid");
      } else if (stageId === "grammar") {
        raw = await askClaude(`You are Leo, an experienced ELICOS teacher.\n\nTHE ONE GRAMMAR POINT FOR TODAY — everything must test exactly this and nothing else:\nPoint: "${bp.grammar.point}"\nMeaning: ${bp.grammar.meaning}\nForm: ${bp.grammar.form}\nExamples the student has just been shown: ${(bp.grammar.examples || []).join(" | ")}\n\nContext: ${bp.context} (CEFR ${bp.cefr})\nToday's vocabulary: ${(bp.vocabulary || []).slice(0,5).map(v=>v.word).join(", ")}\nPredicted student difficulties: ${(bp.predictedDifficulties || []).join("; ")}\n${priorCtx}\n\nWrite five practice questions that ALL drill the SAME structure shown in "Form" above. The student has just read the explanation and the examples; these questions must practise precisely that, so the explanation, the examples, the questions, the answers and the feedback are one coherent lesson.\n\nHARD RULES:\n- Every question must test the FORM above (word order, verb form, auxiliary, agreement, preposition, comparative marker — whatever that form uses).\n- Do NOT test a different grammar point. Do NOT test politeness or which sentence "sounds nicer" — that is function, not grammar.\n- Every note must NAME the rule, using the words of the point or the form, so the feedback teaches.\n- Use question types: complete the sentence, find the mistake, choose the correct word order, choose the correct verb form.\n- Set today's situation in the stems, using today's vocabulary where it fits naturally.\n- Randomise where the correct answer sits.\n\nRespond ONLY with JSON, no fences: {"grammarPoint":"copy today's grammar point EXACTLY","questions":[{"stem":"","options":["four options"],"answer":"exact text of correct option","note":"one warm teaching line that names the rule"}]}`,
          { intent: "grammar_section" });
        data = parseJSON(raw);
        data.questions = validateQuestions(data.questions);
        if (data.questions.length < 3) throw new Error("grammar section invalid");
      } else {
        raw = await askClaude(`You are Leo, an experienced ELICOS teacher, writing the closing reflection for today's lesson.\nContext: ${bp.context}\nObjective: ${bp.communicativeObjective}\nEmotional objective: ${bp.emotionalObjective || "build confidence"}\nToday's objective — what the lesson aimed at, NOT an achievement to certify: ${bp.learningOutcome}\nMemorable moment: ${bp.memorableMoment || ""}\nPredicted difficulties: ${(bp.predictedDifficulties || []).join("; ")}\nTomorrow: ${bp.tomorrowConnection || ""}\nStudent: ${memory}\n${perfLine}\n${priorCtx}\n\nWrite a closing summary as a teacher who genuinely cares.\n\n${SUMMARY_HONESTY_RULES}\n\nThey should close feeling: "${bp.emotionalObjective || "more confident"}".\nRespond ONLY with JSON, no fences: {"praise":"","summary":"","strength":"","improvement":"","connection":"","tomorrowPreview":""}`,
          { intent: "lesson_summary" });
        data = parseJSON(raw);
        if (!data.praise) throw new Error("summary invalid");
      }
      // QA: Leo tests the exercise before the student sees it
      const qaProblems = validateSection(stageId, data, bp);
      if (qaProblems.length) {
        console.warn(`[Leo QA] ${stageId} failed self-test:`, qaProblems.join("; "), "— regenerating");
        // One retry with explicit feedback. askClaude is stateless, so the
        // retry restates the failed exercise, the problems, today's
        // vocabulary and the exact JSON shape it must return.
        const retryShape = stageId === "summary"
          ? `{"praise":"","summary":"","strength":"","improvement":"","connection":"","tomorrowPreview":""}`
          : stageId === "skill"
            ? `{"passage":"the text","questions":[{"stem":"","options":["four options"],"answer":"exact text of correct option","note":"one warm teaching line"}]}`
            : `{"grammarPoint":"${bp.grammar && bp.grammar.point}","questions":[{"stem":"","options":["four options"],"answer":"exact text of correct option","note":"one warm teaching line that names the rule"}]}`;
        const retryGuidance = stageId === "summary"
          ? `\nMemorable moment: ${bp.memorableMoment || ""}\nPredicted difficulties: ${(bp.predictedDifficulties || []).join("; ")}\n${perfLine}\n${priorCtx}\n\n${SUMMARY_HONESTY_RULES}`
          : `\nToday's lesson: "${bp.context}" (CEFR ${bp.cefr}). Objective: "${bp.communicativeObjective}". Today's vocabulary: ${(bp.vocabulary || []).map((v) => v.word).join(", ")}.\nTHE ONE GRAMMAR POINT: "${bp.grammar && bp.grammar.point}" — form: ${bp.grammar && bp.grammar.form}. Every question must drill THAT form, and every note must name the rule.`;
        try {
          const retryRaw = await askClaude(`You are Leo, regenerating a lesson exercise. Your ${stageId} exercise was:\n${JSON.stringify(data)}\n\nIt had these problems: ${qaProblems.join("; ")}.\n\nRegenerate this exercise, fixing ALL the problems.${retryGuidance}\n\nRespond ONLY with JSON, no fences:\n${retryShape}`,
        { intent: "section_retry" });
          const retryData = parseJSON(retryRaw);
          if (retryData) {
            if (retryData.questions) retryData.questions = validateQuestions(retryData.questions);
            const retryQa = validateSection(stageId, retryData, bp);
            if (retryQa.length === 0) data = retryData; // use the fixed version
          }
        } catch { /* keep the original if retry fails */ }
      }
      await persist({ ...lesson, sections: { ...lesson.sections, [stageId]: data } });
    } catch {
      // Graceful fallback per section — the lesson never breaks.
      // Grammar: the explanation lives on the blueprint and is ALWAYS available.
      // Losing the practice questions must never lose the teaching itself —
      // that's the difference between a jammed photocopier and a cancelled class.
      const fallback = stageId === "grammar"
        ? { grammarPoint: bp.grammar && bp.grammar.point, questions: [], explanationOnly: true }
        : stageId === "summary"
          ? { praise: "You showed up and did the work today — that's what progress is made of.", summary: `Today you practised ${bp.context.toLowerCase()}.`, strength: "Your persistence.", improvement: "Keep using today's phrases out loud.", connection: "Today's language belongs outside this app — use one line of it the next time you're in that situation.", tomorrowPreview: "Tomorrow we'll build on this again." }
          : null;
      if (fallback) await persist({ ...lesson, sections: { ...lesson.sections, [stageId]: fallback } });
      else await persist({ ...lesson, sections: { ...lesson.sections, [stageId]: { skipped: true } } });
    }
    setSectionLoading(false);
  };

  useEffect(() => {
    if (phase !== "lesson" || !lesson) return;
    const stageId = LESSON_STAGES[lesson.stage].id;
    ensureSection(stageId);
  }, [phase, lesson && lesson.stage]);

  // If a section could not be generated even after retry, it is marked
  // { skipped: true } — quietly move past it. This is an effect, never a
  // render-time side effect: advancing persists state, and persisting
  // during render causes duplicate writes and React update-in-render errors.
  useEffect(() => {
    if (phase !== "lesson" || !lesson) return;
    const s = lesson.sections[LESSON_STAGES[lesson.stage].id];
    if (s && s.skipped) skip();
  }, [phase, lesson]);

  const advance = async (perfPatch) => {
    const nextStage = Math.min(lesson.stage + 1, LESSON_STAGES.length - 1);
    await persist({ ...lesson, stage: nextStage, perf: { ...lesson.perf, ...(perfPatch || {}) } });
  };
  const skip = () => advance();

  const finish = async () => {
    const perf = lesson.perf || {};
    const parse = (s) => { const m = /(\d+)\/(\d+)/.exec(s || ""); return m ? [+m[1], +m[2]] : [0, 0]; };
    const [c1, t1] = parse(perf.vocab); const [c2, t2] = parse(perf.skill); const [c3, t3] = parse(perf.grammar);
    await persist({ ...lesson, status: { done: true } });
    await saveKey("esl-lastscenario", bp.context);
    await markActivity(); await bumpTasks();
    // Every word Leo taught enters the Word Bank, so the review can reach it.
    // All of bp.vocabulary, not just the matched subset: stage 2 chose these
    // eight deliberately, and the student met every one.
    if (leoMemory.saveWords) await leoMemory.saveWords((bp.vocabulary || []).map((v) => v.word));
    leoMemory.recordLesson({
      scenario: bp.context, skill: bp.mainSkill, score: c1 + c2 + c3, total: (t1 + t2 + t3) || 1,
      word: bp.vocabulary[0] && bp.vocabulary[0].word, mission: bp.mission || "", template: "BP",
      tomorrowConnection: bp.tomorrowConnection,
      memorableMoment: bp.memorableMoment, finalTask: bp.finalTask,
    });
    setPhase("done");
  };

  /* -- Vocabulary card: blueprint words answer instantly from the blueprint itself;
        anything else falls back to a lightweight AI lookup. -- */
  const handleVocabTap = (word) => {
    const item = bp && (bp.vocabulary || []).find((v) => v.word.toLowerCase() === word.toLowerCase());
    if (item) {
      setVocabCard({ word: item.word, data: { ipa: item.ipa, pos: item.pos, cefr: bp.cefr, definition: item.meaning, lessonExample: item.example, examples: item.examples || [], related: item.related || [] }, loading: false });
      return;
    }
    if (vocabCache.current[word]) { setVocabCard({ word, data: vocabCache.current[word], loading: false }); return; }
    setVocabCard({ word, data: null, loading: true });
    askClaude(`You are Leo, a warm Australian English teacher. A student in a lesson about "${bp ? bp.context : "English"}" tapped on the word "${word}". Give them a quick, friendly vocabulary card. Respond ONLY with JSON, no fences: {"ipa":"","pos":"","cefr":"","definition":"simple English, one sentence","lessonExample":"","examples":["",""],"related":["","",""]}`,
      { intent: "vocab_card" })
      .then((raw) => { const data = parseJSON(raw); vocabCache.current[word] = data; setVocabCard({ word, data, loading: false }); })
      .catch(() => setVocabCard({ word, data: { ipa: "", pos: "", cefr: level, definition: `Ask Leo in the chat to learn more about "${word}".`, examples: [], related: [] }, loading: false }));
  };
  const isSaved = (word) => (words || []).some((w) => w.word.toLowerCase() === word.toLowerCase());

  /* ---------------- render ---------------- */
  if (phase === "error") return (
    <div>
      <SectionTitle>Leo's Lesson</SectionTitle>
      <div className="leo-accent text-leo" style={{ padding: "var(--space-4)", marginTop: "var(--space-5)" }}>
        {planFailCount < 2
          ? <><p>I'm having trouble with that one — let me try again.</p>
              <button className="primary-btn" style={{ marginTop: "var(--space-3)" }} onClick={() => { setPhase("chooser"); }}>Try again</button></>
          : <p>Something's not working on my end. Your progress is saved — come back in a moment and we'll pick up right where we left off.</p>}
      </div>
    </div>
  );
  if (phase === "loading") return <LeoLoader label="I'm opening today's lesson…" />;
  if (phase === "planning") return (<div><SectionTitle>Leo's Lesson</SectionTitle><LeoLoader label="I'm planning today's lesson for you…" /></div>);

  if (phase === "chooser") {
    // Authored lessons available to this student (future: filter by cefr, completion)
    const availableAuthored = AUTHORED_LESSONS.filter((l) => l.metadata && l.metadata.id);
    return (
    <div>
      <SectionTitle>Leo's Lesson</SectionTitle>
      <Card>
        <div className="lesson-head leo-accent"><p className="lesson-greeting text-leo">How would you like to study today?</p></div>
        <button className="primary-btn wide" style={{ marginBottom: 10 }} onClick={() => plan({})}>📚 Leo chooses today's lesson</button>
        <button className="ghost-btn wide" onClick={() => setReviewOpen(!reviewOpen)}>🎓 I want to review something from today's class</button>
        {reviewOpen && (
          <div className="review-form">
            <p className="muted small">Tell me as much or as little as you like — I'll plan the rest.</p>
            <label className="input-label" htmlFor="req-context">Topic or situation (e.g. food, at the doctor)</label>
            <input id="req-context" className="text-input" value={req.context} onChange={(e) => setReq({ ...req, context: e.target.value })} />
            <label className="input-label" htmlFor="req-grammar">Grammar (e.g. present perfect)</label>
            <input id="req-grammar" className="text-input" value={req.grammar} onChange={(e) => setReq({ ...req, grammar: e.target.value })} />
            <label className="input-label" htmlFor="req-vocab">Vocabulary (e.g. words from today's class)</label>
            <input id="req-vocab" className="text-input" value={req.vocabulary} onChange={(e) => setReq({ ...req, vocabulary: e.target.value })} />
            <label className="input-label">Main skill</label>
            <div className="btn-row">
              {["reading", "listening"].map((s) => (
                <button key={s} className={req.skill === s ? "primary-btn" : "ghost-btn"} onClick={() => setReq({ ...req, skill: req.skill === s ? "" : s })}>{s}</button>
              ))}
            </div>
            <label className="input-label" htmlFor="req-pron">Pronunciation focus (optional)</label>
            <input id="req-pron" className="text-input" value={req.pronunciation} onChange={(e) => setReq({ ...req, pronunciation: e.target.value })} />
            <button className="primary-btn wide" style={{ marginTop: 10 }} onClick={() => plan(req)}>Plan my lesson</button>
          </div>
        )}
      </Card>
      {availableAuthored.length > 0 && (
        <Card>
          <h3>Teacher lessons</h3>
          <p className="muted small">Lessons written by Leo — ready to go, no waiting.</p>
          {availableAuthored.map((al) => (
            <button key={al.metadata.id} className="ghost-btn wide" style={{ marginTop: 8, textAlign: "left" }}
              onClick={() => startAuthored(al)}>
              🏖️ {al.metadata.title}
              <span className="muted small" style={{ display: "block", marginTop: 2 }}>{al.metadata.cefr} · {al.metadata.topic}</span>
            </button>
          ))}
        </Card>
      )}
    </div>
    );
  }

  if (phase === "done") return (
    <div>
      <SectionTitle>Leo's Lesson</SectionTitle>
      <Card>
        <div className="lesson-head leo-accent"><h3 style={{ margin: 0 }}>Lesson complete! 🎉</h3></div>
        <p className="muted">Great work today{bp ? ` on “${bp.context}”` : ""}. Small steps every day add up — Leo's proud of you.</p>
        <button className="primary-btn wide" style={{ marginTop: 14 }} onClick={async () => { setLesson(null); await saveKey("esl-task:" + todayStr(), null); setPhase("chooser"); }}>Do another lesson</button>
      </Card>
    </div>
  );

  // phase === "lesson"
  const stage = LESSON_STAGES[lesson.stage];
  const section = lesson.sections[stage.id];
  const needsAI = stage.id === "skill" || stage.id === "grammar" || stage.id === "summary";
  const stageProps = { bp, vocab: vocabWords, onVocabTap: handleVocabTap, onSkip: skip };

  return (
    <div>
      <SectionTitle sub={`${bp.context} · ${stage.label} · ${lesson.stage + 1} of ${LESSON_STAGES.length}`}>Leo's Lesson</SectionTitle>
      <div className="progress-bar"><span style={{ width: `${((lesson.stage + 1) / LESSON_STAGES.length) * 100}%` }} /></div>
      {STAGE_BRIDGE_TEXT[stage.id] && <p className="leo-accent text-leo" style={{ marginTop: "var(--space-5)", marginBottom: "var(--space-3)" }}>{STAGE_BRIDGE_TEXT[stage.id]}</p>}

      {needsAI && (!section || sectionLoading || section.skipped) && <LeoLoader label="I'm preparing this part…" />}

      {stage.id === "intro" && <IntroductionSection {...stageProps} onDone={(n) => advance({ intro: n })} />}
      {stage.id === "vocab" && <VocabularySection {...stageProps} leoMemory={leoMemory} onDone={(c, t) => advance({ vocab: `${c}/${t}` })} />}
      {stage.id === "pron" && <PronunciationSection {...stageProps} onDone={() => advance({ pron: "done" })} />}
      {stage.id === "speak" && <SpeakingSection {...stageProps} memory={memory} onDone={(n) => advance({ speak: n })} />}
      {stage.id === "skill" && section && !section.skipped && <SkillSection {...stageProps} section={section} onDone={(c, t) => advance({ skill: `${c}/${t}` })} />}
      {stage.id === "grammar" && section && !section.skipped && <GrammarSection {...stageProps} section={section} onDone={(c, t) => advance({ grammar: `${c}/${t}` })} />}
      {stage.id === "summary" && section && <SummarySection bp={bp} section={section} vocab={vocabWords} onVocabTap={handleVocabTap} onFinish={finish} />}

      <VocabCardSheet card={vocabCard} lesson={null} onClose={() => setVocabCard(null)}
        onSave={() => vocabCard && leoMemory.saveWord && leoMemory.saveWord(vocabCard.word)}
        isSaved={vocabCard ? isSaved(vocabCard.word) : false} />
    </div>
  );
}

/* ---------------- Questions (English only) ---------------- */

/* Sentinel the model emits when it refuses an off-topic question, stripped
   before display — same convention as the report's [SECTION_6_OMITTED].
   The refusal RULE is unchanged: this only lets the app know a refusal
   happened, so the wall can be presented as a doorway (spec A6). */
const OFF_TOPIC_MARK = "[OFF_TOPIC]";
const readReply = (raw) => {
  const t = (raw || "").trimStart();
  return t.startsWith(OFF_TOPIC_MARK)
    ? { offTopic: true, content: t.slice(OFF_TOPIC_MARK.length).trimStart() }
    : { offTopic: false, content: raw };
};

// Multi-turn chat call: sends the whole history so the tutor remembers context
// Runs the English tutor through the same proven API call the rest of the app uses,
// by serialising the conversation into a single prompt.
async function askTutor(system, history, question) {
  const convo = history
    .map((m) => (m.role === "user" ? "" : "Tutor: ") + m.content)
    .join("\n\n");
  const prompt = `${system}\n\n${convo ? "Conversation so far:\n" + convo + "\n\n" : ""}The student now says: "${question}"\n\nReply as the tutor, in plain text only (no JSON, no labels).`;
  return askClaude(prompt, { intent: "chat_reply" });
}

function QuestionsPage({ profile, memory, leoMemory, pendingAsk, onPendingHandled, markActivity, onOpenAustralia }) {
  const [messages, setMessages] = useState([]); // {role, content}
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = React.useRef(null);

  const SYSTEM = `You are Leo, a warm, patient and experienced Australian English teacher — the student's trusted learning companion. Never describe yourself as an AI, chatbot, assistant or model; you are simply Leo, their teacher. What you know about this student: ${memory}. They live in Australia.

LEO'S WAY: celebrate what the student does well before correcting anything; treat mistakes as valuable learning opportunities; never embarrass them; prefer the one or two corrections that matter most; use Australian English spelling and, where natural, Australian examples. When the student makes a mistake, gently PROMPT them to self-correct before giving the answer (this helps it stick), and when they are already correct, UPGRADE them with a more natural or more Australian way to say it rather than only approving.

STRICT TOPIC RULE: You ONLY help with the English language — grammar, vocabulary, pronunciation, spelling, meaning, word choice, phrasal verbs, idioms, writing, punctuation, differences between words, example sentences, and how to say things in English. This includes Australian English usage.

If the student asks about ANYTHING that is not about learning English (for example maths, history, coding, news, personal advice, homework in other subjects, medical or legal questions, general knowledge), you must politely refuse in simple English and gently steer them back — say you can only help with English, and give an example of an English question they could ask instead. Never answer the off-topic question, even partly. When you refuse for this reason, begin your reply with the exact token ${OFF_TOPIC_MARK} before any other text. Use this token ONLY when refusing an off-topic question — never in any other reply.

STYLE: Reply in clear, simple English suitable for their level. Keep answers focused and not too long. Use short examples. You may give a one-word translation into ${LANGS[profile.lang].english} in brackets ONLY if it helps them understand a hard word. Be encouraging.`;

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    (async () => {
      const saved = await loadKey("esl-chat", []);
      setMessages(saved);
      setLoaded(true);
    })();
  }, []);

  // Questions handed to Leo from other pages (dictionary, heard today)
  useEffect(() => {
    if (loaded && pendingAsk) {
      const q = pendingAsk;
      onPendingHandled();
      send(q);
    }
  }, [loaded, pendingAsk]);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking]);

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || thinking) return;
    const nextMsgs = [...messages, { role: "user", content: q }];
    setMessages(nextMsgs);        // user's message appears immediately…
    setInput("");                 // …and the input clears, permanently
    setThinking(true);
    if (leoMemory) leoMemory.recordQuestion(q); // M6: contributes to Leo's understanding of the learner
    saveKey("esl-chat", nextMsgs.slice(-40)).catch(() => {}); // keep it even if the reply fails
    try {
      const raw = await askTutor(SYSTEM, messages, q);
      const { offTopic, content } = readReply(raw);
      const withReply = [...nextMsgs, { role: "assistant", content, offTopic, askedAbout: offTopic ? q : undefined }];
      setMessages(withReply);
      // Persistence must never be able to roll back a shown reply:
      saveKey("esl-chat", withReply.slice(-40)).catch(() => {});
      markActivity();
    } catch (e) {
      console.error("[Ask Leo] send failed — full error:", e);
      // During development, show the REAL reason (status + api error type + message)
      // instead of a generic line, and keep the user's message + cleared input.
      const detail = e && e.message ? e.message : String(e);
      const withError = [...nextMsgs, { role: "assistant", content: "⚠️ I couldn't reply just now.\nReason: " + detail }];
      setMessages(withError);
      saveKey("esl-chat", withError.slice(-40)).catch(() => {});
    }
    setThinking(false);
  };

  const clearChat = async () => {
    setMessages([]);
    await saveKey("esl-chat", []);
  };

  return (
    <div className="chat-wrap">
      <div className="chat-banner">
        <span>💬 Ask Leo anything about <strong>English</strong> — grammar, words, pronunciation, spelling. Leo only helps with English!</span>
        {messages.length > 0 && <button className="clear-chat" onClick={clearChat}>Clear</button>}
      </div>

      <div className="chat-scroll">
        {messages.length === 0 && (
          <div className="chat-empty"> <p className="chat-empty-title">G'day {profile.name}! I'm Leo, your English teacher. What would you like to know?</p>
          </div>
        )}
        {messages.map((m, i) => (
          <React.Fragment key={i}>
            <div className={"bubble-row " + (m.role === "user" ? "row-user" : "row-bot")}>
              {m.role === "assistant" && <span className="bot-avatar-leo">L</span>}
              <div className={"bubble " + (m.role === "user" ? "bubble-user" : "bubble-bot")}>{m.content}</div>
            </div>
            {/* The refusal becomes a doorway (spec A6): Leo's line, and one
                control that opens Australia carrying the question across. */}
            {m.offTopic && onOpenAustralia && (
              <div className="leo-card doorway">
                <p className="doorway-line">That's not English practice, but there are answers about life in Australia next door — shall I show you?</p>
                <button className="primary-btn wide" onClick={() => onOpenAustralia(m.askedAbout || "")}>Show me</button>
              </div>
            )}
          </React.Fragment>
        ))}
        {thinking && <ChatTypingRow />}
        <div ref={endRef} />
      </div>

      <div className="chat-input-bar">
        <textarea
          className="chat-input"
          rows={1}
          placeholder="Ask Leo an English question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          aria-label="Type your English question"
        />
        <button className="chat-send" onClick={() => send()} disabled={!input.trim() || thinking} aria-label="Send question">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

/* ---------------- Dictionary ---------------- */

function DictionaryPage({ profile, words, setWords, markActivity, onAskLeo, leoMemory }) {
  const [tab, setTab] = useState("dictionary");
  const [query, setQuery] = useState("");
  const [dict, setDict] = useState(null);
  const [thes, setThes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (term) => {
    const q = (term !== undefined ? term : query).trim();
    if (!q) return;
    if (term !== undefined) setQuery(term);
    setLoading(true); setError(null);
    if (tab === "dictionary") setDict(null); else setThes(null);
    try {
      if (tab === "dictionary") {
        const raw = await askClaude(
          `Dictionary entry for an adult ESL student (first language: ${LANGS[profile.lang].english}). Word or phrase: "${q}". Respond ONLY with JSON, no fences:\n{"word":"the word","ipa":"IPA pronunciation","pos":"part of speech","cefr":"CEFR level A1-C2 if known, else empty string","definition":"clear definition in simple English","example":"one natural example sentence","collocations":["up to 4 common collocations or word partners"]}`,
          { intent: "dictionary" }
        );
        const r = parseJSON(raw);
        setDict(r);
        if (!words.find((w) => w.word.toLowerCase() === r.word.toLowerCase())) {
          const next = [{ word: r.word, date: todayStr() }, ...words].slice(0, WORD_BANK_CAP);
          setWords(next); await saveKey("esl-words", next);
          leoMemory.touchWord(r.word);
        }
      } else {
        const raw = await askClaude(
          `Thesaurus entry for an adult ESL student (first language: ${LANGS[profile.lang].english}). Word: "${q}". Respond ONLY with JSON, no fences:\n{"word":"the word","synonyms":["up to 6 synonyms"],"antonyms":["up to 4 antonyms"],"phrases":["up to 4 common phrases or idioms using it"],"examples":["up to 2 example sentences"]}`,
          { intent: "thesaurus" }
        );
        setThes(parseJSON(raw));
      }
      await markActivity();
    } catch { setError("Couldn't find that — check the spelling and try again."); }
    setLoading(false);
  };

  return (
    <div>
      <SectionTitle sub="Look up words, or explore similar and opposite words.">Dictionary &amp; thesaurus</SectionTitle>

      <div className="tabs">
        <button className={"tab " + (tab === "dictionary" ? "tab-on" : "")} onClick={() => { setTab("dictionary"); setError(null); }}>Dictionary</button>
        <button className={"tab " + (tab === "thesaurus" ? "tab-on" : "")} onClick={() => { setTab("thesaurus"); setError(null); }}>Thesaurus</button>
      </div>

      <div className="search-row">
        <input className="text-input" placeholder={tab === "dictionary" ? "e.g. achievement" : "e.g. happy"} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} />
        <button className="primary-btn" onClick={search} disabled={loading}><Search size={16} /></button>
      </div>
      {loading && <Spinner label="Looking it up…" />}
      {error && <p className="bad">{error}</p>}
      {!loading && !dict && !thes && words.length === 0 && (
        <Card className="center"> <h3>Your personal dictionary</h3>
          <p className="muted">Look up any English word and Leo will explain it simply — with a clear definition, an example, and word partners. Every word you check is saved to your Word Bank.</p>
        </Card>
      )}

      {tab === "dictionary" && dict && (
        <Card>
          <h3 className="dict-word">{dict.word} {dict.ipa && <span className="ipa">{dict.ipa}</span>} <span className="pos">{dict.pos}</span> {dict.cefr && <span className="cefr-badge">{dict.cefr}</span>}</h3>
          <p>{dict.definition}</p>
          <p className="muted small">“{dict.example}”</p>
          {dict.collocations?.length > 0 && <p className="small"><strong>Common word partners:</strong> {dict.collocations.join(" · ")}</p>}
          <button className="ghost-btn" style={{ marginTop: 10 }} onClick={() => onAskLeo(`Can you explain the word "${dict.word}" with more examples?`)}><Sparkles size={14} /> Ask Leo about this word</button>
        </Card>
      )}

      {tab === "thesaurus" && thes && (
        <Card>
          <h3 className="dict-word">{thes.word}</h3>
          {thes.synonyms?.length > 0 && <div className="thes-block"><span className="thes-label">Similar words</span><div className="tag-row">{thes.synonyms.map((s) => <button key={s} className="chip" onClick={() => search(s)}>{s}</button>)}</div></div>}
          {thes.antonyms?.length > 0 && <div className="thes-block"><span className="thes-label">Opposite words</span><div className="tag-row">{thes.antonyms.map((s) => <span key={s} className="chip chip-plain">{s}</span>)}</div></div>}
          {thes.phrases?.length > 0 && <div className="thes-block"><span className="thes-label">Common phrases</span><ul className="help-list">{thes.phrases.map((p, i) => <li key={i}>{p}</li>)}</ul></div>}
          {thes.examples?.length > 0 && <div className="thes-block"><span className="thes-label">Examples</span>{thes.examples.map((e, i) => <p key={i} className="muted small">“{e}”</p>)}</div>}
        </Card>
      )}

      {tab === "dictionary" && words.length > 0 && (
        <Card>
          <h3>My word bank ({words.length})</h3>
          <div className="tag-row">
            {words.slice(0, 30).map((w) => (
              <button key={w.word} className="chip" onClick={() => { setTab("dictionary"); search(w.word); }}>{w.word}</button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ---------------- Heard today ---------------- */

function HeardPage({ profile, heard, setHeard, markActivity, onAskLeo, leoMemory }) {
  const [input, setInput] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [listening, setListening] = useState(false);
  const recRef = React.useRef(null);
  const voiceOK = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const startVoice = () => {
    if (!voiceOK) { alert("Voice input isn't supported in this browser. Please type instead."); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-AU"; rec.interimResults = false; rec.maxAlternatives = 1;
    rec.onresult = (e) => setInput(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  };
  const stopVoice = () => { try { recRef.current && recRef.current.stop(); } catch {} setListening(false); };

  const add = async () => {
    if (!input.trim()) return;
    const item = { id: Date.now(), phrase: input.trim(), date: todayStr(), info: null };
    const next = [item, ...heard].slice(0, HEARD_CAP); // bound growth — see HEARD_CAP
    setHeard(next); await saveKey("esl-heard", next); await markActivity();
    leoMemory.touchWord(item.phrase); // H3: enters Leo's vocabulary memory at "new" mastery
    setInput("");
    explain(item, next);
  };

  const explain = async (item, list) => {
    setBusyId(item.id);
    try {
      const raw = await askClaude(
        `An ESL student in Australia (first language: ${LANGS[profile.lang].english}) heard this English word or phrase in real life: "${item.phrase}". Explain it like a smart dictionary. Respond ONLY with JSON, no fences: {"meaning":"clear simple English explanation; note if it is Australian slang","ipa":"IPA pronunciation or empty","pos":"part of speech or empty","example":"one example sentence","collocations":["up to 3 common word partners, or empty"],"formality":"casual, neutral, or formal"}`,
        { intent: "heard_explain" }
      );
      const info = parseJSON(raw);
      const base = list || heard;
      const nx = base.map((h) => (h.id === item.id ? { ...h, info } : h));
      setHeard(nx); await saveKey("esl-heard", nx);
    } catch { alert("I'm having trouble with that one — tap it to try again."); }
    setBusyId(null);
  };

  const remove = async (id) => {
    const next = heard.filter((h) => h.id !== id);
    setHeard(next); await saveKey("esl-heard", next);
  };

  return (
    <div>
      <SectionTitle sub="Caught a word on the bus, at work, in a café? Type it or say it, and get a full explanation.">English I heard today</SectionTitle>
      <div className="search-row">
        <input className="text-input" placeholder="e.g. “no worries” or “I'm flat out”…" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
        <button className={"mic-btn " + (listening ? "mic-on" : "")} onClick={listening ? stopVoice : startVoice} aria-label="Speak a word or phrase"><Mic size={18} /></button>
        <button className="primary-btn" onClick={add}><Plus size={16} /></button>
      </div>
      {listening && <p className="muted small center">🎤 Listening… say a word or phrase.</p>}

      {heard.map((h) => (
        <Card key={h.id}>
          <div className="entry-head">
            <span className="q-sentence">“{h.phrase}”</span>
            <button className="icon-btn" onClick={() => remove(h.id)}><Trash2 size={14} /></button>
          </div>
          {busyId === h.id && <Spinner label="Leo is looking it up…" />}
          {!(h.info || h.explanation) && busyId !== h.id && (
            <button className="ghost-btn" onClick={() => explain(h)}><Sparkles size={14} /> Ask Leo what it means</button>
          )}
          {(() => { const info = h.info || h.explanation; return info && (
            <div className="feedback">
              <p>{info.meaning} {info.formality && <span className="pos">{info.formality}</span>}</p>
              {(info.ipa || info.pos) && <p className="small">{info.ipa && <span className="ipa">{info.ipa}</span>} {info.pos && <span className="pos">{info.pos}</span>}</p>}
              <p className="muted small">“{info.example}”</p>
              {info.collocations?.length > 0 && <p className="small"><strong>Often used with:</strong> {info.collocations.join(" · ")}</p>}
              <button className="link-btn small" onClick={() => onAskLeo(`Can you teach me more about the phrase "${h.phrase}"?`)}>Ask Leo more about this</button>
            </div>
          ); })()}
        </Card>
      ))}
      {heard.length === 0 && <p className="muted center">Nothing collected yet — keep your ears open today!</p>}
    </div>
  );
}

/* ---------------- Australia ---------------- */

function HelpSection({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={"accordion" + (open ? " accordion-open" : "")}>
      <button className="accordion-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="accordion-icon" aria-hidden="true">{item.icon}</span>
        <span className="accordion-title">{item.title}</span>
        <span className="accordion-chev" aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="accordion-body">
          {item.display && (
            <div className="emergency-box">
              {item.display.map(([em, label]) => (
                <div key={label} className="emergency-line"><span aria-hidden="true">{em}</span> <strong>{label}</strong></div>
              ))}
            </div>
          )}
          <p className="help-intro">{item.intro}</p>
          {item.points && (
            <ul className="help-list">
              {item.points.map((pt, i) => <li key={i}>{pt}</li>)}
            </ul>
          )}
          {item.subsections && item.subsections.map((sub) => (
            <div key={sub.heading} className="help-sub">
              <h4 className="help-sub-head">{sub.heading}</h4>
              <ul className="help-list">
                {sub.points.map((pt, i) => <li key={i}>{pt}</li>)}
              </ul>
              {sub.url && <a className="help-link" href={sub.url} target="_blank" rel="noopener noreferrer">Learn more <ExternalLink size={13} /></a>}
            </div>
          ))}
          {item.url && <a className="help-link" href={item.url} target="_blank" rel="noopener noreferrer">Learn more <ExternalLink size={13} /></a>}
          {item.urls && (
            <div className="help-link-row">
              {item.urls.map(([label, url]) => (
                <a key={url} className="help-link" href={url} target="_blank" rel="noopener noreferrer">{label} <ExternalLink size={13} /></a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AustraliaPage({ profile, memory, initialQuery }) {
  /* Australia is a book Leo left on the desk (spec A6). Third person
     throughout — never "I", never Leo's voice, no accent bar, plain white
     cards. Browse first: the topic list IS the content and is never empty.
     Search sits BELOW the list; placement is the signal that this is a book
     with an index, not an assistant to interrogate. */
  const [open, setOpen] = useState(null);
  const [q, setQ] = useState(initialQuery || "");
  const [ans, setAns] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (initialQuery) setQ(initialQuery); }, [initialQuery]);

  const firstSentence = (t) => {
    const m = (t || "").match(/^[^.!?]*[.!?]/);
    return m ? m[0].trim() : (t || "");
  };

  const ask = async () => {
    if (!q.trim()) return;
    setLoading(true); setAns(null);
    try {
      const text = await askClaude(
        `Write a short reference note for an international student living in Australia. This is reference material, NOT a teacher speaking: use the third person, never write "I", never address the reader as a student, and do not offer to help further. Plain, factual, practical. Under 120 words, clear simple English. If the question involves visas, tax, health or legal matters, give general guidance and name the official body to check (for example Home Affairs, the ATO, Fair Work, Service NSW). Question: "${q.trim()}"`,
        { intent: "australia_ask" }
      );
      setAns(text);
    } catch { setAns("That information could not be loaded just now. Please try again."); }
    setLoading(false);
  };

  const topic = open !== null ? AUS_HELP[open] : null;

  if (topic) {
    const Icon = topic.icon;
    return (
      <div className="aus-wrap">
        <button className="back-btn" onClick={() => setOpen(null)}><ChevronLeft size={20} /> All topics</button>
        <div className="aus-detail">
          <h2 className="aus-detail-title"><Icon size={24} className="aus-detail-icon" /> {topic.title}</h2>
          <p className="aus-intro">{topic.intro}</p>
          <ul className="aus-points">
            {(topic.points || []).map((pt, i) => <li key={i}>{pt}</li>)}
          </ul>
          {topic.url && (
            <a className="ghost-btn aus-source" href={topic.url} target="_blank" rel="noreferrer">
              Official source <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="aus-wrap">
      <ul className="aus-list">
        {AUS_HELP.map((item, i) => {
          const Icon = item.icon;
          return (
            <li key={item.title}>
              <button className="aus-card" onClick={() => setOpen(i)}>
                <Icon size={24} className="aus-card-icon" />
                <span className="aus-card-text">
                  <span className="aus-card-title">{item.title}</span>
                  <span className="aus-card-sum">{firstSentence(item.intro)}</span>
                </span>
                <ChevronRight size={18} className="aus-card-chev" />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="aus-search">
        <label className="aus-search-label" htmlFor="aus-q">Look something up</label>
        <div className="aus-search-row">
          <input id="aus-q" className="aus-input" placeholder="e.g. How do I see a doctor?"
            value={q} onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask()} />
          <button className="primary-btn" onClick={ask} disabled={loading} aria-label="Search"><Search size={16} /></button>
        </div>
        {loading && <Spinner label="Looking that up…" />}
        {ans && <p className="aus-answer">{ans}</p>}
      </div>
    </div>
  );
}

/* ---------------- Onboarding ---------------- */

/* Post-sign-in contextual UI hook — structural insertion point for future
   Australian contextual elements (icons, environmental details, etc.).
   Renders nothing. Exists only as plumbing so future tasks can add children
   without modifying the app scaffold. Can be removed entirely without
   affecting any feature or identity element. */
/* ---------- Whiteboard logo ----------
   The Ask Leo mark. Geometry FROZEN from askleo-mark-animready.svg.
   Do not derive, recompute, round, or alter any coordinate.

   Three-tier size rule:
     ≥ 80px  — Full mark (frame path + letter paths)
     48–79px — Frame path only
     < 48px  — "L" monogram

   Props:
     width    — scales via viewBox
     animate  — plays the draw sequence (splash only)
     onDone   — fires after animated sequence completes */

const FRAME_PATH = "M 420,548 L 49,548 L 359,317 L 0,527 L 0,0 L 796,0 L 796,548 L 420,548";
const FRAME_LEN = 3450;

const LETTER_PATHS = [
  /* A */ "M100.70947265625 278.0 130.03564453125 197.970703125H139.05908203125L168.65380859375 278.0H160.59716796875L151.94970703125 254.2060546875H117.30615234375L108.81982421875 278.0ZM119.72314453125 247.4384765625H149.47900390625L141.58349609375 225.685546875Q140.13330078125 221.7109375 138.41455078125 216.5009765625Q136.69580078125 211.291015625 134.49365234375 204.1474609375Q132.34521484375 211.3447265625 130.599609375 216.6083984375Q128.85400390625 221.8720703125 127.51123046875 225.685546875Z",
  /* S */ "M224.35888671875 279.3427734375Q212.05908203125 279.3427734375 204.70068359375 273.380859375Q197.34228515625 267.4189453125 196.69775390625 257.7509765625H204.48583984375Q205.07666015625 264.89453125 210.7431640625 268.654296875Q216.40966796875 272.4140625 224.35888671875 272.4140625Q230.32080078125 272.4140625 234.9130859375 270.4267578125Q239.50537109375 268.439453125 242.13720703125 264.89453125Q244.76904296875 261.349609375 244.76904296875 256.5693359375Q244.76904296875 250.5537109375 240.20361328125 247.384765625Q235.63818359375 244.2158203125 228.11865234375 241.9599609375L218.66552734375 239.220703125Q209.10498046875 236.427734375 203.94873046875 231.40576171875Q198.79248046875 226.3837890625 198.79248046875 218.7568359375Q198.79248046875 212.2578125 202.2568359375 207.31640625Q205.72119140625 202.375 211.68310546875 199.60888671875Q217.64501953125 196.8427734375 225.05712890625 196.8427734375Q232.63037109375 196.8427734375 238.404296875 199.6357421875Q244.17822265625 202.4287109375 247.53515625 207.208984375Q250.89208984375 211.9892578125 251.16064453125 218.1123046875H243.69482421875Q242.99658203125 211.4521484375 237.84033203125 207.5849609375Q232.68408203125 203.7177734375 224.84228515625 203.7177734375Q216.62451171875 203.7177734375 211.44140625 207.88037109375Q206.25830078125 212.04296875 206.25830078125 218.4345703125Q206.25830078125 222.5703125 208.5947265625 225.33642578125Q210.93115234375 228.1025390625 214.556640625 229.875Q218.18212890625 231.6474609375 222.04931640625 232.775390625L230.42822265625 235.1923828125Q235.58447265625 236.642578125 240.6064453125 239.1669921875Q245.62841796875 241.69140625 248.931640625 245.880859375Q252.23486328125 250.0703125 252.23486328125 256.6767578125Q252.23486328125 263.17578125 248.90478515625 268.2783203125Q245.57470703125 273.380859375 239.3173828125 276.36181640625Q233.06005859375 279.3427734375 224.35888671875 279.3427734375Z",
  /* K */ "M287.79833984375 278.0V197.970703125H295.42529296875V225.7392578125L295.37158203125 242.013671875Q299.02392578125 237.501953125 302.6494140625 233.3125Q306.27490234375 229.123046875 310.24951171875 224.826171875L335.11767578125 197.970703125H345.16162109375L312.82763671875 232.66796875L345.16162109375 278.0H336.08447265625L307.56396484375 237.8779296875L295.42529296875 250.7685546875V278.0Z",
  /* L */ "M425.90283203125 278.0V197.970703125H433.58349609375V271.1787109375H471.61083984375V278.0Z",
  /* E */ "M505.99267578125 278.0V197.970703125H552.72119140625V204.7919921875H513.61962890625V234.3330078125H550.25048828125V241.154296875H513.61962890625V271.1787109375H553.47314453125V278.0Z",
  /* O */ "M620.67236328125 279.07421875Q610.52099609375 279.07421875 602.67919921875 274.025390625Q594.83740234375 268.9765625 590.37939453125 259.76513671875Q585.92138671875 250.5537109375 585.92138671875 238.0390625Q585.92138671875 225.470703125 590.37939453125 216.232421875Q594.83740234375 206.994140625 602.67919921875 201.9453125Q610.52099609375 196.896484375 620.67236328125 196.896484375Q630.77001953125 196.896484375 638.61181640625 201.9453125Q646.45361328125 206.994140625 650.884765625 216.232421875Q655.31591796875 225.470703125 655.31591796875 238.0390625Q655.31591796875 250.5537109375 650.884765625 259.76513671875Q646.45361328125 268.9765625 638.61181640625 274.025390625Q630.77001953125 279.07421875 620.67236328125 279.07421875ZM620.67236328125 271.9306640625Q628.46044921875 271.9306640625 634.6103515625 267.90234375Q640.76025390625 263.8740234375 644.33203125 256.27392578125Q647.90380859375 248.673828125 647.90380859375 238.0390625Q647.90380859375 227.3505859375 644.33203125 219.7236328125Q640.76025390625 212.0966796875 634.6103515625 208.068359375Q628.46044921875 204.0400390625 620.67236328125 204.0400390625Q612.83056640625 204.0400390625 606.65380859375 208.068359375Q600.47705078125 212.0966796875 596.9052734375 219.7236328125Q593.33349609375 227.3505859375 593.33349609375 238.0390625Q593.33349609375 248.6201171875 596.9052734375 256.22021484375Q600.47705078125 263.8203125 606.65380859375 267.87548828125Q612.83056640625 271.9306640625 620.67236328125 271.9306640625Z",
];

function WhiteboardLogo({ width = 280, animate = false, onDone }) {
  const fired = React.useRef(false);
  const onDoneRef = React.useRef(onDone);
  onDoneRef.current = onDone;
  const reducedMotion = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  React.useEffect(() => {
    if (!onDoneRef.current || fired.current) return;
    fired.current = true;
    // §4.3: 1750ms last letter settles + 250ms hold + 200ms fade = 2200ms.
    // §4.4 reduced motion: 600ms hold + 200ms fade = 800ms.
    const delay = (animate && !reducedMotion) ? 2200 : (animate ? 800 : 0);
    const t = setTimeout(() => { if (onDoneRef.current) onDoneRef.current(); }, delay);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line -- runs once on mount, callback accessed via ref

  // Tier 3: < 48px
  if (width < 48) {
    return (
      <svg viewBox="0 0 40 40" width={width} height={width} className="wb-logo-svg" aria-label="Ask Leo" role="img">
        <rect x="0" y="0" width="40" height="40" rx="12" fill="var(--leo-green)" />
        <text x="20" y="21" textAnchor="middle" dominantBaseline="central" className="wb-mono">L</text>
      </svg>
    );
  }

  const h = Math.round(width * 590 / 802);
  const doAnim = animate && !reducedMotion;

  // Tier 2: 48–79px — frame only
  if (width < 80) {
    return (
      <svg viewBox="-3 -3 802 590" width={width} height={h} className="wb-logo-svg" aria-label="Ask Leo" role="img">
        <path d={FRAME_PATH} className="wb-frame" />
      </svg>
    );
  }

  // Tier 1: ≥ 80px
  return (
    <svg viewBox="-3 -3 802 590" width={width} height={h} className="wb-logo-svg" aria-label="Ask Leo" role="img">
      <path d={FRAME_PATH} className={doAnim ? "wb-frame wb-frame-draw" : "wb-frame"} />
      {LETTER_PATHS.map((d, i) => (
        <path key={i} d={d}
          className={doAnim ? "wb-letter-anim" : "wb-letter-static"}
          style={doAnim ? { animationDelay: (620 + i * 130) + "ms, " + (880 + i * 130) + "ms" } : undefined}
        />
      ))}
    </svg>
  );
}

function SignedInContext({ profile }) {
  if (!profile) return null;
  return null;
}

/* §13.1 — the sequence lives in ONE declared constant and nowhere else.
   Two queued changes insert screens. `setObResume` hard-codes its destination
   from OUTSIDE this component, so it cannot see what it points at; with
   numeric pages, each inserting pass adjusts that literal for its own change
   and the last one wins. The symptom is a returning student resuming at the
   wrong screen — Continuity Integrity arriving as an off-by-one. Named steps
   put it beyond reach of any insertion.
   'interests' is now its own step (§13.2 step (b)) with its own render,
   inserted between 'about-you' and 'level'. Navigation derives from position
   in OB_STEPS; nothing else encodes order. */
const COUNTRIES = [
  ["afghanistan","Afghanistan"],
  ["albania","Albania"],
  ["algeria","Algeria"],
  ["andorra","Andorra"],
  ["angola","Angola"],
  ["antigua-and-barbuda","Antigua and Barbuda"],
  ["argentina","Argentina"],
  ["armenia","Armenia"],
  ["australia","Australia"],
  ["austria","Austria"],
  ["azerbaijan","Azerbaijan"],
  ["bahamas","Bahamas"],
  ["bahrain","Bahrain"],
  ["bangladesh","Bangladesh"],
  ["barbados","Barbados"],
  ["belarus","Belarus"],
  ["belgium","Belgium"],
  ["belize","Belize"],
  ["benin","Benin"],
  ["bhutan","Bhutan"],
  ["bolivia","Bolivia"],
  ["bosnia-and-herzegovina","Bosnia and Herzegovina"],
  ["botswana","Botswana"],
  ["brazil","Brazil"],
  ["brunei","Brunei"],
  ["bulgaria","Bulgaria"],
  ["burkina-faso","Burkina Faso"],
  ["burundi","Burundi"],
  ["cabo-verde","Cabo Verde",["Cape Verde"]],
  ["cambodia","Cambodia"],
  ["cameroon","Cameroon"],
  ["canada","Canada"],
  ["canada-quebec","Canada (Québec)",["Quebec"]],
  ["central-african-republic","Central African Republic"],
  ["chad","Chad"],
  ["chile","Chile"],
  ["china-mainland","China (Mainland)",["China"]],
  ["colombia","Colombia"],
  ["comoros","Comoros"],
  ["congo-dr","Congo (Democratic Republic)",["DRC", "DR Congo"]],
  ["congo-republic","Congo (Republic)"],
  ["costa-rica","Costa Rica"],
  ["croatia","Croatia"],
  ["cuba","Cuba"],
  ["cyprus","Cyprus"],
  ["czech-republic","Czech Republic",["Czechia"]],
  ["cote-divoire","Côte d'Ivoire",["Ivory Coast"]],
  ["denmark","Denmark"],
  ["djibouti","Djibouti"],
  ["dominica","Dominica"],
  ["dominican-republic","Dominican Republic"],
  ["ecuador","Ecuador"],
  ["egypt","Egypt"],
  ["el-salvador","El Salvador"],
  ["equatorial-guinea","Equatorial Guinea"],
  ["eritrea","Eritrea"],
  ["estonia","Estonia"],
  ["eswatini","Eswatini",["Swaziland"]],
  ["ethiopia","Ethiopia"],
  ["fiji","Fiji"],
  ["finland","Finland"],
  ["france","France"],
  ["gabon","Gabon"],
  ["gambia","Gambia"],
  ["georgia","Georgia"],
  ["germany","Germany"],
  ["ghana","Ghana"],
  ["greece","Greece"],
  ["grenada","Grenada"],
  ["guatemala","Guatemala"],
  ["guinea","Guinea"],
  ["guinea-bissau","Guinea-Bissau"],
  ["guyana","Guyana"],
  ["haiti","Haiti"],
  ["honduras","Honduras"],
  ["hong-kong","Hong Kong"],
  ["hungary","Hungary"],
  ["iceland","Iceland"],
  ["india","India"],
  ["indonesia","Indonesia"],
  ["iran","Iran"],
  ["iraq","Iraq"],
  ["ireland","Ireland"],
  ["israel","Israel"],
  ["italy","Italy"],
  ["jamaica","Jamaica"],
  ["japan","Japan"],
  ["jordan","Jordan"],
  ["kazakhstan","Kazakhstan"],
  ["kenya","Kenya"],
  ["kiribati","Kiribati"],
  ["kosovo","Kosovo"],
  ["kuwait","Kuwait"],
  ["kyrgyzstan","Kyrgyzstan"],
  ["laos","Laos"],
  ["latvia","Latvia"],
  ["lebanon","Lebanon"],
  ["lesotho","Lesotho"],
  ["liberia","Liberia"],
  ["libya","Libya"],
  ["liechtenstein","Liechtenstein"],
  ["lithuania","Lithuania"],
  ["luxembourg","Luxembourg"],
  ["macau","Macau",["Macao"]],
  ["madagascar","Madagascar"],
  ["malawi","Malawi"],
  ["malaysia","Malaysia"],
  ["maldives","Maldives"],
  ["mali","Mali"],
  ["malta","Malta"],
  ["marshall-islands","Marshall Islands"],
  ["mauritania","Mauritania"],
  ["mauritius","Mauritius"],
  ["mexico","Mexico"],
  ["micronesia","Micronesia"],
  ["moldova","Moldova"],
  ["monaco","Monaco"],
  ["mongolia","Mongolia"],
  ["montenegro","Montenegro"],
  ["morocco","Morocco"],
  ["mozambique","Mozambique"],
  ["myanmar","Myanmar",["Burma"]],
  ["namibia","Namibia"],
  ["nauru","Nauru"],
  ["nepal","Nepal"],
  ["netherlands","Netherlands",["Holland"]],
  ["new-zealand","New Zealand"],
  ["nicaragua","Nicaragua"],
  ["niger","Niger"],
  ["nigeria","Nigeria"],
  ["north-korea","North Korea"],
  ["north-macedonia","North Macedonia",["Macedonia"]],
  ["norway","Norway"],
  ["oman","Oman"],
  ["pakistan","Pakistan"],
  ["palau","Palau"],
  ["palestine","Palestine"],
  ["panama","Panama"],
  ["papua-new-guinea","Papua New Guinea"],
  ["paraguay","Paraguay"],
  ["peru","Peru"],
  ["philippines","Philippines"],
  ["poland","Poland"],
  ["portugal","Portugal"],
  ["puerto-rico","Puerto Rico"],
  ["qatar","Qatar"],
  ["romania","Romania"],
  ["russia","Russia"],
  ["rwanda","Rwanda"],
  ["saint-kitts-and-nevis","Saint Kitts and Nevis",["St Kitts"]],
  ["saint-lucia","Saint Lucia",["St Lucia"]],
  ["saint-vincent-and-the-grenadines","Saint Vincent and the Grenadines",["St Vincent"]],
  ["samoa","Samoa"],
  ["san-marino","San Marino"],
  ["saudi-arabia","Saudi Arabia"],
  ["senegal","Senegal"],
  ["serbia","Serbia"],
  ["seychelles","Seychelles"],
  ["sierra-leone","Sierra Leone"],
  ["singapore","Singapore"],
  ["slovakia","Slovakia"],
  ["slovenia","Slovenia"],
  ["solomon-islands","Solomon Islands"],
  ["somalia","Somalia"],
  ["south-africa","South Africa"],
  ["south-korea","South Korea",["Korea"]],
  ["south-sudan","South Sudan"],
  ["spain","Spain"],
  ["sri-lanka","Sri Lanka"],
  ["sudan","Sudan"],
  ["suriname","Suriname"],
  ["sweden","Sweden"],
  ["switzerland","Switzerland"],
  ["syria","Syria"],
  ["sao-tome-and-principe","São Tomé and Príncipe",["Sao Tome"]],
  ["taiwan","Taiwan"],
  ["tajikistan","Tajikistan"],
  ["tanzania","Tanzania"],
  ["thailand","Thailand"],
  ["timor-leste","Timor-Leste",["East Timor"]],
  ["togo","Togo"],
  ["tonga","Tonga"],
  ["trinidad-and-tobago","Trinidad and Tobago"],
  ["tunisia","Tunisia"],
  ["turkmenistan","Turkmenistan"],
  ["tuvalu","Tuvalu"],
  ["turkiye","Türkiye",["Turkey"]],
  ["uganda","Uganda"],
  ["ukraine","Ukraine"],
  ["united-arab-emirates","United Arab Emirates",["UAE"]],
  ["united-kingdom","United Kingdom",["UK", "Britain", "England"]],
  ["united-states","United States",["USA", "America"]],
  ["uruguay","Uruguay"],
  ["uzbekistan","Uzbekistan"],
  ["vanuatu","Vanuatu"],
  ["vatican-city","Vatican City"],
  ["venezuela","Venezuela"],
  ["vietnam","Vietnam"],
  ["yemen","Yemen"],
  ["zambia","Zambia"],
  ["zimbabwe","Zimbabwe"],
  ["prefer-not-to-say","Prefer not to say"],
];
const COUNTRY_NAME = Object.fromEntries(COUNTRIES.map(([k, n]) => [k, n]));
const COUNTRY_ALIASES = Object.fromEntries(COUNTRIES.map(([k, n, a]) => [k, a || []]));
// Strip diacritics + lowercase, so "turkey" finds "Türkiye" and "cote" finds "Côte d'Ivoire".
const obFold = (s) => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const countryMatch = (key, name, query) => {
  const q = obFold(query);
  if (!q) return false;
  if (obFold(name).includes(q)) return true;
  return (COUNTRY_ALIASES[key] || []).some((a) => obFold(a).includes(q));
};
// Storage is the key; the AI prompt and any display need the readable name.
// Unset or "prefer not to say" reads as empty (Leo teaches without it, §12.5);
// an unmigrated free-text value is returned as-is.
const countryDisplay = (v) => (!v || v === "prefer-not-to-say") ? "" : (COUNTRY_NAME[v] || v);
// Migrate a stored free-text country to a key (case-insensitive, name or alias);
// unmatched values are retained as-is and read as unset for keyed lookups (§12.2).
const countryMigrate = (v) => {
  if (!v) return "";
  if (COUNTRY_NAME[v]) return v; // already a key
  const f = obFold(v);
  const hit = COUNTRIES.find(([k, n, a]) => obFold(n) === f || (a || []).some((x) => obFold(x) === f));
  return hit ? hit[0] : v; // retain unmatched free-text as-is
};

// ── About-you group two: the four questions (Lessons-signed, about-you-questions-signoff.md 6f2e4a96). Chips per §5, all skippable, none gates Continue. ──
const Q_SETTLEMENT = ["Just arrived", "Less than a year", "1–3 years", "More than 3 years", "Not in Australia yet"]; // Q1 single
const Q_GOALS = ["Work", "Study", "Everyday life", "Family", "Citizenship"]; // Q2 multi
const Q_HARDEST = ["Understanding fast speech", "Speaking with confidence", "Being understood when I speak", "Finding the right words", "Reading in English", "Writing in English"]; // Q3 multi
const Q_OCCUPATION = ["Working", "Studying", "Both", "Looking for work", "Neither"]; // Q4 single

// ── Conditional spoken-variety question (§13.2). Options are the register's (rev 2 b8c7e066): the only L1 the register recognises with >1 spoken variety is Chinese (Mandarin vs Cantonese — country/script do not determine speech). ──
const CHINESE_SPOKEN = [["mandarin", "Mandarin"], ["cantonese", "Cantonese"]];
const SPOKEN_VARIETY = { zh: CHINESE_SPOKEN, "zh-Hant": CHINESE_SPOKEN }; // one array, referenced twice — zh and zh-Hant cannot drift
// Spoken-variety label — Lessons-signed, 26 July 2026. "at home" makes this a
// dominance question (answerable by students who speak both), and home variety is
// the substrate pronunciation teaching needs.
const SPOKEN_VARIETY_LABEL = "Which of these do you speak at home?";

const OB_STEPS = ["language", "welcome", "about-you", "interests", "level"];

function Onboarding({ onDone, initialStep, initialProfile }) {
  const ip = initialProfile || {};
  const [obStep, setObStep] = useState(initialStep || OB_STEPS[0]);
  // Navigation derives from position in OB_STEPS. Nothing else encodes order.
  const next = () => setObStep(OB_STEPS[Math.min(OB_STEPS.indexOf(obStep) + 1, OB_STEPS.length - 1)]);
  const back = () => setObStep(OB_STEPS[Math.max(OB_STEPS.indexOf(obStep) - 1, 0)]);
  const [lang, setLang] = useState(ip.lang || null);
  const [name, setName] = useState(ip.name || "");
  const [country, setCountry] = useState(() => countryMigrate(ip.country || ""));
  const [countrySearch, setCountrySearch] = useState("");
  const [interests, setInterests] = useState(ip.interests || []);
  const [settlement, setSettlement] = useState(ip.settlement || null);
  const [goals, setGoals] = useState(ip.goals || []);
  const [hardest, setHardest] = useState(ip.hardest || []);
  const [occupation, setOccupation] = useState(ip.occupation || null);
  const [spokenVariety, setSpokenVariety] = useState(ip.spokenVariety || null);
  const [level, setLevel] = useState(ip.level || null);
  const [showLevelPicker, setShowLevelPicker] = useState(false);

  const INTEREST_OPTIONS = [
    "Sport", "Music", "Movies & TV", "Food & cooking",
    "Travel", "Gaming", "Study", "Work",
    "Australian life", "Reading", "Art & design", "Other",
  ];

  const toggleInterest = (item) => setInterests((prev) =>
    prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
  );
  const toggleFrom = (setter, item) => setter((prev) =>
    prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
  );

  const finish = (lvl, wantsPlacement) => onDone({
    name: name.trim(), lang, country,
    level: lvl || level, interests,
    settlement, goals, hardest, occupation, spokenVariety,
  }, wantsPlacement);

  /* Leo's greeting, L1 line — SUPPRESSED. §13.4a (Genesis, 22 July 2026);
     welcome-screen-review-package.md rev 1, MD5 cc8efab4200ba4ac545c399d8dac260a.
     All eight prior entries failed L1-equivalence clause 3 (authored against the
     English first sentence only); their sign-offs are void. Suppression is by
     EMPTY DATA, not a flag: the render is `{HELLO_L1[lang] && …}`, so an empty
     object shows no L1 line, and adding one reviewed entry lights up exactly that
     one language. The void drafts in the ratified principle doc are NOT a starting
     point — restore only from fresh native review.

     TO RESTORE ONE LANGUAGE — read before adding any entry:
       1. Add a native-reviewed entry to HELLO_L1, reviewed against the reviewer
          specification for that variety. One key, one language.
       2. Fix the L1 line's markup at the 'welcome' render below: it still carries
          the OLD suppressed styling — className "text-supporting", opacity 0.65,
          fontStyle italic. Binding treatment on restoration: className "text-leo";
          NO inline opacity (and not inside .fade-in until motion §11.3); NO italic
          (invalid for zh and ja); position THIRD, after both English lines — order
          carries the hierarchy.
     Restoring the string with the old styling reinstates a WCAG failure alongside a
     reviewed line and looks faithful. Do both, or neither. */
  const HELLO_L1 = {};

  // ── PAGE 1: THE LANGUAGE ── (no Back)
  if (obStep === "language") return (
    <div className="onboard">
      <div className="ob-card fade-in" style={{ textAlign: "left" }}>
        <p className="text-leo" style={{ marginBottom: "var(--space-4)" }}>What is your first language?</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {Object.entries(LANGS).map(([code, l]) => (
            <button key={code}
              className={"card" + (lang === code ? " leo-card" : "")}
              style={{ textAlign: "left", cursor: "pointer", padding: "14px 16px", border: lang === code ? undefined : "1px solid var(--text-tertiary)" }}
              onClick={() => { setLang(code); setTimeout(next, 300); }}>
              <span style={{ fontWeight: 600 }}>{l.native}</span>
              <span className="text-supporting" style={{ marginLeft: 8 }}>{l.english}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── PAGE 2: MEET LEO ── (Back → Page 1)
  if (obStep === "welcome") return (
    <div className="onboard">
      <div className="ob-card fade-in" style={{ textAlign: "left" }}>
        <div className="leo-accent" style={{ marginBottom: "var(--space-5)" }}>
          <p className="text-leo" style={{ fontSize: 20, lineHeight: 1.4, marginBottom: "var(--space-2)" }}>
            Hi. I'm Leo.
          </p>
          <p className="text-leo" style={{ marginBottom: "var(--space-3)" }}>
            I'm your English teacher here in Australia.
          </p>
          {HELLO_L1[lang] && (
            <p className="text-supporting" style={{ opacity: 0.65, fontStyle: "italic" }}>
              {HELLO_L1[lang]}
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button className="ghost-btn" onClick={back}>Back</button>
          <button className="primary-btn" onClick={next}>Continue</button>
        </div>
      </div>
    </div>
  );

  // ── PAGE 3: GET TO KNOW YOU ── (Back → Page 2). §12/§13.2: two groups, strict country, four questions. Interests are their own step now.
  if (obStep === "about-you") {
    const spokenOpts = SPOKEN_VARIETY[lang];
    const countryMatches = COUNTRIES.filter(([k, n]) => k !== "prefer-not-to-say" && countryMatch(k, n, countrySearch)).slice(0, 50);
    return (
    <div className="onboard">
      <div className="ob-card fade-in" style={{ textAlign: "left" }}>
        <p className="text-leo" style={{ marginBottom: "var(--space-4)" }}>I'd like to get to know you a little.</p>

        {/* Group one — Who you are */}
        <p className="input-label" style={{ textTransform: "uppercase", letterSpacing: 0.5, opacity: 0.6, marginBottom: "var(--space-2)" }}>Who you are</p>

        <label className="input-label">What's your name?</label>
        <input className="big-input" autoFocus value={name} placeholder="Your name"
          onChange={(e) => setName(e.target.value)} />

        <label className="input-label" style={{ marginTop: "var(--space-3)" }}>Your language</label>
        <div className="card" style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>{LANGS[lang] ? `${LANGS[lang].native} — ${LANGS[lang].english}` : "Not selected"}</span>
          <button className="ghost-btn" style={{ minHeight: "auto", padding: "4px 10px", fontSize: 13 }} onClick={() => setObStep("language")}>Change language</button>
        </div>

        <label className="input-label" style={{ marginTop: "var(--space-3)" }}>Where are you from?</label>
        {country ? (
          <div className="card" style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>{countryDisplay(country) || "Prefer not to say"}</span>
            <button className="ghost-btn" style={{ minHeight: "auto", padding: "4px 10px", fontSize: 13 }} onClick={() => { setCountry(""); setCountrySearch(""); }}>Change</button>
          </div>
        ) : (
          <>
            <input className="big-input" value={countrySearch} placeholder="Type your country…"
              onChange={(e) => setCountrySearch(e.target.value)} />
            <div className="card" style={{ marginTop: "var(--space-1)", padding: 4, maxHeight: 220, overflowY: "auto" }}>
              {countrySearch.trim() && countryMatches.map(([k, n]) => (
                <button key={k} className="ghost-btn" style={{ display: "block", width: "100%", textAlign: "left", minHeight: "auto", padding: "10px 12px", fontSize: 15 }}
                  onClick={() => { setCountry(k); setCountrySearch(""); }}>{n}</button>
              ))}
              {countrySearch.trim() && countryMatches.length === 0 && (
                <p className="text-supporting" style={{ padding: "10px 12px", margin: 0 }}>No match — check the spelling, or choose below.</p>
              )}
              <button className="ghost-btn" style={{ display: "block", width: "100%", textAlign: "left", minHeight: "auto", padding: "10px 12px", fontSize: 15, opacity: 0.75 }}
                onClick={() => { setCountry("prefer-not-to-say"); setCountrySearch(""); }}>Prefer not to say</button>
            </div>
          </>
        )}

        {spokenOpts && (
          <>
            <label className="input-label" style={{ marginTop: "var(--space-3)" }}>{SPOKEN_VARIETY_LABEL}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
              {spokenOpts.map(([k, lbl]) => (
                <button key={k} className={"chip" + (spokenVariety === k ? " chip-on" : "")}
                  onClick={() => setSpokenVariety(spokenVariety === k ? null : k)}>{lbl}</button>
              ))}
            </div>
          </>
        )}

        {/* Group two — Your English */}
        <div style={{ borderTop: "1px solid var(--divider)", margin: "var(--space-4) 0 var(--space-3)" }} />
        <p className="input-label" style={{ textTransform: "uppercase", letterSpacing: 0.5, opacity: 0.6, marginBottom: "var(--space-1)" }}>Your English</p>
        <p className="text-supporting" style={{ margin: "0 0 var(--space-3)", opacity: 0.8 }}>A few quick questions. They help me plan lessons that are actually about your life.</p>

        <label className="input-label">How long have you been in Australia?</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
          {Q_SETTLEMENT.map((o) => (
            <button key={o} className={"chip" + (settlement === o ? " chip-on" : "")}
              onClick={() => setSettlement(settlement === o ? null : o)}>{o}</button>
          ))}
        </div>

        <label className="input-label">What do you want English for?</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
          {Q_GOALS.map((o) => (
            <button key={o} className={"chip" + (goals.includes(o) ? " chip-on" : "")}
              onClick={() => toggleFrom(setGoals, o)}>{o}</button>
          ))}
        </div>

        <label className="input-label">What's hardest for you right now?</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
          {Q_HARDEST.map((o) => (
            <button key={o} className={"chip" + (hardest.includes(o) ? " chip-on" : "")}
              onClick={() => toggleFrom(setHardest, o)}>{o}</button>
          ))}
        </div>

        <label className="input-label">Are you working or studying at the moment?</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
          {Q_OCCUPATION.map((o) => (
            <button key={o} className={"chip" + (occupation === o ? " chip-on" : "")}
              onClick={() => setOccupation(occupation === o ? null : o)}>{o}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-4)" }}>
          <button className="ghost-btn" onClick={back}>Back</button>
          <button className="primary-btn" disabled={!name.trim()} onClick={next}>Continue</button>
        </div>
      </div>
    </div>
    );
  }

  // ── PAGE 3b: INTERESTS ── (Back → about-you, Continue → level). Split from about-you per §13.2 step (b).
  if (obStep === "interests") return (
    <div className="onboard">
      <div className="ob-card fade-in" style={{ textAlign: "left" }}>
        <p className="text-leo" style={{ marginBottom: "var(--space-2)" }}>What are you interested in?</p>
        <p className="text-supporting" style={{ margin: "0 0 var(--space-4)", opacity: 0.8 }}>Choose as many as you like. This helps me plan lessons around things you enjoy.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
          {INTEREST_OPTIONS.map((item) => (
            <button key={item}
              className={"chip" + (interests.includes(item) ? " chip-on" : "")}
              onClick={() => toggleInterest(item)}>{item}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-4)" }}>
          <button className="ghost-btn" onClick={back}>Back</button>
          <button className="primary-btn" onClick={next}>Continue</button>
        </div>
      </div>
    </div>
  );

  // ── PAGE 4: LEVEL PICKER sub-view ── (Back → Page 4 main)
  if (obStep === "level" && showLevelPicker) return (
    <div className="onboard">
      <div className="ob-card fade-in" style={{ textAlign: "left" }}>
        <p className="text-leo" style={{ marginBottom: "var(--space-3)" }}>Select your English level</p>
        <div className="level-grid">
          {LEVELS.map(([code, label]) => (
            <button key={code} className={"level-card " + (level === code ? "level-on" : "")} onClick={() => setLevel(code)}>
              <span className="level-code">{code}</span>
              <span className="level-label">{label}</span>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-3)" }}>
          <button className="ghost-btn" onClick={() => setShowLevelPicker(false)}>Back</button>
          <button className="primary-btn" disabled={!level} onClick={() => finish(level, false)}>Start learning</button>
        </div>
      </div>
    </div>
  );

  // ── PAGE 4: CEFR LEVEL CHOICE ── (Back → Page 3)
  if (obStep === "level") return (
    <div className="onboard">
      <div className="ob-card fade-in" style={{ textAlign: "left" }}>
        <p className="text-leo" style={{ marginBottom: "var(--space-4)" }}>One last thing, {name.trim() || "there"} — what is your English level?</p>

        <button className="level-choice-card" style={{ textAlign: "left", width: "100%", marginBottom: "var(--space-2)" }}
          onClick={() => setShowLevelPicker(true)}>
          <h3 style={{ margin: "0 0 4px" }}>I know my English level</h3>
          <p className="text-supporting" style={{ margin: 0 }}>Choose your level and start learning straight away.</p>
        </button>
        <button className="level-choice-card level-choice-rec" style={{ textAlign: "left", width: "100%", position: "relative" }}
          onClick={() => finish(null, true)}>
          <h3 style={{ margin: "0 0 4px" }}>Help me find my level</h3>
          <p className="text-supporting" style={{ margin: 0 }}>Leo will ask you a few questions to understand your English.</p>
          <span className="level-choice-badge">Recommended</span>
        </button>

        {/* English only — no L1 line. Under the ratified L1 Equivalence
            Principle a new string ships in English until a reviewer holding
            the specification has passed it in the named variety. */}
        <p className="text-supporting" style={{ marginTop: "var(--space-3)" }}>
          Right now I teach at one level, so today's lesson is the same for everyone. Your choice is a start, not a test. When I teach every level, I will change your lessons to fit you.
        </p>

        <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-3)" }}>
          <button className="ghost-btn" onClick={back}>Back</button>
        </div>
      </div>
    </div>
  );

  return null;
}

/* ---------------- Word review with Leo (personalised) ---------------- */

function ReviewPage({ profile, memory, leoMemory, words, heard, diaryPages, markActivity }) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  // Build a pool from everything this student has actually learned, weakest
  // words first — so review time goes to what actually needs practice
  // rather than words Leo already knows they've mastered (Phase 5).
  const pool = React.useMemo(() => {
    const seen = new Set();
    const items = [];
    (words || []).forEach((w) => { const k = w.word.toLowerCase(); if (!seen.has(k)) { seen.add(k); items.push({ term: w.word, src: "your word bank", date: w.date }); } });
    (heard || []).forEach((h) => { const k = (h.phrase || "").toLowerCase(); if (k && !seen.has(k)) { seen.add(k); const info = h.info || h.explanation; items.push({ term: h.phrase, src: "something you heard in Australia", date: h.date, meaning: info && info.meaning }); } });
    const byRecency = [...items].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    return memSortByMasteryAsc(byRecency, leoMemory.store, (it) => it.term);
  }, [words, heard, leoMemory.store]);

  const diaryContext = React.useMemo(() => {
    const parts = [];
    Object.keys(diaryPages || {}).sort().reverse().slice(0, 4).forEach((d) => {
      const p = diaryPages[d];
      if (p && p.notes) parts.push(p.notes);
      if (p && p.skillsDetail) parts.push(p.skillsDetail);
    });
    return parts.join(" ").slice(0, 320);
  }, [diaryPages]);

  /* A review in progress survives leaving the screen. Before the tab bar,
     abandoning a review took a deliberate Back tap; now four destinations sit
     permanently under the thumb and a mistap is one pixel away, so unsaved
     progress here is one accidental tap from gone. Same key as the completion
     flag, which stays a plain `done` field so the boot read is unaffected. */
  const persistReview = async (patch) => {
    await saveKey("esl-vocab:" + todayStr(), { questions, idx, correct, chosen, done: false, ...patch });
  };

  useEffect(() => {
    (async () => {
      const saved = await loadKey("esl-vocab:" + todayStr(), null);
      if (saved && saved.done) { setFinished(true); setLoading(false); return; }
      if (saved && Array.isArray(saved.questions) && saved.questions.length) {
        setQuestions(saved.questions);
        setIdx(saved.idx || 0);
        setCorrect(saved.correct || 0);
        setChosen(saved.chosen || null);
        setLoading(false);
        return;
      }
      if (pool.length < 3) { setLoading(false); return; }
      const chosenItems = pool.slice(0, 6);
      const termLines = chosenItems.map((it) => `"${it.term}" (from ${it.src}${it.meaning ? "; means: " + it.meaning : ""})`).join("; ");
      try {
        const raw = await askClaude(
          `You are Leo, a warm Australian English teacher. Build a short, personalised vocabulary review for your student (${memory}). Use ONLY these words and phrases you have taught this student: ${termLines}. The list records what they have MET, not what they have mastered. Do not tell the student they have learned, mastered or know a word — the review exists precisely because that is still uncertain.${diaryContext ? ` Recent things they wrote in their diary: "${diaryContext}".` : ""} Build a RETRIEVAL LADDER across the set, staying multiple-choice throughout (same format, same length): the FIRST question is easy RECOGNITION (match the word to its meaning); the MIDDLE questions are RECALL (a fill-in-the-blank sentence with ___ where only the target word fits in context); the LAST question(s) test PRODUCTIVE USE (which sentence uses the word correctly and naturally in a real Australian situation). Australian context is welcome, and you may gently reference where an item came from (their diary or something they heard). ADAPT to the learner: pitch difficulty and distractors to their CEFR ${levelFor(profile)} level and recent performance (subtler distractors and richer sentences if they are strong; clearer and shorter if they are lower level). Respond ONLY with JSON, no fences: {"questions":[{"word":"the word","stem":"the question or fill-in-the-blank sentence using ___ for the gap","options":["four options"],"answer":"the exact text of the correct option","note":"one short, encouraging explanation from Leo that teaches, not just confirms"}]} Make up to 5 questions that climb from recognition to production; plausible distractors.`,
          { intent: "vocab_review" }
        );
        const qs = (parseJSON(raw).questions || []).filter((q) => q && q.options && q.options.includes(q.answer));
        setQuestions(qs);
        if (qs.length) await saveKey("esl-vocab:" + todayStr(), { questions: qs, idx: 0, correct: 0, chosen: null, done: false });
      } catch { setQuestions([]); }
      setLoading(false);
    })();
  }, []);

  const answer = (opt) => {
    if (chosen) return;
    setChosen(opt);
    const ok = opt === questions[idx].answer;
    const nextCorrect = ok ? correct + 1 : correct;
    if (ok) setCorrect(nextCorrect);
    if (questions[idx].word) leoMemory.practiceWord(questions[idx].word, ok);
    // Store the chosen option too: returning mid-question must not let the
    // same word be practised twice and skew mastery.
    persistReview({ chosen: opt, correct: nextCorrect });
  };
  const next = async () => {
    if (idx + 1 < questions.length) { setIdx(idx + 1); setChosen(null); await persistReview({ idx: idx + 1, chosen: null }); }
    else {
      setFinished(true);
      await saveKey("esl-vocab:" + todayStr(), { done: true });
      await markActivity();
      leoMemory.completeReview();
    }
  };

  if (loading) return (<div><SectionTitle>Word review</SectionTitle><Spinner label="Leo is choosing your words…" /></div>);

  if (pool.length < 3)
    return (
      <div>
        <SectionTitle sub="Leo reviews the words you have already met.">Word review</SectionTitle>
        <Card className="center"> <h3>Let's gather a few words first</h3>
          <p className="muted">Look up words in the Dictionary, or save phrases in “English I heard today”. Once you have a few, Leo will build a personal review from your own words.</p>
        </Card>
      </div>
    );

  if (!questions.length) return (<div><SectionTitle>Word review</SectionTitle><Card><p className="text-leo leo-accent">I'm having trouble with that one — come back in a moment and we'll try again.</p></Card></div>);

  if (finished)
    return (
      <div>
        <SectionTitle>Word review</SectionTitle>
        <Card className="center"> <h3>You scored {correct}/{questions.length}!</h3>
          <p className="muted">Leo says: revisiting your own words is one of the best ways to remember them. See you tomorrow!</p>
        </Card>
      </div>
    );

  const q = questions[idx];
  return (
    <div>
      <SectionTitle sub={`Your words · ${idx + 1} of ${questions.length}`}>Word review</SectionTitle>
      <div className="progress-dots">{questions.map((_, i) => <span key={i} className={"dot " + (i <= idx ? "dot-on" : "")} />)}</div>
      <Card>
        <p className="q-sentence">{q.stem.replace(/_+/g, "______")}</p>
        <div className="rev-options">
          {q.options.map((opt) => {
            const isAns = opt === q.answer;
            const cls = chosen ? (isAns ? "rev-option rev-right" : (opt === chosen ? "rev-option rev-wrong" : "rev-option rev-dim")) : "rev-option";
            return <button key={opt} className={cls} onClick={() => answer(opt)} disabled={!!chosen}>{opt}</button>;
          })}
        </div>
        {chosen && (
          <div className="feedback">
            <p className={chosen === q.answer ? "ok" : "bad"}>{chosen === q.answer ? <><Check size={15} /> Correct!</> : <><X size={15} /> The answer is “{q.answer}”.</>}</p>
            {q.note && <p className="small tip">💡 {q.note}</p>}
            <button className="primary-btn" style={{ marginTop: 8 }} onClick={next}>{idx + 1 < questions.length ? "Next word" : "Finish review 🎉"}</button>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ================= APP SHELL ================= */

/* ---- Test-visible exports (application logic unchanged) ---- */
export {
  MOCK_PACKS, PACK_GRAMMAR_PRACTICE, PACK_WARMUPS, WARMUP_TYPES,
  VALID_LESSON_TYPES, VALID_CEFR, AUTHORED_LESSONS, prepareAuthoredBlueprint,
  grammarAlignmentTokens, alignsWithGrammar, sameGrammarPoint,
  validateWarmUpActivity, validateWarmUp, validateSection,
  validateBlueprint, validateQuestions, parseJSON,
  mockAskClaude, completionMessage, textSeed, shuffleOptions,
  MASTERY_STAGES, MASTERY_RANK,
  memBumpWordMastery, memTouchWord, memMasteryStage, memSortByMasteryAsc,
  DEFAULT_MEMORY_STORE, buildTeacherContext,
  GapFillInput, VocabReviewExercise, SentenceFramesPanel, ListeningGapFillExercise,
};

export default function App() {
  const [authUser, setAuthUser] = useState(undefined); // undefined = loading, null = not signed in, object = signed in
  const [authView, setAuthView] = useState("landing"); // "landing" | "signup" | "signin"
  // Owned here, not in WelcomeLanding: that component unmounts when authView
  // changes, so Back must find the step the student actually left from.
  const [landingSlide, setLandingSlide] = useState(0);
  const [showLeoReveal, setShowLeoReveal] = useState(false);
  // §4.2 — the logo draw IS the loading state. There is no separate boot
  // screen: showing a generic loader and then the brand spends the student's
  // first 1400ms on a pulsing bar and splits one wait across two images.
  const [splashPhase, setSplashPhase] = useState("logo"); // "logo" | "done"
  const [profile, setProfile] = useState(undefined); // undefined = loading, null = needs onboarding
  const [page, setPage] = useState(null); // null = home screen
  const [introPlayed, setIntroPlayed] = useState(false);
  // The skyline draws once, ever — not every morning (spec A3.5).
  const [skylineSeen, setSkylineSeen] = useState(true);
  useEffect(() => { (async () => {
    const seen = await loadKey("esl-skyline-seen", false);
    if (!seen) { setSkylineSeen(false); await saveKey("esl-skyline-seen", true); }
  })(); }, []);
  const [pendingAsk, setPendingAsk] = useState(null);
  const [todayDone, setTodayDone] = useState({ task: false, vocab: false }); // grouped: Phase 8
  const [placementDone, setPlacementDone] = useState(undefined); // undefined=loading, true/false
  const [obResume, setObResume] = useState(null); // {step, profile} when returning from placement
  // Navigation state (A1/A3). MUST stay above the early-return chain below —
  // placementDone flipping false->true lets render pass those returns for the
  // first time, and any hook underneath would run on that render but not the
  // previous one (React error #310).
  const [tab, setTab] = useState("today");
  const [tabPages, setTabPages] = useState({ today: null, ask: "questions", words: "dictionary", progress: "progress" });
  const [ausQuery, setAusQuery] = useState("");   // carried across by the refusal doorway
  const [memoryStore, setMemoryStore] = useState(DEFAULT_MEMORY_STORE);      // Leo's learning memory: Phase 4/5/6
  const [diaryPages, setDiaryPages] = useState({});
  const [words, setWords] = useState([]);
  const [heard, setHeard] = useState([]);
  const [activity, setActivity] = useState([]);
  const [errorLog, setErrorLog] = useState({});
  const [taskCount, setTaskCount] = useState(0);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700&family=Fraunces:opsz,wght@9..144,500;9..144,650&family=Karla:wght@400;500;700&family=Caveat:wght@600&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    (async () => {
      // Demo mode: clear session on startup so the artifact always begins
      // at the landing page. Remove when moving to real auth.
      await saveKey("esl-auth-session", null);
      await saveKey("esl-profile", null);
      await saveKey("esl-placement", null);

      const [session, p, e, w, h, a, el, tc, tt, vd, ms, ld, pl] = await Promise.all([
        loadKey("esl-auth-session", null),
        loadKey("esl-profile", null),
        loadKey("esl-diary-pages", {}),
        loadKey("esl-words", []),
        loadKey("esl-heard", []),
        loadKey("esl-activity", []),
        loadKey("esl-errors", {}),
        loadKey("esl-taskcount", 0),
        loadKey("esl-task:" + todayStr(), null),
        loadKey("esl-vocab:" + todayStr(), null),
        loadMemoryStore(),
        loadKey("esl-lessondone:" + todayStr(), false),
        loadKey("esl-placement", null),
      ]);
      setAuthUser(session); setProfile(p); setDiaryPages(e); setWords(w); setHeard(h); setActivity(a); setErrorLog(el); setTaskCount(tc);
      setPlacementDone(!!pl);
      // C1: daily lesson completion is a sticky per-day flag, independent of the
      // current lesson draft. Fall back to a legacy finished draft so learners
      // who completed today under the old scheme still show as done.
      setTodayDone({ task: !!(ld || (tt && tt.status && tt.status.done)), vocab: !!(vd && vd.done) });
      setMemoryStore(ms);
    })();
  }, []);

  const markActivity = useCallback(async () => {
    setActivity((prev) => {
      if (prev.includes(todayStr())) return prev;
      const next = [...prev, todayStr()].slice(-90);
      saveKey("esl-activity", next);
      return next;
    });
  }, []);

  const addErrors = useCallback(async (types) => {
    setErrorLog((prev) => {
      const next = { ...prev };
      types.forEach((t) => { if (t && t !== "none") next[t] = (next[t] || 0) + 1; });
      saveKey("esl-errors", next);
      return next;
    });
  }, []);

  const bumpTasks = useCallback(async () => {
    setTaskCount((prev) => {
      const next = prev + 1;
      saveKey("esl-taskcount", next);
      return next;
    });
  }, []);

  if (splashPhase === "logo")
    return <div className="app" style={{background:'var(--bg-warm,#FAFAF8)'}}><style>{CSS}</style><div className="wb-splash wb-logo-phase"><WhiteboardLogo width={Math.min(320, Math.round(window.innerWidth * 0.7))} animate onDone={() => setSplashPhase("done")} /></div></div>;

  if (authUser === undefined)
    return <div className="app"><style>{CSS}</style><div className="onboard"><LeoLoader label="Getting things ready…" /></div></div>;

  if (authUser === null)
    return (
      <div className="app">
        <style>{CSS}</style>
        {authView === "landing" && <WelcomeLanding slide={landingSlide} setSlide={setLandingSlide} onSignUp={() => setAuthView("signup")} onSignIn={() => setAuthView("signin")} />}
        {authView === "signup" && <SignUpPage onBack={() => setAuthView("landing")} onComplete={(user) => { setAuthUser(user); setShowLeoReveal(true); setProfile(null); setPlacementDone(false); }} />}
        {authView === "signin" && <SignInPage onBack={() => setAuthView("landing")} onComplete={async (user) => {
          setAuthUser(user);
          const [savedProfile, savedPlacement] = await Promise.all([
            loadKey("esl-profile", null),
            loadKey("esl-placement", null),
          ]);
          setProfile(savedProfile);
          setPlacementDone(!!savedPlacement);
        }} />}
      </div>
    );

  if (profile === undefined || placementDone === undefined)
    return <div className="app"><style>{CSS}</style><div className="onboard"><LeoLoader label="Getting things ready…" /></div></div>;

  if (showLeoReveal)
    return (
      <div className="app">
        <style>{CSS}</style>
        <LeoReveal onDone={() => setShowLeoReveal(false)} />
      </div>
    );

  if (profile === null)
    return (
      <div className="app">
        <style>{CSS}</style>
        <Onboarding initialStep={obResume ? obResume.step : undefined} initialProfile={obResume ? obResume.profile : undefined} onDone={async (p, wantsPlacement) => {
          setObResume(null);
          /* ORDER IS LOAD-BEARING. placementDone is false from sign-up. Setting
             profile first and placementDone after an await renders one frame
             with profile set and placementDone still false — which IS the
             placement gate — so a student who had just chosen their own level
             was shown the test they had declined, and it began generating
             questions before it was torn down.
             Both keys are written before anything renders, and placementDone is
             set BEFORE profile: the profile===null branch above renders
             onboarding regardless of placementDone, so this order is safe
             whether or not React batches the two updates together. */
          if (!wantsPlacement) await saveKey("esl-placement", { skipped: true, selfReported: p.level });
          await saveKey("esl-profile", p);
          setPlacementDone(!wantsPlacement);
          setProfile(p);
        }} />
      </div>
    );

  // Placement gate: new students must complete the placement test before
  // accessing the app. Returning students who already have results skip straight
  // to the home screen. The assessed CEFR level overwrites the self-reported one
  // so every future lesson targets the right difficulty from day one.
  if (placementDone === false)
    return (
      <div className="app">
        <style>{CSS}</style>
        <div className="main" style={{ maxWidth: 760, margin: "0 auto", padding: "20px 18px 60px" }}>
          <button className="ghost-btn" style={{ marginBottom: "var(--space-3)" }} onClick={async () => {
            // Leaving the test moves the student BACK outside the gate, never through it.
            // Any part-finished attempt is cleared so it can never look complete.
            await saveKey("esl-placement", null);
            setObResume({ step: "level", profile });
            setProfile(null);
            setPlacementDone(false);
          }}>Back</button>
          <PlacementTestPage profile={profile} onComplete={async (r) => {
            await saveKey("esl-placement", r);
            if (r && r.overall) {
              const updatedProfile = { ...profile, level: r.overall };
              setProfile(updatedProfile);
              await saveKey("esl-profile", updatedProfile);
            }
            setPlacementDone(true);
            await markActivity();
          }} />
        </div>
      </div>
    );

  // ── Post-sign-in splash: wordmark on clean background, once per session ──
  const skillCount = {};
  Object.values(diaryPages).forEach((p) => (p.skills || []).forEach((s) => { skillCount[s] = (skillCount[s] || 0) + 1; }));
  const stats = {
    streak: computeStreak(activity),
    entries: Object.values(diaryPages).filter((p) => (p.skills && p.skills.length) || p.homework || p.notes || p.skillsDetail).length,
    words: words.length,
    tasks: taskCount,
    errorTally: Object.entries(errorLog).sort((a, b) => b[1] - a[1]).slice(0, 5),
    skillTally: Object.entries(skillCount).sort((a, b) => b[1] - a[1]),
  };
  const masteryCounts = Object.values(memoryStore.wordMastery).reduce((acc, e) => { acc[e.stage] = (acc[e.stage] || 0) + 1; return acc; }, {});
  const strongWords = (masteryCounts.confident || 0) + (masteryCounts.mastered || 0);
  const lastLesson = memoryStore.lessonLog[0];
  // H3: words the learner has met (incl. Heard Today) but not yet mastered, so
  // Leo can recycle them into lessons/recommendations. M6: their recent questions.
  const recycleWords = Object.entries(memoryStore.wordMastery)
    .filter(([, e]) => e.stage === "new" || e.stage === "seen" || e.stage === "practised")
    .sort((a, b) => MASTERY_RANK[a[1].stage] - MASTERY_RANK[b[1].stage])
    .slice(0, 3).map(([term]) => term);
  const recentQuestions = (memoryStore.questionLog || []).slice(0, 3).map((e) => e.text);
  // Leo's memory: everything Leo knows about this student, woven into his prompts.
  // Enriched with lesson history + word mastery so today genuinely shapes tomorrow.
  const memory = [
    `CEFR level ${levelFor(profile)}`,
    `first language ${LANGS[profile.lang].english}`,
    countryDisplay(profile.country) ? `from ${countryDisplay(profile.country)}` : null,
    stats.errorTally.length ? `their common error areas are: ${stats.errorTally.map(([t]) => t).join(", ")}` : null,
    stats.skillTally.length ? `they most often practise: ${stats.skillTally.slice(0, 3).map(([s]) => s).join(", ")}` : null,
    stats.words ? `they have ${stats.words} words in their word bank` : null,
    stats.streak > 1 ? `they are on a ${stats.streak}-day study streak` : null,
    lastLesson ? `their last lesson was "${lastLesson.scenario}"${typeof lastLesson.score === "number" ? `, where they scored ${lastLesson.score}/${lastLesson.total}` : ""}` : null,
    lastLesson && lastLesson.mission ? `yesterday's mission was: "${lastLesson.mission}"` : null,
    strongWords ? `they have ${strongWords} word${strongWords === 1 ? "" : "s"} they know confidently` : null,
    recycleWords.length ? `words worth recycling into lessons: ${recycleWords.join(", ")}` : null,
    recentQuestions.length ? `recently they asked Leo about: ${recentQuestions.join("; ")}` : null,
  ].filter(Boolean).join("; ");
  const todayInfo = computeTodayProgress({ diaryPages, todayDone, words, heard });
  // §13.3: zh-Hant has no PHRASES entry — a Traditional reader must not receive
  // Simplified l1 anyway. Fall back to an empty set rather than crash.
  const phrases = PHRASES[profile.lang] || [];
  const phraseOfDay = phrases.length ? phrases[new Date().getDate() % phrases.length] : null;
  /* Tab layer sits ABOVE page routing — every `page === "..."` check below is
     unchanged. Each tab remembers the section last used inside it, so leaving
     Words and returning lands on Word review rather than resetting.
     The three useState calls live at the top of App() with the rest of the
     state: hooks must run on EVERY render, and everything here is below the
     early-return chain. */
  const currentTab = TABS.find((t) => t.id === tab) || TABS[0];
  const isSection = currentTab.sections.some((sec) => sec.page === page);

  const goTo = (id) => {
    if (!introPlayed) setIntroPlayed(true);
    const owner = tabOfPage(id);
    setTab(owner);
    setPage(id);
    if (!TAB_SUBSCREENS[id]) setTabPages((prev) => ({ ...prev, [owner]: id }));
  };

  const selectTab = (id) => {
    if (!introPlayed) setIntroPlayed(true);
    // Tapping the tab you are already on returns it to its first section.
    const target = id === tab ? defaultPageOfTab(id) : (tabPages[id] !== undefined ? tabPages[id] : defaultPageOfTab(id));
    setTab(id);
    setPage(target);
    setTabPages((prev) => ({ ...prev, [id]: target }));
  };

  const openApp = goTo;
  const askLeo = (q) => { setPendingAsk(q); openApp("questions"); };

  // Leo's memory actions, grouped into one object (Phase 4/5/6/8) so pages that
  // write back to memory take a single prop instead of several separate ones.
  // Each action updates + persists the store, and — where relevant — marks
  // today's progress, replacing the old bespoke onTaskDone/onDone props.
  const updateMemory = (updater) => setMemoryStore((prev) => { const next = updater(prev); saveMemoryStore(next, prev); return next; });
  const leoMemory = {
    store: memoryStore,
    recordLesson: (result) => {
      updateMemory((prev) => {
        let next = memRecordLesson(prev, result);
        // Reaching the end of a lesson is only possible after answering the
        // Unscramble and Use-the-word exercises correctly (both block
        // advancing on a wrong answer) — so the taught word was, by
        // construction, used correctly whenever a lesson completes.
        if (result.word) next = memBumpWordMastery(next, result.word, true, todayStr());
        return next;
      });
      // C1: persist a sticky per-day completion flag so a later (second) lesson
      // draft can never reset today's completed status on reload.
      saveKey("esl-lessondone:" + todayStr(), true);
      setTodayDone((p) => ({ ...p, task: true }));
    },
    recordQuestion: (text) => updateMemory((prev) => memRecordQuestion(prev, text)),
    recordDiaryFeedback: (fb) => updateMemory((prev) => memRecordDiaryFeedback(prev, fb)),
    touchWord: (term) => updateMemory((prev) => memTouchWord(prev, term)),
    practiceWord: (term, ok) => updateMemory((prev) => memBumpWordMastery(prev, term, ok, todayStr())),
    completeReview: () => setTodayDone((p) => ({ ...p, vocab: true })),
    // Vocabulary system: save a word to the Word Bank from anywhere in a lesson
    saveWord: async (word) => {
      if (!word) return;
      const w = word.trim();
      if ((words || []).find((x) => x.word.toLowerCase() === w.toLowerCase())) return; // already saved
      const next = [{ word: w, date: todayStr() }, ...words].slice(0, WORD_BANK_CAP);
      setWords(next); await saveKey("esl-words", next);
      updateMemory((prev) => memTouchWord(prev, w));
    },
    /* Batched save for lesson completion. saveWord reads the `words` state
       variable, which does NOT update between calls in the same tick — eight
       sequential calls would each dedupe against the same stale list. This
       builds the merged list in one pass and writes once, instead of eight
       storage writes plus eight memory-store rewrites.
       touchWord is deliberately omitted: mastery for these words is already
       being tracked by the vocabulary and grammar exercises. */
    saveWords: async (list) => {
      const incoming = (list || [])
        .map((w) => (typeof w === "string" ? w : w && w.word))
        .filter(Boolean).map((w) => String(w).trim()).filter(Boolean);
      if (!incoming.length) return;
      const have = new Set((words || []).map((x) => (x.word || "").toLowerCase()));
      const fresh = [];
      for (const w of incoming) {
        const k = w.toLowerCase();
        if (have.has(k)) continue;   // already banked, or a repeat within this batch
        have.add(k);
        fresh.push({ word: w, date: todayStr() });
      }
      if (!fresh.length) return;
      const next = [...fresh, ...words].slice(0, WORD_BANK_CAP);
      setWords(next); await saveKey("esl-words", next);
    },
  };

  return (
    <div className="app">
      <style>{CSS}</style>
      <SignedInContext profile={profile} />
      <div className="app-body">
      {page === null ? (
        <HomeScreen profile={profile} onOpen={goTo} animate={!skylineSeen} todayInfo={todayInfo}
          continuity={continuityLine(memoryStore.lessonLog)} noticed={noticedLine(stats)} />
      ) : (
        <>
          {!isSection && (
            <header className="app-header">
              <button className="back-btn" onClick={() => goTo(defaultPageOfTab(tab))}><ChevronLeft size={20} /> Back</button>
              <span className="app-header-title">{page === "diary" ? "Diary" : page === "task" ? "Leo's Lesson" : ""}</span>
            </header>
          )}
          <main className="main">
            {isSection && currentTab.sections.length > 1 && (
              <SectionSwitch sections={currentTab.sections} page={page} onSelect={goTo} />
            )}
            {page === "progress" && <ProgressPage stats={stats} />}
            {page === "diary" && <DiaryPage profile={profile} memory={memory} leoMemory={leoMemory} pages={diaryPages} setPages={setDiaryPages} markActivity={markActivity} addErrors={addErrors} />}
            {page === "task" && <LessonPage profile={profile} memory={memory} leoMemory={leoMemory} words={words} heard={heard} diaryPages={diaryPages} activity={activity} errorLog={errorLog} stats={stats} markActivity={markActivity} bumpTasks={bumpTasks} />}
            {page === "questions" && <QuestionsPage profile={profile} memory={memory} leoMemory={leoMemory} pendingAsk={pendingAsk} onPendingHandled={() => setPendingAsk(null)} markActivity={markActivity} onOpenAustralia={(term) => { setAusQuery(term); goTo("australia"); }} />}
            {page === "dictionary" && <DictionaryPage profile={profile} words={words} setWords={setWords} markActivity={markActivity} onAskLeo={askLeo} leoMemory={leoMemory} />}
            {page === "vocab" && <ReviewPage profile={profile} memory={memory} leoMemory={leoMemory} words={words} heard={heard} diaryPages={diaryPages} markActivity={markActivity} />}
            {page === "heard" && <HeardPage profile={profile} heard={heard} setHeard={setHeard} markActivity={markActivity} onAskLeo={askLeo} leoMemory={leoMemory} />}
            {page === "australia" && <AustraliaPage profile={profile} memory={memory} initialQuery={ausQuery} />}
            {page === "placement" && <PlacementTestPage profile={profile} onComplete={async (r) => { await saveKey("esl-placement", r); await markActivity(); }} />}
          </main>
        </>
      )}
      </div>
      <TabBar tab={tab} onSelect={selectTab} />
    </div>
  );
}

/* ================= STYLES ================= */

const CSS = `
:root{
  /* Legacy tokens (preserved for existing components) */
  --paper:#FBFAF5; --ink:#22302A; --euca:#37624B; --euca-deep:#274A39;
  --wattle:#E8A91D; --sage:#E9EFE7; --line:#D7E1D6; --rust:#B95737; --card:#FFFFFF;
  --sand:#F2E7CF; --sand-2:#E6D4AF; --sand-grain:#C9B287; --sand-shadow:#A98D5E;
  --thong-sole:#242424; --thong-wall:#0D0D0D; --thong-tex:#4A4A4A; --thong-rim:#6B6B6B; --thong-strap:#1A1A1A; --thong-shine:#8A8A8A;
  /* P2 Design System */
  --leo-green:#2A7C6F; --leo-green-light:#E8F4F2; --leo-neutral:#5C5248; /* warm neutral — retained for future design use */
  --bg-warm:#FAFAF8; --bg-card:#FFFFFF;
  --text-primary:#1A1A1A; --text-secondary:#6B7280; --text-tertiary:#9CA3AF;
  --divider:#EDEDEA; /* Ruling 4 — rows inside a card, and the tab bar's top edge. Never an outer edge. */
  --color-success:#16A34A; --color-error:#DC4A3A; --color-warning:#E5A117;
  --space-1:4px; --space-2:8px; --space-3:16px; --space-4:24px; --space-5:32px; --space-6:48px; --space-7:64px;
}
*{box-sizing:border-box; margin:0;}
.app{min-height:100vh; background:var(--bg-warm); color:var(--text-primary); font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; font-size:16px; line-height:1.6;}
h2,h3{font-family:'Fraunces',serif; font-weight:650; color:var(--euca-deep);}
/* P2 Type Scale */
.text-display{font-size:32px; font-weight:700; line-height:1.2;}
.text-page-title{font-size:22px; font-weight:600; line-height:1.3;}
.text-section{font-size:17px; font-weight:600; line-height:1.4;}
.text-body{font-size:16px; font-weight:400; line-height:1.6;}
.text-leo{font-size:16px; font-weight:500; line-height:1.6;}
.text-supporting{font-size:14px; font-weight:400; line-height:1.5;}
.text-caption{font-size:12px; font-weight:500; line-height:1.4; letter-spacing:.02em;}

h2{font-size:26px;} h3{font-size:17px; margin-bottom:6px;}

/* ---- A1 navigation: tab bar + section switch (settled tokens only) ---- */
.app-body{padding-bottom:calc(56px + env(safe-area-inset-bottom, 0px));}
.tab-bar{position:fixed; left:0; right:0; bottom:0; z-index:40; display:flex;
  height:calc(56px + env(safe-area-inset-bottom, 0px));
  padding-bottom:env(safe-area-inset-bottom, 0px);
  background:var(--bg-card); border-top:1px solid var(--divider); box-shadow:none;}
.tab-item{flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
  gap:var(--space-1); background:none; border:none; cursor:pointer; padding:0; min-height:56px;
  font-family:'Inter',-apple-system,sans-serif; color:var(--text-secondary);
  transition:color 200ms ease;}
.tab-item-label{font-size:12px; font-weight:500; line-height:1;}
.tab-item-on{color:var(--leo-green);}
.tab-item:focus-visible{outline:2px solid var(--leo-green); outline-offset:-2px; border-radius:8px;}
.seg-control{display:flex; gap:var(--space-2); margin:0 0 var(--space-4);}
.seg-item{flex:1; min-height:44px; border:none; background:transparent; border-radius:10px;
  font-family:'Inter',-apple-system,sans-serif; font-size:15px; font-weight:400;
  color:var(--text-secondary); cursor:pointer; transition:color 200ms ease, background-color 200ms ease;}
.seg-item-on{background:var(--leo-green-light); color:var(--leo-green); font-weight:500;}
.seg-item:focus-visible{outline:2px solid var(--leo-green); outline-offset:2px;}
.today-done-btn{display:inline-flex; align-items:center; gap:var(--space-1); background:none;
  border:none; padding:var(--space-1) var(--space-2); margin:calc(var(--space-1) * -1) calc(var(--space-2) * -1);
  border-radius:8px; cursor:pointer; font-family:'Inter',-apple-system,sans-serif;
  font-size:14px; font-weight:500; color:var(--leo-green); min-height:44px;}
.today-done-btn:focus-visible{outline:2px solid var(--leo-green); outline-offset:2px;}
@media (prefers-reduced-motion: reduce){.tab-item,.seg-item{transition:none;}}

/* ---- Warm-up free response — indicator now the shared drawn rule (§3) ---- */
.wu-skip-line{margin-top:var(--space-3);}

/* ---- Australia section (A3) — reference voice, settled tokens only ---- */
.aus-wrap{max-width:760px; margin:0 auto;}
.aus-list{list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:var(--space-3);}
.aus-card{display:flex; align-items:center; gap:var(--space-3); width:100%; text-align:left;
  background:var(--bg-card); border:none; box-shadow:none; border-radius:12px; padding:20px;
  cursor:pointer; font-family:'Inter',-apple-system,sans-serif; min-height:48px;}
.aus-card:focus-visible{outline:2px solid var(--leo-green); outline-offset:2px;}
.aus-card-icon{color:var(--text-secondary); flex-shrink:0;}
.aus-card-text{flex:1; display:flex; flex-direction:column; gap:var(--space-1);}
.aus-card-title{font-size:17px; font-weight:600; color:var(--text-primary); line-height:1.4;}
.aus-card-sum{font-size:14px; font-weight:400; color:var(--text-secondary); line-height:1.5;}
.aus-card-chev{color:var(--text-tertiary); flex-shrink:0;}
.aus-detail{background:var(--bg-card); border:none; box-shadow:none; border-radius:12px; padding:20px; margin-top:var(--space-3);}
.aus-detail-title{display:flex; align-items:center; gap:var(--space-2); font-family:'Inter',-apple-system,sans-serif;
  font-size:22px; font-weight:600; line-height:1.3; color:var(--text-primary); margin:0 0 var(--space-3);}
.aus-detail-icon{color:var(--text-secondary); flex-shrink:0;}
.aus-intro{font-size:16px; font-weight:400; line-height:1.65; color:var(--text-primary);}
.aus-points{list-style:none; margin:var(--space-4) 0 0; padding:0; display:flex; flex-direction:column; gap:var(--space-3);}
.aus-points li{font-size:16px; font-weight:400; line-height:1.65; color:var(--text-primary);}
.aus-source{margin-top:var(--space-4);}
.aus-search{margin-top:var(--space-5);}
.aus-search-label{display:block; font-size:14px; font-weight:400; color:var(--text-secondary); margin-bottom:var(--space-2);}
.aus-search-row{display:flex; gap:var(--space-2);}
.aus-input{flex:1; border:1px solid var(--divider); border-radius:10px; padding:12px 14px;
  font-family:'Inter',-apple-system,sans-serif; font-size:16px; font-weight:400;
  color:var(--text-primary); background:var(--bg-card); min-height:48px;}
.aus-input:focus{outline:2px solid var(--leo-green); outline-offset:-1px;}
.aus-answer{background:var(--bg-card); border-radius:12px; padding:20px; margin-top:var(--space-3);
  font-size:16px; font-weight:400; line-height:1.65; color:var(--text-primary);}
.doorway{margin:var(--space-3) 0 var(--space-2);}
.doorway-line{font-size:16px; font-weight:500; line-height:1.6; color:var(--text-primary); margin-bottom:var(--space-3);}

/* ---- Home screen (A2) — settled tokens only ---- */
.home-screen{max-width:520px; margin:0 auto; padding:var(--space-4) var(--space-3) var(--space-5); text-align:left;}
.home-greet{margin-bottom:var(--space-5);}
.greet-hello{font-family:'Inter',-apple-system,sans-serif; font-size:22px; font-weight:600; line-height:1.3; color:var(--text-primary); margin:0; text-align:center;}
.greet-date{font-size:14px; font-weight:400; color:var(--text-secondary); margin-top:var(--space-1); text-align:center;}
.greet-clock{margin-left:var(--space-2); color:var(--text-tertiary);}
.greet-cont{font-size:16px; font-weight:500; line-height:1.6; color:var(--text-primary); margin-top:var(--space-3);}
.today-card{display:flex; flex-direction:column; gap:var(--space-3);}
.tc-row{display:flex; align-items:center; gap:var(--space-3); width:100%; min-height:48px;
  background:none; border:none; padding:var(--space-2) 0; text-align:left; cursor:pointer;
  font-family:'Inter',-apple-system,sans-serif; color:var(--text-primary); border-radius:8px;}
.tc-row:disabled{cursor:default;}
.tc-row:focus-visible{outline:2px solid var(--leo-green); outline-offset:2px;}
.tc-icon{color:var(--leo-green); flex-shrink:0;}
.tc-label{flex:1; font-size:16px; font-weight:400;}
.tc-done{display:inline-flex; align-items:center; gap:var(--space-1); font-size:14px; font-weight:400; color:var(--color-success);}
.tc-gate{font-size:14px; font-weight:400; color:var(--text-tertiary);}
.tc-cta{margin-top:var(--space-2);}
.tc-alldone{font-size:16px; font-weight:400; line-height:1.6; color:var(--text-primary); margin-top:var(--space-2);}
.noticed-card{display:block; width:100%; text-align:left; background:var(--bg-card);
  border:none; box-shadow:none; border-radius:12px; padding:20px; margin-top:var(--space-4);
  font-family:'Inter',-apple-system,sans-serif; font-size:16px; font-weight:400; line-height:1.6;
  color:var(--text-primary); cursor:pointer;}
.noticed-card:focus-visible{outline:2px solid var(--leo-green); outline-offset:2px;}
.home-skyline{margin-top:var(--space-6); opacity:.45;}
.home-skyline .sky-img{width:100%; max-width:none;}
/* Whiteboard logo */
.wb-splash{display:flex; align-items:center; justify-content:center; min-height:100dvh; background:var(--bg-warm);}
.wb-logo-phase{animation:wbFadeOut 200ms ease 2000ms forwards;}
.wb-logo-svg{display:block;}
.brand-mark{display:flex; justify-content:center; margin:0 auto var(--space-4);}
.brand-mark-sm{display:flex; justify-content:center; margin:0 auto var(--space-3);}
.wb-frame{fill:none; stroke:var(--leo-green); stroke-width:3; stroke-linecap:butt; stroke-linejoin:miter;}
.wb-frame-draw{stroke-dasharray:3450; stroke-dashoffset:3450; animation:wbStroke 900ms ease-out forwards;}
.wb-letter-static{fill:var(--leo-green);}
.wb-letter-anim{fill:var(--leo-green); fill-opacity:0; stroke:var(--leo-green); stroke-width:1.5; stroke-dasharray:800; stroke-dashoffset:800; animation:wbStroke 380ms ease-out forwards, wbFill 220ms ease-out forwards;}
.wb-mono{font-family:'Inter',sans-serif; font-weight:700; font-size:24px; fill:var(--bg-warm, #FAFAF8);}
@keyframes wbStroke{to{stroke-dashoffset:0;}}
@keyframes wbFill{to{fill-opacity:1;}}
@keyframes wbFadeOut{to{opacity:0;}}
@media (prefers-reduced-motion: reduce){
  /* §4.4 — the fade is retained. An opacity transition on a still image is
     not what a reduced-motion user asks to be spared; removing it cuts hard. */
  .wb-logo-phase{animation:wbFadeOut 200ms ease 600ms forwards;}
  .wb-frame-draw{animation:none; stroke-dashoffset:0;}
  .wb-letter-anim{animation:none; stroke-dashoffset:0; fill-opacity:1;}
}

/* P2 Motion */
@keyframes fadeSlideIn{from{opacity:0; transform:translateX(16px);} to{opacity:1; transform:translateX(0);}}
.screen-enter{animation:fadeSlideIn 250ms ease-out;}
@keyframes fadeIn{from{opacity:0;} to{opacity:1;}}
.card-stagger{animation:fadeIn 200ms ease-out both;}
.progress-fill{transition:width 400ms ease-out;}
button:active{transform:scale(.97); transition:transform 100ms ease-out;}
.sky-img{width:100%; max-width:470px; display:block; margin:8px auto 0;}
/* The skyline is drawn across, not faded in. The artwork is a raster line
   drawing, so there are no paths to stroke — a left-to-right wipe is the
   honest equivalent: the line appears the way a hand lays it down. §8 rule 1
   in the only form this asset allows. Still once ever, per spec A3.5. */
.sky-anim{animation:skyDraw 1800ms ease-out .3s both;}
@keyframes skyDraw{from{clip-path:inset(0 100% 0 0);} to{clip-path:inset(0 0 0 0);}}
/* ---- MOTION §3: the drawn rule. Stroke only, one colour, one weight, no
   fill, no loop. It draws once in 600ms ease-out and rests as a finished rule.
   --euca matches the completion tick; Part C Pass 5 remaps both together. ---- */
.wait-block{display:flex; flex-direction:column; align-items:center; gap:var(--space-3); padding:var(--space-6) 20px; text-align:center;}
.wait-inline{display:flex; align-items:center; gap:10px; padding:8px 0;}
.drawn-rule{display:block; overflow:visible;}
.drawn-rule-line{stroke:var(--euca); stroke-linecap:round; fill:none; animation:drawRule 600ms ease-out forwards;}
@keyframes drawRule{to{stroke-dashoffset:0;}}
.drawn-tick{display:inline-block; vertical-align:-2px; flex-shrink:0;}
.drawn-tick-mark{fill:none; stroke:currentColor; stroke-width:2.6; stroke-linecap:round;
  stroke-linejoin:round; stroke-dasharray:21; stroke-dashoffset:21;
  animation:drawTick 350ms ease-out forwards;}
@keyframes drawTick{to{stroke-dashoffset:0;}}
.wait-label{font-size:16px; font-weight:500; color:var(--text-primary); opacity:.75; max-width:28ch; line-height:1.6; margin:0; animation:scRise 400ms 200ms both ease-out;}
.wait-inline .wait-label{font-size:14px; opacity:1; color:var(--euca);}
/* §5 — reduced motion shows the finished artefact, never the absence of one.
   The escalation ladder still changes on schedule: that is information. */
@media (prefers-reduced-motion: reduce){
  .sky-anim{animation:none; clip-path:none;}
  .drawn-rule-line{animation:none; stroke-dashoffset:0 !important;}
  .wait-label{animation:none;}
  .drawn-tick-mark{animation:none; stroke-dashoffset:0;}
  .leo-accent::before{animation:none; transform:scaleY(1);}
}
.lesson-head{margin-bottom:6px;}
.lesson-reco-head{display:flex; align-items:center; gap:12px; margin-bottom:6px;}
.reco-kicker{font-size:12.5px; text-transform:uppercase; letter-spacing:.02em; color:var(--leo-green); opacity:.7; font-weight:700;}
.reco-scenario{margin:2px 0 0;}
.reco-alts{display:flex; align-items:center; justify-content:center; gap:10px; margin-top:12px;}
.reco-dot{opacity:.4;}
.lesson-greeting{font-size:17px; color:var(--text-primary); margin:0;}
.lesson-why{margin-top:4px;}
.lesson-goal{background:var(--leo-green-light); border-radius:10px; padding:12px 14px; margin-top:10px; font-weight:500; color:var(--text-primary); border-left:3px solid var(--leo-green);}
.lesson-tomorrow{margin-top:12px; color:var(--text-primary); opacity:.85;}
.purpose-line{font-size:13px; color:var(--text-primary); background:var(--leo-green-light); border-radius:8px; padding:6px 10px; margin:2px 0 8px;}
.vocab-token{display:inline; border-bottom:2px dotted var(--leo-green); color:var(--text-primary); cursor:pointer; font-weight:600; transition:background .15s; border-radius:2px; padding:0 1px;}
.vocab-token:hover,.vocab-token:focus-visible{background:rgba(55,98,75,.10); outline:none;}
.vocab-overlay{position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:1000; display:flex; align-items:flex-end;}
.vocab-sheet{background:var(--bg-warm); border-radius:20px 20px 0 0; width:100%; max-height:82vh; display:flex; flex-direction:column; box-shadow:0 -4px 32px rgba(0,0,0,.18); animation:sheetUp .22s cubic-bezier(.25,.8,.25,1); position:relative;}
@keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.vocab-sheet-handle{width:40px; height:4px; background:var(--line); border-radius:2px; margin:12px auto 4px; flex-shrink:0;}
.vocab-sheet-scroll{overflow-y:auto; padding:8px 22px 32px; flex:1; -webkit-overflow-scrolling:touch;}
.vocab-close{position:absolute; top:14px; right:16px; background:none; border:none; font-size:18px; color:var(--ink); opacity:.55; cursor:pointer; padding:6px; line-height:1;}
.vocab-header{margin-bottom:14px;}
.vocab-word{font-family:'Fraunces',serif; font-size:32px; font-weight:700; color:var(--euca-deep); margin:0 0 6px;}
.vocab-meta{display:flex; align-items:center; gap:8px; flex-wrap:wrap;}
.vocab-ipa{font-family:'Karla',sans-serif; font-size:15px; color:var(--ink); opacity:.7; font-style:italic;}
.vocab-chip{font-size:12px; font-weight:700; background:var(--sage); color:var(--euca-deep); border-radius:20px; padding:3px 10px; text-transform:uppercase; letter-spacing:.5px;}
.vocab-chip-cefr{background:var(--wattle); color:#fff;}
.vocab-def{font-size:16px; line-height:1.55; color:var(--ink); margin:0 0 18px; font-family:'Karla',sans-serif;}
.vocab-section{margin-bottom:18px;}
.vocab-section-title{font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--euca); margin:0 0 8px;}
.vocab-example{font-size:15px; line-height:1.5; color:var(--ink); margin:0 0 6px; padding-left:10px; border-left:3px solid var(--line);}
.vocab-example-today{border-left-color:var(--euca); background:rgba(55,98,75,.06); border-radius:0 6px 6px 0; padding:6px 10px;}
.vocab-today-tag{display:block; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.8px; color:var(--euca); margin-bottom:2px;}
.vocab-related{display:flex; flex-wrap:wrap; gap:8px;}
.vocab-related-chip{font-size:14px; background:#fff; border:1.5px solid var(--line); border-radius:20px; padding:5px 12px; color:var(--euca-deep); font-family:'Karla',sans-serif;}
.vocab-save-btn{width:100%; padding:14px; background:var(--euca); color:#fff; border:none; border-radius:12px; font-family:'Karla',sans-serif; font-size:16px; font-weight:700; cursor:pointer; margin-top:10px;}
.vocab-save-btn-saved{background:var(--sage); color:var(--euca-deep); cursor:default;}
.stage-head{display:flex; align-items:center; justify-content:space-between; gap:10px;}
.skip-btn{background:none; border:none; color:var(--ink); opacity:.55; font-family:'Karla'; font-size:13px; cursor:pointer; padding:6px 8px;}
.skip-btn:hover{opacity:.85; text-decoration:underline;}
.input-row{display:flex; gap:8px; align-items:center;}
.input-row .text-input{flex:1;}
.mic-btn{background:#fff; border:1.5px solid var(--euca); color:var(--euca-deep); border-radius:10px; padding:9px 12px; font-family:'Karla'; font-weight:700; cursor:pointer; white-space:nowrap;}
.mic-on{background:var(--wattle); border-color:var(--wattle); color:#fff;}
.match-grid{display:grid; grid-template-columns:1fr 1.35fr; gap:14px 18px; margin:14px 0 16px; min-height:220px;}
.match-col{display:flex; flex-direction:column; gap:12px;}
.match-word,.match-meaning{position:relative; text-align:left; background:var(--card); border:1.5px solid var(--line); border-radius:14px; padding:13px 15px; font-family:'Karla'; font-size:14.5px; color:var(--ink); user-select:none; -webkit-user-select:none; min-height:52px; display:flex; align-items:center; box-shadow:0 1px 2px rgba(34,48,42,.05), 0 3px 10px rgba(34,48,42,.045); transition:border-color .18s ease, background .18s ease, box-shadow .18s ease, transform .12s ease;}
.match-word{font-family:'Fraunces',serif; font-weight:650; font-size:16px; color:var(--euca-deep); border-right:3px solid var(--euca); padding-right:12px; cursor:grab; letter-spacing:.1px;}
.match-word::after{content:""; display:inline-block; width:9px; height:9px; border-radius:50%; background:var(--euca); margin-left:auto; flex-shrink:0; opacity:.45; transition:opacity .18s ease, transform .18s ease;}
.match-meaning{border-left:3px solid var(--line); padding-left:12px; line-height:1.45; cursor:pointer;}
/* hover — a clear invitation, never a jolt */
.match-word:not(:disabled):hover{border-color:var(--euca); box-shadow:0 2px 4px rgba(34,48,42,.07), 0 8px 20px rgba(55,98,75,.14); transform:translateY(-1px);}
.match-word:not(:disabled):hover::after{opacity:1; transform:scale(1.15);}
.match-meaning:not(:disabled):hover{border-left-color:var(--euca); background:var(--sage);}
/* pressed */
.match-word:not(:disabled):active,.match-meaning:not(:disabled):active{transform:translateY(0) scale(.985); box-shadow:0 1px 2px rgba(34,48,42,.08);}
/* keyboard focus must always be visible */
.match-word:focus-visible,.match-meaning:focus-visible{outline:3px solid var(--wattle); outline-offset:2px;}
/* selected (tap / keyboard path) */
.match-selected{border-color:var(--wattle) !important; background:rgba(232,169,29,.12); box-shadow:0 0 0 3px rgba(232,169,29,.22), 0 8px 22px rgba(232,169,29,.18);}
.match-selected::after{opacity:1; background:var(--wattle);}
/* live drop targets, once a word is selected */
.match-target{border-left-color:var(--wattle); background:rgba(232,169,29,.05); animation:targetPulse 1.6s ease-in-out infinite;}
@keyframes targetPulse{0%,100%{border-left-color:var(--line);} 50%{border-left-color:var(--wattle);}}
.match-dragging{border-color:var(--wattle); background:rgba(232,169,29,.15); box-shadow:0 6px 22px rgba(34,48,42,.18); cursor:grabbing; transform:scale(1.03);}
/* matched — settled, quiet, unmistakably done */
.match-done{border-color:var(--euca); background:var(--sage); color:var(--euca-deep); opacity:.72; cursor:default; box-shadow:none;}
.match-done.match-word::after{background:var(--euca); opacity:1;}
.match-done.match-meaning{border-left-color:var(--euca);}
.match-pop{animation:matchPop .45s cubic-bezier(.34,1.56,.64,1);}
@keyframes matchPop{0%{transform:scale(1);} 40%{transform:scale(1.06);} 100%{transform:scale(1);}}
/* progress */
.match-progress{display:flex; align-items:center; gap:10px; margin-bottom:2px;}
.match-progress-bar{flex:1; height:6px; border-radius:99px; background:var(--line); overflow:hidden;}
.match-progress-bar span{display:block; height:100%; border-radius:99px; background:var(--euca); transition:width .45s cubic-bezier(.4,0,.2,1);}
@media (max-width:380px){
  .match-grid{grid-template-columns:1fr 1.2fr; gap:10px 12px;}
  .match-word{font-size:15px; padding:12px; min-height:56px;}
  .match-meaning{font-size:13.5px; padding:11px 12px; min-height:56px;}
}
@media (prefers-reduced-motion: reduce){
  .match-word,.match-meaning{transition:none;}
  .match-pop,.match-target{animation:none;}
}

/* ---- Completion feedback (every scored stage) ---- */
.stage-complete{display:flex; flex-direction:column; align-items:center; text-align:center; padding:18px 10px 6px; gap:4px;}
.sc-tick{margin-bottom:4px;}
.sc-tick-ring{stroke:var(--euca); stroke-dasharray:145; stroke-dashoffset:145; animation:scRing .5s ease-out forwards;}
.sc-tick-mark{stroke:var(--euca); stroke-dasharray:40; stroke-dashoffset:40; animation:scMark .35s .38s ease-out forwards;}
@keyframes scRing{to{stroke-dashoffset:0;}}
@keyframes scMark{to{stroke-dashoffset:0;}}
.sc-title{font-family:'Fraunces',serif; font-size:23px; font-weight:650; color:var(--euca-deep); margin:2px 0 0; animation:scRise .4s .35s both ease-out;}
.sc-sub{font-size:14.5px; opacity:.75; margin:0 0 12px; max-width:34ch; animation:scRise .4s .45s both ease-out;}
@keyframes scRise{from{opacity:0; transform:translateY(6px);} to{opacity:1; transform:translateY(0);}}
.sc-bar{width:120px; height:3px; border-radius:99px; background:var(--line); overflow:hidden; margin-bottom:14px;}
.sc-bar span{display:block; height:100%; width:100%; background:var(--wattle); transform-origin:left; animation:scCountdown linear forwards;}
@keyframes scCountdown{from{transform:scaleX(0);} to{transform:scaleX(1);}}
@media (prefers-reduced-motion: reduce){
  .sc-tick-ring,.sc-tick-mark{animation:none; stroke-dashoffset:0;}
  .sc-title,.sc-sub{animation:none;}
  .sc-bar span{animation:none; transform:scaleX(1);}
}

/* ---- Warm-up activities ---- */
.wu-head{display:flex; align-items:center; justify-content:space-between; gap:10px; margin:2px 0 12px;}
.wu-badge{display:inline-block; background:var(--sage); color:var(--euca-deep); border:1px solid var(--line); border-radius:99px; padding:4px 11px; font-size:12px; font-weight:700; letter-spacing:.2px;}
.wu-text{white-space:pre-line; background:var(--sage); border-left:3px solid var(--euca); border-radius:0 10px 10px 0; padding:11px 13px; margin:0 0 12px; font-size:14.5px; line-height:1.55;}
.wu-build{min-height:56px; display:flex; flex-wrap:wrap; gap:8px; align-items:center; padding:11px; border:1.5px dashed var(--line); border-radius:12px; background:rgba(233,239,231,.45); margin-bottom:10px;}
.wu-build-lines{flex-direction:column; align-items:stretch;}
.wu-build-empty{font-size:13.5px; opacity:.5;}
.wu-pool{display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px;}
.wu-pool.wu-build-lines{flex-direction:column;}
.wu-chip{background:var(--card); border:1.5px solid var(--line); border-radius:10px; padding:9px 13px; font-family:'Karla'; font-size:14.5px; color:var(--ink); cursor:pointer; text-align:left; min-height:42px; box-shadow:0 1px 2px rgba(34,48,42,.05); transition:border-color .15s, background .15s, transform .1s;}
.wu-chip:not(:disabled):hover{border-color:var(--euca); background:var(--sage);}
.wu-chip:not(:disabled):active{transform:scale(.96);}
.wu-chip:focus-visible{outline:3px solid var(--wattle); outline-offset:2px;}
.wu-chip-built{border-color:var(--euca); background:var(--sage); color:var(--euca-deep); font-weight:500;}
@media (prefers-reduced-motion: reduce){.wu-chip{transition:none;}}

/* ---- Quiz progress ---- */
.quiz-progress{height:4px; border-radius:99px; background:var(--line); overflow:hidden; margin-bottom:10px;}
.quiz-progress span{display:block; height:100%; background:var(--euca); border-radius:99px; transition:width .4s cubic-bezier(.4,0,.2,1);}

.mcq-opts{display:flex; flex-direction:column; gap:8px; margin:10px 0;}
.mcq-opt{text-align:left; background:var(--bg-card); border:1.5px solid var(--line); border-radius:10px; padding:14px 16px; font-size:15px; cursor:pointer; color:var(--text-primary); min-height:56px; display:flex; align-items:center; transition:background .3s ease, border-color .3s ease;}
.mcq-right{border-color:var(--color-success); background:rgba(22,163,74,.10); font-weight:700;}
.mcq-wrong{border-color:var(--color-error); background:rgba(220,74,58,.08);}
.speak-thread{display:flex; flex-direction:column; gap:10px; margin-bottom:12px; max-height:44vh; overflow-y:auto;}
.speak-turn{display:flex; gap:8px; align-items:flex-start;}
.speak-turn p{margin:0; padding:9px 12px; border-radius:12px; font-size:15px; line-height:1.5;}
.speak-leo p{background:var(--sage); color:var(--euca-deep);}
.speak-you{justify-content:flex-end;}
.speak-you p{background:#fff; border:1.5px solid var(--line);}
.gapfill-item{margin-bottom:14px;}
.gapfill-item .input-row{margin-top:6px;}
.frames-panel{margin-bottom:10px;}
.frames-list{background:var(--sage); border-radius:10px; padding:12px 14px; margin-top:6px;}
.frame-item{margin-bottom:8px; padding-bottom:8px; border-bottom:1px dashed var(--line);}
.frame-item:last-child{margin-bottom:0; padding-bottom:0; border-bottom:none;}
.frame-text{font-weight:600; color:var(--euca-deep); font-size:14.5px; margin:0;}
.frame-example{margin:2px 0 0;}
.pron-practice{margin-top:6px;}
.pron-row{border-bottom:1px solid var(--line); padding:8px 0;}
.pron-word{font-family:'Fraunces',serif; font-size:18px; color:var(--euca-deep); font-weight:700;}
.pron-try{margin:12px 0;}
.passage{background:#fff; border:1.5px solid var(--line); border-radius:12px; padding:14px; font-size:15px; line-height:1.65; white-space:pre-line;}
.listen-box{margin-bottom:10px;}
.gram-form{font-family:'Fraunces',serif; background:var(--sage); border-radius:8px; padding:2px 8px; color:var(--euca-deep);}
.review-form{margin-top:12px; border-top:1px solid var(--line); padding-top:10px;}
.ghost-btn.wide,.primary-btn.wide{width:100%;}
.mission-box{display:flex; gap:12px; align-items:flex-start; background:#FFF7E6; border:1.5px solid var(--wattle); border-radius:12px; padding:13px 15px;}
.mission-icon{font-size:22px; line-height:1;}
.rev-options{display:flex; flex-direction:column; gap:9px; margin-top:6px;}
.rev-option{text-align:left; background:#fff; border:1.5px solid var(--line); border-radius:12px; padding:12px 15px; font-family:'Karla'; font-size:15.5px; color:var(--ink); cursor:pointer;}
.rev-option:hover:not(:disabled){border-color:var(--euca);}
.rev-option:focus-visible{outline:3px solid var(--wattle); outline-offset:2px;}
.rev-right{border-color:#28A05A; background:#EAF6EE; color:#1B7A42; font-weight:700;}
.rev-wrong{border-color:#D64040; background:#FBEAEA; color:#B22B2B; font-weight:700;}
.rev-dim{opacity:.5;}
.home-tag{font-family:'Fraunces',serif; font-size:15px; color:var(--euca); opacity:.8; display:block; margin-top:-2px;}
.bot-avatar-leo{width:34px; height:34px; border-radius:10px; background:var(--leo-green); color:var(--bg-warm); font-family:'Manrope','Inter',sans-serif; font-weight:700; font-size:18px; display:flex; align-items:center; justify-content:center; flex-shrink:0;}
.today-panel{background:#fff; border:1px solid var(--line); border-radius:16px; padding:14px 16px 16px; margin:16px auto 6px; max-width:440px; text-align:left; box-shadow:3px 3px 0 var(--sage);}
.today-head{display:flex; align-items:center; gap:10px; margin-bottom:8px;}
.today-head-text{flex:1;}
.today-title{display:block; font-weight:700; color:var(--euca-deep); font-size:16px;}
.today-sub{display:block; font-size:12.5px; opacity:.6;}
.today-row{display:flex; align-items:center; gap:10px; padding:9px 0; border-top:1.5px dashed var(--line);}
.today-row-label{flex:1; font-size:14.5px;}
.today-done{display:inline-flex; align-items:center; gap:4px; color:#1B7A42; font-weight:700; font-size:13.5px;}
.today-cta{margin-top:12px;}
.today-all-done{text-align:center; font-weight:700; color:var(--text-primary); margin-top:12px; font-size:14.5px;}
.leo-feedback-head{display:flex; align-items:center; gap:7px; margin-bottom:6px; color:var(--euca-deep);}

.home-greeting{margin-top:6px; font-size:14.5px; color:var(--euca-deep); display:flex; align-items:center; justify-content:center; gap:10px;}
.home-phrase{font-family:'Fraunces',serif; font-size:16.5px; color:var(--euca-deep); margin-top:14px;}
.home-phrase-l1{display:block; font-family:'Karla'; font-size:13px; color:var(--euca); opacity:.75; margin-top:2px;}
.app-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:20px 10px; margin-top:28px;}
@media (min-width:480px){.app-grid{grid-template-columns:repeat(4,1fr); max-width:440px; margin-left:auto; margin-right:auto;}}
.app-icon-btn{background:none; border:none; cursor:pointer; display:flex; flex-direction:column; align-items:center; gap:7px; font-family:'Karla'; padding:0;}
.app-icon-btn:focus-visible .app-icon{outline:3px solid var(--wattle); outline-offset:3px;}
.app-icon{width:62px; height:62px; border-radius:16px; display:flex; align-items:center; justify-content:center; color:#fff; box-shadow:0 3px 8px rgba(34,48,42,.18); transition:transform .12s ease;}
.app-icon-btn:active .app-icon{transform:scale(.92);}
.app-icon-label{font-size:12px; color:var(--ink); opacity:.8;}

/* ---- Full-page Australian pencil hero ---- */
.oz-page{max-width:680px; margin:0 auto;}
.hero-oz2{position:relative; min-height:100vh; display:flex; flex-direction:column; align-items:center; padding:20px 12px 64px; background:var(--paper); overflow:hidden;}
.oz-title-top{text-align:center; margin-bottom:2px;}
.oz-title{font-size:46px;}
.oz-hello{font-family:'Karla'; font-size:15px; color:var(--euca-deep); opacity:.8; margin-top:2px;}
.oz-canvas{flex:1; width:100%; min-height:0; display:flex; align-items:center; justify-content:center;}
.oz-sketch2{width:100%; height:100%; max-width:600px; display:block;}
.oz-sketch2 .oz-fill{fill:var(--euca-deep); stroke:none; opacity:.92;}
.sketch-anim .oz-fill{opacity:0; animation:ozFill .6s ease forwards;}
@keyframes ozFill{from{opacity:0;} to{opacity:.92;}}
.scroll-cue{position:absolute; bottom:18px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:1px; background:rgba(255,255,255,.85); border:1px solid var(--line); border-radius:16px; padding:8px 18px; color:var(--euca-deep); font-family:'Karla'; font-weight:700; font-size:13px; cursor:pointer; z-index:4; animation:cueBounce 1.7s ease-in-out infinite;}
.scroll-cue:focus-visible{outline:3px solid var(--wattle); outline-offset:2px;}
@keyframes cueBounce{0%,100%{transform:translateX(-50%) translateY(0);} 50%{transform:translateX(-50%) translateY(6px);}}
.apps-section{max-width:520px; margin:0 auto; padding:26px 22px 60px; text-align:center;}
@media (prefers-reduced-motion: reduce){.oz-fill{opacity:.92 !important; animation:none !important;}}

/* ---- App header (inside a feature) ---- */
.app-header{display:flex; justify-content:space-between; align-items:center; padding:14px 18px 8px; max-width:760px; margin:0 auto;}
.back-btn{display:inline-flex; align-items:center; gap:2px; background:none; border:none; color:var(--euca); font-family:'Karla'; font-weight:700; font-size:15px; cursor:pointer; padding:4px 6px 4px 0;}
.back-btn:focus-visible{outline:2px solid var(--wattle); outline-offset:2px; border-radius:6px;}
.app-header-title{font-family:'Inter',-apple-system,sans-serif; font-size:17px; font-weight:600; letter-spacing:-0.01em; color:var(--leo-green);}
@media (prefers-reduced-motion: reduce){
  .sky-anim{animation:none;}
}
.main{max-width:760px; margin:0 auto; padding:10px 18px 60px;}
.section-title{margin:8px 0 14px;}
.section-title .sub{color:var(--euca); opacity:.75; font-size:13.5px; margin-top:2px;}
.card{background:var(--bg-card); padding:20px; border-radius:12px; border:none; box-shadow:none; margin-bottom:12px;}
/* P2 Leo's Visual Presence */
.leo-accent{position:relative; padding-left:var(--space-3);}
/* Leo's rule is drawn down, not printed. Same gesture as the tick: one mark,
   made by one hand, ease-out, once, then still. A 3px line growing from its
   top edge is a draw — stroke-dashoffset would need an SVG for what a
   transform does identically here. */
.leo-accent::before{content:""; position:absolute; left:0; top:0; bottom:0; width:3px;
  background:var(--leo-green); transform:scaleY(0); transform-origin:top;
  animation:drawAccent 450ms ease-out forwards;}
@keyframes drawAccent{to{transform:scaleY(1);}}
.leo-card{background:var(--leo-green-light); padding:20px; border-radius:12px; border:none; box-shadow:none; border-left:3px solid var(--leo-green);}

.muted{color:var(--ink); opacity:.62;} .small{font-size:13.5px;} .center{text-align:center; margin-top:20px;}
.stat-grid{display:grid; grid-template-columns:repeat(auto-fit,minmax(120px,1fr)); gap:10px; margin-bottom:12px;}
.stat{text-align:center; padding:14px 8px;}
.stat-num{font-family:'Fraunces',serif; font-size:32px; font-weight:650; color:var(--euca-deep);}
.stat-label{font-size:12.5px; opacity:.6;}
.wattle{color:var(--wattle);} .euca{color:var(--euca);}
.bar-row{display:flex; align-items:center; gap:10px; margin-top:8px;}
.bar-label{width:150px; font-size:13px; text-transform:capitalize;}
.bar-track{flex:1; height:8px; background:var(--sage); border-radius:99px; overflow:hidden;}
.bar-fill{height:100%; background:var(--euca); border-radius:99px;}
.bar-count{font-size:13px; font-weight:700; color:var(--euca);}
/* ---- Diary book ---- */
.diary-nav{display:flex; justify-content:space-between; align-items:center; margin:2px 0 12px; gap:8px;}
.date-wrap{text-align:center;}
.date-hand{font-family:'Caveat',cursive; font-size:26px; color:var(--euca-deep); line-height:1.1; display:block;}
.today-badge{display:inline-block; background:var(--wattle); font-size:11.5px; font-weight:700; border-radius:6px; padding:2px 9px; color:#3D2E00; margin-top:3px;}
.page-arrow{background:#fff; border:1.5px solid var(--line); border-radius:12px; width:46px; height:46px; display:flex; align-items:center; justify-content:center; color:var(--euca); cursor:pointer; flex-shrink:0;}
.page-arrow:disabled{opacity:.3; cursor:default;}
.page-arrow:focus-visible{outline:3px solid var(--wattle); outline-offset:2px;}
.diary-page2{background:#fff; border:1px solid var(--line); border-radius:16px; box-shadow:3px 3px 0 var(--sage), 6px 6px 0 #F1F5F0; margin-bottom:14px; overflow:hidden;}
.diary-section{padding:16px 18px 18px; border-bottom:1.5px dashed var(--line);}
.diary-section:last-child{border-bottom:none;}
.diary-label{font-family:'Karla',sans-serif; font-weight:700; font-size:17px; color:var(--euca-deep); margin-bottom:2px;}
.diary-help{font-size:13.5px; color:var(--ink); opacity:.6; margin-bottom:12px;}
.input-label{display:block; font-size:13.5px; font-weight:700; color:var(--euca-deep); margin:12px 0 6px;}
.big-input{width:100%; border:1.5px solid #C6D2C5; border-radius:12px; padding:12px 14px; font-family:'Karla'; font-size:16px; color:var(--ink); background:#fff; resize:vertical;}
.big-input::placeholder{color:#8A968D;}
.big-input:focus{outline:3px solid rgba(55,98,75,.3); border-color:var(--euca);}
.ruled-input{background:repeating-linear-gradient(#fff, #fff 27px, var(--line) 27px, var(--line) 28px); line-height:28px; padding-top:5px; padding-bottom:8px; min-height:130px;}
.task-text{flex:1; word-break:break-word;}
.skills-grid{display:flex; flex-wrap:wrap; gap:9px; margin-bottom:6px;}
.skill-chip{display:inline-flex; align-items:center; gap:6px; border:2px solid var(--line); background:#fff; color:var(--ink); border-radius:12px; padding:10px 14px; min-height:46px; font-family:'Karla'; font-size:15px; font-weight:600; cursor:pointer;}
.skill-chip:focus-visible{outline:3px solid var(--wattle); outline-offset:2px;}
.skill-on{background:var(--euca); border-color:var(--euca); color:#fff; box-shadow:0 0 0 3px rgba(55,98,75,.22);}
.save-row{display:flex; align-items:center; gap:10px; margin-top:10px; flex-wrap:wrap;}
.save-page-bar{margin:4px 0 10px;}
.center-flash{display:block; text-align:center; margin-top:8px;}
.saved-flash{color:#1B7A42; font-weight:700; font-size:14px; min-width:60px;}
.sr-only{position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; border:0;}
.page-left{animation:pageLeft .35s ease;}
.page-right{animation:pageRight .35s ease;}
@keyframes pageLeft{from{transform:translateX(46px); opacity:0;} to{transform:none; opacity:1;}}
@keyframes pageRight{from{transform:translateX(-46px); opacity:0;} to{transform:none; opacity:1;}}
.swipe-hint{font-size:12px; opacity:.45; text-align:center; margin:-6px 0 14px;}
.resource-card{display:block; background:#fff; border:1px solid var(--line); border-radius:10px; padding:10px 13px; margin-top:8px; text-decoration:none; color:var(--ink);}
.resource-card:hover{border-color:var(--euca);}
.resource-title{display:flex; align-items:center; gap:6px; font-weight:700; color:var(--euca-deep); margin-bottom:2px;}
@media (prefers-reduced-motion: reduce){.page-left,.page-right{animation:none;}}
.tag-row{display:flex; flex-wrap:wrap; gap:7px; margin-bottom:10px;}
.chip{border:1px solid var(--line); background:#fff; border-radius:999px; padding:5px 13px; font-size:13.5px; font-family:'Karla'; cursor:pointer; color:var(--ink);}
.chip-on{background:var(--euca); color:#fff; border-color:var(--euca);}
.chip:focus-visible,.primary-btn:focus-visible,.ghost-btn:focus-visible{outline:2px solid var(--wattle); outline-offset:2px;}
.primary-btn{display:inline-flex; align-items:center; gap:7px; background:var(--leo-green); color:#fff; border:none; border-radius:10px; padding:12px 20px; font-weight:600; font-size:15px; cursor:pointer; min-height:48px;}
.primary-btn:disabled{opacity:.45; cursor:default;}
.primary-btn.wide{width:100%; justify-content:center; margin-top:18px; padding:12px;}
.ghost-btn{display:inline-flex; align-items:center; gap:6px; background:transparent; color:var(--leo-green); border:1px solid var(--line); border-radius:10px; padding:10px 16px; font-weight:500; font-size:14px; cursor:pointer; min-height:48px;}
.link-btn{background:none; border:none; color:var(--euca); font-weight:700; cursor:pointer; font-family:'Karla'; font-size:inherit; text-decoration:underline;}
.link-btn:focus-visible{outline:2px solid var(--wattle); outline-offset:2px; border-radius:4px;}
.icon-btn{background:none; border:none; color:var(--ink); opacity:.4; cursor:pointer; margin-left:auto;}
.icon-btn:hover{opacity:.9; color:var(--rust);}
.feedback{background:var(--sage); border-radius:10px; padding:12px 14px; margin-top:10px;}
.reform{font-style:italic; color:var(--euca-deep); margin:4px 0 8px;}
.tip{margin-top:6px;}
.text-input{width:100%; border:1px solid var(--line); border-radius:10px; padding:10px 13px; font-family:'Karla'; font-size:15px; margin-bottom:10px; background:#fff; color:var(--ink);}
.text-input:focus{outline:2px solid var(--euca); border-color:var(--euca);}
.search-row{display:flex; gap:8px; margin-bottom:14px;}
.search-row .text-input{margin-bottom:0;}
.q-sentence{font-family:'Fraunces',serif; font-size:17px; color:var(--euca-deep); margin-bottom:8px;}
.dict-word{font-size:22px;}
.ipa{font-family:'Karla'; font-weight:400; font-size:15px; color:var(--euca); margin-left:6px;}
.pos{font-size:12px; background:var(--sage); border-radius:6px; padding:2px 7px; color:var(--euca-deep); margin-left:6px; font-family:'Karla'; font-weight:500; vertical-align:middle;}
.l1-line{margin:6px 0;}
.phrase-card{text-align:center; padding:20px;}
.phrase-en{font-family:'Fraunces',serif; font-size:19px; color:var(--euca-deep); margin-bottom:6px;}
.phrase-l1{color:var(--euca); opacity:.8;}
.ok{display:flex; align-items:center; gap:6px; color:var(--color-success); font-weight:500; margin-top:var(--space-3); border-left:3px solid var(--leo-green); padding-left:var(--space-3); font-size:16px; line-height:1.6; animation:fadeIn 200ms ease-out 150ms both;}
.bad{display:flex; align-items:center; gap:6px; color:var(--color-error); font-weight:500; margin-top:var(--space-3); border-left:3px solid var(--leo-green); padding-left:var(--space-3); font-size:16px; line-height:1.6; animation:fadeIn 200ms ease-out 150ms both;}
.word-pool{display:flex; flex-wrap:wrap; gap:8px; margin:12px 0;}
.word-tile{background:#fff; border:1.5px solid var(--euca); color:var(--euca-deep); border-radius:10px; padding:8px 14px; font-family:'Karla'; font-weight:700; font-size:15px; cursor:pointer; box-shadow:0 2px 0 var(--line);}
.word-tile:focus-visible{outline:3px solid var(--wattle); outline-offset:2px;}
.built-line{min-height:44px; background:var(--sage); border-radius:10px; padding:10px 14px; font-size:16px; font-weight:500;}
.btn-row{display:flex; gap:10px; margin-top:6px;}
.task-link-note{background:var(--sage); border-radius:10px; padding:9px 13px; font-size:13.5px; color:var(--euca-deep); margin-bottom:10px;}
.progress-bar{height:3px; border-radius:99px; background:rgba(156,163,175,.2); overflow:hidden; margin-bottom:var(--space-3);}
.progress-bar span{display:block; height:100%; border-radius:99px; background:var(--leo-green); transition:width 400ms ease-out;}
.big-emoji{font-size:44px; margin-bottom:8px;}
/* ---- Chat (Questions) ---- */
.chat-wrap{max-width:760px; margin:0 auto;}
.chat-banner{display:flex; align-items:center; gap:8px; background:var(--sage); border-radius:12px; padding:10px 14px; font-size:13.5px; color:var(--euca-deep); margin-bottom:10px; position:sticky; top:0; z-index:2;}
.chat-banner strong{color:var(--euca);}
.clear-chat{margin-left:auto; background:#fff; border:1px solid var(--line); border-radius:8px; padding:4px 10px; font-size:12.5px; color:var(--euca); cursor:pointer; font-family:'Karla'; flex-shrink:0;}
.chat-scroll{display:flex; flex-direction:column; gap:12px; padding:6px 2px 16px; min-height:40vh;}
.chat-empty{text-align:center; padding:20px 6px;}
.chat-empty-emoji{font-size:40px;}
.chat-empty-title{font-family:'Fraunces',serif; font-size:19px; color:var(--euca-deep); margin:6px 0 14px;}
.bubble-row{display:flex; gap:8px; align-items:flex-end;}
.row-user{justify-content:flex-end;}
.row-bot{justify-content:flex-start;}
.bot-avatar{width:28px; height:28px; border-radius:8px; background:var(--leo-green); color:var(--bg-warm); font-family:'Manrope','Inter',sans-serif; font-weight:700; display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0;}
.bubble{max-width:80%; padding:11px 15px; border-radius:18px; font-size:15.5px; line-height:1.5; white-space:pre-wrap; word-break:break-word;}
.bubble-user{background:var(--euca); color:#fff; border-bottom-right-radius:5px;}
.bubble-bot{background:#fff; border:1px solid var(--line); color:var(--ink); border-bottom-left-radius:5px;}
.typing{display:flex; gap:5px; align-items:center; padding:14px 16px;}
.chat-input-bar{position:sticky; bottom:0; display:flex; gap:8px; align-items:flex-end; padding:10px 0 12px; background:var(--paper); border-top:1px solid var(--line); z-index:2;}
.chat-input{flex:1; border:1.5px solid #C6D2C5; border-radius:22px; padding:11px 16px; font-family:'Karla'; font-size:16px; resize:none; max-height:120px; color:var(--ink); background:#fff; min-height:46px;}
.chat-input:focus{outline:3px solid rgba(55,98,75,.3); border-color:var(--euca);}
.chat-send{width:46px; height:46px; border-radius:50%; background:var(--euca); color:#fff; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0;}
.chat-send:disabled{opacity:.4; cursor:default;}
.chat-send:focus-visible{outline:3px solid var(--wattle); outline-offset:2px;}
/* ---- Help in Australia accordions ---- */
.accordion{background:#fff; border:1px solid var(--line); border-radius:14px; margin-bottom:10px; overflow:hidden;}
.accordion-open{border-color:var(--euca);}
.accordion-head{width:100%; display:flex; align-items:center; gap:12px; background:none; border:none; padding:15px 16px; cursor:pointer; font-family:'Karla'; text-align:left;}
.accordion-head:focus-visible{outline:3px solid var(--wattle); outline-offset:-3px;}
.accordion-icon{font-size:24px; line-height:1; flex-shrink:0;}
.accordion-title{flex:1; font-weight:700; font-size:16px; color:var(--euca-deep);}
.accordion-chev{font-size:24px; color:var(--euca); font-weight:400; width:22px; text-align:center; flex-shrink:0;}
.accordion-body{padding:2px 18px 18px; animation:fadeUp .25s ease;}
.emergency-box{background:#FBEAEA; border:1px solid #F0C9C9; border-radius:12px; padding:12px 14px; margin-bottom:12px;}
.emergency-line{font-size:17px; color:#8A2020; margin:3px 0; display:flex; align-items:center; gap:8px;}
.help-intro{font-size:15px; color:var(--ink); margin-bottom:10px;}
.help-list{margin:0 0 6px; padding-left:20px;}
.help-list li{font-size:14.5px; line-height:1.55; margin-bottom:7px; color:var(--ink);}
.help-sub{margin-top:12px;}
.help-sub-head{font-size:15px; font-weight:700; color:var(--euca-deep); margin-bottom:6px;}
.help-link{display:inline-flex; align-items:center; gap:5px; color:var(--euca); font-weight:700; font-size:14px; text-decoration:none; margin-top:6px;}
.help-link:hover{text-decoration:underline;}
.help-link-row{display:flex; gap:16px; flex-wrap:wrap; margin-top:6px;}
.motiv-wrap{min-height:60vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:20px 8px;}
.motiv-toggle{display:flex; gap:6px; background:var(--sage); border-radius:12px; padding:4px; margin-bottom:34px;}
.motiv-toggle .tab{padding:8px 20px;}
.motiv-quote-area{position:relative; max-width:440px; margin-bottom:36px;}
.motiv-mark{font-family:'Fraunces',serif; font-size:70px; color:var(--euca); opacity:.25; position:absolute; top:-34px; left:-6px;}
.motiv-quote{font-family:'Fraunces',serif; font-size:27px; line-height:1.4; color:var(--euca-deep);}
.motiv-next{max-width:260px;}
.mic-btn{width:44px; height:44px; border-radius:10px; border:1.5px solid var(--line); background:#fff; color:var(--euca); display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0;}
.mic-btn:focus-visible{outline:2px solid var(--wattle); outline-offset:2px;}
.mic-on{background:var(--rust); color:#fff; border-color:var(--rust); animation:micPulse 1.2s ease-in-out infinite;}
@keyframes micPulse{0%,100%{box-shadow:0 0 0 0 rgba(185,87,55,.5);} 50%{box-shadow:0 0 0 7px rgba(185,87,55,0);}}
@media (prefers-reduced-motion: reduce){.mic-on{animation:none;}}
.tabs{display:flex; gap:6px; background:var(--sage); border-radius:12px; padding:4px; margin-bottom:14px;}
.tab{flex:1; border:none; background:none; border-radius:9px; padding:9px 12px; font-family:'Karla'; font-weight:700; font-size:14.5px; color:var(--euca-deep); cursor:pointer;}
.tab-on{background:#fff; box-shadow:0 1px 3px rgba(34,48,42,.12);}
.tab:focus-visible{outline:2px solid var(--wattle); outline-offset:2px;}
.cefr-badge{font-size:12px; font-weight:700; background:var(--wattle); color:#3D2E00; border-radius:6px; padding:2px 7px; margin-left:4px; vertical-align:middle;}
.thes-block{margin-top:12px;}
.thes-label{display:block; font-size:12.5px; font-weight:700; text-transform:uppercase; letter-spacing:.4px; color:var(--euca); opacity:.75; margin-bottom:6px;}
.chip-plain{cursor:default;}
.onboard{min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; background:var(--paper);}
.welcome-splash{text-align:center; display:flex; flex-direction:column; align-items:center;}
.welcome-word{font-size:clamp(40px, 13vw, 60px); line-height:1.2;}
.welcome-leo{margin-top:2px; opacity:0; animation:fadeUp .8s ease 7.5s forwards;}
@media (prefers-reduced-motion: reduce){
  .welcome-leo{animation:none; opacity:1;}
}
.welcome-l1s{font-family:'Karla'; font-size:16px; color:var(--euca); opacity:0; margin-top:12px; animation:fadeUp .8s ease 3.9s forwards;}
/* ---- Onboarding wizard ---- */
.ob-card{max-width:440px; width:100%; background:#fff; border:1px solid var(--line); border-radius:20px; padding:26px 24px 22px; text-align:center;}
.ob-dots{display:flex; gap:8px; justify-content:center; margin:14px 0 22px;}
.ob-question{font-family:'Fraunces',serif; font-size:24px; color:var(--euca-deep); margin-bottom:16px;}
.ob-help{font-size:13.5px; color:var(--ink); opacity:.6; margin:-8px 0 16px;}
.ob-input{text-align:center; font-size:18px;}
.ob-nav{display:flex; justify-content:space-between; align-items:center; gap:10px; margin-top:22px;}
.ob-nav-right{display:flex; gap:8px;}
.level-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:9px;}
.level-card{border:2px solid var(--line); background:#fff; border-radius:12px; padding:12px 4px; cursor:pointer; display:flex; flex-direction:column; gap:3px; font-family:'Karla';}
.level-card:focus-visible{outline:3px solid var(--wattle); outline-offset:2px;}
.level-on{border-color:var(--euca); background:var(--sage); box-shadow:0 0 0 3px rgba(55,98,75,.18);}
.level-code{font-family:'Fraunces',serif; font-size:20px; font-weight:650; color:var(--euca-deep);}
.level-label{font-size:11px; opacity:.65; line-height:1.15;}
@keyframes fadeUp{from{opacity:0; transform:translateY(8px);} to{opacity:.8; transform:translateY(0);}}
.fade-in{animation:fadeUp .5s ease forwards;}
@media (prefers-reduced-motion: reduce){.welcome-l1s,.fade-in{animation:none; opacity:.8;}}
/* ---- LEO reveal animation ---- */
.leo-reveal{display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:60vh; text-align:center;}
.leo-reveal-words{display:flex; gap:14px; flex-wrap:wrap; justify-content:center; align-items:baseline;}
.leo-reveal-word{font-family:'Fraunces',serif; font-size:clamp(26px, 8vw, 42px); font-weight:700; color:var(--euca-deep); display:inline-flex; align-items:baseline; line-height:1.15; animation:revealWord .5s ease both;}
.leo-reveal-word:nth-child(1){animation-delay:.1s;}
.leo-reveal-word:nth-child(2){animation-delay:.3s;}
.leo-reveal-word:nth-child(3){animation-delay:.5s;}
@keyframes revealWord{from{opacity:0; transform:translateY(12px);} to{opacity:1; transform:none;}}
.leo-reveal-key{color:var(--euca); font-weight:800; display:inline-block;}
.leo-reveal-rest{display:inline-block; overflow:hidden;}
.leo-key-grow{animation:keyGrow .8s cubic-bezier(.4,0,.2,1) .55s forwards;}
@keyframes keyGrow{to{font-size:clamp(52px, 16vw, 80px); letter-spacing:2px; color:var(--euca);}}
.leo-rest-hide{animation:restHide .7s cubic-bezier(.4,0,1,1) forwards;}
@keyframes restHide{to{max-width:0; opacity:0; margin:0; padding:0;}}
.leo-words-tighten{animation:wordsTighten .8s cubic-bezier(.4,0,.2,1) .55s forwards;}
@keyframes wordsTighten{to{gap:2px;}}
.leo-reveal-final{display:flex; flex-direction:column; align-items:center; gap:12px;}
.leo-reveal-name{font-family:'Fraunces',serif; font-size:clamp(52px, 16vw, 80px); font-weight:800; color:var(--euca); letter-spacing:2px; line-height:1;}
.leo-reveal-tagline{font-family:'Fraunces',serif; font-size:17px; color:var(--euca-deep); opacity:.8; margin:0;}
@media (prefers-reduced-motion: reduce){
  .leo-reveal-word{animation:none; opacity:1;}
  .leo-key-grow,.leo-rest-hide,.leo-words-tighten{animation:none;}
}
/* ---- Intro pages ---- */
.intro-page{display:flex; flex-direction:column; align-items:center; text-align:center; max-width:440px; width:100%; padding:32px 20px;}
.intro-dots{display:flex; gap:8px; margin-bottom:20px;}
.intro-subtitle{font-family:'Fraunces',serif; font-size:18px; color:var(--euca-deep); opacity:.8; margin-top:10px;}
.splash-tagline{opacity:0 !important; animation:fadeUp .8s ease .6s forwards !important;}
.splash-arrow{opacity:0 !important; animation:fadeUp .7s ease 1.2s forwards !important;}
.intro-heading{font-family:'Fraunces',serif; font-size:26px; color:var(--leo-green); margin:14px 0 8px; line-height:1.25;}
.intro-body{font-size:15.5px; color:var(--ink); opacity:.75; margin-bottom:18px; max-width:380px; line-height:1.55;}
.intro-features{display:flex; flex-direction:column; gap:10px; margin-bottom:22px; text-align:left; width:100%;}
.intro-feat{display:flex; align-items:center; gap:10px; font-size:15px; color:var(--euca-deep); font-weight:500; background:var(--sage); border-radius:12px; padding:12px 14px;}
/* ---- Staggered pop-in animation ---- */
.pop-in{opacity:0; transform:translateY(20px); animation:popUp 1s cubic-bezier(.25,1,.5,1) forwards;}
.pop-d1{animation-delay:.3s;}
.pop-d2{animation-delay:.8s;}
.pop-d3{animation-delay:1.3s;}
.pop-d4{animation-delay:1.8s;}
.pop-d5{animation-delay:2.5s;}
.pop-d6{animation-delay:3.2s;}
.pop-d7{animation-delay:3.9s;}
.pop-d8{animation-delay:4.8s;}
.pop-d9{animation-delay:5.3s;}
@keyframes popUp{to{opacity:1; transform:none;}}
@media (prefers-reduced-motion: reduce){.pop-in{animation:none; opacity:1; transform:none;}}
.intro-feat-icon{font-size:20px; flex-shrink:0; width:26px; text-align:center; display:flex; align-items:center; justify-content:center;}
.intro-next{width:56px; height:56px; border-radius:50%; background:var(--euca); color:#fff; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; margin-top:18px; box-shadow:0 4px 14px rgba(55,98,75,.25); transition:transform .12s;}
.intro-next:hover{transform:scale(1.05);}
.intro-next:focus-visible{outline:3px solid var(--wattle); outline-offset:3px;}
@media (prefers-reduced-motion: reduce){.intro-next{transition:none;}}
/* ---- Level choice ---- */
.level-choice-card{position:relative; width:100%; background:#fff; border:2px solid var(--line); border-radius:14px; padding:16px 18px; margin:10px 0; cursor:pointer; text-align:left; font-family:'Karla',sans-serif; transition:border-color .15s, background .15s;}
.level-choice-card:hover{border-color:var(--euca); background:rgba(55,98,75,.04);}
.level-choice-card:focus-visible{outline:3px solid var(--wattle); outline-offset:2px;}
.level-choice-rec{border-color:var(--euca); background:rgba(55,98,75,.04);}
.level-choice-badge{position:absolute; top:-10px; right:14px; background:var(--wattle); color:#3D2E00; font-size:11px; font-weight:700; padding:3px 10px; border-radius:99px; text-transform:uppercase; letter-spacing:.5px;}
/* ---- Auth screens ---- */
.auth-tagline{font-family:'Fraunces',serif; font-size:20px; color:var(--euca-deep); text-align:center; margin:8px 0 4px;}
.auth-btn{margin-top:10px;}
.auth-error{color:var(--rust); font-weight:700; font-size:14px; text-align:center; margin-top:10px; padding:8px 12px; background:rgba(185,87,55,.08); border-radius:10px;}


/* ---- Placement test ---- */
.placement-progress{margin-bottom:16px;}
.placement-progress-bar{height:5px; border-radius:99px; background:var(--line); overflow:hidden; margin-bottom:8px;}
.placement-progress-bar span{display:block; height:100%; background:var(--euca); border-radius:99px; transition:width .5s cubic-bezier(.4,0,.2,1);}
.placement-progress-labels{display:flex; justify-content:space-between;}
.placement-step{font-size:18px; opacity:.3; transition:opacity .3s;}
.placement-step-done{opacity:1;}
.confidence-row{display:flex; align-items:center; gap:12px; margin:8px 0 14px;}
.confidence-slider{flex:1; -webkit-appearance:none; appearance:none; height:8px; border-radius:99px; background:var(--line); outline:none;}
.confidence-slider::-webkit-slider-thumb{-webkit-appearance:none; width:24px; height:24px; border-radius:50%; background:var(--euca); cursor:pointer; border:3px solid #fff; box-shadow:0 2px 6px rgba(0,0,0,.18);}
.confidence-slider::-moz-range-thumb{width:24px; height:24px; border-radius:50%; background:var(--euca); cursor:pointer; border:3px solid #fff; box-shadow:0 2px 6px rgba(0,0,0,.18);}
.confidence-val{font-family:'Fraunces',serif; font-size:22px; font-weight:700; color:var(--euca-deep); min-width:44px; text-align:center;}
.placement-overall{display:flex; flex-direction:column; align-items:center; padding:20px 0 14px; gap:2px;}
.placement-overall-level{font-family:'Fraunces',serif; font-size:52px; font-weight:700; color:var(--euca-deep); line-height:1.1;}
/* ---- Placement breakdown — new design system only. No Fraunces, no .fade-in.
   --divider is legitimate here: rules BETWEEN rows inside a card, never an
   outer edge. Deliberately no green/red on the two area lists — a
   correct/incorrect palette turns an observation into a mark. ---- */
.pl-breakdown{display:flex; flex-direction:column;}
.pl-row{display:flex; justify-content:space-between; align-items:flex-start; gap:var(--space-4); padding:var(--space-3) 0; border-top:1px solid var(--divider);}
.pl-row:first-child{border-top:none;}
.pl-row-name{color:var(--text-secondary); flex-shrink:0;}
.pl-row-evidence{text-align:right; color:var(--text-primary);}
.pl-areas{display:flex; flex-direction:column; gap:var(--space-2);}
.pl-area-line{display:flex; flex-direction:column; gap:2px;}
.pl-area-key{color:var(--text-tertiary);}
.placement-overall-desc{font-size:16px; color:var(--ink); opacity:.7;}
.placement-skill-row{display:flex; align-items:center; gap:10px; margin:10px 0;}
.placement-skill-name{width:130px; font-size:14px; font-weight:600; color:var(--euca-deep);}
.placement-skill-bar-track{flex:1; height:10px; border-radius:99px; background:var(--sage); overflow:hidden;}
.placement-skill-bar-fill{height:100%; border-radius:99px; background:var(--euca); transition:width .6s ease;}
.placement-skill-level{font-family:'Fraunces',serif; font-size:16px; font-weight:700; color:var(--euca-deep); min-width:28px; text-align:right;}

.lang-select{width:100%; padding:14px 16px; border:2px solid var(--line); border-radius:12px; font-family:'Karla',sans-serif; font-size:17px; color:var(--ink); background:#fff; appearance:none; -webkit-appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2337624B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 16px center; cursor:pointer;}
.lang-select:focus{outline:3px solid rgba(55,98,75,.3); border-color:var(--euca);}

`;

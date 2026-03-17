const generateBtn = document.getElementById("generateBtn");
const wordInput = document.getElementById("wordInput");
const results = document.getElementById("results");
const showExpandedPrefixes = document.getElementById("showExpandedPrefixes");
const expandedPrefixBox = document.getElementById("expandedPrefixBox");

showExpandedPrefixes.addEventListener("change", () => {
  expandedPrefixBox.classList.toggle("hidden", !showExpandedPrefixes.checked);
});

function checked(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(e => e.value);
}

const prefixCategories = {
  negation: ["un", "non", "in", "im", "il", "ir", "de", "dis"],
  time: ["re", "pre", "post", "ex"],
  degree: ["over", "under", "super", "hyper", "ultra", "semi"],
  opposition: ["anti", "mis", "contra"],
  relation: ["co", "inter", "intra", "pro", "sub"],
  movement: ["trans"]
};

const suffixCategories = {
  noun: ["ness", "ment", "er"],
  adjective: ["ful", "less", "ous", "able", "al", "ish", "y"],
  adverb: ["ly"],
  verb: ["ing", "ed"]
};

const prefixes = {
  un: { meaning: "not, opposite of, or reversal of", categories: ["negation"] },
  re: { meaning: "again, back", categories: ["time"] },
  pre: { meaning: "before", categories: ["time"] },
  anti: { meaning: "against, opposed to", categories: ["opposition"] },
  mis: { meaning: "wrongly, badly", categories: ["opposition"] },
  over: { meaning: "too much, excessively", categories: ["degree"] },
  under: { meaning: "too little, below", categories: ["degree"] },
  super: { meaning: "above, beyond, heightened", categories: ["degree"] },

  non: { meaning: "not, absence of", categories: ["negation"] },
  in: { meaning: "not, into, in", categories: ["negation", "movement"] },
  im: { meaning: "not, into, in", categories: ["negation", "movement"] },
  il: { meaning: "not", categories: ["negation"] },
  ir: { meaning: "not", categories: ["negation"] },
  de: { meaning: "down from, remove, reverse", categories: ["negation", "movement"] },
  dis: { meaning: "apart, away, reverse, not", categories: ["negation", "movement"] },
  ex: { meaning: "out of, former", categories: ["time", "movement"] },
  post: { meaning: "after", categories: ["time"] },
  sub: { meaning: "under, beneath", categories: ["relation"] },
  inter: { meaning: "between, among", categories: ["relation"] },
  intra: { meaning: "within, inside", categories: ["relation"] },
  trans: { meaning: "across, through, beyond", categories: ["movement"] },
  hyper: { meaning: "over, excessively", categories: ["degree"] },
  ultra: { meaning: "extreme, beyond", categories: ["degree"] },
  semi: { meaning: "half, partly", categories: ["degree"] },
  co: { meaning: "together, jointly", categories: ["relation"] },
  contra: { meaning: "against, opposite", categories: ["opposition"] },
  pro: { meaning: "for, in favor of, forward", categories: ["relation", "movement"] }
};

const suffixes = {
  ness: { class: "noun", categories: ["noun"], meaning: "state, quality, condition" },
  ment: { class: "noun", categories: ["noun"], meaning: "result, process, act" },
  er: { class: "noun", categories: ["noun"], meaning: "person or thing that performs an action" },
  ful: { class: "adjective", categories: ["adjective"], meaning: "full of" },
  less: { class: "adjective", categories: ["adjective"], meaning: "without, lacking" },
  ous: { class: "adjective", categories: ["adjective"], meaning: "characterized by, full of" },
  able: { class: "adjective", categories: ["adjective"], meaning: "capable of, fit for" },
  al: { class: "adjective", categories: ["adjective"], meaning: "related to" },
  ish: { class: "adjective", categories: ["adjective"], meaning: "somewhat like" },
  y: { class: "adjective", categories: ["adjective"], meaning: "having the qualities of" },
  ly: { class: "adverb", categories: ["adverb"], meaning: "in a manner" },
  ing: { class: "verb", categories: ["verb"], meaning: "ongoing action or process" },
  ed: { class: "verb", categories: ["verb"], meaning: "completed action or experienced state" }
};

const baseLexicon = {
  love: {
    classes: ["noun", "verb"],
    definition: "a deep feeling of affection, attachment, or care; also, to feel or express that affection toward someone or something",
    shortMeaning: "deep affection or emotional attachment",
    semanticType: "emotion"
  },
  hope: {
    classes: ["noun", "verb"],
    definition: "a feeling of expectation or desire for something good to happen; also, to want and trust that something positive may come",
    shortMeaning: "expectation and desire for a good outcome",
    semanticType: "emotion"
  },
  care: {
    classes: ["noun", "verb"],
    definition: "serious attention, concern, or responsibility; also, to feel concern for or to tend to someone or something",
    shortMeaning: "concern, attention, or tending",
    semanticType: "emotion"
  },
  joy: {
    classes: ["noun"],
    definition: "a feeling of great pleasure, delight, or happiness",
    shortMeaning: "great happiness or delight",
    semanticType: "emotion"
  },
  fear: {
    classes: ["noun", "verb"],
    definition: "an emotion caused by danger, threat, or anxiety; also, to feel afraid of someone or something",
    shortMeaning: "fear, dread, or anxiety",
    semanticType: "emotion"
  },
  act: {
    classes: ["verb", "noun"],
    definition: "to do something; also, a deed, performance, or intentional action",
    shortMeaning: "doing or taking action",
    semanticType: "action"
  },
  use: {
    classes: ["verb", "noun"],
    definition: "to employ something for a purpose; also, the act or practice of using something",
    shortMeaning: "using something for a purpose",
    semanticType: "action"
  },
  form: {
    classes: ["noun", "verb"],
    definition: "the shape, structure, or arrangement of something; also, to create, shape, or bring into being",
    shortMeaning: "shape, structure, or creation",
    semanticType: "process"
  },
  move: {
    classes: ["verb", "noun"],
    definition: "to change position or cause change in position; also, an action, step, or motion",
    shortMeaning: "motion or a step taken",
    semanticType: "action"
  },
  kind: {
    classes: ["adjective"],
    definition: "showing generosity, consideration, warmth, or goodwill toward others",
    shortMeaning: "gentle, caring, considerate",
    semanticType: "quality"
  },
  quick: {
    classes: ["adjective"],
    definition: "moving fast, happening rapidly, or taking little time",
    shortMeaning: "fast or rapid",
    semanticType: "quality"
  },
  clear: {
    classes: ["adjective", "verb"],
    definition: "easy to understand, free from confusion, or unobstructed; also, to remove, empty, or make free from blockage",
    shortMeaning: "easy to understand or free from obstruction",
    semanticType: "quality"
  },
  brave: {
    classes: ["adjective"],
    definition: "showing courage, boldness, or readiness to face difficulty or danger",
    shortMeaning: "courageous or bold",
    semanticType: "quality"
  }
};

const dictionary = new Set([
  "love", "loved", "loving", "loveless", "lovely", "lover", "lovable",
  "hope", "hoped", "hoping", "hopeful", "hopeless",
  "care", "cared", "caring", "careful", "careless",
  "joy", "joyful",
  "fear", "fearful", "fearless",
  "kind", "kindness", "kindly",
  "quick", "quickly",
  "clear", "clearly",
  "brave", "bravely",
  "act", "actor",
  "move", "movement", "moving", "moved",
  "use", "useful", "useless", "misuse", "overuse", "underuse",
  "form", "formal", "formed",
  "redo", "preview", "unknown", "superhuman", "nonstop", "coauthor"
]);

function normalize(word) {
  return word.trim().toLowerCase();
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function getBaseInfo(base) {
  return baseLexicon[base] || {
    classes: ["noun", "verb"],
    definition: `a root word centered on the idea of ${base}`,
    shortMeaning: base,
    semanticType: "general"
  };
}

function isExisting(word) {
  return dictionary.has(word.toLowerCase());
}

function matchesSelectedPrefixCategories(prefix, selectedPrefixCats) {
  if (!selectedPrefixCats.length) return true;
  return prefixes[prefix].categories.some(cat => selectedPrefixCats.includes(cat));
}

function matchesSelectedSuffixCategories(suffix, selectedSuffixCats) {
  if (!selectedSuffixCats.length) return true;
  return suffixes[suffix].categories.some(cat => selectedSuffixCats.includes(cat));
}

function guessWordClass(prefix, suffix, base) {
  const baseInfo = getBaseInfo(base);

  if (suffix && suffixes[suffix]) return suffixes[suffix].class;

  if (["un", "non", "in", "im", "il", "ir"].includes(prefix)) {
    if (baseInfo.classes.includes("verb")) return "verb";
    if (baseInfo.classes.includes("adjective")) return "adjective";
    return "adjective";
  }

  if (["re", "mis", "de", "dis", "trans"].includes(prefix)) return "verb";
  if (["anti", "contra", "super", "hyper", "ultra", "semi", "sub", "inter", "intra", "pro"].includes(prefix)) return "adjective";
  if (["over", "under", "co"].includes(prefix)) return baseInfo.classes[0] || "noun";
  if (["pre", "post", "ex"].includes(prefix)) return baseInfo.classes[0] || "noun";

  return baseInfo.classes[0] || "noun";
}

function isAllowedBySelectedClasses(wordClass, selectedClasses) {
  if (!selectedClasses.length) return true;
  return selectedClasses.includes(wordClass);
}

// Keep all outputs visible, so this stays permissive.
function looksReasonable(word) {
  return !!word && word.length >= 2;
}

// -------------------------
// SPELLING / NATURALIZATION
// -------------------------
function applySpelling(base, suffix) {
  if (!suffix) return base;

  if ((suffix === "ed" || suffix === "ing" || suffix === "er" || suffix === "able") && base.endsWith("e") && !base.endsWith("ee")) {
    return base.slice(0, -1) + suffix;
  }

  if (suffix === "ly" && base.endsWith("y") && base.length > 1) {
    return base.slice(0, -1) + "ily";
  }

  return base + suffix;
}

function buildWord(prefix, base, suffix) {
  const stemWithSuffix = applySpelling(base, suffix);
  return `${prefix || ""}${stemWithSuffix}`;
}

function buildRawWord(prefix, base, suffix) {
  return `${prefix || ""}${base}${suffix || ""}`;
}

// -------------------------
// DEFINITIONS
// -------------------------
function getSemanticType(base) {
  return getBaseInfo(base).semanticType || "general";
}

function defineEmotionLess(base) {
  const custom = {
    fear: "showing courage because fear is absent",
    love: "lacking affection, warmth, or emotional connection",
    hope: "without hope or expectation of improvement",
    joy: "without delight or happiness",
    care: "showing too little care, attention, or concern"
  };
  return custom[base] || `without ${getBaseInfo(base).shortMeaning}; lacking that feeling or quality`;
}

function defineEmotionFul(base) {
  const custom = {
    fear: "full of fear; anxious, uneasy, or afraid",
    love: "full of affection, tenderness, or emotional warmth",
    hope: "feeling or expressing hope and expectation for something good",
    joy: "filled with delight, happiness, or celebration",
    care: "showing care, attention, or thoughtful concern"
  };
  return custom[base] || `full of ${getBaseInfo(base).shortMeaning}; strongly marked by that feeling or quality`;
}

function defineEmotionNess(base) {
  const custom = {
    kind: "the quality of being kind, gentle, and considerate",
    brave: "the quality of being brave; courage in the face of fear or difficulty",
    clear: "the quality of being clear, understandable, or unobstructed"
  };
  return custom[base] || `the state, quality, or condition associated with ${base}`;
}

function defineEmotionLy(base) {
  const custom = {
    kind: "in a kind, gentle, or considerate way",
    quick: "in a rapid or speedy way",
    clear: "in a clear, understandable, or unobstructed manner",
    brave: "in a brave or courageous manner"
  };
  return custom[base] || `in a way that is ${base}`;
}

function defineActionEr(base) {
  const custom = {
    act: "a person who acts, performs, or takes part in an action",
    use: "a person or thing that uses, applies, or makes use of something",
    move: "a person or thing that moves or causes movement",
    love: "a person who loves or is deeply attached"
  };
  return custom[base] || `a person or thing that performs or is associated with ${base}`;
}

function defineActionMent(base) {
  const custom = {
    move: "the act, process, or result of moving",
    form: "the process, result, or structure produced by forming",
    act: "the result or process of acting",
    use: "the act, practice, or result of using something"
  };
  return custom[base] || `the act, process, or result of ${base}`;
}

function definePrefixOnly(prefix, base, wordClass) {
  const baseInfo = getBaseInfo(base);
  const meaning = baseInfo.shortMeaning;

  const customPrefixDefs = {
    re: {
      love: "to return to a feeling of love after distance, hurt, or interruption",
      hope: "to begin hoping again after doubt, disappointment, or loss",
      care: "to care again after becoming distant, tired, or detached",
      move: "to move again after stopping or being moved before",
      use: "to use again"
    },
    un: {
      love: "to withdraw love from; to cease loving; to undo an emotional attachment",
      care: "to stop caring; to withdraw concern or attention",
      hope: "to let go of hope; to withdraw expectation or trust in a good outcome",
      clear: "to reverse a clearing or make unclear again"
    },
    mis: {
      use: "to use wrongly, improperly, or harmfully",
      love: "to love in a misguided, confused, or harmful way",
      act: "to act badly, wrongly, or inappropriately"
    }
  };

  if (customPrefixDefs[prefix] && customPrefixDefs[prefix][base]) {
    return customPrefixDefs[prefix][base];
  }

  if (["un", "non", "in", "im", "il", "ir"].includes(prefix)) {
    if (wordClass === "verb") {
      return `to reverse, undo, or withdraw ${meaning}`;
    }
    return `not ${base}; lacking the quality associated with ${meaning}`;
  }

  if (prefix === "re") return `to ${base} again, especially after interruption, loss, or change`;
  if (prefix === "mis") return `to ${base} incorrectly, poorly, or in a misguided way`;
  if (prefix === "anti") return `opposed to, resisting, or acting against ${meaning}`;
  if (prefix === "over") return `to ${base} too much, too intensely, or beyond what is healthy, useful, or appropriate`;
  if (prefix === "under") return `to ${base} too little or below what is needed, expected, or appropriate`;
  if (prefix === "pre") return `to come before ${base}; to exist, prepare, or act in advance of ${meaning}`;
  if (prefix === "post") return `to come after ${base}; to exist or occur later than ${meaning}`;
  if (prefix === "super") return `an intensified, heightened, or elevated form of ${meaning}`;
  if (prefix === "de") return `to remove, reduce, undo, or move away from ${meaning}`;
  if (prefix === "dis") return `to reverse, separate, or remove from ${meaning}`;
  if (prefix === "ex") return `out of or formerly connected with ${meaning}`;
  if (prefix === "sub") return `beneath, below, or secondary to ${meaning}`;
  if (prefix === "inter") return `between or among forms of ${meaning}`;
  if (prefix === "intra") return `within or inside ${meaning}`;
  if (prefix === "trans") return `across, through, or beyond ${meaning}`;
  if (prefix === "hyper") return `an excessively intense form of ${meaning}`;
  if (prefix === "ultra") return `an extreme or far-reaching form of ${meaning}`;
  if (prefix === "semi") return `a partial, half, or incomplete form of ${meaning}`;
  if (prefix === "co") return `a shared, joint, or mutual form of ${meaning}`;
  if (prefix === "contra") return `in opposition to or against ${meaning}`;
  if (prefix === "pro") return `supporting, favoring, or advancing ${meaning}`;

  return `a modified form of ${base} shaped by the prefix "${prefix}-"`;
}

function defineSuffixOnly(suffix, base) {
  const baseInfo = getBaseInfo(base);
  const semanticType = getSemanticType(base);

  switch (suffix) {
    case "ful":
      if (semanticType === "emotion" || semanticType === "quality") return defineEmotionFul(base);
      return `full of ${baseInfo.shortMeaning}; strongly marked by the presence of ${base}`;

    case "less":
      if (semanticType === "emotion" || semanticType === "quality") return defineEmotionLess(base);
      return `without ${baseInfo.shortMeaning}; lacking or deprived of ${base}`;

    case "ness":
      return defineEmotionNess(base);

    case "ment":
      return defineActionMent(base);

    case "er":
      return defineActionEr(base);

    case "ly":
      return defineEmotionLy(base);

    case "able":
      return `capable of being ${base}ed, fit for ${base}, or able to undergo ${base}`;

    case "ous":
      return `characterized by, full of, or strongly marked by ${baseInfo.shortMeaning}`;

    case "ish":
      return `somewhat, loosely, or partly like ${base}; having an approximate quality of ${base}`;

    case "y":
      return `having the qualities, tone, or nature of ${base}`;

    case "al":
      return `relating to, shaped by, or connected with ${baseInfo.shortMeaning}`;

    case "ing":
      return `the ongoing action, process, or active state of ${base}`;

    case "ed":
      return `having undergone, completed, or experienced ${base}`;

    default:
      return `a derived form related to ${baseInfo.shortMeaning}`;
  }
}

function definePrefixSuffix(prefix, base, suffix, wordClass) {
  const pref = prefixes[prefix]?.meaning || prefix;
  const baseInfo = getBaseInfo(base);

  if (suffix === "ful") return `full of a ${pref} form of ${base}; marked by an altered or intensified kind of ${baseInfo.shortMeaning}`;
  if (suffix === "less") return `lacking a ${pref} form of ${base}; marked by the absence or removal of that modified quality`;
  if (suffix === "ness") return `the condition, quality, or state of being ${prefix}${base}`;
  if (suffix === "ly") return `in a ${prefix}${base} manner; with the quality of something that is ${prefix}${base}`;
  if (suffix === "ment") return `the process, result, or outcome of ${prefix}${base}`;

  if (prefix === "re" && suffix === "ful" && base === "hope") {
    return "filled again with hope after despair, disappointment, or uncertainty";
  }

  return `a ${wordClass} form built from ${prefix}- + ${base} + -${suffix}, suggesting a modified version of ${baseInfo.shortMeaning}`;
}

function buildDefinition(prefix, base, suffix, wordClass) {
  if (prefix && !suffix) return definePrefixOnly(prefix, base, wordClass);
  if (!prefix && suffix) return defineSuffixOnly(suffix, base);
  if (prefix && suffix) return definePrefixSuffix(prefix, base, suffix, wordClass);
  return getBaseInfo(base).definition;
}

// -------------------------
// EXAMPLES
// -------------------------
function buildExample(word, wordClass) {
  const special = {
    loveless: "The room felt strangely loveless, as if all warmth had drained from it.",
    hopeful: "Despite the setback, she remained hopeful about what would come next.",
    fearless: "He sounded fearless even in the middle of uncertainty.",
    careless: "It was a careless mistake that could have been avoided.",
    kindness: "Her kindness changed the entire mood of the conversation.",
    relove: "Over time, they began to relove the parts of life they had once lost interest in.",
    loved: "She felt deeply loved by the people around her.",
    loving: "He gave the dog a loving glance before leaving.",
    lover: "The poem speaks to the voice of a lover remembering someone dearly."
  };

  if (special[word]) return special[word];

  switch (wordClass) {
    case "verb":
      return `They began to ${word} the idea in a new and unexpected way.`;
    case "noun":
      return `The ${word} became central to the discussion.`;
    case "adjective":
      return `Her response felt especially ${word} in that moment.`;
    case "adverb":
      return `He spoke ${word} as the room grew quiet.`;
    default:
      return `The word "${word}" appeared naturally in the conversation.`;
  }
}

// -------------------------
// STATUS / VIABILITY
// -------------------------
function getStatus(word, prefix, base, suffix) {
  if (isExisting(word)) {
    return {
      label: "Existing",
      className: "existing",
      explanation: "commonly used and recognized in English"
    };
  }

  const weakSuffixes = ["al", "ous", "ish", "y"];
  const awkwardPrefixSuffixPairs = [
    ["mis", "al"],
    ["mis", "ous"],
    ["anti", "ful"],
    ["contra", "ful"],
    ["intra", "less"],
    ["ultra", "ness"]
  ];

  const baseKnown = !!baseLexicon[base];
  const hasPrefix = !!prefix;
  const hasSuffix = !!suffix;

  if (!hasPrefix && !hasSuffix) {
    return {
      label: "Exploratory",
      className: "exploratory",
      explanation: "plausible and understandable experimental formation"
    };
  }

  if (prefix && suffix) {
    const raw = buildRawWord(prefix, base, suffix);
    const natural = buildWord(prefix, base, suffix);

    if (awkwardPrefixSuffixPairs.some(pair => pair[0] === prefix && pair[1] === suffix)) {
      return {
        label: "Improbable",
        className: "improbable",
        explanation: "highly unnatural or unlikely to function in English"
      };
    }

    if (weakSuffixes.includes(suffix) && ["love", "hope", "care", "joy", "fear"].includes(base)) {
      return {
        label: "Interpretable but Problematic",
        className: "problematic",
        explanation: "understandable, but structurally awkward or inconsistent with common patterns"
      };
    }

    if (raw !== natural) {
      return {
        label: "Exploratory",
        className: "exploratory",
        explanation: "plausible and understandable experimental formation"
      };
    }

    return {
      label: "Exploratory",
      className: "exploratory",
      explanation: "plausible and understandable experimental formation"
    };
  }

  if (hasSuffix) {
    if (weakSuffixes.includes(suffix) && ["love", "hope", "care", "joy", "fear"].includes(base)) {
      return {
        label: "Interpretable but Problematic",
        className: "problematic",
        explanation: "understandable, but structurally awkward or inconsistent with common patterns"
      };
    }

    if (baseKnown) {
      return {
        label: "Exploratory",
        className: "exploratory",
        explanation: "plausible and understandable experimental formation"
      };
    }
  }

  if (hasPrefix) {
    if (["il", "ir", "im"].includes(prefix) && !baseKnown) {
      return {
        label: "Improbable",
        className: "improbable",
        explanation: "highly unnatural or unlikely to function in English"
      };
    }

    return {
      label: "Exploratory",
      className: "exploratory",
      explanation: "plausible and understandable experimental formation"
    };
  }

  return {
    label: "Exploratory",
    className: "exploratory",
    explanation: "plausible and understandable experimental formation"
  };
}

// -------------------------
// BUILD ENTRIES
// -------------------------
function buildBreakdown(prefix, base, suffix) {
  const parts = [];
  if (prefix) parts.push(prefix);
  parts.push(base);
  if (suffix) parts.push(suffix);
  return parts.join(" + ");
}

function buildShortDefinition(prefix, base, suffix, cls) {
  const full = buildDefinition(prefix, base, suffix, cls);
  if (full.length <= 95) return full;
  return full.slice(0, 92) + "...";
}

function buildEntry(prefix, base, suffix) {
  const rawWord = buildRawWord(prefix, base, suffix);
  const word = buildWord(prefix, base, suffix);
  const cls = prefix || suffix ? guessWordClass(prefix, suffix, base) : getBaseInfo(base).classes.join("/");
  const baseInfo = getBaseInfo(base);
  const status = getStatus(word, prefix, base, suffix);

  return {
    word,
    rawWord,
    cls,
    prefix,
    base,
    suffix,
    status,
    baseInfo,
    shortDef: prefix || suffix
      ? buildShortDefinition(prefix, base, suffix, typeof cls === "string" ? cls : "noun")
      : baseInfo.definition,
    fullDef: prefix || suffix
      ? buildDefinition(prefix, base, suffix, typeof cls === "string" ? cls : "noun")
      : baseInfo.definition,
    example: buildExample(word, typeof cls === "string" ? cls : "noun"),
    breakdown: buildBreakdown(prefix, base, suffix)
  };
}

// -------------------------
// CARD RENDERING
// -------------------------
function dotClass(statusClassName) {
  if (statusClassName === "existing") return "dot-existing";
  if (statusClassName === "exploratory") return "dot-exploratory";
  if (statusClassName === "problematic") return "dot-problematic";
  return "dot-improbable";
}

function card(entry, index) {
  const prefixMeaning = entry.prefix ? prefixes[entry.prefix].meaning : "none";
  const suffixMeaning = entry.suffix ? suffixes[entry.suffix].meaning : "none";
  const rawChanged = entry.word !== entry.rawWord;

  return `
    <div class="wordCard clickableCard" data-index="${index}">
      <div class="wordHeader">
        <span class="dot ${dotClass(entry.status.className)}"></span>
        <div class="wordTitle">${capitalize(entry.word)}</div>
      </div>

      <div class="wordMeta"><strong>Class:</strong> ${entry.cls}</div>
      <div class="wordMeta"><strong>Definition:</strong> ${entry.shortDef}</div>

      <div class="wordMeta">
        <span class="wordStatusText">${entry.status.label}</span>
      </div>

      <div class="wordDetails" id="details-${index}" style="display:none;">
        <div class="wordMeta"><strong>Status meaning:</strong> ${entry.status.explanation}</div>
        <div class="wordMeta"><strong>Structure:</strong> ${entry.breakdown}</div>
        <div class="wordMeta"><strong>Base meaning:</strong> ${entry.baseInfo.shortMeaning}</div>
        <div class="wordMeta"><strong>Prefix meaning:</strong> ${prefixMeaning}</div>
        <div class="wordMeta"><strong>Suffix meaning:</strong> ${suffixMeaning}</div>
        <div class="wordMeta"><strong>Raw build:</strong> ${entry.rawWord}</div>
        ${rawChanged ? `<div class="wordMeta"><strong>Naturalized form:</strong> ${entry.word}</div>` : ""}
        <div class="wordMeta"><strong>Full definition:</strong> ${entry.fullDef}</div>
        <div class="wordMeta"><strong>Example:</strong> ${entry.example}</div>
      </div>
    </div>
  `;
}

function attachCardEvents() {
  const cards = document.querySelectorAll(".clickableCard");

  cards.forEach(cardEl => {
    cardEl.addEventListener("click", () => {
      const index = cardEl.dataset.index;
      const detailEl = document.getElementById(`details-${index}`);
      if (!detailEl) return;
      detailEl.style.display = detailEl.style.display === "none" ? "block" : "none";
    });
  });
}

// -------------------------
// GENERATION
// -------------------------
function generateEntries(base) {
  const selectedPrefixCats = checked("prefixCat");
  const selectedPrefixes = checked("prefix");
  const selectedSuffixCats = checked("suffixCat");
  const selectedSuffixes = checked("suffix");
  const selectedClasses = checked("class");

  const map = new Map();
  const baseInfo = getBaseInfo(base);
  const baseClass = baseInfo.classes[0] || "noun";

  if (isAllowedBySelectedClasses(baseClass, selectedClasses)) {
    map.set(base, buildEntry("", base, ""));
  }

  selectedPrefixes.forEach(prefix => {
    if (!matchesSelectedPrefixCategories(prefix, selectedPrefixCats)) return;

    const cls = guessWordClass(prefix, "", base);
    if (!isAllowedBySelectedClasses(cls, selectedClasses)) return;

    const word = buildWord(prefix, base, "");
    if (!looksReasonable(word)) return;

    map.set(`p-${prefix}-${base}`, buildEntry(prefix, base, ""));
  });

  selectedSuffixes.forEach(suffix => {
    if (!matchesSelectedSuffixCategories(suffix, selectedSuffixCats)) return;

    const cls = guessWordClass("", suffix, base);
    if (!isAllowedBySelectedClasses(cls, selectedClasses)) return;

    const word = buildWord("", base, suffix);
    if (!looksReasonable(word)) return;

    map.set(`s-${base}-${suffix}`, buildEntry("", base, suffix));
  });

  selectedPrefixes.forEach(prefix => {
    if (!matchesSelectedPrefixCategories(prefix, selectedPrefixCats)) return;

    selectedSuffixes.forEach(suffix => {
      if (!matchesSelectedSuffixCategories(suffix, selectedSuffixCats)) return;

      const cls = guessWordClass(prefix, suffix, base);
      if (!isAllowedBySelectedClasses(cls, selectedClasses)) return;

      const word = buildWord(prefix, base, suffix);
      if (!looksReasonable(word)) return;

      map.set(`ps-${prefix}-${base}-${suffix}`, buildEntry(prefix, base, suffix));
    });
  });

  return [...map.values()].sort((a, b) => a.word.localeCompare(b.word));
}

generateBtn.onclick = () => {
  const base = normalize(wordInput.value);

  if (!base) {
    results.innerHTML = `<div class="wordCard">Please enter a base word first.</div>`;
    return;
  }

  const entries = generateEntries(base);

  if (!entries.length) {
    results.innerHTML = `<div class="wordCard">No words were generated with the current settings.</div>`;
    return;
  }

  results.innerHTML = entries.map((entry, index) => card(entry, index)).join("");
  attachCardEvents();
};
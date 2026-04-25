import {
  getHorseById,
  type FeedingItem,
  type Goal,
  type HorseId,
  type SupplementGroup,
  type SymptomId,
} from "./horses";

export type FormState = {
  horseId: HorseId;
  goal: Goal;
  symptoms: SymptomId[];
};

export type Recommendation = {
  horseName: string;
  weightLb: number;
  forageLbPerDay: string;
  feedTotalLbPerDay: string;
  summary: string[];
  adjustments: string[];
  warnings: string[];
  horseNotes: string[];
  baselinePlan: string[];
  feedingSuggestion: FeedingItem[];
  supplementGroups: SupplementGroup[];
  symptomLinkedChanges: string[];
};

function baseForagePercent(goal: Goal) {
  if (goal === "lose") return 1.5;
  if (goal === "gain") return 2.0;
  return 1.8;
}

function cloneItems(items: FeedingItem[]) {
  return items.map((item) => ({ ...item }));
}

function cloneGroups(groups: SupplementGroup[]) {
  return groups.map((group) => ({
    ...group,
    items: cloneItems(group.items),
  }));
}

function findItem(items: FeedingItem[], name: string) {
  return items.find((item) => item.name === name);
}

function upsertItem(items: FeedingItem[], nextItem: FeedingItem) {
  const existing = findItem(items, nextItem.name);
  if (existing) {
    existing.amount = nextItem.amount;
    existing.note = nextItem.note;
    return existing;
  }

  items.push({ ...nextItem });
  return items[items.length - 1];
}

function findOrCreateGroup(groups: SupplementGroup[], title: string) {
  const existing = groups.find((group) => group.title === title);
  if (existing) return existing;

  const group = { title, items: [] as FeedingItem[] };
  groups.push(group);
  return group;
}

function selectDigestiveSupportProduct(groups: SupplementGroup[]) {
  const allItems = groups.flatMap((group) => group.items);
  const preferredNames = ["LMF Digest 911", "Assure Guard Gold"];

  for (const name of preferredNames) {
    const match = allItems.find((item) => item.name === name);
    if (match) {
      return {
        name: match.name,
        amount: match.amount.includes("option") ? "2 oz/day" : match.amount,
        note: match.note ?? "Use as the selected digestion-support product.",
      };
    }
  }

  return {
    name: "LMF Digest 911",
    amount: "2 oz/day",
    note: "Use as the selected digestion-support product and keep the rest of the ration steady for 10–14 days.",
  };
}

function canonicalFeedName(name: string) {
  const normalized = name.trim().toLowerCase();

  if (
    normalized === "timothy hay cubes" ||
    normalized === "soaked hay cubes" ||
    normalized === "soaked hay cubes / mash forage"
  ) {
    return "Soaked hay cubes";
  }

  if (
    normalized === "beet pulp / beet cubes" ||
    normalized === "soaked beet cubes" ||
    normalized === "soaked beet pulp / beet cubes" ||
    normalized === "unmolassed beet pulp"
  ) {
    return "Beet pulp / beet cubes";
  }

  return name;
}

function mergeNotes(currentNote?: string, nextNote?: string) {
  const notes = [currentNote, nextNote]
    .filter((note): note is string => Boolean(note?.trim()))
    .map((note) => note.trim());

  return Array.from(new Set(notes)).join(" ");
}

function consolidateEquivalentFeedItems(items: FeedingItem[]) {
  const consolidated: FeedingItem[] = [];

  items.forEach((item) => {
    const canonicalName = canonicalFeedName(item.name);
    const parsedAmount = parseLbAmount(item.amount);
    const existing = consolidated.find((entry) => entry.name === canonicalName);

    if (!existing) {
      consolidated.push({
        ...item,
        name: canonicalName,
      });
      return;
    }

    existing.note = mergeNotes(existing.note, item.note) || undefined;

    const existingParsed = parseLbAmount(existing.amount);
    if (existingParsed && parsedAmount) {
      const suffix = existingParsed.suffix || parsedAmount.suffix;
      existing.amount = formatLbAmount(existingParsed.poundsPerDay + parsedAmount.poundsPerDay, suffix);
      return;
    }

    if (!existingParsed && parsedAmount) {
      existing.amount = item.amount;
      return;
    }

    if (!existing.amount && item.amount) {
      existing.amount = item.amount;
    }
  });

  return consolidated;
}

function roundToTenth(value: number) {
  return Math.round(value * 10) / 10;
}

function parseLbAmount(amount: string) {
  const match = amount.match(/^(\d+(?:\.\d+)?)\s*lb\/day( dry equivalent)?$/i);
  if (!match) return null;

  return {
    poundsPerDay: Number(match[1]),
    suffix: match[2] ?? "",
  };
}

function formatLbAmount(value: number, suffix = "") {
  return `${roundToTenth(value).toFixed(1)} lb/day${suffix}`;
}

function isConcreteFeedItem(item: FeedingItem) {
  return parseLbAmount(item.amount) !== null;
}

export function buildRecommendation(form: FormState): Recommendation {
  const horse = getHorseById(form.horseId);
  const symptoms = new Set(form.symptoms);

  let foragePercent = baseForagePercent(form.goal);
  const symptomLinkedChanges: string[] = [];

  if (symptoms.has("insulin")) {
    const insulinAdjustedPercent =
      form.goal === "gain" ? Math.min(foragePercent, 1.8) : Math.min(foragePercent, 1.7);

    if (insulinAdjustedPercent !== foragePercent) {
      foragePercent = insulinAdjustedPercent;
      symptomLinkedChanges.push(
        `Insulin Resistant lowers the starting forage target to ${foragePercent.toFixed(1)}% of body weight so calories stay more conservative.`
      );
    }
  }

  const forageLbNumber = roundToTenth(horse.weightLb * (foragePercent / 100));
  const forageLb = forageLbNumber.toFixed(1);

  const summary: string[] = [];
  const adjustments: string[] = [];
  const warnings: string[] = [];
  const feedingSuggestion = cloneItems(horse.feedingSuggestion).filter(
    (item) => !item.amount.toLowerCase().startsWith("optional")
  );
  const supplementGroups = cloneGroups(horse.supplementGroups);

  if (form.goal === "gain") {
    summary.push("Increase calories gradually with fiber- and fat-based feed choices.");
    adjustments.push("Split concentrate into 2–3 meals per day.");
    adjustments.push("Recheck body condition every 2 weeks so gain stays controlled.");
    symptomLinkedChanges.push("Weight gain raises the concrete feed plan so the daily feed total matches the higher forage target.");
  }

  if (form.goal === "maintain") {
    summary.push("Keep the ration steady and adjust only if body condition starts changing.");
    adjustments.push("Recheck body condition score every 2 weeks.");
  }

  if (form.goal === "lose") {
    summary.push("Reduce excess calories while keeping forage as the foundation of the diet.");
    adjustments.push("Limit calorie-dense concentrates unless needed for nutrient balance.");
    adjustments.push("Track body condition and neck crest changes instead of cutting forage too aggressively.");
    symptomLinkedChanges.push("Weight loss trims the concrete feed plan so the daily feed total lands on the leaner forage target.");
  }

  if (symptoms.has("poor_teeth")) {
    const mashAmount = formatLbAmount(forageLbNumber * 0.35);
    const hayCubeItem = upsertItem(feedingSuggestion, {
      name: "Soaked hay cubes / mash forage",
      amount: mashAmount,
      note: "Replace part of the long-stem hay with a fully soaked forage mash if chewing drops off.",
    });

    const soakedCarrier = upsertItem(feedingSuggestion, {
      name: "Soaked beet pulp / beet cubes",
      amount: formatLbAmount(Math.max(forageLbNumber * 0.08, 0.8), " dry equivalent"),
      note: "Use as an easy-chewing soaked fiber add-on when long-stem hay is being left behind.",
    });

    summary.push("Use soaked senior feed or mash-friendly forage alternatives.");
    adjustments.push("Watch for quidding, slow eating, or choke risk.");
    symptomLinkedChanges.push(
      `Poor teeth adds ${hayCubeItem.amount} of soaked forage mash plus ${soakedCarrier.amount} of soaked beet pulp support.`
    );
  }

  if (symptoms.has("sensitive_digestion")) {
    const digestiveGroup = findOrCreateGroup(supplementGroups, "Symptom-driven support");
    const digestiveProduct = selectDigestiveSupportProduct(supplementGroups);
    upsertItem(digestiveGroup.items, {
      name: digestiveProduct.name,
      amount: digestiveProduct.amount,
      note: digestiveProduct.note,
    });

    const fiberCarrier = upsertItem(feedingSuggestion, {
      name: "Soaked beet pulp / beet cubes",
      amount: formatLbAmount(Math.max(forageLbNumber * 0.07, 0.8), " dry equivalent"),
      note: "Small soaked fiber meals are often easier on the gut than a larger dry concentrate meal.",
    });

    summary.push("Make changes slowly and favor highly digestible fiber sources.");
    adjustments.push("Keep meal sizes small and consistent.");
    symptomLinkedChanges.push(
      `Sensitive digestion adds ${digestiveProduct.name} in supplements plus a ${fiberCarrier.amount} soaked fiber carrier.`
    );
  }

  if (symptoms.has("pssm")) {
    const vitaminGroup = findOrCreateGroup(supplementGroups, "Symptom-driven support");
    upsertItem(vitaminGroup.items, {
      name: "Vitamin E review",
      amount: "5,000 IU/day target to review",
      note: "Confirm the actual dose with your veterinarian or nutritionist before changing a PSSM horse's vitamin E plan.",
    });

    const specialBlend = findItem(feedingSuggestion, "Haystack Special Blend");
    if (specialBlend) {
      specialBlend.note = `${specialBlend.note ? `${specialBlend.note} ` : ""}Keep the ration low-starch and avoid replacing this with sweet feed or grain.`;
    }

    summary.push("Prefer low-starch, low-sugar feed choices.");
    adjustments.push("Use fat/fiber calories instead of sweet feed or high-starch grain.");
    warnings.push("Review the full ration with your veterinarian if tying-up or exercise intolerance is present.");
    symptomLinkedChanges.push(
      "PSSM keeps the ration in low-starch feed choices and adds a vitamin E review target in supplements."
    );
  }

  if (symptoms.has("insulin")) {
    const specialBlend = findItem(feedingSuggestion, "Haystack Special Blend");
    if (specialBlend) {
      specialBlend.amount = formatLbAmount(horse.id === "spoi" ? 0.4 : 0.2);
      specialBlend.note = "Keep this minimal or skip it if the horse is easy-keeping or hay already covers calories.";
    }

    const lowSugarCarrier = upsertItem(feedingSuggestion, {
      name: "Beet pulp / beet cubes",
      amount: formatLbAmount(0.5, " dry equivalent"),
      note: "Use an unmolassed soaked version only if a low-sugar carrier is needed for supplements.",
    });

    summary.push("Choose low-NSC feed and be cautious with extra calories.");
    adjustments.push("If hay sugar is unknown, consider testing or soaking hay before making bigger feed changes.");
    warnings.push("If there is laminitis history or insulin dysregulation, confirm the plan with a veterinarian.");
    symptomLinkedChanges.push(
      `Insulin Resistant cuts rich bucket feed back and limits soaked carrier feed to ${lowSugarCarrier.amount}.`
    );
  }

  if (symptoms.has("poor_appetite")) {
    const appetiteGroup = findOrCreateGroup(supplementGroups, "Symptom-driven support");
    upsertItem(appetiteGroup.items, {
      name: "Palatable soaked carrier meal",
      amount: formatLbAmount(Math.max(forageLbNumber * 0.06, 0.7)),
      note: "Offer as 2–3 small soaked meals so supplements can be hidden in something more appetizing.",
    });

    summary.push("Use palatable soaked meals and monitor how much is actually finished.");
    adjustments.push("Track refusals for several days before making big ration increases.");
    symptomLinkedChanges.push(
      "Poor appetite adds a small palatable soaked carrier meal so supplements and fiber can be split into easier-to-finish servings."
    );
  }

  if (symptoms.has("poor_teeth") && symptoms.has("sensitive_digestion")) {
    const soakedHayTarget = formatLbAmount(forageLbNumber * 0.72);
    const soakedHayItem = upsertItem(feedingSuggestion, {
      name: "Soaked hay cubes",
      amount: soakedHayTarget,
      note: "Use soaked hay cubes as the main food source when chewing is limited and the gut needs simpler soaked fiber meals.",
    });

    const specialBlend = findItem(feedingSuggestion, "Haystack Special Blend");
    if (specialBlend) {
      specialBlend.amount = formatLbAmount(Math.max(forageLbNumber * 0.08, 0.6));
      specialBlend.note = "Keep this as a smaller support portion while most of the ration stays in soaked forage form.";
    }

    const soakedCarrier = upsertItem(feedingSuggestion, {
      name: "Soaked beet pulp / beet cubes",
      amount: formatLbAmount(Math.max(forageLbNumber * 0.06, 0.7), " dry equivalent"),
      note: "Keep this as a smaller soaked fiber support, not the main calorie source, when both chewing and digestion are concerns.",
    });

    summary.push("When poor teeth and sensitive digestion overlap, lean mostly on soaked forage as the main feed source.");
    symptomLinkedChanges.push(
      `Poor teeth plus sensitive digestion shifts the ration mainly to soaked hay cubes (${soakedHayItem.amount}) with a smaller soaked beet pulp support at ${soakedCarrier.amount}.`
    );
  }

  const consolidatedFeedingSuggestion = consolidateEquivalentFeedItems(feedingSuggestion);
  const scalableFeedItems = consolidatedFeedingSuggestion.filter(isConcreteFeedItem);
  const currentFeedTotal = scalableFeedItems.reduce((sum, item) => {
    const parsed = parseLbAmount(item.amount);
    return sum + (parsed ? parsed.poundsPerDay : 0);
  }, 0);

  if (currentFeedTotal > 0) {
    const scaleRatio = forageLbNumber / currentFeedTotal;
    const scaledValues = scalableFeedItems.map((item) => {
      const parsed = parseLbAmount(item.amount)!;
      return {
        item,
        suffix: parsed.suffix,
        scaled: parsed.poundsPerDay * scaleRatio,
      };
    });

    const roundedValues = scaledValues.map((entry) => roundToTenth(entry.scaled));
    const roundedTotal = roundToTenth(roundedValues.reduce((sum, value) => sum + value, 0));
    const difference = roundToTenth(forageLbNumber - roundedTotal);

    if (difference !== 0) {
      let adjustmentIndex = 0;
      scaledValues.forEach((entry, index) => {
        if (entry.scaled > scaledValues[adjustmentIndex].scaled) {
          adjustmentIndex = index;
        }
      });
      roundedValues[adjustmentIndex] = roundToTenth(roundedValues[adjustmentIndex] + difference);
    }

    scaledValues.forEach((entry, index) => {
      entry.item.amount = formatLbAmount(roundedValues[index], entry.suffix);
    });
  }

  const feedTotalLbPerDay = scalableFeedItems
    .reduce((sum, item) => {
      const parsed = parseLbAmount(item.amount);
      return sum + (parsed ? parsed.poundsPerDay : 0);
    }, 0)
    .toFixed(1);

  if (horse.id === "tenor") {
    summary.push("Tenor's baseline plan should account for senior needs, dental issues, and PSSM.");
  }

  if (horse.id === "spoi") {
    summary.push("Spoi may do better with a conservative calorie plan unless weight loss is no longer needed.");
  }

  if (warnings.length === 0) {
    warnings.push("This tool is for feeding guidance only, not diagnosis or emergency care.");
  }

  return {
    horseName: horse.name,
    weightLb: horse.weightLb,
    forageLbPerDay: forageLb,
    feedTotalLbPerDay,
    summary,
    adjustments,
    warnings,
    horseNotes: horse.notes,
    baselinePlan: horse.baselinePlan,
    feedingSuggestion: consolidatedFeedingSuggestion,
    supplementGroups,
    symptomLinkedChanges,
  };
}

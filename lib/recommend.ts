import { getHorseById, type Goal, type HorseId, type SymptomId } from "./horses";

export type FormState = {
  horseId: HorseId;
  goal: Goal;
  symptoms: SymptomId[];
};

export type Recommendation = {
  horseName: string;
  weightLb: number;
  forageLbPerDay: string;
  summary: string[];
  adjustments: string[];
  warnings: string[];
  horseNotes: string[];
  baselinePlan: string[];
  feedingSuggestion: { name: string; amount: string; note?: string }[];
  supplementGroups: { title: string; items: { name: string; amount: string; note?: string }[] }[];
};

function foragePercent(goal: Goal) {
  if (goal === "lose") return 1.5;
  if (goal === "gain") return 2.0;
  return 1.8;
}

export function buildRecommendation(form: FormState): Recommendation {
  const horse = getHorseById(form.horseId);
  const symptoms = new Set(form.symptoms);
  const forageLb = (horse.weightLb * (foragePercent(form.goal) / 100)).toFixed(1);

  const summary: string[] = [];
  const adjustments: string[] = [];
  const warnings: string[] = [];

  if (form.goal === "gain") {
    summary.push("Increase calories gradually with fiber- and fat-based feed choices.");
    adjustments.push("Split concentrate into 2–3 meals per day.");
    adjustments.push("Recheck body condition every 2 weeks so gain stays controlled.");
  }

  if (form.goal === "maintain") {
    summary.push("Keep the ration steady and adjust only if body condition starts changing.");
    adjustments.push("Recheck body condition score every 2 weeks.");
  }

  if (form.goal === "lose") {
    summary.push("Reduce excess calories while keeping forage as the foundation of the diet.");
    adjustments.push("Limit calorie-dense concentrates unless needed for nutrient balance.");
    adjustments.push("Track body condition and neck crest changes instead of cutting forage too aggressively.");
  }

  if (symptoms.has("poor_teeth")) {
    summary.push("Use soaked senior feed or mash-friendly forage alternatives.");
    adjustments.push("Watch for quidding, slow eating, or choke risk.");
  }

  if (symptoms.has("sensitive_digestion")) {
    summary.push("Make changes slowly and favor highly digestible fiber sources.");
    adjustments.push("Keep meal sizes small and consistent.");
  }

  if (symptoms.has("pssm")) {
    summary.push("Prefer low-starch, low-sugar feed choices.");
    adjustments.push("Use fat/fiber calories instead of sweet feed or high-starch grain.");
    warnings.push("Review the full ration with your veterinarian if tying-up or exercise intolerance is present.");
  }

  if (symptoms.has("insulin")) {
    summary.push("Choose low-NSC feed and be cautious with extra calories.");
    adjustments.push("If hay sugar is unknown, consider testing or soaking hay before making bigger feed changes.");
    warnings.push("If there is laminitis history or insulin dysregulation, confirm the plan with a veterinarian.");
  }

  if (symptoms.has("poor_appetite")) {
    summary.push("Use palatable soaked meals and monitor how much is actually finished.");
    adjustments.push("Track refusals for several days before making big ration increases.");
  }

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
    summary,
    adjustments,
    warnings,
    horseNotes: horse.notes,
    baselinePlan: horse.baselinePlan,
    feedingSuggestion: horse.feedingSuggestion,
    supplementGroups: horse.supplementGroups,
  };
}

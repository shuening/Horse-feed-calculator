export type HorseId = "tenor" | "odinn" | "spoi" | "uffie";

export type SymptomId =
  | "poor_teeth"
  | "sensitive_digestion"
  | "poor_appetite"
  | "pssm"
  | "insulin";

export type Goal = "gain" | "maintain" | "lose";

export type FeedingItem = {
  name: string;
  amount: string;
  note?: string;
};

export type SupplementGroup = {
  title: string;
  items: FeedingItem[];
};

export type HorseProfile = {
  id: HorseId;
  name: string;
  weightLb: number;
  notes: string[];
  defaultGoal: Goal;
  defaultSymptoms: SymptomId[];
  baselinePlan: string[];
  feedingSuggestion: FeedingItem[];
  supplementGroups: SupplementGroup[];
};

export const HORSES: HorseProfile[] = [
  {
    id: "tenor",
    name: "Tenor",
    weightLb: 700,
    notes: ["Senior", "Teeth and digestive issues", "PSSM"],
    defaultGoal: "maintain",
    defaultSymptoms: ["poor_teeth", "sensitive_digestion", "pssm"],
    baselinePlan: [
      "Build around soaked or easy-to-chew fiber sources.",
      "Keep starch and sugar low because of PSSM.",
      "Make feed changes gradually and watch manure quality.",
    ],
    feedingSuggestion: [
      { name: "Timothy hay cubes", amount: "9.5 lb/day", note: "Feed as a fully soaked mash." },
      { name: "Beet pulp / beet cubes", amount: "1.0 lb/day dry equivalent", note: "Soak well before feeding if used as extra digestible fiber." },
      { name: "Haystack Special Blend", amount: "2.0 lb/day" },
    ],
    supplementGroups: [
      {
        title: "Core",
        items: [
          { name: "Triple Crown Balancer Gold", amount: "0.75 lb/day", note: "Main ration balancer for vitamin and mineral coverage." },
          { name: "Plain loose salt", amount: "1–2 oz/day", note: "Keep fresh water and free-choice loose salt available." },
        ],
      },

    ],
  },
  {
    id: "odinn",
    name: "Odinn",
    weightLb: 700,
    notes: ["Healthy adult"],
    defaultGoal: "maintain",
    defaultSymptoms: [],
    baselinePlan: [
      "Start with a simple forage-first maintenance plan.",
      "Adjust only if body condition or workload changes.",
    ],
    feedingSuggestion: [
      { name: "Grass hay", amount: "8 lb/day", note: "About 2.7 lb per meal if split into 3 meals." },
      { name: "Alfalfa", amount: "3 lb/day", note: "About 1.0 lb per meal if split into 3 meals." },
      { name: "Haystack Special Blend", amount: "0.5 lb/day", note: "About 0.17 lb per meal if split into 3 meals." },
      { name: "Timothy hay cubes", amount: "Optional partial swap for hay", note: "Only if you want a soaked forage meal component." },
      { name: "Beet pulp / beet cubes", amount: "Optional small soaked carrier", note: "Use only if needed for mixing feed." },
    ],
    supplementGroups: [
      {
        title: "Core",
        items: [
          { name: "Triple Crown Balancer Gold", amount: "0.75 lb/day", note: "About 0.25 lb per meal if split into 3 meals." },
          { name: "Plain loose salt", amount: "1–2 oz/day", note: "Or provide free-choice loose salt." },
        ],
      },

    ],
  },
  {
    id: "spoi",
    name: "Spoi",
    weightLb: 950,
    notes: ["Healthy adult", "A little overweight", "Possible insulin resistance"],
    defaultGoal: "lose",
    defaultSymptoms: ["insulin"],
    baselinePlan: [
      "Use a conservative calorie plan because Spoi is a little overweight.",
      "Prioritize low-sugar forage and avoid adding calories unless truly needed.",
    ],
    feedingSuggestion: [
      { name: "Grass hay", amount: "8 lb/day", note: "About 2.7 lb per meal if split into 3 meals. Test or soak hay if sugar is unknown." },
      { name: "Alfalfa", amount: "6 lb/day", note: "About 2.0 lb per meal if split into 3 meals." },
      { name: "Haystack Special Blend", amount: "1.0 lb/day", note: "About 0.33 lb per meal. Reduce first if extra calories are not needed." },
      { name: "Beet pulp / beet cubes", amount: "Optional 1.0 lb/day dry equivalent", note: "Only if needed as a soaked fiber carrier." },
    ],
    supplementGroups: [
      {
        title: "Core",
        items: [
          { name: "AminoTrace+", amount: "Main mineral-support option", note: "Best fit for a forage-first horse with metabolic concerns." },
          { name: "Plain loose salt", amount: "1–2 oz/day", note: "Or provide free-choice loose salt." },
        ],
      },
      {
        title: "Optional alternative",
        items: [
          { name: "Triple Crown Balancer Gold", amount: "Use instead of AminoTrace+ if preferred", note: "Do not stack both full mineral bases unless the whole ration is reviewed." },
        ],
      },

    ],
  },
  {
    id: "uffie",
    name: "Uffie",
    weightLb: 800,
    notes: ["Healthy adult"],
    defaultGoal: "maintain",
    defaultSymptoms: [],
    baselinePlan: [
      "Start with a balanced forage-first maintenance ration.",
      "Increase or reduce feed only if body condition begins to shift.",
    ],
    feedingSuggestion: [
      { name: "Grass hay", amount: "8 lb/day", note: "About 2.7 lb per meal if split into 3 meals." },
      { name: "Alfalfa", amount: "4 lb/day", note: "About 1.3 lb per meal if split into 3 meals." },
      { name: "Haystack Special Blend", amount: "0.5 lb/day", note: "About 0.17 lb per meal if split into 3 meals." },
      { name: "Timothy hay cubes", amount: "Optional partial swap for hay", note: "Useful if you want a soaked forage meal." },
      { name: "Beet pulp / beet cubes", amount: "Optional small soaked carrier" },
    ],
    supplementGroups: [
      {
        title: "Core",
        items: [
          { name: "Triple Crown Balancer Gold", amount: "0.75 lb/day", note: "About 0.25 lb per meal if split into 3 meals." },
          { name: "Plain loose salt", amount: "1–2 oz/day", note: "Or provide free-choice loose salt." },
        ],
      },

    ],
  },
];

export function getHorseById(id: HorseId) {
  return HORSES.find((horse) => horse.id === id)!;
}

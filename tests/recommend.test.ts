import { describe, expect, it } from 'vitest';
import { HORSES } from '../lib/horses';
import { buildRecommendation } from '../lib/recommend';

function feedAmountFor(recommendation: ReturnType<typeof buildRecommendation>, name: string) {
  return recommendation.feedingSuggestion.find((item) => item.name === name)?.amount;
}

describe('horse profiles', () => {
  it('supports exactly the required horses', () => {
    expect(HORSES.map((horse) => horse.name)).toEqual(['Tenor', 'Odinn', 'Spoi', 'Uffie']);
  });

  it('gives each horse the required profile fields', () => {
    HORSES.forEach((horse) => {
      expect(typeof horse.weightLb).toBe('number');
      expect(horse.notes.length).toBeGreaterThan(0);
      expect(horse.defaultGoal).toBeTruthy();
      expect(horse.defaultSymptoms).toBeDefined();
      expect(horse.baselinePlan.length).toBeGreaterThan(0);
      expect(horse.feedingSuggestion.length).toBeGreaterThan(0);
      expect(horse.supplementGroups.length).toBeGreaterThan(0);
    });
  });
});

describe('goal-driven forage and feed logic', () => {
  it('calculates starting forage target for weight loss at 1.5% of body weight', () => {
    const recommendation = buildRecommendation({ horseId: 'odinn', goal: 'lose', symptoms: [] });
    expect(recommendation.forageLbPerDay).toBe('10.5');
    expect(recommendation.feedTotalLbPerDay).toBe('10.5');
  });

  it('calculates starting forage target for maintain at 1.8% of body weight', () => {
    const recommendation = buildRecommendation({ horseId: 'odinn', goal: 'maintain', symptoms: [] });
    expect(recommendation.forageLbPerDay).toBe('12.6');
    expect(recommendation.feedTotalLbPerDay).toBe('12.6');
  });

  it('calculates starting forage target for weight gain at 2.0% of body weight', () => {
    const recommendation = buildRecommendation({ horseId: 'odinn', goal: 'gain', symptoms: [] });
    expect(recommendation.forageLbPerDay).toBe('14.0');
    expect(recommendation.feedTotalLbPerDay).toBe('14.0');
  });

  it('changes feed recommendations when the goal changes', () => {
    const maintain = buildRecommendation({ horseId: 'odinn', goal: 'maintain', symptoms: [] });
    const gain = buildRecommendation({ horseId: 'odinn', goal: 'gain', symptoms: [] });
    const lose = buildRecommendation({ horseId: 'odinn', goal: 'lose', symptoms: [] });

    expect(maintain.feedingSuggestion).not.toEqual(gain.feedingSuggestion);
    expect(maintain.feedingSuggestion).not.toEqual(lose.feedingSuggestion);
  });

  it('keeps the concrete feed total matched to the forage target across scenarios', () => {
    const scenarios = [
      { horseId: 'tenor', goal: 'maintain', symptoms: ['poor_teeth', 'sensitive_digestion', 'pssm'] },
      { horseId: 'spoi', goal: 'lose', symptoms: ['insulin'] },
      { horseId: 'uffie', goal: 'gain', symptoms: [] },
    ] as const;

    scenarios.forEach((scenario) => {
      const recommendation = buildRecommendation(scenario);
      expect(recommendation.feedTotalLbPerDay).toBe(recommendation.forageLbPerDay);
    });
  });
});

describe('feed consolidation requirements', () => {
  it('consolidates hay cubes into one line item', () => {
    const recommendation = buildRecommendation({
      horseId: 'tenor',
      goal: 'maintain',
      symptoms: ['poor_teeth', 'sensitive_digestion', 'pssm'],
    });

    const hayCubeItems = recommendation.feedingSuggestion.filter((item) => item.name.includes('hay cubes'));
    expect(hayCubeItems).toHaveLength(1);
    expect(hayCubeItems[0]?.name).toBe('Soaked hay cubes');
  });

  it('consolidates beet products into one line item', () => {
    const recommendation = buildRecommendation({
      horseId: 'tenor',
      goal: 'maintain',
      symptoms: ['poor_teeth', 'sensitive_digestion', 'insulin'],
    });

    const beetItems = recommendation.feedingSuggestion.filter((item) => item.name === 'Beet pulp / beet cubes');
    expect(beetItems).toHaveLength(1);
  });

  it('does not keep placeholder optional lines in the concrete feed output', () => {
    const recommendation = buildRecommendation({ horseId: 'odinn', goal: 'maintain', symptoms: [] });
    expect(recommendation.feedingSuggestion.some((item) => item.amount.toLowerCase().startsWith('optional'))).toBe(false);
  });
});

describe('symptom-driven feeding logic', () => {
  it('updates the feed suggestion when symptoms change', () => {
    const base = buildRecommendation({ horseId: 'tenor', goal: 'maintain', symptoms: [] });
    const poorTeeth = buildRecommendation({ horseId: 'tenor', goal: 'maintain', symptoms: ['poor_teeth'] });

    expect(base.feedingSuggestion).not.toEqual(poorTeeth.feedingSuggestion);
  });

  it('uses mainly soaked hay cubes when poor teeth and sensitive digestion are both active', () => {
    const recommendation = buildRecommendation({
      horseId: 'tenor',
      goal: 'maintain',
      symptoms: ['poor_teeth', 'sensitive_digestion'],
    });

    expect(recommendation.feedingSuggestion[0]?.name).toBe('Soaked hay cubes');

    const hayAmount = parseFloat(feedAmountFor(recommendation, 'Soaked hay cubes') ?? '0');
    const totalAmount = recommendation.feedingSuggestion.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    expect(hayAmount).toBeGreaterThan(totalAmount / 2);
  });

  it('adds a digestion-support supplement with an amount for sensitive digestion', () => {
    const recommendation = buildRecommendation({ horseId: 'tenor', goal: 'maintain', symptoms: ['sensitive_digestion'] });
    const supportGroup = recommendation.supplementGroups.find((group) => group.title === 'Symptom-driven support');
    const supportItem = supportGroup?.items.find((item) => item.name === 'Digestive support supplement');

    expect(supportItem?.amount).toBe('2 oz/day');
  });

  it('shifts poor-teeth horses toward soaked forage support', () => {
    const recommendation = buildRecommendation({ horseId: 'tenor', goal: 'maintain', symptoms: ['poor_teeth'] });

    expect(feedAmountFor(recommendation, 'Soaked hay cubes')).toBeTruthy();
    expect(recommendation.summary).toContain('Use soaked senior feed or mash-friendly forage alternatives.');
  });

  it('adds a PSSM supplement review target and low-starch guidance', () => {
    const recommendation = buildRecommendation({ horseId: 'tenor', goal: 'maintain', symptoms: ['pssm'] });
    const supportGroup = recommendation.supplementGroups.find((group) => group.title === 'Symptom-driven support');

    expect(supportGroup?.items.some((item) => item.name === 'Vitamin E review')).toBe(true);
    expect(recommendation.symptomLinkedChanges).toContain(
      'PSSM keeps the ration in low-starch feed choices and adds a vitamin E review target in supplements.'
    );
  });

  it('makes the insulin-resistant plan more conservative', () => {
    const base = buildRecommendation({ horseId: 'spoi', goal: 'maintain', symptoms: [] });
    const insulin = buildRecommendation({ horseId: 'spoi', goal: 'maintain', symptoms: ['insulin'] });

    expect(Number(insulin.forageLbPerDay)).toBeLessThan(Number(base.forageLbPerDay));
    expect(recommendationHasText(insulin.symptomLinkedChanges, 'Insulin Resistant lowers the starting forage target')).toBe(true);
  });

  it('adds smaller palatable support meals for poor appetite', () => {
    const recommendation = buildRecommendation({ horseId: 'tenor', goal: 'maintain', symptoms: ['poor_appetite'] });
    const supportGroup = recommendation.supplementGroups.find((group) => group.title === 'Symptom-driven support');

    expect(supportGroup?.items.some((item) => item.name === 'Palatable soaked carrier meal')).toBe(true);
  });
});

function recommendationHasText(values: string[], expectedFragment: string) {
  return values.some((value) => value.includes(expectedFragment));
}

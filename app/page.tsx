"use client";

import { useEffect, useMemo, useState } from "react";
import { HORSES, getHorseById, type Goal, type HorseId, type SymptomId } from "../lib/horses";
import { buildRecommendation } from "../lib/recommend";

const SYMPTOMS: { id: SymptomId; label: string }[] = [
  { id: "poor_teeth", label: "Poor teeth / trouble chewing" },
  { id: "sensitive_digestion", label: "Sensitive digestion / loose manure" },
  { id: "poor_appetite", label: "Not finishing feed" },
  { id: "pssm", label: "PSSM / tying-up risk" },
  { id: "insulin", label: "Insulin concerns / easy keeper / laminitis risk" },
];

const pageStyle: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: 24,
  fontFamily: "Arial, sans-serif",
  color: "#1f2937",
};

const cardStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 20,
  background: "#ffffff",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
};

const listStyle: React.CSSProperties = {
  marginTop: 8,
  paddingLeft: 20,
  lineHeight: 1.5,
};

const groupCardStyle: React.CSSProperties = {
  padding: 12,
  borderRadius: 12,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  marginBottom: 12,
};

export default function HomePage() {
  const [horseId, setHorseId] = useState<HorseId>("tenor");
  const [goal, setGoal] = useState<Goal>(getHorseById("tenor").defaultGoal);
  const [symptoms, setSymptoms] = useState<SymptomId[]>(getHorseById("tenor").defaultSymptoms);

  useEffect(() => {
    const horse = getHorseById(horseId);
    setGoal(horse.defaultGoal);
    setSymptoms(horse.defaultSymptoms);
  }, [horseId]);

  const selectedHorse = useMemo(() => getHorseById(horseId), [horseId]);

  const recommendation = useMemo(
    () => buildRecommendation({ horseId, goal, symptoms }),
    [horseId, goal, symptoms]
  );

  function toggleSymptom(symptomId: SymptomId) {
    setSymptoms((current) =>
      current.includes(symptomId)
        ? current.filter((id) => id !== symptomId)
        : [...current, symptomId]
    );
  }

  return (
    <main style={pageStyle}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 36, marginBottom: 8 }}>Horse Feeding Instruction Helper</h1>
        <p style={{ fontSize: 18, color: "#4b5563" }}>
          Barn version: cleaner notes, feeding suggestions, and supplements grouped by priority.
        </p>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 24, alignItems: "start" }}>
        <div style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Inputs</h2>

          <label style={{ display: "block", marginBottom: 18 }}>
            <div style={{ marginBottom: 8, fontWeight: 700 }}>Horse</div>
            <select
              value={horseId}
              onChange={(e) => setHorseId(e.target.value as HorseId)}
              style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #d1d5db" }}
            >
              {HORSES.map((horse) => (
                <option key={horse.id} value={horse.id}>
                  {horse.name} ({horse.weightLb} lb)
                </option>
              ))}
            </select>
          </label>

          <div style={{ marginBottom: 18, padding: 14, borderRadius: 12, background: "#f9fafb" }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Selected horse baseline</div>
            <ul style={listStyle}>
              {selectedHorse.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
</div>

          <div style={{ marginBottom: 18 }}>
            <div style={{ marginBottom: 8, fontWeight: 700 }}>Goal</div>
            {([
              ["gain", "Weight gain"],
              ["maintain", "Maintain"],
              ["lose", "Weight loss"],
            ] as [Goal, string][]).map(([value, label]) => (
              <label key={value} style={{ display: "block", marginBottom: 8 }}>
                <input type="radio" checked={goal === value} onChange={() => setGoal(value)} /> {label}
                {selectedHorse.defaultGoal === value ? " (default for this horse)" : ""}
              </label>
            ))}
          </div>

          <div>
            <div style={{ marginBottom: 8, fontWeight: 700 }}>Symptoms / constraints</div>
            <p style={{ marginTop: 0, color: "#6b7280", fontSize: 14 }}>
              Switching horses resets this list to that horse&apos;s default conditions.
            </p>
            {SYMPTOMS.map((symptom) => {
              const isDefault = selectedHorse.defaultSymptoms.includes(symptom.id);
              return (
                <label key={symptom.id} style={{ display: "block", marginBottom: 8 }}>
                  <input
                    type="checkbox"
                    checked={symptoms.includes(symptom.id)}
                    onChange={() => toggleSymptom(symptom.id)}
                  />{" "}
                  {symptom.label}
                  {isDefault ? " (default)" : ""}
                </label>
              );
            })}
          </div>
        </div>

        <div style={{ ...cardStyle, background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" }}>
          <h2 style={{ marginTop: 0 }}>Barn card</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, marginBottom: 16 }}>
            <div style={{ padding: 14, borderRadius: 12, background: "#eef2ff" }}>
<div style={{ fontSize: 13, color: "#4338ca", fontWeight: 700 }}>Horse</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{recommendation.horseName}</div>
            </div>
            <div style={{ padding: 14, borderRadius: 12, background: "#ecfeff" }}>
              <div style={{ fontSize: 13, color: "#0f766e", fontWeight: 700 }}>Known weight</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{recommendation.weightLb} lb</div>
            </div>
          </div>

          <div style={{ padding: 14, borderRadius: 12, background: "#fefce8", marginBottom: 18 }}>
            <div style={{ fontSize: 13, color: "#a16207", fontWeight: 700 }}>Starting forage target</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>About {recommendation.forageLbPerDay} lb/day</div>
          </div>

          <h3>Horse notes</h3>
          <ul style={listStyle}>
            {recommendation.horseNotes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3>Baseline plan</h3>
          <ul style={listStyle}>
            {recommendation.baselinePlan.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3>Feed</h3>
          <ul style={listStyle}>
            {recommendation.feedingSuggestion.map((item) => (
              <li key={`${item.name}-${item.amount}`}>
                <strong>{item.name}:</strong> {item.amount}
                {item.note ? ` — ${item.note}` : ""}
              </li>
            ))}
          </ul>

          <h3>Supplements</h3>
          {recommendation.supplementGroups.map((group) => (
            <div key={group.title} style={groupCardStyle}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{group.title}</div>
              <ul style={{ ...listStyle, marginBottom: 0 }}>
                {group.items.map((item) => ( 
              <li key={`${group.title}-${item.name}-${item.amount}`}>
                    <strong>{item.name}:</strong> {item.amount}
                    {item.note ? ` — ${item.note}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <h3>Summary</h3>
          <ul style={listStyle}>
            {recommendation.summary.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3>Suggested adjustments</h3>
          <ul style={listStyle}>
            {recommendation.adjustments.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3>Warnings</h3>
          <ul style={listStyle}>
            {recommendation.warnings.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { HORSES, getHorseById, type Goal, type HorseId, type SymptomId } from "../lib/horses";
import { buildRecommendation } from "../lib/recommend";

const SYMPTOMS: { id: SymptomId; label: string }[] = [
  { id: "poor_teeth", label: "Poor teeth / trouble chewing" },
  { id: "sensitive_digestion", label: "Sensitive digestion / loose manure" },
  { id: "poor_appetite", label: "Not finishing feed" },
  { id: "pssm", label: "PSSM" },
  { id: "insulin", label: "Insulin Resistant" },
];

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
    <main className="page">
      <div className="hero">
        <h1>Horse Feeding Instruction Helper</h1>
        <p>
          Barn version: cleaner notes, feeding suggestions, and supplements grouped by priority.
        </p>
      </div>

      <section className="layoutGrid">
        <div className="card inputsCard">
          <h2>Inputs</h2>

          <label className="fieldGroup">
            <span className="fieldLabel">Horse</span>
            <select
              value={horseId}
              onChange={(e) => setHorseId(e.target.value as HorseId)}
              className="selectInput"
            >
              {HORSES.map((horse) => (
                <option key={horse.id} value={horse.id}>
                  {horse.name} ({horse.weightLb} lb)
                </option>
              ))}
            </select>
          </label>

          <div className="softPanel">
            <div className="fieldLabel">Selected horse baseline</div>
            <ul className="bulletList">
              {selectedHorse.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>

          <div className="fieldGroup">
            <div className="fieldLabel">Goal</div>
            <div className="optionStack">
              {([
                ["gain", "Weight gain"],
                ["maintain", "Maintain"],
                ["lose", "Weight loss"],
              ] as [Goal, string][]).map(([value, label]) => (
                <label key={value} className="optionRow">
                  <input type="radio" checked={goal === value} onChange={() => setGoal(value)} />
                  <span>
                    {label}
                    {selectedHorse.defaultGoal === value ? " (default for this horse)" : ""}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="fieldGroup">
            <div className="fieldLabel">Symptoms / constraints</div>
            <p className="helperText">
              Switching horses resets this list to that horse&apos;s default conditions. Checked boxes now change
              forage targets, feed amounts, and symptom-linked supplement suggestions in the barn card.
            </p>
            <div className="optionStack">
              {SYMPTOMS.map((symptom) => {
                const isDefault = selectedHorse.defaultSymptoms.includes(symptom.id);
                return (
                  <label key={symptom.id} className="optionRow checkboxRow">
                    <input
                      type="checkbox"
                      checked={symptoms.includes(symptom.id)}
                      onChange={() => toggleSymptom(symptom.id)}
                    />
                    <span>
                      {symptom.label}
                      {isDefault ? " (default)" : ""}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card resultsCard">
          <h2>Barn card</h2>

          <div className="summaryGrid">
            <div className="statCard horseStat">
              <div className="statLabel">Horse</div>
              <div className="statValue">{recommendation.horseName}</div>
            </div>
            <div className="statCard weightStat">
              <div className="statLabel">Known weight</div>
              <div className="statValue">{recommendation.weightLb} lb</div>
            </div>
          </div>

          <div className="forageCard">
            <div className="statLabel forageLabel">Starting forage target</div>
            <div className="forageValue">{recommendation.forageLbPerDay} lb/day</div>
          </div>

          {recommendation.symptomLinkedChanges.length > 0 && (
            <section className="contentSection">
              <h3>Changes from checked symptoms</h3>
              <ul className="bulletList">
                {recommendation.symptomLinkedChanges.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="contentSection">
            <h3>Horse notes</h3>
            <ul className="bulletList">
              {recommendation.horseNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="contentSection">
            <h3>Baseline plan</h3>
            <ul className="bulletList">
              {recommendation.baselinePlan.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="contentSection">
            <h3>Feed</h3>
            <p className="helperText sectionHelper">
              Concrete feed total: {recommendation.feedTotalLbPerDay} lb/day, matched to the current forage
              target and goal.
            </p>
            <ul className="bulletList">
              {recommendation.feedingSuggestion.map((item) => (
                <li key={`${item.name}-${item.amount}`}>
                  <strong>{item.name}:</strong> {item.amount}
                  {item.note ? ` — ${item.note}` : ""}
                </li>
              ))}
            </ul>
          </section>

          <section className="contentSection">
            <h3>Supplements</h3>
            {recommendation.supplementGroups.map((group) => (
              <div key={group.title} className="groupCard">
                <div className="groupTitle">{group.title}</div>
                <ul className="bulletList compactList">
                  {group.items.map((item) => (
                    <li key={`${group.title}-${item.name}-${item.amount}`}>
                      <strong>{item.name}:</strong> {item.amount}
                      {item.note ? ` — ${item.note}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="contentSection">
            <h3>Summary</h3>
            <ul className="bulletList">
              {recommendation.summary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="contentSection">
            <h3>Suggested adjustments</h3>
            <ul className="bulletList">
              {recommendation.adjustments.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="contentSection">
            <h3>Warnings</h3>
            <ul className="bulletList">
              {recommendation.warnings.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      </section>

      <style jsx>{`
        .page {
          max-width: 1120px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
          color: #1f2937;
        }

        .hero {
          margin-bottom: 24px;
        }

        .hero h1 {
          margin: 0 0 8px;
          font-size: clamp(2rem, 5vw, 2.4rem);
          line-height: 1.1;
        }

        .hero p {
          margin: 0;
          font-size: clamp(1rem, 2.6vw, 1.125rem);
          color: #4b5563;
          line-height: 1.5;
        }

        .layoutGrid {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.15fr);
          gap: 24px;
          align-items: start;
        }

        .card {
          min-width: 0;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 20px;
          background: #ffffff;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
        }

        .resultsCard {
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        }

        .fieldGroup {
          display: block;
          margin-bottom: 18px;
        }

        .fieldLabel {
          display: block;
          margin-bottom: 8px;
          font-weight: 700;
        }

        .selectInput {
          width: 100%;
          min-height: 48px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #d1d5db;
          font-size: 16px;
          background: #fff;
          color: #111827;
        }

        .softPanel {
          margin-bottom: 18px;
          padding: 14px;
          border-radius: 12px;
          background: #f9fafb;
        }

        .optionStack {
          display: grid;
          gap: 10px;
        }

        .optionRow {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #fff;
          line-height: 1.45;
        }

        .optionRow input {
          margin-top: 3px;
          flex: 0 0 auto;
        }

        .helperText {
          margin: 0 0 10px;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.5;
        }

        .sectionHelper {
          margin-top: -2px;
          margin-bottom: 10px;
        }

        .summaryGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .statCard {
          padding: 14px;
          border-radius: 12px;
        }

        .horseStat {
          background: #eef2ff;
        }

        .weightStat {
          background: #ecfeff;
        }

        .statLabel {
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .horseStat .statLabel {
          color: #4338ca;
        }

        .weightStat .statLabel {
          color: #0f766e;
        }

        .statValue {
          font-size: clamp(1.125rem, 3.4vw, 1.35rem);
          font-weight: 700;
          line-height: 1.2;
          overflow-wrap: anywhere;
        }

        .forageCard {
          padding: 14px;
          border-radius: 12px;
          background: #fefce8;
          margin-bottom: 18px;
        }

        .forageLabel {
          color: #a16207;
        }

        .forageValue {
          font-size: clamp(1.35rem, 4vw, 1.6rem);
          font-weight: 700;
          line-height: 1.2;
        }

        .contentSection {
          margin-top: 18px;
        }

        .contentSection h3 {
          margin: 0 0 10px;
        }

        .bulletList {
          margin: 8px 0 0;
          padding-left: 20px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .compactList {
          margin-bottom: 0;
        }

        .groupCard {
          padding: 12px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          margin-bottom: 12px;
        }

        .groupTitle {
          font-weight: 700;
          margin-bottom: 6px;
        }

        @media (max-width: 900px) {
          .layoutGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .page {
            padding: 14px;
          }

          .card {
            padding: 16px;
            border-radius: 16px;
          }

          .summaryGrid {
            grid-template-columns: 1fr;
          }

          .optionRow {
            padding: 12px;
          }

          .bulletList {
            padding-left: 18px;
          }
        }
      `}</style>
    </main>
  );
}

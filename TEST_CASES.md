# Horse Feeding Instruction Helper Test Cases

This document maps the current `REQUIREMENT.md` into explicit manual test cases.

## Test Case Format
- ID: unique identifier
- Requirement reference: section in `REQUIREMENT.md`
- Objective: what the test validates
- Preconditions: setup needed before running the test
- Steps: actions to perform
- Expected result: pass criteria

---

## 1. Purpose

### TC-001 Purpose: barn-facing feeding helper
- Requirement reference: 1. Purpose
- Objective: Verify the app presents feeding guidance for known horses in a simple barn-facing format.
- Preconditions:
  - App is loaded.
- Steps:
  1. Open the home page.
  2. Review the page heading, inputs, and Barn card content.
- Expected result:
  - The app is presented as a horse feeding helper.
  - The page focuses on practical feeding guidance.
  - The app does not present itself as a diagnostic system.

### TC-002 Purpose: not a veterinary diagnostic system
- Requirement reference: 1. Purpose
- Objective: Verify the app does not claim to diagnose illness.
- Preconditions:
  - App is loaded.
- Steps:
  1. Review visible warnings, notes, and overall wording.
- Expected result:
  - The wording does not claim diagnosis or treatment.
  - The app positioning remains guidance-only.

---

## 2. Target Users

### TC-003 Target users: readable for caretakers and barn users
- Requirement reference: 2. Target Users
- Objective: Verify the output is readable for non-technical horse caretakers.
- Preconditions:
  - App is loaded.
- Steps:
  1. Review labels, section names, and recommendation text.
- Expected result:
  - Labels are understandable by horse owners/caretakers.
  - No technical setup or developer knowledge is required to use the app.
  - Language is simple and practical.

---

## 3. Supported Horses

### TC-004 Supported horse list is exact
- Requirement reference: 3. Supported Horses
- Objective: Verify only the required horses are available.
- Preconditions:
  - App is loaded.
- Steps:
  1. Open the horse selector.
  2. Record all options.
- Expected result:
  - Only these horses appear: Tenor, Odinn, Spoi, Uffie.
  - No extra horse options are shown.

### TC-005 Each horse has required profile fields
- Requirement reference: 3. Supported Horses
- Objective: Verify each horse exposes the required profile-driven behavior.
- Preconditions:
  - App is loaded.
- Steps:
  1. Select each horse one by one.
  2. Review the Barn card and default state after selection.
- Expected result:
  - Each horse has a fixed known weight.
  - Each horse has horse notes.
  - Each horse has a default goal.
  - Each horse has default symptoms/constraints.
  - Each horse has a baseline plan.
  - Each horse has base feed suggestions.
  - Each horse has supplement groups.

---

## 4. Main User Inputs

### TC-006 Input controls available
- Requirement reference: 4. Main User Inputs
- Objective: Verify the required user inputs exist.
- Preconditions:
  - App is loaded.
- Steps:
  1. Inspect the Inputs card.
- Expected result:
  - User can choose horse.
  - User can choose goal.
  - User can choose symptoms / constraints.

### TC-007 Inputs drive feed and supplement suggestions
- Requirement reference: 4. Main User Inputs
- Objective: Verify changing inputs changes the suggested feed and supplement output.
- Preconditions:
  - App is loaded.
- Steps:
  1. Note current Feed and Supplements sections.
  2. Change the horse.
  3. Change the goal.
  4. Check or uncheck one symptom.
- Expected result:
  - Feed suggestions change appropriately.
  - Supplement suggestions change appropriately.
  - Output reflects current inputs rather than staying static.

### TC-008 Goal options are correct
- Requirement reference: 4.1 Goal options
- Objective: Verify the goal list matches the requirement.
- Preconditions:
  - App is loaded.
- Steps:
  1. Review the goal radio options.
- Expected result:
  - Options are exactly: weight gain, maintain, weight loss.

### TC-009 Symptom options are correct
- Requirement reference: 4.2 Symptom / constraint options
- Objective: Verify the symptom list matches the requirement.
- Preconditions:
  - App is loaded.
- Steps:
  1. Review the symptom checkbox list.
- Expected result:
  - Options are exactly:
    - poor teeth
    - sensitive digestion
    - not finishing feed
    - PSSM
    - Insulin Resistant

---

## 5. Core Behavior

### TC-010 Horse switching resets dependent defaults
- Requirement reference: 5.1 Horse switching
- Objective: Verify changing horse resets goal and symptoms to the selected horse defaults.
- Preconditions:
  - App is loaded.
  - Change the current goal and symptoms away from defaults.
- Steps:
  1. Select a different horse.
- Expected result:
  - Goal resets to that horse’s default goal.
  - Symptoms reset to that horse’s default symptoms.

### TC-011 Barn card updates immediately on horse change
- Requirement reference: 5.2 Barn card updates
- Objective: Verify immediate Barn card update when horse changes.
- Preconditions:
  - App is loaded.
- Steps:
  1. Select a different horse.
- Expected result:
  - Barn card updates immediately with new horse name, weight, notes, feed, supplements, and related values.

### TC-012 Barn card updates immediately on goal change
- Requirement reference: 5.2 Barn card updates
- Objective: Verify immediate Barn card update when goal changes.
- Preconditions:
  - App is loaded.
- Steps:
  1. Change the goal.
- Expected result:
  - Barn card updates immediately, including forage target and feed recommendations.

### TC-013 Barn card updates immediately on symptom change
- Requirement reference: 5.2 Barn card updates
- Objective: Verify immediate Barn card update when symptom checkboxes change.
- Preconditions:
  - App is loaded.
- Steps:
  1. Check a symptom.
  2. Uncheck the same symptom.
- Expected result:
  - Barn card updates immediately after each change.

---

## 6. Barn Card Sections

### TC-014 Barn card contains all required sections
- Requirement reference: 6. Barn Card Sections
- Objective: Verify the Barn card contains all required sections/information areas.
- Preconditions:
  - App is loaded.
- Steps:
  1. Review the Barn card from top to bottom.
- Expected result:
  - Barn card shows:
    - horse name
    - known weight
    - starting forage target
    - horse notes
    - baseline plan
    - feed
    - supplements
    - summary
    - symptom toggle section
    - suggested adjustments
    - warnings

---

## 7. Goal-Driven Feeding Logic

### TC-015 Goal changes affect more than forage target
- Requirement reference: 7. Goal-Driven Feeding Logic
- Objective: Verify changing goal affects more than a single number.
- Preconditions:
  - App is loaded.
- Steps:
  1. Select one horse.
  2. Switch between weight gain, maintain, and weight loss.
- Expected result:
  - Not only the forage target changes.
  - Feed recommendations also change.

### TC-016 Starting forage target calculation for weight loss
- Requirement reference: 7.1 Starting forage target
- Objective: Verify weight loss uses 1.5% body weight.
- Preconditions:
  - App is loaded.
- Steps:
  1. Select a horse with known weight.
  2. Set goal to weight loss.
  3. Compare displayed forage target to 1.5% of body weight.
- Expected result:
  - Starting forage target matches 1.5% of body weight.

### TC-017 Starting forage target calculation for maintain
- Requirement reference: 7.1 Starting forage target
- Objective: Verify maintain uses 1.8% body weight.
- Preconditions:
  - App is loaded.
- Steps:
  1. Select a horse with known weight.
  2. Set goal to maintain.
  3. Compare displayed forage target to 1.8% of body weight.
- Expected result:
  - Starting forage target matches 1.8% of body weight.

### TC-018 Starting forage target calculation for weight gain
- Requirement reference: 7.1 Starting forage target
- Objective: Verify weight gain uses 2.0% body weight.
- Preconditions:
  - App is loaded.
- Steps:
  1. Select a horse with known weight.
  2. Set goal to weight gain.
  3. Compare displayed forage target to 2.0% of body weight.
- Expected result:
  - Starting forage target matches 2.0% of body weight.

### TC-019 Feed section recalculates on goal change
- Requirement reference: 7.2 Feed section must follow the goal
- Objective: Verify concrete Feed section recalculates when goal changes.
- Preconditions:
  - App is loaded.
- Steps:
  1. Note feed amounts under one goal.
  2. Change to another goal.
- Expected result:
  - Concrete feed amounts change.

### TC-020 Feed amounts scale to forage target
- Requirement reference: 7.2 Feed section must follow the goal
- Objective: Verify feed amounts scale to the current forage target.
- Preconditions:
  - App is loaded.
- Steps:
  1. Compare Feed section across different goals for the same horse.
- Expected result:
  - Higher forage target gives a larger total feed amount.
  - Lower forage target gives a smaller total feed amount.

### TC-021 Feed total matches Starting forage target
- Requirement reference: 7.2 Feed section must follow the goal
- Objective: Verify the Feed section total matches the Starting forage target.
- Preconditions:
  - App is loaded.
- Steps:
  1. Record Starting forage target.
  2. Record the concrete feed total shown in the Feed section.
- Expected result:
  - Concrete feed total matches the Starting forage target.

### TC-022 Feed section shows daily concrete feed total
- Requirement reference: 7.2 Feed section must follow the goal
- Objective: Verify the daily feed total is displayed.
- Preconditions:
  - App is loaded.
- Steps:
  1. Review the Feed section helper text.
- Expected result:
  - Daily concrete feed total is explicitly shown.

### TC-023 Equivalent feed names are consolidated
- Requirement reference: 7.2 Feed section must follow the goal
- Objective: Verify equivalent feeds are consolidated into a single line.
- Preconditions:
  - App is loaded.
  - Choose a state where equivalent feeds may appear.
- Steps:
  1. Review the Feed section.
- Expected result:
  - Equivalent names are not shown on multiple separate lines.
  - Same feed is consolidated for display and totaling.

### TC-024 Hay cube consolidation example
- Requirement reference: 7.2 Feed section must follow the goal
- Objective: Verify soaked hay cubes and timothy hay cubes are treated as the same feed.
- Preconditions:
  - App is loaded.
  - Choose a horse/symptom combination that would otherwise cause both to appear.
- Steps:
  1. Review the Feed section.
- Expected result:
  - Only one consolidated hay-cube line appears.

### TC-025 Beet product consolidation example
- Requirement reference: 7.2 Feed section must follow the goal
- Objective: Verify beet pulp / beet cubes and soaked beet cubes are treated as the same feed.
- Preconditions:
  - App is loaded.
  - Choose a horse/symptom combination that would otherwise cause both to appear.
- Steps:
  1. Review the Feed section.
- Expected result:
  - Only one consolidated beet-product line appears.

### TC-026 No duplicate counting or total mismatch
- Requirement reference: 7.2 Feed section must follow the goal
- Objective: Verify consolidation does not create duplicate counting or mismatched totals.
- Preconditions:
  - App is loaded.
- Steps:
  1. Choose a symptom combination that introduces overlapping feed types.
  2. Compare consolidated feed lines to the displayed total.
- Expected result:
  - No duplicate overlapping lines remain.
  - Displayed feed total remains correct.

### TC-027 Feed section is not static when goal changes
- Requirement reference: 7.2 Feed section must follow the goal
- Objective: Verify feed section content changes with goal changes.
- Preconditions:
  - App is loaded.
- Steps:
  1. Switch among all three goals.
- Expected result:
  - Feed section content does not stay identical across all goals.

### TC-028 Optional feed lines excluded from concrete total
- Requirement reference: 7.3 Optional feed lines
- Objective: Verify optional placeholder lines are not counted as concrete feed total.
- Preconditions:
  - App is loaded.
- Steps:
  1. Review any optional-style feed lines for a horse.
  2. Compare them to the concrete feed total logic.
- Expected result:
  - Placeholder-only optional lines are not counted in the concrete daily total.

---

## 8. Symptom-Driven Feeding Logic

### TC-029 Symptoms affect visible output, not only summary text
- Requirement reference: 8. Symptom-Driven Feeding Logic
- Objective: Verify symptoms change visible feeding output.
- Preconditions:
  - App is loaded.
- Steps:
  1. Check a symptom.
  2. Compare the Barn card before and after.
- Expected result:
  - One or more visible output areas change beyond summary wording.

### TC-030 Checking and unchecking symptoms updates feed suggestion immediately
- Requirement reference: 8. Symptom-Driven Feeding Logic
- Objective: Verify symptom changes update feed suggestion immediately.
- Preconditions:
  - App is loaded.
- Steps:
  1. Check a symptom.
  2. Observe feed suggestion.
  3. Uncheck the symptom.
  4. Observe feed suggestion again.
- Expected result:
  - Feed suggestion updates immediately on both check and uncheck.

### TC-031 Symptom consequence appears in allowed output areas
- Requirement reference: 8. Symptom-Driven Feeding Logic
- Objective: Verify symptom changes appear in required output categories.
- Preconditions:
  - App is loaded.
- Steps:
  1. Check symptoms one at a time.
  2. Observe forage target, feed amounts, feed types, supplement suggestions, and supplement amounts.
- Expected result:
  - The consequence appears in one or more of the allowed areas.

### TC-032 Combined symptom logic avoids conflict
- Requirement reference: 8. Symptom-Driven Feeding Logic
- Objective: Verify combined symptoms produce a coherent, non-conflicting feed plan.
- Preconditions:
  - App is loaded.
- Steps:
  1. Activate multiple symptoms together.
  2. Review Feed and Supplements sections.
- Expected result:
  - Combined plan is coherent.
  - No contradictory feed instructions are shown.
  - Totals still remain valid.

### TC-033 Poor teeth + sensitive digestion uses mainly soaked hay cubes
- Requirement reference: 8. Symptom-Driven Feeding Logic
- Objective: Verify the combined poor-teeth and sensitive-digestion example.
- Preconditions:
  - App is loaded.
  - Select a horse.
- Steps:
  1. Check poor teeth.
  2. Check sensitive digestion.
  3. Review Feed section.
- Expected result:
  - Feed suggestion relies mainly on soaked hay cubes or other soaked easy-to-chew fiber sources as the main food source.

### TC-034 Sensitive digestion adds digestion-support supplement with amount
- Requirement reference: 8.1 Sensitive digestion
- Objective: Verify sensitive digestion adds supplement and amount.
- Preconditions:
  - App is loaded.
- Steps:
  1. Check sensitive digestion.
  2. Review Supplements and Feed sections.
- Expected result:
  - A digestion-support supplement is suggested.
  - The supplement includes an amount.
  - A related feed consequence is visible.

### TC-035 Poor teeth shifts toward soaked easy-to-chew forage
- Requirement reference: 8.2 Poor teeth
- Objective: Verify poor teeth shifts plan toward soaked/easy-to-chew forage.
- Preconditions:
  - App is loaded.
- Steps:
  1. Check poor teeth.
  2. Review Feed section.
- Expected result:
  - Plan shifts toward soaked or easier-to-chew forage.
  - Mash-style or soaked fiber support appears.
  - Concrete amounts are shown where possible.

### TC-036 PSSM reinforces low-starch / low-sugar choices
- Requirement reference: 8.3 PSSM
- Objective: Verify PSSM changes the plan appropriately.
- Preconditions:
  - App is loaded.
- Steps:
  1. Check PSSM.
  2. Review Feed and Supplements sections.
- Expected result:
  - Low-starch / low-sugar feeding choices are reinforced.
  - A relevant supplement or review target appears in Supplements.

### TC-037 Insulin Resistant makes plan more conservative
- Requirement reference: 8.4 Insulin Resistant
- Objective: Verify insulin-related changes are conservative.
- Preconditions:
  - App is loaded.
- Steps:
  1. Check Insulin Resistant.
  2. Review forage target, feed amounts, and carrier options.
- Expected result:
  - Plan becomes more conservative where appropriate.
  - Richer bucket feed suggestions are reduced or limited.
  - Low-sugar carrier options are preferred.
  - Forage target or feed amounts change if needed.

### TC-038 Poor appetite adds palatable support meals
- Requirement reference: 8.5 Poor appetite
- Objective: Verify poor appetite behavior.
- Preconditions:
  - App is loaded.
- Steps:
  1. Check not finishing feed / poor appetite.
  2. Review Feed and Supplements sections.
- Expected result:
  - Smaller, more palatable support meals or carriers are suggested.
  - Concrete amounts are included where possible.

---

## 9. Explainability

### TC-039 Symptom toggle section exists with correct name
- Requirement reference: 9. Explainability
- Objective: Verify the explainability section exists and is named correctly.
- Preconditions:
  - App is loaded.
  - Select a state where at least one symptom change explanation is available.
- Steps:
  1. Review Barn card sections.
- Expected result:
  - A section named `Symptom toggle section` is present.

### TC-040 Symptom toggle section explains changes in plain language
- Requirement reference: 9. Explainability
- Objective: Verify symptom-driven changes are explained clearly.
- Preconditions:
  - App is loaded.
  - At least one symptom is active.
- Steps:
  1. Read the Symptom toggle section.
- Expected result:
  - The section explains what changed because of selected symptoms.
  - The wording is plain language.

### TC-041 Symptom toggle section appears after Summary
- Requirement reference: 9. Explainability
- Objective: Verify section order requirement.
- Preconditions:
  - App is loaded.
  - At least one symptom explanation is available.
- Steps:
  1. Review order of Summary and Symptom toggle section.
- Expected result:
  - Symptom toggle section appears after Summary.

---

## 10. Mobile-Friendly Requirements

### TC-042 Mobile layout stacks vertically
- Requirement reference: 10.1 Layout
- Objective: Verify small-screen layout behavior.
- Preconditions:
  - App is loaded.
  - Browser responsive mode or mobile device available.
- Steps:
  1. Resize to a narrow mobile viewport.
- Expected result:
  - Inputs and Barn card stack vertically.

### TC-043 Mobile text wraps cleanly
- Requirement reference: 10.1 Layout
- Objective: Verify text wrapping on small screens.
- Preconditions:
  - App is loaded in narrow viewport.
- Steps:
  1. Review long feed, supplement, and summary lines.
- Expected result:
  - Text wraps cleanly.
  - No unreadable overflow occurs.

### TC-044 No horizontal scrolling on cards
- Requirement reference: 10.1 Layout
- Objective: Verify cards remain readable on mobile.
- Preconditions:
  - App is loaded in narrow viewport.
- Steps:
  1. Scroll through the page horizontally if possible.
- Expected result:
  - Cards remain readable without horizontal scrolling.

### TC-045 Controls are touch-friendly
- Requirement reference: 10.2 Controls
- Objective: Verify controls are usable on mobile.
- Preconditions:
  - App is loaded on mobile or responsive mode.
- Steps:
  1. Tap the selector.
  2. Tap goal radio buttons.
  3. Tap symptom checkboxes.
- Expected result:
  - Controls are easy to tap.
  - Spacing is adequate.

### TC-046 Mobile viewport renders correctly
- Requirement reference: 10.3 Viewport
- Objective: Verify viewport behavior on phones.
- Preconditions:
  - App is loaded on a phone or in device emulation.
- Steps:
  1. Load the page fresh.
- Expected result:
  - Page scales correctly to device width.
  - No desktop-only zoomed-out rendering issue appears.

---

## 11. Technical Requirements

### TC-047 App uses Next.js App Router
- Requirement reference: 11. Technical Requirements
- Objective: Verify the project structure uses Next.js App Router.
- Preconditions:
  - Source code available.
- Steps:
  1. Inspect project structure.
- Expected result:
  - App uses Next.js App Router structure such as `app/`.

### TC-048 Static-export compatibility
- Requirement reference: 11. Technical Requirements
- Objective: Verify the app is static-export compatible.
- Preconditions:
  - Source code available.
- Steps:
  1. Inspect config and build behavior.
  2. Run production build/export workflow if applicable.
- Expected result:
  - App is compatible with GitHub Pages static deployment.

### TC-049 Build succeeds with GitHub Pages workflow
- Requirement reference: 11. Technical Requirements
- Objective: Verify production build passes.
- Preconditions:
  - Repository available locally and/or CI enabled.
- Steps:
  1. Run local production build.
  2. Review GitHub Actions deploy/build run.
- Expected result:
  - Build succeeds locally.
  - GitHub Pages workflow succeeds.

### TC-050 Only one active Pages deployment workflow
- Requirement reference: 11. Technical Requirements
- Objective: Verify workflow duplication does not exist.
- Preconditions:
  - Repository available.
- Steps:
  1. Inspect `.github/workflows/`.
  2. Review Actions tab.
- Expected result:
  - Only one active Pages deployment workflow exists.

---

## 12. Deployment Requirements

### TC-051 Site deploys through GitHub Pages using GitHub Actions
- Requirement reference: 12. Deployment Requirements
- Objective: Verify deployment mechanism.
- Preconditions:
  - GitHub repository available.
- Steps:
  1. Review Actions workflow.
  2. Trigger or inspect latest deployment.
- Expected result:
  - Deployment is performed through GitHub Pages using GitHub Actions.

### TC-052 Deployment URL is correct
- Requirement reference: 12. Deployment Requirements
- Objective: Verify live site URL.
- Preconditions:
  - Successful deployment available.
- Steps:
  1. Open `https://shuening.github.io/Horse-feed-calculator/`.
- Expected result:
  - The deployed app is available at that URL.

---

## 13. Non-Goals

### TC-053 App does not diagnose illness
- Requirement reference: 13. Non-Goals
- Objective: Verify non-diagnostic scope.
- Preconditions:
  - App is loaded.
- Steps:
  1. Review visible content.
- Expected result:
  - App does not diagnose illness.

### TC-054 App does not replace veterinary advice
- Requirement reference: 13. Non-Goals
- Objective: Verify app does not claim to replace veterinary advice.
- Preconditions:
  - App is loaded.
- Steps:
  1. Review warnings and positioning.
- Expected result:
  - App does not claim to replace veterinary advice.

### TC-055 Users cannot create arbitrary horses
- Requirement reference: 13. Non-Goals
- Objective: Verify custom horse creation is not part of the app.
- Preconditions:
  - App is loaded.
- Steps:
  1. Review UI for add/edit horse functionality.
- Expected result:
  - No arbitrary horse creation feature is present.

### TC-056 No user account or backend data storage requirement exposed
- Requirement reference: 13. Non-Goals
- Objective: Verify user accounts/backend data storage are not part of the app.
- Preconditions:
  - App is loaded.
- Steps:
  1. Review UI and behavior.
- Expected result:
  - No sign-in, account management, or backend data storage workflow is present.

---

## 14. Quality Expectations

### TC-057 Updates feel immediate
- Requirement reference: 14. Quality Expectations
- Objective: Verify UI responsiveness.
- Preconditions:
  - App is loaded.
- Steps:
  1. Change horse, goal, and symptoms.
- Expected result:
  - Updates feel immediate.
  - No manual refresh is required.

### TC-058 Build passes before merge
- Requirement reference: 14. Quality Expectations
- Objective: Verify build-gated quality expectation.
- Preconditions:
  - Repository and CI available.
- Steps:
  1. Review latest merged changes and associated build status.
- Expected result:
  - Build passes before changes are considered merge-ready.

### TC-059 Feed logic remains internally consistent
- Requirement reference: 14. Quality Expectations
- Objective: Verify no internal contradictions in visible feed logic.
- Preconditions:
  - App is loaded.
- Steps:
  1. Try multiple horse/goal/symptom combinations.
  2. Compare feed lines, total, and symptom explanations.
- Expected result:
  - Feed logic remains internally consistent.

### TC-060 Visible feed totals are understandable and useful
- Requirement reference: 14. Quality Expectations
- Objective: Verify displayed feed totals are clear to the user.
- Preconditions:
  - App is loaded.
- Steps:
  1. Review feed total and line items in several scenarios.
- Expected result:
  - Feed totals are easy to understand.
  - The displayed total aligns closely with the stated forage target.

### TC-061 Wording stays simple and barn-friendly
- Requirement reference: 14. Quality Expectations
- Objective: Verify copy tone.
- Preconditions:
  - App is loaded.
- Steps:
  1. Review labels, guidance, and explanations.
- Expected result:
  - Wording is simple and barn-friendly.

---

## Suggested Execution Order
- Smoke tests first:
  - TC-004, TC-006, TC-010, TC-011, TC-014, TC-021, TC-039, TC-042, TC-049, TC-052
- Then detailed logic tests:
  - TC-016 through TC-038
- Then non-goal and quality checks:
  - TC-053 through TC-061

# Horse Feeding Instruction Helper Requirements

## 1. Purpose
Build and maintain a simple horse feeding helper website that can be used on desktop and mobile to review feeding guidance for a small set of known horses.

The site is a practical barn-facing tool, not a veterinary diagnostic system.

## 2. Target Users
- Horse owners or caretakers
- Barn users checking daily feeding guidance
- Users who need simple, readable feeding suggestions without technical setup

## 3. Supported Horses
The app must support exactly these horses unless changed later:
- Tenor
- Odinn
- Spoi
- Uffie

Each horse must have:
- fixed known body weight
- horse notes
- default goal
- default symptoms/constraints
- baseline plan
- base feed suggestions
- supplement groups

## 4. Main User Inputs
The app must let the user choose:
- horse
- goal
- symptoms / constraints

User input must directly drive the suggested feed and supplements shown in the Barn card. When the user changes the selected horse, goal, or symptoms / constraints, the suggested feed and supplement recommendations must change accordingly.

### 4.1 Goal options
- weight gain
- maintain
- weight loss

### 4.2 Symptom / constraint options
- poor teeth
- sensitive digestion
- not finishing feed
- PSSM
- Insulin Resistant

## 5. Core Behavior
### 5.1 Horse switching
When the selected horse changes, the app must reset:
- goal to that horse’s default goal
- symptoms to that horse’s default symptoms

### 5.2 Barn card updates
The Barn card must update immediately when the user changes:
- horse
- goal
- symptom checkboxes

## 6. Barn Card Sections
The Barn card must show:
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

## 7. Goal-Driven Feeding Logic
Changing the goal must change more than just the forage target number.

### 7.1 Starting forage target
The starting forage target must be calculated from body weight and goal.

Current baseline logic:
- lose = 1.5% body weight
- maintain = 1.8% body weight
- gain = 2.0% body weight

### 7.2 Feed section must follow the goal
When goal changes:
- the concrete Feed section must recalculate
- visible feed amounts must scale to the current forage target
- the amount of food shown in the Feed section must add up and match the Starting forage target
- the app must show the daily concrete feed total in the Feed section
- the Feed section must consolidate the same feed into one line instead of splitting equivalent names across multiple lines
- equivalent feed names must be treated as the same feed for totals and display

Examples of required consolidation:
- Soaked hay cubes and Timothy hay cubes must be treated as the same feed
- Beet pulp / beet cubes and soaked beet cubes must be treated as the same feed

The app must check the final feed numbers and make sure there are no conflicts, duplicate counting problems, or mismatches between the Feed section total and the Starting forage target.

The Feed section must not remain static when the goal changes.

### 7.3 Optional feed lines
The live feeding plan should prefer concrete daily amounts.
Placeholder-only optional lines should not be treated as part of the concrete daily feed total.

## 8. Symptom-Driven Feeding Logic
Symptom checkboxes must affect visible feeding output, not just summary text.

When a symptom is checked or unchecked, the feed suggestion must update immediately and continue to match the active symptom requirements.

When a symptom is checked, the Barn card must show the consequence in one or more of these:
- starting forage target
- feed amounts
- feed types
- supplement suggestions
- supplement amounts

When symptoms combine, the feed suggestion must reflect the combined requirements without conflicts. For example, if a horse has poor teeth and sensitive digestion, the feed suggestion should rely mainly on soaked hay cubes or other soaked easy-to-chew fiber sources as the main food source.

### 8.1 Sensitive digestion
When sensitive digestion is checked, the app must:
- suggest a digestion-support supplement
- include an amount
- show a related feed consequence, such as soaked fiber support or smaller/easier feed components

### 8.2 Poor teeth
When poor teeth is checked, the app should shift the plan toward:
- soaked or easier-to-chew forage
- mash-style or soaked fiber support
- concrete amounts where possible

### 8.3 PSSM
When PSSM is checked, the app should:
- reinforce low-starch / low-sugar feeding choices
- show any relevant supplement or review target in the supplements section

### 8.4 Insulin Resistant
When Insulin Resistant is checked, the app should:
- make the plan more conservative where appropriate
- reduce or limit richer bucket feed suggestions
- prefer low-sugar carrier options
- affect forage target or feed amounts if needed

### 8.5 Poor appetite
When poor appetite is checked, the app should:
- suggest smaller, more palatable support meals or carriers
- include concrete amounts where possible

## 9. Explainability
The Barn card must include a section named:
- `Symptom toggle section`

This section must explain what changed because of selected symptoms in plain language.

The Symptom toggle section must appear after the Summary section in the Barn card.

## 10. Mobile-Friendly Requirements
The site must be usable on mobile devices.

### 10.1 Layout
- the page must adapt to narrow screens
- the inputs and Barn card must stack vertically on smaller screens
- text must wrap cleanly
- cards must remain readable without horizontal scrolling

### 10.2 Controls
- form controls must be touch-friendly
- radio buttons and checkboxes must be easy to tap
- spacing must be adequate for mobile use

### 10.3 Viewport
The app must include mobile viewport settings so it renders correctly on phones.

## 11. Technical Requirements
- Use Next.js App Router
- Static-export compatible for GitHub Pages deployment
- Build must succeed with GitHub Pages workflow
- Repository should have one active Pages deployment workflow only

## 12. Deployment Requirements
The site must deploy through GitHub Pages using GitHub Actions.

Deployment output should be available at:
- `https://shuening.github.io/Horse-feed-calculator/`

## 13. Non-Goals
The app is not required to:
- diagnose illness
- replace veterinary advice
- support arbitrary horse creation by users
- store user accounts or backend data

## 14. Quality Expectations
- updates to horse, goal, and symptom selections must feel immediate
- build must pass before changes are merged
- displayed feed logic should remain internally consistent
- visible feed totals should match the stated forage target closely enough to be understandable and useful
- wording should stay simple and barn-friendly

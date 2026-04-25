# Horse-feed-calculator
# Horse Feeding Instruction Helper

A simple Next.js starter app for horse feeding guidance.

## Features

- Only 4 horses are available:
  - Tenor
  - Odinn
  - Spoi
  - Uffie
- Each horse has:
  - fixed known weight
  - default goal
  - default symptoms
  - baseline feeding notes
- Users can change:
  - feeding goal
  - symptom checkboxes
- Recommendations update dynamically on the page.

## Horse defaults

- Tenor
  - 700 lb
  - default goal: maintain
  - default symptoms: poor teeth, sensitive digestion, PSSM
- Odinn
  - 700 lb
  - default goal: maintain
  - default symptoms: none
- Spoi
  - 950 lb
  - default goal: lose
  - default symptoms: Insulin Resistant
- Uffie
  - 800 lb
  - default goal: maintain
  - default symptoms: none

## Run locally
bash
npm install
npm run dev
Open:

- http://localhost:3000

## Build
bash
npm run build
## Project structure
text
app/
  layout.tsx
  page.tsx
lib/
  horses.ts
  recommend.ts
package.json
tsconfig.json
next-env.d.ts
## Notes

This is a starter guidance tool only. It is not a diagnostic or veterinary tool.

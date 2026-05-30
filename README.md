# CareCompass — SDG 3 Health Triage Agent

An AI **triage agent** that reads a patient's symptoms, decides how urgent they
are, and routes them to the right level of care — from **Emergency** to
**Self-care**. Built for the SDG project brief with three role-based dashboards.

> **SDG 3 — Good Health & Well-being**, target **3.8** (access to quality
> essential health services). The agent reduces avoidable ER load and widens
> access to timely guidance.

---

## What makes it an *agent* (not a chatbot)

1. Patient enters symptoms (tap-to-select **and** free text).
2. The agent extracts symptoms from the free text, scores severity against the
   Kaggle-derived weights, and **decides** an urgency level.
3. **Hard safety override:** if red-flag symptoms appear (e.g. chest pain +
   breathlessness, stroke signs), urgency is forced to **Emergency** no matter
   the score. This rule is deterministic and never delegated to the LLM.
4. The result is **routed** into the Provider queue and logged for Admin metrics.

The triage *decision* is always deterministic (so it can't hallucinate a
diagnosis). An optional LLM only rephrases the explanation in friendlier words.

---

## The three dashboards (project requirement ✅)

| View | Route | Who | What |
|------|-------|-----|------|
| **User** | `/patient` | Patient | Enter symptoms → get urgency + next step + history |
| **Client** | `/provider` | Clinic/Provider | Referral queue auto-sorted by urgency; accept/close |
| **Admin** | `/admin` | Operator | Live metrics: volume, urgency mix, red-flag rate, top symptoms |

Switch roles from the top nav. Demo state is shared across all three via the
browser (localStorage), so one browser shows the whole loop.

---

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

No API keys required — it works fully on the deterministic engine.

### Optional: nicer explanations with a FREE Gemini key
The app needs **no paid API**. Your Claude.ai subscription is a chat product and
can't be used as a server-side API key. For optional natural-language polish,
get a free key from <https://aistudio.google.com/apikey> and add it:

```bash
cp .env.example .env.local
# then set GEMINI_API_KEY=your_free_key
```

If the key is missing or fails, the app silently falls back to built-in
explanations — the demo never breaks.

---

## Deploy to Vercel (project requirement ✅)

1. Push to GitHub (below).
2. Go to <https://vercel.com> → **New Project** → import your repo.
3. Framework preset auto-detects **Next.js**. No build config needed.
4. (Optional) add `GEMINI_API_KEY` under **Settings → Environment Variables**.
5. Deploy. Copy the live URL for your submission.

## Push to GitHub (project requirement ✅)

```bash
git init
git add .
git commit -m "CareCompass: SDG 3 triage agent"
git branch -M main
git remote add origin https://github.com/<you>/carecompass.git
git push -u origin main
```

---

## Data hosting on Kaggle (project requirement ✅)

The triage knowledge in `data/triage-data.js` is **derived from** the Kaggle
*Disease Symptom Prediction* dataset (itachi9604):
<https://www.kaggle.com/datasets/itachi9604/disease-symptom-description-dataset>

The canonical data lives on Kaggle. To regenerate weights from the real CSVs:

```bash
# download the dataset, put CSVs in ./kaggle/, then:
npm run build:data
```

Also recommended: upload your processed `triage-data.js` (or its source CSVs) as
a **Kaggle Dataset** under your account and link it here, so "data hosted on
Kaggle" is literally true for your submission.

---

## Tech stack & the brief's tooling

- **Next.js 14 (App Router) + Tailwind** → deployed on **Vercel**.
- **Agent endpoint:** `app/api/triage/route.js`.
- **LM Arena:** use the leaderboard at <https://lmarena.ai> to *justify your
  model choice* (e.g. Gemini Flash), then call that model via its real API.
  LM Arena is an evaluation platform, not a drop-in app API — cite it as your
  model-selection method in your report.

---

## Two things to confirm with your instructor

- **"Vision 2030 / Vision 2035":** ambiguous (Saudi Vision 2030? UN Agenda 2030?
  a national plan?). Confirm which document so your alignment section maps to it.
- **"Use LM Arena for your APIs":** clarify whether they mean model *selection*
  (recommended above) or expect a specific API access they'll provide.

---

## Live demo script (for Loom)

1. **Patient** → type *"chest pain and shortness of breath"* → **Emergency**
   with the red-flag override.
2. **Provider** → the case sits at the top of the queue → click **Accept**.
3. **Admin** → totals, red-flag rate, and urgency chart update live.

That single flow shows all three dashboards and the headline safety feature.

---

## Roadmap (talking points for grading)

- Swap localStorage → **Supabase** for real auth + multi-user persistence.
- Add clinician feedback loop to track triage accuracy in Admin.
- Localize symptom labels (e.g. Urdu) for wider access.

> ⚠️ **Decision-support only — not a medical diagnosis.**

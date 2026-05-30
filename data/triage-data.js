// ---------------------------------------------------------------------------
// CareCompass triage knowledge base
//
// DATA LINEAGE (SDG 3 requirement: data hosted on Kaggle):
// This file is DERIVED from the Kaggle "Disease Symptom Prediction" dataset by
// itachi9604 (Symptom-severity.csv, symptom_Description.csv,
// symptom_precaution.csv):
//   https://www.kaggle.com/datasets/itachi9604/disease-symptom-description-dataset
//
// The canonical data lives on Kaggle. `scripts/build-data-from-kaggle.mjs`
// regenerates this file from the downloaded CSVs so the lineage stays real.
// The starter values below are a curated subset for a working demo.
// ---------------------------------------------------------------------------

// Symptom catalogue shown in the picker. `weight` (1-7) mirrors the Kaggle
// Symptom-severity scale; higher = more clinically significant.
export const SYMPTOMS = [
  { id: "chest_pain", label: "Chest pain", weight: 7 },
  { id: "breathlessness", label: "Shortness of breath", weight: 7 },
  { id: "slurred_speech", label: "Slurred speech", weight: 7 },
  { id: "weakness_one_side", label: "Weakness on one side of body", weight: 7 },
  { id: "loss_of_consciousness", label: "Fainting / loss of consciousness", weight: 7 },
  { id: "severe_bleeding", label: "Severe / uncontrolled bleeding", weight: 7 },
  { id: "blue_lips", label: "Blue lips or face", weight: 7 },
  { id: "high_fever", label: "High fever (>39°C)", weight: 5 },
  { id: "stiff_neck", label: "Stiff neck with fever", weight: 6 },
  { id: "severe_abdominal_pain", label: "Severe abdominal pain", weight: 6 },
  { id: "persistent_vomiting", label: "Persistent vomiting", weight: 5 },
  { id: "dehydration", label: "Signs of dehydration", weight: 5 },
  { id: "blood_in_stool", label: "Blood in stool", weight: 6 },
  { id: "blurred_vision", label: "Sudden blurred vision", weight: 5 },
  { id: "palpitations", label: "Heart palpitations", weight: 5 },
  { id: "dizziness", label: "Dizziness", weight: 4 },
  { id: "mild_fever", label: "Mild fever", weight: 3 },
  { id: "cough", label: "Cough", weight: 3 },
  { id: "sore_throat", label: "Sore throat", weight: 2 },
  { id: "runny_nose", label: "Runny / blocked nose", weight: 2 },
  { id: "headache", label: "Headache", weight: 3 },
  { id: "fatigue", label: "Fatigue / tiredness", weight: 2 },
  { id: "body_ache", label: "Body aches", weight: 2 },
  { id: "nausea", label: "Nausea", weight: 3 },
  { id: "diarrhoea", label: "Diarrhoea", weight: 3 },
  { id: "rash", label: "Skin rash", weight: 3 },
  { id: "joint_pain", label: "Joint pain", weight: 3 },
  { id: "back_pain", label: "Back pain", weight: 3 },
  { id: "ear_pain", label: "Ear pain", weight: 2 },
  { id: "sneezing", label: "Sneezing", weight: 1 },
  { id: "itching", label: "Itching", weight: 1 },
  { id: "loss_of_appetite", label: "Loss of appetite", weight: 2 },
];

// Free-text keyword map so the agent can extract symptoms from a typed
// description (a lightweight stand-in for NLP; works with zero API keys).
export const SYNONYMS = {
  chest_pain: ["chest pain", "chest tight", "pressure in chest", "chest hurts"],
  breathlessness: ["short of breath", "can't breathe", "cant breathe", "breathless", "trouble breathing", "shortness of breath"],
  slurred_speech: ["slurred speech", "can't speak", "speech problem", "words slurred"],
  weakness_one_side: ["one side", "face droop", "arm weak", "numb on one side"],
  loss_of_consciousness: ["fainted", "passed out", "unconscious", "blacked out"],
  severe_bleeding: ["bleeding a lot", "heavy bleeding", "won't stop bleeding", "lot of blood"],
  blue_lips: ["blue lips", "lips blue", "turning blue"],
  high_fever: ["high fever", "very high temperature", "fever 40", "burning up"],
  stiff_neck: ["stiff neck", "neck stiff", "can't bend neck"],
  severe_abdominal_pain: ["severe stomach pain", "bad belly pain", "intense abdominal"],
  persistent_vomiting: ["keep vomiting", "can't stop vomiting", "vomiting repeatedly"],
  dehydration: ["dehydrated", "no urine", "very thirsty", "dry mouth"],
  blood_in_stool: ["blood in stool", "bloody stool", "blood when poop"],
  blurred_vision: ["blurred vision", "blurry vision", "can't see clearly"],
  palpitations: ["palpitations", "racing heart", "heart pounding", "heart racing"],
  dizziness: ["dizzy", "lightheaded", "spinning"],
  mild_fever: ["mild fever", "slight fever", "low fever", "feverish"],
  cough: ["cough", "coughing"],
  sore_throat: ["sore throat", "throat hurts", "scratchy throat"],
  runny_nose: ["runny nose", "blocked nose", "stuffy nose", "congestion"],
  headache: ["headache", "head hurts", "head pain"],
  fatigue: ["tired", "fatigue", "exhausted", "no energy"],
  body_ache: ["body ache", "body pain", "aching"],
  nausea: ["nausea", "feel sick", "queasy"],
  diarrhoea: ["diarrhoea", "diarrhea", "loose motion", "loose stool"],
  rash: ["rash", "skin spots", "hives"],
  joint_pain: ["joint pain", "joints hurt", "knee pain"],
  back_pain: ["back pain", "backache", "lower back"],
  ear_pain: ["ear pain", "earache", "ear hurts"],
  sneezing: ["sneezing", "sneeze"],
  itching: ["itching", "itchy"],
  loss_of_appetite: ["no appetite", "not hungry", "loss of appetite"],
};

// RED FLAGS: presence of any of these patterns FORCES an Emergency result,
// regardless of the score. This is the agent's hard safety override.
// A pattern is a list of symptom ids; ALL ids in a pattern must be present.
export const RED_FLAGS = [
  { pattern: ["chest_pain", "breathlessness"], reason: "Chest pain with breathing difficulty can indicate a cardiac event." },
  { pattern: ["chest_pain", "palpitations"], reason: "Chest pain with palpitations needs urgent cardiac assessment." },
  { pattern: ["slurred_speech"], reason: "Sudden speech difficulty is a possible stroke sign (FAST)." },
  { pattern: ["weakness_one_side"], reason: "One-sided weakness is a possible stroke sign (FAST)." },
  { pattern: ["loss_of_consciousness"], reason: "Loss of consciousness requires immediate evaluation." },
  { pattern: ["severe_bleeding"], reason: "Uncontrolled bleeding is a medical emergency." },
  { pattern: ["blue_lips"], reason: "Blue lips suggest dangerously low oxygen." },
  { pattern: ["high_fever", "stiff_neck"], reason: "Fever with a stiff neck can indicate meningitis." },
];

// Non-diagnostic condition profiles used only to suggest "areas to mention to
// a clinician". Derived from the Kaggle disease↔symptom mapping. NEVER shown
// as a diagnosis.
export const CONDITION_PROFILES = [
  { name: "Common cold", symptoms: ["runny_nose", "sneezing", "sore_throat", "cough", "mild_fever"] },
  { name: "Influenza (flu)", symptoms: ["high_fever", "body_ache", "fatigue", "cough", "headache"] },
  { name: "Gastroenteritis", symptoms: ["diarrhoea", "nausea", "persistent_vomiting", "severe_abdominal_pain", "dehydration"] },
  { name: "Migraine", symptoms: ["headache", "nausea", "blurred_vision"] },
  { name: "Allergic reaction", symptoms: ["rash", "itching", "sneezing", "runny_nose"] },
  { name: "Possible cardiac event", symptoms: ["chest_pain", "breathlessness", "palpitations"] },
  { name: "Possible stroke", symptoms: ["slurred_speech", "weakness_one_side", "blurred_vision"] },
];

// Care pathway copy keyed by urgency level.
export const PATHWAYS = {
  emergency: {
    title: "Emergency — seek care now",
    action: "Call your local emergency number or go to the nearest emergency department immediately. Do not drive yourself if you feel faint.",
  },
  urgent: {
    title: "Urgent — see a doctor within 24 hours",
    action: "Book a same-day appointment or visit an urgent-care clinic. Monitor closely and escalate if symptoms worsen.",
  },
  routine: {
    title: "Routine — book a regular appointment",
    action: "Schedule a standard appointment with your doctor in the next few days. Keep track of how your symptoms change.",
  },
  selfcare: {
    title: "Self-care — monitor at home",
    action: "Rest, stay hydrated, and use over-the-counter relief as appropriate. Seek care if symptoms persist beyond a few days or get worse.",
  },
};

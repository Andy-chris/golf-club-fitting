import { Step } from "./types";

export const STEPS: Step[] = [
  { id: 1, name: "club-type", label: "Club Type" },
  { id: 2, name: "profile", label: "Your Profile" },
  { id: 3, name: "swing-analysis", label: "Swing Analysis" },
  { id: 4, name: "recommendations", label: "Recommendations" },
  { id: 5, name: "best-deals", label: "Best Deals" }
];

export const HANDICAP_OPTIONS = [
  { value: "beginner", label: "Beginner (30+)" },
  { value: "high", label: "High (20-29)" },
  { value: "mid", label: "Mid (10-19)" },
  { value: "low", label: "Low (0-9)" },
  { value: "scratch", label: "Scratch or Better" }
];

export const BALL_FLIGHT_OPTIONS = [
  { value: "draw", label: "Draw (right to left)" },
  { value: "fade", label: "Fade (left to right)" },
  { value: "straight", label: "Straight" },
  { value: "hook", label: "Hook" },
  { value: "slice", label: "Slice" },
  { value: "unsure", label: "Not sure" }
];

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not", label: "Prefer not to say" }
];

export const PRIORITY_OPTIONS = [
  { value: "distance", label: "Maximum Distance" },
  { value: "accuracy", label: "Accuracy / Forgiveness" },
  { value: "feel", label: "Feel / Feedback" },
  { value: "versatility", label: "Versatility" },
  { value: "value", label: "Value for Money" }
];

export const HEIGHT_FEET_OPTIONS = [
  { value: 4, label: "4'" },
  { value: 5, label: "5'" },
  { value: 6, label: "6'" },
  { value: 7, label: "7'" }
];

export const HEIGHT_INCHES_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: i,
  label: `${i}"`
}));

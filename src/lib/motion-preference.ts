export type MotionPreference = "full" | "reduced";
// Retained for migration checks; startup leaves this legacy value untouched.
export const MOTION_STORAGE_KEY = "little-sunshine:motion:v1";
export const MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";

// Every visit starts animated, as requested. Previous stored choices are left
// untouched; the visitor can choose reduced/system motion for this visit.
export const motionPreferenceScript = `document.documentElement.dataset.motionPreference="full";`;

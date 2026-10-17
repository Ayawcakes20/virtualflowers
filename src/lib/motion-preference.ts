export type MotionPreference = "full" | "reduced";
export const MOTION_STORAGE_KEY = "little-sunshine:motion:v1";

// Runs in <head> before the first paint. Only a validated preference is used;
// no stored text is inserted into the document or executable code.
export const motionPreferenceScript = `(()=>{
  let saved;
  try { saved=localStorage.getItem(${JSON.stringify(MOTION_STORAGE_KEY)}); } catch {}
  const reduced=typeof matchMedia==="function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.dataset.motionPreference=saved==="full"||saved==="reduced"?saved:reduced?"reduced":"full";
})();`;

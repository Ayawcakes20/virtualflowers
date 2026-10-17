"use client";

import { useSyncExternalStore } from "react";
import { MOTION_STORAGE_KEY, type MotionPreference } from "@/lib/motion-preference";

const preferenceChanged = "sunshine:motion-change";
// A blocked/quota-limited store must not prevent the current-page toggle working.
let sessionOnlyChoice: MotionPreference | null = null;

function getSnapshot(): MotionPreference {
  if (sessionOnlyChoice) return sessionOnlyChoice;
  try {
    const saved = window.localStorage.getItem(MOTION_STORAGE_KEY);
    if (saved === "full" || saved === "reduced") return saved;
  } catch { /* Use the system preference when storage cannot be read. */ }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "full";
}

const getServerSnapshot = () => null;

function subscribe(notify: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const update = () => {
    document.documentElement.dataset.motionPreference = getSnapshot();
    notify();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === MOTION_STORAGE_KEY || event.key === null) update();
  };
  media.addEventListener("change", update);
  window.addEventListener("storage", onStorage);
  window.addEventListener(preferenceChanged, update);
  update();
  return () => {
    media.removeEventListener("change", update);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(preferenceChanged, update);
  };
}

function setReduced(reduced: boolean) {
  const choice: MotionPreference = reduced ? "reduced" : "full";
  try {
    window.localStorage.setItem(MOTION_STORAGE_KEY, choice);
    sessionOnlyChoice = null;
  } catch { sessionOnlyChoice = choice; }
  document.documentElement.dataset.motionPreference = choice;
  window.dispatchEvent(new Event(preferenceChanged));
}

export function useMotionPreference() {
  // null matches SSR during hydration; the head script already supplies the
  // correct CSS state and label. React then subscribes to the same preference.
  const preference = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { ready: preference !== null, reduced: preference !== "full", setReduced };
}

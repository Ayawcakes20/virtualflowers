"use client";

import { useSyncExternalStore } from "react";
import { MOTION_MEDIA_QUERY, type MotionPreference } from "@/lib/motion-preference";

const preferenceChanged = "sunshine:motion-change";
// This is browser-session state only. A new document starts with full motion.
let sessionChoice: MotionPreference | "system" | "default" = "default";
type MotionSnapshot = `${"manual" | "system" | "default"}:${MotionPreference}`;

function getSnapshot(): MotionSnapshot {
  if (sessionChoice === "default") return "default:full";
  if (sessionChoice !== "system") return `manual:${sessionChoice}`;
  return window.matchMedia(MOTION_MEDIA_QUERY).matches ? "system:reduced" : "system:full";
}

function syncDocument() {
  document.documentElement.dataset.motionPreference = getSnapshot().endsWith(":reduced") ? "reduced" : "full";
}

const getServerSnapshot = () => null;

function subscribe(notify: () => void) {
  const media = window.matchMedia(MOTION_MEDIA_QUERY);
  const update = () => {
    syncDocument();
    notify();
  };
  const onPageShow = (event: PageTransitionEvent) => {
    if (event.persisted) {
      sessionChoice = "default";
      update();
    }
  };
  media.addEventListener("change", update);
  window.addEventListener("pageshow", onPageShow);
  window.addEventListener(preferenceChanged, update);
  update();
  return () => {
    media.removeEventListener("change", update);
    window.removeEventListener("pageshow", onPageShow);
    window.removeEventListener(preferenceChanged, update);
  };
}

function setReduced(reduced: boolean) {
  sessionChoice = reduced ? "reduced" : "full";
  syncDocument();
  window.dispatchEvent(new Event(preferenceChanged));
}

function resetToSystem() {
  sessionChoice = "system";
  syncDocument();
  window.dispatchEvent(new Event(preferenceChanged));
}

export function useMotionPreference() {
  // null matches SSR during hydration; the head script already supplies the
  // correct CSS state and label. React then subscribes to the same preference.
  const preference = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    ready: preference !== null,
    reduced: preference?.endsWith(":reduced") ?? false,
    manual: preference?.startsWith("manual:") ?? false,
    system: preference?.startsWith("system:") ?? false,
    setReduced,
    resetToSystem,
  };
}

"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import type { IntroClip, IntroVideoSources } from "@/domain/intro";

export type IntroVideoState =
  | { readonly status: "checking" }
  | { readonly status: "available"; readonly clip: IntroClip }
  | { readonly status: "unavailable" };

export interface IntroVideo {
  readonly state: IntroVideoState;
  /** Called by the player when the clip cannot be loaded or played: the code envelope takes over. */
  readonly markUnavailable: () => void;
}

/** What the viewport tells us; `null` on the server, where nothing is known yet. */
type Viewport = "portrait" | "landscape" | "reduced-motion" | null;

const PORTRAIT = "(orientation: portrait)";
const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const queries = [window.matchMedia(PORTRAIT), window.matchMedia(REDUCED)];
  queries.forEach((q) => q.addEventListener("change", onChange));
  return () => queries.forEach((q) => q.removeEventListener("change", onChange));
}

function readViewport(): Viewport {
  if (window.matchMedia(REDUCED).matches) return "reduced-motion";
  return window.matchMedia(PORTRAIT).matches ? "portrait" : "landscape";
}

const serverViewport = (): Viewport => null;

/**
 * Picks the portrait or landscape clip for the current viewport. No network pre-check is made
 * (in-app browsers answer those inconsistently): the `<video>` element is the source of truth,
 * and on a load error the player calls `markUnavailable` so the code-animated envelope is shown.
 * A reduced-motion preference skips the clip altogether.
 */
export function useIntroVideo(sources: IntroVideoSources): IntroVideo {
  const viewport = useSyncExternalStore(subscribe, readViewport, serverViewport);
  const [failed, setFailed] = useState(false);
  const markUnavailable = useCallback(() => setFailed(true), []);

  const state: IntroVideoState =
    viewport === null
      ? { status: "checking" }
      : failed || viewport === "reduced-motion"
        ? { status: "unavailable" }
        : {
            status: "available",
            clip: viewport === "portrait" ? sources.portrait : sources.landscape,
          };

  return { state, markUnavailable };
}

"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CoverMarksMode } from "./cover-marks";

export type Entrance = Exclude<CoverMarksMode, "static">;

const EntranceContext = createContext<Entrance>("fade");

/**
 * How the page's cover marks arrive, decided by the opening experience: gliding from the video
 * card ("shared") or fading in after the code envelope ("fade"). Pages rendered without an intro
 * (the backoffice preview) get the default fade.
 */
export function EntranceProvider({
  entrance,
  children,
}: {
  readonly entrance: Entrance;
  readonly children: ReactNode;
}) {
  return (
    <EntranceContext.Provider value={entrance}>
      {children}
    </EntranceContext.Provider>
  );
}

export function useEntrance(): Entrance {
  return useContext(EntranceContext);
}

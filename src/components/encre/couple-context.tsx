"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { CoupleIdentity } from "@/domain/couple";

const CoupleContext = createContext<CoupleIdentity | null>(null);

/** Makes the couple available to every Encre & Poudre component below (monogram, cover marks). */
export function CoupleProvider({
  couple,
  children,
}: {
  readonly couple: CoupleIdentity;
  readonly children: ReactNode;
}) {
  return (
    <CoupleContext.Provider value={couple}>{children}</CoupleContext.Provider>
  );
}

export function useCouple(): CoupleIdentity {
  const couple = useContext(CoupleContext);
  if (!couple)
    throw new Error("useCouple must be used inside a <CoupleProvider>.");
  return couple;
}

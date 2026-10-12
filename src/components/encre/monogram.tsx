"use client";

import type { CSSProperties } from "react";
import { useCouple } from "./couple-context";

interface MonogramProps {
  /** Letter size in px; the ampersand and ring scale from it. */
  readonly size: number;
  readonly color?: string;
  readonly ring?: boolean;
}

/** "L & W": script initials with a small light sans ampersand in between. */
export function Monogram({
  size,
  color = "currentColor",
  ring = false,
}: MonogramProps) {
  const { left, right } = useCouple().monogram;
  const row: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: Math.round(size * 0.18),
    color,
    lineHeight: 1,
  };
  const letter: CSSProperties = {
    fontFamily: "var(--encre-font-script)",
    fontSize: size,
  };
  const amp: CSSProperties = {
    fontFamily: "var(--encre-font-sans)",
    fontWeight: 300,
    fontSize: Math.round(size * 0.4),
    paddingTop: Math.round(size * 0.06),
  };
  const content = (
    <span style={row} aria-label={`${left} and ${right}`}>
      <span style={letter}>{left}</span>
      <span style={amp} aria-hidden>
        &amp;
      </span>
      <span style={letter}>{right}</span>
    </span>
  );
  if (!ring) return content;
  const d = Math.round(size * 2.3);
  return (
    <span
      style={{
        width: d,
        height: d,
        borderRadius: "50%",
        border: `1px solid ${color}`,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: Math.round(size * 0.12),
      }}
    >
      {content}
    </span>
  );
}

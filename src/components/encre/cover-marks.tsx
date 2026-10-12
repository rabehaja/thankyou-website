"use client";

import { motion, type Transition } from "framer-motion";
import { useCouple } from "./couple-context";
import { Monogram } from "./monogram";

/**
 * The five marks shared between the intro card and the page cover: monogram, both first names,
 * the ampersand and the date. The same `layoutId`s on both sides let Framer Motion glide each
 * mark from where it sits on the video card to where it lives on the page.
 */
export const COVER_IDS = {
  monogram: "cover-monogram",
  groom: "cover-groom",
  amp: "cover-amp",
  bride: "cover-bride",
  date: "cover-date",
} as const;

export const COVER_TRANSITION: Transition = {
  type: "tween",
  duration: 0.9,
  ease: [0.22, 1, 0.36, 1],
};

export type CoverMarksMode = "shared" | "fade" | "static";

interface CoverMarksProps {
  /** CSS module classes for each mark, so the card and the page keep their own sizes. */
  readonly classes: {
    readonly monogram?: string | undefined;
    readonly name: string | undefined;
    readonly amp: string | undefined;
    readonly date: string | undefined;
  };
  readonly monogramSize: number;
  /**
   * "shared": the marks carry layoutIds and glide from the previous holder (the video card).
   * "fade": they simply fade in. "static": rendered as-is (used inside the code envelope's card).
   */
  readonly mode: CoverMarksMode;
}

const FADE = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.7, delay: 0.75, ease: "easeOut" },
} as const;

export function CoverMarks({ classes, monogramSize, mode }: CoverMarksProps) {
  const couple = useCouple();
  const motionProps = (id: string) =>
    mode === "shared"
      ? { layoutId: id, transition: COVER_TRANSITION }
      : mode === "fade"
        ? FADE
        : {};
  return (
    <>
      <motion.div
        {...motionProps(COVER_IDS.monogram)}
        className={classes.monogram}
      >
        <Monogram size={monogramSize} ring />
      </motion.div>
      <motion.div {...motionProps(COVER_IDS.groom)} className={classes.name}>
        {couple.groom}
      </motion.div>
      <motion.div {...motionProps(COVER_IDS.amp)} className={classes.amp}>
        &amp;
      </motion.div>
      <motion.div {...motionProps(COVER_IDS.bride)} className={classes.name}>
        {couple.bride}
      </motion.div>
      {couple.date.long ? (
        <motion.div {...motionProps(COVER_IDS.date)} className={classes.date}>
          {couple.date.long}
        </motion.div>
      ) : null}
    </>
  );
}

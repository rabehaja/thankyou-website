"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { CoverMarks } from "@/components/encre/cover-marks";
import { WaxSeal } from "./wax-seal";
import styles from "./envelope.module.css";

export type EnvelopePhase = "closed" | "opening";

interface EnvelopeProps {
  readonly phase: EnvelopePhase;
  readonly onOpen: () => void;
  /** Called when the opening choreography has finished and the page can take over. */
  readonly onOpened: () => void;
}

/**
 * Opening timeline (seconds after the click):
 *   0.00  seal cracks, camera starts pushing in on the seal
 *   0.25  flap lifts in 3D
 *   1.00  card rises out of the pocket (confetti fires here, see OpeningExperience)
 *   1.90  card grows to fill the screen while the envelope dims
 *   2.80  scene fades, page takes over
 */
export const OPENING = {
  seal: 0,
  flap: 0.25,
  card: 1.0,
  grow: 1.8,
  end: 2.5,
} as const;

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export function Envelope({ phase, onOpen, onOpened }: EnvelopeProps) {
  const reduce = useReducedMotion();
  const opening = phase === "opening";
  const d = (seconds: number): number => (reduce ? 0 : seconds);

  // Stacking order cannot be tweened by the animation library, so it is switched by timers:
  // the flap stays in front until it passes vertical; the card moves in front once it has risen.
  const [flapBehind, setFlapBehind] = useState(false);
  const [cardInFront, setCardInFront] = useState(false);
  useEffect(() => {
    if (!opening) return;
    const t1 = window.setTimeout(
      () => setFlapBehind(true),
      d(OPENING.flap + 0.55) * 1000,
    );
    const t2 = window.setTimeout(
      () => setCardInFront(true),
      d(OPENING.grow) * 1000,
    );
    // End of the choreography: the page mounts and this scene exits (fade) via AnimatePresence.
    const t3 = window.setTimeout(onOpened, d(OPENING.end) * 1000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opening]);

  return (
    <motion.div
      className={styles.scene}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: d(0.9), ease: "easeInOut" } }}
    >
      {/* Camera: a push-in centred on the seal while the envelope opens. */}
      <motion.div
        className={styles.camera}
        style={{ transformOrigin: "50% 56%" }}
        animate={
          opening
            ? { scale: [1, 1.25, 1.25], y: ["0%", "0%", "108%"] }
            : { scale: 1, y: "0%" }
        }
        transition={
          opening
            ? {
                duration: d(OPENING.end),
                times: [0, 0.36, 0.72],
                ease: [EASE_IN_OUT, EASE_IN_OUT],
              }
            : { duration: d(0.6) }
        }
      >
        <motion.div
          className={styles.envelope}
          initial={{ y: 40, opacity: 0, rotateX: 10 }}
          animate={
            opening
              ? { y: 0, opacity: 1, rotateX: 18 }
              : { y: [0, -6, 0], opacity: 1, rotateX: 0 }
          }
          transition={
            opening
              ? { duration: d(1.4), ease: EASE_IN_OUT }
              : {
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 1 },
                  rotateX: { duration: 1 },
                }
          }
        >
          <div className={styles.pocket} />

          {/* The card: it rises out, then grows until it fills the viewport. */}
          <motion.div
            className={styles.card}
            style={{ zIndex: cardInFront ? 6 : 0 }}
            animate={
              opening
                ? {
                    y: ["0%", "-112%", "-112%"],
                    scale: [1, 1, 1.12],
                    z: [0, 6, 6],
                  }
                : { y: "0%", scale: 1, z: 0 }
            }
            transition={
              opening
                ? {
                    duration: d(OPENING.end - OPENING.card),
                    delay: d(OPENING.card),
                    times: [0, 0.5, 1],
                    ease: [EASE_OUT, EASE_IN_OUT],
                  }
                : { duration: 0 }
            }
          >
            <span className={styles.cardEyebrow}>Thank you</span>
            <CoverMarks
              mode="static"
              monogramSize={28}
              classes={{
                name: styles.cardName,
                amp: styles.cardEt,
                date: styles.cardDate,
              }}
            />
          </motion.div>

          <div className={styles.sidesLeft} />
          <div className={styles.sidesRight} />
          <div className={styles.bottom} />

          {/* Flap: rotates around the top edge; front face and back face are separate layers. */}
          <motion.div
            className={styles.flapWrap}
            style={{ zIndex: flapBehind ? 0 : 3 }}
            animate={{ rotateX: opening ? 183 : 0 }}
            transition={{
              delay: d(OPENING.flap),
              duration: d(1.1),
              ease: EASE_IN_OUT,
            }}
          >
            <div className={styles.flapFace} />
            <svg
              className={styles.flapLine}
              viewBox="0 0 300 200"
              preserveAspectRatio="none"
              aria-hidden
            >
              <polyline
                points="18,14 150,98 282,14"
                fill="none"
                stroke="rgba(31,42,68,0.35)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <polyline
                points="18,22 150,106 282,22"
                fill="none"
                stroke="rgba(31,42,68,0.2)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div className={styles.flapBack} />
          </motion.div>

          <div className={styles.grain} />
          <WaxSeal onOpen={onOpen} broken={opening} />
        </motion.div>
      </motion.div>

      <motion.p
        className={styles.hint}
        initial={{ opacity: 0 }}
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ delay: opening ? 0 : 1.2, duration: 0.8 }}
      >
        Tap the seal to open
      </motion.p>
    </motion.div>
  );
}

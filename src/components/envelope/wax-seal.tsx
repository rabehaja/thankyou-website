"use client";

import { motion } from "framer-motion";
import { Monogram } from "@/components/encre/monogram";
import styles from "./envelope.module.css";

interface WaxSealProps {
  readonly onOpen: () => void;
  readonly broken: boolean;
}

/** Irregular wax blob drawn as SVG so the edge does not look like a perfect circle. */
const WAX_PATH =
  "M50 3c9 0 14 4 22 6 8 2 15 4 19 12 4 8 1 16 3 24 2 8 4 16-1 24-5 8-13 11-20 16-7 5-13 12-23 12S32 91 25 86c-7-5-15-8-19-16-4-8 0-16 1-24 1-8-2-16 2-24 4-8 12-9 19-12S41 3 50 3z";

export function WaxSeal({ onOpen, broken }: WaxSealProps) {
  return (
    <span className={styles.sealAnchor}>
      <motion.button
        type="button"
        className={styles.seal}
        onClick={onOpen}
        disabled={broken}
        aria-label="Open the card"
        whileHover={broken ? {} : { scale: 1.05, rotate: -2 }}
        whileTap={broken ? {} : { scale: 0.94 }}
        animate={
          broken
            ? {
                scale: [1, 1.18, 1.1, 0.2],
                rotate: [0, -6, 8, 30],
                opacity: [1, 1, 1, 0],
              }
            : { scale: 1, rotate: 0, opacity: 1 }
        }
        transition={
          broken
            ? { duration: 0.6, times: [0, 0.35, 0.5, 1], ease: "easeIn" }
            : { type: "spring", stiffness: 300, damping: 18 }
        }
      >
        <svg className={styles.sealSvg} viewBox="0 0 100 100" aria-hidden>
          <defs>
            <radialGradient id="wax" cx="38%" cy="32%" r="70%">
              <stop offset="0%" stopColor="var(--wax-light)" />
              <stop offset="55%" stopColor="var(--wax)" />
              <stop offset="100%" stopColor="var(--wax-dark)" />
            </radialGradient>
          </defs>
          <path d={WAX_PATH} fill="url(#wax)" />
          <path
            d={WAX_PATH}
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1.5"
            transform="translate(-1 -1)"
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="rgba(0,0,0,0.22)"
            strokeWidth="1.2"
          />
          <circle
            cx="50"
            cy="50"
            r="27"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.8"
          />
        </svg>
        <span className={styles.sealMonogram}>
          <Monogram size={28} />
        </span>
        {/* a slow light sweep so the wax looks glossy while the envelope idles */}
        <motion.span
          className={styles.sheen}
          aria-hidden
          animate={{ x: ["-120%", "120%"] }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            repeatDelay: 2.4,
            ease: "easeInOut",
          }}
        />
      </motion.button>
    </span>
  );
}

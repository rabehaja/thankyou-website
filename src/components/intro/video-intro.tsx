"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { CoverMarks } from "@/components/encre/cover-marks";
import {
  CARD_TRACK,
  INTRO_CONFETTI_AT,
  SEAL_SPOT,
  cardTextOpacityAt,
  cardTopAt,
} from "@/domain/intro";
import type { IntroClip } from "@/domain/intro";
import { squareRect } from "./square-rect";
import styles from "./intro.module.css";

interface VideoIntroProps {
  readonly clip: IntroClip;
  /** Fired once, when the card appears in the clip (confetti hook). */
  readonly onReveal: () => void;
  /** Fired when the clip ends or when playback stops midway. */
  readonly onDone: () => void;
  /** Fired when the clip cannot be loaded before it was started: the caller shows another intro. */
  readonly onFail: () => void;
}

type State = "poster" | "playing";

/**
 * Plays the pre-rendered envelope clip and draws the monogram, names and date onto the card
 * as it rises, following the card's measured trajectory. When the clip ends the page mounts
 * immediately: the marks glide to their place on the cover (shared layoutIds) while this
 * scene fades out underneath.
 */
export function VideoIntro({
  clip,
  onReveal,
  onDone,
  onFail,
}: VideoIntroProps) {
  const video = useRef<HTMLVideoElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const seal = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState<State>("poster");
  const revealed = useRef(false);

  // Keep the tap target centred on the wax seal of the poster frame, whatever the viewport.
  useEffect(() => {
    if (state !== "poster") return;
    const place = (): void => {
      const el = video.current;
      const btn = seal.current;
      if (!el || !btn) return;
      // Before metadata arrives (in-app browsers may not preload), assume the clip matches
      // the viewport orientation, which is how it was chosen.
      const upright = el.clientHeight >= el.clientWidth;
      const vw = el.videoWidth || (upright ? 1080 : 1920);
      const vh = el.videoHeight || (upright ? 1920 : 1080);
      const sq = squareRect(vw, vh, el.clientWidth, el.clientHeight);
      const d = SEAL_SPOT.r * 2 * sq.size;
      btn.style.left = `${sq.left + SEAL_SPOT.cx * sq.size - d / 2}px`;
      btn.style.top = `${sq.top + SEAL_SPOT.cy * sq.size - d / 2}px`;
      btn.style.width = `${d}px`;
      btn.style.height = `${d}px`;
    };
    place();
    const el = video.current;
    el?.addEventListener("loadedmetadata", place);
    window.addEventListener("resize", place);
    return () => {
      el?.removeEventListener("loadedmetadata", place);
      window.removeEventListener("resize", place);
    };
  }, [state]);

  const play = useCallback(() => {
    const el = video.current;
    if (!el) return;
    setState("playing");
    el.play().catch(onDone);
  }, [onDone]);

  // A clip that cannot load before the tap (missing file, unsupported codec) hands over to the
  // code envelope; a failure while playing simply ends the intro.
  const fail = useCallback(
    () => (state === "poster" ? onFail() : onDone()),
    [state, onFail, onDone],
  );

  // Follow the card: position the overlay every frame from the clip's current time.
  useEffect(() => {
    if (state !== "playing") return;
    let raf = 0;
    const tick = (): void => {
      const el = video.current;
      const box = overlay.current;
      if (el && box && el.videoWidth > 0) {
        const t = el.currentTime;
        const sq = squareRect(
          el.videoWidth,
          el.videoHeight,
          el.clientWidth,
          el.clientHeight,
        );
        const width = CARD_TRACK.width * sq.size;
        box.style.left = `${sq.left + CARD_TRACK.left * sq.size}px`;
        box.style.top = `${sq.top + cardTopAt(CARD_TRACK, t) * sq.size}px`;
        box.style.width = `${width}px`;
        box.style.height = `${width * CARD_TRACK.aspect}px`;
        box.style.opacity = String(cardTextOpacityAt(CARD_TRACK, t));
        if (
          !revealed.current &&
          Number.isFinite(el.duration) &&
          t / el.duration >= INTRO_CONFETTI_AT
        ) {
          revealed.current = true;
          onReveal();
        }
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [state, onReveal]);

  return (
    <motion.div
      className={styles.scene}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.9, ease: "easeInOut" } }}
    >
      <video
        ref={video}
        className={styles.video}
        src={clip.src}
        poster={clip.poster}
        muted
        playsInline
        preload="auto"
        onEnded={onDone}
        onError={fail}
      />

      {/* The card's text, pinned to the card in the footage. */}
      <div
        ref={overlay}
        className={styles.cardOverlay}
        style={{ opacity: 0 }}
        aria-hidden
      >
        <CoverMarks
          mode="shared"
          monogramSize={28}
          classes={{
            monogram: styles.cardMonogram,
            name: styles.cardName,
            amp: styles.cardEt,
            date: styles.cardDate,
          }}
        />
      </div>

      <AnimatePresence>
        {state === "poster" && (
          <motion.div
            className={styles.posterLayer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* The wax seal in the footage is the button: a breathing ring marks it. */}
            <button
              ref={seal}
              type="button"
              className={styles.sealHotspot}
              onClick={play}
              aria-label="Open the card"
            >
              <span className={styles.sealRing} aria-hidden />
              <span className={styles.sealRingSlow} aria-hidden />
            </button>
            <span className={styles.hint}>Tap the seal to open</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

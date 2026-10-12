"use client";

import { AnimatePresence, LayoutGroup, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Envelope, OPENING } from "@/components/envelope/envelope";
import { VideoIntro } from "@/components/intro/video-intro";
import type { CoupleIdentity } from "@/domain/couple";
import { INTRO_VIDEO } from "@/domain/intro";
import { useIntroVideo } from "@/hooks/use-intro-video";
import { fireCelebration } from "@/lib/confetti";
import { CoupleProvider } from "./couple-context";
import { EntranceProvider } from "./entrance-context";

/**
 * closed → opening → open.
 * The sealed envelope is the landing screen: the pre-rendered clip when it plays, otherwise the
 * code-animated envelope. Tapping the wax seal opens it (confetti), then the page content
 * (`children`, rendered on the server with the guest's own text) takes over; after the clip the
 * card's marks glide onto the page cover through shared layout ids.
 */
type Phase = "closed" | "opening" | "open";

interface OpeningExperienceProps {
  readonly couple: CoupleIdentity;
  readonly children: ReactNode;
}

export function OpeningExperience({ couple, children }: OpeningExperienceProps) {
  const [phase, setPhase] = useState<Phase>("closed");
  const { state: video, markUnavailable } = useIntroVideo(INTRO_VIDEO);
  const reduce = useReducedMotion();
  const confettiTimer = useRef<number | null>(null);

  const celebrate = useCallback(() => {
    if (!reduce) fireCelebration({ x: 0.5, y: 0.45 });
  }, [reduce]);

  const openEnvelope = useCallback(() => {
    setPhase((current) => (current === "closed" ? "opening" : current));
    confettiTimer.current = window.setTimeout(celebrate, OPENING.card * 1000);
  }, [celebrate]);

  const finish = useCallback(() => setPhase("open"), []);

  useEffect(
    () => () => {
      if (confettiTimer.current !== null)
        window.clearTimeout(confettiTimer.current);
    },
    [],
  );

  // Nothing is shown until we know which intro to use, so the envelope never flashes before a video.
  if (video.status === "checking") return null;

  return (
    <CoupleProvider couple={couple}>
      <LayoutGroup>
        <AnimatePresence>
          {phase !== "open" &&
            (video.status === "available" ? (
              <VideoIntro
                key="video"
                clip={video.clip}
                onReveal={celebrate}
                onDone={finish}
                onFail={markUnavailable}
              />
            ) : (
              <Envelope
                key="envelope"
                phase={phase}
                onOpen={openEnvelope}
                onOpened={finish}
              />
            ))}
        </AnimatePresence>
        {phase === "open" && (
          <EntranceProvider
            entrance={video.status === "available" ? "shared" : "fade"}
          >
            {children}
          </EntranceProvider>
        )}
      </LayoutGroup>
    </CoupleProvider>
  );
}

import confetti from "canvas-confetti";

const PALETTE = [
  "#1f2a44",
  "#f6ebe7",
  "#c9a96e",
  "#ffffff",
  "#e8c9c0",
] as const;

/**
 * Two side bursts followed by a soft falling shower: celebratory but restrained,
 * matching the card's palette rather than rainbow confetti.
 */
export function fireCelebration(origin: { x: number; y: number }): void {
  const colors = [...PALETTE];
  confetti({
    particleCount: 90,
    spread: 70,
    startVelocity: 38,
    origin,
    colors,
    scalar: 0.9,
    ticks: 220,
  });
  window.setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });
  }, 250);

  const end = Date.now() + 1800;
  const shower = (): void => {
    confetti({
      particleCount: 3,
      startVelocity: 8,
      spread: 120,
      gravity: 0.55,
      drift: Math.random() - 0.5,
      origin: { x: Math.random(), y: -0.1 },
      colors,
      scalar: 0.8,
      ticks: 300,
    });
    if (Date.now() < end) window.requestAnimationFrame(shower);
  };
  window.setTimeout(shower, 400);
}

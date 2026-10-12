/**
 * Intro configuration. If a video exists at these paths (public/intro/...), the site plays it;
 * otherwise it falls back to the code-animated envelope. Both are optional.
 */
export interface IntroClip {
  /** The clip itself (H.264 mp4, no audio). */
  readonly src: string;
  /**
   * Still of the first frame, shown until the clip plays. In-app browsers (Facebook, Instagram,
   * Messenger) do not paint a video's first frame on their own, so without this the landing
   * screen stays blank until the viewer taps.
   */
  readonly poster: string;
}

export interface IntroVideoSources {
  /** 9:16 clip for phones. */
  readonly portrait: IntroClip;
  /** 16:9 clip for laptops and desktops. */
  readonly landscape: IntroClip;
}

export const INTRO_VIDEO: IntroVideoSources = {
  portrait: {
    src: "/intro/intro-portrait.mp4",
    poster: "/intro/intro-portrait.jpg",
  },
  landscape: {
    src: "/intro/intro-landscape.mp4",
    poster: "/intro/intro-landscape.jpg",
  },
};

/** Fraction of the clip after which the confetti fires (when the card appears). */
export const INTRO_CONFETTI_AT = 0.78;

/**
 * Where the invitation card is in the clip, as fractions of the square (1:1) footage:
 * the clip was generated square and letterboxed into the portrait and landscape files,
 * so coordinates are expressed relative to that centred square.
 * `top` is keyframed over time (the card rises, then settles with a small bounce);
 * `left`, `width` and the aspect ratio are constant once the card is out.
 */
export interface CardTrack {
  readonly left: number;
  readonly width: number;
  /** height / width of the card. */
  readonly aspect: number;
  /** [seconds, top] pairs, ascending. */
  readonly top: readonly (readonly [number, number])[];
  /** Text fades in between these two times (the card's top clears the pocket). */
  readonly textIn: readonly [number, number];
}

export const CARD_TRACK: CardTrack = {
  left: 0.235,
  width: 0.545,
  aspect: 1.36,
  top: [
    [2.9, 0.29],
    [3.0, 0.242],
    [3.17, 0.19],
    [3.33, 0.1375],
    [3.5, 0.09],
    [3.67, 0.085],
    [3.83, 0.094],
    [4.0, 0.104],
    [4.17, 0.11],
    [4.33, 0.1146],
    [4.5, 0.1167],
    [6.0, 0.1167],
  ],
  textIn: [3.05, 3.45],
};

/** Where the wax seal sits in the first frame, as fractions of the square footage. */
export interface SealSpot {
  readonly cx: number;
  readonly cy: number;
  /** Radius of the tap target, slightly larger than the wax itself. */
  readonly r: number;
}

export const SEAL_SPOT: SealSpot = { cx: 0.501, cy: 0.597, r: 0.095 };

export function cardTopAt(track: CardTrack, t: number): number {
  const keys = track.top;
  const first = keys[0];
  const last = keys[keys.length - 1];
  if (!first || !last) return 0;
  if (t <= first[0]) return first[1];
  if (t >= last[0]) return last[1];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (a && b && t <= b[0]) {
      const k = (t - a[0]) / (b[0] - a[0]);
      return a[1] + (b[1] - a[1]) * k;
    }
  }
  return last[1];
}

export function cardTextOpacityAt(track: CardTrack, t: number): number {
  const [from, to] = track.textIn;
  if (t <= from) return 0;
  if (t >= to) return 1;
  const k = (t - from) / (to - from);
  return k * k * (3 - 2 * k); // smoothstep
}

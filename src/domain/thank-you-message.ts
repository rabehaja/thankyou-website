/**
 * Composes a personal thank-you message for one guest party.
 *
 * Every card is different: each paragraph has several warm variants and the pick is derived
 * from the guest's id, so the same guest always gets the same text (re-running the drafting
 * tool is idempotent) while neighbours get different ones. The wording also follows the size
 * of the party (one person, a couple, a family or group) and how they took part in the
 * celebration, which is read from the guest's tags (see `stayOf`).
 *
 * No em dashes anywhere; the house style uses commas and full stops.
 */

export type PartySize = "one" | "two" | "group";

/** How the party took part. Read from the guest's tags, defaults to the whole weekend. */
export type Stay = "weekend" | "day" | "evening" | "travelled" | "remote";

export interface MessageContext {
  /** Stable id, used to vary the wording between guests. */
  readonly seed: string;
  readonly partySize: PartySize;
  readonly stay: Stay;
  /** Whether to thank for a gift (default true; the tag "no gift" turns it off). */
  readonly gift: boolean;
  /** Whether the party helped with the preparations or on the day (tag "helped"). */
  readonly helped: boolean;
  /** "July 18", "18 July" or any wording of the day. */
  readonly weddingDay: string;
  /** "Wiebke & Loïc". */
  readonly signature: string;
}

const STAY_TAGS: ReadonlyArray<readonly [Stay, RegExp]> = [
  ["travelled", /\b(travel|travelled|traveled|abroad|flew|flight|from afar|long journey)\b/i],
  ["evening", /\b(evening|party only|evening guest)\b/i],
  ["day", /\b(day guest|day only|ceremony only|the day)\b/i],
  ["remote", /\b(remote|could not come|couldn't come|absent|from a distance|online)\b/i],
  ["weekend", /\b(weekend|stayed|overnight|whole weekend|house guest)\b/i],
];

/** Picks the stay from the guest's tags; the first matching tag wins, "weekend" otherwise. */
export function stayOf(tags: readonly string[]): Stay {
  for (const tag of tags) {
    for (const [stay, pattern] of STAY_TAGS) if (pattern.test(tag)) return stay;
  }
  return "weekend";
}

export function partySizeOf(companions: readonly string[]): PartySize {
  if (companions.length === 0) return "one";
  return companions.length === 1 ? "two" : "group";
}

export function hasTag(tags: readonly string[], pattern: RegExp): boolean {
  return tags.some((tag) => pattern.test(tag));
}

/** Deterministic small hash so the variant choice is stable per guest. */
function hashOf(text: string): number {
  let h = 2166136261;
  for (const char of text) {
    h ^= char.charCodeAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

function pick<T>(options: readonly T[], seed: string, salt: string): T {
  const index = hashOf(`${seed}:${salt}`) % options.length;
  return options[index] as T;
}

/* The day itself. */
function openingParagraph(ctx: MessageContext): string {
  const day = ctx.weddingDay;
  return pick(
    [
      `${day} was such a special day for us, filled with so many wonderful moments. We had an amazing time celebrating, laughing and dancing together till late into the night, and we are still filled with so much joy from all the wonderful memories.`,
      `We are still floating on the happiness of ${day}. Every part of it, the ceremony, the toasts, the dancing that went on until the small hours, feels like a gift we get to unwrap again each time we think back on it.`,
      `${day} went by far too quickly, and yet it gave us memories we will keep for a lifetime. We laughed, we cried a little, we danced until our feet hurt, and we have been smiling about it ever since.`,
      `What a day ${day} was. It was everything we had hoped for and so much more, full of warmth, music and laughter, and we keep reliving our favourite moments of it together.`,
      `Looking back on ${day}, our hearts are still full. The sunshine, the vows, the long tables of people we love and a dance floor that never emptied: we could not have dreamed of a more beautiful day.`,
      `${day} was a day we will carry with us forever. From the first nervous moments of the morning to the last song of the night, it was filled with love, laughter and so many wonderful people.`,
    ],
    ctx.seed,
    "opening",
  );
}

/* The thanks, shaped by party size and by how they took part. */
function thanksParagraph(ctx: MessageContext): string {
  const you = ctx.partySize === "one" ? "you" : ctx.partySize === "two" ? "you both" : "all of you";
  const presence = {
    weekend: pick(
      [
        `Thank you so much that ${you} were part of our wedding and made the day and the whole weekend so memorable for us.`,
        `Thank you from the bottom of our hearts for being with us, not just on the day but for the whole weekend. Having ${you} there made it feel complete.`,
        `Having ${you} with us for the whole weekend meant the world to us. Thank you for every conversation, every laugh and every moment you shared with us.`,
      ],
      ctx.seed,
      "presence",
    ),
    day: pick(
      [
        `Thank you so much that ${you} came to celebrate with us on the day. Seeing ${you} there as we said our vows made the moment even more precious.`,
        `Thank you for being with us on the day itself. It meant so much to look around and see ${you} sharing it with us.`,
      ],
      ctx.seed,
      "presence",
    ),
    evening: pick(
      [
        `Thank you so much that ${you} joined us in the evening and danced the night away with us. The party would not have been the same without ${you}.`,
        `Thank you for coming to celebrate with us in the evening. Having ${you} on the dance floor with us is one of the memories we treasure most.`,
      ],
      ctx.seed,
      "presence",
    ),
    travelled: pick(
      [
        `Thank you so much that ${you} made the long journey to be with us. Knowing how far you came to share our day touched us deeply.`,
        `We know it was no small thing for ${you} to travel so far to celebrate with us, and we are more grateful than we can say. Your being there made the day so much richer.`,
      ],
      ctx.seed,
      "presence",
    ),
    remote: pick(
      [
        `Even though ${you} could not be with us in person, we felt your warmth and your good wishes all the way from where you were, and that meant a great deal to us.`,
        `We missed having ${you} with us on the day, and at the same time we felt very close to you through your kind words and wishes.`,
      ],
      ctx.seed,
      "presence",
    ),
  }[ctx.stay];

  const gift = ctx.gift
    ? pick(
        [
          `We were very touched by your thoughtful gift and your kind support; it truly meant a lot to us.`,
          `Thank you also for your generous gift. It is already helping us build the first chapter of our life together, and we were very moved by it.`,
          `Thank you as well for your lovely gift. It was so thoughtful of you, and we were truly moved by it.`,
        ],
        ctx.seed,
        "gift",
      )
    : null;

  const help = ctx.helped
    ? pick(
        [
          `Thank you too for everything you did behind the scenes to help the day come together. We could not have done it without you.`,
          `And thank you for all your help with the preparations and on the day itself. It took a weight off our shoulders and we noticed every bit of it.`,
        ],
        ctx.seed,
        "help",
      )
    : null;

  return [presence, gift, help].filter((part): part is string => part !== null).join(" ");
}

/* The closing thought. */
function closingParagraph(ctx: MessageContext): string {
  return pick(
    [
      `We feel so very lucky to have so many wonderful people in our lives who share these moments with us and accompany us on our journey together.`,
      `Days like this remind us how lucky we are to have people like you in our lives. Thank you for walking alongside us, on this day and on all the days to come.`,
      `We feel truly blessed to be surrounded by people who care for us the way you do, and we look forward to many more shared moments in the years ahead.`,
      `It is friends and family like you who make our life together so rich. Thank you for being part of it, now and always.`,
      `More than anything, the day showed us how much love surrounds us. We are deeply grateful to have you in our lives and we hope to see you again very soon.`,
    ],
    ctx.seed,
    "closing",
  );
}

function signOff(ctx: MessageContext): string {
  const line = pick(
    ["With lots of love and thanks,", "With all our love and gratitude,", "With love and heartfelt thanks,"],
    ctx.seed,
    "signoff",
  );
  return `${line}\n\n${ctx.signature}`;
}

/** The whole message, paragraphs separated by blank lines, ready for `greeting_message`. */
export function composeThankYouMessage(ctx: MessageContext): string {
  return [openingParagraph(ctx), thanksParagraph(ctx), closingParagraph(ctx), signOff(ctx)].join(
    "\n\n",
  );
}

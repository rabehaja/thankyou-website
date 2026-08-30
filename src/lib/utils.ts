type ClassValue = string | false | null | undefined;

/** Join conditional class names, skipping falsy values. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

/** "October 19, 2024" style date for admin surfaces. */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** "OCTOBER NINETEENTH, TWO THOUSAND TWENTY FOUR" style ceremonial date. */
export function formatCeremonialDate(date: string | Date): string {
  const d = new Date(date);
  const ordinals = [
    "first", "second", "third", "fourth", "fifth", "sixth", "seventh",
    "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth",
    "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth",
    "nineteenth", "twentieth", "twenty-first", "twenty-second",
    "twenty-third", "twenty-fourth", "twenty-fifth", "twenty-sixth",
    "twenty-seventh", "twenty-eighth", "twenty-ninth", "thirtieth",
    "thirty-first",
  ];
  const month = d.toLocaleDateString("en-US", { month: "long" });
  const day = ordinals[d.getDate() - 1];
  const year = spellYear(d.getFullYear());
  return `${month} ${day}, ${year}`.toUpperCase();
}

function spellYear(year: number): string {
  const ones = [
    "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
    "seventeen", "eighteen", "nineteen",
  ];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const spellBelowHundred = (n: number): string => {
    if (n === 0) return "";
    if (n < 20) return ones[n];
    const rest = n % 10;
    return rest ? `${tens[Math.floor(n / 10)]}-${ones[rest]}` : tens[Math.floor(n / 10)];
  };
  const thousands = Math.floor(year / 1000);
  const remainder = year % 1000;
  let out = `${ones[thousands]} thousand`;
  if (remainder >= 100) {
    out += ` ${ones[Math.floor(remainder / 100)]} hundred`;
  }
  const below = spellBelowHundred(remainder % 100);
  return below ? `${out} ${below}` : out;
}

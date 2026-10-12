/**
 * Copies text to the clipboard. Must be called synchronously inside the user's click handler
 * (before any `await`), otherwise Safari refuses the write as a non-gesture access.
 * Resolves to whether the copy succeeded.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export interface Rect {
  readonly left: number;
  readonly top: number;
  readonly size: number;
}

/**
 * Screen rectangle of the centred square footage inside a video rendered with
 * `object-fit: cover` over a box of `boxW` × `boxH` CSS px.
 * The square's side is the smaller intrinsic dimension (the clip was square before
 * being letterboxed into a portrait or landscape file).
 */
export function squareRect(
  videoW: number,
  videoH: number,
  boxW: number,
  boxH: number,
): Rect {
  const scale = Math.max(boxW / videoW, boxH / videoH);
  const shownW = videoW * scale;
  const shownH = videoH * scale;
  const offX = (boxW - shownW) / 2;
  const offY = (boxH - shownH) / 2;
  const side = Math.min(videoW, videoH);
  return {
    left: offX + ((videoW - side) / 2) * scale,
    top: offY + ((videoH - side) / 2) * scale,
    size: side * scale,
  };
}

// The iPhones a portrait launch image has to match, for
// `<link rel="apple-touch-startup-image">`.
//
// Safari picks a startup image only when a media query matches the device
// *exactly* — CSS dimensions and pixel ratio both. There's no fallback and no
// scaling, so a device missing from this list gets the plain white launch flash
// instead. That's the whole reason the list is this long.
//
// `w` / `h` are CSS points, portrait. Pixel dimensions are w·r × h·r.

export const IOS_DEVICES = [
  { w: 440, h: 956, r: 3, name: 'iPhone 16 Pro Max' },
  { w: 430, h: 932, r: 3, name: 'iPhone 15/16 Plus, 15 Pro Max, 14 Pro Max' },
  { w: 428, h: 926, r: 3, name: 'iPhone 12/13 Pro Max, 14 Plus' },
  { w: 414, h: 896, r: 3, name: 'iPhone XS Max, 11 Pro Max' },
  { w: 414, h: 896, r: 2, name: 'iPhone XR, 11' },
  { w: 414, h: 736, r: 3, name: 'iPhone 8 Plus' },
  { w: 402, h: 874, r: 3, name: 'iPhone 16 Pro' },
  { w: 393, h: 852, r: 3, name: 'iPhone 14 Pro, 15, 15 Pro, 16' },
  { w: 390, h: 844, r: 3, name: 'iPhone 12, 13, 14' },
  { w: 375, h: 812, r: 3, name: 'iPhone X/XS, 11 Pro, 12/13 mini' },
  { w: 375, h: 667, r: 2, name: 'iPhone SE 2/3, 6s/7/8' },
];

/** Pixel dimensions of a device's portrait launch image. */
export function splashSize({ w, h, r }) {
  return { width: w * r, height: h * r };
}

/** `public/splash/` filename for a device. */
export function splashFile(device) {
  const { width, height } = splashSize(device);
  return `splash-${width}x${height}.png`;
}

/** The media query Safari matches against to pick this device's image. */
export function splashMedia({ w, h, r }) {
  return (
    `(device-width: ${w}px) and (device-height: ${h}px) ` +
    `and (-webkit-device-pixel-ratio: ${r}) and (orientation: portrait)`
  );
}

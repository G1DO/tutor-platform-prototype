/**
 * Currency utilities for TutorConnect
 * All monetary amounts in the data layer are stored as integer minor units (piastres).
 * 100 minor units = 1 EGP.
 */

export function minorUnitsToEGP(minorUnits: number): number {
  return minorUnits / 100;
}

export function egpToMinorUnits(egp: number): number {
  return Math.round(egp * 100);
}

export function formatEGP(minorUnits: number, forceDecimals = false): string {
  const egp = minorUnitsToEGP(minorUnits);
  const isWhole = Number.isInteger(egp);

  const formatted = new Intl.NumberFormat('en-EG', {
    minimumFractionDigits: forceDecimals || !isWhole ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(egp);

  return `EGP ${formatted}`;
}

export function formatSignedEGP(minorUnits: number): string {
  const prefix = minorUnits > 0 ? '+' : minorUnits < 0 ? '-' : '';
  const absFormatted = formatEGP(Math.abs(minorUnits));
  return `${prefix}${absFormatted}`;
}

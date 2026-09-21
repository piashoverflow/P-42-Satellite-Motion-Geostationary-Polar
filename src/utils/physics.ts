export const G_UNIVERSAL = 6.67430e-11;

export const BODIES = {
  earth: {
    nameBn: 'পৃথিবী (Earth)',
    nameEn: 'Earth',
    M: 5.972e24,
    R: 6371e3, // meters
    g0: 9.81,
    geoAltKm: 35786,
    color: '#0284c7',
  },
  moon: {
    nameBn: 'চাঁদ (Moon)',
    nameEn: 'Moon',
    M: 7.348e22,
    R: 1737e3,
    g0: 1.62,
    geoAltKm: 88400,
    color: '#94a3b8',
  },
  mars: {
    nameBn: 'মঙ্গল (Mars)',
    nameEn: 'Mars',
    M: 6.417e23,
    R: 3390e3,
    g0: 3.71,
    geoAltKm: 17032,
    color: '#ef4444',
  },
};

export const MINERAL_DEPOSITS = {
  dense_metallic_ore: {
    nameBn: 'উচ্চ ঘনত্বের ধাতব আকরিক (লোহা/ম্যাগনেটাইট)',
    nameEn: 'Dense Metallic Ore (Iron/Magnetite)',
    densityDesc: 'ঘনত্ব: ~৫,০০০ কেজি/মি³ (ধনাত্মক বোগার অ্যানোমালি)',
    deltaGSign: '+',
    color: '#d97706',
  },
  oil_gas_reservoir: {
    nameBn: 'খনিজ তেল ও প্রাকৃতিক গ্যাস ক্ষেত্র',
    nameEn: 'Petroleum & Natural Gas Reservoir',
    densityDesc: 'ঘনত্ব: ~২,১০০ কেজি/মি³ (ঋণাত্মক বোগার অ্যানোমালি)',
    deltaGSign: '-',
    color: '#0284c7',
  },
  subsurface_cavity: {
    nameBn: 'ভূগর্ভস্থ লবণ গম্বুজ বা ফাটল/গুহা',
    nameEn: 'Subterranean Salt Dome / Cavern',
    densityDesc: 'ঘনত্ব: ~১,৮০০ কেজি/মি³ (তীব্র ঋণাত্মক অ্যানোমালি)',
    deltaGSign: '-',
    color: '#64748b',
  },
};

export function fmtNum(val: number, decimals: number = 2): string {
  if (!isFinite(val)) return '0.00';
  return val.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtSci(val: number, decimals: number = 2): string {
  if (!isFinite(val) || val === 0) return '0.00';
  const exponent = Math.floor(Math.log10(Math.abs(val)));
  const mantissa = val / Math.pow(10, exponent);
  return `${mantissa.toFixed(decimals)} × 10^{${exponent}}`;
}

export function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function drawVectorArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
  label?: string,
  headLen: number = 10
) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx);
  const length = Math.hypot(dx, dy);

  if (length < 2) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLen * Math.cos(angle - Math.PI / 6),
    toY - headLen * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - headLen * Math.cos(angle + Math.PI / 6),
    toY - headLen * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();

  if (label) {
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.fillStyle = color;
    const midX = (fromX + toX) / 2 + Math.cos(angle + Math.PI / 2) * 12;
    const midY = (fromY + toY) / 2 + Math.sin(angle + Math.PI / 2) * 12;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, midX, midY);
  }
  ctx.restore();
}

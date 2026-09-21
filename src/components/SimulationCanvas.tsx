import React, { useRef, useEffect } from 'react';
import { P42Mode, DualSatelliteParams, SatelliteKinematicsParams, WeightlessnessParams, GravimetryParams } from '../types';

interface SimulationCanvasProps {
  mode: P42Mode;
  isRunning: boolean;
  speed: number;
  dualParams: DualSatelliteParams;
  kinematicsParams: SatelliteKinematicsParams;
  weightlessParams: WeightlessnessParams;
  gravimetryParams: GravimetryParams;
  time: number;
  setTime: (updater: (prev: number) => number) => void;
  lang: 'en' | 'bn';
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  mode,
  isRunning,
  speed,
  dualParams,
  kinematicsParams,
  weightlessParams,
  gravimetryParams,
  time,
  setTime,
  lang,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1) * speed;
      lastTime = now;

      if (isRunning) {
        setTime((t) => t + dt);
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Dark space backdrop
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#040d1a');
      bgGrad.addColorStop(1, '#091e2b');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Starfield
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      for (let i = 0; i < 45; i++) {
        const sx = (i * 79 + 13) % width;
        const sy = (i * 59 + 29) % height;
        ctx.fillRect(sx, sy, 1.2, 1.2);
      }

      if (mode === 'geostationary_vs_polar') {
        renderGeostationaryVsPolar(ctx, width, height, time, dualParams, lang);
      } else if (mode === 'satellite_kinematics_energy') {
        renderSatelliteKinematics(ctx, width, height, time, kinematicsParams, lang);
      } else if (mode === 'weightlessness_lab') {
        renderWeightlessnessLab(ctx, width, height, time, weightlessParams, lang);
      } else if (mode === 'resource_exploration_gravimetry') {
        renderGravimetry(ctx, width, height, time, gravimetryParams, lang);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mode, isRunning, speed, dualParams, kinematicsParams, weightlessParams, gravimetryParams, time, lang, setTime]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-2">
      <canvas
        ref={canvasRef}
        width={860}
        height={540}
        className="w-full max-w-4xl h-auto rounded-2xl shadow-2xl border border-slate-800 bg-[#05111d]"
      />
    </div>
  );
};

// =========================================================================
// MODE 1: GEOSTATIONARY (BS-1) VS. POLAR SATELLITE
// =========================================================================
function renderGeostationaryVsPolar(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  p: DualSatelliteParams,
  lang: 'en' | 'bn'
) {
  // Title
  ctx.fillStyle = '#2dd4bf';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn'
      ? 'ভূ-স্থির উপগ্রহ (বঙ্গবন্ধু স্যাটেলাইট-১) বনাম মেরু উপগ্রহ (Polar Orbit)'
      : "Geostationary Satellite (Bangabandhu Satellite-1) vs. Polar Satellite",
    width / 2,
    30
  );

  const centerX = width * 0.44;
  const centerY = height * 0.52;
  const earthR_px = 75;

  // Earth Rotation Angle (24 hr period, scaled)
  const earthOmega = 0.3; // rad/s in sim
  const earthAngle = time * earthOmega;

  // Draw Earth
  ctx.save();
  ctx.translate(centerX, centerY);

  const eGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, earthR_px);
  eGrad.addColorStop(0, '#0284c7');
  eGrad.addColorStop(0.7, '#0369a1');
  eGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = eGrad;
  ctx.beginPath();
  ctx.arc(0, 0, earthR_px, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Spinning Earth surface continent / landmark (Bangladesh at 119.1 E slot)
  const markerX = earthR_px * Math.cos(earthAngle);
  const markerY = earthR_px * Math.sin(earthAngle) * 0.25; // slight equatorial tilt
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(markerX, markerY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BD (বাংলাদেশ)', markerX, markerY - 8);

  ctx.restore();

  // ==========================================
  // SATELLITE 1: GEOSTATIONARY (BS-1 at h = 35,786 km)
  // ==========================================
  const geoR_px = 210; // High altitude orbit

  // Orbit Track
  ctx.strokeStyle = 'rgba(45, 212, 191, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(centerX, centerY, geoR_px, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Geostationary satellite position strictly locked with Earth's rotation angle!
  const satGeoX = centerX + geoR_px * Math.cos(earthAngle);
  const satGeoY = centerY + geoR_px * Math.sin(earthAngle);

  // Transmission Coverage Footprint Cone
  if (p.showFootprintCone) {
    ctx.fillStyle = 'rgba(45, 212, 191, 0.12)';
    ctx.beginPath();
    ctx.moveTo(satGeoX, satGeoY);
    ctx.arc(centerX, centerY, earthR_px, earthAngle - 0.7, earthAngle + 0.7);
    ctx.closePath();
    ctx.fill();
  }

  // Draw Geostationary Satellite (BS-1)
  drawSatelliteIcon(ctx, satGeoX, satGeoY, '#2dd4bf', 'BS-1 (35,786 km)');

  // ==========================================
  // SATELLITE 2: POLAR SATELLITE (h = 700 km, T = 98 min)
  // ==========================================
  const polarR_px = earthR_px + 28; // Low Earth Orbit (LEO)
  const polarOmega = earthOmega * 6.5; // much faster period
  const polarAngle = time * polarOmega;

  // Polar Orbit (Vertical elliptical plane)
  ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, polarR_px * 0.35, polarR_px, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Polar Satellite Position
  const satPolarX = centerX + (polarR_px * 0.35) * Math.sin(polarAngle);
  const satPolarY = centerY - polarR_px * Math.cos(polarAngle);

  drawSatelliteIcon(ctx, satPolarX, satPolarY, '#f43f5e', 'Polar LEO (700 km)');

  // Right Side Information Card
  const cardX = width * 0.65;
  const cardY = 65;
  const cardW = width * 0.32;
  const cardH = 370;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#2dd4bf';
  ctx.font = 'bold 12px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('1. Bangabandhu-1 (ভূ-স্থির):', cardX + 14, cardY + 24);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '10px "JetBrains Mono", monospace';
  const geoLines = [
    `Height h: 35,786 km`,
    `Period T: 24.0 hours`,
    `Slot: 119.1° East`,
    `Relative Speed: 0 m/s`,
    `(Earth-synchronized)`,
    `Footprint: ~42% of Earth`,
  ];
  geoLines.forEach((l, i) => ctx.fillText(l, cardX + 14, cardY + 44 + i * 14));

  ctx.fillStyle = '#f43f5e';
  ctx.font = 'bold 12px "Space Grotesk", sans-serif';
  ctx.fillText('2. Polar Satellite (মেরু):', cardX + 14, cardY + 155);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '10px "JetBrains Mono", monospace';
  const polarLines = [
    `Height h: ~700 km`,
    `Period T: ~98 minutes`,
    `Orbit: North-South Poles`,
    `Coverage: 100% Earth`,
    `Application: Weather,`,
    `Remote Sensing, GIS`,
  ];
  polarLines.forEach((l, i) => ctx.fillText(l, cardX + 14, cardY + 175 + i * 14));

  // Bottom HUD
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width * 0.08, height - 60, width * 0.84, 46, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#2dd4bf';
  ctx.font = '11px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(
    lang === 'bn'
      ? 'ভূ-স্থির উপগ্রহ পৃথিবীর আহ্নিক গতির সাথে ঠিক একই বেগে (২৪ ঘণ্টায় ১ বার) ঘোরার কারণে ভূ-পৃষ্ঠ থেকে একে সর্বদা স্থির দেখা যায়।'
      : "A geostationary satellite completes one orbit in exactly 24 hours, remaining permanently locked above its assigned ground longitude.",
    width * 0.1,
    height - 32
  );
}

function drawSatelliteIcon(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, label: string) {
  // Solar panels
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(x - 14, y - 4, 8, 8);
  ctx.fillRect(x + 6, y - 4, 8, 8);

  // Satellite Body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Label
  ctx.fillStyle = color;
  ctx.font = 'bold 10px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y - 10);
}

// =========================================================================
// MODE 2: SATELLITE KINEMATICS & ENERGY VIRIAL THEOREM
// =========================================================================
function renderSatelliteKinematics(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  p: SatelliteKinematicsParams,
  lang: 'en' | 'bn'
) {
  // Title
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn'
      ? 'উপগ্রহের কক্ষীয় বেগ, পর্যায়কাল ও শক্তি: E = K + U = -GMm / 2(R+h)'
      : "Satellite Orbital Kinematics & Mechanical Energy Balance (Virial Theorem)",
    width / 2,
    30
  );

  const centerX = width * 0.38;
  const centerY = height * 0.52;
  const R_EARTH_KM = 6371;
  const GM = 3.986e14; // m^3/s^2

  const hKm = p.altitudeKm;
  const totalRKm = R_EARTH_KM + hKm;
  const totalRMeters = totalRKm * 1000;

  // Velocity: v = sqrt(GM / (R+h))
  const vMs = Math.sqrt(GM / totalRMeters);
  const vKmS = vMs / 1000;

  // Period: T = 2 * pi * r^(3/2) / sqrt(GM)
  const tSec = (2 * Math.PI * Math.pow(totalRMeters, 1.5)) / Math.sqrt(GM);
  const tHours = tSec / 3600;

  // Energies for mass m:
  const m = p.satelliteMassKg;
  const K_GJ = (0.5 * m * vMs * vMs) / 1e9;
  const U_GJ = -((GM * m) / totalRMeters) / 1e9;
  const E_GJ = K_GJ + U_GJ; // = -K_GJ

  // Screen scale
  const earthR_px = 75;
  const orbitR_px = earthR_px + (hKm / 40000) * 135;

  // Draw Earth
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(centerX, centerY, earthR_px, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Orbit Line
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1.8;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(centerX, centerY, orbitR_px, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Satellite orbiting
  const satSpeedRad = (2 * Math.PI) / Math.max(tHours * 4, 3);
  const satAngle = time * satSpeedRad;
  const satX = centerX + orbitR_px * Math.cos(satAngle);
  const satY = centerY + orbitR_px * Math.sin(satAngle);

  drawSatelliteIcon(ctx, satX, satY, '#f59e0b', `${vKmS.toFixed(2)} km/s`);

  // Right Side Energy Breakdown Card
  const cardX = width * 0.62;
  const cardY = 65;
  const cardW = width * 0.35;
  const cardH = 370;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Kinematic & Energy Telemetry:', cardX + 16, cardY + 26);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '11px "JetBrains Mono", monospace';
  const dataLines = [
    `Orbital Altitude h:`,
    `${hKm.toLocaleString()} km`,
    ``,
    `Orbital Velocity v:`,
    `v = √(GM / (R+h)) = ${vKmS.toFixed(2)} km/s`,
    ``,
    `Orbital Period T:`,
    `T = ${tHours.toFixed(2)} hr (${(tSec / 60).toFixed(0)} min)`,
    ``,
    `Kinetic Energy K:`,
    `+${K_GJ.toFixed(2)} GJ`,
    ``,
    `Potential Energy U:`,
    `${U_GJ.toFixed(2)} GJ`,
    ``,
    `Total Mechanical Energy:`,
    `E = K + U = ${E_GJ.toFixed(2)} GJ`,
    `(Binding Energy = +${Math.abs(E_GJ).toFixed(2)} GJ)`,
  ];

  dataLines.forEach((d, idx) => ctx.fillText(d, cardX + 16, cardY + 50 + idx * 15));

  // Bottom HUD
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width * 0.08, height - 60, width * 0.84, 46, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '11px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(
    lang === 'bn'
      ? 'ভিরিয়াল উপপাদ্য (Virial Theorem): আবদ্ধ বৃত্তীয় কক্ষপথে মোট শক্তি E = -K = 1/2 U। উচ্চতা বাড়লে বেগ কমে এবং পর্যায়কাল বাড়ে।'
      : "Virial Theorem for Bound Orbits: Total energy E = -K = 1/2 U. Higher orbital altitude yields lower orbital speed and longer period.",
    width * 0.1,
    height - 32
  );
}

// =========================================================================
// MODE 3: WEIGHTLESSNESS IN ORBIT (FREE FALL EXPLAINED)
// =========================================================================
function renderWeightlessnessLab(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  p: WeightlessnessParams,
  lang: 'en' | 'bn'
) {
  // Title
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn'
      ? 'মহাশূন্যে ওজনহীনতার কারণ: অভিকর্ষ বল শূন্য নয়, বরং অবাধ পতনে প্রতিক্রিয়া বল N = 0'
      : "Orbital Weightlessness: Gravity is NOT Zero; Apparent Weight N = m(g - a) = 0",
    width / 2,
    30
  );

  const capW = 280;
  const capH = 340;
  const capX = width * 0.32 - capW / 2;
  const capY = 80;

  // Spacecraft Capsule
  ctx.fillStyle = 'rgba(30, 41, 59, 0.5)';
  ctx.beginPath();
  ctx.roundRect(capX, capY, capW, capH, 20);
  ctx.fill();
  ctx.strokeStyle = p.thrusterActive ? '#f97316' : '#38bdf8';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Capsule Title
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 12px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    p.thrusterActive ? 'Thrusters Active (কৃত্রিম ত্বরণ)' : 'Orbital Free Fall (মুক্ত পতনশীল মহাকাশযান)',
    capX + capW / 2,
    capY - 12
  );

  // Digital Spring Scale on Floor
  const scaleY = capY + capH - 24;
  ctx.fillStyle = '#475569';
  ctx.fillRect(capX + capW / 2 - 50, scaleY, 100, 16);

  // Weight readout
  const gEff = p.thrusterActive ? p.thrusterAcc : 0.0;
  const weightN = p.astronautMass * gEff;

  ctx.fillStyle = p.thrusterActive ? '#22c55e' : '#f43f5e';
  ctx.font = 'bold 12px "JetBrains Mono", monospace';
  ctx.fillText(`N = ${weightN.toFixed(1)} N`, capX + capW / 2, scaleY + 12);

  // Astronaut Figure
  // If free fall, floating slightly above floor with gentle oscillation
  const floatOffset = p.thrusterActive ? 0 : 35 + Math.sin(time * 2) * 8;
  const astroX = capX + capW / 2;
  const astroFootY = scaleY - floatOffset;

  // Astronaut body
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  // Head
  ctx.arc(astroX, astroFootY - 95, 14, 0, Math.PI * 2);
  // Torso
  ctx.moveTo(astroX, astroFootY - 81);
  ctx.lineTo(astroX, astroFootY - 35);
  // Legs
  ctx.lineTo(astroX - 14, astroFootY);
  ctx.moveTo(astroX, astroFootY - 35);
  ctx.lineTo(astroX + 14, astroFootY);
  // Arms floating
  const armAng = p.thrusterActive ? 0.3 : 0.8;
  ctx.moveTo(astroX, astroFootY - 65);
  ctx.lineTo(astroX - 25, astroFootY - 65 - Math.sin(armAng) * 20);
  ctx.moveTo(astroX, astroFootY - 65);
  ctx.lineTo(astroX + 25, astroFootY - 65 - Math.sin(armAng) * 20);
  ctx.stroke();

  // Floating Water Droplet inside capsule
  const dropX = capX + capW * 0.25;
  const dropY = capY + 120 + Math.sin(time * 1.8) * 12;
  const dropGrad = ctx.createRadialGradient(dropX, dropY, 2, dropX, dropY, 12);
  dropGrad.addColorStop(0, '#bae6fd');
  dropGrad.addColorStop(1, '#0284c7');
  ctx.fillStyle = dropGrad;
  ctx.beginPath();
  ctx.arc(dropX, dropY, 12, 0, Math.PI * 2); // Perfect sphere due to surface tension
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#38bdf8';
  ctx.font = '9px sans-serif';
  ctx.fillText('Water Sphere (পৃষ্ঠটান)', dropX, dropY + 22);

  // Right Side Explanation Card
  const cardX = width * 0.58;
  const cardY = 80;
  const cardW = width * 0.38;
  const cardH = 340;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 13px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(lang === 'bn' ? 'পদার্থবিজ্ঞান তত্ত্ব:' : 'Physics Principles:', cardX + 16, cardY + 28);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '11px "JetBrains Mono", monospace';
  const lines = [
    `1. Gravity is NOT Zero:`,
    `   At ISS height (400 km),`,
    `   g = 8.7 m/s² (89% of surface!)`,
    ``,
    `2. Free Fall Acceleration:`,
    `   Both capsule & astronaut`,
    `   accelerate together: a = g`,
    ``,
    `3. Floor Contact Force:`,
    `   N = m(g - a) = m(g - g) = 0`,
    ``,
    `4. Apparent Weight W = N = 0`,
    `   Hence: Zero-G sensation!`,
    ``,
    `5. Surface Tension Dominates:`,
    `   Liquids form perfect spheres.`,
  ];

  lines.forEach((l, i) => ctx.fillText(l, cardX + 16, cardY + 54 + i * 16));

  // Bottom HUD
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width * 0.08, height - 60, width * 0.84, 46, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#f59e0b';
  ctx.font = '11px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(
    lang === 'bn'
      ? '💡 সাধারণ ভুল ধারণা: মহাশূন্যে মহাকর্ষ বল শূন্য হয়ে যায় না। বরং মহাকাশযান ও নভোচারী উভয়ই একই ত্বরণে ক্রমাগত পৃথিবীর দিকে পড়তে থাকায় মেঝে কোনো ঊর্ধ্বমুখী প্রতিক্রিয়া বল প্রদান করে না (N = 0)!'
      : "💡 Critical Clarification: Gravity is NOT zero in orbit. True weightlessness arises because the floor falls at the identical acceleration as the occupant: N = 0.",
    width * 0.1,
    height - 32
  );
}

// =========================================================================
// MODE 4: NATURAL RESOURCE EXPLORATION (GRAVIMETRIC ANOMALY Δg)
// =========================================================================
function renderGravimetry(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  p: GravimetryParams,
  lang: 'en' | 'bn'
) {
  // Title
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'bn'
      ? 'মহাকর্ষ সূত্রের ব্যবহার: মহাকর্ষীয় এনোমালি (Δg) দিয়ে ভূগর্ভস্থ খনিজ ও তেল অনুসন্ধান'
      : "Application of Law of Gravitation: Mineral & Petroleum Exploration via Gravimetry (Δg)",
    width / 2,
    30
  );

  // Upper Half: Gravimeter Graph Δg(x)
  const graphTop = 60;
  const graphH = 140;
  const graphLeft = width * 0.1;
  const graphW = width * 0.8;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.beginPath();
  ctx.roundRect(graphLeft, graphTop, graphW, graphH, 10);
  ctx.fill();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.stroke();

  const midY = graphTop + graphH / 2;

  // Zero anomaly baseline
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(graphLeft + 30, midY);
  ctx.lineTo(graphLeft + graphW - 30, midY);
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('+Δg (mGal)', graphLeft + 25, graphTop + 24);
  ctx.fillText('0', graphLeft + 25, midY + 4);
  ctx.fillText('-Δg', graphLeft + 25, graphTop + graphH - 14);

  // Underground deposit location (center x)
  const depositScreenX = graphLeft + graphW / 2;
  const isDense = p.depositType === 'dense_metallic_ore';
  const anomalySign = isDense ? 1 : -1;

  // Draw Anomaly Bell Curve
  ctx.strokeStyle = isDense ? '#38bdf8' : '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();

  for (let px = graphLeft + 30; px <= graphLeft + graphW - 30; px += 3) {
    const xDist = (px - depositScreenX) * 10; // scaled meters
    const zDepth = p.depositDepthMeters;
    // Delta g = G * Delta M * z / (x^2 + z^2)^(3/2)
    const anomalyCurve = (anomalySign * 45) / (1 + Math.pow(xDist / zDepth, 2));
    const plotY = midY - anomalyCurve;

    if (px === graphLeft + 30) ctx.moveTo(px, plotY);
    else ctx.lineTo(px, plotY);
  }
  ctx.stroke();

  // Survey Aircraft flying over terrain
  const planeSpeed = 120; // px/s
  const planeX = graphLeft + 30 + ((time * planeSpeed) % (graphW - 60));
  const planeY = graphTop + graphH + 35;

  // Aircraft symbol
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.moveTo(planeX + 16, planeY);
  ctx.lineTo(planeX - 12, planeY - 7);
  ctx.lineTo(planeX - 6, planeY);
  ctx.lineTo(planeX - 12, planeY + 7);
  ctx.closePath();
  ctx.fill();

  // Gravimeter beam down to ground
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(planeX, planeY);
  ctx.lineTo(planeX, planeY + 70);
  ctx.stroke();
  ctx.setLineDash([]);

  // Lower Section: Subterranean Geological Cross-Section
  const geoTop = planeY + 70;
  const geoH = height - geoTop - 70;

  // Host rock
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(graphLeft, geoTop, graphW, geoH);
  ctx.strokeStyle = '#475569';
  ctx.strokeRect(graphLeft, geoTop, graphW, geoH);

  // Subterranean Ore Body / Petroleum Trap
  const depositScreenY = geoTop + (p.depositDepthMeters / 3000) * geoH;
  ctx.fillStyle = isDense ? '#0284c7' : '#d97706';
  ctx.beginPath();
  ctx.ellipse(depositScreenX, depositScreenY, 45, 25, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    isDense
      ? (lang === 'bn' ? 'উচ্চ ঘনত্বের ধাতব খনিজ (+Δg)' : 'Dense Metallic Ore (+Δg)')
      : (lang === 'bn' ? 'পেট্রোলেয়াম / প্রাকৃতিক গ্যাস (-Δg)' : 'Petroleum Reservoir (-Δg)'),
    depositScreenX,
    depositScreenY + 4
  );

  // Bottom HUD
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(width * 0.08, height - 60, width * 0.84, 46, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '11px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(
    lang === 'bn'
      ? 'গ্র্যাভিমিটার সার্ভে: ভূগর্ভে ভারী ধাতু বা লৌহ আকরিক থাকলে অভিকর্ষের মান সামান্য বৃদ্ধি পায় (+Δg), আর গ্যাস বা তেল থাকলে মান হ্রাস পায় (-Δg)।'
      : "Gravimetric Anomaly: Denser metallic minerals cause a localized positive peak (+Δg), whereas low-density oil/gas reservoirs produce negative troughs (-Δg).",
    width * 0.1,
    height - 32
  );
}

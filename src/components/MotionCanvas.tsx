import React, { useRef, useEffect, useState } from 'react';
import { SimulationParams, TelemetryState, Language, AppTheme } from '../types';
import { t } from '../utils/i18n';
import { fmtNum, BODIES, MINERAL_DEPOSITS, drawRoundRect, drawVectorArrow, G_UNIVERSAL } from '../utils/physics';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  StepForward, 
  Maximize2, 
  Minimize2, 
  Clock, 
  Radio, 
  Satellite, 
  Activity 
} from 'lucide-react';

interface MotionCanvasProps {
  language: Language;
  theme: AppTheme;
  params: SimulationParams;
  telemetry: TelemetryState;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
  onReset: () => void;
  onToggleSlowMo: () => void;
}

export const MotionCanvas: React.FC<MotionCanvasProps> = ({
  language,
  theme,
  params,
  telemetry,
  isPlaying,
  onTogglePlay,
  onStep,
  onReset,
  onToggleSlowMo,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Stars background cache
  const starsRef = useRef<Array<{ x: number; y: number; r: number; alpha: number }>>([]);

  useEffect(() => {
    // Generate static starry background
    const stars = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
      });
    }
    starsRef.current = stars;
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFSEnv = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFSEnv);
    return () => document.removeEventListener('fullscreenchange', handleFSEnv);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      const width = rect.width;
      const height = rect.height;

      // 1. Clear & Background
      if (params.preset === 'mineral_exploration') {
        // Geological sky + ground background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);
      } else {
        // Deep Space
        const spaceGrad = ctx.createLinearGradient(0, 0, 0, height);
        spaceGrad.addColorStop(0, '#030712');
        spaceGrad.addColorStop(1, '#0b0f19');
        ctx.fillStyle = spaceGrad;
        ctx.fillRect(0, 0, width, height);

        // Render stars
        starsRef.current.forEach((st) => {
          ctx.fillStyle = `rgba(255, 255, 255, ${st.alpha})`;
          ctx.beginPath();
          ctx.arc(st.x * width, st.y * height, st.r, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      const body = BODIES[params.centralBody];

      // 2. PRESET SPECIFIC RENDERING
      if (params.preset === 'mineral_exploration') {
        // ----------------- MINERAL GRAVIMETRY MODE -----------------
        const groundY = height * 0.42;

        // Sky above ground
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, width, groundY);

        // Subsurface Earth Strata
        const earthGrad = ctx.createLinearGradient(0, groundY, 0, height);
        earthGrad.addColorStop(0, '#334155');
        earthGrad.addColorStop(0.3, '#1e293b');
        earthGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = earthGrad;
        ctx.fillRect(0, groundY, width, height - groundY);

        // Ground surface boundary line
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(width, groundY);
        ctx.stroke();

        // Grass/topsoil layer
        ctx.fillStyle = '#15803d';
        ctx.fillRect(0, groundY - 2, width, 4);

        // Subsurface Deposit Ore Body
        const deposit = MINERAL_DEPOSITS[params.depositType];
        const depX = width * 0.5;
        const depDepthPx = (params.depositDepthM / 2500) * (height * 0.45);
        const depY = groundY + depDepthPx;
        const depRadius = 38;

        // Glow around deposit
        const depGlow = ctx.createRadialGradient(depX, depY, 5, depX, depY, depRadius * 1.5);
        depGlow.addColorStop(0, deposit.color);
        depGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = depGlow;
        ctx.beginPath();
        ctx.arc(depX, depY, depRadius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Deposit body shape
        ctx.fillStyle = deposit.color;
        ctx.beginPath();
        ctx.ellipse(depX, depY, depRadius * 1.4, depRadius * 0.9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(deposit.nameEn, depX, depY + 3);
        ctx.fillText(`d = ${params.depositDepthM} m`, depX, depY + 16);

        // Survey Drone / Gravimeter Rover traversing along surface
        const droneSpeed = 0.08;
        const droneProg = ((telemetry.elapsedTime * droneSpeed) % 1.2) - 0.1; // -0.1 to 1.1
        const droneX = droneProg * width;
        const droneY = groundY - 35;

        // Scanning beam from drone
        const scanGrad = ctx.createLinearGradient(droneX, droneY, droneX, groundY + 80);
        scanGrad.addColorStop(0, 'rgba(56, 189, 248, 0.5)');
        scanGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = scanGrad;
        ctx.beginPath();
        ctx.moveTo(droneX - 8, droneY);
        ctx.lineTo(droneX + 8, droneY);
        ctx.lineTo(droneX + 45, groundY + 80);
        ctx.lineTo(droneX - 45, groundY + 80);
        ctx.closePath();
        ctx.fill();

        // Rover body
        ctx.fillStyle = '#38bdf8';
        drawRoundRect(ctx, droneX - 18, droneY - 10, 36, 16, 5);
        ctx.fill();
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(droneX - 10, droneY + 7, 5, 0, Math.PI * 2);
        ctx.arc(droneX + 10, droneY + 7, 5, 0, Math.PI * 2);
        ctx.fill();

        // Gravimeter sensor antenna
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(droneX, droneY - 10);
        ctx.lineTo(droneX, droneY - 20);
        ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(droneX, droneY - 20, 3, 0, Math.PI * 2);
        ctx.fill();

        // Live Bouguer Anomaly Curve in Upper Sky
        const graphBaselineY = height * 0.2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(40, graphBaselineY);
        ctx.lineTo(width - 40, graphBaselineY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '9px JetBrains Mono';
        ctx.textAlign = 'left';
        ctx.fillText('Δg = 0 mGal (Normal Earth Baseline)', 45, graphBaselineY - 6);

        // Plot Bouguer curve: Δg(x) = (G * ΔM * d) / ( (x - x0)^2 + d^2 )^(3/2)
        ctx.strokeStyle = deposit.deltaGSign === '+' ? '#10b981' : '#f43f5e';
        ctx.lineWidth = 2.5;
        ctx.beginPath();

        const signMultiplier = deposit.deltaGSign === '+' ? -1 : 1; // screen y is inverted
        for (let gx = 40; gx <= width - 40; gx += 2) {
          const dxDist = (gx - depX) * 10; // scaled meters
          const rSq = dxDist * dxDist + params.depositDepthM * params.depositDepthM;
          const peakVal = 45; // pixel amplitude
          const val = peakVal * Math.pow(params.depositDepthM * params.depositDepthM / rSq, 1.5);
          const py = graphBaselineY + signMultiplier * val;

          if (gx === 40) ctx.moveTo(gx, py);
          else ctx.lineTo(gx, py);
        }
        ctx.stroke();

        // Current drone measurement point
        if (droneX >= 40 && droneX <= width - 40) {
          const dxCur = (droneX - depX) * 10;
          const rSqCur = dxCur * dxCur + params.depositDepthM * params.depositDepthM;
          const peakVal = 45;
          const curVal = peakVal * Math.pow(params.depositDepthM * params.depositDepthM / rSqCur, 1.5);
          const curPy = graphBaselineY + signMultiplier * curVal;

          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(droneX, curPy, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 11px JetBrains Mono';
          ctx.fillText(`Δg = ${fmtNum(telemetry.anomalyDeltaMgal, 1)} mGal`, droneX + 8, curPy - 8);
        }

      } else if (params.preset === 'weightlessness') {
        // ----------------- WEIGHTLESSNESS LAB MODE -----------------
        // Inside a Spacecraft Capsule orbiting or in flight
        const capsuleW = Math.min(width * 0.75, 480);
        const capsuleH = Math.min(height * 0.7, 340);
        const capX = (width - capsuleW) / 2;
        const capY = (height - capsuleH) / 2;

        // Capsule Outer Hull
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 6;
        ctx.fillStyle = '#1e293b';
        drawRoundRect(ctx, capX, capY, capsuleW, capsuleH, 30);
        ctx.fill();
        ctx.stroke();

        // Capsule Interior Wall lighting
        const intGrad = ctx.createLinearGradient(capX, capY, capX, capY + capsuleH);
        intGrad.addColorStop(0, '#0f172a');
        intGrad.addColorStop(1, '#1e293b');
        ctx.fillStyle = intGrad;
        drawRoundRect(ctx, capX + 6, capY + 6, capsuleW - 12, capsuleH - 12, 24);
        ctx.fill();

        // Observation Porthole Window showing Earth
        const portX = capX + 65;
        const portY = capY + 80;
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(portX, portY, 40, 0, Math.PI * 2);
        ctx.stroke();

        ctx.save();
        ctx.beginPath();
        ctx.arc(portX, portY, 38, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = '#0369a1';
        ctx.fillRect(portX - 40, portY - 40, 80, 80);
        // Earth curve in window
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(portX + 25, portY + 45, 45, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Scale on Floor
        const scaleW = 90;
        const scaleH = 16;
        const scaleX = capX + capsuleW * 0.6 - scaleW / 2;
        const scaleY = capY + capsuleH - 45;

        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        drawRoundRect(ctx, scaleX, scaleY, scaleW, scaleH, 4);
        ctx.fill();
        ctx.stroke();

        // Scale digital LED display
        ctx.fillStyle = '#000000';
        ctx.fillRect(scaleX + 20, scaleY + 2, scaleW - 40, 12);
        ctx.fillStyle = telemetry.scaleReadingN < 5 ? '#22c55e' : '#ef4444';
        ctx.font = 'bold 9px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(`${fmtNum(telemetry.scaleReadingN, 0)} N`, scaleX + scaleW / 2, scaleY + 11);

        // Astronaut Floating or Standing
        // Float offset if freefall
        const isFreefall = params.spacecraftState === 'orbital_freefall';
        const floatAnim = isFreefall ? Math.sin(telemetry.elapsedTime * 1.5) * 18 - 25 : 0;
        const astroX = scaleX + scaleW / 2;
        const astroFootY = scaleY + floatAnim;

        // Astronaut Body
        // Boots
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(astroX - 16, astroFootY - 12, 12, 12);
        ctx.fillRect(astroX + 4, astroFootY - 12, 12, 12);

        // Legs
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(astroX - 14, astroFootY - 40, 10, 28);
        ctx.fillRect(astroX + 4, astroFootY - 40, 10, 28);

        // Torso / Suit
        ctx.fillStyle = '#f8fafc';
        drawRoundRect(ctx, astroX - 18, astroFootY - 80, 36, 42, 6);
        ctx.fill();

        // NASA / Mission Patch
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(astroX + 8, astroFootY - 68, 4, 0, Math.PI * 2);
        ctx.fill();

        // Helmet
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(astroX, astroFootY - 96, 16, 0, Math.PI * 2);
        ctx.fill();

        // Visor (Gold tint)
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.ellipse(astroX + (isFreefall ? 2 : 0), astroFootY - 96, 11, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Arms
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        if (isFreefall) {
          // Floating outstretched arms
          ctx.beginPath();
          ctx.moveTo(astroX - 18, astroFootY - 72);
          ctx.lineTo(astroX - 32, astroFootY - 85 + Math.sin(telemetry.elapsedTime * 2) * 5);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(astroX + 18, astroFootY - 72);
          ctx.lineTo(astroX + 32, astroFootY - 85 - Math.sin(telemetry.elapsedTime * 2) * 5);
          ctx.stroke();
        } else {
          // Normal arms down
          ctx.beginPath();
          ctx.moveTo(astroX - 18, astroFootY - 72);
          ctx.lineTo(astroX - 24, astroFootY - 48);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(astroX + 18, astroFootY - 72);
          ctx.lineTo(astroX + 24, astroFootY - 48);
          ctx.stroke();
        }

        // Vectors if enabled
        if (params.showVectors) {
          // Gravity vector downward on astronaut
          drawVectorArrow(
            ctx,
            astroX - 25,
            astroFootY - 50,
            astroX - 25,
            astroFootY,
            '#ef4444',
            'F_g = mg'
          );

          if (!isFreefall && telemetry.scaleReadingN > 0) {
            // Normal force upward
            drawVectorArrow(
              ctx,
              astroX + 25,
              astroFootY,
              astroX + 25,
              astroFootY - 50,
              '#10b981',
              'N = mg'
            );
          } else if (isFreefall) {
            // Acceleration of capsule downward
            drawVectorArrow(
              ctx,
              capX + 35,
              capY + capsuleH * 0.4,
              capX + 35,
              capY + capsuleH * 0.7,
              '#38bdf8',
              'a = g (Free Fall)'
            );
          }
        }

        // Rocket Burn Flame if powered
        if (params.spacecraftState === 'powered_burn') {
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.moveTo(capX + capsuleW * 0.3, capY + capsuleH);
          ctx.lineTo(capX + capsuleW * 0.5, capY + capsuleH + 45 + Math.random() * 15);
          ctx.lineTo(capX + capsuleW * 0.7, capY + capsuleH);
          ctx.fill();
        }

      } else {
        // ----------------- ORBITAL / GEOSTATIONARY / POLAR MODES -----------------
        const cx = width * 0.5;
        const cy = height * 0.5;

        // Scale factors: Earth radius to canvas pixels
        // GEO radius is ~42,157 km. For good visibility, scale Earth to radius R_px
        const maxRadiusKm = params.preset === 'geostationary_bs1' ? 45000 : 15000;
        const earthRadiusPx = Math.min(width, height) * (6371 / maxRadiusKm) * 0.45;
        const earthR = Math.max(earthRadiusPx, params.preset === 'geostationary_bs1' ? 26 : 58);

        // Orbital radius in pixels
        const rOrbitKm = 6371 + params.altitudeKm;
        const orbitRadiusPx = (rOrbitKm / maxRadiusKm) * (Math.min(width, height) * 0.45) + earthR * 0.35;

        // 1. Central Earth Globe
        // Atmosphere outer glow
        const atmoGlow = ctx.createRadialGradient(cx, cy, earthR * 0.9, cx, cy, earthR * 1.25);
        atmoGlow.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        atmoGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = atmoGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, earthR * 1.25, 0, Math.PI * 2);
        ctx.fill();

        // Earth sphere
        const earthGrad = ctx.createRadialGradient(cx - earthR * 0.3, cy - earthR * 0.3, 5, cx, cy, earthR);
        earthGrad.addColorStop(0, '#0284c7');
        earthGrad.addColorStop(0.7, '#0369a1');
        earthGrad.addColorStop(1, '#075985');
        ctx.fillStyle = earthGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, earthR, 0, Math.PI * 2);
        ctx.fill();

        // Continents / Green Landmasses with Earth spin
        const spinAngle = params.earthRotationActive ? telemetry.elapsedTime * 0.05 : 0;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, earthR, 0, Math.PI * 2);
        ctx.clip();

        // Stylized continent patches rotating
        ctx.fillStyle = '#15803d';
        for (let c = 0; c < 3; c++) {
          const cAng = spinAngle + (c * Math.PI * 2) / 3;
          const cX = cx + Math.cos(cAng) * (earthR * 0.6);
          const cY = cy + Math.sin(cAng * 0.5) * (earthR * 0.4);
          ctx.beginPath();
          ctx.ellipse(cX, cY, earthR * 0.4, earthR * 0.25, cAng * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Bangladesh location marker on globe if Earth
        const bdAng = spinAngle + 1.2;
        const bdX = cx + Math.cos(bdAng) * (earthR * 0.55);
        const bdY = cy + Math.sin(bdAng) * (earthR * 0.3);
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(bdX, bdY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 2. Orbital Path Track
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        if (params.preset === 'polar_satellite') {
          // Polar orbit is inclined vertically
          ctx.ellipse(cx, cy, orbitRadiusPx * 0.28, orbitRadiusPx, 0, 0, Math.PI * 2);
        } else {
          // Equatorial / Circular orbit
          ctx.arc(cx, cy, orbitRadiusPx, 0, Math.PI * 2);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // 3. Satellite Position Calculation
        // In GEO mode, angular velocity equals Earth spin velocity: delta angle = 0 relative to Bangladesh!
        let satTheta = 0;
        if (params.preset === 'geostationary_bs1') {
          // Fixed relative to Earth slot!
          satTheta = spinAngle + 1.2; // locked with Bangladesh slot!
        } else if (params.preset === 'polar_satellite') {
          satTheta = telemetry.elapsedTime * 0.4;
        } else {
          satTheta = telemetry.elapsedTime * (telemetry.orbitalSpeedKmS / 7.91) * 0.25;
        }

        let satX = cx;
        let satY = cy;

        if (params.preset === 'polar_satellite') {
          satX = cx + Math.sin(satTheta) * (orbitRadiusPx * 0.28);
          satY = cy - Math.cos(satTheta) * orbitRadiusPx;
        } else {
          satX = cx + Math.cos(satTheta) * orbitRadiusPx;
          satY = cy + Math.sin(satTheta) * orbitRadiusPx;
        }

        // 4. Ground Coverage Cone / Beam if enabled
        if (params.showCoverageCone) {
          const coneGrad = ctx.createRadialGradient(satX, satY, 10, cx, cy, orbitRadiusPx);
          coneGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
          coneGrad.addColorStop(1, 'rgba(56, 189, 248, 0.03)');
          ctx.fillStyle = coneGrad;

          ctx.beginPath();
          ctx.moveTo(satX, satY);
          const tangentHalfAngle = Math.asin(earthR / Math.max(earthR + 1, orbitRadiusPx));
          const satAngle = Math.atan2(cy - satY, cx - satX);
          ctx.lineTo(
            satX + Math.cos(satAngle - tangentHalfAngle) * orbitRadiusPx,
            satY + Math.sin(satAngle - tangentHalfAngle) * orbitRadiusPx
          );
          ctx.lineTo(
            satX + Math.cos(satAngle + tangentHalfAngle) * orbitRadiusPx,
            satY + Math.sin(satAngle + tangentHalfAngle) * orbitRadiusPx
          );
          ctx.closePath();
          ctx.fill();

          // Radio wave transmission pulses from BS-1
          const pulseR = ((telemetry.elapsedTime * 40) % orbitRadiusPx);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(satX, satY, Math.min(pulseR, orbitRadiusPx * 0.9), satAngle - 0.5, satAngle + 0.5);
          ctx.stroke();
        }

        // 5. Satellite Model (Detailed Golden Solar Panels & Dish Antenna)
        ctx.save();
        ctx.translate(satX, satY);
        // Rotate satellite facing Earth
        const angleToEarth = Math.atan2(cy - satY, cx - satX);
        ctx.rotate(angleToEarth);

        // Central Bus (Cube)
        ctx.fillStyle = '#f59e0b'; // Gold foil bus
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1;
        ctx.fillRect(-7, -7, 14, 14);
        ctx.strokeRect(-7, -7, 14, 14);

        // Solar Arrays (Left & Right Wings)
        ctx.fillStyle = '#0284c7';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        // Left Wing
        ctx.fillRect(-6, -26, 12, 17);
        ctx.strokeRect(-6, -26, 12, 17);
        // Right Wing
        ctx.fillRect(-6, 9, 12, 17);
        ctx.strokeRect(-6, 9, 12, 17);

        // Communication Dish Antenna pointing at Earth
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(11, 0, 7, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();

        ctx.restore();

        // Label
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 10px JetBrains Mono';
        ctx.textAlign = 'center';
        const satName = params.preset === 'geostationary_bs1' 
          ? 'BS-1 (GEO 119.1°E)'
          : params.preset === 'polar_satellite'
          ? 'Polar LEO'
          : `Satellite (${params.satelliteMassKg} kg)`;
        ctx.fillText(satName, satX, satY - 24);

        // Vectors if enabled
        if (params.showVectors) {
          // Velocity Vector (tangential)
          const vAngle = angleToEarth + Math.PI / 2;
          const vLen = 45;
          drawVectorArrow(
            ctx,
            satX,
            satY,
            satX + Math.cos(vAngle) * vLen,
            satY + Math.sin(vAngle) * vLen,
            '#38bdf8',
            `v = ${fmtNum(telemetry.orbitalSpeedKmS, 2)} km/s`
          );

          // Gravity Centripetal Vector (pointing toward Earth center)
          const fLen = 40;
          drawVectorArrow(
            ctx,
            satX,
            satY,
            satX + Math.cos(angleToEarth) * fLen,
            satY + Math.sin(angleToEarth) * fLen,
            '#ef4444',
            `F_g`
          );
        }

        // Live Virial Energy Bars in Top Left if enabled
        if (params.showEnergyBars && params.preset === 'orbital_mechanics') {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          drawRoundRect(ctx, 15, 15, 210, 85, 10);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.stroke();

          ctx.font = 'bold 10px Plus Jakarta Sans';
          ctx.fillStyle = '#f8fafc';
          ctx.fillText('ভিরিয়াল শক্তি অনুপাত (Virial Theorem)', 25, 32);

          ctx.font = '9px JetBrains Mono';
          ctx.fillStyle = '#38bdf8';
          ctx.fillText(`গতিশক্তি K = +${fmtNum(telemetry.kineticEnergyGJ, 1)} GJ`, 25, 48);
          ctx.fillStyle = '#ef4444';
          ctx.fillText(`বিভবশক্তি U = ${fmtNum(telemetry.potentialEnergyGJ, 1)} GJ`, 25, 62);
          ctx.fillStyle = '#10b981';
          ctx.fillText(`মোট শক্তি E = ${fmtNum(telemetry.totalEnergyGJ, 1)} GJ (= -K)`, 25, 76);
          ctx.fillStyle = '#e2e8f0';
          ctx.fillText(`বন্ধন শক্তি E_b = +${fmtNum(telemetry.bindingEnergyGJ, 1)} GJ`, 25, 90);
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [params, telemetry]);

  return (
    <div
      ref={containerRef}
      className="flex-1 w-full min-w-0 flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
    >
      {/* Simulation Screen */}
      <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[620px] bg-slate-950 overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Top Overlay Badge */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-white text-xs font-bold shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono">
              {params.preset === 'geostationary_bs1'
                ? 'বঙ্গবন্ধু স্যাটেলাইট-১ (BS-1) • GEO Orbit'
                : params.preset === 'polar_satellite'
                ? 'মেরু উপগ্রহ • Sun-Synchronous LEO'
                : params.preset === 'weightlessness'
                ? 'ক্যাপসুল ওজনহীনতা ল্যাব (N = 0)'
                : params.preset === 'mineral_exploration'
                ? 'খনিজ অনুসন্ধান ও মহাকর্ষ অ্যানোমালি'
                : 'কক্ষীয় বলবিদ্যা ও শক্তি সংরক্ষণ'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Control Deck */}
      <div className="bg-white border-t border-slate-200/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>{t(language, 'pause')}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{t(language, 'play')}</span>
              </>
            )}
          </button>

          <button
            onClick={onStep}
            disabled={isPlaying}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>{t(language, 'step')}</span>
          </button>

          <button
            onClick={onReset}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleSlowMo}
            className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              params.slowMo
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{t(language, 'slowMo')}</span>
          </button>
        </div>

        {/* Right Action: Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span>{t(language, 'exitFullScreen')}</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{t(language, 'fullScreen')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

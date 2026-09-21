import React, { useState, useEffect, useRef } from 'react';
import { Language, PresetMode, AppTheme, SimulationParams, TelemetryState } from './types';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { MotionCanvas } from './components/MotionCanvas';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { TheoryModal } from './components/TheoryModal';
import { BODIES, MINERAL_DEPOSITS, G_UNIVERSAL } from './utils/physics';

export default function App() {
  const [language, setLanguage] = useState<Language>('bn');
  const [theme, setTheme] = useState<AppTheme>('clean_bright');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const initialParams: SimulationParams = {
    preset: 'geostationary_bs1',
    theme: 'clean_bright',
    altitudeKm: 35786, // Exact BS-1 geostationary altitude
    satelliteMassKg: 3500, // BS-1 launch mass
    centralBody: 'earth',
    showGroundTrack: true,
    showCoverageCone: true,
    earthRotationActive: true,
    astronautMassKg: 70,
    spacecraftState: 'orbital_freefall',
    burnAccelerationMS2: 5,
    depositType: 'dense_metallic_ore',
    depositDepthM: 800,
    depositExcessMassPct: 40,
    showVectors: true,
    showEnergyBars: true,
    showGrid: true,
    slowMo: false,
  };

  const [params, setParams] = useState<SimulationParams>(initialParams);

  // Compute Telemetry State
  const computeTelemetry = (p: SimulationParams, simTime: number = 0): TelemetryState => {
    const body = BODIES[p.centralBody];
    const rMeters = body.R + p.altitudeKm * 1000;
    const vMS = Math.sqrt((G_UNIVERSAL * body.M) / rMeters);
    const vKmS = vMS / 1000;
    const tSec = 2 * Math.PI * Math.sqrt(Math.pow(rMeters, 3) / (G_UNIVERSAL * body.M));
    const tHours = tSec / 3600;
    const daily = 24 / tHours;
    const gh = (G_UNIVERSAL * body.M) / (rMeters * rMeters);

    // Energies
    const m = p.satelliteMassKg;
    const ke = 0.5 * m * vMS * vMS;
    const pe = - (G_UNIVERSAL * body.M * m) / rMeters;
    const totalE = ke + pe; // = -ke = 0.5 * pe
    const bindE = -totalE;

    // Weightlessness calculations
    let scaleN = 0;
    let weightPct = 0;
    if (p.spacecraftState === 'orbital_freefall') {
      scaleN = 0;
      weightPct = 0;
    } else if (p.spacecraftState === 'powered_burn') {
      scaleN = p.astronautMassKg * p.burnAccelerationMS2;
      weightPct = (p.burnAccelerationMS2 / 9.81) * 100;
    } else {
      scaleN = p.astronautMassKg * 9.81;
      weightPct = 100;
    }

    // Gravimetry / Bouguer anomaly
    const dep = MINERAL_DEPOSITS[p.depositType];
    const baseG = 9.80665;
    // Anomaly in mGal (1 mGal = 10^-5 m/s^2)
    const anomalyFactor = dep.deltaGSign === '+' ? 1 : -1;
    const depthScale = 1000 / Math.max(200, p.depositDepthM);
    const deltaMgal = anomalyFactor * 35.0 * depthScale;
    const measG = baseG + deltaMgal * 1e-5;

    return {
      elapsedTime: simTime,
      orbitalRadiusKm: rMeters / 1000,
      orbitalSpeedKmS: vKmS,
      orbitalPeriodHours: tHours,
      dailyOrbits: daily,
      localGMS2: gh,
      kineticEnergyGJ: ke / 1e9,
      potentialEnergyGJ: pe / 1e9,
      totalEnergyGJ: totalE / 1e9,
      bindingEnergyGJ: bindE / 1e9,
      scaleReadingN: scaleN,
      apparentWeightPct: weightPct,
      baselineG: baseG,
      anomalyDeltaMgal: deltaMgal,
      measuredG: measG,
    };
  };

  const [telemetry, setTelemetry] = useState<TelemetryState>(() => computeTelemetry(initialParams, 0));

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const handleReset = () => {
    setIsPlaying(false);
    lastTimeRef.current = null;
    setTelemetry(computeTelemetry(params, 0));
  };

  const handleResetDefaults = () => {
    setIsPlaying(false);
    lastTimeRef.current = null;
    const restored = { ...initialParams, preset: params.preset };
    setParams(restored);
    setTelemetry(computeTelemetry(restored, 0));
  };

  const handlePresetSelect = (newPreset: PresetMode) => {
    setIsPlaying(true);
    lastTimeRef.current = null;
    let newAlt = params.altitudeKm;
    if (newPreset === 'geostationary_bs1') newAlt = 35786;
    if (newPreset === 'polar_satellite') newAlt = 700;
    if (newPreset === 'orbital_mechanics') newAlt = 2000;

    const next = { ...params, preset: newPreset, altitudeKm: newAlt };
    setParams(next);
    setTelemetry(computeTelemetry(next, 0));
  };

  const handleStep = () => {
    setTelemetry((prev) => computeTelemetry(params, prev.elapsedTime + 1));
  };

  const handleParamsUpdate = (updater: (prev: SimulationParams) => SimulationParams) => {
    setParams((prev) => {
      const next = updater(prev);
      setTelemetry((prevTel) => computeTelemetry(next, prevTel.elapsedTime));
      return next;
    });
  };

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const simDt = dt * (params.slowMo ? 0.25 : 1.0);
      setTelemetry((prev) => computeTelemetry(params, prev.elapsedTime + simDt));

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, params]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F8FAFC] text-slate-800">
      {/* 1. Header */}
      <Header
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'))}
        preset={params.preset}
        onSelectPreset={handlePresetSelect}
        onOpenTheory={() => setIsModalOpen(true)}
        onReset={handleReset}
      />

      {/* 2. Main 3-Column Workspace */}
      <main className="max-w-[1780px] w-full mx-auto p-3 sm:p-4 flex-1 flex flex-col lg:flex-row gap-4 items-start">
        <ControlPanel
          language={language}
          params={params}
          onChangeParams={handleParamsUpdate}
          onResetDefaults={handleResetDefaults}
        />

        <MotionCanvas
          language={language}
          theme={theme}
          params={params}
          telemetry={telemetry}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying((prev) => !prev)}
          onStep={handleStep}
          onReset={handleReset}
          onToggleSlowMo={() => setParams((prev) => ({ ...prev, slowMo: !prev.slowMo }))}
        />

        <AnalyticsPanel
          language={language}
          params={params}
          telemetry={telemetry}
        />
      </main>

      {/* 3. Theory Modal */}
      <TheoryModal
        language={language}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

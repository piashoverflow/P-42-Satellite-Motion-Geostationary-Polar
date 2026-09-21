import React, { useState } from 'react';
import { Header } from './components/Header';
import { SimulationCanvas } from './components/SimulationCanvas';
import { ControlDeck } from './components/ControlDeck';
import { MathFormulaOverlay } from './components/MathFormulaOverlay';
import { P42Mode, DualSatelliteParams, SatelliteKinematicsParams, WeightlessnessParams, GravimetryParams } from './types';

export default function App() {
  const [mode, setMode] = useState<P42Mode>('geostationary_vs_polar');
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [showMath, setShowMath] = useState<boolean>(false);
  const [lang, setLang] = useState<'en' | 'bn'>('bn');
  const [time, setTime] = useState<number>(0);

  const [dualParams, setDualParams] = useState<DualSatelliteParams>({
    showGeostationary: true,
    showPolar: true,
    earthRotationActive: true,
    showFootprintCone: true,
  });

  const [kinematicsParams, setKinematicsParams] = useState<SatelliteKinematicsParams>({
    altitudeKm: 35786, // Geostationary default
    satelliteMassKg: 3500, // Bangabandhu-1 is ~3500 kg
    centralBody: 'earth',
  });

  const [weightlessParams, setWeightlessParams] = useState<WeightlessnessParams>({
    thrusterActive: false,
    thrusterAcc: 4.9,
    capsuleState: 'orbital_freefall',
    astronautMass: 70,
  });

  const [gravimetryParams, setGravimetryParams] = useState<GravimetryParams>({
    sensorAltitudeMeters: 1000,
    depositType: 'dense_metallic_ore',
    depositDepthMeters: 1200,
    depositExcessMass: 1.0,
  });

  const handleReset = () => {
    setTime(0);
  };

  return (
    <div className="min-h-screen bg-[#040d1a] text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-black">
      <Header
        mode={mode}
        setMode={setMode}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        onReset={handleReset}
        speed={speed}
        setSpeed={setSpeed}
        showMath={showMath}
        setShowMath={setShowMath}
        lang={lang}
        setLang={setLang}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 md:p-5 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 flex flex-col items-center justify-center">
          <SimulationCanvas
            mode={mode}
            isRunning={isRunning}
            speed={speed}
            dualParams={dualParams}
            kinematicsParams={kinematicsParams}
            weightlessParams={weightlessParams}
            gravimetryParams={gravimetryParams}
            time={time}
            setTime={setTime}
            lang={lang}
          />
        </div>

        <div className="lg:col-span-1">
          <ControlDeck
            mode={mode}
            dualParams={dualParams}
            setDualParams={setDualParams}
            kinematicsParams={kinematicsParams}
            setKinematicsParams={setKinematicsParams}
            weightlessParams={weightlessParams}
            setWeightlessParams={setWeightlessParams}
            gravimetryParams={gravimetryParams}
            setGravimetryParams={setGravimetryParams}
            lang={lang}
          />
        </div>
      </main>

      <MathFormulaOverlay
        mode={mode}
        show={showMath}
        onClose={() => setShowMath(false)}
        lang={lang}
      />

      {/* Footer */}
      <footer className="bg-slate-950/80 border-t border-slate-900 px-4 py-2.5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span className="font-mono text-slate-400">P-42 Satellite Dynamics & Applications Lab</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Developed by</span>
            <span className="font-bold text-teal-400">Shamsuddin Piash</span>
            <span>• BUET ME '25</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

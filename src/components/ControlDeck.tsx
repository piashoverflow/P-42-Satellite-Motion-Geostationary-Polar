import React from 'react';
import { P42Mode, DualSatelliteParams, SatelliteKinematicsParams, WeightlessnessParams, GravimetryParams } from '../types';
import { Sliders, Satellite, Gauge, ShieldAlert, Search } from 'lucide-react';

interface ControlDeckProps {
  mode: P42Mode;
  dualParams: DualSatelliteParams;
  setDualParams: React.Dispatch<React.SetStateAction<DualSatelliteParams>>;
  kinematicsParams: SatelliteKinematicsParams;
  setKinematicsParams: React.Dispatch<React.SetStateAction<SatelliteKinematicsParams>>;
  weightlessParams: WeightlessnessParams;
  setWeightlessParams: React.Dispatch<React.SetStateAction<WeightlessnessParams>>;
  gravimetryParams: GravimetryParams;
  setGravimetryParams: React.Dispatch<React.SetStateAction<GravimetryParams>>;
  lang: 'en' | 'bn';
}

export const ControlDeck: React.FC<ControlDeckProps> = ({
  mode,
  dualParams,
  setDualParams,
  kinematicsParams,
  setKinematicsParams,
  weightlessParams,
  setWeightlessParams,
  gravimetryParams,
  setGravimetryParams,
  lang,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
        <Sliders className="w-4 h-4 text-teal-400" />
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          {lang === 'bn' ? 'কন্ট্রোল ও প্যারামিটার' : 'Controls & Parameters'}
        </h2>
      </div>

      {/* MODE 1: GEOSTATIONARY VS POLAR */}
      {mode === 'geostationary_vs_polar' && (
        <div className="space-y-4 text-xs">
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={dualParams.showFootprintCone}
                onChange={(e) => setDualParams((p) => ({ ...p, showFootprintCone: e.target.checked }))}
                className="rounded accent-teal-500"
              />
              <span>{lang === 'bn' ? 'বঙ্গবন্ধু-১ কভারেজ কোণ প্রদর্শন' : 'Show BS-1 Coverage Cone'}</span>
            </label>
          </div>

          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1.5">
            <div className="text-teal-400 font-bold">
              {lang === 'bn' ? 'বঙ্গবন্ধু স্যাটেলাইট-১ বিবরণ:' : 'Bangabandhu-1 Specifications:'}
            </div>
            <div>• কক্ষপথ: ভূ-স্থির (Geostationary)</div>
            <div>• স্লট: ১১৯.১° পূর্ব দ্রাঘিমাংশ</div>
            <div>• উচ্চতা: ৩৫,৭৮৬ কিমি</div>
            <div>• আবর্তনকাল: ঠিক ২৪ ঘণ্টা</div>
          </div>
        </div>
      )}

      {/* MODE 2: KINEMATICS */}
      {mode === 'satellite_kinematics_energy' && (
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'কক্ষীয় উচ্চতা h (km)' : 'Orbital Altitude h (km)'}</span>
              <span className="font-mono text-teal-400">{kinematicsParams.altitudeKm.toLocaleString()} km</span>
            </div>
            <input
              type="range"
              min="200"
              max="40000"
              step="200"
              value={kinematicsParams.altitudeKm}
              onChange={(e) =>
                setKinematicsParams((p) => ({ ...p, altitudeKm: parseFloat(e.target.value) }))
              }
              className="w-full accent-teal-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {[
              { name: 'ISS (408 km)', h: 408 },
              { name: 'Hubble (540 km)', h: 540 },
              { name: 'GPS (20,200 km)', h: 20200 },
              { name: 'GEO (35,786 km)', h: 35786 },
            ].map((btn) => (
              <button
                key={btn.name}
                onClick={() => setKinematicsParams((p) => ({ ...p, altitudeKm: btn.h }))}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-[10px] text-slate-300 font-mono text-left"
              >
                {btn.name}
              </button>
            ))}
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'উপগ্রহের ভর m (kg)' : 'Satellite Mass m (kg)'}</span>
              <span className="font-mono text-cyan-400">{kinematicsParams.satelliteMassKg} kg</span>
            </div>
            <input
              type="range"
              min="500"
              max="5000"
              step="100"
              value={kinematicsParams.satelliteMassKg}
              onChange={(e) =>
                setKinematicsParams((p) => ({ ...p, satelliteMassKg: parseFloat(e.target.value) }))
              }
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* MODE 3: WEIGHTLESSNESS */}
      {mode === 'weightlessness_lab' && (
        <div className="space-y-4 text-xs">
          <div>
            <button
              onClick={() => setWeightlessParams((p) => ({ ...p, thrusterActive: !p.thrusterActive }))}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${
                weightlessParams.thrusterActive
                  ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                  : 'bg-teal-500 text-slate-950 shadow-teal-500/20'
              }`}
            >
              {weightlessParams.thrusterActive
                ? (lang === 'bn' ? 'থ্রাস্টার বন্ধ করুন (অবাধ পতন)' : 'Cut Thrusters (Free Fall Orbit)')
                : (lang === 'bn' ? 'কৃত্রিম ত্বরণ চালু করুন' : 'Fire Thrusters (Artificial Gravity)')}
            </button>
          </div>

          {weightlessParams.thrusterActive && (
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>{lang === 'bn' ? 'থ্রাস্টার ত্বরণ a (m/s²)' : 'Thruster Acceleration a (m/s²)'}</span>
                <span className="font-mono text-amber-400">{weightlessParams.thrusterAcc.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="9.8"
                step="0.2"
                value={weightlessParams.thrusterAcc}
                onChange={(e) =>
                  setWeightlessParams((p) => ({ ...p, thrusterAcc: parseFloat(e.target.value) }))
                }
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          )}

          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
            <div className="text-teal-400 font-bold">{lang === 'bn' ? 'মূল সূত্র:' : 'Fundamental Formula:'}</div>
            <div>প্রতিক্রিয়া বল N = m(g - a)</div>
            <div>মুক্ত পতনে a = g, সুতরাং N = 0!</div>
          </div>
        </div>
      )}

      {/* MODE 4: GRAVIMETRY */}
      {mode === 'resource_exploration_gravimetry' && (
        <div className="space-y-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium block mb-1.5">
              {lang === 'bn' ? 'ভূগর্ভস্থ খনিজের ধরন:' : 'Subsurface Target:'}
            </span>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setGravimetryParams((p) => ({ ...p, depositType: 'dense_metallic_ore' }))}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  gravimetryParams.depositType === 'dense_metallic_ore'
                    ? 'bg-teal-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'bn' ? 'ধাতু আকরিক (+Δg)' : 'Metallic Ore (+Δg)'}
              </button>
              <button
                onClick={() => setGravimetryParams((p) => ({ ...p, depositType: 'oil_gas_reservoir' }))}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                  gravimetryParams.depositType === 'oil_gas_reservoir'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'bn' ? 'তেল/গ্যাস (-Δg)' : 'Oil/Gas (-Δg)'}
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-medium mb-1">
              <span>{lang === 'bn' ? 'খনিজের গভীরতা (Depth Meters)' : 'Deposit Depth (m)'}</span>
              <span className="font-mono text-teal-400">{gravimetryParams.depositDepthMeters} m</span>
            </div>
            <input
              type="range"
              min="500"
              max="2500"
              step="100"
              value={gravimetryParams.depositDepthMeters}
              onChange={(e) =>
                setGravimetryParams((p) => ({ ...p, depositDepthMeters: parseInt(e.target.value, 10) }))
              }
              className="w-full accent-teal-500 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

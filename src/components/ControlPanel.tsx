import React from 'react';
import { SimulationParams, PresetMode, Language } from '../types';
import { t } from '../utils/i18n';
import { BODIES, MINERAL_DEPOSITS } from '../utils/physics';
import { 
  Sliders, 
  RotateCcw, 
  Radio, 
  Satellite, 
  Layers, 
  Eye, 
  Sparkles, 
  Search,
  Globe
} from 'lucide-react';

interface ControlPanelProps {
  language: Language;
  params: SimulationParams;
  onChangeParams: (updater: (prev: SimulationParams) => SimulationParams) => void;
  onResetDefaults: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  language,
  params,
  onChangeParams,
  onResetDefaults,
}) => {
  return (
    <aside className="w-full lg:w-80 xl:w-88 shrink-0 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex flex-col gap-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200">
            <Sliders className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-black text-slate-800 tracking-wider uppercase">
            {t(language, 'controlParameters')}
          </h2>
        </div>
        <button
          onClick={onResetDefaults}
          className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50/60 px-2 py-1 rounded-lg border border-slate-200/80 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t(language, 'resetDefaults')}</span>
        </button>
      </div>

      {/* Preset 1: Geostationary BS-1 */}
      {params.preset === 'geostationary_bs1' && (
        <div className="space-y-3.5">
          <div className="p-3 bg-gradient-to-br from-indigo-50/70 to-blue-50/70 rounded-xl border border-indigo-200/80 text-xs">
            <div className="flex items-center gap-2 font-black text-indigo-900 mb-1">
              <Radio className="w-4 h-4 text-indigo-600" />
              <span>বঙ্গবন্ধু স্যাটেলাইট-১ (BS-1) স্পেসিফিকেশন</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
              কক্ষপথ: বিষুবীয় বৃত্তাকার ভূ-স্থির (GEO), দ্রাঘিমাংশ: <strong>১১৯.১° পূর্ব</strong>, আবর্তনকাল: <strong>২৪ ঘণ্টা</strong>, গতিবেগ: <strong>৩.০৭ কিমি/সে</strong>।
            </p>
          </div>

          {/* Altitude Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">{t(language, 'altitude')}</span>
              <span className="font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {params.altitudeKm.toLocaleString()} km
              </span>
            </div>
            <input
              type="range"
              min={30000}
              max={42000}
              step={100}
              value={params.altitudeKm}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChangeParams((p) => ({ ...p, altitudeKm: val }));
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>30,000 km</span>
              <span className="font-bold text-indigo-600">GEO: 35,786 km</span>
              <span>42,000 km</span>
            </div>
          </div>

          {/* Satellite Mass */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">{t(language, 'satelliteMass')}</span>
              <span className="font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {params.satelliteMassKg} kg (BS-1)
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={6000}
              step={100}
              value={params.satelliteMassKg}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChangeParams((p) => ({ ...p, satelliteMassKg: val }));
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Preset 2: Polar Satellite */}
      {params.preset === 'polar_satellite' && (
        <div className="space-y-3.5">
          <div className="p-3 bg-gradient-to-br from-violet-50/70 to-purple-50/70 rounded-xl border border-violet-200/80 text-xs">
            <div className="flex items-center gap-2 font-black text-violet-900 mb-1">
              <Satellite className="w-4 h-4 text-violet-600" />
              <span>মেরু উপগ্রহ (Polar Sun-Synchronous LEO)</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
              উত্তর-দক্ষিণ মেরু অতিক্রম করে পৃথিবীকে ৯০-১০০ মিনিটে একবার প্রদক্ষিণ করে। পৃথিবী নিচে ঘোরে বিধায় ২৪ ঘণ্টায় ১০০% ভূপৃষ্ঠ স্ক্যান সম্পন্ন হয়।
            </p>
          </div>

          {/* Altitude Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">{t(language, 'altitude')}</span>
              <span className="font-mono font-black text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200">
                {params.altitudeKm} km
              </span>
            </div>
            <input
              type="range"
              min={250}
              max={1500}
              step={25}
              value={params.altitudeKm}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChangeParams((p) => ({ ...p, altitudeKm: val }));
              }}
              className="w-full accent-violet-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>250 km (ISS ~400)</span>
              <span>700 km (Earth Obs)</span>
              <span>1500 km</span>
            </div>
          </div>
        </div>
      )}

      {/* Preset 3: Orbital Mechanics & Energy */}
      {params.preset === 'orbital_mechanics' && (
        <div className="space-y-3.5">
          {/* Celestial Body Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">{t(language, 'selectBody')}</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['earth', 'moon', 'mars'] as const).map((bodyKey) => {
                const b = BODIES[bodyKey];
                const isSel = params.centralBody === bodyKey;
                return (
                  <button
                    key={bodyKey}
                    onClick={() => onChangeParams((p) => ({ ...p, centralBody: bodyKey }))}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isSel
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {b.nameEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Altitude Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">{t(language, 'altitude')}</span>
              <span className="font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {params.altitudeKm.toLocaleString()} km
              </span>
            </div>
            <input
              type="range"
              min={300}
              max={40000}
              step={200}
              value={params.altitudeKm}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChangeParams((p) => ({ ...p, altitudeKm: val }));
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Mass Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">{t(language, 'satelliteMass')}</span>
              <span className="font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {params.satelliteMassKg} kg
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={5000}
              step={100}
              value={params.satelliteMassKg}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChangeParams((p) => ({ ...p, satelliteMassKg: val }));
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Preset 4: Weightlessness */}
      {params.preset === 'weightlessness' && (
        <div className="space-y-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">{t(language, 'spacecraftMode')}</label>
            <div className="flex flex-col gap-1.5">
              {[
                { id: 'orbital_freefall', label: 'কক্ষীয় মুক্ত পতন (N = 0, ওজনহীন)', desc: 'মহাকর্ষ ত্বরণ a = g, প্রতিক্রিয়া বল শূন্য' },
                { id: 'powered_burn', label: 'রকেট ইঞ্জিন থ্রাস্ট (N = m(g + a))', desc: 'ত্বরণমুখী থ্রাস্টে কৃত্রিম ওজন সৃষ্টি' },
                { id: 'surface_rest', label: 'ভূপৃষ্ঠে স্থির (N = mg, স্বাভাবিক ওজন)', desc: 'স্বাভাবিক ১g প্রতিক্রিয়া বল' },
              ].map((m) => {
                const isSel = params.spacecraftState === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => onChangeParams((p) => ({ ...p, spacecraftState: m.id as any }))}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      isSel
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">{m.label}</div>
                    <div className="text-[10px] text-slate-500">{m.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Astronaut Mass */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">{t(language, 'astronautMass')}</span>
              <span className="font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {params.astronautMassKg} kg
              </span>
            </div>
            <input
              type="range"
              min={40}
              max={120}
              step={1}
              value={params.astronautMassKg}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChangeParams((p) => ({ ...p, astronautMassKg: val }));
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Thrust acceleration if powered burn */}
          {params.spacecraftState === 'powered_burn' && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">{t(language, 'burnAcc')}</span>
                <span className="font-mono font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {params.burnAccelerationMS2} m/s²
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={25}
                step={0.5}
                value={params.burnAccelerationMS2}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChangeParams((p) => ({ ...p, burnAccelerationMS2: val }));
                }}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
          )}
        </div>
      )}

      {/* Preset 5: Mineral Exploration */}
      {params.preset === 'mineral_exploration' && (
        <div className="space-y-3.5">
          {/* Subsurface Deposit Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">{t(language, 'selectDeposit')}</label>
            <div className="flex flex-col gap-1.5">
              {(Object.keys(MINERAL_DEPOSITS) as Array<keyof typeof MINERAL_DEPOSITS>).map((key) => {
                const dep = MINERAL_DEPOSITS[key];
                const isSel = params.depositType === key;
                return (
                  <button
                    key={key}
                    onClick={() => onChangeParams((p) => ({ ...p, depositType: key }))}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSel
                        ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">{dep.nameBn}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{dep.densityDesc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deposit Depth */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">{t(language, 'depositDepth')}</span>
              <span className="font-mono font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {params.depositDepthM} m
              </span>
            </div>
            <input
              type="range"
              min={200}
              max={2500}
              step={50}
              value={params.depositDepthM}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChangeParams((p) => ({ ...p, depositDepthM: val }));
              }}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Visualizer Toggles */}
      <div className="border-t border-slate-100 pt-3 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>{t(language, 'visualizerToggles')}</span>
        </div>

        <div className="space-y-1.5 text-xs">
          <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 cursor-pointer">
            <span className="font-semibold text-slate-700">{t(language, 'showVectors')}</span>
            <input
              type="checkbox"
              checked={params.showVectors}
              onChange={(e) => onChangeParams((p) => ({ ...p, showVectors: e.target.checked }))}
              className="rounded text-indigo-600 accent-indigo-600 cursor-pointer"
            />
          </label>

          {params.preset !== 'mineral_exploration' && params.preset !== 'weightlessness' && (
            <>
              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 cursor-pointer">
                <span className="font-semibold text-slate-700">{t(language, 'showCoverageCone')}</span>
                <input
                  type="checkbox"
                  checked={params.showCoverageCone}
                  onChange={(e) => onChangeParams((p) => ({ ...p, showCoverageCone: e.target.checked }))}
                  className="rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 cursor-pointer">
                <span className="font-semibold text-slate-700">{t(language, 'earthRotation')}</span>
                <input
                  type="checkbox"
                  checked={params.earthRotationActive}
                  onChange={(e) => onChangeParams((p) => ({ ...p, earthRotationActive: e.target.checked }))}
                  className="rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                />
              </label>
            </>
          )}

          {params.preset === 'orbital_mechanics' && (
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/60 cursor-pointer">
              <span className="font-semibold text-slate-700">{t(language, 'showEnergyBars')}</span>
              <input
                type="checkbox"
                checked={params.showEnergyBars}
                onChange={(e) => onChangeParams((p) => ({ ...p, showEnergyBars: e.target.checked }))}
                className="rounded text-indigo-600 accent-indigo-600 cursor-pointer"
              />
            </label>
          )}
        </div>
      </div>
    </aside>
  );
};

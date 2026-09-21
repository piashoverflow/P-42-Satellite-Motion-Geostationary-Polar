import React, { useRef, useEffect } from 'react';
import { SimulationParams, TelemetryState, Language } from '../types';
import { t } from '../utils/i18n';
import { fmtNum, fmtSci, BODIES, MINERAL_DEPOSITS, G_UNIVERSAL } from '../utils/physics';
import { 
  Activity, 
  BarChart3, 
  Zap, 
  Satellite, 
  Radio, 
  Sparkles, 
  Search 
} from 'lucide-react';

interface AnalyticsPanelProps {
  language: Language;
  params: SimulationParams;
  telemetry: TelemetryState;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  language,
  params,
  telemetry,
}) => {
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const body = BODIES[params.centralBody];

  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Dark canvas background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(35, 15);
    ctx.lineTo(35, h - 22);
    ctx.lineTo(w - 10, h - 22);
    ctx.stroke();

    ctx.font = '9px JetBrains Mono';
    ctx.fillStyle = '#94a3b8';

    if (params.preset === 'mineral_exploration') {
      // Bouguer Anomaly curve Δg across terrain
      ctx.fillText('Δg (mGal)', 10, 18);
      ctx.fillText('x (km)', w - 40, h - 8);

      const midY = (h - 22) * 0.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(35, midY);
      ctx.lineTo(w - 10, midY);
      ctx.stroke();
      ctx.setLineDash([]);

      const dep = MINERAL_DEPOSITS[params.depositType];
      ctx.strokeStyle = dep.deltaGSign === '+' ? '#10b981' : '#f43f5e';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const sign = dep.deltaGSign === '+' ? -1 : 1;
      const peakAmp = 35;
      for (let px = 0; px <= w - 45; px += 2) {
        const dx = (px - (w - 45) / 2) * 15;
        const rSq = dx * dx + params.depositDepthM * params.depositDepthM;
        const val = peakAmp * Math.pow((params.depositDepthM * params.depositDepthM) / rSq, 1.5);
        const py = midY + sign * val;

        if (px === 0) ctx.moveTo(35 + px, py);
        else ctx.lineTo(35 + px, py);
      }
      ctx.stroke();

      // Peak label
      ctx.fillStyle = dep.deltaGSign === '+' ? '#10b981' : '#f43f5e';
      ctx.fillText(`Δg_peak = ${fmtNum(telemetry.anomalyDeltaMgal, 1)} mGal`, (w - 45) / 2 + 10, sign === -1 ? midY - 22 : midY + 30);

    } else if (params.preset === 'weightlessness') {
      // Normal Force vs Thrust acceleration
      ctx.fillText('N (N)', 12, 18);
      ctx.fillText('a (m/s²)', w - 45, h - 8);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(35, h - 22);
      ctx.lineTo(w - 20, 20);
      ctx.stroke();

      // Current probe point
      const curAcc = params.spacecraftState === 'powered_burn' ? params.burnAccelerationMS2 : 0;
      const ptX = 35 + (curAcc / 25) * (w - 55);
      const ptY = (h - 22) - (telemetry.scaleReadingN / 2000) * (h - 42);

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(Math.min(w - 12, ptX), Math.max(15, Math.min(h - 24, ptY)), 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ef4444';
      ctx.fillText(`N = ${fmtNum(telemetry.scaleReadingN, 0)} N`, ptX - 10, Math.max(22, ptY - 8));

    } else {
      // Orbital Velocity v vs Altitude h
      ctx.fillText('v (km/s)', 12, 18);
      ctx.fillText('h (km)', w - 40, h - 8);

      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const maxAlt = 40000;
      for (let px = 0; px <= w - 45; px += 2) {
        const altKm = (px / (w - 45)) * maxAlt;
        const rMeters = body.R + altKm * 1000;
        const vKmS = Math.sqrt((G_UNIVERSAL * body.M) / rMeters) / 1000;
        // Map 0 - 8 km/s to chart height
        const py = (h - 22) - (vKmS / 8.5) * (h - 40);

        if (px === 0) ctx.moveTo(35 + px, py);
        else ctx.lineTo(35 + px, py);
      }
      ctx.stroke();

      // Current altitude marker
      const curX = 35 + (params.altitudeKm / maxAlt) * (w - 45);
      const curY = (h - 22) - (telemetry.orbitalSpeedKmS / 8.5) * (h - 40);

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(Math.min(w - 12, curX), Math.max(15, Math.min(h - 24, curY)), 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`v = ${fmtNum(telemetry.orbitalSpeedKmS, 2)} km/s`, Math.min(w - 70, curX - 25), curY - 8);
    }
  }, [params, telemetry, body]);

  return (
    <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-3">
      {/* 1. Live Telemetry Metrics */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200">
            <Activity className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-black text-slate-800 tracking-wider uppercase">
            {t(language, 'telemetryTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Orbital Speed */}
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'orbitalSpeed')}</span>
            <span className="font-mono font-black text-indigo-700 text-sm mt-0.5">
              {fmtNum(telemetry.orbitalSpeedKmS, 2)} km/s
            </span>
          </div>

          {/* Orbital Period */}
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'orbitalPeriod')}</span>
            <span className="font-mono font-black text-emerald-700 text-sm mt-0.5">
              {telemetry.orbitalPeriodHours >= 1 
                ? `${fmtNum(telemetry.orbitalPeriodHours, 2)} h`
                : `${fmtNum(telemetry.orbitalPeriodHours * 60, 1)} min`}
            </span>
          </div>

          {/* Local g */}
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'localGravity')}</span>
            <span className="font-mono font-black text-cyan-700 text-sm mt-0.5">
              {fmtNum(telemetry.localGMS2, 2)} m/s²
            </span>
          </div>

          {/* Daily Passes */}
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'dailyPasses')}</span>
            <span className="font-mono font-black text-slate-900 text-sm mt-0.5">
              {fmtNum(telemetry.dailyOrbits, 1)} বার/দিন
            </span>
          </div>

          {/* Weightlessness specifics */}
          {params.preset === 'weightlessness' && (
            <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-col col-span-2">
              <span className="text-[10px] text-amber-800 font-bold uppercase">{t(language, 'apparentWeight')}</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="font-mono font-black text-amber-950 text-base">
                  N = {fmtNum(telemetry.scaleReadingN, 1)} N
                </span>
                <span className={`text-xs font-black ${telemetry.scaleReadingN < 5 ? 'text-emerald-700' : 'text-slate-700'}`}>
                  {telemetry.scaleReadingN < 5 ? '★ ১০০% ওজনহীন (0g)' : `${fmtNum(telemetry.apparentWeightPct, 0)}% কার্যকর ওজন`}
                </span>
              </div>
            </div>
          )}

          {/* Mineral Exploration specifics */}
          {params.preset === 'mineral_exploration' && (
            <>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'bouguerAnomaly')}</span>
                <span className={`font-mono font-black text-sm mt-0.5 ${telemetry.anomalyDeltaMgal >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                  {fmtNum(telemetry.anomalyDeltaMgal, 1)} mGal
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{t(language, 'gravimeterReading')}</span>
                <span className="font-mono font-black text-slate-900 text-sm mt-0.5">
                  {fmtNum(telemetry.measuredG, 4)} m/s²
                </span>
              </div>
            </>
          )}
        </div>

        {/* Real-time Graph */}
        <div className="mt-1 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            <span>
              {params.preset === 'mineral_exploration'
                ? 'বোগার মহাকর্ষ অ্যানোমালি বক্ররেখা (Δg vs x)'
                : params.preset === 'weightlessness'
                ? 'প্রতিক্রিয়া বল ও ত্বরণ লেখচিত্র (N vs a)'
                : 'উচ্চতা বনাম কক্ষীয় দ্রুতি লেখচিত্র (v vs h)'}
            </span>
          </span>
          <div className="w-full h-28 bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
            <canvas ref={chartCanvasRef} width={340} height={112} className="w-full h-full block" />
          </div>
        </div>
      </div>

      {/* 2. Step-by-Step Mathematical Proof */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 flex flex-col gap-2.5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <div className="p-1 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase">
            {t(language, 'exactMathTitle')}
          </h3>
        </div>

        {params.preset === 'geostationary_bs1' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-indigo-800 font-black block">১. ভূ-স্থির উপগ্রহের উচ্চতা প্রতিপাদন (BS-1):</span>
              <p className="text-slate-700 font-medium">
                T = 24 h = 86,400 s এবং ω = 2π / 86400 = 7.27 × 10⁻⁵ rad/s
              </p>
              <p className="text-slate-700 font-medium">
                r = (GMT² / 4π²)^(1/3) = 42,164 km
              </p>
              <p className="text-emerald-700 font-bold mt-1">
                ➔ h = r - R = 42,164 - 6,378 = 35,786 km
              </p>
              <p className="text-slate-900 font-bold">
                কক্ষীয় বেগ: v = 2πr / T = 3.07 km/s (পশ্চিম হতে পূর্বে)
              </p>
            </div>
          </div>
        )}

        {params.preset === 'polar_satellite' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-violet-800 font-black block">২. মেরু উপগ্রহের গাণিতিক সম্পর্ক (Polar LEO):</span>
              <p className="text-slate-700 font-medium">
                r = R + h = 6,371 + {params.altitudeKm} = {6371 + params.altitudeKm} km
              </p>
              <p className="text-slate-700 font-medium">
                v = √(GM / r) = {fmtNum(telemetry.orbitalSpeedKmS, 2)} km/s
              </p>
              <p className="text-indigo-700 font-bold mt-1">
                ➔ আবর্তনকাল T = 2πr / v = {fmtNum(telemetry.orbitalPeriodHours * 60, 1)} মিনিট
              </p>
              <p className="text-slate-900 font-bold">
                দৈনিক আবর্তন: {fmtNum(telemetry.dailyOrbits, 1)} বার (১০০% ভূপৃষ্ঠ ম্যাপিং)
              </p>
            </div>
          </div>
        )}

        {params.preset === 'orbital_mechanics' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-indigo-800 font-black block">৩. ভিরিয়াল উপপাদ্য ও শক্তি প্রতিপাদন:</span>
              <p className="text-slate-700 font-medium">
                K = ½ m v² = GMm / (2r) = +{fmtNum(telemetry.kineticEnergyGJ, 2)} GJ
              </p>
              <p className="text-slate-700 font-medium">
                U = - GMm / r = {fmtNum(telemetry.potentialEnergyGJ, 2)} GJ
              </p>
              <p className="text-emerald-700 font-bold mt-1">
                ➔ E = K + U = - GMm / (2r) = - K = ½ U = {fmtNum(telemetry.totalEnergyGJ, 2)} GJ
              </p>
              <p className="text-slate-900 font-bold">
                কক্ষপথ মুক্ত করতে প্রয়োজনীয় বন্ধন শক্তি: E_b = +{fmtNum(telemetry.bindingEnergyGJ, 2)} GJ
              </p>
            </div>
          </div>
        )}

        {params.preset === 'weightlessness' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-amber-800 font-black block">৪. ওজনহীনতার প্রকৃত নিউটনিয়ান ব্যাখ্যা:</span>
              <p className="text-slate-700 font-medium">
                মহাকাশযানের মেঝের প্রতিক্রিয়া বল: N = m(g - a)
              </p>
              <p className="text-slate-700 font-medium">
                কক্ষীয় মুক্ত পতনে কেন্দ্রমুখী ত্বরণ a = g = v²/r
              </p>
              <p className="text-emerald-700 font-bold mt-1">
                ➔ N = m(g - g) = 0 N (মেঝে কোনো ধাক্কা দেয় না!)
              </p>
              <p className="text-slate-500 text-[11px] font-sans">
                *মনে রাখা আবশ্যক: কক্ষপথে অভিকর্ষজ ত্বরণ শূন্য নয় (g ≈ ৮.৭ m/s²), কিন্তু প্রতিক্রিয়া বল N = ০ বিধায় ওজনহীন অনুভূত হয়!
              </p>
            </div>
          </div>
        )}

        {params.preset === 'mineral_exploration' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-amber-800 font-black block">৫. বোগার মহাকর্ষীয় অসঙ্গতি (Bouguer Anomaly):</span>
              <p className="text-slate-700 font-medium">
                Δg_B = 2π G · Δρ · d = (g_observed - g_theoretical)
              </p>
              <p className="text-slate-700 font-medium">
                1 mGal = 10⁻⁵ m/s² (সংবেদনশীল গ্র্যাভিমিটার)
              </p>
              <p className={`font-bold mt-1 ${telemetry.anomalyDeltaMgal >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                {telemetry.anomalyDeltaMgal >= 0 
                  ? '➔ ধনাত্মক অ্যানোমালি (+Δg): ভারী ধাতব খনিজ / ম্যাগনেটাইট আকরিক'
                  : '➔ ঋণাত্মক অ্যানোমালি (-Δg): কম ঘনত্বের গ্যাস ক্ষেত্র / ভূগর্ভস্থ লবণ স্তর'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

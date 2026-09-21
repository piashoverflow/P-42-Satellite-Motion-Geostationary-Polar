import React from 'react';
import { MathView } from './MathView';
import { P42Mode } from '../types';
import { BookOpen, X } from 'lucide-react';

interface MathFormulaOverlayProps {
  mode: P42Mode;
  show: boolean;
  onClose: () => void;
  lang: 'en' | 'bn';
}

export const MathFormulaOverlay: React.FC<MathFormulaOverlayProps> = ({
  mode,
  show,
  onClose,
  lang,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-teal-500/30 rounded-2xl max-w-3xl w-full p-6 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-teal-400" />
          <h2 className="text-xl font-bold text-white">
            {lang === 'bn' ? 'P-42 কৃত্রিম উপগ্রহ ও মহাকর্ষীয় অ্যাপ্লিকেশনের সূত্র' : 'P-42 Satellite Dynamics & Geophysics Equations'}
          </h2>
        </div>

        <div className="space-y-6 text-sm">
          {/* Orbital Velocity & Period */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-teal-400 font-bold text-base">
              {lang === 'bn' ? '১. কৃত্রিম উপগ্রহের কক্ষীয় বেগ ও পর্যায়কাল' : '1. Satellite Orbital Velocity & Period'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900 rounded-lg text-center">
                <div className="text-xs text-slate-400 mb-1">{lang === 'bn' ? 'কক্ষীয় বেগ (v)' : 'Orbital Velocity (v)'}</div>
                <MathView math="v = \sqrt{\frac{GM}{R+h}} = R\sqrt{\frac{g}{R+h}}" block />
              </div>
              <div className="p-3 bg-slate-900 rounded-lg text-center">
                <div className="text-xs text-slate-400 mb-1">{lang === 'bn' ? 'আবর্তনকাল (T)' : 'Orbital Period (T)'}</div>
                <MathView math="T = \frac{2\pi(R+h)^{3/2}}{\sqrt{GM}}" block />
              </div>
            </div>
          </div>

          {/* Geostationary Height */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-cyan-400 font-bold text-base">
              {lang === 'bn' ? '২. ভূ-স্থির উপগ্রহের উচ্চতা (বঙ্গবন্ধু স্যাটেলাইট-১)' : '2. Geostationary Altitude (Bangabandhu-1)'}
            </h3>
            <p className="text-slate-300">
              {lang === 'bn'
                ? 'আবর্তনকাল T = ২৪ ঘণ্টা = ৮৬,৪০০ সেকেন্ড বসালে ভূ-স্থির কক্ষপথের উচ্চতা পাওয়া যায়:'
                : 'Setting T = 24 hours = 86,400 seconds yields the geostationary orbit altitude:'}
            </p>
            <div className="p-3 bg-slate-900 rounded-lg text-center font-mono text-cyan-300">
              <MathView math="h = \left(\frac{GMT^2}{4\pi^2}\right)^{1/3} - R \approx 35,786\text{ km}" block />
            </div>
          </div>

          {/* Energy & Virial Theorem */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-emerald-400 font-bold text-base">
              {lang === 'bn' ? '৩. উপগ্রহের শক্তি ও বন্ধন শক্তি' : '3. Satellite Energies & Binding Energy'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="p-2.5 bg-slate-900 rounded-lg text-center">
                <div className="text-xs text-slate-400 mb-1">Kinetic Energy K</div>
                <MathView math="K = +\frac{GMm}{2(R+h)}" block />
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg text-center">
                <div className="text-xs text-slate-400 mb-1">Potential Energy U</div>
                <MathView math="U = -\frac{GMm}{R+h}" block />
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg text-center">
                <div className="text-xs text-slate-400 mb-1">Total Mechanical E</div>
                <MathView math="E = -\frac{GMm}{2(R+h)}" block />
              </div>
            </div>
          </div>

          {/* Weightlessness & Gravimetry */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-amber-400 font-bold text-base">
              {lang === 'bn' ? '৪. ওজনহীনতা ও মহাকর্ষীয় এনোমালি (Δg)' : '4. Weightlessness & Gravimetric Exploration'}
            </h3>
            <div className="p-3 bg-slate-900 rounded-lg text-center font-mono text-amber-300">
              <MathView math="N = m(g - a_c) = m(g - g) = 0 \quad \text{(অবাধ পতনে মেঝে কোনো বল দেয় না)}" block />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {lang === 'bn'
                ? 'ভূগর্ভে অতিরিক্ত ঘনত্বের খনিজ থাকলে অভিকর্ষের সামান্য পরিবর্তন ঘটে (Δg)। স্প্রিং গ্র্যাভিমিটার বা স্যাটেলাইট গ্র্যাভিমেট্রি দিয়ে এই এনোমালি মেপে পেট্রোলিয়াম বা খনিজ ভাণ্ডার চিহ্নিত করা হয়।'
                : 'Subterranean density contrasts cause tiny gravity variations (Δg). Airborne and satellite gravimeters detect these anomalies to locate metallic deposits and hydrocarbon reservoirs.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

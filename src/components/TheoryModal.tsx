import React from 'react';
import { Language } from '../types';
import { t } from '../utils/i18n';
import { X, BookOpen, GraduationCap, Satellite, Radio, Sparkles, Search } from 'lucide-react';

interface TheoryModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({
  language,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5 text-slate-900">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {language === 'bn' ? 'তত্ত্ব ও একাডেমিক প্রমাণ (P-42)' : 'Theory & Derivations (P-42)'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                HSC Physics 1st Paper, Chapter 6: কৃত্রিম উপগ্রহের গতি, বঙ্গবন্ধু স্যাটেলাইট-১, মেরু উপগ্রহ ও মহাকর্ষ জরিপ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 text-slate-700 text-sm leading-relaxed">
          {/* Section 1: Orbital Speed & Height */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              ১. কৃত্রিম উপগ্রহের কক্ষীয় দ্রুতি ও উচ্চতা নির্ণয় (Orbital Velocity & Altitude)
            </h3>
            <p>
              ভূপৃষ্ঠ হতে h উচ্চতায় r = R + h ব্যাসার্ধের কক্ষপথে m ভরের উপগ্রহ প্রদক্ষিণ করলে মহাকর্ষ বলই প্রয়োজনীয় কেন্দ্রমুখী বল যোগায়:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center text-xs font-bold text-slate-900 space-y-1">
              <p>F_g = F_c &nbsp;➔&nbsp; GMm / (R + h)² = m v² / (R + h)</p>
              <p className="text-indigo-800 text-sm">v = √[GM / (R + h)] = R √[g / (R + h)]</p>
              <p className="text-slate-600 pt-1">আবর্তনকাল T = 2π(R + h) / v = 2π √[(R + h)³ / GM]</p>
              <p className="text-emerald-800">উপগ্রহের উচ্চতা: h = [(GMT² / 4π²)^(1/3)] - R</p>
            </div>
          </div>

          {/* Section 2: Bangabandhu Satellite-1 (GEO) */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              ২. ভূ-স্থির উপগ্রহ ও বঙ্গবন্ধু স্যাটেলাইট-১ (Bangabandhu Satellite-1)
            </h3>
            <p>
              যেসব কৃত্রিম উপগ্রহের আবর্তনকাল পৃথিবীর আহ্নিক গতির পর্যায়কালের সমান (T = ২৪ ঘণ্টা = ৮৬,৪০০ সেকেন্ড) এবং যারা পৃথিবীর আবর্তনের অভিমুখে (পশ্চিম হতে পূর্বে) নিরক্ষীয় তলে প্রদক্ষিণ করে, ভূপৃষ্ঠের সাপেক্ষে তাদের স্থির মনে হয়।
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 space-y-1">
                <strong className="text-indigo-950 font-bold block">★ বঙ্গবন্ধু স্যাটেলাইট-১ পরামিতি:</strong>
                <p>• দ্রাঘিমাংশ স্লট: <strong>১১৯.১° পূর্ব</strong></p>
                <p>• ভূপৃষ্ঠ হতে উচ্চতা: <strong>h ≈ ৩৫,৭৮৬ কিমি</strong></p>
                <p>• কক্ষীয় দ্রুতি: <strong>v ≈ ৩.০৭ কিমি/সে</strong></p>
                <p>• ভূ-কেন্দ্রীয় ব্যাসার্ধ: <strong>r ≈ ৪২,১৬৪ কিমি</strong></p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border space-y-1">
                <strong className="text-slate-900 font-bold block">★ ভূ-স্থির উপগ্রহের ৪টি আবশ্যিক শর্ত:</strong>
                <p>১. আবর্তনকাল ঠিক ২৪ ঘণ্টা হতে হবে।</p>
                <p>২. নিরক্ষরেখার ঠিক উপরিভাগে (0° নতি) থাকতে হবে।</p>
                <p>৩. ঘূর্ণন দিক পশ্চিম হতে পূর্বে হতে হবে।</p>
                <p>৪. কক্ষপথ অবশ্যই সুষম বৃত্তাকার হতে হবে।</p>
              </div>
            </div>
          </div>

          {/* Section 3: Polar vs Geostationary */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-600" />
              ৩. মেরু উপগ্রহ (Polar Satellites) বনাম ভূ-স্থির উপগ্রহ
            </h3>
            <p>
              মেরু উপগ্রহগুলো সাধারণত নিচু কক্ষপথে (LEO: ৫০০ - ৮০০ কিমি) উত্তর ও দক্ষিণ মেরু বরাবর ৯০° নতিতে প্রদক্ষিণ করে।
            </p>
            <ul className="text-xs space-y-1 list-disc list-inside text-slate-700">
              <li><strong>আবর্তনকাল:</strong> মাত্র ৯০ থেকে ১০০ মিনিট (দৈনিক প্রায় ১৪ থেকে ১৫ বার পৃথিবীকে চক্কর দেয়)।</li>
              <li><strong>গ্লোবাল কভারেজ:</strong> উপগ্রহ যখন উত্তর-দক্ষিণে ঘোরে, পৃথিবী তার নিচে পশ্চিমে-পূর্বে ঘোরে। ফলে ২৪ ঘণ্টার মধ্যে গোটা ভূপৃষ্ঠের ১০০% উচ্চ রেজোলিউশনের ছবি স্ক্যান করা সম্ভব হয়।</li>
              <li><strong>ব্যবহার:</strong> আবহাওয়া পূর্বাভাস, সামরিক গোয়েন্দা নজরদারি, ভূ-সম্পদ মানচিত্রায়ণ, ও জলবায়ু পরিবর্তন ট্র্যাকিং।</li>
            </ul>
          </div>

          {/* Section 4: Virial Theorem & Energy */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              ৪. উপগ্রহের শক্তি ও ভিরিয়াল উপপাদ্য (Virial Theorem)
            </h3>
            <p>
              মহাকর্ষীয় বলের অধীনে আবদ্ধ যেকোনো কক্ষপথে শক্তি বন্টনের সম্পর্ক:
            </p>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl font-mono text-center text-xs font-bold text-emerald-950 space-y-1">
              <p>গতিশক্তি (Kinetic): K = ½ mv² = + GMm / 2r</p>
              <p>বিভবশক্তি (Potential): U = - GMm / r</p>
              <p className="text-sm text-emerald-800">মোট শক্তি (Total): E = K + U = - GMm / 2r = - K = ½ U</p>
              <p className="text-slate-700 pt-1">বন্ধন শক্তি (Binding Energy): E_b = + GMm / 2r</p>
            </div>
          </div>

          {/* Section 5: True Meaning of Weightlessness */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              ৫. কক্ষপথে ওজনহীনতার প্রকৃত নিউটনীয় রহস্য
            </h3>
            <p>
              অনেকের ভুল ধারণা রয়েছে যে মহাকাশে বা উপগ্রহে অভিকর্ষ বল বা g নেই বলে নভোচারীরা ভাসেন। এটি সম্পূর্ণ ভ্রান্ত!
            </p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-1">
              <p>
                ৪০০ কিমি উচ্চতায় আন্তর্জাতিক মহাকাশ স্টেশনে (ISS) অভিকর্ষজ ত্বরণ <strong>g ≈ ৮.৭ m/s²</strong>, যা ভূপৃষ্ঠের প্রায় ৯০%!
              </p>
              <p>
                <strong>তাহলে ওজনহীন কেন?</strong> মহাকাশযান এবং তার ভিতরের নভোচারী উভয়েই একই সাথে পৃথিবীর দিকে অভিকর্ষের প্রভাবে মুক্তভাবে পড়তে থাকেন (a = g)। ফলে মহাকাশযানের মেঝে নভোচারীর পায়ের ওপর কোনো ঊর্ধ্বমুখী প্রতিক্রিয়া বল দিতে পারে না (N = m(g - a) = 0)। প্রতিক্রিয়া বল শূন্য বলেই নভোচারী ওজনহীনতা অনুভব করেন!
              </p>
            </div>
          </div>

          {/* Section 6: Gravimetry & Mineral Exploration */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
              ৬. মহাকর্ষ জরিপ ও ভূগর্ভস্থ খনিজ অনুসন্ধান (Bouguer Anomaly)
            </h3>
            <p>
              ভূপৃষ্ঠের বিভিন্ন স্থানে সংবেদনশীল গ্র্যাভিমিটারের সাহায্যে অভিকর্ষজ ত্বরণের স্থানীয় বিচ্যুতির (Δg = g_obs - g_theo) মাধ্যমে খনিজ ভাণ্ডার চিহ্নিত করা হয়:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center text-xs font-bold text-slate-900 space-y-1">
              <p>বোগার অ্যানোমালি: Δg_B = 2π G · Δρ · h</p>
              <p className="text-emerald-800 text-xs font-sans">
                • ধনাত্মক অ্যানোমালি (+Δg): ভারী ধাতব আকরিক (লোহা/ম্যাগনেটাইট, ρ &gt; ৪,৫০০ kg/m³)<br />
                • ঋণাত্মক অ্যানোমালি (-Δg): খনিজ তেল, গ্যাস বা লবণ গম্বুজ (ρ &lt; ২,২০০ kg/m³)
              </p>
            </div>
          </div>

          {/* Section 7: Udvash Admission Tips */}
          <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200 space-y-2">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
              <GraduationCap className="w-4 h-4" />
              <span>উদ্ভাস ভর্তি পরীক্ষা স্পেশাল টিপস (BUET / Medical / DU Admission)</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
              <li>
                <strong>উপগ্রহের ভরের ফাঁদ:</strong> উপগ্রহের কক্ষীয় দ্রুতি (v) এবং আবর্তনকাল (T) উপগ্রহের নিজস্ব ভর (m) এর ওপর নির্ভর করে না! তবে গতিশক্তি, বিভবশক্তি এবং বন্ধন শক্তি ভরের সমানুপাতিক।
              </li>
              <li>
                <strong>শক্তির অনুপাত:</strong> K : U : E = 1 : -2 : -1। ভর্তি পরীক্ষায় প্রায়ই আসে: যদি মোট শক্তি E হয়, তবে বিভবশক্তি কত? উত্তর: U = 2E।
              </li>
              <li>
                <strong>উপগ্রহকে মুক্ত করতে প্রয়োজনীয় বেগ:</strong> কক্ষপথে ঘূর্ণায়মান উপগ্রহকে অসীমে পাঠাতে প্রয়োজনীয় বেগ v_esc = √2 · v_orbit ≈ ১.৪১৪ গুণ। অর্থাৎ দ্রুতি ৪১.৪% বৃদ্ধি করতে হবে।
              </li>
              <li>
                <strong>উচ্চতা বাড়লে কী ঘটে:</strong> h বৃদ্ধি পেলে কক্ষীয় দ্রুতি (v) হ্রাস পায় কিন্তু আবর্তনকাল (T) বৃদ্ধি পায়।
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

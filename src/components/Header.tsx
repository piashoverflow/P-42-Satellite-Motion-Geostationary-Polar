import React from 'react';
import { PresetMode, Language } from '../types';
import { t } from '../utils/i18n';
import { 
  Satellite, 
  BookOpen, 
  RotateCcw, 
  GraduationCap, 
  Globe, 
  Compass, 
  Radio, 
  Sparkles,
  Search
} from 'lucide-react';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  preset: PresetMode;
  onSelectPreset: (preset: PresetMode) => void;
  onOpenTheory: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  preset,
  onSelectPreset,
  onOpenTheory,
  onReset,
}) => {
  const tabs: { id: PresetMode; label: string; icon: React.ReactNode }[] = [
    {
      id: 'geostationary_bs1',
      label: t(language, 'tabGeo'),
      icon: <Radio className="w-3.5 h-3.5" />,
    },
    {
      id: 'polar_satellite',
      label: t(language, 'tabPolar'),
      icon: <Compass className="w-3.5 h-3.5" />,
    },
    {
      id: 'orbital_mechanics',
      label: t(language, 'tabOrbital'),
      icon: <Satellite className="w-3.5 h-3.5" />,
    },
    {
      id: 'weightlessness',
      label: t(language, 'tabWeightless'),
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    {
      id: 'mineral_exploration',
      label: t(language, 'tabMineral'),
      icon: <Search className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-[1780px] mx-auto px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 ring-2 ring-indigo-500/20">
            <Satellite className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none">
                {t(language, 'brandTitle')}
              </h1>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                P-42
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5 flex items-center gap-1.5">
              <span>{language === 'bn' ? 'এইচএসসি পদার্থবিজ্ঞান ১ম পত্র • অধ্যায় ৬' : 'HSC Physics 1st Paper • Chapter 6'}</span>
              <span className="text-slate-300">•</span>
              <span className="font-semibold text-indigo-700 uppercase">
                {t(language, 'brandSubtitle')}
              </span>
            </p>
          </div>
        </div>

        {/* Center: Module Navigation Pills */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/60 overflow-x-auto max-w-full">
          {tabs.map((tab) => {
            const isActive = preset === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectPreset(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-indigo-800 shadow-xs border border-slate-200/80 font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Theory, Language Toggle & Udvash Badge */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Theory Modal Trigger */}
          <button
            onClick={onOpenTheory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="Theory and Mathematical Derivations"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t(language, 'theoryButton')}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer"
            title="Toggle Language (BN / EN)"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="uppercase">{language === 'bn' ? 'EN' : 'বাংলা'}</span>
          </button>

          {/* Reset View */}
          <button
            onClick={onReset}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Udvash Branding Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded-xl text-[11px] font-black text-red-700">
            <GraduationCap className="w-3.5 h-3.5 text-red-600" />
            <span>{t(language, 'udvashBadge')}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

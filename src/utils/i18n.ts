import { Language } from '../types';

export const translations = {
  bn: {
    // Header
    brandTitle: 'কৃত্রিম উপগ্রহের গতি ও মহাকাশ প্রযুক্তি',
    brandSubtitle: 'ল্যাব',
    tabGeo: 'ভূ-স্থির উপগ্রহ (বঙ্গবন্ধু-১)',
    tabPolar: 'মেরু উপগ্রহ (Polar LEO)',
    tabOrbital: 'কক্ষীয় দ্রুতি ও শক্তি (Orbital Mechanics)',
    tabWeightless: 'ওজনহীনতা বিশ্লেষণ (Weightlessness)',
    tabMineral: 'খনিজ অনুসন্ধান ও মহাকর্ষ জরিপ',
    theoryButton: 'থিওরি ও সূত্রাবলী',
    udvashBadge: 'উদ্ভাস (Udvash)',

    // Controls
    controlParameters: 'কন্ট্রোল প্যারামিটারস',
    resetDefaults: 'ডিফল্ট রিসেট',
    altitude: 'কক্ষপথের উচ্চতা (h)',
    satelliteMass: 'উপগ্রহের ভর (m)',
    selectBody: 'কেন্দ্রীয় গ্রহ নির্বাচন:',
    selectDeposit: 'ভূগর্ভস্থ খনিজ কাঠামোর ধরন:',
    depositDepth: 'খনিজের গভীরতা (d)',
    excessMass: 'ঘনত্বের তারতম্য (Density Contrast)',
    spacecraftMode: 'মহাকাশযানের গতি দশা:',
    astronautMass: 'নভোচারীর ভর (m_a)',
    burnAcc: 'ইঞ্জিন থ্রাস্ট ত্বরণ (a_thrust)',

    // Toggles
    visualizerToggles: 'ভিজ্যুয়ালাইজার অপশনস',
    showVectors: 'বেগ ও মহাকর্ষ বল ভেক্টর',
    showEnergyBars: 'গতিশক্তি ও বিভবশক্তি বার',
    showCoverageCone: 'গ্রাউন্ড কভারেজ কোণ (Footprint)',
    earthRotation: 'পৃথিবীর আহ্নিক ঘূর্ণন (Earth Spin)',

    // Telemetry
    telemetryTitle: 'লাইভ উপগ্রহ টেলিমেট্রি',
    orbitalSpeed: 'কক্ষীয় দ্রুতি (v_orbit)',
    orbitalPeriod: 'আবর্তনকাল (T = 2πr/v)',
    localGravity: 'ঐ উচ্চতায় অভিকর্ষজ ত্বরণ (g_h)',
    dailyPasses: 'দৈনিক আবর্তন সংখ্যা',
    apparentWeight: 'আপাত ওজন (Normal Force N)',
    gravimeterReading: 'গ্র্যাভিমিটার মান (g_total)',
    bouguerAnomaly: 'বোগার অ্যানোমালি (Δg)',

    // Math Box
    exactMathTitle: 'গাণিতিক বিশ্লেষণ ও সমীকরণ',
    play: 'শুরু করুন',
    pause: 'থামুন',
    step: 'ধাপ (Step)',
    slowMo: '০.২৫x স্লো-মো',
    reset: 'রিসেট',
    fullScreen: 'পূর্ণ পর্দা',
    exitFullScreen: 'ছোট পর্দা',
  },
  en: {
    // Header
    brandTitle: 'Satellite Motion & Orbital Spacecraft',
    brandSubtitle: 'LAB',
    tabGeo: 'Geostationary (Bangabandhu-1)',
    tabPolar: 'Polar Satellite (LEO)',
    tabOrbital: 'Orbital Mechanics & Energy',
    tabWeightless: 'Orbital Weightlessness',
    tabMineral: 'Mineral Gravimetry Survey',
    theoryButton: 'Theory & Derivations',
    udvashBadge: 'Udvash',

    // Controls
    controlParameters: 'Control Parameters',
    resetDefaults: 'Reset Defaults',
    altitude: 'Orbital Altitude (h)',
    satelliteMass: 'Satellite Mass (m)',
    selectBody: 'Central Celestial Body:',
    selectDeposit: 'Subsurface Deposit Type:',
    depositDepth: 'Deposit Depth (d)',
    excessMass: 'Density Contrast Δρ',
    spacecraftMode: 'Spacecraft State:',
    astronautMass: 'Astronaut Mass (m_a)',
    burnAcc: 'Engine Thrust Acc (a_thrust)',

    // Toggles
    visualizerToggles: 'Visualizer Options',
    showVectors: 'Velocity & Gravity Vectors',
    showEnergyBars: 'Kinetic & Potential Bars',
    showCoverageCone: 'Ground Coverage Footprint',
    earthRotation: 'Earth Diurnal Spin',

    // Telemetry
    telemetryTitle: 'Live Orbital Telemetry',
    orbitalSpeed: 'Orbital Velocity (v_orbit)',
    orbitalPeriod: 'Orbital Period (T)',
    localGravity: 'Local Acceleration (g_h)',
    dailyPasses: 'Orbits Per Day',
    apparentWeight: 'Apparent Weight (N)',
    gravimeterReading: 'Measured Gravity (g_total)',
    bouguerAnomaly: 'Bouguer Anomaly (Δg)',

    // Math Box
    exactMathTitle: 'Mathematical Proof & Formulas',
    play: 'Play',
    pause: 'Pause',
    step: 'Step',
    slowMo: '0.25x Slow-Mo',
    reset: 'Reset',
    fullScreen: 'Fullscreen',
    exitFullScreen: 'Exit Fullscreen',
  },
};

export function t(lang: Language, key: keyof typeof translations['bn']): string {
  return translations[lang][key] || translations['bn'][key] || key;
}

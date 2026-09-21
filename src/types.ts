export type Language = 'bn' | 'en';
export type AppTheme = 'clean_bright' | 'midnight';
export type PresetMode = 'geostationary_bs1' | 'polar_satellite' | 'orbital_mechanics' | 'weightlessness' | 'mineral_exploration';

export interface SimulationParams {
  preset: PresetMode;
  theme: AppTheme;

  // Orbital Kinematics
  altitudeKm: number; // 200 to 40,000 km (default 35,786 km for GEO, 700 km for Polar)
  satelliteMassKg: number; // 500 to 5000 kg (BS-1 is 3500 kg)
  centralBody: 'earth' | 'moon' | 'mars';

  // Geostationary & Polar Visualization
  showGroundTrack: boolean;
  showCoverageCone: boolean;
  earthRotationActive: boolean;

  // Weightlessness Lab
  astronautMassKg: number; // 70 kg
  spacecraftState: 'orbital_freefall' | 'powered_burn' | 'surface_rest';
  burnAccelerationMS2: number; // 0 to 20 m/s^2

  // Mineral Exploration / Gravimetry
  depositType: 'dense_metallic_ore' | 'oil_gas_reservoir' | 'subsurface_cavity';
  depositDepthM: number; // 200 to 2000 m
  depositExcessMassPct: number; // -60% to +80%

  // Visualizer Toggles
  showVectors: boolean;
  showEnergyBars: boolean;
  showGrid: boolean;
  slowMo: boolean;
}

export interface TelemetryState {
  elapsedTime: number;

  // Orbital Mechanics
  orbitalRadiusKm: number;
  orbitalSpeedKmS: number;
  orbitalPeriodHours: number;
  dailyOrbits: number;
  localGMS2: number;

  // Energies (GJ)
  kineticEnergyGJ: number;
  potentialEnergyGJ: number;
  totalEnergyGJ: number;
  bindingEnergyGJ: number;

  // Weightlessness
  scaleReadingN: number; // Normal force on astronaut
  apparentWeightPct: number; // % of normal 1g weight

  // Gravimetry
  baselineG: number; // m/s^2
  anomalyDeltaMgal: number; // mGal (1 mGal = 10^-5 m/s^2)
  measuredG: number; // m/s^2
}

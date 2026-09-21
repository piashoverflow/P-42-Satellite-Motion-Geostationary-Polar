export type P42Mode = 'geostationary_vs_polar' | 'satellite_kinematics_energy' | 'weightlessness_lab' | 'resource_exploration_gravimetry';

export interface DualSatelliteParams {
  showGeostationary: boolean;
  showPolar: boolean;
  earthRotationActive: boolean;
  showFootprintCone: boolean;
}

export interface SatelliteKinematicsParams {
  altitudeKm: number; // 200 to 40,000 km
  satelliteMassKg: number; // 500 to 5000 kg (BS-1 is ~3500 kg)
  centralBody: 'earth' | 'moon' | 'mars';
}

export interface WeightlessnessParams {
  thrusterActive: boolean;
  thrusterAcc: number; // 0 to 9.8 m/s^2
  capsuleState: 'orbital_freefall' | 'powered_climb' | 'deep_space';
  astronautMass: number;
}

export interface GravimetryParams {
  sensorAltitudeMeters: number; // 500 to 3000 m
  depositType: 'dense_metallic_ore' | 'oil_gas_reservoir' | 'subterranean_cavity';
  depositDepthMeters: number; // 500 to 2500 m
  depositExcessMass: number; // density contrast scale
}

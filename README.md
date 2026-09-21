# P-42: Satellite Motion, Geostationary Orbits & Gravimetry Applications

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Author: Shamsuddin Piash](https://img.shields.io/badge/Author-Shamsuddin%20Piash-0ea5e9.svg)](https://piashoverflow.github.io)
[![BUET ME](https://img.shields.io/badge/Institution-BUET%20'25-10b981.svg)](https://buet.ac.bd)

> **Interactive Computational Satellite Dynamics & Geophysical Exploration Simulator**  
> Developed by **Shamsuddin Piash** | Department of Mechanical Engineering, Bangladesh University of Engineering and Technology (BUET).  
> Covers **HSC Physics 1st Paper, Chapter 6 (Gravitation & Gravity / মহাকর্ষ ও অভিকর্ষ)** — Topic Code **P-42**.

---

## 🔬 Core Physics Principles & Formulations

### 1. Satellite Orbital Kinematics (কৃত্রিম উপগ্রহের গতি)
For an artificial satellite revolving in a circular orbit at altitude $h$ above Earth's surface:
- **Centripetal Force Balance**:
  $$\frac{mv^2}{R+h} = \frac{GMm}{(R+h)^2} \implies v = \sqrt{\frac{GM}{R+h}} = R\sqrt{\frac{g}{R+h}}$$
- **Orbital Period**:
  $$T = \frac{2\pi(R+h)}{v} = \frac{2\pi(R+h)^{3/2}}{\sqrt{GM}}$$
- **Orbital Altitude Formula**:
  $$h = \left(\frac{GMT^2}{4\pi^2}\right)^{1/3} - R$$

---

### 2. Geostationary Orbit & Bangabandhu Satellite-1 (ভূ-স্থির উপগ্রহ)
An orbit where the satellite's period precisely matches Earth's sidereal rotation period ($T = 24.0\text{ hours} = 86,400\text{ s}$):
$$R + h = \left(\frac{6.674\times 10^{-11} \times 5.972\times 10^{24} \times (86400)^2}{4\pi^2}\right)^{1/3} \approx 42,164\text{ km}$$
$$h = 42,164\text{ km} - 6,371\text{ km} \approx 35,786\text{ km} \approx 36,000\text{ km}$$
- **Bangabandhu Satellite-1 (BS-1)**:
  - Longitude Slot: $119.1^\circ$ East
  - Orbital Velocity: $v \approx 3.07\text{ km/s}$
  - Remains stationary relative to Bangladesh ground stations.

---

### 3. Polar & Sun-Synchronous Satellites (মেরু উপগ্রহ)
- Orbit passes directly over the North and South Poles at Low Earth Orbit ($h \approx 500 - 1000\text{ km}$, $T \approx 90 - 100\text{ min}$).
- As Earth rotates eastward underneath the polar orbit, the satellite scans north-south swaths covering 100% of Earth's surface for weather forecasting and environmental monitoring.

---

### 4. Satellite Energies & Virial Theorem (উপগ্রহের যান্ত্রিক শক্তি)
- **Kinetic Energy**: $K = \frac{1}{2}mv^2 = \frac{GMm}{2(R+h)} > 0$
- **Potential Energy**: $U = -\frac{GMm}{R+h} < 0$
- **Total Mechanical Energy**: $E = K + U = -\frac{GMm}{2(R+h)} < 0$
- **Binding Energy**: $B = |E| = \frac{GMm}{2(R+h)}$

---

### 5. Physical Basis of Weightlessness (মহাশূন্যে ওজনহীনতা)
Weightlessness is NOT caused by the absence of gravity ($g \approx 8.7\text{ m/s}^2$ at $400\text{ km}$ ISS altitude). It occurs because the spacecraft and occupant are in perpetual free fall around Earth with centripetal acceleration $a_c = g(h)$:
$$N = m(g - a_c) = m(g - g) = 0$$
Since the floor provides zero normal reaction force, the apparent weight vanishes ($W = 0$).

---

### 6. Subsurface Resource Exploration via Gravimetry (মহাকর্ষীয় এনোমালি)
Gravitational anomalies ($\Delta g$) measured by gravimeters reveal subterranean density contrasts:
$$\Delta g(x) = \frac{G \Delta M \cdot z}{(x^2 + z^2)^{3/2}}$$
- Dense metallic ore bodies produce positive anomaly peaks ($+\Delta g$).
- Low-density salt domes, natural gas, or oil traps produce negative anomaly troughs ($-\Delta g$).

---

## 🚀 Getting Started & Local Development

```bash
# Clone repository
git clone https://github.com/piashoverflow/P-42-Satellite-Motion-Geostationary-Polar.git
cd P-42-Satellite-Motion-Geostationary-Polar

# Install dependencies
npm install

# Launch Vite development server
npm run dev

# Build for production / Vercel
npm run build
```

---

## 🌐 1-Click Deployment to Vercel
This project is configured for out-of-the-box zero-config deployment on [Vercel](https://vercel.com). Simply import this repository into your Vercel dashboard and click **Deploy**.

---

## 📜 License
MIT License © 2026 **Shamsuddin Piash**. See [LICENSE](LICENSE) for details.

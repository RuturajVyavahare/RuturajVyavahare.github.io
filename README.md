# RV / SILICON INTERFACE — NEXT-GENERATION SEMICONDUCTOR PORTFOLIO
**Ruturaj Vyavahare**  
*Aspiring VLSI Design Engineer | RTL Design | FPGA Prototyping | Design Verification*  
*Pune, Maharashtra, India*

[![Vite Build](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Target Architecture](https://img.shields.io/badge/FPGA-AMD%20Artix--7%20XC7A35T-orange?style=flat-square)](https://www.xilinx.com/)
[![HDL](https://img.shields.io/badge/HDL-Verilog%20IEEE%201364-blue?style=flat-square)](https://en.wikipedia.org/wiki/Verilog)
[![Verified Projects](https://img.shields.io/badge/Verified%20Projects-03-brightgreen?style=flat-square)]()

---

## 1. Overview
A next-generation personal portfolio and semiconductor engineering interface for **Ruturaj Vyavahare**, third-year Electronics & Telecommunication Engineering student at **PVG's College of Engineering and Technology, Pune** (CGPA: 8.03, Latest SGPA: 8.64, Expected Graduation: May 2028).

The portfolio unites high-contrast editorial typography, dark silicon aesthetic principles, interactive 3D WebGL semiconductor models, and four functioning browser-based hardware instruments.

---

## 2. Verified Hardware Projects (Exactly Three)

### 01 // Low-Power ALU Design Using VLSI Techniques
* **HDL & Toolchain:** Verilog HDL, AMD/Xilinx Vivado, Digilent Basys 3 (Artix-7 XC7A35T).
* **Architecture:** 4-bit ALU supporting 8 operations (`ADD`, `SUB`, `AND`, `OR`, `XOR`, `NOT`, `SHR`, `SHL`) with enable-based power gating and synchronous `Carry` and `Zero` flags.
* **FPGA Utilization:** 20 LUTs (0.10%) and 18 I/O (16.98%).
* **Interactive Feature:** Browser-based 4-bit ALU Educational Playground with live bit toggles, opcode selection, binary bus representation, and status flag monitoring.
* **Repository:** [Low-Power-ALU-Design-Using-VLSI-Techniques](https://github.com/RuturajVyavahare/Low-Power-ALU-Design-Using-VLSI-Techniques)

### 02 // FPGA-Based Traffic Light Controller with Priority System
* **HDL & Toolchain:** Verilog HDL, FSM Design, Vivado, Basys 3 Artix-7.
* **Architecture:** 4-way intersection controller with switch-triggered emergency vehicle override. Priority encoder arbitration: `North > South > East > West`. Fail-safe sequence: `ALL-RED → EMERGENCY GREEN (10s) → ALL-RED → NORMAL`.
* **Interactive Feature:** 4-way intersection visualizer with real-time FSM state telemetry, emergency request toggles, and start/pause/reset controls.
* **Repository:** [FPGA-Traffic-Light-Controller](https://github.com/RuturajVyavahare/FPGA-Traffic-Light-Controller)

### 03 // Smart Digital Lock System
* **HDL & Toolchain:** Verilog HDL, Digital Logic, Vivado, Basys 3 Artix-7.
* **Architecture:** Sequential 4-digit security lock. Physical Basys 3 FPGA hardware uses 4-bit onboard switches and push-button entry, 4-digit 7-segment display (`PASS`/`FAIL`), per-attempt status LEDs, and an FSM persistent lockout state requiring a hardware reset.
* **Interactive Feature:** Educational access control simulator featuring a 4x4 matrix keypad, masked entry display, 7-segment output simulation, and software reset button (`RST`). Default demonstration password: `0915`.
* **Repository:** [Smart-Digital-Lock-System](https://github.com/RuturajVyavahare/Smart-Digital-Lock-System)

---

## 3. Advanced Website Features
* **Editorial Portrait Hero:** Large split hero featuring Ruturaj's professional portrait with technical corner coordinates, paired with the headline `"BUILDING BEYOND THE LOGIC."` and 3D WebGL silicon die model.
* **The Signal Lab:** Functioning Boolean gate experimenter (`AND`, `OR`, `XOR`, `NOT`, `NAND`, `NOR`) with live truth tables and real-time dual-channel HTML5 Canvas Oscilloscope (100MHz clock pulse and live output trace).
* **From Code to Silicon Workflow:** 6-stage engineering journey (Specification → RTL Design → Testbench → Simulation → Synthesis → Hardware Validation).
* **RV Silicon Terminal (Ctrl + K):** Safe, sandboxed command palette with shortcuts for `about`, `projects`, `skills`, `experience`, `resume`, `contact`, and `clear`.
* **Hardware Lightbox:** Fullscreen zoom viewer for verified Vivado schematics, waveforms, and hardware test photographs.
* **Official Resume Access:** Direct download of `Ruturaj_Vyavahare_Resume.pdf` from the hero, header, and contact section.

---

## 4. Local Development

### Prerequisites
* Node.js: v18+ (tested on Node v24)
* npm: v9+

### Commands
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build optimized production bundle
npm run build

# 4. Preview production build locally
npm run preview
```

Local preview available at: `http://localhost:4173/` or `http://localhost:5173/`

---

## 5. Security & Verification Policy
* No arbitrary code execution in the terminal.
* No false claims: SystemVerilog explicitly tagged as *Learning*; Codec Technologies internship dates verified as completed (*25 July 2026 – 25 October 2026*).
* STRICT EXCLUSION: No FIR Filter or DSP references anywhere in the project.
* Real photography and genuine project documentation only.


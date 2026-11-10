/* ==========================================================================
   RV / SILICON INTERFACE — 4-BIT LOW-POWER ALU INTERACTIVE DEMONSTRATION
   Verified against Verilog RTL: low_power_alu.v
   ========================================================================== */

export function initAluPlayground() {
  const container = document.getElementById('alu-interactive-panel');
  if (!container) return;

  // Internal Registers
  let regA = 0b1010; // 10 in dec
  let regB = 0b0011; // 3 in dec
  let currentOpcode = '000'; // 000: ADD
  let enable = true;

  const opcodes = [
    { code: '000', name: 'ADD', label: 'ADD (A + B)' },
    { code: '001', name: 'SUB', label: 'SUB (A - B)' },
    { code: '010', name: 'AND', label: 'AND (A & B)' },
    { code: '011', name: 'OR',  label: 'OR  (A | B)' },
    { code: '100', name: 'XOR', label: 'XOR (A ^ B)' },
    { code: '101', name: 'NOT', label: 'NOT (~A)' },
    { code: '110', name: 'SHR', label: 'SHR (A >> 1)' },
    { code: '111', name: 'SHL', label: 'SHL (A << 1)' }
  ];

  function computeALU() {
    let Y = 0;
    let carry = 0;
    let zero = 0;

    if (enable) {
      switch (currentOpcode) {
        case '000': { // ADD
          const temp = regA + regB;
          Y = temp & 0x0F;
          carry = (temp >> 4) & 0x01;
          break;
        }
        case '001': { // SUB
          Y = (regA - regB) & 0x0F;
          carry = regA >= regB ? 1 : 0;
          break;
        }
        case '010': { // AND
          Y = (regA & regB) & 0x0F;
          carry = 0;
          break;
        }
        case '011': { // OR
          Y = (regA | regB) & 0x0F;
          carry = 0;
          break;
        }
        case '100': { // XOR
          Y = (regA ^ regB) & 0x0F;
          carry = 0;
          break;
        }
        case '101': { // NOT
          Y = (~regA) & 0x0F;
          carry = 0;
          break;
        }
        case '110': { // RIGHT SHIFT
          carry = regA & 0x01;
          Y = (regA >> 1) & 0x0F;
          break;
        }
        case '111': { // LEFT SHIFT
          carry = (regA >> 3) & 0x01;
          Y = (regA << 1) & 0x0F;
          break;
        }
        default:
          Y = 0;
          carry = 0;
      }

      zero = Y === 0 ? 1 : 0;
    } else {
      Y = 0;
      carry = 0;
      zero = 0;
    }

    renderALU(Y, carry, zero);
  }

  function renderALU(Y, carry, zero) {
    // Render Bit Buttons for A
    for (let i = 3; i >= 0; i--) {
      const bitA = (regA >> i) & 1;
      const btnA = container.querySelector(`.bit-btn-a[data-bit="${i}"]`);
      if (btnA) {
        btnA.classList.toggle('active', bitA === 1);
        btnA.textContent = bitA;
      }
    }

    // Render Bit Buttons for B
    for (let i = 3; i >= 0; i--) {
      const bitB = (regB >> i) & 1;
      const btnB = container.querySelector(`.bit-btn-b[data-bit="${i}"]`);
      if (btnB) {
        btnB.classList.toggle('active', bitB === 1);
        btnB.textContent = bitB;
      }
    }

    // Opcode Active State
    const opcodeBtns = container.querySelectorAll('.opcode-btn');
    opcodeBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-code') === currentOpcode);
    });

    // Output Bits & Decimal
    const yBin = Y.toString(2).padStart(4, '0');
    const binDisplay = container.querySelector('#alu-result-bin');
    if (binDisplay) binDisplay.textContent = `${yBin[0]} ${yBin[1]} ${yBin[2]} ${yBin[3]}`;

    const decDisplay = container.querySelector('#alu-result-dec');
    if (decDisplay) decDisplay.textContent = `0x${Y.toString(16).toUpperCase()} (${Y}d)`;

    // Flags
    const carryFlag = container.querySelector('#alu-flag-carry');
    if (carryFlag) carryFlag.classList.toggle('active', carry === 1);

    const zeroFlag = container.querySelector('#alu-flag-zero');
    if (zeroFlag) zeroFlag.classList.toggle('active', zero === 1);

    // Power Gating Status
    const powerPill = container.querySelector('#alu-power-pill');
    if (powerPill) {
      powerPill.textContent = enable ? 'PWR: ENABLED (ACTIVE)' : 'PWR: GATED (STANDBY)';
      powerPill.style.color = enable ? 'var(--accent-cyan)' : 'var(--accent-orange)';
    }
  }

  // Event Listeners for Bit Toggles A
  container.querySelectorAll('.bit-btn-a').forEach(btn => {
    btn.addEventListener('click', () => {
      const bitIndex = parseInt(btn.getAttribute('data-bit'), 10);
      regA ^= (1 << bitIndex);
      computeALU();
    });
  });

  // Event Listeners for Bit Toggles B
  container.querySelectorAll('.bit-btn-b').forEach(btn => {
    btn.addEventListener('click', () => {
      const bitIndex = parseInt(btn.getAttribute('data-bit'), 10);
      regB ^= (1 << bitIndex);
      computeALU();
    });
  });

  // Event Listeners for Opcodes
  container.querySelectorAll('.opcode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentOpcode = btn.getAttribute('data-code');
      computeALU();
    });
  });

  // Enable Toggle
  const enableToggle = container.querySelector('#alu-enable-toggle');
  if (enableToggle) {
    enableToggle.addEventListener('click', () => {
      enable = !enable;
      enableToggle.classList.toggle('on', enable);
      computeALU();
    });
  }

  // Initial calculation
  computeALU();
}


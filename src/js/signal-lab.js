/* ==========================================================================
   RV / SILICON INTERFACE — THE SIGNAL LAB (LOGIC GATES & OSCILLOSCOPE)
   ========================================================================== */

export function initSignalLab() {
  const container = document.getElementById('signal-lab-console');
  if (!container) return;

  let selectedGate = 'AND';
  let inputA = 1;
  let inputB = 0;

  const gates = {
    AND: (a, b) => a & b,
    OR:  (a, b) => a | b,
    XOR: (a, b) => a ^ b,
    NOT: (a) => a === 0 ? 1 : 0,
    NAND:(a, b) => (a & b) === 0 ? 1 : 0,
    NOR: (a, b) => (a | b) === 0 ? 1 : 0
  };

  function computeGate() {
    let output = 0;
    if (selectedGate === 'NOT') {
      output = gates.NOT(inputA);
    } else {
      output = gates[selectedGate](inputA, inputB);
    }

    renderLab(output);
  }

  function renderLab(output) {
    // Gate Buttons Active State
    container.querySelectorAll('.btn-gate-select').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-gate') === selectedGate);
    });

    // Input Switches
    const switchA = container.querySelector('#switch-input-a');
    if (switchA) {
      switchA.classList.toggle('on', inputA === 1);
      switchA.textContent = inputA;
    }

    const switchB = container.querySelector('#switch-input-b');
    const groupB = container.querySelector('#group-input-b');
    if (switchB && groupB) {
      if (selectedGate === 'NOT') {
        groupB.style.opacity = '0.35';
        groupB.style.pointerEvents = 'none';
      } else {
        groupB.style.opacity = '1';
        groupB.style.pointerEvents = 'auto';
      }
      switchB.classList.toggle('on', inputB === 1);
      switchB.textContent = inputB;
    }

    // Output Indicator
    const outBadge = container.querySelector('#logic-out-val');
    if (outBadge) {
      outBadge.textContent = output;
      outBadge.style.color = output === 1 ? 'var(--accent-orange)' : 'var(--text-muted)';
      outBadge.style.borderColor = output === 1 ? 'var(--accent-orange)' : 'var(--border-subtle)';
    }

    // Truth Table Highlight
    container.querySelectorAll('.truth-table-row').forEach(row => {
      const rowA = parseInt(row.getAttribute('data-a'), 10);
      const rowB = parseInt(row.getAttribute('data-b'), 10);

      let isCurrent = false;
      if (selectedGate === 'NOT') {
        isCurrent = rowA === inputA;
      } else {
        isCurrent = rowA === inputA && rowB === inputB;
      }
      row.classList.toggle('current-row', isCurrent);
    });
  }

  // Setup Event Listeners
  container.querySelectorAll('.btn-gate-select').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedGate = btn.getAttribute('data-gate');
      computeGate();
    });
  });

  const switchA = container.querySelector('#switch-input-a');
  if (switchA) {
    switchA.addEventListener('click', () => {
      inputA = inputA === 1 ? 0 : 1;
      computeGate();
    });
  }

  const switchB = container.querySelector('#switch-input-b');
  if (switchB) {
    switchB.addEventListener('click', () => {
      inputB = inputB === 1 ? 0 : 1;
      computeGate();
    });
  }

  // Oscilloscope Canvas Setup
  const canvas = container.querySelector('#oscilloscope-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.clientWidth || 600;
    let height = canvas.clientHeight || 240;
    canvas.width = width;
    canvas.height = height;

    let timeOffset = 0;

    function drawOscilloscope() {
      ctx.clearRect(0, 0, width, height);

      // Grid Lines
      ctx.strokeStyle = 'rgba(22, 54, 41, 0.4)';
      ctx.lineWidth = 1;

      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center Divider Axis
      ctx.strokeStyle = 'rgba(52, 199, 89, 0.25)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Channel 1: Clock Pulse (Electric Cyan)
      ctx.strokeStyle = '#00D9FF';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(0, 217, 255, 0.6)';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      const clkPeriod = 48;
      const clkHighY = 35;
      const clkLowY = 85;

      for (let x = 0; x < width; x++) {
        const cycle = ((x + timeOffset) % clkPeriod);
        const y = cycle < clkPeriod / 2 ? clkHighY : clkLowY;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Channel 2: Live Logic Signal (Semiconductor Orange)
      const currentOut = selectedGate === 'NOT' ? gates.NOT(inputA) : gates[selectedGate](inputA, inputB);
      ctx.strokeStyle = currentOut === 1 ? '#FF4B1F' : '#662211';
      ctx.shadowColor = currentOut === 1 ? 'rgba(255, 75, 31, 0.8)' : 'transparent';
      ctx.shadowBlur = currentOut === 1 ? 10 : 0;
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const outHighY = height / 2 + 30;
      const outLowY = height / 2 + 80;
      const targetY = currentOut === 1 ? outHighY : outLowY;

      for (let x = 0; x < width; x++) {
        if (x === 0) ctx.moveTo(x, targetY);
        else ctx.lineTo(x, targetY);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // Channel Legends
      ctx.fillStyle = '#00D9FF';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText('CH1: CLK (100MHz)', 12, 22);

      ctx.fillStyle = '#FF4B1F';
      ctx.fillText(`CH2: OUT [${selectedGate} = ${currentOut}]`, 12, height / 2 + 18);

      timeOffset = (timeOffset + 1.5) % 1000;
      requestAnimationFrame(drawOscilloscope);
    }

    drawOscilloscope();
  }

  computeGate();
}


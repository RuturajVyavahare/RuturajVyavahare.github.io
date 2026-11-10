/* ==========================================================================
   RV / SILICON INTERFACE — SMART DIGITAL LOCK INTERACTIVE DEMO
   Verified against Verilog RTL: smart_digital_lock.v
   - Hardware: 4-bit switch input + push-button on Digilent Basys 3
   - Browser Model: 4x4 matrix keypad simulation for educational testing
   - Security: 3 failed attempts enter persistent LOCKOUT state (cleared by RST)
   ========================================================================== */

export function initLockDemo() {
  const container = document.getElementById('lock-interactive-panel');
  if (!container) return;

  const DEFAULT_PIN = '0915'; // Disclosed demonstration password
  let enteredDigits = [];
  let failedAttempts = 0;
  const MAX_ATTEMPTS = 3;
  let isLockedOut = false;

  function handleKeyPress(key) {
    if (isLockedOut) return;

    if (key === '*') {
      // Clear current digit buffer
      enteredDigits = [];
      updateDisplay();
      return;
    }

    if (key === '#') {
      // Confirm / Validate PIN
      validatePIN();
      return;
    }

    if (key >= '0' && key <= '9') {
      if (enteredDigits.length < 4) {
        enteredDigits.push(key);
        updateDisplay();

        // When 4 digits entered, auto-validate or wait for #
        if (enteredDigits.length === 4) {
          setTimeout(validatePIN, 200);
        }
      }
    }
  }

  function validatePIN() {
    if (enteredDigits.length < 4) return;

    const entered = enteredDigits.join('');
    const segDisplay = container.querySelector('#lock-7seg-display');
    const lockLed = container.querySelector('#lock-status-led');
    const unlockLed = container.querySelector('#unlock-status-led');

    if (entered === DEFAULT_PIN) {
      // Successful Verification PASS
      failedAttempts = 0;
      if (segDisplay) {
        segDisplay.textContent = 'PASS';
        segDisplay.className = 'seven-segment-display pass';
      }
      if (unlockLed) {
        unlockLed.style.background = '#34C759';
        unlockLed.style.boxShadow = '0 0 12px #34C759';
      }
      if (lockLed) {
        lockLed.style.background = '#252528';
        lockLed.style.boxShadow = 'none';
      }

      setTimeout(() => {
        enteredDigits = [];
        updateDisplay();
      }, 2500);

    } else {
      // Failed Verification FAIL
      failedAttempts++;
      if (segDisplay) {
        segDisplay.textContent = 'FAIL';
        segDisplay.className = 'seven-segment-display fail';
      }

      if (failedAttempts >= MAX_ATTEMPTS) {
        triggerPersistentLockout();
      } else {
        setTimeout(() => {
          enteredDigits = [];
          updateDisplay();
        }, 1200);
      }
    }

    updateAttemptLeds();
  }

  // Authentic RTL Behavior: state <= LOCKOUT; halts until hardware reset (rst)
  function triggerPersistentLockout() {
    isLockedOut = true;
    const segDisplay = container.querySelector('#lock-7seg-display');
    if (segDisplay) {
      segDisplay.textContent = 'LOCK';
      segDisplay.className = 'seven-segment-display lockout';
    }

    const lockoutStatus = container.querySelector('#lockout-status-text');
    if (lockoutStatus) {
      lockoutStatus.textContent = 'FSM: LOCKOUT (SYSTEM HALTED)';
      lockoutStatus.style.color = '#FF3B30';
    }
  }

  function hardwareReset() {
    isLockedOut = false;
    failedAttempts = 0;
    enteredDigits = [];

    const lockoutStatus = container.querySelector('#lockout-status-text');
    if (lockoutStatus) {
      lockoutStatus.textContent = 'STATUS: STANDBY (ARMED)';
      lockoutStatus.style.color = 'var(--accent-cyan)';
    }

    updateDisplay();
    updateAttemptLeds();
  }

  function updateDisplay() {
    const segDisplay = container.querySelector('#lock-7seg-display');
    const unlockLed = container.querySelector('#unlock-status-led');
    const lockLed = container.querySelector('#lock-status-led');

    if (unlockLed) {
      unlockLed.style.background = '#252528';
      unlockLed.style.boxShadow = 'none';
    }
    if (lockLed) {
      lockLed.style.background = '#FF3B30';
      lockLed.style.boxShadow = '0 0 8px #FF3B30';
    }

    if (segDisplay && !isLockedOut) {
      segDisplay.className = 'seven-segment-display';
      if (enteredDigits.length === 0) {
        segDisplay.textContent = '- - - -';
      } else {
        const masked = enteredDigits.map(() => '*').join(' ');
        const dashes = ' -'.repeat(4 - enteredDigits.length);
        segDisplay.textContent = (masked + dashes).trim();
      }
    }
  }

  function updateAttemptLeds() {
    for (let i = 1; i <= 3; i++) {
      const dot = container.querySelector(`.attempt-led-dot[data-attempt="${i}"]`);
      if (dot) {
        dot.classList.toggle('failed', i <= failedAttempts);
      }
    }
  }

  // Keypad Click Listeners
  container.querySelectorAll('.keypad-key').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      handleKeyPress(key);
    });
  });

  // Clear Button
  const btnClear = container.querySelector('#lock-btn-clear');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (!isLockedOut) {
        enteredDigits = [];
        updateDisplay();
      }
    });
  }

  // Hardware Reset Button (Simulates FPGA rst input)
  const btnReset = container.querySelector('#lock-btn-hw-reset');
  if (btnReset) {
    btnReset.addEventListener('click', hardwareReset);
  }

  updateDisplay();
  updateAttemptLeds();
}

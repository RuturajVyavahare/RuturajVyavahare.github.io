/* ==========================================================================
   RV / SILICON INTERFACE — FPGA TRAFFIC LIGHT CONTROLLER VISUALIZER
   Verified against Verilog RTL: traffic_controller.v & priority_encoder.v
   ========================================================================== */

export function initTrafficVisualizer() {
  const container = document.getElementById('traffic-interactive-panel');
  if (!container) return;

  // Timings (scaled to 1/2 for responsive web demo experience)
  const TIME_GREEN = 6;
  const TIME_YELLOW = 2;
  const TIME_ALL_RED = 1;
  const TIME_EMERGENCY = 6;

  // States
  const STATES = {
    NS_GREEN: 'NS_GREEN',
    NS_YELLOW: 'NS_YELLOW',
    ALL_RED_1: 'ALL_RED_1',
    EW_GREEN: 'EW_GREEN',
    EW_YELLOW: 'EW_YELLOW',
    ALL_RED_2: 'ALL_RED_2',
    EMG_NORTH: 'EMG_NORTH',
    EMG_SOUTH: 'EMG_SOUTH',
    EMG_EAST: 'EMG_EAST',
    EMG_WEST: 'EMG_WEST',
    EMG_ALL_RED: 'EMG_ALL_RED'
  };

  let currentState = STATES.NS_GREEN;
  let stateTimer = 0;
  let isRunning = true;
  let intervalId = null;

  // Emergency Input Signals
  const emergencies = {
    north: false,
    south: false,
    east: false,
    west: false
  };

  // Priority Encoder Arbitration: North > South > East > West
  function getEmergencyPriority() {
    if (emergencies.north) return 'NORTH';
    if (emergencies.south) return 'SOUTH';
    if (emergencies.east) return 'EAST';
    if (emergencies.west) return 'WEST';
    return null;
  }

  function tick() {
    stateTimer++;

    const priority = getEmergencyPriority();

    switch (currentState) {
      case STATES.NS_GREEN:
        if (stateTimer >= TIME_GREEN) {
          transitionTo(STATES.NS_YELLOW);
        }
        break;

      case STATES.NS_YELLOW:
        if (stateTimer >= TIME_YELLOW) {
          transitionTo(STATES.ALL_RED_1);
        }
        break;

      case STATES.ALL_RED_1:
        if (stateTimer >= TIME_ALL_RED) {
          if (priority === 'NORTH') transitionTo(STATES.EMG_NORTH);
          else if (priority === 'SOUTH') transitionTo(STATES.EMG_SOUTH);
          else if (priority === 'EAST') transitionTo(STATES.EMG_EAST);
          else if (priority === 'WEST') transitionTo(STATES.EMG_WEST);
          else transitionTo(STATES.EW_GREEN);
        }
        break;

      case STATES.EW_GREEN:
        if (stateTimer >= TIME_GREEN) {
          transitionTo(STATES.EW_YELLOW);
        }
        break;

      case STATES.EW_YELLOW:
        if (stateTimer >= TIME_YELLOW) {
          transitionTo(STATES.ALL_RED_2);
        }
        break;

      case STATES.ALL_RED_2:
        if (stateTimer >= TIME_ALL_RED) {
          if (priority === 'NORTH') transitionTo(STATES.EMG_NORTH);
          else if (priority === 'SOUTH') transitionTo(STATES.EMG_SOUTH);
          else if (priority === 'EAST') transitionTo(STATES.EMG_EAST);
          else if (priority === 'WEST') transitionTo(STATES.EMG_WEST);
          else transitionTo(STATES.NS_GREEN);
        }
        break;

      // Emergency States
      case STATES.EMG_NORTH:
        if (!emergencies.north || stateTimer >= TIME_EMERGENCY) {
          emergencies.north = false;
          transitionTo(STATES.EMG_ALL_RED);
        }
        break;

      case STATES.EMG_SOUTH:
        if (!emergencies.south || stateTimer >= TIME_EMERGENCY) {
          emergencies.south = false;
          transitionTo(STATES.EMG_ALL_RED);
        }
        break;

      case STATES.EMG_EAST:
        if (!emergencies.east || stateTimer >= TIME_EMERGENCY) {
          emergencies.east = false;
          transitionTo(STATES.EMG_ALL_RED);
        }
        break;

      case STATES.EMG_WEST:
        if (!emergencies.west || stateTimer >= TIME_EMERGENCY) {
          emergencies.west = false;
          transitionTo(STATES.EMG_ALL_RED);
        }
        break;

      case STATES.EMG_ALL_RED:
        if (stateTimer >= TIME_ALL_RED) {
          // Check if another pending emergency
          if (priority === 'NORTH') transitionTo(STATES.EMG_NORTH);
          else if (priority === 'SOUTH') transitionTo(STATES.EMG_SOUTH);
          else if (priority === 'EAST') transitionTo(STATES.EMG_EAST);
          else if (priority === 'WEST') transitionTo(STATES.EMG_WEST);
          else transitionTo(STATES.NS_GREEN); // Return to normal
        }
        break;
    }

    render();
  }

  function transitionTo(nextState) {
    currentState = nextState;
    stateTimer = 0;
  }

  function getLightOutputs() {
    const lights = {
      north: { red: true, yellow: false, green: false },
      south: { red: true, yellow: false, green: false },
      east:  { red: true, yellow: false, green: false },
      west:  { red: true, yellow: false, green: false }
    };

    switch (currentState) {
      case STATES.NS_GREEN:
        lights.north = { red: false, yellow: false, green: true };
        lights.south = { red: false, yellow: false, green: true };
        break;
      case STATES.NS_YELLOW:
        lights.north = { red: false, yellow: true, green: false };
        lights.south = { red: false, yellow: true, green: false };
        break;
      case STATES.EW_GREEN:
        lights.east = { red: false, yellow: false, green: true };
        lights.west = { red: false, yellow: false, green: true };
        break;
      case STATES.EW_YELLOW:
        lights.east = { red: false, yellow: true, green: false };
        lights.west = { red: false, yellow: true, green: false };
        break;
      case STATES.EMG_NORTH:
        lights.north = { red: false, yellow: false, green: true };
        break;
      case STATES.EMG_SOUTH:
        lights.south = { red: false, yellow: false, green: true };
        break;
      case STATES.EMG_EAST:
        lights.east = { red: false, yellow: false, green: true };
        break;
      case STATES.EMG_WEST:
        lights.west = { red: false, yellow: false, green: true };
        break;
      // All other states remain all-red fail-safe
    }

    return lights;
  }

  function render() {
    const lights = getLightOutputs();

    ['north', 'south', 'east', 'west'].forEach(dir => {
      const box = container.querySelector(`.traffic-box.${dir}`);
      if (box) {
        const r = box.querySelector('.signal-light.red');
        const y = box.querySelector('.signal-light.yellow');
        const g = box.querySelector('.signal-light.green');

        if (r) r.classList.toggle('active', lights[dir].red);
        if (y) y.classList.toggle('active', lights[dir].yellow);
        if (g) g.classList.toggle('active', lights[dir].green);
      }

      // Update Emergency Toggle Buttons state
      const btn = container.querySelector(`.btn-emergency-toggle[data-dir="${dir}"]`);
      if (btn) btn.classList.toggle('active', emergencies[dir]);
    });

    // FSM State & Timer Telemetry
    const stateEl = container.querySelector('#traffic-state-name');
    if (stateEl) stateEl.textContent = `FSM: ${currentState}`;

    const timerEl = container.querySelector('#traffic-state-timer');
    if (timerEl) timerEl.textContent = `TICK: ${stateTimer}s`;

    const priorityEl = container.querySelector('#traffic-priority-indicator');
    const prio = getEmergencyPriority();
    if (priorityEl) {
      priorityEl.textContent = prio ? `OVERRIDE: ${prio}` : 'MODE: NORMAL DUAL-PHASE';
      priorityEl.style.color = prio ? 'var(--accent-orange)' : 'var(--accent-cyan)';
    }
  }

  // Setup Event Listeners for Emergency Toggles
  container.querySelectorAll('.btn-emergency-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = btn.getAttribute('data-dir');
      emergencies[dir] = !emergencies[dir];
      render();
    });
  });

  // Controls: Start, Pause, Reset
  const btnPause = container.querySelector('#traffic-ctrl-pause');
  if (btnPause) {
    btnPause.addEventListener('click', () => {
      isRunning = !isRunning;
      btnPause.textContent = isRunning ? 'PAUSE' : 'RESUME';
      if (isRunning && !intervalId) {
        intervalId = setInterval(tick, 1000);
      } else {
        clearInterval(intervalId);
        intervalId = null;
      }
    });
  }

  const btnReset = container.querySelector('#traffic-ctrl-reset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      currentState = STATES.NS_GREEN;
      stateTimer = 0;
      emergencies.north = false;
      emergencies.south = false;
      emergencies.east = false;
      emergencies.west = false;
      render();
    });
  }

  // Start Simulation Loop
  intervalId = setInterval(tick, 1000);
  render();
}


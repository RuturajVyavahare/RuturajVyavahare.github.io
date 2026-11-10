/* ==========================================================================
   RV / SILICON INTERFACE — RV TERMINAL & COMMAND PALETTE (CTRL+K)
   Safe, sandboxed portfolio interaction system
   ========================================================================== */

export function initTerminalAndPalette() {
  const modal = document.getElementById('terminal-palette-modal');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const openBtns = document.querySelectorAll('.trigger-command-palette');
  const closeBtn = document.getElementById('terminal-close-btn');

  if (!modal || !input || !output) return;

  function openTerminal() {
    modal.classList.add('open');
    input.value = '';
    input.focus();
  }

  function closeTerminal() {
    modal.classList.remove('open');
  }

  // Toggle with Ctrl+K or Cmd+K
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal.classList.contains('open')) {
        closeTerminal();
      } else {
        openTerminal();
      }
    } else if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeTerminal();
    }
  });

  openBtns.forEach(btn => btn.addEventListener('click', openTerminal));
  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeTerminal();
  });

  // Safe Predefined Command Handler
  function executeCommand(cmdStr) {
    const raw = cmdStr.trim().toLowerCase();
    const line = document.createElement('div');
    line.className = 'terminal-output-line';

    const promptEcho = document.createElement('div');
    promptEcho.style.color = 'var(--text-muted)';
    promptEcho.textContent = `ruturaj@silicon:~$ ${cmdStr}`;
    output.appendChild(promptEcho);

    switch (raw) {
      case 'help':
        line.innerHTML = `
          <div style="color: var(--accent-orange); margin-bottom: 0.35rem;">AVAILABLE COMMANDS:</div>
          <div>▸ <strong>about</strong>      : Read engineering & academic profile</div>
          <div>▸ <strong>projects</strong>   : View the 3 verified FPGA & RTL projects</div>
          <div>▸ <strong>skills</strong>     : Inspect Verilog, Vivado & hardware competencies</div>
          <div>▸ <strong>experience</strong> : Review VLSI internship at Codec Technologies</div>
          <div>▸ <strong>resume</strong>     : Download official one-page resume PDF</div>
          <div>▸ <strong>contact</strong>    : Jump to contact channels & email</div>
          <div>▸ <strong>clear</strong>      : Flush terminal buffer</div>
        `;
        break;

      case 'about':
        line.innerHTML = `
          <div style="color: var(--accent-cyan); font-weight: 700;">RUTURAJ VYAVAHARE</div>
          <div>Third-Year B.E. Electronics & Telecommunication Engineering</div>
          <div>PVG's College of Engineering and Technology, Pune</div>
          <div>CGPA: 8.03 | Latest SGPA: 8.64 | Expected Graduation: May 2028</div>
          <div style="color: var(--text-secondary); margin-top: 0.25rem;">
            Focused on Verilog RTL design, FSM architectures, functional verification, and Basys 3 Artix-7 FPGA prototyping.
          </div>
        `;
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        break;

      case 'projects':
        line.innerHTML = `
          <div style="color: var(--accent-orange); font-weight: 700;">VERIFIED HARDWARE PROJECTS (3):</div>
          <div>1. Low-Power ALU Design Using VLSI Techniques (20 LUTs, Basys 3)</div>
          <div>2. FPGA-Based Traffic Light Controller with Priority Override (FSM)</div>
          <div>3. Smart Digital Lock System with 3-Attempt Lockout (Matrix Keypad)</div>
          <div style="color: var(--accent-cyan); margin-top: 0.25rem;">[Navigating to Projects section...]</div>
        `;
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(closeTerminal, 800);
        break;

      case 'skills':
        line.innerHTML = `
          <div style="color: var(--accent-cyan); font-weight: 700;">TECHNICAL ARSENAL:</div>
          <div>HDL: Verilog HDL (Proficient), SystemVerilog (Learning)</div>
          <div>EDA Tools: AMD/Xilinx Vivado, ModelSim, Icarus Verilog, GTKWave</div>
          <div>Hardware: Digilent Basys 3 (Artix-7), 8051, Arduino, ESP32</div>
          <div>Languages: C, C++, Python, Embedded C (Learning)</div>
        `;
        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
        break;

      case 'experience':
        line.innerHTML = `
          <div style="color: var(--accent-orange); font-weight: 700;">INTERNSHIP EXPERIENCE:</div>
          <div><strong>Digital Electronics & VLSI Intern</strong> — Codec Technologies</div>
          <div>Timeline: 25 July 2026 – 25 October 2026 | Pune, India</div>
          <div>Designed RTL modules, authored verification testbenches, analyzed waveforms, and synthesized designs for Basys 3 FPGA hardware.</div>
        `;
        document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
        break;

      case 'resume':
        line.innerHTML = `
          <div style="color: #34C759; font-weight: 700;">[RESUME DOWNLOAD INITIATED]</div>
          <div>Downloading: Ruturaj_Vyavahare_Resume.pdf</div>
        `;
        const link = document.createElement('a');
        link.href = './assets/Ruturaj_Vyavahare_Resume.pdf';
        link.download = 'Ruturaj_Vyavahare_Resume.pdf';
        link.click();
        break;

      case 'contact':
        line.innerHTML = `
          <div style="color: var(--accent-orange); font-weight: 700;">DIRECT CONTACT:</div>
          <div>Email: rhuturajvyavahare95@gmail.com</div>
          <div>LinkedIn: linkedin.com/in/ruturaj-vyavahare</div>
          <div>Location: Pune, Maharashtra, India</div>
        `;
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(closeTerminal, 800);
        break;

      case 'clear':
        output.innerHTML = '';
        return;

      case '':
        return;

      default:
        line.innerHTML = `
          <div style="color: #FF3B30;">Command not recognized: "${raw}". Type <span style="color: var(--accent-cyan);">help</span> for available commands.</div>
        `;
        break;
    }

    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      executeCommand(val);
    }
  });
}


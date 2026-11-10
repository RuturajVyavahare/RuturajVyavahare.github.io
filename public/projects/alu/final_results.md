 Final Results — Low-Power 4-Bit ALU

 1. Functional Verification

The 4-bit ALU was functionally verified for all eight implemented operations.

| Opcode | Operation | A | B | Expected Y | Status |
|--------|-----------|----|----|------------|--------|
| 000 | ADD | 0101 | 0011 | 1000 | PASS |
| 001 | SUBTRACT | 1001 | 0011 | 0110 | PASS |
| 010 | AND | 1100 | 1010 | 1000 | PASS |
| 011 | OR | 1100 | 1010 | 1110 | PASS |
| 100 | XOR | 1100 | 1010 | 0110 | PASS |
| 101 | NOT | 1010 | — | 0101 | PASS |
| 110 | RIGHT SHIFT | 1011 | — | 0101 | PASS |
| 111 | LEFT SHIFT | 1011 | — | 0110 | PASS |

Functional Verification: 8/8 operations passed

---

 2. Synthesis Utilization

| Resource | Used | Available | Utilization |
|----------|-----:|----------:|------------:|
| LUT | 20 | 20,800 | 0.10% |
| I/O | 18 | 106 | 16.98% |

The design is combinational and does not use flip-flops/registers.

---

 3. Timing Analysis

| Parameter | Result |
|-----------|--------|
| Timing Constraints | None |
| WNS | Not Applicable |
| TNS | 0.000 ns |
| WHS | Not Applicable |
| THS | 0.000 ns |
| Failing Endpoints | 0 |
| Total Endpoints | 6 |

No user-defined timing constraints were specified. Therefore, WNS/WHS values reported as `inf` by Vivado are not interpreted as actual timing margins.

---

 4. Power Analysis

 Pre-Implementation

| Parameter | Value |
|-----------|------:|
| Total On-Chip Power | 2.728 W |
| Dynamic Power | 2.650 W |
| Static Power | 0.078 W |
| Logic Power | 0.098 W |
| Signal Power | 0.105 W |
| I/O Power | 2.448 W |
| Junction Temperature | 38.6 °C |
| Confidence | Low |

 Post-Implementation

| Parameter | Value |
|-----------|------:|
| Total On-Chip Power | 2.011 W |
| Dynamic Power | 1.936 W |
| Static Power | 0.075 W |
| Logic Power | 0.099 W |
| Signal Power | 0.131 W |
| I/O Power | 1.705 W |
| Junction Temperature | 35.1 °C |
| Thermal Margin | 49.9 °C |
| Confidence | Low |

---

 5. Power Comparison

| Parameter | Synthesized | Implemented |
|-----------|------------:|------------:|
| Total Power | 2.728 W | 2.011 W |
| Dynamic Power | 2.650 W | 1.936 W |
| Static Power | 0.078 W | 0.075 W |
| I/O Power | 2.448 W | 1.705 W |
| Junction Temperature | 38.6 °C | 35.1 °C |

 Estimated Reduction

Total estimated power reduction:

26.28%

Dynamic power reduction:

26.94%

I/O power reduction:

30.39%

> Note: Vivado reported a low power-estimation confidence level. Therefore, these values are considered tool-based estimates and not measured hardware power.

---

 6. Final Summary

The proposed Low-Power 4-Bit ALU successfully implements eight arithmetic, logical, and shift operations. Functional simulation verified all eight operations. Synthesis resulted in 20 LUTs with 0.10% LUT utilization. Implementation produced an estimated total on-chip power of 2.011 W. The design uses an enable-based low-power control approach to keep the ALU inactive when disabled.

Overall, the design demonstrates a compact 4-bit ALU implementation with successful functional verification, synthesis, implementation, and power estimation.
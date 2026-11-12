// sampleData.js - 30 synthetic shop records (20 bills and 10 payments) for 26 Oct 2026.
// First-year student note: This data has 4 specific planted cases to test our matcher logic.

// Converts a 24-hour time string ("HH:MM") on 26 Oct 2026 into a full JavaScript Date object
export function makeDate(timeStr, dayOffset = 0) {
  const parts = timeStr.split(":");
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  // Month 9 is October in JavaScript Date (January is 0, October is 9)
  return new Date(2026, 9, 26 + dayOffset, hours, minutes, 0, 0);
}

// Exactly 20 synthetic sales bills recorded in the shop's notebook or billing machine
export const SAMPLE_BILLS = [
  // 9 Cash bills: counted by the system but marked as "Cash (cannot verify)"
  { id: "B101", time: makeDate("08:30"), amount: 60, mode: "cash", customer: "" },
  { id: "B102", time: makeDate("09:15"), amount: 140, mode: "cash", customer: "" },
  { id: "B103", time: makeDate("10:00"), amount: 50, mode: "cash", customer: "" },

  // Planted case 1: Credit bill to Ramesh with NO payment (credit given and forgotten)
  { id: "B104", time: makeDate("10:30"), amount: 820, mode: "credit", customer: "Ramesh" },

  // Planted case 2: Two identical UPI bills logged 1 minute apart, but only ONE payment exists
  { id: "B105", time: makeDate("11:05"), amount: 250, mode: "upi", customer: "" },
  { id: "B106", time: makeDate("11:06"), amount: 250, mode: "upi", customer: "" }, // Duplicate of B105

  // Cash bill
  { id: "B107", time: makeDate("11:45"), amount: 180, mode: "cash", customer: "" },

  // Digital bill matching payment P4
  { id: "B108", time: makeDate("12:15"), amount: 340, mode: "upi", customer: "" },

  // Cash bill
  { id: "B109", time: makeDate("13:00"), amount: 95, mode: "cash", customer: "" },

  // Planted case 3: Credit bill for Lakshmi (Rs 1200) paid later at 6:10 PM by Lakshmi (P8)
  { id: "B110", time: makeDate("13:15"), amount: 1200, mode: "credit", customer: "Lakshmi" },

  // Digital marketplace bill matching payment P5
  { id: "B111", time: makeDate("14:00"), amount: 560, mode: "marketplace", customer: "" },

  // Cash bill
  { id: "B112", time: makeDate("14:45"), amount: 320, mode: "cash", customer: "" },

  // Digital bill matching payment P6
  { id: "B113", time: makeDate("15:30"), amount: 190, mode: "upi", customer: "" },

  // Digital bill matching payment P7
  { id: "B114", time: makeDate("16:45"), amount: 410, mode: "upi", customer: "" },

  // Cash bill
  { id: "B115", time: makeDate("17:10"), amount: 75, mode: "cash", customer: "" },

  // Digital marketplace bill matching payment P9
  { id: "B116", time: makeDate("17:50"), amount: 680, mode: "marketplace", customer: "" },

  // Digital bill matching payment P1
  { id: "B117", time: makeDate("18:40"), amount: 150, mode: "upi", customer: "" },

  // Cash bill
  { id: "B118", time: makeDate("19:30"), amount: 210, mode: "cash", customer: "" },

  // Digital bill matching payment P10
  { id: "B119", time: makeDate("20:20"), amount: 900, mode: "upi", customer: "" },

  // Cash bill
  { id: "B120", time: makeDate("21:15"), amount: 110, mode: "cash", customer: "" }
];

// Exactly 10 synthetic payments received via bank UPI notification or marketplace payout
export const SAMPLE_PAYMENTS = [
  // Matches bill B117 (Rs 150, upi)
  { id: "P1", time: makeDate("18:45"), amount: 150, channel: "upi", payer: "" },

  // Planted case 4: Money arrived via UPI, but no sale was ever recorded in bills
  { id: "P2", time: makeDate("16:12"), amount: 450, channel: "upi", payer: "" },

  // Matches bill B105 (Rs 250, upi) leaving bill B106 as a duplicate
  { id: "P3", time: makeDate("11:06"), amount: 250, channel: "upi", payer: "" },

  // Matches bill B108 (Rs 340, upi)
  { id: "P4", time: makeDate("12:18"), amount: 340, channel: "upi", payer: "" },

  // Matches bill B111 (Rs 560, marketplace)
  { id: "P5", time: makeDate("14:05"), amount: 560, channel: "marketplace", payer: "" },

  // Matches bill B113 (Rs 190, upi)
  { id: "P6", time: makeDate("15:32"), amount: 190, channel: "upi", payer: "" },

  // Matches bill B114 (Rs 410, upi)
  { id: "P7", time: makeDate("16:48"), amount: 410, channel: "upi", payer: "" },

  // Matches credit bill B110 (Rs 1200, paid by Lakshmi)
  { id: "P8", time: makeDate("18:10"), amount: 1200, channel: "upi", payer: "Lakshmi" },

  // Matches bill B116 (Rs 680, marketplace)
  { id: "P9", time: makeDate("18:00"), amount: 680, channel: "marketplace", payer: "" },

  // Matches bill B119 (Rs 900, upi)
  { id: "P10", time: makeDate("20:22"), amount: 900, channel: "upi", payer: "" }
];

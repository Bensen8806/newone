export const LAYOUT = {
  depts: [
    { dept: 'ADM', x: 10, y: 10, w: 980, h: 220, lx: 500, ly: 25 },
    { dept: 'CS', x: 10, y: 240, w: 310, h: 220, lx: 165, ly: 255 },
    { dept: 'EC', x: 330, y: 240, w: 340, h: 220, lx: 500, ly: 255 },
    { dept: 'EE', x: 680, y: 240, w: 310, h: 220, lx: 835, ly: 255 },
    { dept: 'ME', x: 10, y: 470, w: 310, h: 220, lx: 165, ly: 485 },
    { dept: 'IC', x: 330, y: 470, w: 340, h: 220, lx: 500, ly: 485 },
    { dept: 'CE', x: 680, y: 470, w: 310, h: 220, lx: 835, ly: 485 },
  ],
  venues: {
    // ADM
    'venue-auditorium': { x: 20, y: 35, w: 235, h: 185 },
    'venue-ptib': { x: 270, y: 35, w: 165, h: 85 },
    'venue-e-one': { x: 270, y: 135, w: 165, h: 85 },
    'venue-seminar-adm': { x: 450, y: 35, w: 165, h: 85 },
    'venue-cnc': { x: 450, y: 135, w: 165, h: 85 },
    'venue-skill': { x: 630, y: 35, w: 170, h: 185 },
    'venue-open-stage': { x: 810, y: 35, w: 170, h: 185 },

    // CS
    'venue-cse-seminar': { x: 20, y: 270, w: 290, h: 85 },
    'venue-cse-lab': { x: 20, y: 365, w: 290, h: 85 },

    // EC
    'venue-ece-seminar': { x: 340, y: 270, w: 320, h: 70 },
    'venue-ece-analog': { x: 340, y: 350, w: 155, h: 50 },
    'venue-ece-circuits': { x: 505, y: 350, w: 155, h: 50 },
    'venue-ece-pg': { x: 340, y: 410, w: 320, h: 40 },

    // EE
    'venue-eee-seminar': { x: 690, y: 270, w: 290, h: 80 },
    'venue-eee-analog': { x: 690, y: 360, w: 140, h: 90 },
    'venue-eee-power': { x: 840, y: 360, w: 140, h: 90 },

    // ME
    'venue-me-seminar': { x: 20, y: 500, w: 290, h: 55 },
    'venue-me-cad': { x: 20, y: 565, w: 290, h: 55 },
    'venue-me-heat': { x: 20, y: 630, w: 290, h: 50 },

    // IC
    'venue-ice-seminar': { x: 340, y: 500, w: 320, h: 85 },
    'venue-ice-lab': { x: 340, y: 595, w: 320, h: 85 },

    // CE
    'venue-ce-vm': { x: 690, y: 500, w: 290, h: 65 },
    'venue-ce-drafting': { x: 690, y: 575, w: 140, h: 50 },
    'venue-ce-mat': { x: 840, y: 575, w: 140, h: 50 },
    'venue-ce-survey': { x: 690, y: 635, w: 290, h: 45 },
  }
} as const;

export const DC = {
  ADM: { bg: 'rgba(185,28,28,.06)', st: 'rgba(185,28,28,.2)' },
  CS: { bg: 'rgba(37,99,235,.06)', st: 'rgba(37,99,235,.2)' },
  EC: { bg: 'rgba(124,58,237,.06)', st: 'rgba(124,58,237,.2)' },
  EE: { bg: 'rgba(234,88,12,.06)', st: 'rgba(234,88,12,.2)' },
  ME: { bg: 'rgba(20,184,166,.06)', st: 'rgba(20,184,166,.2)' },
  IC: { bg: 'rgba(219,39,119,.06)', st: 'rgba(219,39,119,.2)' },
  CE: { bg: 'rgba(101,163,13,.06)', st: 'rgba(101,163,13,.2)' },
} as const;

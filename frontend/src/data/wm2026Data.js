export const TEAMS = [
  // Gruppe A – USA (Gastgeber)
  { id: 'usa', name: 'USA',           flag: '🇺🇸', group: 'A' },
  { id: 'pan', name: 'Panama',        flag: '🇵🇦', group: 'A' },
  { id: 'bol', name: 'Bolivien',      flag: '🇧🇴', group: 'A' },
  { id: 'mar', name: 'Marokko',       flag: '🇲🇦', group: 'A' },
  // Gruppe B – Mexiko (Gastgeber)
  { id: 'mex', name: 'Mexiko',        flag: '🇲🇽', group: 'B' },
  { id: 'ecu', name: 'Ecuador',       flag: '🇪🇨', group: 'B' },
  { id: 'cmr', name: 'Kamerun',       flag: '🇨🇲', group: 'B' },
  { id: 'ksa', name: 'Saudi-Arabien', flag: '🇸🇦', group: 'B' },
  // Gruppe C – Kanada (Gastgeber)
  { id: 'can', name: 'Kanada',        flag: '🇨🇦', group: 'C' },
  { id: 'uru', name: 'Uruguay',       flag: '🇺🇾', group: 'C' },
  { id: 'kor', name: 'Südkorea',      flag: '🇰🇷', group: 'C' },
  { id: 'tun', name: 'Tunesien',      flag: '🇹🇳', group: 'C' },
  // Gruppe D
  { id: 'ger', name: 'Deutschland',   flag: '🇩🇪', group: 'D' },
  { id: 'jpn', name: 'Japan',         flag: '🇯🇵', group: 'D' },
  { id: 'col', name: 'Kolumbien',     flag: '🇨🇴', group: 'D' },
  { id: 'alg', name: 'Algerien',      flag: '🇩🇿', group: 'D' },
  // Gruppe E
  { id: 'esp', name: 'Spanien',       flag: '🇪🇸', group: 'E' },
  { id: 'srb', name: 'Serbien',       flag: '🇷🇸', group: 'E' },
  { id: 'sen', name: 'Senegal',       flag: '🇸🇳', group: 'E' },
  { id: 'jam', name: 'Jamaika',       flag: '🇯🇲', group: 'E' },
  // Gruppe F
  { id: 'fra', name: 'Frankreich',    flag: '🇫🇷', group: 'F' },
  { id: 'cro', name: 'Kroatien',      flag: '🇭🇷', group: 'F' },
  { id: 'aus', name: 'Australien',    flag: '🇦🇺', group: 'F' },
  { id: 'civ', name: 'Elfenbeinküste',flag: '🇨🇮', group: 'F' },
  // Gruppe G
  { id: 'bra', name: 'Brasilien',     flag: '🇧🇷', group: 'G' },
  { id: 'sui', name: 'Schweiz',       flag: '🇨🇭', group: 'G' },
  { id: 'irn', name: 'Iran',          flag: '🇮🇷', group: 'G' },
  { id: 'rsa', name: 'Südafrika',     flag: '🇿🇦', group: 'G' },
  // Gruppe H
  { id: 'eng', name: 'England',       flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'H' },
  { id: 'ned', name: 'Niederlande',   flag: '🇳🇱', group: 'H' },
  { id: 'nga', name: 'Nigeria',       flag: '🇳🇬', group: 'H' },
  { id: 'ven', name: 'Venezuela',     flag: '🇻🇪', group: 'H' },
  // Gruppe I
  { id: 'por', name: 'Portugal',      flag: '🇵🇹', group: 'I' },
  { id: 'bel', name: 'Belgien',       flag: '🇧🇪', group: 'I' },
  { id: 'egy', name: 'Ägypten',       flag: '🇪🇬', group: 'I' },
  { id: 'hon', name: 'Honduras',      flag: '🇭🇳', group: 'I' },
  // Gruppe J
  { id: 'arg', name: 'Argentinien',   flag: '🇦🇷', group: 'J' },
  { id: 'den', name: 'Dänemark',      flag: '🇩🇰', group: 'J' },
  { id: 'jor', name: 'Jordanien',     flag: '🇯🇴', group: 'J' },
  { id: 'nzl', name: 'Neuseeland',    flag: '🇳🇿', group: 'J' },
  // Gruppe K
  { id: 'aut', name: 'Österreich',    flag: '🇦🇹', group: 'K' },
  { id: 'tur', name: 'Türkei',        flag: '🇹🇷', group: 'K' },
  { id: 'irq', name: 'Irak',          flag: '🇮🇶', group: 'K' },
  { id: 'cod', name: 'DR Kongo',      flag: '🇨🇩', group: 'K' },
  // Gruppe L
  { id: 'hun', name: 'Ungarn',        flag: '🇭🇺', group: 'L' },
  { id: 'sco', name: 'Schottland',    flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'L' },
  { id: 'rou', name: 'Rumänien',      flag: '🇷🇴', group: 'L' },
  { id: 'uzb', name: 'Usbekistan',    flag: '🇺🇿', group: 'L' },
];

export const teamById = Object.fromEntries(TEAMS.map(t => [t.id, t]));

// Gruppenspiele: T0vT1, T2vT3 (MD1) | T0vT2, T1vT3 (MD2) | T0vT3, T1vT2 (MD3)
const GROUP_CONFIG = {
  A: { teams: ['usa','pan','bol','mar'], md1Date: '2026-06-11', md2Date: '2026-06-18', md3Date: '2026-06-26' },
  B: { teams: ['mex','ecu','cmr','ksa'], md1Date: '2026-06-11', md2Date: '2026-06-18', md3Date: '2026-06-26' },
  C: { teams: ['can','uru','kor','tun'], md1Date: '2026-06-12', md2Date: '2026-06-19', md3Date: '2026-06-26' },
  D: { teams: ['ger','jpn','col','alg'], md1Date: '2026-06-12', md2Date: '2026-06-19', md3Date: '2026-06-26' },
  E: { teams: ['esp','srb','sen','jam'], md1Date: '2026-06-13', md2Date: '2026-06-20', md3Date: '2026-06-27' },
  F: { teams: ['fra','cro','aus','civ'], md1Date: '2026-06-13', md2Date: '2026-06-20', md3Date: '2026-06-27' },
  G: { teams: ['bra','sui','irn','rsa'], md1Date: '2026-06-14', md2Date: '2026-06-21', md3Date: '2026-06-27' },
  H: { teams: ['eng','ned','nga','ven'], md1Date: '2026-06-14', md2Date: '2026-06-21', md3Date: '2026-06-27' },
  I: { teams: ['por','bel','egy','hon'], md1Date: '2026-06-15', md2Date: '2026-06-22', md3Date: '2026-06-28' },
  J: { teams: ['arg','den','jor','nzl'], md1Date: '2026-06-15', md2Date: '2026-06-22', md3Date: '2026-06-28' },
  K: { teams: ['aut','tur','irq','cod'], md1Date: '2026-06-16', md2Date: '2026-06-23', md3Date: '2026-06-28' },
  L: { teams: ['hun','sco','rou','uzb'], md1Date: '2026-06-16', md2Date: '2026-06-23', md3Date: '2026-06-28' },
};

const VENUES = [
  'SoFi Stadium, Los Angeles',
  'MetLife Stadium, New York',
  'AT&T Stadium, Dallas',
  'Hard Rock Stadium, Miami',
  'NRG Stadium, Houston',
  'Lumen Field, Seattle',
  'Mercedes-Benz Stadium, Atlanta',
  'Lincoln Financial Field, Philadelphia',
  'Arrowhead Stadium, Kansas City',
  'Levi\'s Stadium, San Francisco',
  'BC Place, Vancouver',
  'BMO Field, Toronto',
  'Azteca, Mexiko-Stadt',
  'Estadio Akron, Guadalajara',
  'Estadio BBVA, Monterrey',
  'Gillette Stadium, Boston',
];

let matchId = 1;
function nextId() { return matchId++; }
let venueIdx = 0;
function nextVenue() { return VENUES[venueIdx++ % VENUES.length]; }

// Ergebnisse für bereits gespielte Spiele (Simulation bis 12. Juni)
const RESULTS = {
  // 11. Juni – Gruppe B + Gruppe A (MD1)
  'B-MD1-1': { home: 1, away: 0 }, // Mexiko 1-0 Ecuador
  'B-MD1-2': { home: 0, away: 2 }, // Kamerun 0-2 Saudi-Arabien
  'A-MD1-1': { home: 3, away: 1 }, // USA 3-1 Panama
  'A-MD1-2': { home: 2, away: 0 }, // Marokko 2-0 Bolivien
  // 12. Juni – Gruppe D + Gruppe C (MD1)
  'D-MD1-1': { home: 2, away: 1 }, // Deutschland 2-1 Japan
  'D-MD1-2': { home: 1, away: 0 }, // Kolumbien 1-0 Algerien
  'C-MD1-1': { home: 1, away: 1 }, // Kanada 1-1 Uruguay
  'C-MD1-2': { home: 3, away: 0 }, // Südkorea 3-0 Tunesien
};

function makeMatch(group, matchday, homeId, awayId, date, time, resultKey) {
  const id = nextId();
  const result = RESULTS[resultKey] || null;
  const status = result ? 'finished' : 'upcoming';
  return {
    id,
    group,
    round: `Gruppe ${group}`,
    matchday,
    home: homeId,
    away: awayId,
    date,
    time,
    venue: nextVenue(),
    result,
    status,
    resultKey,
  };
}

function buildGroupMatches(group) {
  const { teams: t, md1Date, md2Date, md3Date } = GROUP_CONFIG[group];
  return [
    // Spieltag 1
    makeMatch(group, 1, t[0], t[1], md1Date, '17:00', `${group}-MD1-1`),
    makeMatch(group, 1, t[2], t[3], md1Date, '20:00', `${group}-MD1-2`),
    // Spieltag 2
    makeMatch(group, 2, t[0], t[2], md2Date, '17:00', `${group}-MD2-1`),
    makeMatch(group, 2, t[1], t[3], md2Date, '20:00', `${group}-MD2-2`),
    // Spieltag 3 (gleichzeitig)
    makeMatch(group, 3, t[0], t[3], md3Date, '20:00', `${group}-MD3-1`),
    makeMatch(group, 3, t[1], t[2], md3Date, '20:00', `${group}-MD3-2`),
  ];
}

const GROUP_MATCHES = 'ABCDEFGHIJKL'.split('').flatMap(g => buildGroupMatches(g));

// KO-Runde Platzhalter
const KO_ROUNDS = [
  // Achtelfinale (16 Spiele, 2.–5. Juli)
  ...Array.from({ length: 16 }, (_, i) => ({
    id: nextId(),
    group: null,
    round: 'Achtelfinale',
    matchday: null,
    home: 'tbd',
    away: 'tbd',
    date: `2026-07-0${2 + Math.floor(i / 4)}`,
    time: i % 2 === 0 ? '17:00' : '21:00',
    venue: nextVenue(),
    result: null,
    status: 'upcoming',
    label: `Achtelfinale ${i + 1}`,
  })),
  // Viertelfinale (4 Spiele, 8.–9. Juli)
  ...Array.from({ length: 4 }, (_, i) => ({
    id: nextId(),
    group: null,
    round: 'Viertelfinale',
    matchday: null,
    home: 'tbd',
    away: 'tbd',
    date: i < 2 ? '2026-07-08' : '2026-07-09',
    time: i % 2 === 0 ? '17:00' : '21:00',
    venue: nextVenue(),
    result: null,
    status: 'upcoming',
    label: `Viertelfinale ${i + 1}`,
  })),
  // Halbfinale (2 Spiele, 12.–13. Juli)
  { id: nextId(), group: null, round: 'Halbfinale', matchday: null, home: 'tbd', away: 'tbd', date: '2026-07-12', time: '21:00', venue: 'MetLife Stadium, New York', result: null, status: 'upcoming', label: 'Halbfinale 1' },
  { id: nextId(), group: null, round: 'Halbfinale', matchday: null, home: 'tbd', away: 'tbd', date: '2026-07-13', time: '21:00', venue: 'SoFi Stadium, Los Angeles', result: null, status: 'upcoming', label: 'Halbfinale 2' },
  // Spiel um Platz 3
  { id: nextId(), group: null, round: 'Spiel um Platz 3', matchday: null, home: 'tbd', away: 'tbd', date: '2026-07-18', time: '21:00', venue: 'AT&T Stadium, Dallas', result: null, status: 'upcoming', label: 'Spiel um Platz 3' },
  // Finale
  { id: nextId(), group: null, round: 'Finale', matchday: null, home: 'tbd', away: 'tbd', date: '2026-07-19', time: '21:00', venue: 'MetLife Stadium, New York', result: null, status: 'upcoming', label: 'Finale 🏆' },
];

export const ALL_MATCHES = [...GROUP_MATCHES, ...KO_ROUNDS];

export const GROUPS = 'ABCDEFGHIJKL'.split('');

export function getTeamMatches(teamId) {
  return GROUP_MATCHES.filter(m => m.home === teamId || m.away === teamId);
}

export function calcGroupStandings(group) {
  const teams = GROUP_CONFIG[group].teams;
  const matches = GROUP_MATCHES.filter(m => m.group === group && m.result);
  const table = Object.fromEntries(teams.map(id => [id, { id, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }]));

  for (const m of matches) {
    const h = table[m.home], a = table[m.away];
    if (!h || !a) continue;
    h.mp++; a.mp++;
    h.gf += m.result.home; h.ga += m.result.away;
    a.gf += m.result.away; a.ga += m.result.home;
    if (m.result.home > m.result.away) { h.w++; h.pts += 3; a.l++; }
    else if (m.result.home < m.result.away) { a.w++; a.pts += 3; h.l++; }
    else { h.d++; a.d++; h.pts++; a.pts++; }
  }

  return Object.values(table).sort((a, b) =>
    b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf
  );
}

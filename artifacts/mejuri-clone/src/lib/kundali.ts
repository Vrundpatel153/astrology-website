// Vedic Astrology (Jyotish) Calculation Engine
// Uses simplified but accurate planetary position algorithms
// Based on Jean Meeus "Astronomical Algorithms" simplified for Vedic use

export interface BirthData {
  name: string;
  date: string;   // YYYY-MM-DD
  time: string;   // HH:MM (24h)
  place: string;
  latitude: number;
  longitude: number;
}

export interface PlanetInfo {
  name: string;
  sanskrit: string;
  symbol: string;
  longitude: number;  // sidereal 0-360
  rashi: number;      // 1-12
  rashiName: string;
  rashiSymbol: string;
  nakshatra: string;
  nakshatraPada: number;
  house: number;
  isRetrograde: boolean;
  color: string;
}

export interface KundaliResult {
  lagna: number;
  lagnaName: string;
  lagnaSymbol: string;
  lagnaLongitude: number;
  planets: PlanetInfo[];
  houseRashis: number[];   // houseRashis[0] = rashi of 1st house (lagna)
  moonSign: string;
  moonSignSymbol: string;
  sunSign: string;
  nakshatra: string;
  nakshatraPada: number;
  nakshatraLord: string;
  crystalRecommendations: CrystalRec[];
  yogas: string[];
  doshas: string[];
  dashaLord: string;
  dashaYears: number;
}

export interface CrystalRec {
  crystal: string;
  reason: string;
  planet: string;
  image: string;
  benefit: string;
}

const RASHIS = [
  { name: "Mesha", english: "Aries",       symbol: "♈", ruler: "Mars",    element: "Fire"  },
  { name: "Vrishabha", english: "Taurus",  symbol: "♉", ruler: "Venus",   element: "Earth" },
  { name: "Mithuna", english: "Gemini",    symbol: "♊", ruler: "Mercury", element: "Air"   },
  { name: "Karka", english: "Cancer",      symbol: "♋", ruler: "Moon",    element: "Water" },
  { name: "Simha", english: "Leo",         symbol: "♌", ruler: "Sun",     element: "Fire"  },
  { name: "Kanya", english: "Virgo",       symbol: "♍", ruler: "Mercury", element: "Earth" },
  { name: "Tula", english: "Libra",        symbol: "♎", ruler: "Venus",   element: "Air"   },
  { name: "Vrishchika", english: "Scorpio",symbol: "♏", ruler: "Mars",    element: "Water" },
  { name: "Dhanu", english: "Sagittarius", symbol: "♐", ruler: "Jupiter", element: "Fire"  },
  { name: "Makara", english: "Capricorn",  symbol: "♑", ruler: "Saturn",  element: "Earth" },
  { name: "Kumbha", english: "Aquarius",   symbol: "♒", ruler: "Saturn",  element: "Air"   },
  { name: "Meena", english: "Pisces",      symbol: "♓", ruler: "Jupiter", element: "Water" },
];

const NAKSHATRAS = [
  { name: "Ashwini",           lord: "Ketu",    start: 0      },
  { name: "Bharani",           lord: "Venus",   start: 13.333 },
  { name: "Krittika",          lord: "Sun",     start: 26.667 },
  { name: "Rohini",            lord: "Moon",    start: 40     },
  { name: "Mrigashira",        lord: "Mars",    start: 53.333 },
  { name: "Ardra",             lord: "Rahu",    start: 66.667 },
  { name: "Punarvasu",         lord: "Jupiter", start: 80     },
  { name: "Pushya",            lord: "Saturn",  start: 93.333 },
  { name: "Ashlesha",          lord: "Mercury", start: 106.667},
  { name: "Magha",             lord: "Ketu",    start: 120    },
  { name: "Purva Phalguni",    lord: "Venus",   start: 133.333},
  { name: "Uttara Phalguni",   lord: "Sun",     start: 146.667},
  { name: "Hasta",             lord: "Moon",    start: 160    },
  { name: "Chitra",            lord: "Mars",    start: 173.333},
  { name: "Swati",             lord: "Rahu",    start: 186.667},
  { name: "Vishakha",          lord: "Jupiter", start: 200    },
  { name: "Anuradha",          lord: "Saturn",  start: 213.333},
  { name: "Jyeshtha",          lord: "Mercury", start: 226.667},
  { name: "Mula",              lord: "Ketu",    start: 240    },
  { name: "Purva Ashadha",     lord: "Venus",   start: 253.333},
  { name: "Uttara Ashadha",    lord: "Sun",     start: 266.667},
  { name: "Shravana",          lord: "Moon",    start: 280    },
  { name: "Dhanishtha",        lord: "Mars",    start: 293.333},
  { name: "Shatabhisha",       lord: "Rahu",    start: 306.667},
  { name: "Purva Bhadrapada",  lord: "Jupiter", start: 320    },
  { name: "Uttara Bhadrapada", lord: "Saturn",  start: 333.333},
  { name: "Revati",            lord: "Mercury", start: 346.667},
];

const DASHA_SEQUENCE = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
const DASHA_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17
};

function toRad(deg: number): number { return deg * Math.PI / 180; }
function toDeg(rad: number): number { return rad * 180 / Math.PI; }
function normalize(deg: number): number { return ((deg % 360) + 360) % 360; }

function julianDay(year: number, month: number, day: number, utHours: number): number {
  if (month <= 2) { year -= 1; month += 12; }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5 + utHours / 24;
}

function lahiriAyanamsa(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return 23.85 + T * 50.2916 / 3600 * 100;
}

function sunLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const L = normalize(280.460 + 0.9856474 * n);
  const g = normalize(357.528 + 0.9856003 * n);
  const gr = toRad(g);
  return normalize(L + 1.915 * Math.sin(gr) + 0.020 * Math.sin(2 * gr));
}

function moonLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const L = normalize(218.3165 + 13.17639648 * n);
  const M = normalize(134.9634 + 13.06499295 * n);
  const F = normalize(93.2721  + 13.22935024 * n);
  const D = normalize(297.8502 + 12.19074912 * n);
  const Mreg = toRad(M);
  const Freg = toRad(F);
  const Dreg = toRad(D);
  return normalize(
    L +
    6.289  * Math.sin(Mreg) +
    1.274  * Math.sin(2 * Dreg - Mreg) +
    0.658  * Math.sin(2 * Dreg) +
    0.214  * Math.sin(2 * Mreg) -
    0.185  * Math.sin(toRad(normalize(357.528 + 0.9856003 * n))) -
    0.114  * Math.sin(2 * Freg)
  );
}

function marsLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const L = normalize(355.433 + 0.524072 * n);
  const M = normalize(319.529 + 0.524033 * n);
  const Mreg = toRad(M);
  return normalize(L + 10.691 * Math.sin(Mreg) + 0.623 * Math.sin(2 * Mreg));
}

function mercuryLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const L = normalize(252.251 + 4.09234 * n);
  const M = normalize(174.795 + 4.09234 * n);
  const Mreg = toRad(M);
  const sunLon = sunLongitude(jd);
  const elongation = normalize(L - sunLon);
  return normalize(sunLon + elongation + 47.918 * Math.sin(Mreg));
}

function jupiterLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const L = normalize(34.351 + 0.083056 * n);
  const M = normalize(20.020 + 0.083091 * n);
  const Mreg = toRad(M);
  return normalize(L + 5.554 * Math.sin(Mreg) + 0.168 * Math.sin(2 * Mreg));
}

function venusLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const L = normalize(181.980 + 1.60214 * n);
  const M = normalize(48.006 + 1.60213 * n);
  const Mreg = toRad(M);
  const sunLon = sunLongitude(jd);
  const elongation = normalize(L - sunLon);
  return normalize(sunLon + elongation + 47.397 * Math.sin(Mreg));
}

function saturnLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const L = normalize(50.078 + 0.033460 * n);
  const M = normalize(317.020 + 0.033459 * n);
  const Mreg = toRad(M);
  return normalize(L + 6.249 * Math.sin(Mreg) + 0.123 * Math.sin(2 * Mreg));
}

function rahuLongitude(jd: number): number {
  const n = jd - 2451545.0;
  return normalize(125.0445 - 0.0529538 * n);
}

function ascendantLongitude(jd: number, lat: number, lon: number): number {
  const n = jd - 2451545.0;
  const GMST = normalize((280.46061837 + 360.98564736629 * n) + lon);
  const LST = toRad(GMST);
  const eps = toRad(23.4393 - 0.0000004 * n);
  const latRad = toRad(lat);
  const y = -Math.cos(LST);
  const x = Math.sin(LST) * Math.cos(eps) + Math.tan(latRad) * Math.sin(eps);
  let asc = toDeg(Math.atan2(y, x));
  if (asc < 0) asc += 360;
  return normalize(asc);
}

function isRetrograde(planet: string, jd: number): boolean {
  const delta = 0.5;
  const pos1 = getPlanetTropicalLon(planet, jd - delta);
  const pos2 = getPlanetTropicalLon(planet, jd + delta);
  let diff = pos2 - pos1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

function getPlanetTropicalLon(planet: string, jd: number): number {
  switch (planet) {
    case "Mars":    return marsLongitude(jd);
    case "Mercury": return mercuryLongitude(jd);
    case "Jupiter": return jupiterLongitude(jd);
    case "Venus":   return venusLongitude(jd);
    case "Saturn":  return saturnLongitude(jd);
    default: return 0;
  }
}

function toSidereal(tropical: number, ayanamsa: number): number {
  return normalize(tropical - ayanamsa);
}

function getRashi(lon: number): number {
  return Math.floor(lon / 30) + 1;
}

function getNakshatra(lon: number): { name: string; pada: number; lord: string } {
  const idx = Math.floor(lon / 13.3333);
  const nk = NAKSHATRAS[Math.min(idx, 26)];
  const posInNk = lon - nk.start;
  const pada = Math.floor(posInNk / (13.3333 / 4)) + 1;
  return { name: nk.name, pada: Math.min(pada, 4), lord: nk.lord };
}

function getHouse(planetRashi: number, lagnaRashi: number): number {
  return ((planetRashi - lagnaRashi + 12) % 12) + 1;
}

function getDasha(moonLon: number, jd: number): { lord: string; years: number } {
  const nkIdx = Math.floor(moonLon / 13.3333);
  const lord = NAKSHATRAS[Math.min(nkIdx, 26)].lord;
  const dashaIdx = DASHA_SEQUENCE.indexOf(lord);
  const cycleIdx = dashaIdx >= 0 ? dashaIdx : 0;
  return { lord: DASHA_SEQUENCE[cycleIdx], years: DASHA_YEARS[DASHA_SEQUENCE[cycleIdx]] };
}

function getCrystalRecommendations(planets: PlanetInfo[], lagnaRashi: number): CrystalRec[] {
  const recs: CrystalRec[] = [];
  const lagnaRuler = RASHIS[lagnaRashi - 1].ruler;

  const crystalMap: Record<string, { crystal: string; image: string; benefit: string }> = {
    Sun:     { crystal: "Citrine",          image: "/product-3.png",  benefit: "Boosts confidence, vitality & leadership" },
    Moon:    { crystal: "Moonstone",        image: "/product-2.png",  benefit: "Calms emotions, enhances intuition" },
    Mars:    { crystal: "Red Jasper",       image: "/product-1.png",  benefit: "Builds courage & life force energy" },
    Mercury: { crystal: "Green Aventurine", image: "/product-1.png",  benefit: "Sharpens intellect & communication" },
    Jupiter: { crystal: "Amethyst",         image: "/product-2.png",  benefit: "Attracts wisdom, growth & abundance" },
    Venus:   { crystal: "Rose Quartz",      image: "/product-1.png",  benefit: "Opens the heart to love & beauty" },
    Saturn:  { crystal: "Black Tourmaline", image: "/product-1.png",  benefit: "Grounds energy & removes obstacles" },
    Rahu:    { crystal: "Lapis Lazuli",     image: "/product-2.png",  benefit: "Cuts illusion & amplifies ambition" },
    Ketu:    { crystal: "Clear Quartz",     image: "/product-4.png",  benefit: "Deepens spiritual insight & liberation" },
  };

  const lagnaRec = crystalMap[lagnaRuler];
  if (lagnaRec) {
    recs.push({ crystal: lagnaRec.crystal, reason: `Lagna lord ${lagnaRuler} — strengthen your core self`, planet: lagnaRuler, ...lagnaRec });
  }

  const moonPlanet = planets.find(p => p.name === "Moon");
  if (moonPlanet) {
    const moonRuler = RASHIS[moonPlanet.rashi - 1].ruler;
    const moonRec = crystalMap[moonRuler];
    if (moonRec && moonRuler !== lagnaRuler) {
      recs.push({ crystal: moonRec.crystal, reason: `Moon in ${moonPlanet.rashiName} — emotional harmony`, planet: moonRuler, ...moonRec });
    }
  }

  const weakPlanets = planets.filter(p => p.isRetrograde && crystalMap[p.name]);
  for (const wp of weakPlanets.slice(0, 1)) {
    const rec = crystalMap[wp.name];
    if (rec) {
      recs.push({ crystal: rec.crystal, reason: `${wp.name} retrograde — remedy & balance`, planet: wp.name, ...rec });
    }
  }

  if (recs.length < 3) {
    const sunPlanet = planets.find(p => p.name === "Sun");
    if (sunPlanet) {
      const sunRuler = "Sun";
      const sunRec = crystalMap[sunRuler];
      if (sunRec && !recs.find(r => r.planet === "Sun")) {
        recs.push({ crystal: sunRec.crystal, reason: `Sun in ${sunPlanet.rashiName} — radiate your purpose`, planet: "Sun", ...sunRec });
      }
    }
  }

  return recs.slice(0, 3);
}

function detectYogas(planets: PlanetInfo[]): string[] {
  const yogas: string[] = [];
  const sun  = planets.find(p => p.name === "Sun");
  const moon = planets.find(p => p.name === "Moon");
  const jup  = planets.find(p => p.name === "Jupiter");
  const sat  = planets.find(p => p.name === "Saturn");

  if (sun && moon && Math.abs(sun.house - moon.house) === 6) yogas.push("Sunapha Yoga — wealth & eloquence");
  if (jup && jup.house === 1) yogas.push("Hamsa Yoga — wisdom, charisma & dharmic life");
  if (sat && sat.house === 7) yogas.push("Shasha Yoga — authority & material success");
  if (jup && moon && jup.house === moon.house) yogas.push("Gaja Kesari Yoga — intelligence & fame");
  if (sun && moon && sun.rashi === moon.rashi) yogas.push("Amavasya Yoga — deep introspection & inner power");
  if (yogas.length === 0) yogas.push("Dhana Yoga — steady growth in wealth & relationships");
  return yogas;
}

function detectDoshas(planets: PlanetInfo[]): string[] {
  const doshas: string[] = [];
  const mars  = planets.find(p => p.name === "Mars");
  const rahu  = planets.find(p => p.name === "Rahu");
  const sat   = planets.find(p => p.name === "Saturn");

  if (mars && [1, 4, 7, 8, 12].includes(mars.house)) {
    doshas.push("Mangal Dosha — wear Red Jasper or Coral for remedy");
  }
  if (rahu && [1, 5, 9].includes(rahu.house)) {
    doshas.push("Rahu influence — Lapis Lazuli helps navigate illusions");
  }
  if (sat && sat.isRetrograde) {
    doshas.push("Saturn retrograde — Black Tourmaline for karmic clearing");
  }
  return doshas;
}

export async function geocodePlace(place: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`;
    const resp = await fetch(url, { headers: { "User-Agent": "SeleniteSOul/1.0" } });
    const data = await resp.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
  } catch {
    // fallback to Delhi
  }
  return null;
}

export function calculateKundali(data: BirthData): KundaliResult {
  const [year, month, day] = data.date.split("-").map(Number);
  const [hour, minute] = data.time.split(":").map(Number);
  const utHours = hour + minute / 60;
  const jd = julianDay(year, month, day, utHours - 5.5);

  const ayanamsa = lahiriAyanamsa(jd);

  const tropSun     = sunLongitude(jd);
  const tropMoon    = moonLongitude(jd);
  const tropMars    = marsLongitude(jd);
  const tropMerc    = mercuryLongitude(jd);
  const tropJup     = jupiterLongitude(jd);
  const tropVen     = venusLongitude(jd);
  const tropSat     = saturnLongitude(jd);
  const tropRahu    = rahuLongitude(jd);
  const tropAsc     = ascendantLongitude(jd, data.latitude, data.longitude);

  const sidSun  = toSidereal(tropSun,  ayanamsa);
  const sidMoon = toSidereal(tropMoon, ayanamsa);
  const sidMars = toSidereal(tropMars, ayanamsa);
  const sidMerc = toSidereal(tropMerc, ayanamsa);
  const sidJup  = toSidereal(tropJup,  ayanamsa);
  const sidVen  = toSidereal(tropVen,  ayanamsa);
  const sidSat  = toSidereal(tropSat,  ayanamsa);
  const sidRahu = toSidereal(tropRahu, ayanamsa);
  const sidKetu = normalize(sidRahu + 180);
  const sidAsc  = toSidereal(tropAsc,  ayanamsa);

  const lagnaRashi = getRashi(sidAsc);

  function makePlanet(
    name: string, sanskrit: string, symbol: string,
    lon: number, retro: boolean, color: string
  ): PlanetInfo {
    const rashi = getRashi(lon);
    const nk = getNakshatra(lon);
    return {
      name, sanskrit, symbol,
      longitude: lon,
      rashi,
      rashiName: RASHIS[rashi - 1].name,
      rashiSymbol: RASHIS[rashi - 1].symbol,
      nakshatra: nk.name,
      nakshatraPada: nk.pada,
      house: getHouse(rashi, lagnaRashi),
      isRetrograde: retro,
      color,
    };
  }

  const planets: PlanetInfo[] = [
    makePlanet("Sun",     "Surya",     "☉", sidSun,  false,                            "#f59e0b"),
    makePlanet("Moon",    "Chandra",   "☽", sidMoon, false,                            "#94a3b8"),
    makePlanet("Mars",    "Mangal",    "♂", sidMars, isRetrograde("Mars",    jd),      "#ef4444"),
    makePlanet("Mercury", "Budha",     "☿", sidMerc, isRetrograde("Mercury", jd),     "#10b981"),
    makePlanet("Jupiter", "Guru",      "♃", sidJup,  isRetrograde("Jupiter", jd),     "#8b5cf6"),
    makePlanet("Venus",   "Shukra",    "♀", sidVen,  isRetrograde("Venus",   jd),     "#ec4899"),
    makePlanet("Saturn",  "Shani",     "♄", sidSat,  isRetrograde("Saturn",  jd),     "#64748b"),
    makePlanet("Rahu",    "Rahu",      "☊", sidRahu, true,                             "#6366f1"),
    makePlanet("Ketu",    "Ketu",      "☋", sidKetu, true,                             "#d97706"),
  ];

  const houseRashis: number[] = [];
  for (let h = 0; h < 12; h++) {
    houseRashis.push(((lagnaRashi - 1 + h) % 12) + 1);
  }

  const moonInfo    = planets[1];
  const nkInfo      = getNakshatra(sidMoon);
  const dashaInfo   = getDasha(sidMoon, jd);

  return {
    lagna: lagnaRashi,
    lagnaName: RASHIS[lagnaRashi - 1].name,
    lagnaSymbol: RASHIS[lagnaRashi - 1].symbol,
    lagnaLongitude: sidAsc,
    planets,
    houseRashis,
    moonSign: moonInfo.rashiName,
    moonSignSymbol: moonInfo.rashiSymbol,
    sunSign: planets[0].rashiName,
    nakshatra: nkInfo.name,
    nakshatraPada: nkInfo.pada,
    nakshatraLord: nkInfo.lord,
    crystalRecommendations: getCrystalRecommendations(planets, lagnaRashi),
    yogas: detectYogas(planets),
    doshas: detectDoshas(planets),
    dashaLord: dashaInfo.lord,
    dashaYears: dashaInfo.years,
  };
}

export { RASHIS, NAKSHATRAS };

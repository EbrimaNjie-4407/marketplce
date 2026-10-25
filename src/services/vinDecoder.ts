import { VEHICLE_DATA, getCanonicalMakeName, getAvailableModels } from '../data/vehicleData';

export interface VinDecodeResult {
  isValid: boolean;
  vin: string;
  make: string;
  model: string;
  year: string;
  engine?: string;
  country?: string;
  bodyStyle?: string;
  notes?: string;
}

// 10th Character Year Mapping according to standard ISO 3779
const YEAR_CODE_MAP: Record<string, string> = {
  '1': '2001',
  '2': '2002',
  '3': '2003',
  '4': '2004',
  '5': '2005',
  '6': '2006',
  '7': '2007',
  '8': '2008',
  '9': '2009',
  A: '2010',
  B: '2011',
  C: '2012',
  D: '2013',
  E: '2014',
  F: '2015',
  G: '2016',
  H: '2017',
  J: '2018',
  K: '2019',
  L: '2020',
  M: '2021',
  N: '2022',
  P: '2023',
  R: '2024',
  S: '2025',
  T: '2026',
};

export const SAMPLE_VINS = [
  {
    label: '2015 Mercedes GL450',
    vin: '4JGDF7DE5FA198243',
    make: 'Mercedes-Benz',
    model: 'GL450',
    year: '2015',
  },
  {
    label: '2014 Toyota Corolla',
    vin: '2T1BURHE5EC283419',
    make: 'Toyota',
    model: 'Corolla',
    year: '2014',
  },
  {
    label: '2017 Toyota Hilux D4D',
    vin: 'AHTFR29G8H1042918',
    make: 'Toyota',
    model: 'Hilux',
    year: '2017',
  },
  {
    label: '2015 Nissan Almera',
    vin: '3N1CN7AP5FL824190',
    make: 'Nissan',
    model: 'Almera',
    year: '2015',
  },
  {
    label: '2016 Honda Civic',
    vin: '2HGFC2F58GH581029',
    make: 'Honda',
    model: 'Civic',
    year: '2016',
  },
  {
    label: '2018 Hyundai Tucson',
    vin: 'KM8J33A48JU204192',
    make: 'Hyundai',
    model: 'Tucson',
    year: '2018',
  },
  {
    label: '2014 Ford Ranger TDCi',
    vin: 'MNBUMFF50EW182904',
    make: 'Ford',
    model: 'Ranger',
    year: '2014',
  },
  {
    label: '2016 Land Rover Range Rover',
    vin: 'SALGS2EF5GA381904',
    make: 'Land Rover',
    model: 'Range Rover',
    year: '2016',
  },
];

/**
 * Clean VIN string (removes hyphens, spaces, invalid chars, upper-cased)
 */
export function sanitizeVin(rawVin: string): string {
  if (!rawVin) return '';
  return rawVin.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/**
 * Decodes a 17-character or partial VIN into make, model, year, and vehicle specifications.
 */
export function decodeVin(rawVin: string): VinDecodeResult | null {
  const vin = sanitizeVin(rawVin);
  if (!vin || vin.length < 3) return null;

  // Extract WMI (characters 1-3)
  const wmi = vin.slice(0, 3);
  const wmi2 = vin.slice(0, 2);
  const vds = vin.length >= 8 ? vin.slice(3, 8) : '';
  const yearChar = vin.length >= 10 ? vin[9] : '';

  let make = '';
  let model = '';
  let year = yearChar && YEAR_CODE_MAP[yearChar] ? YEAR_CODE_MAP[yearChar] : '';
  let country = '';
  let engine = '';
  let bodyStyle = '';

  // 1. Identify Make and Country by WMI
  if (wmi.startsWith('JT') || wmi.startsWith('4T') || wmi.startsWith('2T') || wmi.startsWith('AHT') || wmi.startsWith('MR0')) {
    make = 'Toyota';
    country = wmi.startsWith('JT') ? 'Japan' : wmi.startsWith('AHT') ? 'South Africa' : wmi.startsWith('MR0') ? 'Thailand' : 'North America';
  } else if (wmi.startsWith('WDD') || wmi.startsWith('WDC') || wmi.startsWith('WDF') || wmi.startsWith('WDB') || wmi.startsWith('4JG')) {
    make = 'Mercedes-Benz';
    country = wmi.startsWith('4JG') ? 'USA (Vance Plant)' : 'Germany';
  } else if (wmi.startsWith('JN') || wmi.startsWith('1N') || wmi.startsWith('3N') || wmi.startsWith('VSK')) {
    make = 'Nissan';
    country = wmi.startsWith('JN') ? 'Japan' : wmi.startsWith('3N') ? 'Mexico' : wmi.startsWith('VSK') ? 'Spain' : 'USA';
  } else if (wmi.startsWith('JH') || wmi.startsWith('1H') || wmi.startsWith('2H') || wmi.startsWith('SHH') || wmi.startsWith('MRH')) {
    make = 'Honda';
    country = wmi.startsWith('JH') ? 'Japan' : wmi.startsWith('2H') ? 'Canada' : 'USA';
  } else if (wmi.startsWith('KM8') || wmi.startsWith('KMH') || wmi.startsWith('5NP') || wmi.startsWith('MAL')) {
    make = 'Hyundai';
    country = wmi.startsWith('5NP') ? 'USA' : wmi.startsWith('MAL') ? 'India' : 'South Korea';
  } else if (wmi.startsWith('KNA') || wmi.startsWith('KND') || wmi.startsWith('5XX')) {
    make = 'Kia';
    country = wmi.startsWith('5XX') ? 'USA' : 'South Korea';
  } else if (wmi.startsWith('JA3') || wmi.startsWith('JA4') || wmi.startsWith('JMB') || wmi.startsWith('MMT')) {
    make = 'Mitsubishi';
    country = wmi.startsWith('MMT') ? 'Thailand' : 'Japan';
  } else if (wmi.startsWith('1F') || wmi.startsWith('2F') || wmi.startsWith('3F') || wmi.startsWith('MNB') || wmi.startsWith('WF0') || wmi.startsWith('AFA')) {
    make = 'Ford';
    country = wmi.startsWith('MNB') ? 'South Africa' : wmi.startsWith('WF0') ? 'Europe' : 'USA';
  } else if (wmi.startsWith('WVW') || wmi.startsWith('WVG') || wmi.startsWith('WV1') || wmi.startsWith('WV2') || wmi.startsWith('3VW')) {
    make = 'Volkswagen';
    country = wmi.startsWith('3VW') ? 'Mexico' : 'Germany';
  } else if (wmi.startsWith('VF3')) {
    make = 'Peugeot';
    country = 'France';
  } else if (wmi.startsWith('WBA') || wmi.startsWith('WBS') || wmi.startsWith('WBX') || wmi.startsWith('5UX') || wmi.startsWith('5YM')) {
    make = 'BMW';
    country = wmi.startsWith('5UX') ? 'USA (Spartanburg)' : 'Germany';
  } else if (wmi.startsWith('WAU') || wmi.startsWith('WA1') || wmi.startsWith('TRU')) {
    make = 'Audi';
    country = 'Germany';
  } else if (wmi.startsWith('SAL')) {
    make = 'Land Rover';
    country = 'United Kingdom';
  }

  // Fallback make recognition if user typed short VIN or custom pattern
  if (!make) {
    for (const knownMake of Object.keys(VEHICLE_DATA)) {
      if (vin.includes(knownMake.toUpperCase().replace(/[^A-Z]/g, ''))) {
        make = knownMake;
        break;
      }
    }
  }

  if (!make) {
    return {
      isValid: false,
      vin,
      make: '',
      model: '',
      year: year || '',
      notes: 'Unrecognized manufacturer code in VIN.',
    };
  }

  // 2. Identify Model by VDS / Characteristic patterns
  const models = getAvailableModels(make);

  if (make === 'Toyota') {
    if (vds.includes('BUR') || vds.includes('BURH') || vin.includes('COROLLA') || vds.includes('BR') || vds.includes('18')) {
      model = 'Corolla';
      engine = '1.8L 2ZR-FE Petrol';
      bodyStyle = 'Sedan';
    } else if (vds.includes('BF') || vds.includes('BK') || vin.includes('CAMRY')) {
      model = 'Camry';
      engine = '2.5L 4-Cylinder / 3.5L V6';
      bodyStyle = 'Sedan';
    } else if (wmi.startsWith('AHT') || wmi.startsWith('MR0') || vds.includes('FR') || vin.includes('HILUX')) {
      model = 'Hilux';
      engine = '2.4L / 2.8L D4D Diesel';
      bodyStyle = 'Double Cab 4x4';
    } else if (vds.includes('DF') || vds.includes('HY') || vin.includes('RAV4')) {
      model = 'RAV4';
      engine = '2.0L / 2.5L AWD';
      bodyStyle = 'Crossover SUV';
    } else if (vds.includes('BU') || vin.includes('LAND') || vin.includes('CRUISER')) {
      model = 'Land Cruiser';
      engine = '4.5L V8 Twin Turbo Diesel';
      bodyStyle = 'Full-size SUV';
    } else if (vds.includes('JTM') || vin.includes('PRADO')) {
      model = 'Prado';
      engine = '3.0L D4D / 2.7L Petrol';
      bodyStyle = '4x4 SUV';
    } else if (vds.includes('FL') || vin.includes('HIACE')) {
      model = 'HiAce';
      engine = '2.5L / 3.0L Diesel Commuter';
      bodyStyle = 'Commercial Van';
    } else if (vds.includes('KSP') || vin.includes('VITZ')) {
      model = 'Vitz';
      engine = '1.3L 1NR-FE';
      bodyStyle = 'Hatchback';
    } else if (vin.includes('YARIS')) {
      model = 'Yaris';
      engine = '1.5L Petrol';
      bodyStyle = 'Hatchback';
    } else if (vin.includes('AVENSIS')) {
      model = 'Avensis';
      engine = '2.0L Valvematic';
      bodyStyle = 'Sedan';
    } else {
      model = models[0] || 'Corolla';
    }
  } else if (make === 'Mercedes-Benz') {
    if (vds.includes('DF') || vin.includes('GL450') || vds.includes('166872')) {
      model = 'GL450';
      engine = '4.7L V8 Biturbo M278';
      bodyStyle = '7-Seater Luxury SUV';
    } else if (vds.includes('BF') || vin.includes('ML350') || vds.includes('166057')) {
      model = 'ML350';
      engine = '3.5L V6 M276';
      bodyStyle = 'Mid-size SUV';
    } else if (vds.includes('204') || vds.includes('GF') || vin.includes('C200')) {
      model = 'C200';
      engine = '1.8L CGI Turbo';
      bodyStyle = 'Saloon';
    } else if (vds.includes('205') || vin.includes('C300')) {
      model = 'C300';
      engine = '2.0L Turbo M274';
      bodyStyle = 'Sedan';
    } else if (vds.includes('212') || vin.includes('E350')) {
      model = 'E350';
      engine = '3.5L V6 Direct Injection';
      bodyStyle = 'Executive Sedan';
    } else if (vin.includes('E200')) {
      model = 'E200';
      engine = '2.0L Turbo';
      bodyStyle = 'Executive Sedan';
    } else if (vds.includes('222') || vin.includes('S550')) {
      model = 'S550';
      engine = '4.7L V8 Bi-turbo';
      bodyStyle = 'Flagship Sedan';
    } else if (wmi.startsWith('WDF') || vin.includes('SPRINTER')) {
      model = 'Sprinter';
      engine = '2.1L OM651 CDI';
      bodyStyle = 'Commercial Van';
    } else if (vin.includes('G63') || vin.includes('AMG')) {
      model = 'G63 AMG';
      engine = '5.5L V8 Bi-turbo';
      bodyStyle = 'G-Wagon 4x4';
    } else if (vin.includes('GLE')) {
      model = 'GLE350';
      engine = '3.5L V6';
      bodyStyle = 'Luxury SUV';
    } else if (vin.includes('GLC')) {
      model = 'GLC300';
      engine = '2.0L Turbo 4MATIC';
      bodyStyle = 'Compact SUV';
    } else {
      model = models[0] || 'GL450';
    }
  } else if (make === 'Nissan') {
    if (vds.includes('CN') || vin.includes('ALMERA') || vds.includes('1HC')) {
      model = 'Almera';
      engine = '1.5L HR15DE Petrol';
      bodyStyle = 'Sedan';
    } else if (vin.includes('SUNNY') || vds.includes('1HA')) {
      model = 'Sunny';
      engine = '1.5L Petrol';
      bodyStyle = 'Sedan';
    } else if (vds.includes('TA') || vin.includes('PATROL')) {
      model = 'Patrol';
      engine = '5.6L V8 VK56 / 4.8L TB48';
      bodyStyle = 'Heavy Duty 4x4';
    } else if (vds.includes('TB') || vds.includes('EB') || vin.includes('NAVARA')) {
      model = 'Navara';
      engine = '2.5L dCi YD25 Turbo Diesel';
      bodyStyle = 'Pickup Truck';
    } else if (vds.includes('AS') || vds.includes('TD') || vin.includes('XTRAIL') || vin.includes('X-TRAIL')) {
      model = 'X-Trail';
      engine = '2.0L / 2.5L QR25DE';
      bodyStyle = 'Crossover SUV';
    } else if (vin.includes('QASHQAI') || vds.includes('JD')) {
      model = 'Qashqai';
      engine = '1.6L / 2.0L Petrol';
      bodyStyle = 'Compact Crossover';
    } else if (vin.includes('SENTRA') || vds.includes('3SH')) {
      model = 'Sentra';
      engine = '1.8L MRA8DE';
      bodyStyle = 'Sedan';
    } else if (vin.includes('ALTIMA') || vds.includes('3TA')) {
      model = 'Altima';
      engine = '2.5L QR25DE';
      bodyStyle = 'Sedan';
    } else if (vin.includes('PATHFINDER') || vds.includes('3JA')) {
      model = 'Pathfinder';
      engine = '3.5L V6';
      bodyStyle = '7-Passenger SUV';
    } else {
      model = models[0] || 'Almera';
    }
  } else if (make === 'Honda') {
    if (vds.includes('FC') || vds.includes('FA') || vin.includes('CIVIC')) {
      model = 'Civic';
      engine = '1.8L / 2.0L i-VTEC';
      bodyStyle = 'Sedan';
    } else if (vds.includes('CR') || vin.includes('ACCORD')) {
      model = 'Accord';
      engine = '2.4L Earth Dreams K24W';
      bodyStyle = 'Sedan';
    } else if (vds.includes('RM') || vds.includes('RE') || vin.includes('CRV') || vin.includes('CR-V')) {
      model = 'CR-V';
      engine = '2.4L i-VTEC AWD';
      bodyStyle = 'SUV';
    } else if (vds.includes('YF') || vin.includes('PILOT')) {
      model = 'Pilot';
      engine = '3.5L V6';
      bodyStyle = 'Full-size SUV';
    } else if (vds.includes('TF') || vin.includes('FIT')) {
      model = 'Fit';
      engine = '1.5L i-VTEC';
      bodyStyle = 'Hatchback';
    } else if (vin.includes('CITY')) {
      model = 'City';
      engine = '1.5L Petrol';
      bodyStyle = 'Sedan';
    } else if (vin.includes('HRV') || vin.includes('HR-V')) {
      model = 'HR-V';
      engine = '1.8L Crossover';
      bodyStyle = 'Subcompact SUV';
    } else {
      model = models[0] || 'Civic';
    }
  } else if (make === 'Hyundai') {
    if (vds.includes('HD') || vin.includes('ELANTRA')) {
      model = 'Elantra';
      engine = '1.8L Nu / 2.0L';
      bodyStyle = 'Sedan';
    } else if (vds.includes('JU') || vds.includes('J3') || vin.includes('TUCSON')) {
      model = 'Tucson';
      engine = '2.0L Petrol / 1.6L Turbo';
      bodyStyle = 'Compact SUV';
    } else if (vds.includes('SU') || vin.includes('SANTA')) {
      model = 'Santa Fe';
      engine = '2.4L Petrol / 2.2L CRDi Diesel';
      bodyStyle = 'Mid-size SUV';
    } else if (vds.includes('HE') || vin.includes('SONATA')) {
      model = 'Sonata';
      engine = '2.4L Theta II';
      bodyStyle = 'Sedan';
    } else if (vds.includes('HC') || vin.includes('ACCENT')) {
      model = 'Accent';
      engine = '1.6L Gamma';
      bodyStyle = 'Sedan';
    } else if (vin.includes('CRETA')) {
      model = 'Creta';
      engine = '1.6L Petrol';
      bodyStyle = 'Crossover';
    } else if (vin.includes('I10')) {
      model = 'i10';
      engine = '1.1L / 1.2L Kappa';
      bodyStyle = 'City Car';
    } else if (vin.includes('I20')) {
      model = 'i20';
      engine = '1.4L Petrol';
      bodyStyle = 'Hatchback';
    } else {
      model = models[0] || 'Tucson';
    }
  } else if (make === 'Kia') {
    if (vds.includes('PB') || vin.includes('SPORTAGE')) {
      model = 'Sportage';
      engine = '2.0L / 2.4L DOHC';
      bodyStyle = 'Crossover SUV';
    } else if (vds.includes('MB') || vin.includes('SORENTO')) {
      model = 'Sorento';
      engine = '2.4L / 3.3L V6 / 2.2L CRDi';
      bodyStyle = '7-Seater SUV';
    } else if (vds.includes('FK') || vin.includes('CERATO')) {
      model = 'Cerato';
      engine = '1.6L / 2.0L';
      bodyStyle = 'Sedan';
    } else if (vds.includes('DE') || vin.includes('RIO')) {
      model = 'Rio';
      engine = '1.4L Gamma';
      bodyStyle = 'Subcompact';
    } else if (vin.includes('OPTIMA')) {
      model = 'Optima';
      engine = '2.4L Theta II';
      bodyStyle = 'Sedan';
    } else if (vin.includes('PICANTO')) {
      model = 'Picanto';
      engine = '1.0L / 1.2L';
      bodyStyle = 'Hatchback';
    } else {
      model = models[0] || 'Sportage';
    }
  } else if (make === 'Ford') {
    if (wmi.startsWith('MNB') || vds.includes('UM') || vin.includes('RANGER')) {
      model = 'Ranger';
      engine = '2.2L / 3.2L TDCi Duratorq';
      bodyStyle = 'Double Cab Pickup';
    } else if (vds.includes('5K') || vin.includes('EXPLORER')) {
      model = 'Explorer';
      engine = '3.5L Ti-VCT V6';
      bodyStyle = 'Mid-size SUV';
    } else if (vds.includes('FW') || vin.includes('F150') || vin.includes('F-150')) {
      model = 'F-150';
      engine = '3.5L EcoBoost / 5.0L V8';
      bodyStyle = 'Full-size Truck';
    } else if (vds.includes('DP') || vin.includes('FOCUS')) {
      model = 'Focus';
      engine = '2.0L Ti-VCT';
      bodyStyle = 'Hatchback / Sedan';
    } else if (vin.includes('ESCAPE')) {
      model = 'Escape';
      engine = '2.5L / 2.0L EcoBoost';
      bodyStyle = 'Compact SUV';
    } else if (vin.includes('TRANSIT')) {
      model = 'Transit';
      engine = '2.2L TDCi Diesel';
      bodyStyle = 'Commercial Van';
    } else {
      model = models[0] || 'Ranger';
    }
  } else if (make === 'Volkswagen') {
    if (vds.includes('AU') || vin.includes('GOLF')) {
      model = 'Golf';
      engine = '1.4L TSI / 2.0L TDI';
      bodyStyle = 'Hatchback';
    } else if (vds.includes('3C') || vin.includes('PASSAT')) {
      model = 'Passat';
      engine = '1.8L / 2.0L TSI';
      bodyStyle = 'Executive Sedan';
    } else if (vds.includes('5N') || vin.includes('TIGUAN')) {
      model = 'Tiguan';
      engine = '2.0L TSI / TDI 4MOTION';
      bodyStyle = 'SUV';
    } else if (vds.includes('6R') || vin.includes('POLO')) {
      model = 'Polo';
      engine = '1.4L MPI / 1.2L TSI';
      bodyStyle = 'Hatchback';
    } else if (vin.includes('TOUAREG')) {
      model = 'Touareg';
      engine = '3.0L V6 TDI';
      bodyStyle = 'Luxury SUV';
    } else if (vin.includes('TRANSPORTER')) {
      model = 'Transporter';
      engine = '2.0L TDI T5/T6';
      bodyStyle = 'Van';
    } else {
      model = models[0] || 'Golf';
    }
  } else if (make === 'Peugeot') {
    if (vds.includes('2') || vin.includes('206')) {
      model = '206';
      engine = '1.4L / 1.6L Petrol';
      bodyStyle = 'Hatchback';
    } else if (vds.includes('3') || vin.includes('307')) {
      model = '307';
      engine = '1.6L / 2.0L HDi';
      bodyStyle = 'Hatchback';
    } else if (vds.includes('8') || vin.includes('406')) {
      model = '406';
      engine = '2.0L HDi / 1.8L 16V';
      bodyStyle = 'Saloon';
    } else if (vin.includes('508')) {
      model = '508';
      engine = '2.0L BlueHDi';
      bodyStyle = 'Sedan';
    } else if (vin.includes('3008')) {
      model = '3008';
      engine = '1.6L HDi / 1.6L THP';
      bodyStyle = 'Crossover';
    } else if (vin.includes('PARTNER')) {
      model = 'Partner';
      engine = '1.6L HDi Diesel';
      bodyStyle = 'Van';
    } else {
      model = models[0] || '406';
    }
  } else if (make === 'BMW') {
    if (vds.includes('3') || vin.includes('320') || vin.includes('3 SERIES')) {
      model = '3 Series (320i)';
      engine = '2.0L TwinPower Turbo';
      bodyStyle = 'Sedan';
    } else if (vds.includes('5') || vin.includes('528') || vin.includes('5 SERIES')) {
      model = '5 Series (528i)';
      engine = '2.0L Turbo / 3.0L';
      bodyStyle = 'Executive Sedan';
    } else if (vds.includes('KR') || vin.includes('X5') || wmi.startsWith('5UX')) {
      model = 'X5';
      engine = '3.0L Turbo xDrive';
      bodyStyle = 'Luxury SAV';
    } else if (vin.includes('X3')) {
      model = 'X3';
      engine = '2.0L xDrive';
      bodyStyle = 'SAV';
    } else if (vin.includes('7 SERIES') || vin.includes('730') || vin.includes('750')) {
      model = '7 Series';
      engine = '3.0L / 4.4L V8';
      bodyStyle = 'Luxury Flagship';
    } else {
      model = models[0] || '3 Series (320i)';
    }
  } else if (make === 'Audi') {
    if (vds.includes('8K') || vin.includes('A4')) {
      model = 'A4';
      engine = '2.0L TFSI / 2.0L TDI';
      bodyStyle = 'Sedan';
    } else if (vds.includes('4G') || vin.includes('A6')) {
      model = 'A6';
      engine = '2.0L / 3.0L Supercharged';
      bodyStyle = 'Executive Sedan';
    } else if (vds.includes('8R') || vin.includes('Q5')) {
      model = 'Q5';
      engine = '2.0L TFSI Quattro';
      bodyStyle = 'Compact Luxury SUV';
    } else if (vin.includes('Q7')) {
      model = 'Q7';
      engine = '3.0L TDI V6';
      bodyStyle = '7-Seat Luxury SUV';
    } else {
      model = models[0] || 'A4';
    }
  } else if (make === 'Land Rover') {
    if (vds.includes('GS') || vin.includes('RANGE') || vin.includes('ROVER')) {
      model = 'Range Rover';
      engine = '3.0L TDV6 / 5.0L Supercharged';
      bodyStyle = 'Luxury 4x4';
    } else if (vds.includes('LD') || vin.includes('DEFENDER')) {
      model = 'Defender';
      engine = '2.4L / 2.2L TDCi Puma';
      bodyStyle = 'All-terrain 4x4';
    } else if (vds.includes('AG') || vin.includes('DISCOVERY')) {
      model = 'Discovery';
      engine = '3.0L SDV6';
      bodyStyle = '7-Seater 4x4';
    } else if (vin.includes('EVOQUE')) {
      model = 'Evoque';
      engine = '2.0L Turbo Si4';
      bodyStyle = 'Compact Luxury SUV';
    } else {
      model = models[0] || 'Range Rover';
    }
  } else if (make === 'Mitsubishi') {
    if (vin.includes('PAJERO')) {
      model = 'Pajero';
      engine = '3.2L DI-D Diesel';
      bodyStyle = '4x4 SUV';
    } else if (vin.includes('L200')) {
      model = 'L200';
      engine = '2.5L DI-D Triton';
      bodyStyle = 'Pickup';
    } else if (vin.includes('OUTLANDER')) {
      model = 'Outlander';
      engine = '2.4L MIVEC';
      bodyStyle = 'SUV';
    } else if (vin.includes('LANCER')) {
      model = 'Lancer';
      engine = '1.6L / 2.0L';
      bodyStyle = 'Sedan';
    } else if (vin.includes('MONTERO')) {
      model = 'Montero';
      engine = '3.5L V6';
      bodyStyle = 'SUV';
    } else {
      model = models[0] || 'Pajero';
    }
  } else {
    model = models[0] || '';
  }

  // Fallback default year if missing
  if (!year) {
    year = '2015';
  }

  return {
    isValid: true,
    vin,
    make,
    model,
    year,
    engine,
    country,
    bodyStyle,
    notes: `${country ? `${country} build. ` : ''}${engine ? `Engine: ${engine}. ` : ''}${bodyStyle ? `Body: ${bodyStyle}.` : ''}`,
  };
}

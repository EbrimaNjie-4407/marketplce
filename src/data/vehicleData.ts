export const VEHICLE_DATA: Record<string, string[]> = {
  'Mercedes-Benz': ['GL450', 'ML350', 'C200', 'C300', 'E350', 'E200', 'GLC300', 'GLE350', 'S550', 'Sprinter', 'G63 AMG', 'CLA250'],
  'Toyota': ['Corolla', 'Camry', 'Hilux', 'Land Cruiser', 'RAV4', 'Vitz', 'Prado', 'Avensis', 'Yaris', 'HiAce'],
  'Nissan': ['Almera', 'Sunny', 'Patrol', 'Navara', 'X-Trail', 'Qashqai', 'Sentra', 'Altima', 'Pathfinder', 'Tiida'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit', 'City', 'HR-V'],
  'Hyundai': ['Elantra', 'Tucson', 'Santa Fe', 'Sonata', 'Accent', 'Creta', 'i10', 'i20'],
  'Kia': ['Sportage', 'Sorento', 'Cerato', 'Rio', 'Optima', 'Picanto'],
  'Mitsubishi': ['Pajero', 'L200', 'Outlander', 'Lancer', 'Montero'],
  'Ford': ['Ranger', 'Explorer', 'F-150', 'Focus', 'Escape', 'Transit'],
  'Volkswagen': ['Golf', 'Passat', 'Tiguan', 'Polo', 'Touareg', 'Transporter'],
  'Peugeot': ['206', '307', '406', '508', '3008', 'Partner'],
  'BMW': ['3 Series (320i)', '5 Series (528i)', 'X5', 'X3', '7 Series'],
  'Audi': ['A4', 'A6', 'Q5', 'Q7'],
  'Land Rover': ['Range Rover', 'Defender', 'Discovery', 'Evoque'],
};

export const COMMON_PARTS = [
  { name: 'Alternator', category: 'Electrical', code: '27060' },
  { name: 'Starter motor', category: 'Electrical', code: '23300' },
  { name: 'Stabilizer link', category: 'Suspension & Steering', code: '48820' },
  { name: 'Serpentine belt (Sapentine belt)', category: 'Engine & Belts', code: '6PK-Belt' },
  { name: 'Brake pads', category: 'Braking System', code: '04465' },
  { name: 'Oil filter', category: 'Service & Maintenance', code: '90915' },
  { name: 'Radiator', category: 'Cooling System', code: '16400' },
  { name: 'Shock absorber', category: 'Suspension', code: '48510' },
  { name: 'Fuel pump', category: 'Fuel System', code: '23220' },
  { name: 'Air filter', category: 'Engine Filtration', code: '17801' },
  { name: 'Spark plugs', category: 'Ignition', code: '90919' },
  { name: 'Clutch kit', category: 'Transmission', code: '31250' },
];

export interface QuickFilter {
  id: string;
  label: string;
  shortLabel: string;
  categoryName: string;
  description: string;
  keywords: string[];
}

export const QUICK_FILTERS: QuickFilter[] = [
  {
    id: 'oil_filters',
    label: 'Oil filters',
    shortLabel: 'Oil filters',
    categoryName: 'Filters',
    description: 'Spin-on & cartridge oil filter elements',
    keywords: ['oil filter', 'oil-filter', 'oil cartridge', 'filter element', 'lube filter', '90915', 'a276180'],
  },
  {
    id: 'engine_parts',
    label: 'Engine parts',
    shortLabel: 'Engine parts',
    categoryName: 'Engine',
    description: 'Alternators, starter motors, serpentine belts, radiators, spark plugs & timing',
    keywords: [
      'engine',
      'alternator',
      'starter',
      'starter motor',
      'belt',
      'sapentine',
      'serpentine',
      'radiator',
      'spark plug',
      'plug',
      'cylinder',
      'head gasket',
      'gasket',
      'fuel pump',
      'piston',
      'valve',
      'timing',
      'crankshaft',
      'camshaft',
      'injector',
      'turbo',
      'water pump',
      'oil filter',
      'air filter',
      'cooling',
    ],
  },
  {
    id: 'suspension_parts',
    label: 'Suspension parts',
    shortLabel: 'Suspension',
    categoryName: 'Suspension',
    description: 'Stabilizer links, sway bars, shock absorbers, struts & control arms',
    keywords: [
      'suspension',
      'stabilizer',
      'stabilizer link',
      'sway bar',
      'shock',
      'shock absorber',
      'strut',
      'spring',
      'control arm',
      'ball joint',
      'bushing',
      'tie rod',
      'steering rack',
      'wheel bearing',
      '48820',
      '48510',
      'a204320',
    ],
  },
  {
    id: 'sensors',
    label: 'Sensors',
    shortLabel: 'Sensors',
    categoryName: 'Electrical & Sensors',
    description: 'O2 oxygen sensors, MAF airflow sensors, ABS wheel speed & position sensors',
    keywords: [
      'sensor',
      'o2',
      'oxygen',
      'maf',
      'mass air',
      'abs',
      'speed sensor',
      'camshaft sensor',
      'crankshaft sensor',
      'knock sensor',
      'temperature sensor',
      'pressure sensor',
      'throttle',
      'lambda',
      'a272094',
      'a004542',
      '89542',
    ],
  },
  {
    id: 'braking_system',
    label: 'Braking system',
    shortLabel: 'Brakes',
    categoryName: 'Brakes',
    description: 'Ceramic brake pads, disc rotors, calipers & brake shoes',
    keywords: ['brake', 'pad', 'disc', 'rotor', 'caliper', 'shoe', 'master cylinder', '04465'],
  },
  {
    id: 'cooling_ac',
    label: 'Cooling & AC',
    shortLabel: 'Cooling & AC',
    categoryName: 'Cooling',
    description: 'Engine radiators, AC compressors, condensers & cooling fans',
    keywords: ['radiator', 'cooling', 'water pump', 'thermostat', 'compressor', 'condenser', 'fan', 'coolant', '16400'],
  },
];

/**
 * Checks whether an inventory part matches a quick filter category
 */
export function matchPartWithCategory(
  item: { partName: string; partNumber?: string; description?: string; compatibleEngine?: string },
  categoryId: string
): boolean {
  if (!categoryId || categoryId === 'all') return true;
  const filter = QUICK_FILTERS.find((f) => f.id === categoryId);
  if (!filter) return false;
  const text = `${item.partName} ${item.partNumber || ''} ${item.description || ''} ${item.compatibleEngine || ''}`.toLowerCase();
  return filter.keywords.some((kw) => text.includes(kw.toLowerCase()));
}

/**
 * Returns the canonical make name if recognized (handling variations like "mercedez", "mercedes benz", etc.)
 */
export function getCanonicalMakeName(inputMake: string): string | null {
  if (!inputMake) return null;
  const raw = inputMake.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

  if (raw.includes('merced') || raw.includes('benz')) {
    return 'Mercedes-Benz';
  }

  for (const make of Object.keys(VEHICLE_DATA)) {
    const cleanMake = make.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (cleanMake === raw || raw.includes(cleanMake) || cleanMake.includes(raw)) {
      return make;
    }
  }

  return null;
}

/**
 * Returns available models for a given make
 */
export function getAvailableModels(make: string): string[] {
  if (!make) return [];
  const canonical = getCanonicalMakeName(make);
  if (canonical && VEHICLE_DATA[canonical]) {
    return VEHICLE_DATA[canonical];
  }

  // Fallback direct case-insensitive check
  const normalized = make.trim().toLowerCase();
  for (const [key, models] of Object.entries(VEHICLE_DATA)) {
    if (key.toLowerCase() === normalized) {
      return models;
    }
  }

  return [];
}

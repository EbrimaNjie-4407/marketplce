import {
  User,
  DealerProfile,
  DealerApplication,
  InventoryItem,
  PartRequest,
  DealerOffer,
  Order,
  NotificationItem,
  ActivityLog,
  UserRole,
  DeliveryMethod,
  DeliveryRiderProfile,
  DeliveryRequestJob,
} from '../types';

import alternatorImg from '../assets/images/alternator_assembly_1791849520193.jpg';
import brakePadsImg from '../assets/images/brake_pads_automotive_1791849520783.jpg';
import radiatorImg from '../assets/images/radiator_cooling_car_1791849520195.jpg';
import { COMPREHENSIVE_PARTS_INVENTORY, getPartPhoto } from '../data/partsCatalog';

const STORAGE_KEY = 'autospares_gm_store_v2';

// Seed Initial Data matching the Figma design specifications
const INITIAL_USERS: User[] = [
  {
    id: 'user_kwame',
    name: 'Kwame Mensah',
    role: 'mechanic',
    email: 'kwame@mensahautoworks.com',
    phone: '+220 745 5010',
    workshopName: 'Mensah Auto Works',
    location: 'Westfield, Serrekunda',
    joinedDate: '14 June 2026',
    status: 'active',
    totalRequests: 15,
    activeRequests: 3,
    completedRequests: 12,
  },
  {
    id: 'user_ebrima',
    name: 'Ebrima Njie',
    role: 'mechanic',
    email: 'ebrima@gamtechrepairs.gm',
    phone: '+220 398 1142',
    workshopName: 'Njie Auto Diagnostics',
    location: 'Jeshwang Industrial Area',
    joinedDate: '28 July 2026',
    status: 'active',
    totalRequests: 8,
    activeRequests: 2,
    completedRequests: 6,
  },
  {
    id: 'user_burgi',
    name: 'Kofi Owusu',
    role: 'dealer',
    email: 'sales@burgiautoparts.gm',
    phone: '+220 724 5550',
    workshopName: 'Burgi Spare Parts',
    location: 'Shop 18, Jeshwang Spare Parts Junction',
    joinedDate: '14 June 2026',
    status: 'active',
  },
  {
    id: 'user_admin',
    name: 'Ama Owusu',
    role: 'admin',
    email: 'admin@autospares.gm',
    phone: '+220 700 9000',
    workshopName: 'Marketplace Operations',
    location: 'Banjul, The Gambia',
    joinedDate: '01 Jan 2026',
    status: 'active',
  },
  {
    id: 'user_akousa',
    name: 'Akosua Asare',
    role: 'mechanic',
    email: 'akousa@asaregarage.gm',
    phone: '+220 711 2233',
    workshopName: 'Asare Workshop',
    location: 'Kanifing Layout',
    joinedDate: '10 Aug 2026',
    status: 'active',
    totalRequests: 5,
    activeRequests: 1,
    completedRequests: 4,
  },
  {
    id: 'user_yaw',
    name: 'Yaw Boateng',
    role: 'mechanic',
    email: 'yaw@boatengmotors.gm',
    phone: '+220 789 4455',
    workshopName: 'Boateng Auto Services',
    location: 'Brikama Highway',
    joinedDate: '19 Aug 2026',
    status: 'active',
    totalRequests: 6,
    activeRequests: 1,
    completedRequests: 5,
  },
  {
    id: 'user_modou',
    name: 'Modou Lamin Ceesay',
    role: 'delivery_rider',
    email: 'modou.rider@autospares.gm',
    phone: '+220 733 4921',
    workshopName: 'AutoSpares Express Dispatch',
    location: 'Jeshwang & Westfield Corridor',
    joinedDate: '12 May 2026',
    status: 'active',
  },
];

export const INITIAL_RIDERS: DeliveryRiderProfile[] = [
  {
    id: 'rider_modou',
    name: 'Modou Lamin Ceesay',
    phone: '+220 733 4921',
    email: 'modou.rider@autospares.gm',
    vehicleType: 'Motorcycle',
    plateNumber: 'BJL-4821-B',
    primaryZone: 'Jeshwang & Westfield Corridor',
    isOnline: true,
    rating: 4.9,
    completedDeliveries: 38,
    todayDeliveries: 4,
    todayEarningsGMD: 520,
    totalEarningsGMD: 4940,
    joinedDate: '12 May 2026',
    status: 'active',
  },
  {
    id: 'rider_bakary',
    name: 'Bakary Touray',
    phone: '+220 311 8890',
    email: 'bakary.touray@autospares.gm',
    vehicleType: 'Motorcycle',
    plateNumber: 'KNF-1190-C',
    primaryZone: 'Greater Banjul & Kanifing',
    isOnline: true,
    rating: 4.8,
    completedDeliveries: 22,
    todayDeliveries: 2,
    todayEarningsGMD: 260,
    totalEarningsGMD: 2860,
    joinedDate: '02 June 2026',
    status: 'active',
  },
  {
    id: 'rider_ebrima',
    name: 'Ebrima Sanyang',
    phone: '+220 744 6310',
    email: 'ebrima.sanyang@autospares.gm',
    vehicleType: 'Scooter',
    plateNumber: 'BJL-9923-D',
    primaryZone: 'Westfield & Serrekunda Interchange',
    isOnline: true,
    rating: 5.0,
    completedDeliveries: 45,
    todayDeliveries: 5,
    todayEarningsGMD: 650,
    totalEarningsGMD: 5850,
    joinedDate: '18 April 2026',
    status: 'active',
  },
  {
    id: 'rider_pa_omar',
    name: 'Pa Omar Touray',
    phone: '+220 912 3456',
    email: 'paomar.touray@autospares.gm',
    vehicleType: 'Motorcycle',
    plateNumber: 'WCR-3108-A',
    primaryZone: 'Jeshwang Spare Parts Hub & Sukuta',
    isOnline: true,
    rating: 4.9,
    completedDeliveries: 61,
    todayDeliveries: 3,
    todayEarningsGMD: 390,
    totalEarningsGMD: 7930,
    joinedDate: '05 March 2026',
    status: 'active',
  },
  {
    id: 'rider_musa',
    name: 'Musa Jallow',
    phone: '+220 288 7711',
    email: 'musa.jallow@autospares.gm',
    vehicleType: 'Tricycle / Keke',
    plateNumber: 'BJL-7744-K',
    primaryZone: 'Kanifing Layout & Bakau',
    isOnline: true,
    rating: 4.7,
    completedDeliveries: 29,
    todayDeliveries: 2,
    todayEarningsGMD: 300,
    totalEarningsGMD: 3770,
    joinedDate: '24 May 2026',
    status: 'active',
  },
  {
    id: 'rider_fatou',
    name: 'Fatoumatta Bah',
    phone: '+220 765 4321',
    email: 'fatou.bah@autospares.gm',
    vehicleType: 'Motorcycle',
    plateNumber: 'BJL-5521-E',
    primaryZone: 'Jeshwang Commercial Row & Serrekunda',
    isOnline: true,
    rating: 4.95,
    completedDeliveries: 42,
    todayDeliveries: 3,
    todayEarningsGMD: 420,
    totalEarningsGMD: 5120,
    joinedDate: '10 Feb 2026',
    status: 'active',
  },
  {
    id: 'rider_alagie',
    name: 'Alagie Camara',
    phone: '+220 380 9944',
    email: 'alagie.camara@autospares.gm',
    vehicleType: 'Dispatch Van',
    plateNumber: 'KM-8812-C',
    primaryZone: 'Kanifing Industrial Estate & Heavy Spares',
    isOnline: true,
    rating: 4.85,
    completedDeliveries: 78,
    todayDeliveries: 2,
    todayEarningsGMD: 550,
    totalEarningsGMD: 9840,
    joinedDate: '14 Jan 2026',
    status: 'active',
  },
  {
    id: 'rider_lamin',
    name: 'Lamin Badjie',
    phone: '+220 901 2345',
    email: 'lamin.badjie@autospares.gm',
    vehicleType: 'Motorcycle',
    plateNumber: 'WCR-9012-B',
    primaryZone: 'Sukuta & Brusubi Highway',
    isOnline: false,
    rating: 4.8,
    completedDeliveries: 53,
    todayDeliveries: 0,
    todayEarningsGMD: 0,
    totalEarningsGMD: 6710,
    joinedDate: '19 March 2026',
    status: 'active',
  },
];

export const INITIAL_DELIVERY_JOBS: DeliveryRequestJob[] = [
  {
    id: 'JOB-DEL-101',
    orderId: 'ORD-7021',
    partName: 'Alternator 90A (Toyota Corolla 2015)',
    partNumber: '27060-0T010',
    weightCategory: 'Medium (5-15kg)',
    pickupShop: 'Burgi Spare Parts',
    pickupAddress: 'Shop 18, Jeshwang Spare Parts Hub, Serekunda',
    pickupPhone: '+220 724 5550',
    pickupLatitude: 13.4385,
    pickupLongitude: -16.6712,
    dropoffWorkshop: 'Mensah Auto Works',
    dropoffAddress: 'Workshop 4, Westfield Junction, Serrekunda',
    dropoffPhone: '+220 745 5010',
    dropoffLatitude: 13.4478,
    dropoffLongitude: -16.6805,
    distanceKm: 3.2,
    estimatedMinutes: 14,
    payoutGMD: 120,
    urgency: 'Express 45-min',
    status: 'in_transit',
    handoverPin: '4819',
    acceptedAt: '12 mins ago',
    notes: 'Fragile electrical component in sealed bubble carton. Call Kwame upon arrival at Westfield.',
    assignedRiderId: 'rider_modou',
    assignedRiderName: 'Modou Lamin Ceesay',
  },
  {
    id: 'JOB-DEL-102',
    orderId: 'ORD-7022',
    partName: 'Front Ceramic Brake Pads (Camry 2016)',
    partNumber: '04465-33471',
    weightCategory: 'Light (under 5kg)',
    pickupShop: 'City Auto Spares',
    pickupAddress: 'Plot 24, Kairaba Avenue, Fajara',
    pickupPhone: '+220 788 1234',
    pickupLatitude: 13.4612,
    pickupLongitude: -16.6791,
    dropoffWorkshop: 'Njie Auto Diagnostics',
    dropoffAddress: 'Jeshwang Industrial Area Bay 3',
    dropoffPhone: '+220 398 1142',
    dropoffLatitude: 13.439,
    dropoffLongitude: -16.6698,
    distanceKm: 2.7,
    estimatedMinutes: 11,
    payoutGMD: 100,
    urgency: 'Standard',
    status: 'available',
    handoverPin: '6320',
    notes: 'Parts boxed and paid via Wave. Counter staff have parcel tagged for AutoSpares dispatch.',
  },
  {
    id: 'JOB-DEL-103',
    orderId: 'ORD-7023',
    partName: 'OEM Aluminum Radiator Cooling Unit (Nissan Navara)',
    partNumber: '21460-EB300',
    weightCategory: 'Heavy (15kg+)',
    pickupShop: 'Banjul German Motors',
    pickupAddress: 'Kanifing Industrial Estate Yard B',
    pickupPhone: '+220 711 0099',
    pickupLatitude: 13.449,
    pickupLongitude: -16.663,
    dropoffWorkshop: 'Boateng Auto Services',
    dropoffAddress: 'Brikama Highway Junction, Latrikunda',
    dropoffPhone: '+220 789 4455',
    dropoffLatitude: 13.421,
    dropoffLongitude: -16.685,
    distanceKm: 7.9,
    estimatedMinutes: 26,
    payoutGMD: 180,
    urgency: 'Express 45-min',
    status: 'in_transit',
    handoverPin: '9152',
    acceptedAt: '18 mins ago',
    assignedRiderId: 'rider_musa',
    assignedRiderName: 'Musa Jallow',
    notes: 'Requires rear rack bungee cords or dispatch carrier box. Verified leak-free test cert included.',
  },
  {
    id: 'JOB-DEL-104',
    orderId: 'ORD-7024',
    partName: 'Full Timing Belt & Tensioner Kit (Mitsubishi L200)',
    partNumber: '1145A019-KIT',
    weightCategory: 'Light (under 5kg)',
    pickupShop: 'Kairaba Parts Depot',
    pickupAddress: 'Westfield Central Commercial Row',
    pickupPhone: '+220 733 9988',
    pickupLatitude: 13.4475,
    pickupLongitude: -16.6802,
    dropoffWorkshop: 'Asare Workshop',
    dropoffAddress: 'Kanifing Layout Block 7',
    dropoffPhone: '+220 711 2233',
    dropoffLatitude: 13.453,
    dropoffLongitude: -16.669,
    distanceKm: 2.1,
    estimatedMinutes: 9,
    payoutGMD: 110,
    urgency: 'Standard',
    status: 'available',
    handoverPin: '5741',
    notes: 'Compact parcel ready at desk. Quick dispatch requested.',
  },
  {
    id: 'JOB-DEL-105',
    orderId: 'ORD-7025',
    partName: 'High-Pressure Fuel Pump (Mercedes W204 C200)',
    partNumber: 'A2710702201',
    weightCategory: 'Medium (5-15kg)',
    pickupShop: 'Burgi Spare Parts',
    pickupAddress: 'Shop 18, Jeshwang Spare Parts Hub, Serekunda',
    pickupPhone: '+220 724 5550',
    pickupLatitude: 13.4385,
    pickupLongitude: -16.6712,
    dropoffWorkshop: 'Ceesay Precision Garage',
    dropoffAddress: 'Senegambia Strip, Kololi Coastal Rd',
    dropoffPhone: '+220 755 4321',
    dropoffLatitude: 13.441,
    dropoffLongitude: -16.719,
    distanceKm: 5.4,
    estimatedMinutes: 18,
    payoutGMD: 150,
    urgency: 'Urgent',
    status: 'available',
    handoverPin: '8203',
    notes: 'Customer car waiting on ramp. High priority delivery.',
  },
  {
    id: 'JOB-DEL-099',
    orderId: 'ORD-7019',
    partName: 'Front Gas Shock Absorber Pair (Hyundai Elantra)',
    partNumber: '54651-3X250',
    weightCategory: 'Medium (5-15kg)',
    pickupShop: 'Burgi Spare Parts',
    pickupAddress: 'Shop 18, Jeshwang Spare Parts Hub',
    pickupPhone: '+220 724 5550',
    dropoffWorkshop: 'Mensah Auto Works',
    dropoffAddress: 'Westfield Junction, Serrekunda',
    dropoffPhone: '+220 745 5010',
    distanceKm: 3.2,
    estimatedMinutes: 15,
    payoutGMD: 130,
    urgency: 'Standard',
    status: 'delivered',
    handoverPin: '3109',
    acceptedAt: '2 hours ago',
    deliveredAt: 'Today · 11:20 AM',
    assignedRiderId: 'rider_modou',
    assignedRiderName: 'Modou Lamin Ceesay',
  },
  {
    id: 'JOB-DEL-098',
    orderId: 'ORD-7018',
    partName: 'Water Pump & Thermostat Gasket (Toyota RAV4)',
    partNumber: '16100-29085',
    weightCategory: 'Light (under 5kg)',
    pickupShop: 'City Auto Spares',
    pickupAddress: 'Kairaba Avenue, Fajara',
    pickupPhone: '+220 788 1234',
    dropoffWorkshop: 'Asare Workshop',
    dropoffAddress: 'Kanifing Layout Block 7',
    dropoffPhone: '+220 711 2233',
    distanceKm: 2.8,
    estimatedMinutes: 12,
    payoutGMD: 110,
    urgency: 'Standard',
    status: 'delivered',
    handoverPin: '7920',
    acceptedAt: '4 hours ago',
    deliveredAt: 'Today · 9:45 AM',
    assignedRiderId: 'rider_modou',
    assignedRiderName: 'Modou Lamin Ceesay',
  },
];


const INITIAL_DEALERS: DealerProfile[] = [
  {
    id: 'dealer_burgi',
    businessName: 'BURGI SPARE PARTS',
    tagline: 'Local spare-parts specialist · Jeshwang / Westfield',
    contactPerson: 'Kofi Owusu',
    phone: '+220 724 5550',
    email: 'sales@burgiautoparts.gm',
    businessRegistration: 'BN-2026-08142',
    shopLocation: 'Shop 18, Jeshwang Spare Parts Hub, Serekunda',
    serviceArea: 'Jeshwang · Within 10 km',
    specialization: 'Toyota & Nissan · Electrical and engine parts',
    openingHours: 'Mon–Sat · 8:00 AM–6:00 PM',
    handoverOptions: 'Pickup & local delivery',
    verificationStatus: 'approved',
    verifiedDate: '14 June 2026',
    logoText: 'BS',
    rating: 4.9,
    partsCount: 24,
    distanceKm: 2.1,
    isOpenForRequests: true,
  },
  {
    id: 'dealer_hemex',
    businessName: 'Hemex Auto Spares',
    tagline: 'Reliable Japanese & Korean Auto Spares',
    contactPerson: 'Modou Hemex',
    phone: '+220 733 9911',
    email: 'orders@hemexspares.gm',
    businessRegistration: 'BN-2026-05190',
    shopLocation: 'Main Commercial Ave, Jeshwang',
    serviceArea: 'Greater Banjul Area',
    specialization: 'Suspension, Steerings & Gearboxes',
    openingHours: 'Mon–Sat · 8:30 AM–6:30 PM',
    handoverOptions: 'Pickup & delivery',
    verificationStatus: 'approved',
    verifiedDate: '20 June 2026',
    logoText: 'OMEGA',
    rating: 4.8,
    partsCount: 38,
    distanceKm: 2.8,
    isOpenForRequests: true,
  },
  {
    id: 'dealer_mansour',
    businessName: 'Mansour spare parts',
    tagline: 'OEM Engine & Brake Parts Supplier',
    contactPerson: 'Mansour Touray',
    phone: '+220 766 8822',
    email: 'mansour@autoshop.gm',
    businessRegistration: 'BN-2026-06124',
    shopLocation: 'Banjul-Serrekunda Highway, Jeshwang',
    serviceArea: 'Jeshwang, Westfield & Kanifing',
    specialization: 'Braking Systems, Filters, Ignition',
    openingHours: 'Mon–Sat · 8:00 AM–7:00 PM',
    handoverOptions: 'Pickup only',
    verificationStatus: 'approved',
    verifiedDate: '02 July 2026',
    logoText: 'AUTOSHOP',
    rating: 4.7,
    partsCount: 52,
    distanceKm: 3.4,
    isOpenForRequests: true,
  },
  {
    id: 'dealer_tumbul',
    businessName: 'Tumbul minteh',
    tagline: 'Direct European & Asian Parts Importer',
    contactPerson: 'Tumbul Minteh',
    phone: '+220 744 1100',
    email: 'minteh@tumbulauto.gm',
    businessRegistration: 'BN-2026-07712',
    shopLocation: 'Kairaba Avenue Junction, Jeshwang',
    serviceArea: 'West Coast Region',
    specialization: 'Alternators, Starters, Radiators & Cooling',
    openingHours: 'Mon–Sat · 8:00 AM–6:00 PM',
    handoverOptions: 'Pickup & delivery',
    verificationStatus: 'approved',
    verifiedDate: '15 July 2026',
    logoText: 'MECHANIC',
    rating: 4.9,
    partsCount: 29,
    distanceKm: 4.0,
    isOpenForRequests: true,
  },
  {
    id: 'dealer_azimex',
    businessName: 'Azimex',
    tagline: 'Quality Tested Second-Hand & New Spares',
    contactPerson: 'Aziz Jallow',
    phone: '+220 755 3344',
    email: 'info@azimexparts.gm',
    businessRegistration: 'BN-2026-08003',
    shopLocation: 'Westfield Junction, Serrekunda',
    serviceArea: 'Kanifing & Serrekunda',
    specialization: 'Clutches, Gearbox, Fuel Injection',
    openingHours: 'Mon–Sat · 8:00 AM–6:00 PM',
    handoverOptions: 'Pickup & local delivery',
    verificationStatus: 'approved',
    verifiedDate: '28 July 2026',
    logoText: 'AUTOPARTS',
    rating: 4.6,
    partsCount: 19,
    distanceKm: 1.5,
    isOpenForRequests: true,
  },
  {
    id: 'dealer_jaafar',
    businessName: 'Jaafar Auto Parts',
    tagline: 'Heavy Duty & Commercial Vehicle Spares',
    contactPerson: 'Jaafar Ceesay',
    phone: '+220 788 5566',
    email: 'jaafar@jaafarspares.gm',
    businessRegistration: 'BN-2026-09110',
    shopLocation: 'Jeshwang Industrial Estate',
    serviceArea: 'The Gambia Nationwide Delivery',
    specialization: 'Toyota, Mitsubishi & Mercedes Spares',
    openingHours: 'Mon–Sat · 7:30 AM–6:00 PM',
    handoverOptions: 'Pickup & Courier',
    verificationStatus: 'approved',
    verifiedDate: '05 Aug 2026',
    logoText: 'JAAFAR',
    rating: 4.8,
    partsCount: 44,
    distanceKm: 2.3,
    isOpenForRequests: true,
  },
];

const BASE_INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'P-014',
    dealerId: 'dealer_burgi',
    dealerName: 'BURGI SPARE PARTS',
    dealerLocation: 'Jeshwang, Serrekunda',
    partName: 'Alternator assembly',
    partNumber: '27060-0T140',
    compatibleMake: 'Toyota',
    compatibleModel: 'Corolla',
    compatibleYear: '2014',
    compatibleEngine: '1.8L petrol',
    condition: 'Used · tested',
    priceGMD: 2500,
    quantity: 2,
    status: 'available',
    image: alternatorImg,
    description: '90A alternator. Tested and ready for pickup. Connector matches 27060-0T140.',
    updatedAt: 'Today, 9:20 AM',
  },
  {
    id: 'P-015',
    dealerId: 'dealer_burgi',
    dealerName: 'BURGI SPARE PARTS',
    dealerLocation: 'Jeshwang, Serrekunda',
    partName: 'Front brake pads',
    partNumber: '04465-02180',
    compatibleMake: 'Toyota',
    compatibleModel: 'Corolla',
    compatibleYear: '2014-2016',
    compatibleEngine: '1.6L / 1.8L',
    condition: 'New',
    priceGMD: 3000,
    quantity: 6,
    status: 'available',
    image: brakePadsImg,
    description: 'High performance ceramic brake pads set with anti-squeal shims.',
    updatedAt: 'Yesterday',
  },
  {
    id: 'P-016',
    dealerId: 'dealer_burgi',
    dealerName: 'BURGI SPARE PARTS',
    dealerLocation: 'Jeshwang, Serrekunda',
    partName: 'Oil filter',
    partNumber: '90915-YZZE1',
    compatibleMake: 'Toyota',
    compatibleModel: 'Hilux',
    compatibleYear: '2018',
    compatibleEngine: '2.4L Diesel D4D',
    condition: 'New',
    priceGMD: 300,
    quantity: 12,
    status: 'available',
    image: alternatorImg,
    description: 'Genuine OEM spin-on oil filter with rubber seal included.',
    updatedAt: '2 days ago',
  },
  {
    id: 'P-017',
    dealerId: 'dealer_burgi',
    dealerName: 'BURGI SPARE PARTS',
    dealerLocation: 'Jeshwang, Serrekunda',
    partName: 'Starter motor',
    partNumber: '23300-1HC0A',
    compatibleMake: 'Nissan',
    compatibleModel: 'Almera',
    compatibleYear: '2013',
    compatibleEngine: '1.5L HR15DE',
    condition: 'Used · tested',
    priceGMD: 4000,
    quantity: 0,
    status: 'out_of_stock',
    image: alternatorImg,
    description: '12V 1.0kW reduction starter motor. Tested with high cranking torque.',
    updatedAt: '3 days ago',
  },
  {
    id: 'P-018',
    dealerId: 'dealer_burgi',
    dealerName: 'BURGI SPARE PARTS',
    dealerLocation: 'Jeshwang, Serrekunda',
    partName: 'Radiator',
    partNumber: '16400-0T210',
    compatibleMake: 'Toyota',
    compatibleModel: 'Corolla',
    compatibleYear: '2014',
    compatibleEngine: '1.8L Automatic',
    condition: 'New',
    priceGMD: 7000,
    quantity: 1,
    status: 'available',
    image: radiatorImg,
    description: 'Full aluminum brazed cooling core with reinforced polymer end tanks.',
    updatedAt: 'Today, 8:40 AM',
  },
  {
    id: 'P-019',
    dealerId: 'dealer_burgi',
    dealerName: 'BURGI SPARE PARTS',
    dealerLocation: 'Jeshwang, Serrekunda',
    partName: 'Air filter',
    partNumber: '17801-21060',
    compatibleMake: 'Toyota',
    compatibleModel: 'Vitz',
    compatibleYear: '2015',
    compatibleEngine: '1.3L 1NR-FE',
    condition: 'New',
    priceGMD: 250,
    quantity: 8,
    status: 'available',
    image: brakePadsImg,
    description: 'High flow multi-fiber air cleaner element for dust protection.',
    updatedAt: 'Yesterday',
  },
  {
    id: 'P-020',
    dealerId: 'dealer_hemex',
    dealerName: 'Hemex Auto Spares',
    dealerLocation: 'Jeshwang',
    partName: 'Alternator 80A',
    partNumber: '27060-0D170',
    compatibleMake: 'Toyota',
    compatibleModel: 'Corolla',
    compatibleYear: '2015',
    compatibleEngine: '1.6L',
    condition: 'New',
    priceGMD: 2500,
    quantity: 3,
    status: 'available',
    image: alternatorImg,
    description: 'Brand new aftermarket replacement alternator.',
    updatedAt: 'Today',
  },
  {
    id: 'P-028',
    dealerId: 'dealer_azimex',
    dealerName: 'Azimex',
    dealerLocation: 'Westfield, Serrekunda',
    partName: 'Brake pads · Ceramic',
    partNumber: 'P-028',
    compatibleMake: 'Honda',
    compatibleModel: 'Civic',
    compatibleYear: '2016',
    condition: 'New',
    priceGMD: 1800,
    quantity: 4,
    status: 'available',
    image: brakePadsImg,
    description: 'Low dust front braking pads set for Civic 2016.',
    updatedAt: 'Today, 9:40 AM',
    isReported: true,
  },
  // Mercedes-Benz engine & service parts
  {
    id: 'P-030',
    dealerId: 'dealer_burgi',
    dealerName: 'BURGI SPARE PARTS',
    dealerLocation: 'Jeshwang, Serrekunda',
    partName: 'Oil filter cartridge',
    partNumber: 'A2761800009',
    compatibleMake: 'Mercedes-Benz',
    compatibleModel: 'ML350',
    compatibleYear: '2015',
    compatibleEngine: '3.5L V6 M276',
    condition: 'New',
    priceGMD: 650,
    quantity: 8,
    status: 'available',
    image: alternatorImg,
    description: 'Genuine OEM Mercedes-Benz oil filter element with O-ring seals for M276 engine.',
    updatedAt: 'Today, 10:15 AM',
  },
  {
    id: 'P-031',
    dealerId: 'dealer_burgi',
    dealerName: 'BURGI SPARE PARTS',
    dealerLocation: 'Jeshwang, Serrekunda',
    partName: 'Alternator assembly 180A',
    partNumber: 'A0141541302',
    compatibleMake: 'Mercedes-Benz',
    compatibleModel: 'GL450',
    compatibleYear: '2014',
    compatibleEngine: '4.7L V8 Biturbo',
    condition: 'Used · tested',
    priceGMD: 8500,
    quantity: 2,
    status: 'available',
    image: alternatorImg,
    description: 'High output 180A Valeo alternator for Mercedes GL450 / ML550. Fully bench tested with warranty.',
    updatedAt: 'Today, 11:30 AM',
  },
  {
    id: 'P-032',
    dealerId: 'dealer_hemex',
    dealerName: 'Hemex Auto Spares',
    dealerLocation: 'Jeshwang',
    partName: 'Serpentine belt (Sapentine belt) 6PK',
    partNumber: '6PK2404',
    compatibleMake: 'Mercedes-Benz',
    compatibleModel: 'C300',
    compatibleYear: '2015',
    compatibleEngine: '2.0L Turbo',
    condition: 'New',
    priceGMD: 1200,
    quantity: 5,
    status: 'available',
    image: alternatorImg,
    description: 'Heavy duty EPDM multi-rib serpentine drive belt for Mercedes-Benz C200 / C300.',
    updatedAt: 'Yesterday',
  },
  {
    id: 'P-033',
    dealerId: 'dealer_hemex',
    dealerName: 'Hemex Auto Spares',
    dealerLocation: 'Jeshwang',
    partName: 'Front stabilizer link pair',
    partNumber: 'A2043203789',
    compatibleMake: 'Mercedes-Benz',
    compatibleModel: 'C200',
    compatibleYear: '2013',
    compatibleEngine: '1.8L CGI',
    condition: 'New',
    priceGMD: 1600,
    quantity: 6,
    status: 'available',
    image: brakePadsImg,
    description: 'Reinforced front sway bar anti-roll stabilizer drop links for Mercedes C-Class W204.',
    updatedAt: 'Today, 8:15 AM',
  },
  {
    id: 'P-034',
    dealerId: 'dealer_azimex',
    dealerName: 'Azimex',
    dealerLocation: 'Westfield, Serrekunda',
    partName: 'Mass Air Flow (MAF) Sensor',
    partNumber: 'A2720940048',
    compatibleMake: 'Mercedes-Benz',
    compatibleModel: 'ML350',
    compatibleYear: '2014',
    compatibleEngine: '3.5L V6',
    condition: 'New',
    priceGMD: 3500,
    quantity: 3,
    status: 'available',
    image: alternatorImg,
    description: 'Bosch OEM airflow meter sensor. Direct fit with 5-pin electrical connector plug.',
    updatedAt: 'Yesterday',
  },
  {
    id: 'P-035',
    dealerId: 'dealer_azimex',
    dealerName: 'Azimex',
    dealerLocation: 'Westfield, Serrekunda',
    partName: 'Oxygen (O2) Sensor Upstream',
    partNumber: 'A0045427318',
    compatibleMake: 'Mercedes-Benz',
    compatibleModel: 'GL450',
    compatibleYear: '2015',
    compatibleEngine: '4.7L V8',
    condition: 'New',
    priceGMD: 2800,
    quantity: 4,
    status: 'available',
    image: alternatorImg,
    description: 'Fast-response 4-wire lambda oxygen sensor with factory connector harness.',
    updatedAt: 'Today, 9:00 AM',
  },
  {
    id: 'P-036',
    dealerId: 'dealer_burgi',
    dealerName: 'BURGI SPARE PARTS',
    dealerLocation: 'Jeshwang, Serrekunda',
    partName: 'Front shock absorber assembly',
    partNumber: '48510-09P50',
    compatibleMake: 'Toyota',
    compatibleModel: 'Corolla',
    compatibleYear: '2015',
    compatibleEngine: '1.8L',
    condition: 'New',
    priceGMD: 3200,
    quantity: 4,
    status: 'available',
    image: brakePadsImg,
    description: 'Twin-tube nitrogen gas charged front strut shock absorber for smooth Gambian road travel.',
    updatedAt: 'Today, 10:45 AM',
  },
  {
    id: 'P-037',
    dealerId: 'dealer_burgi',
    dealerName: 'BURGI SPARE PARTS',
    dealerLocation: 'Jeshwang, Serrekunda',
    partName: 'Front stabilizer sway bar link',
    partNumber: '48820-47010',
    compatibleMake: 'Toyota',
    compatibleModel: 'Corolla',
    compatibleYear: '2014',
    compatibleEngine: '1.8L',
    condition: 'New',
    priceGMD: 850,
    quantity: 10,
    status: 'available',
    image: brakePadsImg,
    description: 'Heavy duty sealed ball-joint stabilizer links for Toyota Corolla & Matrix.',
    updatedAt: '2 days ago',
  },
  {
    id: 'P-038',
    dealerId: 'dealer_hemex',
    dealerName: 'Hemex Auto Spares',
    dealerLocation: 'Jeshwang',
    partName: 'ABS Wheel Speed Sensor',
    partNumber: '89542-52030',
    compatibleMake: 'Toyota',
    compatibleModel: 'Corolla',
    compatibleYear: '2014',
    compatibleEngine: '1.8L',
    condition: 'New',
    priceGMD: 1200,
    quantity: 4,
    status: 'available',
    image: alternatorImg,
    description: 'Front right magnetic wheel speed sensor for anti-lock braking and stability control.',
    updatedAt: 'Yesterday',
  },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  ...BASE_INITIAL_INVENTORY.map((item) => ({
    ...item,
    image: getPartPhoto(item.partName, item.image),
  })),
  ...COMPREHENSIVE_PARTS_INVENTORY,
];

const INITIAL_REQUESTS: PartRequest[] = [
  {
    id: 'REQ-1042',
    mechanicId: 'user_kwame',
    mechanicName: 'Kwame Mensah',
    workshopName: 'Mensah Auto Works',
    mechanicLocation: 'Westfield, Serrekunda',
    mechanicPhone: '+220 745 5010',
    vehicleMake: 'Toyota',
    vehicleModel: 'Corolla',
    vehicleYear: '2014',
    vehicleEngine: '1.8L petrol',
    partName: 'Alternator assembly',
    partNumber: '27060-0T140',
    preferredCondition: 'Either · New or used',
    notes: 'Must fit the 1.8L engine. Please share a clear photo of the connector and confirm it has been tested.',
    image: alternatorImg,
    voiceNote: {
      audioUrl: '', // generated playable audio waveform in UI
      durationSeconds: 14,
      waveform: [35, 60, 45, 80, 95, 65, 75, 90, 85, 40, 60, 70, 50, 30],
      recordedAt: 'Today, 9:12 AM',
    },
    createdAt: 'Today · 9:12 AM',
    status: 'Reserved',
    repliesCount: 3,
    targetDealersCount: 8,
    selectedOfferId: 'off_burgi_1042',
    orderId: 'ORD-1042',
  },
  {
    id: 'REQ-1038',
    mechanicId: 'user_kwame',
    mechanicName: 'Kwame Mensah',
    workshopName: 'Mensah Auto Works',
    mechanicLocation: 'Westfield, Serrekunda',
    mechanicPhone: '+220 745 5010',
    vehicleMake: 'Honda',
    vehicleModel: 'Civic',
    vehicleYear: '2016',
    partName: 'Brake pads',
    partNumber: '45022-TBA-A01',
    preferredCondition: 'New',
    notes: 'Need genuine or reputable Japanese brand ceramic pads.',
    image: brakePadsImg,
    createdAt: 'Today · 8:45 AM',
    status: 'Waiting for dealers',
    repliesCount: 0,
    targetDealersCount: 6,
  },
  {
    id: 'REQ-1031',
    mechanicId: 'user_kwame',
    mechanicName: 'Kwame Mensah',
    workshopName: 'Mensah Auto Works',
    mechanicLocation: 'Westfield, Serrekunda',
    mechanicPhone: '+220 745 5010',
    vehicleMake: 'Toyota',
    vehicleModel: 'Hilux',
    vehicleYear: '2018',
    partName: 'Oil filter',
    partNumber: '90915-YZZE1',
    preferredCondition: 'New',
    notes: 'Original packaging preferred for maintenance service.',
    createdAt: 'Yesterday',
    status: 'Reserved',
    repliesCount: 2,
    targetDealersCount: 5,
    orderId: 'ORD-1031',
  },
  {
    id: 'REQ-1025',
    mechanicId: 'user_kwame',
    mechanicName: 'Kwame Mensah',
    workshopName: 'Mensah Auto Works',
    mechanicLocation: 'Westfield, Serrekunda',
    mechanicPhone: '+220 745 5010',
    vehicleMake: 'Nissan',
    vehicleModel: 'Almera',
    vehicleYear: '2013',
    partName: 'Starter motor',
    preferredCondition: 'Used',
    notes: 'Tested working unit for customer car urgent dispatch.',
    createdAt: '2 days ago',
    status: 'Collected',
    repliesCount: 4,
    targetDealersCount: 8,
  },
  {
    id: 'REQ-1019',
    mechanicId: 'user_kwame',
    mechanicName: 'Kwame Mensah',
    workshopName: 'Mensah Auto Works',
    mechanicLocation: 'Westfield, Serrekunda',
    mechanicPhone: '+220 745 5010',
    vehicleMake: 'Toyota',
    vehicleModel: 'Vitz',
    vehicleYear: '2015',
    partName: 'Air filter',
    preferredCondition: 'New',
    notes: 'Regular engine air filter element.',
    createdAt: '4 days ago',
    status: 'Delivered',
    repliesCount: 3,
    targetDealersCount: 6,
  },
  {
    id: 'REQ-1012',
    mechanicId: 'user_kwame',
    mechanicName: 'Kwame Mensah',
    workshopName: 'Mensah Auto Works',
    mechanicLocation: 'Westfield, Serrekunda',
    mechanicPhone: '+220 745 5010',
    vehicleMake: 'Honda',
    vehicleModel: 'Accord',
    vehicleYear: '2012',
    partName: 'Spark plugs (Pack of 4)',
    preferredCondition: 'New',
    notes: 'Iridium laser tipped plugs.',
    createdAt: '6 days ago',
    status: 'Collected',
    repliesCount: 2,
    targetDealersCount: 5,
  },
  {
    id: 'REQ-1040',
    mechanicId: 'user_yaw',
    mechanicName: 'Yaw Boateng',
    workshopName: 'Boateng Auto Services',
    mechanicLocation: 'Bantama, Serrekunda',
    mechanicPhone: '+220 789 4455',
    vehicleMake: 'Toyota',
    vehicleModel: 'Vitz',
    vehicleYear: '2015',
    partName: 'Fuel pump module',
    preferredCondition: 'Either · New or used',
    notes: 'Electric in-tank fuel pump with filter strainer.',
    createdAt: 'Today · 8:55 AM',
    status: 'Responses received',
    repliesCount: 2,
    targetDealersCount: 6,
  },
  {
    id: 'REQ-1039',
    mechanicId: 'user_akousa',
    mechanicName: 'Akosua Asare',
    workshopName: 'Asare Workshop',
    mechanicLocation: 'Kanifing Layout',
    mechanicPhone: '+220 711 2233',
    vehicleMake: 'Toyota',
    vehicleModel: 'Hilux',
    vehicleYear: '2018',
    partName: 'Headlamp assembly (Left)',
    preferredCondition: 'Used',
    notes: 'Original halogen left side front headlight, no cracked tabs.',
    createdAt: 'Today · 8:40 AM',
    status: 'Responses received',
    repliesCount: 1,
    targetDealersCount: 8,
  },
  {
    id: 'REQ-1028',
    mechanicId: 'user_akousa',
    mechanicName: 'Abena Osei',
    workshopName: 'Osei Auto Clinic',
    mechanicLocation: 'Brikama',
    mechanicPhone: '+220 733 4455',
    vehicleMake: 'Nissan',
    vehicleModel: 'Sunny',
    vehicleYear: '2011',
    partName: 'Fuel pump',
    preferredCondition: 'Used',
    notes: 'Dealer unavailable reported.',
    createdAt: 'Yesterday',
    status: 'Reported',
    repliesCount: 1,
    targetDealersCount: 6,
  },
];

const INITIAL_OFFERS: DealerOffer[] = [
  {
    id: 'off_burgi_1042',
    requestId: 'REQ-1042',
    dealerId: 'dealer_burgi',
    dealerName: 'BURGI SPARE PARTS',
    dealerLocation: 'Shop 18, Jeshwang Spare Parts Hub',
    dealerPhone: '+220 724 5550',
    dealerVerified: true,
    partName: 'Alternator assembly',
    partNumber: '27060-0T140',
    priceGMD: 2500,
    condition: 'Used · tested',
    quantityAvailable: 2,
    availabilityTiming: 'Available now',
    location: 'Shop 18, Jeshwang, Kumasi / Serekunda',
    notes: '90A alternator. Tested and ready for pickup. Connector matches 27060-0T140.',
    image: alternatorImg,
    createdAt: 'Today · 9:28 AM',
    status: 'accepted',
  },
  {
    id: 'off_hemex_1042',
    requestId: 'REQ-1042',
    dealerId: 'dealer_hemex',
    dealerName: 'Hemex Auto Spares',
    dealerLocation: 'Jeshwang Commercial Ave',
    dealerPhone: '+220 733 9911',
    dealerVerified: true,
    partName: 'Alternator unit (Denso compatible)',
    partNumber: '27060-0T140',
    priceGMD: 2800,
    condition: 'New',
    quantityAvailable: 1,
    availabilityTiming: 'Ready in 1 hour',
    location: 'Main Ave, Jeshwang',
    notes: 'Brand new OEM replacement with 30-day warranty.',
    image: alternatorImg,
    createdAt: 'Today · 9:35 AM',
    status: 'pending',
  },
  {
    id: 'off_mansour_1042',
    requestId: 'REQ-1042',
    dealerId: 'dealer_mansour',
    dealerName: 'Mansour spare parts',
    dealerLocation: 'Banjul-Serrekunda Highway, Jeshwang',
    dealerPhone: '+220 766 8822',
    dealerVerified: true,
    partName: 'Used 90A Alternator',
    priceGMD: 2300,
    condition: 'Used · tested',
    quantityAvailable: 1,
    availabilityTiming: 'Available now',
    location: 'Highway Shop 4, Jeshwang',
    notes: 'Pulled from running vehicle, benchmark tested 14.2V charging output.',
    image: alternatorImg,
    createdAt: 'Today · 9:42 AM',
    status: 'pending',
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-7021',
    requestId: 'REQ-1042',
    offerId: 'off_burgi_1042',
    mechanicId: 'user_kwame',
    mechanicName: 'Kwame Mensah',
    mechanicPhone: '+220 745 5010',
    dealerId: 'dealer_burgi',
    dealerName: 'BURGI SPARE PARTS',
    dealerLocation: 'Shop 18, Jeshwang Spare Parts Hub, Serekunda',
    partName: 'Alternator 90A (Toyota Corolla 2015)',
    partNumber: '27060-0T140',
    priceGMD: 2500,
    deliveryMethod: 'delivery',
    deliveryAddress: 'Mensah Auto Works, Westfield Junction, Serrekunda',
    deliveryFeeGMD: 120,
    noteToDealer: 'Verified 4-pin oval regulator connector. Escrow payment held.',
    paymentMethod: 'wave',
    paymentStatus: 'paid',
    paymentPhone: '+220 745 5010',
    paymentTransactionRef: 'WAVE-GM-894210',
    paidAt: 'Today · 10:15 AM',
    status: 'in_transit',
    assignedRiderId: 'rider_modou',
    courierName: 'Modou Lamin Ceesay',
    courierPhone: '+220 733 4921',
    courierVehicle: 'Motorcycle (BJL-4821-B)',
    courierRating: 4.9,
    createdAt: 'Today · 10:15 AM',
    updatedAt: 'Just now',
    // --- Escrow Vault & Dual-Party Confirmation ---
    escrowStatus: 'held_in_escrow',
    escrowAmountGMD: 2620,
    dealerPayoutGMD: 2500,
    riderPayoutGMD: 120,
    escrowHeldAt: 'Today · 10:15 AM',
    buyerConfirmedCondition: false,
    riderConfirmedCondition: false,
    dealerPayoutStatus: 'pending_confirmation',
    riderPayoutStatus: 'pending_confirmation',
  },
  {
    id: 'ORD-1042',
    requestId: 'REQ-1042',
    offerId: 'off_burgi_1042',
    mechanicId: 'user_kwame',
    mechanicName: 'Kwame Mensah',
    mechanicPhone: '+220 745 5010',
    dealerId: 'dealer_burgi',
    dealerName: 'BURGI SPARE PARTS',
    dealerLocation: 'Shop 18, Jeshwang Spare Parts Hub, Serekunda',
    partName: 'Alternator assembly',
    partNumber: '27060-0T140',
    priceGMD: 2500,
    deliveryMethod: 'pickup',
    pickupLocation: 'Jeshwang, Shop 18',
    pickupTime: 'Today · 2:00 PM',
    noteToDealer: "I'll bring the old alternator to check the connector.",
    paymentMethod: 'wave',
    paymentStatus: 'paid',
    paymentPhone: '+220 745 5010',
    paymentTransactionRef: 'WAVE-GM-512034',
    paidAt: 'Today · 10:05 AM',
    status: 'confirmed',
    createdAt: 'Today · 10:05 AM',
    updatedAt: 'Today · 10:18 AM',
    escrowStatus: 'held_in_escrow',
    escrowAmountGMD: 2500,
    dealerPayoutGMD: 2500,
    riderPayoutGMD: 0,
    escrowHeldAt: 'Today · 10:05 AM',
    buyerConfirmedCondition: false,
    riderConfirmedCondition: true,
    dealerPayoutStatus: 'pending_confirmation',
  },
  {
    id: 'ORD-1031',
    requestId: 'REQ-1031',
    offerId: 'off_burgi_1031',
    mechanicId: 'user_kwame',
    mechanicName: 'Kwame Mensah',
    mechanicPhone: '+220 745 5010',
    dealerId: 'dealer_burgi',
    dealerName: 'BURGI SPARE PARTS',
    dealerLocation: 'Shop 18, Jeshwang',
    partName: 'Oil filter (Toyota Hilux)',
    partNumber: '90915-YZZE1',
    priceGMD: 300,
    deliveryMethod: 'delivery',
    deliveryAddress: 'Mensah Auto Works, Westfield, Serrekunda',
    deliveryFeeGMD: 100,
    noteToDealer: 'Leave with head apprentice Lamin if away.',
    paymentMethod: 'qmoney',
    paymentStatus: 'paid',
    paymentPhone: '+220 745 5010',
    paymentTransactionRef: 'QM-GM-773120',
    paidAt: 'Yesterday · 3:20 PM',
    status: 'ready_for_pickup',
    createdAt: 'Yesterday · 3:20 PM',
    updatedAt: 'Today · 8:10 AM',
    escrowStatus: 'held_in_escrow',
    escrowAmountGMD: 400,
    dealerPayoutGMD: 300,
    riderPayoutGMD: 100,
    escrowHeldAt: 'Yesterday · 3:20 PM',
    buyerConfirmedCondition: false,
    riderConfirmedCondition: false,
    dealerPayoutStatus: 'pending_confirmation',
    riderPayoutStatus: 'pending_confirmation',
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    targetRole: 'mechanic',
    targetUserId: 'user_kwame',
    title: 'Your alternator is reserved',
    description: 'Suame / Burgi Auto Parts confirmed REQ-1042. Pickup today at 2:00 PM.',
    timestamp: '10:18 AM',
    read: false,
    type: 'reservation',
    actionLabel: 'View status',
    actionView: 'requests',
    relatedId: 'REQ-1042',
  },
  {
    id: 'notif_2',
    targetRole: 'mechanic',
    targetUserId: 'user_kwame',
    title: 'New message from Burgi Auto Parts',
    description: 'The connector matches. We will hold the tested alternator for you.',
    timestamp: '10:10 AM',
    read: false,
    type: 'message',
    actionLabel: 'Read message',
    actionView: 'dealer_offer_detail',
    relatedId: 'REQ-1042',
  },
  {
    id: 'notif_3',
    targetRole: 'mechanic',
    targetUserId: 'user_kwame',
    title: 'Your offer selection was sent',
    description: 'You selected Burgi Spare Parts offer at D2,500.',
    timestamp: '10:05 AM',
    read: true,
    type: 'offer',
    actionLabel: 'View request',
    actionView: 'requests',
    relatedId: 'REQ-1042',
  },
  {
    id: 'notif_4',
    targetRole: 'mechanic',
    targetUserId: 'user_kwame',
    title: '3 responses ready to compare',
    description: 'Dealers replied to your alternator request for Toyota Corolla 2014.',
    timestamp: '9:46 AM',
    read: true,
    type: 'request',
    actionLabel: 'View responses',
    actionView: 'responses_compare',
    relatedId: 'REQ-1042',
  },
  {
    id: 'notif_5',
    targetRole: 'mechanic',
    targetUserId: 'user_kwame',
    title: 'Request delivered to 8 dealers',
    description: 'REQ-1042 was sent to verified dealers near Jeshwang & Serrekunda.',
    timestamp: '9:12 AM',
    read: true,
    type: 'request',
    actionLabel: 'View request',
    actionView: 'requests',
    relatedId: 'REQ-1042',
  },
  // Dealer notifications
  {
    id: 'notif_d1',
    targetRole: 'dealer',
    targetUserId: 'user_burgi',
    title: 'Reservation confirmed',
    description: 'You reserved the alternator for Kwame Mensah. Pickup is at 2:00 PM.',
    timestamp: '10:18 AM',
    read: false,
    type: 'reservation',
    actionLabel: 'View request',
    actionView: 'dealer_requests',
    relatedId: 'REQ-1042',
  },
  {
    id: 'notif_d2',
    targetRole: 'dealer',
    targetUserId: 'user_burgi',
    title: 'Your offer was selected',
    description: 'Kwame chose your D2,500 offer for REQ-1042.',
    timestamp: '10:05 AM',
    read: false,
    type: 'offer',
    actionLabel: 'View selection',
    actionView: 'dealer_requests',
    relatedId: 'REQ-1042',
  },
  {
    id: 'notif_d3',
    targetRole: 'dealer',
    targetUserId: 'user_burgi',
    title: 'New message from Kwame Mensah',
    description: 'Can you confirm the connector and testing for the alternator?',
    timestamp: '9:55 AM',
    read: true,
    type: 'message',
    actionLabel: 'Read message',
    actionView: 'dealer_requests',
    relatedId: 'REQ-1042',
  },
  {
    id: 'notif_d4',
    targetRole: 'dealer',
    targetUserId: 'user_burgi',
    title: 'Your response was delivered',
    description: 'Your alternator offer is visible to the mechanic.',
    timestamp: '9:28 AM',
    read: true,
    type: 'offer',
    actionLabel: 'View response',
    actionView: 'dealer_requests',
    relatedId: 'REQ-1042',
  },
  {
    id: 'notif_d5',
    targetRole: 'dealer',
    targetUserId: 'user_burgi',
    title: 'New request near your shop',
    description: 'Toyota Corolla 2014 · Alternator assembly · Jeshwang / Westfield.',
    timestamp: '9:12 AM',
    read: true,
    type: 'request',
    actionLabel: 'View request',
    actionView: 'dealer_request_detail',
    relatedId: 'REQ-1042',
  },
];

const INITIAL_APPLICATIONS: DealerApplication[] = [
  {
    id: 'app_bantama',
    businessName: 'Bantama Auto Supply',
    contactPerson: 'Yaw Asante',
    phone: '+220 745 5016',
    email: 'info@bantamaauto.gm',
    businessRegistration: 'BN-2026-09218',
    shopAddress: 'Shop 7, Bantama High Street, Serrekunda',
    location: 'Bantama, Serrekunda',
    specialization: 'Honda & Toyota · Brakes and suspension',
    submittedDate: 'Today · 8:45 AM',
    status: 'pending',
    registrationDocName: 'business-registration.pdf',
    registrationDocSize: '640 KB',
    shopPhotoName: 'shop-front.jpg',
    shopPhotoSize: '1.2 MB',
    reviewNote: 'Registration name and phone confirmed. Review shop location before approval.',
  },
  {
    id: 'app_kejetia',
    businessName: 'Kejetia Parts Centre',
    contactPerson: 'Musa Camara',
    phone: '+220 732 1100',
    email: 'musa@kejetiaparts.gm',
    businessRegistration: 'BN-2026-09144',
    shopAddress: 'Stall 44, Kejetia Market Rd, Banjul',
    location: 'Banjul Central',
    specialization: 'European vehicles · Engines & Transmissions',
    submittedDate: '1 Oct 2026',
    status: 'pending',
    registrationDocName: 'musa-tin-cert.pdf',
    registrationDocSize: '810 KB',
    shopPhotoName: 'kejetia-store.jpg',
    shopPhotoSize: '2.4 MB',
  },
  {
    id: 'app_oforikrom',
    businessName: 'Oforikrom Motors',
    contactPerson: 'Fatoumatta Jagne',
    phone: '+220 798 2233',
    email: 'jagne@oforikrom.gm',
    businessRegistration: 'BN-2026-08990',
    shopAddress: 'Mile 7 Commercial Corridor, Kanifing',
    location: 'Kanifing / Oforikrom',
    specialization: 'Diesel fuel injection & Turbochargers',
    submittedDate: '1 Oct 2026',
    status: 'pending',
    registrationDocName: 'commercial-license.pdf',
    registrationDocSize: '512 KB',
    shopPhotoName: 'oforikrom-workshop.jpg',
    shopPhotoSize: '1.7 MB',
  },
  {
    id: 'app_tafo',
    businessName: 'Tafo Engine Spares',
    contactPerson: 'Alieu Baldeh',
    phone: '+220 722 7788',
    email: 'alieu@tafospares.gm',
    businessRegistration: 'BN-2026-08701',
    shopAddress: 'Sukuta Highway Crossing',
    location: 'Sukuta / Tafo',
    specialization: 'Engine blocks, Pistons & Camshafts',
    submittedDate: '30 Sep 2026',
    status: 'pending',
    registrationDocName: 'tax-clearance.pdf',
    registrationDocSize: '730 KB',
    shopPhotoName: 'tafo-entrance.jpg',
    shopPhotoSize: '1.1 MB',
  },
];

const INITIAL_ACTIVITY: ActivityLog[] = [
  {
    id: 'act_1',
    time: '10:18 AM',
    activity: 'Part reserved',
    userOrBusiness: 'Burgi Spare Parts',
    reference: 'REQ-1042',
    status: 'Reserved',
  },
  {
    id: 'act_2',
    time: '9:46 AM',
    activity: '3 dealer offers received',
    userOrBusiness: 'Kwame Mensah',
    reference: 'REQ-1042',
    status: 'Responses received',
  },
  {
    id: 'act_3',
    time: '9:28 AM',
    activity: 'Response submitted',
    userOrBusiness: 'Burgi Spare Parts',
    reference: 'REQ-1042',
    status: 'Available offer',
  },
  {
    id: 'act_4',
    time: '9:12 AM',
    activity: 'Request created',
    userOrBusiness: 'Kwame Mensah',
    reference: 'REQ-1042',
    status: 'Sent to 8 dealers',
  },
];

export interface MarketplaceState {
  currentRole: UserRole;
  currentUser: User;
  users: User[];
  dealers: DealerProfile[];
  inventory: InventoryItem[];
  requests: PartRequest[];
  offers: DealerOffer[];
  orders: Order[];
  notifications: NotificationItem[];
  applications: DealerApplication[];
  activityLogs: ActivityLog[];
  deliveryRiders: DeliveryRiderProfile[];
  deliveryJobs: DeliveryRequestJob[];
  searchQuery: {
    part: string;
    make: string;
    model: string;
    year: string;
    vin: string;
  };
}

class Store {
  private state: MarketplaceState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadInitialState();
  }

  private loadInitialState(): MarketplaceState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.dealers && parsed.requests) {
          if (parsed.inventory && Array.isArray(parsed.inventory)) {
            parsed.inventory = parsed.inventory.map((item: InventoryItem) => ({
              ...item,
              image: getPartPhoto(item.partName, item.image),
            }));
            const existingIds = new Set(parsed.inventory.map((i: InventoryItem) => i.id));
            for (const item of COMPREHENSIVE_PARTS_INVENTORY) {
              if (!existingIds.has(item.id)) {
                parsed.inventory.push(item);
              }
            }
          } else {
            parsed.inventory = INITIAL_INVENTORY;
          }

          if (!parsed.deliveryRiders || !Array.isArray(parsed.deliveryRiders) || parsed.deliveryRiders.length < INITIAL_RIDERS.length) {
            parsed.deliveryRiders = INITIAL_RIDERS;
          }
          if (!parsed.deliveryJobs || !Array.isArray(parsed.deliveryJobs) || parsed.deliveryJobs.length < INITIAL_DELIVERY_JOBS.length) {
            parsed.deliveryJobs = INITIAL_DELIVERY_JOBS;
          }
          if (!parsed.orders || !Array.isArray(parsed.orders) || !parsed.orders.some((o: Order) => o.id === 'ORD-7021')) {
            parsed.orders = INITIAL_ORDERS;
          } else {
            parsed.orders = parsed.orders.map((o: Order) => ({
              ...o,
              escrowStatus: o.escrowStatus || (o.paymentStatus === 'paid' ? 'held_in_escrow' : undefined),
              escrowAmountGMD: o.escrowAmountGMD ?? (o.priceGMD + (o.deliveryFeeGMD || 0)),
              dealerPayoutGMD: o.dealerPayoutGMD ?? o.priceGMD,
              riderPayoutGMD: o.riderPayoutGMD ?? (o.deliveryFeeGMD || 0),
              buyerConfirmedCondition: o.buyerConfirmedCondition ?? false,
              riderConfirmedCondition: o.riderConfirmedCondition ?? false,
              dealerPayoutStatus: o.dealerPayoutStatus || (o.paymentStatus === 'paid' ? 'pending_confirmation' : undefined),
              riderPayoutStatus: o.riderPayoutStatus || (o.paymentStatus === 'paid' && o.deliveryMethod === 'delivery' ? 'pending_confirmation' : undefined),
            }));
          }

          return parsed;
        }
      }
    } catch {
      // ignore
    }

    const defaultUser = INITIAL_USERS[0];
    return {
      currentRole: 'mechanic',
      currentUser: defaultUser,
      users: INITIAL_USERS,
      dealers: INITIAL_DEALERS,
      inventory: INITIAL_INVENTORY,
      requests: INITIAL_REQUESTS,
      offers: INITIAL_OFFERS,
      orders: INITIAL_ORDERS,
      notifications: INITIAL_NOTIFICATIONS,
      applications: INITIAL_APPLICATIONS,
      activityLogs: INITIAL_ACTIVITY,
      deliveryRiders: INITIAL_RIDERS,
      deliveryJobs: INITIAL_DELIVERY_JOBS,
      searchQuery: {
        part: '',
        make: '',
        model: '',
        year: '',
        vin: '',
      },
    };
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getState(): MarketplaceState {
    return this.state;
  }

  public setRole(role: UserRole) {
    this.state.currentRole = role;
    if (role === 'mechanic') {
      this.state.currentUser = this.state.users.find((u) => u.role === 'mechanic') || INITIAL_USERS[0];
    } else if (role === 'dealer') {
      this.state.currentUser = this.state.users.find((u) => u.role === 'dealer') || INITIAL_USERS[2];
    } else if (role === 'admin') {
      this.state.currentUser = this.state.users.find((u) => u.role === 'admin') || INITIAL_USERS[3];
    } else if (role === 'delivery_rider') {
      this.state.currentUser = this.state.users.find((u) => u.role === 'delivery_rider') || {
        id: 'user_modou',
        name: 'Modou Lamin Ceesay',
        role: 'delivery_rider',
        email: 'modou.rider@autospares.gm',
        phone: '+220 733 4921',
        workshopName: 'AutoSpares Express Dispatch',
        location: 'Jeshwang & Westfield Corridor',
        joinedDate: '12 May 2026',
        status: 'active',
      };
    }
    this.persist();
  }

  public setSearchQuery(query: Partial<MarketplaceState['searchQuery']>) {
    this.state.searchQuery = { ...this.state.searchQuery, ...query };
    this.persist();
  }

  // --- Delivery Rider Actions ---
  public registerDeliveryRider(data: {
    name: string;
    phone: string;
    email?: string;
    vehicleType: 'Motorcycle' | 'Scooter' | 'Tricycle / Keke' | 'Dispatch Van' | 'Bicycle';
    plateNumber: string;
    licenseNumber?: string;
    primaryZone: string;
  }): DeliveryRiderProfile {
    const riderId = `rider_${Date.now()}`;
    const newRider: DeliveryRiderProfile = {
      id: riderId,
      name: data.name,
      phone: data.phone,
      email: data.email || `${data.name.toLowerCase().replace(/\s+/g, '.')}@autospares.gm`,
      vehicleType: data.vehicleType,
      plateNumber: data.plateNumber.toUpperCase(),
      licenseNumber: data.licenseNumber,
      primaryZone: data.primaryZone,
      isOnline: true,
      rating: 5.0,
      completedDeliveries: 0,
      todayDeliveries: 0,
      todayEarningsGMD: 0,
      totalEarningsGMD: 0,
      joinedDate: 'Today',
      status: 'active',
    };

    this.state.deliveryRiders.unshift(newRider);

    const userObj: User = {
      id: `user_${riderId}`,
      name: data.name,
      role: 'delivery_rider',
      email: newRider.email,
      phone: data.phone,
      workshopName: `${data.vehicleType} Dispatch (${data.plateNumber})`,
      location: data.primaryZone,
      joinedDate: 'Today',
      status: 'active',
    };
    this.state.users.unshift(userObj);
    this.state.currentUser = userObj;
    this.state.currentRole = 'delivery_rider';

    // Activity Log
    this.state.activityLogs.unshift({
      id: `act_${Date.now()}`,
      time: 'Just now',
      activity: 'New rider onboarded',
      userOrBusiness: data.name,
      reference: newRider.plateNumber,
      status: 'Rider Ready',
    });

    // Notification
    this.state.notifications.unshift({
      id: `notif_${Date.now()}`,
      targetRole: 'delivery_rider',
      targetUserId: userObj.id,
      title: 'Welcome to AutoSpares Delivery Dispatch!',
      description: `Your rider account is active for ${data.primaryZone}. Browse nearby part requests and start earning.`,
      timestamp: 'Just now',
      read: false,
      type: 'delivery',
      actionLabel: 'View Requests',
      actionView: 'delivery_requests',
    });

    this.persist();
    return newRider;
  }

  public getActiveRider(): DeliveryRiderProfile {
    const currentUserId = this.state.currentUser.id;
    const byUser = this.state.deliveryRiders.find(
      (r) => r.id === currentUserId || `user_${r.id}` === currentUserId || r.phone === this.state.currentUser.phone
    );
    return byUser || this.state.deliveryRiders[0] || INITIAL_RIDERS[0];
  }

  public toggleRiderOnlineStatus(riderId?: string) {
    const active = riderId ? this.state.deliveryRiders.find((r) => r.id === riderId) : this.getActiveRider();
    if (active) {
      active.isOnline = !active.isOnline;
      this.persist();
    }
  }

  public acceptDeliveryJob(jobId: string, riderId?: string): boolean {
    const job = this.state.deliveryJobs.find((j) => j.id === jobId);
    if (!job || job.status !== 'available') return false;

    const rider = (riderId ? this.state.deliveryRiders.find((r) => r.id === riderId) : undefined) || this.getActiveRider();
    job.status = 'accepted';
    job.acceptedAt = 'Just now';
    job.assignedRiderId = rider.id;
    job.assignedRiderName = rider.name;

    // Notify mechanic
    this.state.notifications.unshift({
      id: `notif_${Date.now()}`,
      targetRole: 'mechanic',
      title: `Rider assigned for ${job.partName}`,
      description: `${rider.name} (${rider.vehicleType} · ${rider.phone}) accepted delivery dispatch from ${job.pickupShop}.`,
      timestamp: 'Just now',
      read: false,
      type: 'delivery',
      actionLabel: 'Track Delivery',
      actionView: 'deliveries',
      relatedId: job.orderId,
    });

    // Notify dealer
    this.state.notifications.unshift({
      id: `notif_${Date.now() + 1}`,
      targetRole: 'dealer',
      title: `Rider arriving soon for pickup`,
      description: `${rider.name} (${rider.phone}) is en route to collect ${job.partName}.`,
      timestamp: 'Just now',
      read: false,
      type: 'delivery',
      actionLabel: 'View Dispatch',
      actionView: 'dealer_deliveries',
      relatedId: job.orderId,
    });

    this.persist();
    return true;
  }

  public updateDeliveryJobStatus(
    jobId: string,
    newStatus: DeliveryRequestJob['status'],
    pinEntered?: string
  ): { success: boolean; message?: string; bothConfirmed?: boolean } {
    const job = this.state.deliveryJobs.find((j) => j.id === jobId);
    if (!job) return { success: false, message: 'Job not found', bothConfirmed: false };

    if (newStatus === 'delivered') {
      const res = this.confirmRiderInspection(job.id, pinEntered);
      return res;
    } else {
      job.status = newStatus;
    }

    this.persist();
    return { success: true, bothConfirmed: false };
  }

  // --- Mechanic Actions ---
  public createRequest(data: {
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: string;
    vehicleEngine?: string;
    partName: string;
    partNumber?: string;
    preferredCondition: 'New' | 'Used' | 'Either · New or used';
    notes: string;
    image?: string;
    voiceNote?: {
      audioUrl: string;
      durationSeconds: number;
      blobSize?: number;
      mimeType?: string;
    };
  }): PartRequest {
    const nextNum = 1043 + this.state.requests.length;
    const reqId = `REQ-${nextNum}`;
    const newReq: PartRequest = {
      id: reqId,
      mechanicId: this.state.currentUser.id,
      mechanicName: this.state.currentUser.name,
      workshopName: this.state.currentUser.workshopName || 'Independent Mechanic',
      mechanicLocation: this.state.currentUser.location,
      mechanicPhone: this.state.currentUser.phone,
      vehicleMake: data.vehicleMake || 'Toyota',
      vehicleModel: data.vehicleModel || 'Corolla',
      vehicleYear: data.vehicleYear || '2015',
      vehicleEngine: data.vehicleEngine || '1.8L',
      partName: data.partName,
      partNumber: data.partNumber,
      preferredCondition: data.preferredCondition,
      notes: data.notes || '',
      image: data.image || alternatorImg,
      voiceNote: data.voiceNote
        ? {
            audioUrl: data.voiceNote.audioUrl,
            durationSeconds: data.voiceNote.durationSeconds,
            blobSize: data.voiceNote.blobSize,
            mimeType: data.voiceNote.mimeType,
            waveform: [30, 45, 60, 80, 70, 50, 40, 65, 85, 40],
            recordedAt: 'Just now',
          }
        : undefined,
      createdAt: 'Just now',
      status: 'Waiting for dealers',
      repliesCount: 0,
      targetDealersCount: 8,
    };

    this.state.requests.unshift(newReq);

    // Notify dealer
    this.state.notifications.unshift({
      id: `notif_${Date.now()}`,
      targetRole: 'dealer',
      title: 'New request near your shop',
      description: `${newReq.vehicleMake} ${newReq.vehicleModel} ${newReq.vehicleYear} · ${newReq.partName} · ${newReq.mechanicLocation}`,
      timestamp: 'Just now',
      read: false,
      type: 'request',
      actionLabel: 'View request',
      actionView: 'dealer_request_detail',
      relatedId: newReq.id,
    });

    // Notify mechanic
    this.state.notifications.unshift({
      id: `notif_${Date.now() + 1}`,
      targetRole: 'mechanic',
      targetUserId: this.state.currentUser.id,
      title: 'Request delivered to 8 dealers',
      description: `${newReq.id} was sent to verified dealers in Jeshwang & Greater Banjul Area.`,
      timestamp: 'Just now',
      read: false,
      type: 'request',
      actionLabel: 'View request',
      actionView: 'requests',
      relatedId: newReq.id,
    });

    this.state.activityLogs.unshift({
      id: `act_${Date.now()}`,
      time: 'Just now',
      activity: 'Request created',
      userOrBusiness: newReq.mechanicName,
      reference: newReq.id,
      status: 'Sent to 8 dealers',
    });

    this.persist();
    return newReq;
  }

  public selectOffer(
    requestId: string,
    offerId: string,
    options: {
      deliveryMethod: DeliveryMethod;
      pickupTime?: string;
      pickupLocation?: string;
      deliveryAddress?: string;
      deliveryFeeGMD?: number;
      noteToDealer?: string;
      paymentMethod?: 'wave' | 'qmoney' | 'afrimoney' | 'bank_transfer' | 'cash_on_handover';
      paymentStatus?: 'paid' | 'pending' | 'cash_on_delivery';
      paymentPhone?: string;
      paymentTransactionRef?: string;
    }
  ): Order {
    const request = this.state.requests.find((r) => r.id === requestId);
    const offer = this.state.offers.find((o) => o.id === offerId);
    if (!request || !offer) throw new Error('Request or Offer not found');

    const orderId = `ORD-${Date.now().toString().slice(-4)}`;
    request.status = 'Reserved';
    request.selectedOfferId = offerId;
    request.orderId = orderId;
    offer.status = 'accepted';

    const isPrepaid = options.paymentStatus === 'paid';
    const totalEscrow = offer.priceGMD + (options.deliveryFeeGMD || 0);

    const order: Order = {
      id: orderId,
      requestId,
      offerId,
      mechanicId: request.mechanicId,
      mechanicName: request.mechanicName,
      mechanicPhone: request.mechanicPhone,
      dealerId: offer.dealerId,
      dealerName: offer.dealerName,
      dealerLocation: offer.dealerLocation,
      partName: offer.partName,
      partNumber: offer.partNumber,
      priceGMD: offer.priceGMD,
      deliveryMethod: options.deliveryMethod,
      pickupLocation: options.pickupLocation || offer.dealerLocation,
      pickupTime: options.pickupTime || 'Today · 2:00 PM',
      deliveryAddress: options.deliveryAddress,
      deliveryFeeGMD: options.deliveryFeeGMD || 0,
      noteToDealer: options.noteToDealer,
      paymentMethod: options.paymentMethod || 'cash_on_handover',
      paymentStatus: options.paymentStatus || 'pending',
      paymentPhone: options.paymentPhone,
      paymentTransactionRef: options.paymentTransactionRef || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      paidAt: isPrepaid ? 'Just now' : undefined,
      status: 'confirmed',
      createdAt: 'Just now',
      updatedAt: 'Just now',
      // Escrow Protection & Dual-Confirmation Handover
      escrowStatus: isPrepaid ? 'held_in_escrow' : undefined,
      escrowAmountGMD: isPrepaid ? totalEscrow : 0,
      dealerPayoutGMD: offer.priceGMD,
      riderPayoutGMD: options.deliveryFeeGMD || 0,
      escrowHeldAt: isPrepaid ? 'Just now' : undefined,
      buyerConfirmedCondition: false,
      riderConfirmedCondition: false,
      dealerPayoutStatus: isPrepaid ? 'pending_confirmation' : undefined,
      riderPayoutStatus: isPrepaid && options.deliveryMethod === 'delivery' ? 'pending_confirmation' : undefined,
    };

    this.state.orders.unshift(order);

    // Notifications
    this.state.notifications.unshift({
      id: `notif_${Date.now()}`,
      targetRole: 'dealer',
      title: isPrepaid ? 'Payment Secured in Escrow Vault' : 'Reservation confirmed',
      description: isPrepaid
        ? `Customer paid D${totalEscrow} GMD into AutoSpares Escrow Vault for ${offer.partName}. Your payout (D${offer.priceGMD} GMD) will be immediately released upon dual condition confirmation.`
        : `You reserved the ${offer.partName} for ${request.mechanicName}. ${
            options.deliveryMethod === 'pickup' ? `Pickup at ${options.pickupTime || '2:00 PM'}` : 'Delivery requested'
          }.`,
      timestamp: 'Just now',
      read: false,
      type: 'reservation',
      actionLabel: 'View request',
      actionView: 'dealer_requests',
      relatedId: requestId,
    });

    this.state.notifications.unshift({
      id: `notif_${Date.now() + 1}`,
      targetRole: 'mechanic',
      targetUserId: request.mechanicId,
      title: isPrepaid ? '🔒 Escrow Vault Active: Payment Withheld' : `Your ${offer.partName} is reserved`,
      description: isPrepaid
        ? `D${totalEscrow} GMD safely withheld in AutoSpares Escrow. Funds are protected until both you and the delivery rider confirm the product is identical and in good condition.`
        : `${offer.dealerName} confirmed ${requestId}.`,
      timestamp: 'Just now',
      read: false,
      type: 'reservation',
      actionLabel: 'View status',
      actionView: 'requests',
      relatedId: requestId,
    });

    this.state.activityLogs.unshift({
      id: `act_${Date.now()}`,
      time: 'Just now',
      activity: isPrepaid ? 'Payment secured in escrow' : 'Part reserved',
      userOrBusiness: isPrepaid ? 'AutoSpares Escrow Vault' : offer.dealerName,
      reference: orderId,
      status: isPrepaid ? 'In Escrow' : 'Reserved',
    });

    this.persist();
    return order;
  }

  // --- Dual-Confirmation & Instant Escrow Payout Engine ---
  public confirmBuyerInspection(
    orderId: string,
    checks?: { partNumberMatch?: boolean; noTransitDamage?: boolean; connectorsIntact?: boolean },
    notes?: string
  ): { order: Order; bothConfirmed: boolean } {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');

    order.buyerConfirmedCondition = true;
    order.buyerConfirmedAt = 'Just now';
    order.buyerInspectionNotes =
      notes || 'Buyer verified part matches vehicle specifications and is in good condition.';
    order.updatedAt = 'Just now';

    // If order is pickup or courier already confirmed, trigger immediate payout release!
    const isReadyForPayout =
      order.deliveryMethod === 'pickup' || order.riderConfirmedCondition === true;

    if (isReadyForPayout) {
      this.releaseEscrowPayouts(order);
      return { order, bothConfirmed: true };
    }

    // Otherwise, notify parties that buyer has confirmed and waiting for courier
    this.state.notifications.unshift({
      id: `notif_${Date.now()}`,
      targetRole: 'mechanic',
      targetUserId: order.mechanicId,
      title: 'Buyer Condition Confirmed',
      description: `You verified ${order.partName} is in good condition. Payout will be immediately released to ${order.dealerName} and the courier as soon as the courier confirms the physical handover.`,
      timestamp: 'Just now',
      read: false,
      type: 'system',
      relatedId: order.id,
    });

    this.state.notifications.unshift({
      id: `notif_${Date.now() + 1}`,
      targetRole: 'delivery_rider',
      targetUserId: order.assignedRiderId ? `user_${order.assignedRiderId}` : undefined,
      title: 'Customer Verified Part Condition',
      description: `Customer inspected ${order.partName} and confirmed it is in good condition. Confirm your physical handover to release your D${order.riderPayoutGMD || order.deliveryFeeGMD || 120} GMD dispatch pay!`,
      timestamp: 'Just now',
      read: false,
      type: 'delivery',
      relatedId: order.id,
    });

    this.state.activityLogs.unshift({
      id: `act_${Date.now()}`,
      time: 'Just now',
      activity: 'Buyer verified part condition',
      userOrBusiness: order.mechanicName,
      reference: order.id,
      status: 'Awaiting Rider Handover',
    });

    this.persist();
    return { order, bothConfirmed: false };
  }

  public confirmRiderInspection(
    orderOrJobId: string,
    pinEntered?: string,
    notes?: string
  ): { order?: Order; bothConfirmed: boolean; success: boolean; message?: string } {
    const job = this.state.deliveryJobs.find((j) => j.id === orderOrJobId || j.orderId === orderOrJobId);
    const order = this.state.orders.find((o) => o.id === orderOrJobId || (job && o.id === job.orderId));

    if (!order) {
      return { success: false, message: 'Associated order not found', bothConfirmed: false };
    }

    if (job) {
      if (pinEntered && pinEntered.trim() !== job.handoverPin && pinEntered.trim() !== '8429') {
        return {
          success: false,
          message: `Incorrect verification PIN. Please verify with ${job.dropoffWorkshop}.`,
          bothConfirmed: false,
        };
      }
      job.status = 'delivered';
      job.deliveredAt = 'Just now';
    }

    order.riderConfirmedCondition = true;
    order.riderConfirmedAt = 'Just now';
    order.riderInspectionNotes =
      notes || 'Courier confirmed physical part inspected, undamaged, and verified in good condition.';
    order.updatedAt = 'Just now';

    // If buyer has also confirmed, trigger immediate release!
    if (order.buyerConfirmedCondition === true) {
      this.releaseEscrowPayouts(order);
      return { order, bothConfirmed: true, success: true };
    }

    // Otherwise, notify parties that courier confirmed and waiting for customer condition sign-off
    this.state.notifications.unshift({
      id: `notif_${Date.now()}`,
      targetRole: 'delivery_rider',
      targetUserId: order.assignedRiderId ? `user_${order.assignedRiderId}` : undefined,
      title: 'Courier Handover Recorded',
      description: `You verified physical handover of ${order.partName}. Your payout (D${order.riderPayoutGMD || order.deliveryFeeGMD || 120} GMD) will be released immediately once the customer completes quality confirmation.`,
      timestamp: 'Just now',
      read: false,
      type: 'delivery',
      relatedId: order.id,
    });

    this.state.notifications.unshift({
      id: `notif_${Date.now() + 1}`,
      targetRole: 'mechanic',
      targetUserId: order.mechanicId,
      title: 'Courier Verified Handover',
      description: `Courier ${order.courierName || 'Rider'} confirmed the package is delivered. Please inspect and confirm the part is identical and in good condition to release payment from escrow.`,
      timestamp: 'Just now',
      read: false,
      type: 'delivery',
      relatedId: order.id,
    });

    this.state.activityLogs.unshift({
      id: `act_${Date.now()}`,
      time: 'Just now',
      activity: 'Courier verified handover',
      userOrBusiness: order.courierName || 'Courier',
      reference: order.id,
      status: 'Awaiting Customer Sign-off',
    });

    this.persist();
    return { order, bothConfirmed: false, success: true };
  }

  public simulateCourierConditionConfirmation(orderId: string): { order: Order; bothConfirmed: boolean } {
    const res = this.confirmRiderInspection(orderId, '8429', 'Simulated courier condition verification');
    return { order: res.order || this.state.orders[0], bothConfirmed: res.bothConfirmed };
  }

  public releaseEscrowPayouts(order: Order): Order {
    order.escrowStatus = 'released';
    order.status = 'delivered';
    order.escrowReleasedAt = 'Just now';
    order.dealerPayoutStatus = 'paid_out';
    order.dealerPayoutRef = `ESC-DLR-${Math.floor(100000 + Math.random() * 900000)}`;
    order.dealerPaidAt = 'Just now';

    const dealerPayoutAmount = order.dealerPayoutGMD || order.priceGMD || 2500;
    const riderPayoutAmount = order.riderPayoutGMD || order.deliveryFeeGMD || 120;

    if (order.deliveryMethod === 'delivery' || order.assignedRiderId) {
      order.riderPayoutStatus = 'paid_out';
      order.riderPayoutRef = `ESC-RDR-${Math.floor(100000 + Math.random() * 900000)}`;
      order.riderPaidAt = 'Just now';

      // Credit rider earnings & increment trip count
      const rider =
        this.state.deliveryRiders.find((r) => r.id === order.assignedRiderId) ||
        this.state.deliveryRiders.find((r) => r.name === order.courierName) ||
        this.getActiveRider();

      if (rider) {
        rider.todayEarningsGMD += riderPayoutAmount;
        rider.totalEarningsGMD += riderPayoutAmount;
        rider.completedDeliveries += 1;
        rider.todayDeliveries += 1;
      }

      // Mark delivery job as completed
      const job = this.state.deliveryJobs.find((j) => j.orderId === order.id);
      if (job) {
        job.status = 'delivered';
        job.deliveredAt = 'Just now';
      }

      // 1. Send immediate payout notification to Delivery Rider
      this.state.notifications.unshift({
        id: `notif_${Date.now()}`,
        targetRole: 'delivery_rider',
        targetUserId: rider ? `user_${rider.id}` : undefined,
        title: `💰 Dispatch Payout Released: D${riderPayoutAmount} GMD`,
        description: `Dual-party verification confirmed! Customer verified ${order.partName} is in good condition. D${riderPayoutAmount} GMD immediately transferred to your mobile wallet (Ref: ${order.riderPayoutRef}).`,
        timestamp: 'Just now',
        read: false,
        type: 'delivery',
        relatedId: order.id,
      });
    }

    // 2. Send immediate payout notification to Dealer
    this.state.notifications.unshift({
      id: `notif_${Date.now() + 1}`,
      targetRole: 'dealer',
      targetUserId: order.dealerId,
      title: `💰 Escrow Payout Released: D${dealerPayoutAmount.toLocaleString()} GMD`,
      description: `Dual confirmation complete! Both the customer and courier verified that ${order.partName} is identical and in good condition. D${dealerPayoutAmount.toLocaleString()} GMD has been immediately sent to ${order.dealerName} via Wave Business (Ref: ${order.dealerPayoutRef}).`,
      timestamp: 'Just now',
      read: false,
      type: 'delivery',
      actionLabel: 'View Settlement',
      actionView: 'dealer_deliveries',
      relatedId: order.id,
    });

    // 3. Send transaction completion notification to Buyer / Mechanic
    this.state.notifications.unshift({
      id: `notif_${Date.now() + 2}`,
      targetRole: 'mechanic',
      targetUserId: order.mechanicId,
      title: '✅ Escrow Released & Order Completed',
      description: `Thank you for inspecting and confirming your ${order.partName}. With both your and the courier's sign-off, the payment has been securely settled to ${order.dealerName} (D${dealerPayoutAmount.toLocaleString()} GMD) and the courier (D${riderPayoutAmount} GMD).`,
      timestamp: 'Just now',
      read: false,
      type: 'system',
      actionLabel: 'View Order',
      actionView: 'deliveries',
      relatedId: order.id,
    });

    // Update corresponding request
    const request = this.state.requests.find((r) => r.id === order.requestId);
    if (request) {
      request.status = 'Delivered';
    }

    // 4. Log detailed verified activity
    this.state.activityLogs.unshift({
      id: `act_${Date.now()}`,
      time: 'Just now',
      activity: 'Escrow payouts released',
      userOrBusiness: 'AutoSpares Trust Engine',
      reference: order.id,
      status: `Dealer +D${dealerPayoutAmount} GMD · Rider +D${riderPayoutAmount} GMD`,
    });

    this.persist();
    return order;
  }

  // --- Dealer Actions ---
  public submitOffer(data: {
    requestId: string;
    dealerId: string;
    isAvailable: boolean;
    priceGMD?: number;
    quantity?: number;
    condition?: string;
    timing?: string;
    location?: string;
    notes?: string;
    image?: string;
    unavailableReason?: string;
  }): DealerOffer {
    const request = this.state.requests.find((r) => r.id === data.requestId);
    const dealer = this.state.dealers.find((d) => d.id === data.dealerId) || this.state.dealers[0];
    if (!request) throw new Error('Request not found');

    const offerId = `off_${dealer.id}_${Date.now()}`;
    const newOffer: DealerOffer = {
      id: offerId,
      requestId: data.requestId,
      dealerId: dealer.id,
      dealerName: dealer.businessName,
      dealerLocation: dealer.shopLocation,
      dealerPhone: dealer.phone,
      dealerVerified: dealer.verificationStatus === 'approved',
      partName: request.partName,
      partNumber: request.partNumber,
      priceGMD: data.priceGMD || 2500,
      condition: data.condition || 'Used · tested',
      quantityAvailable: data.quantity || 1,
      availabilityTiming: data.timing || 'Available now',
      location: data.location || dealer.shopLocation,
      notes: data.notes || '',
      image: data.image || request.image || alternatorImg,
      createdAt: 'Just now',
      status: data.isAvailable ? 'pending' : 'unavailable',
      unavailableReason: data.unavailableReason,
    };

    this.state.offers.push(newOffer);
    if (data.isAvailable) {
      request.repliesCount += 1;
      if (request.status === 'Waiting for dealers') {
        request.status = 'Responses received';
      }

      // Notify mechanic
      this.state.notifications.unshift({
        id: `notif_${Date.now()}`,
        targetRole: 'mechanic',
        targetUserId: request.mechanicId,
        title: `New offer from ${dealer.businessName}`,
        description: `D${newOffer.priceGMD} · ${newOffer.condition} for ${request.partName}`,
        timestamp: 'Just now',
        read: false,
        type: 'offer',
        actionLabel: 'View offer',
        actionView: 'responses_compare',
        relatedId: request.id,
      });

      this.state.activityLogs.unshift({
        id: `act_${Date.now()}`,
        time: 'Just now',
        activity: 'Response submitted',
        userOrBusiness: dealer.businessName,
        reference: request.id,
        status: 'Available offer',
      });
    }

    this.persist();
    return newOffer;
  }

  public addInventoryItem(item: Omit<InventoryItem, 'id' | 'updatedAt'>): InventoryItem {
    const nextId = `P-0${30 + this.state.inventory.length}`;
    const newItem: InventoryItem = {
      ...item,
      id: nextId,
      updatedAt: 'Just now',
    };
    this.state.inventory.unshift(newItem);
    this.persist();
    return newItem;
  }

  public updateInventoryItem(id: string, updates: Partial<InventoryItem>) {
    const item = this.state.inventory.find((i) => i.id === id);
    if (item) {
      Object.assign(item, updates, { updatedAt: 'Just now' });
      this.persist();
    }
  }

  public updateDealerProfile(dealerId: string, updates: Partial<DealerProfile>) {
    const dealer = this.state.dealers.find((d) => d.id === dealerId);
    if (dealer) {
      Object.assign(dealer, updates);
      this.persist();
    }
  }

  // --- Order & Delivery Status Management ---
  public updateOrderStatus(orderId: string, status: Order['status']) {
    const order = this.state.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = 'Just now';

      const request = this.state.requests.find((r) => r.id === order.requestId);
      if (request) {
        if (status === 'collected') request.status = 'Collected';
        if (status === 'delivered') request.status = 'Delivered';
      }

      this.state.notifications.unshift({
        id: `notif_${Date.now()}`,
        targetRole: 'mechanic',
        targetUserId: order.mechanicId,
        title: `Order ${orderId} updated`,
        description: `Status changed to: ${status.replace('_', ' ')}`,
        timestamp: 'Just now',
        read: false,
        type: 'reservation',
        actionLabel: 'View status',
        actionView: 'requests',
        relatedId: order.requestId,
      });

      this.persist();
    }
  }

  public assignRiderToOrder(orderId: string, riderId: string): { order: Order; rider: DeliveryRiderProfile } {
    const order = this.state.orders.find((o) => o.id === orderId);
    const rider = this.state.deliveryRiders.find((r) => r.id === riderId) || this.state.deliveryRiders[0];
    if (!order) throw new Error('Order not found');

    order.assignedRiderId = rider.id;
    order.courierName = rider.name;
    order.courierPhone = rider.phone;
    order.courierVehicle = `${rider.vehicleType} (${rider.plateNumber})`;
    order.courierRating = rider.rating;
    order.status = 'in_transit';
    order.updatedAt = 'Just now';

    // Link or create delivery job
    let job = this.state.deliveryJobs.find((j) => j.orderId === order.id);
    if (!job) {
      job = {
        id: `JOB-DEL-${Date.now().toString().slice(-4)}`,
        orderId: order.id,
        partName: order.partName,
        partNumber: order.partNumber || 'OEM-PART',
        weightCategory: 'Medium (5-15kg)',
        pickupShop: order.dealerName,
        pickupAddress: order.dealerLocation,
        pickupPhone: '+220 724 5550',
        dropoffWorkshop: order.mechanicName ? `${order.mechanicName}'s Workshop` : 'Mechanic Workshop',
        dropoffAddress: order.deliveryAddress || 'Westfield Junction, Serrekunda',
        dropoffPhone: order.mechanicPhone || '+220 745 5010',
        distanceKm: 3.4,
        estimatedMinutes: 16,
        payoutGMD: order.deliveryFeeGMD || 120,
        urgency: 'Express 45-min',
        status: 'in_transit',
        handoverPin: '8429',
        acceptedAt: 'Just now',
        assignedRiderId: rider.id,
        assignedRiderName: rider.name,
        notes: 'Dispatched directly from deliveries console. Fast delivery requested.',
      };
      this.state.deliveryJobs.unshift(job);
    } else {
      job.assignedRiderId = rider.id;
      job.assignedRiderName = rider.name;
      job.status = 'in_transit';
      job.acceptedAt = 'Just now';
    }

    // 1. Notify the delivery rider
    this.state.notifications.unshift({
      id: `notif_${Date.now()}`,
      targetRole: 'delivery_rider',
      targetUserId: `user_${rider.id}`,
      title: `🚨 New Dispatch Assigned: ${order.partName}`,
      description: `Pickup from ${order.dealerName} (${order.dealerLocation}) and deliver to ${order.deliveryAddress || 'Westfield'}. Handover PIN: 8429.`,
      timestamp: 'Just now',
      read: false,
      type: 'delivery',
      actionLabel: 'Open Active Job',
      actionView: 'delivery_active',
      relatedId: order.id,
    });

    // 2. Notify the mechanic
    this.state.notifications.unshift({
      id: `notif_${Date.now() + 1}`,
      targetRole: 'mechanic',
      targetUserId: order.mechanicId,
      title: `Delivery Rider Dispatched!`,
      description: `${rider.name} (${rider.vehicleType} · ${rider.plateNumber}) accepted dispatch and is en route to collect your ${order.partName}.`,
      timestamp: 'Just now',
      read: false,
      type: 'delivery',
      actionLabel: 'Track Live Delivery',
      actionView: 'deliveries',
      relatedId: order.id,
    });

    // 3. Notify the dealer
    this.state.notifications.unshift({
      id: `notif_${Date.now() + 2}`,
      targetRole: 'dealer',
      targetUserId: order.dealerId,
      title: `Rider En Route for Pickup`,
      description: `${rider.name} (${rider.phone}) is heading to your counter for order ${order.id}.`,
      timestamp: 'Just now',
      read: false,
      type: 'delivery',
      actionLabel: 'View Dispatch',
      actionView: 'dealer_deliveries',
      relatedId: order.id,
    });

    // 4. Log activity
    this.state.activityLogs.unshift({
      id: `act_${Date.now()}`,
      time: 'Just now',
      activity: 'Courier dispatched',
      userOrBusiness: rider.name,
      reference: order.id,
      status: 'In Transit',
    });

    this.persist();
    return { order, rider };
  }

  // --- Admin Actions ---
  public approveDealer(appId: string, note?: string) {
    const app = this.state.applications.find((a) => a.id === appId);
    if (app) {
      app.status = 'approved';
      app.reviewNote = note || 'Approved by administrator.';

      // Check if exists in dealers
      let dealer = this.state.dealers.find((d) => d.businessName.toLowerCase() === app.businessName.toLowerCase());
      if (!dealer) {
        dealer = {
          id: `dealer_${Date.now()}`,
          businessName: app.businessName,
          tagline: 'Verified automotive spare parts dealer',
          contactPerson: app.contactPerson,
          phone: app.phone,
          email: app.email,
          businessRegistration: app.businessRegistration,
          shopLocation: app.shopAddress,
          serviceArea: 'Greater Banjul Area',
          specialization: app.specialization,
          openingHours: 'Mon–Sat · 8:00 AM–6:00 PM',
          handoverOptions: 'Pickup & local delivery',
          verificationStatus: 'approved',
          verifiedDate: 'Today',
          logoText: app.businessName.slice(0, 2).toUpperCase(),
          rating: 5.0,
          partsCount: 0,
          distanceKm: 3.0,
          isOpenForRequests: true,
        };
        this.state.dealers.push(dealer);
      } else {
        dealer.verificationStatus = 'approved';
        dealer.verifiedDate = 'Today';
      }

      this.state.activityLogs.unshift({
        id: `act_${Date.now()}`,
        time: 'Just now',
        activity: 'Dealer application approved',
        userOrBusiness: app.businessName,
        reference: app.businessRegistration,
        status: 'Approved',
      });

      this.persist();
    }
  }

  public rejectDealer(appId: string, note?: string) {
    const app = this.state.applications.find((a) => a.id === appId);
    if (app) {
      app.status = 'rejected';
      app.reviewNote = note || 'Application rejected.';
      this.persist();
    }
  }

  public toggleUserStatus(userId: string) {
    const user = this.state.users.find((u) => u.id === userId);
    if (user) {
      user.status = user.status === 'active' ? 'suspended' : 'active';
      this.persist();
    }
  }

  public toggleListingPublication(listingId: string) {
    const item = this.state.inventory.find((i) => i.id === listingId);
    if (item) {
      item.status = item.status === 'unlisted' ? 'available' : 'unlisted';
      this.persist();
    }
  }

  public markAllNotificationsRead(role?: UserRole) {
    this.state.notifications.forEach((n) => {
      if (!role || n.targetRole === role) {
        n.read = true;
      }
    });
    this.persist();
  }

  public markNotificationRead(id: string) {
    const notif = this.state.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.persist();
    }
  }

  public resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = this.loadInitialState();
    this.persist();
  }
}

export const marketplaceStore = new Store();

export type UserRole = 'mechanic' | 'dealer' | 'admin' | 'owner';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  workshopName?: string;
  location: string;
  joinedDate: string;
  status: 'active' | 'suspended';
  avatar?: string;
  totalRequests?: number;
  activeRequests?: number;
  completedRequests?: number;
}

export interface DealerProfile {
  id: string;
  businessName: string;
  tagline?: string;
  contactPerson: string;
  phone: string;
  email: string;
  businessRegistration: string;
  shopLocation: string;
  serviceArea: string;
  specialization: string;
  openingHours: string;
  handoverOptions: string;
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'suspended';
  verifiedDate?: string;
  logoText?: string;
  rating?: number;
  partsCount?: number;
  distanceKm?: number;
  isOpenForRequests: boolean;
}

export interface DealerApplication {
  id: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  businessRegistration: string;
  shopAddress: string;
  location: string;
  specialization: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  registrationDocName: string;
  registrationDocSize: string;
  shopPhotoName: string;
  shopPhotoSize: string;
  reviewNote?: string;
}

export interface InventoryItem {
  id: string;
  dealerId: string;
  dealerName: string;
  dealerLocation: string;
  partName: string;
  partNumber: string;
  compatibleMake: string;
  compatibleModel: string;
  compatibleYear: string;
  compatibleEngine?: string;
  condition: 'New' | 'Used · tested' | 'Refurbished';
  priceGMD: number;
  quantity: number;
  status: 'available' | 'out_of_stock' | 'unlisted';
  image: string;
  description: string;
  updatedAt: string;
  isReported?: boolean;
}

export interface VoiceNote {
  audioUrl: string;
  durationSeconds: number;
  waveform?: number[];
  recordedAt: string;
  blobSize?: number;
  mimeType?: string;
}

export interface PartRequest {
  id: string; // e.g. "REQ-1042"
  mechanicId: string;
  mechanicName: string;
  workshopName: string;
  mechanicLocation: string;
  mechanicPhone: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleEngine?: string;
  vin?: string;
  partName: string;
  partNumber?: string;
  preferredCondition: 'New' | 'Used' | 'Either · New or used';
  notes: string;
  image?: string;
  voiceNote?: VoiceNote;
  createdAt: string;
  status: 'Waiting for dealers' | 'Responses received' | 'Reserved' | 'Collected' | 'Delivered' | 'Reported';
  repliesCount: number;
  targetDealersCount: number;
  selectedOfferId?: string;
  orderId?: string;
}

export interface DealerOffer {
  id: string;
  requestId: string;
  dealerId: string;
  dealerName: string;
  dealerLocation: string;
  dealerPhone: string;
  dealerVerified: boolean;
  partName: string;
  partNumber?: string;
  priceGMD: number;
  condition: string;
  quantityAvailable: number;
  availabilityTiming: string; // e.g. "Available now"
  location: string;
  notes: string;
  image?: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'unavailable';
  unavailableReason?: string;
}

export type DeliveryMethod = 'pickup' | 'delivery';
export type OrderStatus = 'pending' | 'confirmed' | 'ready_for_pickup' | 'in_transit' | 'collected' | 'delivered' | 'cancelled';

export interface Order {
  id: string; // e.g. "ORD-7021"
  requestId: string;
  offerId: string;
  mechanicId: string;
  mechanicName: string;
  mechanicPhone: string;
  dealerId: string;
  dealerName: string;
  dealerLocation: string;
  partName: string;
  partNumber?: string;
  priceGMD: number;
  deliveryMethod: DeliveryMethod;
  pickupLocation?: string;
  pickupTime?: string;
  deliveryAddress?: string;
  deliveryFeeGMD?: number;
  noteToDealer?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  targetRole: 'mechanic' | 'dealer' | 'admin';
  targetUserId?: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'request' | 'offer' | 'reservation' | 'message' | 'verification' | 'system';
  actionLabel?: string;
  actionView?: string;
  relatedId?: string;
}

export interface ActivityLog {
  id: string;
  time: string;
  activity: string;
  userOrBusiness: string;
  reference: string;
  status: string;
}

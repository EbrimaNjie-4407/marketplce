import React, { useState } from 'react';
import { X, Truck, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { marketplaceStore } from '../../services/store';

interface DeliveryRiderSignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeliveryRiderSignUpModal({ isOpen, onClose, onSuccess }: DeliveryRiderSignUpModalProps) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vehicleType, setVehicleType] = useState<'Motorcycle' | 'Scooter' | 'Tricycle / Keke' | 'Dispatch Van' | 'Bicycle'>('Motorcycle');
  const [plateNumber, setPlateNumber] = useState('');
  const [primaryZone, setPrimaryZone] = useState('Jeshwang & Westfield Corridor');
  const [payoutWallet, setPayoutWallet] = useState<'wave' | 'qmoney' | 'afrimoney'>('wave');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please provide your full legal name.');
      return;
    }
    if (!phoneNumber.trim()) {
      setError('Please provide your active Gambian phone number.');
      return;
    }
    if (!plateNumber.trim() && vehicleType !== 'Bicycle') {
      setError('Please provide your vehicle registration / plate number.');
      return;
    }

    setIsSubmitting(true);
    try {
      marketplaceStore.registerDeliveryRider({
        name: fullName.trim(),
        phone: phoneNumber.trim(),
        vehicleType,
        plateNumber: plateNumber.trim() || 'N/A',
        licenseNumber: licenseNumber.trim() || undefined,
        primaryZone,
      });

      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess();
      }, 400);
    } catch (err: unknown) {
      setIsSubmitting(false);
      setError((err as Error)?.message || 'Registration failed. Please try again.');
    }
  };

  const fillQuickDemo = () => {
    setFullName('Ebrima Sanyang');
    setPhoneNumber('+220 782 9104');
    setVehicleType('Motorcycle');
    setPlateNumber('BJL-9304-D');
    setPrimaryZone('Jeshwang & Westfield Corridor');
    setLicenseNumber('DL-GM-88410');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Join Dispatch Fleet
              </span>
              <h2 className="text-xl font-bold">Sign Up as Delivery Rider</h2>
              <p className="text-xs text-blue-200 mt-0.5">
                Earn D100 - D250 per dispatch across The Gambia
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between pb-1">
            <span className="text-xs text-slate-500 font-medium">Quick testing:</span>
            <button
              type="button"
              onClick={fillQuickDemo}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              Fill Demo Rider Info
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Modou Lamin Ceesay"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Phone Number (Wave / QMoney) *</label>
              <input
                type="tel"
                required
                placeholder="+220 7xx xxxx"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Vehicle Type *</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
              >
                <option value="Motorcycle">Motorcycle / Okada</option>
                <option value="Scooter">Scooter</option>
                <option value="Tricycle / Keke">Tricycle / Keke Dispatch</option>
                <option value="Dispatch Van">Dispatch Van / Pickup</option>
                <option value="Bicycle">Bicycle Courier</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Plate Number / Reg *</label>
              <input
                type="text"
                placeholder="e.g. BJL 4821 B"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 uppercase font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Driving License No. (Optional)</label>
              <input
                type="text"
                placeholder="e.g. GM-74892"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Primary Operating Zone *</label>
            <select
              value={primaryZone}
              onChange={(e) => setPrimaryZone(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600 bg-white"
            >
              <option value="Jeshwang & Westfield Corridor">Jeshwang Spare Parts Hub & Westfield</option>
              <option value="Greater Banjul & Kanifing Industrial">Greater Banjul & Kanifing Industrial</option>
              <option value="Serrekunda, Senegambia & Coastal">Serrekunda, Senegambia & Coastal Area</option>
              <option value="Brikama Highway & Airport Corridor">Brikama Highway & Airport Corridor</option>
              <option value="All Greater Banjul Areas">All Greater Banjul Areas (Wide Fleet)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Daily Payout Destination</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPayoutWallet('wave')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  payoutWallet === 'wave'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Wave GM</span>
              </button>
              <button
                type="button"
                onClick={() => setPayoutWallet('qmoney')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  payoutWallet === 'qmoney'
                    ? 'border-amber-600 bg-amber-50 text-amber-700 ring-1 ring-amber-500'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>QMoney</span>
              </button>
              <button
                type="button"
                onClick={() => setPayoutWallet('afrimoney')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  payoutWallet === 'afrimoney'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Afrimoney</span>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>AutoSpares Rider Guarantee</span>
            </div>
            <p>
              • D100 minimum payout per pickup & delivery trip.
              <br />
              • Handover verification PIN security protects every parcel handover.
              <br />
              • Instant wallet withdrawal anytime after order delivery.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <span>{isSubmitting ? 'Registering Rider...' : 'Create Account & Enter Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

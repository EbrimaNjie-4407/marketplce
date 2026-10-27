import { useState } from 'react';
import {
  User,
  Truck,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Save,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { marketplaceStore } from '../../services/store';

interface DeliveryProfilePageProps {
  onNavigate: (view: string) => void;
}

export function DeliveryProfilePage({ onNavigate: _onNavigate }: DeliveryProfilePageProps) {
  const store = useStore();
  const rider = marketplaceStore.getActiveRider();

  const [name, setName] = useState(rider.name);
  const [phone, setPhone] = useState(rider.phone);
  const [vehicleType, setVehicleType] = useState(rider.vehicleType);
  const [plateNumber, setPlateNumber] = useState(rider.plateNumber);
  const [primaryZone, setPrimaryZone] = useState(rider.primaryZone);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    rider.name = name.trim();
    rider.phone = phone.trim();
    rider.vehicleType = vehicleType;
    rider.plateNumber = plateNumber.trim().toUpperCase();
    rider.primaryZone = primaryZone;

    if (store.currentUser.role === 'delivery_rider') {
      store.currentUser.name = name.trim();
      store.currentUser.phone = phone.trim();
      store.currentUser.location = primaryZone;
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {isSaved && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between gap-3 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile and dispatch settings updated successfully!</span>
          </div>
          <button onClick={() => setIsSaved(false)} className="text-white/80 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          Rider Profile & Vehicle Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your contact information, vehicle details and dispatch operating zone
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-5 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 font-black text-2xl flex items-center justify-center mx-auto border-2 border-blue-200">
            {rider.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">{rider.name}</h2>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Verified Courier Dispatcher
            </span>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs text-left">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Status</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Active on Fleet
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Rating</span>
              <span className="font-bold text-slate-900 font-mono">★ {rider.rating.toFixed(1)} / 5.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Completed Trips</span>
              <span className="font-bold text-slate-900 font-mono">{rider.completedDeliveries}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Joined Platform</span>
              <span className="font-medium text-slate-700">{rider.joinedDate}</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-7 space-y-5">
          <h3 className="font-extrabold text-base text-slate-900">Vehicle & Contact Details</h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Phone Number (Wave / QMoney)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-600 focus:bg-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Vehicle Dispatch Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-600 focus:bg-white"
                >
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Scooter">Scooter</option>
                  <option value="Tricycle / Keke">Tricycle / Keke Dispatch</option>
                  <option value="Dispatch Van">Dispatch Van</option>
                  <option value="Bicycle">Bicycle Courier</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">License Plate Number</label>
                <input
                  type="text"
                  required
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-600 focus:bg-white font-mono uppercase font-bold text-blue-700"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Primary Operating Zone</label>
              <select
                value={primaryZone}
                onChange={(e) => setPrimaryZone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-600 focus:bg-white"
              >
                <option value="Jeshwang & Westfield Corridor">Jeshwang Spare Parts Hub & Westfield</option>
                <option value="Greater Banjul & Kanifing Industrial">Greater Banjul & Kanifing Industrial</option>
                <option value="Serrekunda, Senegambia & Coastal">Serrekunda, Senegambia & Coastal Area</option>
                <option value="Brikama Highway & Airport Corridor">Brikama Highway & Airport Corridor</option>
                <option value="All Greater Banjul Areas">All Greater Banjul Areas</option>
              </select>
            </div>

            {/* Safety guidelines */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 space-y-2 text-[11px] text-blue-900">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Courier Dispatch Protocols</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-blue-800">
                <li>Always carry a certified motorcycle helmet and securely strapped courier box.</li>
                <li>Inspect alternators, radiators, and glass lenses for pre-existing transit cracks prior to leaving dealer shop.</li>
                <li>Collect 4-digit Handover PIN from mechanic before relinquishing parcel.</li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

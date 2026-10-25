import { useState } from 'react';
import { CheckCircle2, ShieldCheck, Check } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { marketplaceStore } from '../../services/store';

export function DealerProfilePage() {
  const store = useStore();
  const dealer = store.dealers.find((d) => d.id === 'dealer_burgi') || store.dealers[0];

  const [businessName, setBusinessName] = useState(dealer.businessName);
  const [contactPerson, setContactPerson] = useState(dealer.contactPerson);
  const [phone, setPhone] = useState(dealer.phone);
  const [email, setEmail] = useState(dealer.email);
  const [registration, setRegistration] = useState(dealer.businessRegistration);
  const [shopLocation, setShopLocation] = useState(dealer.shopLocation);
  const [specialization, setSpecialization] = useState(dealer.specialization);
  const [openingHours, setOpeningHours] = useState(dealer.openingHours);
  const [handoverOptions, setHandoverOptions] = useState(dealer.handoverOptions);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    marketplaceStore.updateDealerProfile(dealer.id, {
      businessName,
      contactPerson,
      phone,
      email,
      businessRegistration: registration,
      shopLocation,
      specialization,
      openingHours,
      handoverOptions,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Title from Figma Page 16 */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          Dealer profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          The business details mechanics see when they review your offers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 4 Cols: Verification Card from Figma Page 16 */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#1c398e] text-white flex items-center justify-center font-black text-2xl shadow-xs">
              {dealer.logoText || 'BS'}
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900">{dealer.businessName}</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                Verified dealer
              </span>
            </div>

            <div className="space-y-3 text-xs border-t border-slate-100 pt-4 text-slate-600">
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Business verification
                </span>
                <p className="font-semibold text-slate-900">
                  Approved · {dealer.verifiedDate || '14 June 2026'}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Business registration
                </span>
                <p className="font-mono font-semibold text-slate-900">
                  {dealer.businessRegistration}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert('Logo replacement file picker opened.')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
            >
              Change logo
            </button>
          </div>

          {/* Public profile tip card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-900">Public profile</h4>
            <p className="text-slate-500 leading-relaxed">
              Your name, location, phone number and specialization are visible to mechanics across the marketplace.
            </p>
            <button
              onClick={() => alert(`Previewing ${dealer.businessName} profile card.`)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
            >
              Preview profile
            </button>
          </div>
        </div>

        {/* Right 8 Cols: Business details Form from Figma Page 16 */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900">Business details</h2>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Business name</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Contact person</label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Phone number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Business registration</label>
                <input
                  type="text"
                  required
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Shop location</label>
              <input
                type="text"
                required
                value={shopLocation}
                onChange={(e) => setShopLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Specialization</label>
              <input
                type="text"
                required
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Opening hours</label>
                <input
                  type="text"
                  required
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Handover options</label>
                <select
                  value={handoverOptions}
                  onChange={(e) => setHandoverOptions(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Pickup & local delivery">Pickup & local delivery</option>
                  <option value="Pickup only">Pickup only</option>
                  <option value="Courier dispatch nationwide">Courier dispatch nationwide</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </button>

              {savedSuccess && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4" /> Changes saved successfully!
                </span>
              )}
            </div>
          </form>

          {/* Verified footer banner from Figma Page 16 */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex items-start gap-3 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-emerald-950">Your business is verified</h4>
              <p className="text-emerald-800/90 leading-relaxed">
                Changes to your business name or registration may require another verification review. Contact details and opening hours can be updated anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

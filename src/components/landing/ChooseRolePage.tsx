import { useState } from 'react';
import { Car, Wrench, Disc, ArrowRight, Shield, Truck, Bike, Sparkles, CheckCircle2 } from 'lucide-react';
import heroImg from '../../assets/images/hero_mechanic_workshop_1791849519785.jpg';
import { UserRole } from '../../types';
import { DeliveryRiderSignUpModal } from '../delivery/DeliveryRiderSignUpModal';

interface ChooseRolePageProps {
  onSelectRole: (role: UserRole) => void;
  onNavigate: (view: string) => void;
}

export function ChooseRolePage({ onSelectRole, onNavigate }: ChooseRolePageProps) {
  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);

  const handleRiderSignUpSuccess = () => {
    setIsRiderModalOpen(false);
    onSelectRole('delivery_rider');
    onNavigate('delivery_dashboard');
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white flex flex-col justify-between overflow-hidden">
      {/* Background with Dark Scrim matching Figma Page 2 */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Workshop background"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/80 to-slate-950/95" />
      </div>

      {/* Top Navbar */}
      <nav className="relative z-10 px-6 lg:px-12 py-5 flex items-center justify-between border-b border-slate-800/60">
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
            AS
          </div>
          <span className="font-extrabold text-lg tracking-tight">AutoSpares GM</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
          <button
            onClick={() => {
              onSelectRole('mechanic');
              onNavigate('browse_all_parts');
            }}
            className="hover:text-white transition-colors"
          >
            Find Parts
          </button>
          <button
            onClick={() => {
              onSelectRole('mechanic');
              onNavigate('dealers');
            }}
            className="hover:text-white transition-colors"
          >
            Mechanic
          </button>
          <button
            onClick={() => {
              setIsRiderModalOpen(true);
            }}
            className="hover:text-white transition-colors text-emerald-400 font-semibold"
          >
            Delivery Dispatch
          </button>
          <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">
            About Us
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onSelectRole('admin');
              onNavigate('admin_dashboard');
            }}
            className="px-3 py-1.5 border border-slate-700 hover:border-slate-500 rounded-lg text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        </div>
      </nav>

      {/* Role Selection Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 lg:py-14 w-full space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Gambian Vehicle Spare-Parts Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Choose your role
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Select how you want to use the platform to continue to your workspace.
          </p>
        </div>

        {/* 4 Cards Grid including the new Delivery Rider section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Vehicle Owner */}
          <div className="bg-[#1c398e] border border-blue-500/40 rounded-3xl p-6 flex flex-col justify-between space-y-5 hover:border-blue-400 transition-all hover:shadow-xl hover:shadow-blue-950/50">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white text-blue-900">
                Vehicle Owner
              </span>
              <h3 className="text-lg font-bold text-white leading-snug">
                Find parts & book mechanic
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Register your vehicle, request quotes from trusted mechanics, and shop verified parts from local dealers in The Gambia.
              </p>
            </div>

            <div className="py-4 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400">
                <Car className="w-10 h-10" />
              </div>
            </div>

            <button
              onClick={() => {
                onSelectRole('mechanic');
                onNavigate('browse_all_parts');
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>Continue as Owner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Mechanic */}
          <div className="bg-[#1c398e] border-2 border-blue-400 rounded-3xl p-6 flex flex-col justify-between space-y-5 hover:border-white transition-all shadow-xl shadow-blue-950/60 ring-2 ring-blue-500/30">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white text-blue-900">
                Mechanic
              </span>
              <h3 className="text-lg font-bold text-white leading-snug">
                Grow your workshop
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Receive repair requests, source parts from multiple dealers, upload voice notes, and manage jobs from one professional workspace.
              </p>
            </div>

            <div className="py-4 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
                <Wrench className="w-10 h-10" />
              </div>
            </div>

            <button
              onClick={() => {
                onSelectRole('mechanic');
                onNavigate('dealers');
              }}
              className="w-full py-3 bg-white hover:bg-slate-100 text-blue-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>Continue as Mechanic</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Dealer */}
          <div className="bg-[#1c398e] border border-blue-500/40 rounded-3xl p-6 flex flex-col justify-between space-y-5 hover:border-blue-400 transition-all hover:shadow-xl hover:shadow-blue-950/50">
            <div className="space-y-3">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white text-blue-900">
                Dealer
              </span>
              <h3 className="text-lg font-bold text-white leading-snug">
                Sell parts to mechanics
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                List your inventory, receive part requests with voice notes, and reach mechanics who need verified spare parts for upcoming jobs.
              </p>
            </div>

            <div className="py-4 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-cyan-300">
                <Disc className="w-10 h-10" />
              </div>
            </div>

            <button
              onClick={() => {
                onSelectRole('dealer');
                onNavigate('dealer_dashboard');
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>Continue as Dealer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: NEW DELIVERY RIDER / COURIER SECTION */}
          <div className="bg-gradient-to-b from-[#173380] to-[#0e2154] border-2 border-emerald-400/80 rounded-3xl p-6 flex flex-col justify-between space-y-5 hover:border-emerald-300 transition-all shadow-xl shadow-emerald-950/40 ring-2 ring-emerald-500/20">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-400 text-slate-950">
                  Delivery Rider
                </span>
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                  Earn in GM
                </span>
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                Deliver parts & earn daily
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Deliver parts from Jeshwang hub & dealers to workshops. Earn D100 - D250 per trip with instant Wave / QMoney mobile payout.
              </p>
            </div>

            <div className="py-4 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                <Truck className="w-10 h-10" />
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setIsRiderModalOpen(true)}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>Sign Up for Delivery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  onSelectRole('delivery_rider');
                  onNavigate('delivery_dashboard');
                }}
                className="w-full py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Demo Rider Workspace</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dedicated Delivery Banner at the bottom of the container */}
        <div className="bg-gradient-to-r from-blue-900/80 via-indigo-900/80 to-blue-950/90 border border-blue-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Bike className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base sm:text-lg font-bold text-white">
                Have a motorcycle, scooter, or dispatch van in The Gambia?
              </h4>
              <p className="text-xs sm:text-sm text-blue-200">
                Join 50+ local dispatch riders serving Jeshwang Spare Parts Hub, Westfield Junction, Kanifing Industrial, and Banjul workshops.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setIsRiderModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Register as Delivery Rider</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-6 border-t border-slate-900 text-center text-xs text-slate-500">
        AutoSpares GM · Serving Jeshwang, Westfield, Kanifing, and Banjul automotive community.
      </footer>

      {/* Rider Sign Up Modal */}
      <DeliveryRiderSignUpModal
        isOpen={isRiderModalOpen}
        onClose={() => setIsRiderModalOpen(false)}
        onSuccess={handleRiderSignUpSuccess}
      />
    </div>
  );
}

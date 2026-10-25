import { Car, Wrench, Disc, ArrowRight, Shield } from 'lucide-react';
import heroImg from '../../assets/images/hero_mechanic_workshop_1791849519785.jpg';

interface ChooseRolePageProps {
  onSelectRole: (role: 'mechanic' | 'dealer' | 'admin') => void;
  onNavigate: (view: string) => void;
}

export function ChooseRolePage({ onSelectRole, onNavigate }: ChooseRolePageProps) {
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

      {/* Top Navbar from Figma */}
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
          <button onClick={() => { onSelectRole('mechanic'); onNavigate('browse_all_parts'); }} className="hover:text-white transition-colors">
            Find Parts
          </button>
          <button onClick={() => { onSelectRole('mechanic'); onNavigate('dealers'); }} className="hover:text-white transition-colors">
            Mechanic
          </button>
          <button onClick={() => alert('Delivery network across Jeshwang, Westfield & Banjul.')} className="hover:text-white transition-colors">
            Delivery
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
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 lg:py-16 w-full space-y-10">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Choose your role
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Select how you want to use the platform and continue to your account.
          </p>
        </div>

        {/* 3 Blue Cards matching Figma Page 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1: Vehicle Owner */}
          <div className="bg-[#1c398e] border border-blue-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-blue-400 transition-all hover:shadow-xl hover:shadow-blue-950/50">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white text-blue-900">
                Vehicle Owner
              </span>
              <h3 className="text-xl font-bold text-white leading-snug">
                Find parts and book a mechanic
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Register your vehicle, request quotes from trusted mechanics, and shop verified parts from local dealers in The Gambia.
              </p>
            </div>

            {/* Illustration / Graphic */}
            <div className="py-6 flex items-center justify-center">
              <div className="w-24 h-24 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400">
                <Car className="w-12 h-12" />
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

          {/* Card 2: Mechanic (Highlight) */}
          <div className="bg-[#1c398e] border-2 border-blue-400 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-white transition-all shadow-xl shadow-blue-950/60 ring-2 ring-blue-500/30">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white text-blue-900">
                Mechanic
              </span>
              <h3 className="text-xl font-bold text-white leading-snug">
                Grow your workshop
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Receive repair requests, source parts from multiple dealers, upload voice notes, and manage jobs from one professional workspace.
              </p>
            </div>

            {/* Illustration / Graphic */}
            <div className="py-6 flex items-center justify-center">
              <div className="w-24 h-24 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
                <Wrench className="w-12 h-12" />
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
          <div className="bg-[#1c398e] border border-blue-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-blue-400 transition-all hover:shadow-xl hover:shadow-blue-950/50">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white text-blue-900">
                Dealer
              </span>
              <h3 className="text-xl font-bold text-white leading-snug">
                Sell parts to local mechanics
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                List your inventory, receive part requests with voice notes, and reach mechanics who need verified spare parts for upcoming jobs.
              </p>
            </div>

            {/* Illustration / Graphic */}
            <div className="py-6 flex items-center justify-center">
              <div className="w-24 h-24 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-cyan-300">
                <Disc className="w-12 h-12" />
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
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-6 border-t border-slate-900 text-center text-xs text-slate-500">
        AutoSpares GM · Serving Jeshwang, Westfield, Kanifing, and Banjul automotive community.
      </footer>
    </div>
  );
}

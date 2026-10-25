import { ArrowRight, Wrench, Package, ShieldCheck, Car, Search, PhoneCall } from 'lucide-react';
import heroImg from '../../assets/images/hero_mechanic_workshop_1791849519785.jpg';
import alternatorImg from '../../assets/images/alternator_assembly_1791849520193.jpg';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onSelectRole: (role: 'mechanic' | 'dealer' | 'admin') => void;
}

export function LandingPage({ onNavigate, onSelectRole }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Navigation from Figma Page 1 */}
      <nav className="bg-slate-900 text-white px-6 lg:px-12 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-sm">
            AS
          </div>
          <span className="font-extrabold text-xl tracking-tight">AutoSpares GM</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button onClick={() => { onSelectRole('mechanic'); onNavigate('browse_all_parts'); }} className="hover:text-white transition-colors">
            Find Parts
          </button>
          <button onClick={() => { onSelectRole('mechanic'); onNavigate('dealers'); }} className="hover:text-white transition-colors">
            Mechanic
          </button>
          <button onClick={() => onNavigate('choose_role')} className="hover:text-white transition-colors">
            Delivery
          </button>
          <button onClick={() => alert('Vehicle VIN decoding & registration engine ready.')} className="hover:text-white transition-colors">
            Vehicle
          </button>
          <button onClick={() => alert('AutoSpares The Gambia — Connecting workshops and auto part dealers in Jeshwang, Westfield & Banjul.')} className="hover:text-white transition-colors">
            About Us
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('choose_role')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            Sign Up / Launch Workspace
          </button>
        </div>
      </nav>

      {/* Hero Section matching Figma Page 1 */}
      <section className="relative bg-slate-950 text-white overflow-hidden">
        {/* Background Image with Dark Overlay Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Mechanic at work"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              EVERYTHING <br />
              YOUR VEHICLE <br />
              NEEDS, <span className="text-emerald-400">IN ONE PLACE.</span>
            </h1>

            <p className="text-lg text-slate-300 font-medium tracking-wide">
              Mechanics · Parts · Delivery
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => {
                  onSelectRole('mechanic');
                  onNavigate('create_request');
                }}
                className="px-6 py-3.5 bg-white text-slate-950 hover:bg-slate-100 font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <span>Request a mechanic</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onSelectRole('mechanic');
                  onNavigate('browse_all_parts');
                }}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <span>Buy parts</span>
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3 Numbered Service Cards Banner matching Figma Page 1 */}
        <div className="relative z-10 bg-[#1c398e] border-t border-blue-900">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-l-2 border-blue-400 pl-4 space-y-2">
              <div className="text-xl font-bold text-blue-200 font-mono">01</div>
              <h2 className="text-base font-bold text-white">Find Quality parts</h2>
              <p className="text-xs text-blue-100 leading-relaxed">
                Get every part for your vehicle need. Ranging from fluids, suspension, engines etc.
              </p>
            </div>

            <div className="border-l-2 border-blue-400 pl-4 space-y-2">
              <div className="text-xl font-bold text-blue-200 font-mono">02</div>
              <h2 className="text-base font-bold text-white">Mechanic</h2>
              <p className="text-xs text-blue-100 leading-relaxed">
                We provide highly trained mechanics with profound experience in their field of specialization.
              </p>
            </div>

            <div className="border-l-2 border-blue-400 pl-4 space-y-2">
              <div className="text-xl font-bold text-blue-200 font-mono">03</div>
              <h2 className="text-base font-bold text-white">Rentals & Fulfilment</h2>
              <p className="text-xs text-blue-100 leading-relaxed">
                Get fully checked vehicles and genuine parts from verified rental dealers and shops in the country.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Rows from Figma Page 1 */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20 space-y-20">
        {/* Row 1: Vehicle registration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-mono text-emerald-400">1HGCM82633A123456</span>
              <span className="text-xs bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-full">VIN Verified</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-amber-400">Vehicle registration</h2>
              <p className="text-xs text-slate-300">
                Owners register vehicles with VIN number. Instant factory specs decoded: Honda Accord 2.4L i-VTEC · 2012.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="bg-slate-800 p-2 rounded-xl">
                <span className="block text-slate-400 text-[10px]">VIN</span>
                <span className="font-semibold text-white">Decoded</span>
              </div>
              <div className="bg-slate-800 p-2 rounded-xl">
                <span className="block text-slate-400 text-[10px]">Service</span>
                <span className="font-semibold text-white">Active</span>
              </div>
              <div className="bg-slate-800 p-2 rounded-xl">
                <span className="block text-slate-400 text-[10px]">History</span>
                <span className="font-semibold text-white">Organized</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Vehicle registration</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Users will be able to register their vehicles using the Vehicle Identification Number (VIN). The system can use a VIN-decoding service to automatically retrieve available vehicle information which will help the owner to keep track of vehicle repair history.
            </p>
            <button
              onClick={() => {
                onSelectRole('mechanic');
                onNavigate('dealers');
              }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              <span>Explore repair records</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Row 2: Mechanic marketplace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 order-2 lg:order-1">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mechanic marketplace</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Find recommended mechanics for the specific problem. We ensure that the mechanics are well experienced in their area of specialization across Jeshwang, Westfield, Kanifing, and Banjul.
            </p>
            <button
              onClick={() => {
                onSelectRole('mechanic');
                onNavigate('requests');
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Open Mechanic Workspace
            </button>
          </div>

          <div className="order-1 lg:order-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  KM
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Kwame Mensah</h4>
                  <p className="text-xs text-slate-500">Mensah Auto Works · 15 jobs completed</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                ★ 4.9 Verified
              </span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
              <img
                src={alternatorImg}
                alt="Part"
                className="w-16 h-16 object-cover rounded-xl border border-slate-200"
              />
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase">Engine Repair</span>
                <p className="text-xs font-semibold text-slate-800">Alternator 90A replacement</p>
                <p className="text-xs text-slate-500">Jeshwang Magazine · Ready in 2h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Dealer Inventory */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-sm text-slate-900">Dealer Inventory</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600">124 Listed items</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="font-medium text-slate-800">Alternator assembly (Corolla)</span>
                <span className="font-bold text-slate-900">D2,500</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="font-medium text-slate-800">Front brake pads (Corolla)</span>
                <span className="font-bold text-slate-900">D3,000</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="font-medium text-slate-800">OEM Radiator cooling unit</span>
                <span className="font-bold text-slate-900">D7,000</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dealer Inventory</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Dealers will be able to manage and record their inventory and help them keep track of their business. Instant stock updates, live mechanic requests matching, and automated offer quotes.
            </p>
            <button
              onClick={() => {
                onSelectRole('dealer');
                onNavigate('dealer_dashboard');
              }}
              className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors"
            >
              Open Dealer Workspace
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 AutoSpares The Gambia. Connecting workshops and auto part dealers.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('choose_role')} className="hover:text-white transition-colors">
              Choose Role
            </button>
            <button onClick={() => { onSelectRole('admin'); onNavigate('admin_dashboard'); }} className="hover:text-white transition-colors">
              Admin Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

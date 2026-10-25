import { useState } from 'react';
import {
  Store,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Car,
  Search,
  Filter,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { DealerProfile, InventoryItem } from '../../types';
import { VEHICLE_DATA, getAvailableModels, getCanonicalMakeName } from '../../data/vehicleData';
import { getPartPhoto } from '../../data/partsCatalog';

interface MechanicDealersPageProps {
  onSelectDealer: (dealer: DealerProfile) => void;
  onSelectPart?: (item: InventoryItem) => void;
  onNavigate: (view: string) => void;
}

export function MechanicDealersPage({
  onSelectDealer,
  onSelectPart,
  onNavigate,
}: MechanicDealersPageProps) {
  const store = useStore();
  const [activeTab, setActiveTab] = useState<'vehicles' | 'dealers'>('vehicles');
  const [selectedMake, setSelectedMake] = useState<string>('All');
  const [selectedModel, setSelectedModel] = useState<string>('All');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [partSearch, setPartSearch] = useState<string>('');

  const allMakes = Object.keys(VEHICLE_DATA);

  // Models available for current selected make
  const availableModels = selectedMake !== 'All' ? getAvailableModels(selectedMake) : [];

  // Filter parts for all vehicle makes & models
  const matchingParts = store.inventory.filter((item) => {
    if (item.status === 'unlisted') return false;

    // Make match
    if (selectedMake !== 'All') {
      const canonicalSelected = getCanonicalMakeName(selectedMake) || selectedMake.toLowerCase();
      const canonicalItem = getCanonicalMakeName(item.compatibleMake) || item.compatibleMake.toLowerCase();
      if (canonicalSelected !== canonicalItem && !item.compatibleMake.toLowerCase().includes(selectedMake.toLowerCase())) {
        return false;
      }
    }

    // Model match
    if (selectedModel !== 'All') {
      const itemModel = item.compatibleModel.toLowerCase();
      const targetModel = selectedModel.toLowerCase();
      if (!itemModel.includes(targetModel) && !targetModel.includes(itemModel)) {
        return false;
      }
    }

    // Search query match
    if (partSearch.trim()) {
      const q = partSearch.toLowerCase();
      const match =
        item.partName.toLowerCase().includes(q) ||
        item.partNumber.toLowerCase().includes(q) ||
        item.compatibleMake.toLowerCase().includes(q) ||
        item.compatibleModel.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Filter dealers
  const dealers = store.dealers.filter((d) => {
    if (filterLocation === 'jeshwang') return d.shopLocation.toLowerCase().includes('jeshwang');
    if (filterLocation === 'serrekunda') {
      return (
        d.shopLocation.toLowerCase().includes('serrekunda') ||
        d.shopLocation.toLowerCase().includes('westfield')
      );
    }
    return true;
  });

  const getMakePartCount = (make: string) => {
    const canonical = getCanonicalMakeName(make) || make.toLowerCase();
    return store.inventory.filter((item) => {
      const c = getCanonicalMakeName(item.compatibleMake) || item.compatibleMake.toLowerCase();
      return c === canonical || item.compatibleMake.toLowerCase().includes(make.toLowerCase());
    }).length;
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Tab Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 tracking-wide uppercase">
              The Gambia Auto Marketplace
            </span>
            <span className="text-xs text-slate-400 font-medium">Jeshwang · Westfield · Banjul</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Vehicle Spare Parts & Dealer Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse authentic vehicle parts with real photographs across all makes & models in The Gambia.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl self-start md:self-auto border border-slate-200/80">
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'vehicles'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Vehicle Parts Catalog ({store.inventory.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('dealers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dealers'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Verified Dealers ({store.dealers.length})</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: ALL VEHICLE PARTS BY MAKE AND MODEL --- */}
      {activeTab === 'vehicles' && (
        <div className="space-y-6">
          {/* Vehicle Make Selector Chips */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Select Vehicle Make ({allMakes.length} Makes Available)
                </h2>
              </div>
              {selectedMake !== 'All' && (
                <button
                  onClick={() => {
                    setSelectedMake('All');
                    setSelectedModel('All');
                  }}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Show All Makes
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              <button
                onClick={() => {
                  setSelectedMake('All');
                  setSelectedModel('All');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
                  selectedMake === 'All'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>All Makes</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${selectedMake === 'All' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-800'}`}>
                  {store.inventory.length}
                </span>
              </button>

              {allMakes.map((make) => {
                const count = getMakePartCount(make);
                const isSelected = selectedMake === make;
                return (
                  <button
                    key={make}
                    onClick={() => {
                      setSelectedMake(make);
                      setSelectedModel('All');
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{make}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-800'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Model Selector Pills when Make is selected */}
            {selectedMake !== 'All' && availableModels.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Models for <span className="font-bold text-slate-800">{selectedMake}</span>:</span>
                  <span>{availableModels.length} models</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setSelectedModel('All')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedModel === 'All'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All {selectedMake} Models
                  </button>
                  {availableModels.map((model) => (
                    <button
                      key={model}
                      onClick={() => setSelectedModel(model)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedModel === model
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Part Search Input */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by part name (alternator, brake pads, radiator, shock, filter, belt...)"
                  value={partSearch}
                  onChange={(e) => setPartSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="text-xs text-slate-500 font-medium shrink-0">
                Found <span className="font-bold text-slate-900">{matchingParts.length}</span> matching parts
              </div>
            </div>
          </div>

          {/* Parts Grid with Right Authentic Photos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingParts.map((item) => {
              const photo = getPartPhoto(item.partName, item.image);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Part Image with Crisp Studio Photography */}
                    <div className="h-48 bg-slate-50/80 flex items-center justify-center p-4 border-b border-slate-100 relative overflow-hidden">
                      <img
                        src={photo}
                        alt={item.partName}
                        className="max-h-40 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-white/90 text-slate-800 shadow-2xs border border-slate-200/60">
                          {item.compatibleMake}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            item.quantity > 0 ? 'bg-emerald-500' : 'bg-red-400'
                          }`}
                        />
                        <span className="text-[10px] font-bold text-slate-600 bg-white/95 px-2 py-0.5 rounded-md shadow-2xs">
                          {item.quantity > 0 ? `${item.quantity} in stock` : 'Out of stock'}
                        </span>
                      </div>
                    </div>

                    {/* Part Details */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                          {item.partName}
                        </h3>
                        <span className="font-mono text-lg font-black text-slate-900 shrink-0">
                          D{item.priceGMD.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          {item.compatibleMake} {item.compatibleModel}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                          {item.compatibleYear}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700">
                          {item.condition}
                        </span>
                      </div>

                      {item.partNumber && (
                        <p className="text-[11px] font-mono text-slate-500">
                          OEM: <span className="font-bold text-slate-700">{item.partNumber}</span>
                        </p>
                      )}

                      <p className="text-xs text-slate-600 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <Store className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate max-w-[140px]">{item.dealerName}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span>{item.dealerLocation.split(',')[0]}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => {
                        if (onSelectPart) {
                          onSelectPart(item);
                        } else {
                          const dealer = store.dealers.find((d) => d.id === item.dealerId);
                          if (dealer) onSelectDealer(dealer);
                        }
                      }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>View Part & Request Pickup</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {matchingParts.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No parts found matching your selection</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No parts currently listed for {selectedMake} {selectedModel !== 'All' ? selectedModel : ''}. You can submit a direct request to all Gambian dealers!
              </p>
              <button
                onClick={() => onNavigate('create_request')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Submit Part Request with Voice Note
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: CHOOSE PREFERRED DEALER SHOPS --- */}
      {activeTab === 'dealers' && (
        <div className="space-y-6">
          {/* Location Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Verified Spare Parts Dealers
              </h2>
              <p className="text-xs text-slate-500">
                Browse dealer shops with physical locations in Jeshwang and Greater Banjul
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl text-xs">
              <button
                onClick={() => setFilterLocation('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filterLocation === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Areas ({store.dealers.length})
              </button>
              <button
                onClick={() => setFilterLocation('jeshwang')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filterLocation === 'jeshwang'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Jeshwang Hub
              </button>
              <button
                onClick={() => setFilterLocation('serrekunda')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filterLocation === 'serrekunda'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Westfield / Serrekunda
              </button>
            </div>
          </div>

          {/* Grid of Dealer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dealers.map((dealer) => {
              // Parts for this dealer with authentic photos
              const dealerParts = store.inventory.filter((item) => item.dealerId === dealer.id);
              const previewPhotos = dealerParts.slice(0, 3).map((item) => getPartPhoto(item.partName, item.image));

              return (
                <div
                  key={dealer.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Dealer Logo Graphic Showcase */}
                    <div className="h-44 bg-slate-100 flex items-center justify-center p-4 border-b border-slate-100 relative overflow-hidden">
                      <div className="w-28 h-28 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center p-3 text-center">
                        <span className="text-xl font-black text-slate-800 tracking-wider">
                          {dealer.logoText || dealer.businessName.slice(0, 5).toUpperCase()}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                          AUTO SPARES
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-xs" title="Open for orders" />
                        <span className="text-[10px] font-bold text-slate-600 bg-white/90 px-2 py-0.5 rounded-md">
                          {dealerParts.length} parts listed
                        </span>
                      </div>
                    </div>

                    {/* Dealer Info */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-slate-900 text-base uppercase tracking-tight">
                          {dealer.businessName}
                        </h3>
                        {dealer.verificationStatus === 'approved' && (
                          <span className="text-blue-600" title="Verified dealer">
                            <CheckCircle2 className="w-4 h-4 fill-blue-50" />
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Location: {dealer.shopLocation.split(',')[0]}</span>
                      </p>

                      <p className="text-xs text-slate-600 font-medium">
                        {dealer.specialization}
                      </p>

                      {/* Mini Stock Photo Previews */}
                      {previewPhotos.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                            Stock Previews:
                          </span>
                          <div className="flex items-center gap-2">
                            {previewPhotos.map((pUrl, i) => (
                              <div
                                key={i}
                                className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center overflow-hidden"
                              >
                                <img src={pUrl} alt="Part" className="w-full h-full object-contain" />
                              </div>
                            ))}
                            {dealerParts.length > 3 && (
                              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-600">
                                +{dealerParts.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* View Dealer Button */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => onSelectDealer(dealer)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Browse {dealer.businessName}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

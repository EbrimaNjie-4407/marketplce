import { useState, useEffect } from 'react';
import { Search, Filter, Store, MapPin, CheckCircle2, Sparkles, X, Car } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { InventoryItem } from '../../types';
import { matchPartWithCategory, QUICK_FILTERS, getCanonicalMakeName, VEHICLE_DATA, getAvailableModels } from '../../data/vehicleData';
import { getPartPhoto } from '../../data/partsCatalog';

interface BrowseAllPartsPageProps {
  onSelectPart: (item: InventoryItem) => void;
  onNavigateToDealer: (dealerId: string) => void;
}

export function BrowseAllPartsPage({ onSelectPart, onNavigateToDealer: _onNavigateToDealer }: BrowseAllPartsPageProps) {
  const store = useStore();
  const [searchTerm, setSearchTerm] = useState(store.searchQuery.part);
  const [makeFilter, setMakeFilter] = useState(store.searchQuery.make || 'All');
  const [modelFilter, setModelFilter] = useState(store.searchQuery.model || '');
  const [conditionFilter, setConditionFilter] = useState('All');

  // Keep in sync with store search query when header inputs or quick filters change
  useEffect(() => {
    setSearchTerm(store.searchQuery.part);
    if (store.searchQuery.make) {
      setMakeFilter(store.searchQuery.make);
    }
    if (store.searchQuery.model) {
      setModelFilter(store.searchQuery.model);
    }
  }, [store.searchQuery.part, store.searchQuery.make, store.searchQuery.model]);

  // Identify if searchTerm matches a quick filter category
  const activeQuickFilter = QUICK_FILTERS.find(
    (f) =>
      f.label.toLowerCase() === searchTerm.toLowerCase() ||
      f.id.toLowerCase() === searchTerm.toLowerCase() ||
      searchTerm.toLowerCase().includes(f.shortLabel.toLowerCase())
  );

  const filteredParts = store.inventory.filter((item) => {
    if (item.status === 'unlisted') return false;

    // Search term matching
    let matchesSearch = true;
    if (searchTerm) {
      if (activeQuickFilter) {
        matchesSearch = matchPartWithCategory(item, activeQuickFilter.id);
      } else {
        matchesSearch =
          item.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.compatibleMake.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.compatibleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase());
      }
    }

    // Vehicle make matching (supports Mercedes-Benz vs Mercedes variations)
    let matchesMake = true;
    if (makeFilter && makeFilter !== 'All') {
      const canonicalFilter = getCanonicalMakeName(makeFilter) || makeFilter.toLowerCase();
      const canonicalItem = getCanonicalMakeName(item.compatibleMake) || item.compatibleMake.toLowerCase();
      matchesMake = canonicalFilter === canonicalItem || item.compatibleMake.toLowerCase().includes(makeFilter.toLowerCase());
    }

    // Vehicle model matching if specified
    let matchesModel = true;
    if (modelFilter && modelFilter.trim() !== '') {
      matchesModel =
        item.compatibleModel.toLowerCase().includes(modelFilter.toLowerCase()) ||
        modelFilter.toLowerCase().includes(item.compatibleModel.toLowerCase());
    }

    const matchesCondition = conditionFilter === 'All' || item.condition.toLowerCase().includes(conditionFilter.toLowerCase());

    return matchesSearch && matchesMake && matchesModel && matchesCondition;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Marketplace Spare Parts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search verified active inventory across all approved dealers in The Gambia.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredParts.length}</span> listed parts
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search parts, numbers, models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={makeFilter}
            onChange={(e) => {
              setMakeFilter(e.target.value);
              setModelFilter('');
            }}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Vehicle Makes ({Object.keys(VEHICLE_DATA).length})</option>
            {Object.keys(VEHICLE_DATA).map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>

          {makeFilter !== 'All' && (
            <select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All {makeFilter} Models</option>
              {getAvailableModels(makeFilter).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          )}

          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Conditions</option>
            <option value="New">New OEM</option>
            <option value="Used">Used · Tested</option>
          </select>
        </div>
      </div>

      {/* Active Quick Filter Badge if active */}
      {(activeQuickFilter || searchTerm || (makeFilter && makeFilter !== 'All')) && (
        <div className="flex flex-wrap items-center justify-between gap-2 bg-blue-50/70 border border-blue-200/60 rounded-xl px-4 py-2 text-xs">
          <div className="flex items-center gap-2 text-blue-900 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {activeQuickFilter ? (
                <>
                  Quick Filter: <span className="font-bold text-blue-700">{activeQuickFilter.label}</span>
                  {activeQuickFilter.id === 'engine_parts' && ' (Alternators, starters, belts, radiators, spark plugs & timing)'}
                  {activeQuickFilter.id === 'suspension_parts' && ' (Stabilizers, shock absorbers & links)'}
                  {activeQuickFilter.id === 'sensors' && ' (O2, MAF, ABS & position sensors)'}
                  {activeQuickFilter.id === 'oil_filters' && ' (Oil filters & filter elements)'}
                </>
              ) : searchTerm ? (
                <>
                  Filtered by: <span className="font-bold text-blue-700">"{searchTerm}"</span>
                </>
              ) : null}
              {makeFilter && makeFilter !== 'All' && (
                <span className="text-blue-800 ml-1">
                  for <span className="font-bold">{makeFilter}</span>
                  {modelFilter && <span> {modelFilter}</span>}
                </span>
              )}
            </span>
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setMakeFilter('All');
              setModelFilter('');
              store.searchQuery.part = '';
              store.searchQuery.make = '';
              store.searchQuery.model = '';
            }}
            className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Clear filters</span>
          </button>
        </div>
      )}

      {/* Grid of Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParts.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Image Showcase */}
              <div className="h-44 bg-slate-50 flex items-center justify-center p-4 border-b border-slate-100 relative">
                <img
                  src={getPartPhoto(item.partName, item.image)}
                  alt={item.partName}
                  className="max-h-36 max-w-full object-contain"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      item.quantity > 0 ? 'bg-emerald-500' : 'bg-red-400'
                    }`}
                  />
                  <span className="text-[10px] font-bold text-slate-600 bg-white/90 px-2 py-0.5 rounded-md shadow-2xs">
                    {item.quantity > 0 ? `${item.quantity} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>

              {/* Information */}
              <div className="p-5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-extrabold text-slate-900 text-base">{item.partName}</h3>
                  <span className="font-mono text-lg font-black text-slate-900 shrink-0">
                    D{item.priceGMD.toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  {item.compatibleMake} {item.compatibleModel} · {item.compatibleYear}
                  {item.partNumber && ` · ${item.partNumber}`}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Store className="w-3.5 h-3.5 text-blue-600" />
                    {item.dealerName}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                    <MapPin className="w-3 h-3" />
                    {item.dealerLocation.split(',')[0]}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => onSelectPart(item)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <span>View Details & Request</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

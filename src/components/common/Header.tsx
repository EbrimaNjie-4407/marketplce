import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Shield,
  Wrench,
  Store,
  Layers,
  ChevronDown,
  Check,
  Droplet,
  Cog,
  Activity,
  Zap,
  Disc,
  Wind,
  X,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { marketplaceStore } from '../../services/store';
import { UserRole } from '../../types';
import {
  VEHICLE_DATA,
  COMMON_PARTS,
  QUICK_FILTERS,
  QuickFilter,
  getAvailableModels,
  getCanonicalMakeName,
} from '../../data/vehicleData';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Header({ currentView: _currentView, onNavigate }: HeaderProps) {
  const store = useStore();
  const [partQuery, setPartQuery] = useState(store.searchQuery.part);
  const [makeQuery, setMakeQuery] = useState(store.searchQuery.make);
  const [modelQuery, setModelQuery] = useState(store.searchQuery.model);
  const [yearQuery, setYearQuery] = useState(store.searchQuery.year);
  const [vinQuery, setVinQuery] = useState(store.searchQuery.vin);
  const [isPartsDropdownOpen, setIsPartsDropdownOpen] = useState(false);
  const [isMakeDropdownOpen, setIsMakeDropdownOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const makeDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  const availableModels = getAvailableModels(makeQuery);

  const handleSelectMake = (makeName: string) => {
    setMakeQuery(makeName);
    setIsMakeDropdownOpen(false);

    // Update model to the first model under this make so it is always known under this make
    const models = getAvailableModels(makeName);
    if (models.length > 0) {
      setModelQuery(models[0]);
    } else {
      setModelQuery('');
    }
    // Open model dropdown so user can pick their desired model
    setIsModelDropdownOpen(true);
  };

  const handleMakeInputChange = (val: string) => {
    setMakeQuery(val);
    const canonical = getCanonicalMakeName(val);
    if (canonical) {
      const models = getAvailableModels(canonical);
      if (models.length > 0 && !models.some((m) => m.toLowerCase() === modelQuery.toLowerCase())) {
        setModelQuery(models[0]);
      }
    }
  };

  const handleSelectModel = (modelName: string) => {
    setModelQuery(modelName);
    setIsModelDropdownOpen(false);
  };

  // Active quick filter identifier
  const activeQuickFilter = QUICK_FILTERS.find(
    (f) =>
      f.label.toLowerCase() === partQuery.toLowerCase() ||
      f.id.toLowerCase() === partQuery.toLowerCase() ||
      partQuery.toLowerCase().includes(f.shortLabel.toLowerCase())
  );

  const handleQuickFilterClick = (filter: QuickFilter) => {
    if (activeQuickFilter?.id === filter.id) {
      // Toggle off
      setPartQuery('');
      marketplaceStore.setSearchQuery({
        part: '',
        make: makeQuery,
        model: modelQuery,
        year: yearQuery,
        vin: vinQuery,
      });
      if (role === 'mechanic') {
        onNavigate('browse_all_parts');
      }
    } else {
      setPartQuery(filter.label);
      marketplaceStore.setSearchQuery({
        part: filter.label,
        make: makeQuery,
        model: modelQuery,
        year: yearQuery,
        vin: vinQuery,
      });
      if (role === 'mechanic') {
        onNavigate('browse_all_parts');
      } else if (role === 'dealer') {
        onNavigate('dealer_inventory');
      } else {
        onNavigate('admin_listings');
      }
    }
  };

  const handleClearAllSearch = () => {
    setPartQuery('');
    setMakeQuery('');
    setModelQuery('');
    setYearQuery('');
    setVinQuery('');
    marketplaceStore.setSearchQuery({
      part: '',
      make: '',
      model: '',
      year: '',
      vin: '',
    });
  };

  const getFilterIcon = (id: string) => {
    switch (id) {
      case 'oil_filters':
        return Droplet;
      case 'engine_parts':
        return Cog;
      case 'suspension_parts':
        return Activity;
      case 'sensors':
        return Zap;
      case 'braking_system':
        return Disc;
      case 'cooling_ac':
        return Wind;
      default:
        return Sparkles;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsPartsDropdownOpen(false);
      }
      if (makeDropdownRef.current && !makeDropdownRef.current.contains(target)) {
        setIsMakeDropdownOpen(false);
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(target)) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const role = store.currentRole;
  const unreadCount = store.notifications.filter((n) => !n.read && n.targetRole === role).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    marketplaceStore.setSearchQuery({
      part: partQuery,
      make: makeQuery,
      model: modelQuery,
      year: yearQuery,
      vin: vinQuery,
    });
    if (role === 'mechanic') {
      onNavigate('browse_all_parts');
    } else if (role === 'dealer') {
      onNavigate('dealer_inventory');
    } else {
      onNavigate('admin_listings');
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    marketplaceStore.setRole(newRole);
    if (newRole === 'mechanic') onNavigate('dealers');
    if (newRole === 'dealer') onNavigate('dealer_dashboard');
    if (newRole === 'admin') onNavigate('admin_dashboard');
  };

  const getWorkspaceTitle = () => {
    switch (role) {
      case 'mechanic':
        return 'MECHANIC WORKSPACE';
      case 'dealer':
        return 'DEALER WORKSPACE';
      case 'admin':
        return 'ADMIN WORKSPACE';
      default:
        return 'VEHICLE PORTAL';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner / Role Switcher for seamless testing */}
      <div className="bg-slate-900 text-slate-200 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            The Gambia Vehicle Spare-Parts Hub
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden md:inline">
            Active: <span className="text-white font-medium">{store.currentUser.name}</span> ({store.currentUser.workshopName || store.currentUser.role})
          </span>
        </div>

        {/* Quick Role Switcher Buttons matching Figma flows */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onNavigate('landing')}
            className="px-2 py-0.5 rounded text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Landing
          </button>
          <button
            onClick={() => onNavigate('choose_role')}
            className="px-2 py-0.5 rounded text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Roles
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => handleRoleChange('mechanic')}
            className={`px-2.5 py-0.5 rounded text-xs flex items-center gap-1 font-medium transition-colors ${
              role === 'mechanic' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Wrench className="w-3 h-3" /> Mechanic
          </button>
          <button
            onClick={() => handleRoleChange('dealer')}
            className={`px-2.5 py-0.5 rounded text-xs flex items-center gap-1 font-medium transition-colors ${
              role === 'dealer' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Store className="w-3 h-3" /> Dealer
          </button>
          <button
            onClick={() => handleRoleChange('admin')}
            className={`px-2.5 py-0.5 rounded text-xs flex items-center gap-1 font-medium transition-colors ${
              role === 'admin' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3 h-3" /> Admin
          </button>
        </div>
      </div>

      {/* Main Search & Navigation Bar matching Figma design with Quick Search Section */}
      <div className="px-4 lg:px-6 pt-3 pb-2.5 flex flex-col gap-2.5 border-b border-slate-100">
        <div className="flex items-center justify-between gap-4">
          {/* Logo and Workspace Label */}
          <div
            onClick={() => onNavigate(role === 'mechanic' ? 'dealers' : role === 'dealer' ? 'dealer_dashboard' : 'admin_dashboard')}
            className="flex flex-col cursor-pointer shrink-0"
          >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center font-black text-sm">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">AutoSpares</span>
          </div>
          <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            {getWorkspaceTitle()}
          </span>
        </div>

        {/* Global Search Bar from Figma */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-4xl items-center bg-slate-100 rounded-xl p-1 gap-1 border border-slate-200"
        >
          {/* Part name or number with dropdown arrow for common parts */}
          <div ref={dropdownRef} className="relative flex-1 min-w-[210px]">
            <input
              type="text"
              placeholder="Part name or number"
              value={partQuery}
              onChange={(e) => setPartQuery(e.target.value)}
              onFocus={() => setIsPartsDropdownOpen(true)}
              className="w-full bg-white pl-3 pr-8 py-1.5 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            />
            <button
              type="button"
              onClick={() => setIsPartsDropdownOpen((prev) => !prev)}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors"
              title="Common parts: Alternator, Starter, Stabilizer, Serpentine belt..."
              aria-label="Toggle common parts list"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isPartsDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
            </button>

            {/* Common parts dropdown menu */}
            {isPartsDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-72 bg-white rounded-xl border border-slate-200 shadow-xl z-50 py-1.5 text-xs animate-fadeIn max-h-80 overflow-y-auto">
                <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Common Parts</span>
                  <span className="text-[10px] text-blue-600 font-normal">Quick select</span>
                </div>
                <div className="py-1">
                  {COMMON_PARTS.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        setPartQuery(item.name);
                        setIsPartsDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 flex items-center justify-between group transition-colors"
                    >
                      <div>
                        <span className="font-semibold text-slate-800 group-hover:text-blue-700 block">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 group-hover:text-blue-600 bg-slate-50 group-hover:bg-blue-100/60 px-1.5 py-0.5 rounded">
                        #{item.code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Vehicle Make with Dropdown Arrow */}
          <div ref={makeDropdownRef} className="relative w-36">
            <input
              type="text"
              placeholder="Vehicle make"
              value={makeQuery}
              onChange={(e) => handleMakeInputChange(e.target.value)}
              onClick={() => setIsMakeDropdownOpen(true)}
              onFocus={() => setIsMakeDropdownOpen(true)}
              className="w-full bg-white pl-3 pr-7 py-1.5 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            />
            <button
              type="button"
              onClick={() => setIsMakeDropdownOpen((prev) => !prev)}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors"
              title="Choose vehicle make"
              aria-label="Toggle vehicle make list"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMakeDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
            </button>

            {/* Vehicle make dropdown menu */}
            {isMakeDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-52 bg-white rounded-xl border border-slate-200 shadow-xl z-50 py-1.5 text-xs animate-fadeIn max-h-72 overflow-y-auto">
                <div className="px-3 py-1 border-b border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Vehicle Makes</span>
                  <span className="text-[9px] text-blue-600 font-normal">Select make</span>
                </div>
                <div className="py-1">
                  {Object.keys(VEHICLE_DATA).map((makeName) => {
                    const isSelected = makeQuery.toLowerCase() === makeName.toLowerCase() ||
                      (getCanonicalMakeName(makeQuery) === makeName);
                    return (
                      <button
                        key={makeName}
                        type="button"
                        onClick={() => handleSelectMake(makeName)}
                        className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-blue-50 transition-colors flex items-center justify-between ${
                          isSelected ? 'text-blue-700 font-bold bg-blue-50/70' : 'text-slate-800'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {isSelected && <Check className="w-3 h-3 text-blue-600" />}
                          {makeName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {VEHICLE_DATA[makeName].length} models
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Model with Dropdown Arrow (dynamically scoped under selected make) */}
          <div ref={modelDropdownRef} className="relative w-36">
            <input
              type="text"
              placeholder={makeQuery ? `${makeQuery} Model` : 'Vehicle Model'}
              value={modelQuery}
              onChange={(e) => setModelQuery(e.target.value)}
              onClick={() => setIsModelDropdownOpen(true)}
              onFocus={() => setIsModelDropdownOpen(true)}
              className="w-full bg-white pl-3 pr-7 py-1.5 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            />
            <button
              type="button"
              onClick={() => setIsModelDropdownOpen((prev) => !prev)}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors"
              title="Choose vehicle model"
              aria-label="Toggle vehicle model list"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isModelDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
            </button>

            {/* Model dropdown menu */}
            {isModelDropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-50 py-1.5 text-xs animate-fadeIn max-h-72 overflow-y-auto">
                <div className="px-3 py-1 border-b border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>{makeQuery ? `${getCanonicalMakeName(makeQuery) || makeQuery} Models` : 'Vehicle Models'}</span>
                  <span className="text-[9px] text-blue-600 font-normal">Select model</span>
                </div>
                <div className="py-1">
                  {availableModels.length > 0 ? (
                    availableModels.map((modelName) => {
                      const isSelected = modelQuery.toLowerCase() === modelName.toLowerCase();
                      return (
                        <button
                          key={modelName}
                          type="button"
                          onClick={() => handleSelectModel(modelName)}
                          className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-blue-50 transition-colors flex items-center justify-between ${
                            isSelected ? 'text-blue-700 font-bold bg-blue-50/70' : 'text-slate-800'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            {isSelected && <Check className="w-3 h-3 text-blue-600" />}
                            {modelName}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3 py-2 text-slate-400 text-[11px] italic">
                      Pick a make (e.g. Mercedes-Benz, Toyota) to choose a model
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="Year"
            value={yearQuery}
            onChange={(e) => setYearQuery(e.target.value)}
            className="w-20 bg-white px-3 py-1.5 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="VIN (optional)"
            value={vinQuery}
            onChange={(e) => setVinQuery(e.target.value)}
            className="w-28 bg-white px-3 py-1.5 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </form>

        {/* Right Action zone: Notification Bell */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (role === 'mechanic') onNavigate('notifications');
              if (role === 'dealer') onNavigate('dealer_notifications');
              if (role === 'admin') onNavigate('admin_requests');
            }}
            className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Quick Search Section with Quick Filter Buttons */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1 shrink-0">
            <SlidersHorizontal className="w-3 h-3 text-blue-600" />
            <span>Quick search:</span>
          </span>

          {/* Quick Filter Buttons */}
          {QUICK_FILTERS.map((filter) => {
            const isActive = activeQuickFilter?.id === filter.id;
            const IconComponent = getFilterIcon(filter.id);

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => handleQuickFilterClick(filter)}
                title={`${filter.label} — ${filter.description}`}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/30'
                    : 'bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200/80'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{filter.label}</span>
                {isActive && <Check className="w-3 h-3 text-white ml-0.5" />}
              </button>
            );
          })}
        </div>

        {/* Quick Scope/Vehicle Badge or Clear All Filter Action */}
        <div className="flex items-center gap-2 text-xs shrink-0">
          {makeQuery ? (
            <span className="text-[11px] text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>
                Showing for: <strong className="text-slate-900">{makeQuery}{modelQuery ? ` · ${modelQuery}` : ''}</strong>
              </span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 hidden lg:inline">
              Select vehicle make & model to scope parts directly
            </span>
          )}

          {(activeQuickFilter || partQuery || makeQuery) && (
            <button
              type="button"
              onClick={handleClearAllSearch}
              className="text-[11px] font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
              title="Reset search filters"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  </header>
  );
}

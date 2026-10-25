import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Send, ArrowLeft, CheckCircle2, ChevronDown, Check } from 'lucide-react';
import { marketplaceStore } from '../../services/store';
import { VoiceRecorder, VoiceNoteMetadata } from '../common/VoiceRecorder';
import { VEHICLE_DATA, getAvailableModels, getCanonicalMakeName } from '../../data/vehicleData';
import alternatorImg from '../../assets/images/alternator_assembly_1791849520193.jpg';

interface CreatePartRequestViewProps {
  onBack: () => void;
  onRequestSubmitted: (reqId: string) => void;
}

export function CreatePartRequestView({ onBack, onRequestSubmitted }: CreatePartRequestViewProps) {
  const [vehicleMake, setVehicleMake] = useState('Toyota');
  const [vehicleModel, setVehicleModel] = useState('Corolla');
  const [vehicleYear, setVehicleYear] = useState('2014');
  const [partName, setPartName] = useState('Alternator assembly');
  const [partNumber, setPartNumber] = useState('27060-0T140');
  const [preferredCondition, setPreferredCondition] = useState<'New' | 'Used' | 'Either · New or used'>('Either · New or used');
  const [notes, setNotes] = useState('Must fit the 1.8L engine. Please share a clear photo of connector and confirm bench testing.');
  const [uploadedImage, setUploadedImage] = useState<string>(alternatorImg);
  const [voiceNoteData, setVoiceNoteData] = useState<VoiceNoteMetadata | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const [isMakeDropdownOpen, setIsMakeDropdownOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const makeDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  const availableModels = getAvailableModels(vehicleMake);

  const handleSelectMake = (makeName: string) => {
    setVehicleMake(makeName);
    setIsMakeDropdownOpen(false);

    const models = getAvailableModels(makeName);
    if (models.length > 0) {
      setVehicleModel(models[0]);
    } else {
      setVehicleModel('');
    }
    setIsModelDropdownOpen(true);
  };

  const handleMakeChange = (val: string) => {
    setVehicleMake(val);
    const canonical = getCanonicalMakeName(val);
    if (canonical) {
      const models = getAvailableModels(canonical);
      if (models.length > 0 && !models.some((m) => m.toLowerCase() === vehicleModel.toLowerCase())) {
        setVehicleModel(models[0]);
      }
    }
  };

  const handleSelectModel = (modelName: string) => {
    setVehicleModel(modelName);
    setIsModelDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const created = marketplaceStore.createRequest({
      vehicleMake,
      vehicleModel,
      vehicleYear,
      partName,
      partNumber,
      preferredCondition,
      notes,
      image: uploadedImage,
      voiceNote: voiceNoteData || undefined,
    });

    setSentSuccess(true);
    setTimeout(() => {
      setIsSending(false);
      onRequestSubmitted(created.id);
    }, 600);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back</span>
      </button>

      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          Make a part request that will be sent across our trusted dealers
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Broadcast your vehicle parts need directly to verified workshops and importers in Jeshwang & Greater Banjul.
        </p>
      </div>

      {sentSuccess ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-emerald-950">Broadcast Delivered!</h3>
          <p className="text-xs text-emerald-800 max-w-md mx-auto">
            Your request and voice note have been dispatched to 8 verified spare parts dealers. You will receive quotes shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left 5 Cols: Upload Image Square matching Figma Page 7 */}
            <div className="md:col-span-4 space-y-3">
              <label className="text-xs font-bold text-slate-700 block">Part reference photo</label>
              <div className="relative aspect-square w-full rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 hover:border-blue-500 flex flex-col items-center justify-center p-4 overflow-hidden group transition-colors">
                {uploadedImage ? (
                  <>
                    <img
                      src={uploadedImage}
                      alt="Part Preview"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-xs text-white font-bold bg-black/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" /> Replace photo
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 block">upload image</span>
                    <span className="text-[10px] text-slate-400 block">JPG, PNG up to 10MB</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Snap or upload a photo showing serial labels, connector plugs, or brackets.
              </p>
            </div>

            {/* Right 8 Cols: Form inputs from Figma Page 7 */}
            <div className="md:col-span-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Vehicle Make with Dropdown */}
                <div ref={makeDropdownRef} className="space-y-1.5 relative">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Enter vehicle name (make):</span>
                    <span className="text-[10px] text-blue-600 font-normal">Dropdown</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={vehicleMake}
                      onChange={(e) => handleMakeChange(e.target.value)}
                      onClick={() => setIsMakeDropdownOpen(true)}
                      onFocus={() => setIsMakeDropdownOpen(true)}
                      placeholder="e.g. Mercedes-Benz or Toyota"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-4 pr-9 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setIsMakeDropdownOpen((prev) => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-200/50 transition-colors"
                      title="Choose vehicle make"
                      aria-label="Toggle vehicle make dropdown"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMakeDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
                    </button>
                  </div>

                  {isMakeDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1.5 w-full bg-white rounded-xl border border-slate-200 shadow-xl z-50 py-1.5 text-xs animate-fadeIn max-h-64 overflow-y-auto">
                      <div className="px-3 py-1 border-b border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>Select Make</span>
                        <span className="text-[9px] text-blue-600 font-normal">Click to choose</span>
                      </div>
                      <div className="py-1">
                        {Object.keys(VEHICLE_DATA).map((makeName) => {
                          const isSelected = vehicleMake.toLowerCase() === makeName.toLowerCase() ||
                            getCanonicalMakeName(vehicleMake) === makeName;
                          return (
                            <button
                              key={makeName}
                              type="button"
                              onClick={() => handleSelectMake(makeName)}
                              className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-blue-50 transition-colors flex items-center justify-between ${
                                isSelected ? 'text-blue-700 font-bold bg-blue-50/70' : 'text-slate-800'
                              }`}
                            >
                              <span className="flex items-center gap-1.5">
                                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
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

                {/* Vehicle Model with Dropdown */}
                <div ref={modelDropdownRef} className="space-y-1.5 relative">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Enter vehicle model:</span>
                    <span className="text-[10px] text-blue-600 font-normal">
                      {vehicleMake ? `${getCanonicalMakeName(vehicleMake) || vehicleMake} models` : 'Dropdown'}
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      onClick={() => setIsModelDropdownOpen(true)}
                      onFocus={() => setIsModelDropdownOpen(true)}
                      placeholder="e.g. GL450, ML350, C200..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-4 pr-9 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setIsModelDropdownOpen((prev) => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-200/50 transition-colors"
                      title="Choose vehicle model"
                      aria-label="Toggle vehicle model dropdown"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isModelDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
                    </button>
                  </div>

                  {isModelDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1.5 w-full bg-white rounded-xl border border-slate-200 shadow-xl z-50 py-1.5 text-xs animate-fadeIn max-h-64 overflow-y-auto">
                      <div className="px-3 py-1 border-b border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>{vehicleMake ? `${getCanonicalMakeName(vehicleMake) || vehicleMake} Models` : 'Vehicle Models'}</span>
                        <span className="text-[9px] text-blue-600 font-normal">Select model</span>
                      </div>
                      <div className="py-1">
                        {availableModels.length > 0 ? (
                          availableModels.map((modelName) => {
                            const isSelected = vehicleModel.toLowerCase() === modelName.toLowerCase();
                            return (
                              <button
                                key={modelName}
                                type="button"
                                onClick={() => handleSelectModel(modelName)}
                                className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-blue-50 transition-colors flex items-center justify-between ${
                                  isSelected ? 'text-blue-700 font-bold bg-blue-50/70' : 'text-slate-800'
                                }`}
                              >
                                <span className="flex items-center gap-1.5">
                                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                                  {modelName}
                                </span>
                              </button>
                            );
                          })
                        ) : (
                          <div className="px-3 py-3 text-slate-400 text-[11px] italic text-center">
                            Pick a vehicle make above (e.g. Mercedes-Benz, Toyota) to see models
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Enter part name:</label>
                  <input
                    type="text"
                    required
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    placeholder="e.g. Alternator assembly"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Enter vehicle year:</label>
                  <input
                    type="text"
                    required
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(e.target.value)}
                    placeholder="e.g. 2014"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Real Audio Voice Note Recorder from Figma Page 7 using MediaRecorder API */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Send voice note:</label>
                <div className="w-full">
                  <VoiceRecorder
                    onAudioRecorded={(meta) => setVoiceNoteData(meta)}
                    onAudioRemoved={() => setVoiceNoteData(null)}
                    initialAudioUrl={voiceNoteData?.audioUrl}
                    initialDuration={voiceNoteData?.durationSeconds}
                  />
                </div>
              </div>

              {/* Preferred condition dropdown from Figma Page 7 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Preferred condition :</label>
                  <select
                    value={preferredCondition}
                    onChange={(e) => setPreferredCondition(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Either · New or used">Either · New or used</option>
                    <option value="New">Brand New OEM</option>
                    <option value="Used">Used · Tested</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Part number (optional):</label>
                  <input
                    type="text"
                    value={partNumber}
                    onChange={(e) => setPartNumber(e.target.value)}
                    placeholder="e.g. 27060-0T140"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Notes & specifications:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Engine displacement, connector pin count, special requirements..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Action buttons from Figma Page 7 */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
            >
              Edit Request
            </button>

            <button
              type="submit"
              disabled={isSending}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Broadcasting...' : 'Send to 8 Dealers'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

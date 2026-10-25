import React, { useState } from 'react';
import { ArrowLeft, Upload, Check, AlertCircle, Info, ChevronDown, CheckCircle2 } from 'lucide-react';
import { marketplaceStore } from '../../services/store';
import { InventoryItem } from '../../types';
import { VEHICLE_DATA, getAvailableModels, getCanonicalMakeName } from '../../data/vehicleData';
import { decodeVin, SAMPLE_VINS } from '../../services/vinDecoder';
import alternatorImg from '../../assets/images/alternator_assembly_1791849520193.jpg';

interface DealerAddPartPageProps {
  editItem?: InventoryItem | null;
  onBack: () => void;
  onSaved: () => void;
}

export function DealerAddPartPage({ editItem, onBack, onSaved }: DealerAddPartPageProps) {
  const [partName, setPartName] = useState(editItem ? editItem.partName : 'Alternator assembly');
  const [partNumber, setPartNumber] = useState(editItem ? editItem.partNumber : '27060-0T140');
  const [vinInput, setVinInput] = useState('');
  const [vinDecodedMsg, setVinDecodedMsg] = useState('');
  const [compatibleMake, setCompatibleMake] = useState(editItem ? editItem.compatibleMake : 'Toyota');
  const [compatibleModel, setCompatibleModel] = useState(editItem ? editItem.compatibleModel : 'Corolla');
  const [compatibleYear, setCompatibleYear] = useState(editItem ? editItem.compatibleYear : '2014');
  const [compatibleEngine, setCompatibleEngine] = useState(editItem?.compatibleEngine || '1.8L petrol');
  const [condition, setCondition] = useState<InventoryItem['condition']>(editItem ? editItem.condition : 'Used · tested');

  const handleDecodeVin = (val: string) => {
    const result = decodeVin(val);
    if (result && result.make) {
      setCompatibleMake(result.make);
      if (result.model) setCompatibleModel(result.model);
      if (result.year) setCompatibleYear(result.year);
      if (result.engine) setCompatibleEngine(result.engine);
      setVinDecodedMsg(`Auto-filled: ${result.year} ${result.make} ${result.model}`);
      setTimeout(() => setVinDecodedMsg(''), 5000);
    }
  };

  const handleVinInputChange = (val: string) => {
    const upper = val.toUpperCase();
    setVinInput(upper);
    if (upper.trim().length >= 8) {
      handleDecodeVin(upper);
    }
  };
  const [priceGMD, setPriceGMD] = useState(editItem ? editItem.priceGMD.toString() : '2500');
  const [quantity, setQuantity] = useState(editItem ? editItem.quantity.toString() : '2');
  const [availability, setAvailability] = useState<'available' | 'out_of_stock'>(
    editItem ? editItem.status === 'out_of_stock' ? 'out_of_stock' : 'available' : 'available'
  );
  const [description, setDescription] = useState(
    editItem ? editItem.description : '90A alternator. Tested and ready for pickup. Connector matches 27060-0T140.'
  );
  const [imagePreview, setImagePreview] = useState<string>(editItem?.image || alternatorImg);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(priceGMD) || 2500;
    const parsedQty = parseInt(quantity, 10) || 1;

    if (editItem) {
      marketplaceStore.updateInventoryItem(editItem.id, {
        partName,
        partNumber,
        compatibleMake,
        compatibleModel,
        compatibleYear,
        compatibleEngine,
        condition,
        priceGMD: parsedPrice,
        quantity: parsedQty,
        status: availability,
        description,
        image: imagePreview,
      });
    } else {
      marketplaceStore.addInventoryItem({
        dealerId: 'dealer_burgi',
        dealerName: 'BURGI SPARE PARTS',
        dealerLocation: 'Jeshwang, Serrekunda',
        partName,
        partNumber,
        compatibleMake,
        compatibleModel,
        compatibleYear,
        compatibleEngine,
        condition,
        priceGMD: parsedPrice,
        quantity: parsedQty,
        status: availability,
        description,
        image: imagePreview,
      });
    }

    onSaved();
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header matching Figma Page 12 */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-semibold mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Inventory</span>
        </button>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          {editItem ? 'Edit listing' : 'Add a part'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Create an inventory listing with accurate compatibility and stock details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Part information Form */}
        <form onSubmit={handleSave} className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900">Part information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Part name *</label>
              <input
                type="text"
                required
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                placeholder="Alternator assembly"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Part number *</label>
              <input
                type="text"
                required
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                placeholder="27060-0T140"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Optional VIN Decoder for quick vehicle matching */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-mono font-bold">VIN</span>
                <span>Auto-fill compatibility using vehicle VIN:</span>
              </label>
              {vinDecodedMsg && (
                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {vinDecodedMsg}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter 17-digit VIN (e.g. 4JGDF7DE5FA198243)"
                value={vinInput}
                onChange={(e) => handleVinInputChange(e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-1.5 text-xs font-mono uppercase text-slate-800 placeholder:font-sans placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => handleDecodeVin(vinInput)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
              >
                Decode
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Compatible make *</label>
              <select
                value={compatibleMake}
                onChange={(e) => {
                  const newMake = e.target.value;
                  setCompatibleMake(newMake);
                  const models = getAvailableModels(newMake);
                  if (models.length > 0) {
                    setCompatibleModel(models[0]);
                  }
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                {Object.keys(VEHICLE_DATA).map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Model *</label>
              <select
                value={compatibleModel}
                onChange={(e) => setCompatibleModel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              >
                {getAvailableModels(compatibleMake).length > 0 ? (
                  getAvailableModels(compatibleMake).map((mod) => (
                    <option key={mod} value={mod}>
                      {mod}
                    </option>
                  ))
                ) : (
                  <option value={compatibleModel}>{compatibleModel || 'Standard'}</option>
                )}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Year *</label>
              <input
                type="text"
                required
                value={compatibleYear}
                onChange={(e) => setCompatibleYear(e.target.value)}
                placeholder="2014"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Compatible engine</label>
            <input
              type="text"
              value={compatibleEngine}
              onChange={(e) => setCompatibleEngine(e.target.value)}
              placeholder="1.8L petrol"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Condition *</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Used · tested">Used · tested</option>
                <option value="New">New OEM</option>
                <option value="Refurbished">Refurbished</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Price (GMD) *</label>
              <input
                type="number"
                required
                value={priceGMD}
                onChange={(e) => setPriceGMD(e.target.value)}
                placeholder="2500"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Quantity *</label>
              <input
                type="number"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="2"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Availability Radio from Figma Page 12 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Availability *</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAvailability('available')}
                className={`py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                  availability === 'available'
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <span className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${availability === 'available' ? 'border-blue-600 bg-blue-600' : 'border-slate-400'}`} />
                <span>Available</span>
              </button>

              <button
                type="button"
                onClick={() => setAvailability('out_of_stock')}
                className={`py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                  availability === 'out_of_stock'
                    ? 'bg-red-50 border-red-500 text-red-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <span className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${availability === 'out_of_stock' ? 'border-red-600 bg-red-600' : 'border-slate-400'}`} />
                <span>Out of stock</span>
              </button>
            </div>
          </div>

          {/* Attached Photo row matching Figma Page 12 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                <img src={imagePreview} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">alternator-reference.jpg</span>
                <span className="text-[10px] text-slate-400">1.8 MB · Photo attached</span>
              </div>
            </div>

            <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 transition-colors shadow-2xs">
              <span>Replace</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Description / notes</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="90A alternator. Tested and ready for pickup. Connector matches 27060-0T140."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{editItem ? 'Save Changes' : 'Save Part'}</span>
            </button>
          </div>
        </form>

        {/* Right 4 Cols: Live Listing Preview & Tip from Figma Page 12 */}
        <div className="lg:col-span-4 space-y-6">
          {/* Listing Preview Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Listing preview</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                Live Preview
              </span>
            </div>

            <div className="h-44 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-3 overflow-hidden">
              <img
                src={imagePreview}
                alt={partName}
                className="max-h-36 max-w-full object-contain"
              />
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 text-base">{partName || 'Part name'}</h4>
              <p className="text-xs text-slate-500">
                {partNumber} · {compatibleMake} {compatibleModel} {compatibleYear}
              </p>

              <div className="space-y-1 pt-2 border-t border-slate-100 text-xs">
                <p>
                  <strong className="text-slate-700">Condition:</strong> {condition}
                </p>
                <div className="pt-1">
                  <span className="text-2xl font-black text-slate-900 font-mono">
                    D{parseFloat(priceGMD || '0').toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {quantity} units available · {availability === 'available' ? 'In stock' : 'Out of stock'}
                </p>
              </div>
            </div>
          </div>

          {/* "Good photos help" Box from Figma Page 12 */}
          <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 space-y-2 text-xs text-blue-900">
            <div className="flex items-center gap-2 font-bold text-blue-950">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Good photos help</span>
            </div>
            <p className="text-blue-800/90 leading-relaxed">
              Use a clear photo of the actual part, including the connector and part-number label. Mechanics check pulley alignments and terminal pins before ordering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

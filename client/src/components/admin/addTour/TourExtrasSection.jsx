import React from 'react';
import { Star, CheckCircle, XCircle, Plus, Trash2 } from 'lucide-react';

const TourExtrasSection = ({ highlights, setHighlights, included, setIncluded, excluded, setExcluded }) => {
    // Helpers cho Mảng chuỗi (Included/Excluded)
    const addStringItem = (setter) => setter(prev => [...prev, '']);
    const updateStringItem = (setter, index, value) => setter(prev => prev.map((v, i) => i === index ? value : v));
    const removeStringItem = (setter, index) => setter(prev => prev.filter((_, i) => i !== index));

    // Helpers cho Mảng Object (Highlights)
    const addHighlight = () => setHighlights(prev => [...prev, { title: '', desc: '' }]);
    const updateHighlight = (index, field, value) => setHighlights(prev => prev.map((h, i) => i === index ? { ...h, [field]: value } : h));
    const removeHighlight = (index) => setHighlights(prev => prev.filter((_, i) => i !== index));

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-8">
            {/* Điểm nhấn */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <h4 className="font-semibold text-gray-900">Điểm nhấn hành trình (Highlights)</h4>
                    </div>
                    <button type="button" onClick={addHighlight} className="text-sm text-[#8B1A1A] hover:underline font-medium">+ Thêm</button>
                </div>
                <div className="space-y-3">
                    {highlights.map((h, i) => (
                        <div key={i} className="flex gap-3 items-start">
                            <div className="flex-1 space-y-2">
                                <input type="text" placeholder="Tiêu đề (VD: Tặng vé Buffet)" className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:border-[#8B1A1A]" value={h.title} onChange={e => updateHighlight(i, 'title', e.target.value)} />
                                <input type="text" placeholder="Mô tả chi tiết..." className="w-full px-3 py-2 text-sm border rounded-lg outline-none focus:border-[#8B1A1A]" value={h.desc} onChange={e => updateHighlight(i, 'desc', e.target.value)} />
                            </div>
                            <button type="button" onClick={() => removeHighlight(i)} className="p-2 text-gray-400 hover:text-red-500 mt-1"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Bao gồm */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <h4 className="font-semibold text-gray-900">Dịch vụ bao gồm</h4>
                        </div>
                        <button type="button" onClick={() => addStringItem(setIncluded)} className="text-sm text-green-600 hover:underline font-medium">+ Thêm</button>
                    </div>
                    <div className="space-y-2">
                        {included.map((item, i) => (
                            <div key={i} className="flex gap-2">
                                <input type="text" placeholder="VD: Vé máy bay khứ hồi..." className="flex-1 px-3 py-2 text-sm border rounded-lg outline-none focus:border-green-500" value={item} onChange={e => updateStringItem(setIncluded, i, e.target.value)} />
                                <button type="button" onClick={() => removeStringItem(setIncluded, i)} className="p-2 text-gray-400 hover:text-red-500"><XCircle className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Không bao gồm */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-500" />
                            <h4 className="font-semibold text-gray-900">Không bao gồm</h4>
                        </div>
                        <button type="button" onClick={() => addStringItem(setExcluded)} className="text-sm text-red-600 hover:underline font-medium">+ Thêm</button>
                    </div>
                    <div className="space-y-2">
                        {excluded.map((item, i) => (
                            <div key={i} className="flex gap-2">
                                <input type="text" placeholder="VD: Thuế VAT 8%..." className="flex-1 px-3 py-2 text-sm border rounded-lg outline-none focus:border-red-500" value={item} onChange={e => updateStringItem(setExcluded, i, e.target.value)} />
                                <button type="button" onClick={() => removeStringItem(setExcluded, i)} className="p-2 text-gray-400 hover:text-red-500"><XCircle className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourExtrasSection;
import React from 'react';
import { ShieldCheck, Plus, Trash2 } from 'lucide-react';

const TourPoliciesSection = ({ policyChild, setPolicyChild, policyCancel, setPolicyCancel, policyOther, setPolicyOther }) => {
    const addItem = (setter) => setter(prev => [...prev, '']);
    const updateItem = (setter, index, value) => setter(prev => prev.map((v, i) => i === index ? value : v));
    const removeItem = (setter, index) => setter(prev => prev.filter((_, i) => i !== index));

    const PolicyBlock = ({ title, items, setter, placeholder, colorClass }) => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
                <button type="button" onClick={() => addItem(setter)} className={`text-xs font-medium hover:underline ${colorClass}`}>+ Thêm dòng</button>
            </div>
            <div className="space-y-2">
                {items.map((item, i) => (
                    <div key={i} className="flex gap-2">
                        <input
                            type="text"
                            placeholder={placeholder}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-gray-400"
                            value={item}
                            onChange={e => updateItem(setter, i, e.target.value)}
                        />
                        <button type="button" onClick={() => removeItem(setter, i)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Chính sách & Quy định</h3>
                    <p className="text-xs text-gray-500 mt-1">Thiết lập các điều khoản về trẻ em, hoàn hủy và lưu ý khác.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <PolicyBlock title="Chính sách trẻ em" items={policyChild} setter={setPolicyChild} placeholder="VD: Trẻ em dưới 5 tuổi miễn phí..." colorClass="text-blue-600" />
                <div className="h-px bg-gray-100 w-full" />
                <PolicyBlock title="Quy định hoàn hủy" items={policyCancel} setter={setPolicyCancel} placeholder="VD: Hủy trước 7 ngày khởi hành: Phí 50%..." colorClass="text-[#8B1A1A]" />
                <div className="h-px bg-gray-100 w-full" />
                <PolicyBlock title="Lưu ý khác" items={policyOther} setter={setPolicyOther} placeholder="VD: Quý khách vui lòng mang theo CCCD..." colorClass="text-gray-600" />
            </div>
        </div>
    );
};

export default TourPoliciesSection;
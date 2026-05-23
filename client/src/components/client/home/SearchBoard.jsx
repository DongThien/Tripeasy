import React, { useState } from 'react';
import { MapPin, Calendar, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBoard = () => {
    const navigate = useNavigate();
    const [destination, setDestination] = useState('');
    const [travelDate, setTravelDate] = useState('');
    const [budget, setBudget] = useState('all');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (destination.trim()) params.set('q', destination.trim());
        if (travelDate) params.set('date', travelDate);
        if (budget && budget !== 'all') params.set('budget', budget);
        const query = params.toString();
        navigate(`/client/tours${query ? `?${query}` : ''}`);
    };

    return (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-40px] w-full max-w-4xl z-20">
            <div className="bg-white rounded-xl shadow-xl flex divide-x divide-gray-200">
                {/* Điểm đến */}
                <div className="flex-1 flex items-center gap-2 px-5 py-4">
                    <MapPin className="w-5 h-5 text-[#8B1A1A]" />
                    <input
                        type="text"
                        placeholder="Bạn muốn đi đâu?"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="outline-none w-full bg-transparent text-gray-900 placeholder-gray-400"
                    />
                </div>
                {/* Ngày đi */}
                <div className="flex-1 flex items-center gap-2 px-5 py-4">
                    <Calendar className="w-5 h-5 text-[#8B1A1A]" />
                    <input
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="outline-none w-full bg-transparent text-gray-900"
                    />
                </div>
                {/* Ngân sách */}
                <div className="flex-1 flex items-center gap-2 px-5 py-4">
                    <Wallet className="w-5 h-5 text-[#8B1A1A]" />
                    <select
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="outline-none w-full bg-transparent text-gray-900"
                    >
                        <option value="all">Tất cả mức giá</option>
                        <option value="under-2">Dưới 2 triệu</option>
                        <option value="2-5">2-5 triệu</option>
                        <option value="over-5">Trên 5 triệu</option>
                    </select>
                </div>
                {/* Nút tìm kiếm */}
                <div className="flex items-center justify-center px-5 py-4">
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="bg-[#8B1A1A] hover:bg-[#a83232] text-white font-bold px-7 py-3 rounded-lg text-lg shadow transition"
                    >
                        Tìm kiếm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchBoard;

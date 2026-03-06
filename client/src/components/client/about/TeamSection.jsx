import React from 'react';

const TEAM = [
    {
        name: 'Nguyễn Minh Khôi',
        role: 'Giám đốc điều hành',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
        name: 'Trần Thị Hà',
        role: 'Trưởng phòng Tour',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
        name: 'Lê Đình Phúc',
        role: 'Hướng dẫn viên chính',
        avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
    },
    {
        name: 'Phạm Thùy Linh',
        role: 'Chăm sóc khách hàng',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
];

const TeamSection = () => (
    <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
            <span className="inline-block bg-red-50 text-[#8B1A1A] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                Đội ngũ
            </span>
            <h2 className="text-3xl font-bold text-gray-800">Những con người tạo nên Tripeasy</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                Đội ngũ của chúng tôi là những người đam mê du lịch, luôn sẵn sàng mang lại
                hành trình tốt nhất cho bạn.
            </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {TEAM.map(({ name, role, avatar }) => (
                <div key={name} className="flex flex-col items-center text-center gap-3">
                    <img
                        src={avatar}
                        alt={name}
                        className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-white ring-2 ring-[#8B1A1A]/20"
                    />
                    <div>
                        <p className="font-bold text-gray-800">{name}</p>
                        <p className="text-sm text-gray-500">{role}</p>
                    </div>
                </div>
            ))}
        </div>
    </section>
);

export default TeamSection;

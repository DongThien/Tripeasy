import React from 'react';
import { Globe2, HeartHandshake, Sparkles, Users } from 'lucide-react';
import ClientNavbar from '../../components/common/ClientNavbar';
import ClientFooter from '../../components/common/ClientFooter';
import CareersCTA from '../../components/client/careers/CareersCTA';
import CareersCulture from '../../components/client/careers/CareersCulture';
import CareersHero from '../../components/client/careers/CareersHero';
import CareersHiringProcess from '../../components/client/careers/CareersHiringProcess';
import CareersOpenRoles from '../../components/client/careers/CareersOpenRoles';

const BENEFITS = [
    {
        title: 'Môi trường sáng tạo',
        description: 'Đội ngũ gọn, tốc độ nhanh, khuyến khích thử nghiệm và ra quyết định dựa trên dữ liệu thực tế.',
        icon: Sparkles,
    },
    {
        title: 'Sứ mệnh rõ ràng',
        description: 'Kết nối du khách với những trải nghiệm bản địa chất lượng, minh bạch và đáng tin cậy.',
        icon: HeartHandshake,
    },
    {
        title: 'Linh hoạt & hỗ trợ',
        description: 'Chính sách làm việc linh hoạt, lộ trình phát triển nghề nghiệp rõ ràng cho từng vị trí.',
        icon: Users,
    },
    {
        title: 'Phúc lợi trọn vẹn',
        description: 'Bảo hiểm đầy đủ, team building, ưu đãi tour nội bộ và ngân sách học tập hằng quý.',
        icon: Globe2,
    },
];

const OPEN_ROLES = [
    {
        title: 'Chuyên viên tư vấn tour',
        location: 'Hồ Chí Minh',
        type: 'Toàn thời gian',
        description: 'Tư vấn hành trình, tối ưu lịch trình, chăm sóc khách hàng trước và sau chuyến đi.',
    },
    {
        title: 'Product Marketing Executive',
        location: 'Ha Noi',
        type: 'Toàn thời gian',
        description: 'Xây dựng chiến dịch, ra mắt sản phẩm tour mới, tối ưu hiệu quả kênh bán hàng.',
    },
    {
        title: 'UI/UX Designer',
        location: 'Remote',
        type: 'Linh hoạt',
        description: 'Thiết kế hành trình người dùng, tăng tỉ lệ chuyển đổi trên web và mobile.',
    },
    {
        title: 'Trip Operations Specialist',
        location: 'Da Nang',
        type: 'Toàn thời gian',
        description: 'Điều phối nhà cung cấp, quản lý tiến độ tour, đảm bảo chất lượng dịch vụ.',
    },
];

const HIRING_STEPS = [
    'Gửi hồ sơ và thông tin ứng tuyển',
    'Phỏng vấn nhanh 30 phút',
    'Bài tập tình huống (nếu cần)',
    'Gặp trực tiếp với quản lý',
    'Nhận offer và bắt đầu hành trình',
];

const Careers = () => (
    <div className="min-h-screen bg-[#FDFBF7]">
        <ClientNavbar />

        <main className="pt-16">
            <CareersHero />
            <CareersCulture benefits={BENEFITS} />
            <CareersOpenRoles roles={OPEN_ROLES} />
            <CareersHiringProcess steps={HIRING_STEPS} />
            <CareersCTA />
        </main>

        <ClientFooter />
    </div>
);

export default Careers;

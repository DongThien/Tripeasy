import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CreditCard, Shuffle, ShieldCheck, HelpCircle } from 'lucide-react';

const FAQ_CATEGORIES = [
    { id: 'booking', label: 'Đặt tour & Thanh toán', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'cancel', label: 'Hủy & Thay đổi lịch trình', icon: <Shuffle className="w-5 h-5" /> },
    { id: 'service', label: 'Chính sách & Dịch vụ', icon: <ShieldCheck className="w-5 h-5" /> }
];

const FAQ_ITEMS = {
    booking: [
        {
            question: 'Làm thế nào để tôi đặt tour trực tuyến trên Tripeasy?',
            answer: 'Bạn chỉ cần chọn tour yêu thích trên hệ thống, chọn ngày khởi hành mong muốn, nhập số lượng khách (người lớn và trẻ em), sau đó bấm "Đặt tour ngay". Hệ thống sẽ ghi nhận thông tin đặt tour và chuyên viên hỗ trợ của chúng tôi sẽ liên hệ lại qua số điện thoại/email trong vòng 15-30 phút để hỗ trợ hoàn thiện hồ sơ.'
        },
        {
            question: 'Tôi có thể thanh toán bằng các hình thức nào?',
            answer: 'Hiện tại Tripeasy hỗ trợ các hình thức thanh toán đa dạng: Chuyển khoản ngân hàng trực tiếp qua VietQR, Thanh toán bằng thẻ quốc tế (Visa/Mastercard) hoặc thẻ nội địa qua Cổng thanh toán, và Thanh toán trực tiếp bằng tiền mặt hoặc thẻ tại văn phòng số 3 Cầu Giấy.'
        },
        {
            question: 'Có chương trình ưu đãi nào dành cho khách hàng đặt theo nhóm không?',
            answer: 'Tripeasy thường xuyên có chính sách chiết khấu từ 3% đến 8% cho các đoàn khách đi từ 10 người trở lên. Ngoài ra, các thẻ thành viên (Đồng, Bạc, Vàng, Kim Cương) cũng được tích điểm tích lũy để quy đổi thành các voucher giảm giá trực tiếp cho những hành trình tiếp theo.'
        }
    ],
    cancel: [
        {
            question: 'Tôi có thể hủy tour đã đặt không và chính sách phí ra sao?',
            answer: 'Có, bạn hoàn toàn có thể yêu cầu hủy tour. Phí hủy tour được tính dựa trên thời gian bạn thông báo hủy trước ngày khởi hành:\n\n• Trước 15 ngày trở lên: Miễn phí hoàn toàn hoặc chỉ thu phí dịch vụ đặt cọc vé máy bay (nếu có).\n• Từ 7 đến 14 ngày: Phí hủy là 30% giá trị tour.\n• Từ 3 đến 6 ngày: Phí hủy là 50% giá trị tour.\n• Dưới 3 ngày hoặc không tham gia: Phí hủy là 100% giá trị tour.'
        },
        {
            question: 'Trường hợp tour bị hủy do thiên tai hoặc dịch bệnh thì sao?',
            answer: 'Trong các trường hợp bất khả kháng như thiên tai, bão lũ, dịch bệnh hoặc do hãng hàng không hủy chuyến, Tripeasy cam kết hỗ trợ khách hàng bảo lưu giá trị tour 100% để sử dụng cho chuyến đi khác trong vòng 1 năm, hoặc hoàn trả toàn bộ số tiền thực tế khách hàng đã thanh toán sau khi trừ các chi phí đặt cọc dịch vụ tối thiểu của đối tác hàng không/khách sạn.'
        },
        {
            question: 'Làm thế nào để thay đổi thông tin hành khách sau khi đã đặt tour?',
            answer: 'Vui lòng liên hệ hotline chăm sóc khách hàng 1900 1234 hoặc gửi email phản hồi trực tiếp kèm mã đặt tour ít nhất 3 ngày trước ngày khởi hành để được hỗ trợ thay đổi thông tin miễn phí. Đối với các tour đi bằng máy bay, việc đổi tên hành khách sẽ áp dụng theo đúng quy định điều kiện vé của hãng hàng không.'
        }
    ],
    service: [
        {
            question: 'Giá tour đã bao gồm bảo hiểm du lịch và các bữa ăn chưa?',
            answer: 'Hầu hết các tour trọn gói của Tripeasy đã bao gồm bảo hiểm du lịch quốc tế/nội địa với mức bồi thường tối đa 50,000,000đ/vụ. Các bữa ăn theo chương trình chi tiết (sáng, trưa, tối), vé vào cửa các điểm tham quan, hướng dẫn viên suốt tuyến và nước uống đóng chai cũng đã được tính trọn gói trong giá tour.'
        },
        {
            question: 'Trẻ em đi tour có được áp dụng giá vé ưu đãi riêng không?',
            answer: 'Chính sách giá cho trẻ em của chúng tôi rất linh hoạt:\n\n• Dưới 2 tuổi: Chỉ tính phí dịch vụ hoặc vé máy bay giá rẻ (khoảng 10-20% giá tour người lớn).\n• Từ 2 đến 11 tuổi: Thường áp dụng từ 70% đến 85% giá tour người lớn (tiêu chuẩn ăn uống, tham quan đầy đủ, ngủ chung giường với bố mẹ).\n• Từ 12 tuổi trở lên: Tính giá như người lớn.'
        },
        {
            question: 'Tôi có cần mang theo hành lý đặc biệt hay có lưu ý sức khỏe nào không?',
            answer: 'Trước mỗi chuyến đi từ 1-2 ngày, hướng dẫn viên của Tripeasy sẽ liên hệ trực tiếp với bạn qua Zalo/Điện thoại để dặn dò chi tiết về thời tiết tại điểm đến, trang phục phù hợp, các vật dụng cá nhân khuyên mang và ghi nhận trước các thông tin dị ứng thực phẩm hoặc yêu cầu ăn kiêng (ăn chay, không ăn hải sản...) của bạn.'
        }
    ]
};

const ContactFaqSection = () => {
    const [activeTab, setActiveTab] = useState('booking');
    const [openFAQIndex, setOpenFAQIndex] = useState(0);

    const handleToggleFAQ = (index) => {
        setOpenFAQIndex(prev => (prev === index ? -1 : index));
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setOpenFAQIndex(0); // Reset accordion mở về dòng đầu tiên khi chuyển tab
    };

    const currentFaqs = FAQ_ITEMS[activeTab] || [];

    return (
        <section className="mx-auto mt-24 max-w-7xl px-4 md:px-6 lg:px-8">
            {/* Title Header */}
            <div className="text-center max-w-2xl mx-auto mb-16 relative">
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight mt-6">
                    Câu Hỏi Thường Gặp
                </h2>
                <span className="mt-4 inline-block h-1 w-16 rounded-full bg-[#8B1A1A]" />
                <p className="mt-4 text-base text-gray-500 leading-relaxed font-medium">
                    Giải đáp nhanh những thắc mắc phổ biến của du khách trước khi khởi hành cùng Tripeasy.
                </p>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Side Category Navigation */}
                <div className="lg:col-span-4 flex flex-col gap-2 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <span className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Danh mục chủ đề</span>
                    {FAQ_CATEGORIES.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-bold text-left transition-all duration-200 active:scale-[0.98]
                                    ${isActive
                                        ? 'bg-[#8B1A1A] text-white shadow-lg shadow-red-950/15 translate-x-1'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                <span className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    {tab.icon}
                                </span>
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Right Side Accordion Lists */}
                <div className="lg:col-span-8 space-y-4">
                    {currentFaqs.map((faq, index) => {
                        const isOpen = openFAQIndex === index;

                        return (
                            <article
                                key={index}
                                className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-white
                                    ${isOpen
                                        ? 'border-red-100 shadow-xl shadow-red-950/5 ring-1 ring-red-500/5'
                                        : 'border-gray-100 hover:border-gray-200 shadow-sm'}`}
                            >
                                <button
                                    type="button"
                                    onClick={() => handleToggleFAQ(index)}
                                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors"
                                >
                                    <span className={`font-bold text-base transition-colors ${isOpen ? 'text-[#8B1A1A]' : 'text-gray-800'}`}>
                                        {faq.question}
                                    </span>
                                    <span className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300 flex-shrink-0
                                        ${isOpen
                                            ? 'bg-[#8B1A1A] text-white rotate-180 shadow-md shadow-red-950/10'
                                            : 'bg-[#8B1A1A]/10 text-[#8B1A1A]'}`}>
                                        <ChevronDown className="h-4 w-4" />
                                    </span>
                                </button>

                                <div
                                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="px-6 pb-6 pt-1 text-sm leading-relaxed text-gray-600 font-medium whitespace-pre-wrap">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ContactFaqSection;
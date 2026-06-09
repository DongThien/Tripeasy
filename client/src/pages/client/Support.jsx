import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { HelpCircle, ShieldCheck, FileText, DollarSign, Users, ChevronRight, Phone, Mail, MapPin } from 'lucide-react';
import ClientNavbar from '../../components/common/ClientNavbar';
import ClientFooter from '../../components/common/ClientFooter';

const Support = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'faq';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeTab]);

    const tabs = [
        { id: 'faq', name: 'Trung tâm trợ giúp', icon: HelpCircle },
        { id: 'privacy', name: 'Chính sách bảo mật', icon: ShieldCheck },
        { id: 'terms', name: 'Điều khoản sử dụng', icon: FileText },
        { id: 'refund', name: 'Chính sách hoàn tiền', icon: DollarSign },
        { id: 'team', name: 'Đội ngũ của chúng tôi', icon: Users },
    ];

    const handleTabChange = (tabId) => {
        setSearchParams({ tab: tabId });
    };

    // FAQ Accordion component helper
    const FAQItem = ({ question, answer }) => {
        const [open, setOpen] = React.useState(false);
        return (
            <div className="border border-gray-150 rounded-2xl bg-white overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md">
                <button
                    onClick={() => setOpen(!open)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-800 text-base md:text-lg hover:text-[#8B1A1A] transition-colors"
                >
                    <span>{question}</span>
                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-90 text-[#8B1A1A]' : ''}`} />
                </button>
                {open && (
                    <div className="px-5 pb-5 pt-1 border-t border-gray-100 text-gray-600 text-sm md:text-base leading-relaxed bg-[#FDFBF7]/35 animate-fadeIn">
                        {answer}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-[#FDFBF7] min-h-screen pt-24">
            <ClientNavbar />

            {/* Banner Section */}
            <header className="bg-gradient-to-br from-[#8B1A1A] via-[#a82525] to-[#5a0c0c] text-white py-16 px-4 mb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4 drop-shadow-sm">
                        Hỗ trợ & Điều khoản
                    </h1>
                    <p className="text-sm md:text-lg text-red-100 max-w-xl mx-auto leading-relaxed">
                        Tripeasy luôn đồng hành và bảo vệ mọi quyền lợi hợp pháp của quý khách trong suốt hành trình khám phá thế giới.
                    </p>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
                <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
                    {/* Left Column: Navigation Sidebar */}
                    <aside className="w-full lg:w-1/4 flex-shrink-0">
                        <div className="bg-white rounded-3xl border border-gray-150 p-4 sticky top-28 shadow-sm space-y-1">
                            <span className="text-xs font-bold text-gray-400 uppercase px-4 pb-2 block tracking-wider">Danh mục hỗ trợ</span>
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left font-bold text-sm md:text-base transition-all duration-200 active:scale-[0.98] ${isActive
                                            ? 'bg-[#8B1A1A] text-white shadow-md shadow-red-950/10'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                        <span>{tab.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    {/* Right Column: Active Tab Detail Content */}
                    <article className="flex-grow bg-white rounded-3xl border border-gray-150 p-6 md:p-10 shadow-sm min-h-[500px]">
                        {/* Tab 1: FAQ */}
                        {activeTab === 'faq' && (
                            <div className="space-y-6">
                                <div className="border-b border-gray-100 pb-4 mb-6">
                                    <h2 className="text-2xl md:text-3xl font-black text-gray-900">Trung Tâm Trợ Giúp & FAQ</h2>
                                    <p className="text-sm text-gray-500 mt-1">Giải đáp các thắc mắc thường gặp nhất khi đặt tour tại Tripeasy</p>
                                </div>

                                <div className="space-y-4">
                                    <FAQItem
                                        question="Làm cách nào để đặt một tour du lịch trên Tripeasy?"
                                        answer="Quý khách có thể dễ dàng tìm kiếm tour phù hợp tại mục 'Tour Du Lịch', chọn ngày khởi hành mong muốn, nhập số lượng hành khách tham gia và bấm Đặt Tour. Hệ thống sẽ chuyển quý khách sang trang thanh toán để xác nhận thông tin đặt tour."
                                    />
                                    <FAQItem
                                        question="Tripeasy hỗ trợ những phương thức thanh toán nào?"
                                        answer="Chúng tôi hỗ trợ hai hình thức thanh toán chính: (1) Chuyển khoản ngân hàng trực tuyến bằng mã VietQR tự động giúp tiền về tài khoản và xác nhận vé tức thì; (2) Thanh toán trực tiếp tại hệ thống văn phòng của Tripeasy trên cả nước."
                                    />
                                    <FAQItem
                                        question="Tôi có thể thay đổi số lượng khách hoặc ngày khởi hành sau khi đã đặt tour không?"
                                        answer="Có, quý khách vui lòng liên hệ trực tiếp hotline hỗ trợ 1800 8888 hoặc gửi email yêu cầu về bộ phận chăm sóc khách hàng tối thiểu 3 ngày trước ngày khởi hành dự kiến. Việc thay đổi sẽ được xử lý miễn phí tùy thuộc vào tình trạng chỗ trống của ngày đi mới."
                                    />
                                    <FAQItem
                                        question="Làm sao tôi biết giao dịch chuyển khoản VietQR của tôi đã thành công?"
                                        answer="Ngay sau khi quý khách quét mã VietQR và thực hiện chuyển khoản đúng cú pháp, hệ thống Casso tự động của chúng tôi sẽ xử lý giao dịch trong vòng 1-2 phút, chuyển trạng thái đơn hàng của quý khách thành 'Đã thanh toán', đồng thời gửi email thông báo kèm Vé Điện Tử xác nhận về hòm thư của quý khách."
                                    />
                                    <FAQItem
                                        question="Hành lý đi tour du lịch cần chuẩn bị những gì?"
                                        answer="Tùy thuộc vào điểm đến (biển, núi, hay nước ngoài), hướng dẫn viên của Tripeasy sẽ liên hệ trước ngày đi 24 giờ để dặn dò chi tiết hành trang. Quý khách lưu ý mang đầy đủ giấy tờ tùy thân hợp lệ (CCCD, Hộ chiếu đối với tour quốc tế) và các loại thuốc cá nhân đặc trị."
                                    />
                                </div>
                            </div>
                        )}

                        {/* Tab 2: Privacy Policy */}
                        {activeTab === 'privacy' && (
                            <div className="space-y-6 text-gray-750 text-sm md:text-base leading-relaxed">
                                <div className="border-b border-gray-100 pb-4 mb-6">
                                    <h2 className="text-2xl md:text-3xl font-black text-gray-900">Chính Sách Bảo Mật</h2>
                                    <p className="text-sm text-gray-500 mt-1">Cập nhật lần cuối: Tháng 6, 2026</p>
                                </div>

                                <section className="space-y-4">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900">1. Thu thập thông tin cá nhân</h3>
                                    <p>
                                        Khi quý khách sử dụng dịch vụ trên website Tripeasy, chúng tôi thu thập các thông tin cá nhân cơ bản để phục vụ việc đặt chỗ, bao gồm: Họ và tên, địa chỉ email, số điện thoại, thông tin tài khoản thụ hưởng (nếu có), các yêu cầu đặc biệt của chuyến đi và lịch sử đặt vé của quý khách.
                                    </p>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900">2. Mục đích sử dụng thông tin</h3>
                                    <p>
                                        Chúng tôi cam kết sử dụng thông tin cá nhân của khách hàng một cách minh bạch và chỉ phục vụ các mục đích:
                                    </p>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Đặt vé, giữ chỗ và phát hành hóa đơn thanh toán cho khách hàng.</li>
                                        <li>Gửi email xác nhận hành trình, thông tin cập nhật hoặc thông báo khẩn cấp về tour.</li>
                                        <li>Cung cấp nội dung cá nhân hóa thông qua chatbot tư vấn AI.</li>
                                        <li>Gửi email khuyến mãi, ưu đãi đặc biệt nếu khách hàng đăng ký nhận tin bản tin.</li>
                                    </ul>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900">3. Bảo mật thông tin khách hàng</h3>
                                    <p>
                                        Mọi thông tin cá nhân và thông tin giao dịch của quý khách đều được lưu trữ bảo mật trên cơ sở dữ liệu đã được mã hóa mật khẩu bằng thuật toán bcrypt. Chúng tôi áp dụng các chuẩn giao thức truyền tải an toàn SSL/TLS và không chia sẻ thông tin khách hàng cho bất kỳ bên thứ ba nào ngoại trừ các đơn vị lữ hành thực tế phục vụ chuyến đi của bạn.
                                    </p>
                                </section>
                            </div>
                        )}

                        {/* Tab 3: Terms of Service */}
                        {activeTab === 'terms' && (
                            <div className="space-y-6 text-gray-750 text-sm md:text-base leading-relaxed">
                                <div className="border-b border-gray-100 pb-4 mb-6">
                                    <h2 className="text-2xl md:text-3xl font-black text-gray-900">Điều Khoản Sử Dụng</h2>
                                    <p className="text-sm text-gray-500 mt-1">Các quy định ràng buộc giữa hành khách và Tripeasy khi sử dụng dịch vụ</p>
                                </div>

                                <section className="space-y-4">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900">1. Quy định chung</h3>
                                    <p>
                                        Bằng cách truy cập vào trang web Tripeasy và tiến hành các thao tác đặt chỗ, quý khách mặc nhiên đồng ý tuân thủ toàn bộ các điều khoản sử dụng này. Nếu không đồng ý với bất kỳ điều khoản nào, quý khách vui lòng dừng sử dụng dịch vụ của chúng tôi.
                                    </p>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900">2. Quy định đặt tour và giá vé</h3>
                                    <p>
                                        Giá vé hiển thị trên website đã bao gồm phí hướng dẫn viên, phương tiện vận chuyển và các bữa ăn theo chương trình chi tiết của từng tour. Mức giá cho trẻ em sẽ được tính theo quy định chi tiết của từng độ tuổi được nêu rõ trong tab chính sách của mỗi tour. Đơn hàng chỉ thực sự được xác nhận sau khi khách hàng hoàn tất thanh toán (VietQR hoặc tại văn phòng).
                                    </p>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900">3. Trách nhiệm của khách hàng</h3>
                                    <p>
                                        Khách hàng có trách nhiệm cung cấp thông tin cá nhân chính xác khi đăng ký tài khoản và đặt tour. Mọi hành vi gian lận thông tin thanh toán, cố ý spam đơn hàng hoặc gây ảnh hưởng xấu tới hệ thống máy chủ sẽ bị chặn quyền truy cập và xử lý theo quy định của pháp luật Việt Nam.
                                    </p>
                                </section>
                            </div>
                        )}

                        {/* Tab 4: Refund Policy */}
                        {activeTab === 'refund' && (
                            <div className="space-y-6 text-gray-750 text-sm md:text-base leading-relaxed">
                                <div className="border-b border-gray-100 pb-4 mb-6">
                                    <h2 className="text-2xl md:text-3xl font-black text-gray-900">Chính Sách Hoàn Tiền & Hủy Tour</h2>
                                    <p className="text-sm text-gray-500 mt-1">Quy chuẩn hoàn hủy minh bạch bảo đảm quyền lợi tài chính tối đa</p>
                                </div>

                                <div className="bg-red-50 border border-red-200/50 p-5 rounded-2xl mb-6 text-sm text-[#8B1A1A] font-semibold">
                                    💡 LƯU Ý: Phí hủy tour căn cứ vào thời gian khách hủy tour so với ngày khởi hành dự kiến, cụ thể áp dụng như bảng quy định dưới đây.
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border border-gray-200 text-left text-sm md:text-base">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="p-4 border border-gray-200 font-bold text-gray-800">Thời gian hủy đặt chỗ</th>
                                                <th className="p-4 border border-gray-200 font-bold text-gray-800">Mức phí phạt hủy</th>
                                                <th className="p-4 border border-gray-200 font-bold text-gray-800">Phần trăm hoàn trả</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="p-4 border border-gray-200 font-semibold">Trên 7 ngày trước ngày đi</td>
                                                <td className="p-4 border border-gray-200 text-green-700 font-bold">Miễn phí hủy</td>
                                                <td className="p-4 border border-gray-200 font-bold">Hoàn tiền 100%</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 border border-gray-200 font-semibold">Từ 3 đến 7 ngày trước ngày đi</td>
                                                <td className="p-4 border border-gray-200 text-orange-600 font-bold">50% giá trị tour</td>
                                                <td className="p-4 border border-gray-200 font-bold">Hoàn tiền 50%</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 border border-gray-200 font-semibold">Dưới 3 ngày trước ngày đi</td>
                                                <td className="p-4 border border-gray-200 text-[#8B1A1A] font-bold">100% giá trị tour</td>
                                                <td className="p-4 border border-gray-200 font-bold">Không hoàn trả (0%)</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <section className="space-y-4 mt-6">
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900">Quy trình nhận lại tiền hoàn trả</h3>
                                    <p>
                                        Nếu đơn hàng của quý khách đủ điều kiện được hoàn tiền, vui lòng liên hệ bộ phận hỗ trợ khách hàng. Số tiền hoàn trả sẽ được chuyển khoản thẳng về tài khoản ngân hàng của quý khách trong vòng 3 đến 5 ngày làm việc.
                                    </p>
                                </section>
                            </div>
                        )}

                        {/* Tab 5: Our Team */}
                        {activeTab === 'team' && (
                            <div className="space-y-6">
                                <div className="border-b border-gray-100 pb-4 mb-6">
                                    <h2 className="text-2xl md:text-3xl font-black text-gray-900">Đội Ngũ Tripeasy</h2>
                                    <p className="text-sm text-gray-500 mt-1">Những con người tâm huyết kiến tạo nên các hành trình trọn vẹn</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Team Member 1 */}
                                    <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-gray-150 text-center space-y-4 hover:shadow-md transition-shadow">
                                        <div className="w-24 h-24 rounded-full bg-[#8B1A1A]/10 text-[#8B1A1A] font-bold text-2xl flex items-center justify-center mx-auto border border-[#8B1A1A]/20">
                                            DT
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-lg text-gray-900">Nguyễn Đông Thiện</h4>
                                            <p className="text-xs text-[#8B1A1A] font-bold uppercase tracking-wider mt-0.5">CEO & Sáng lập viên</p>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            Tâm huyết đem lại những giá trị lữ hành nguyên bản cùng dịch vụ chăm sóc khách hàng tận tâm nhất.
                                        </p>
                                    </div>

                                    {/* Team Member 2 */}
                                    <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-gray-150 text-center space-y-4 hover:shadow-md transition-shadow">
                                        <div className="w-24 h-24 rounded-full bg-[#8B1A1A]/10 text-[#8B1A1A] font-bold text-2xl flex items-center justify-center mx-auto border border-[#8B1A1A]/20">
                                            DT
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-lg text-gray-900">Nguyễn Đông Thiện</h4>
                                            <p className="text-xs text-[#8B1A1A] font-bold uppercase tracking-wider mt-0.5">Giám đốc Vận hành</p>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            Tối ưu hóa quy trình dịch vụ và làm việc trực tiếp với các đơn vị lưu trú để đảm bảo chất lượng cao nhất.
                                        </p>
                                    </div>

                                    {/* Team Member 3 */}
                                    <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-gray-150 text-center space-y-4 hover:shadow-md transition-shadow">
                                        <div className="w-24 h-24 rounded-full bg-[#8B1A1A]/10 text-[#8B1A1A] font-bold text-2xl flex items-center justify-center mx-auto border border-[#8B1A1A]/20">
                                            DT
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-lg text-gray-900">Nguyễn Đông Thiện</h4>
                                            <p className="text-xs text-[#8B1A1A] font-bold uppercase tracking-wider mt-0.5">Trưởng bộ phận CSKH</p>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            Người lắng nghe và đồng hành giải quyết mọi khó khăn, khiếu nại của khách hàng 24/7.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </article>
                </div>
            </main>

            <ClientFooter />
        </div>
    );
};

export default Support;

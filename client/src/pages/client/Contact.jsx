import React, { useState } from 'react';
import ClientNavbar from '../../components/common/ClientNavbar';
import ClientFooter from '../../components/common/ClientFooter';
import ContactHero from '../../components/client/contact/ContactHero';
import ContactInfoCards from '../../components/client/contact/ContactInfoCards';
import ContactMessageSection from '../../components/client/contact/ContactMessageSection';
import ContactFaqSection from '../../components/client/contact/ContactFaqSection';
import ContactMapSection from '../../components/client/contact/ContactMapSection';

const faqs = [
    {
        question: 'Làm sao để hủy tour?',
        answer: 'Bạn có thể hủy tour trực tiếp trong mục quản lý đơn hoặc liên hệ hotline 1900 1234 để được hỗ trợ nhanh.',
    },
    {
        question: 'Chính sách hoàn tiền như thế nào?',
        answer: 'Mức hoàn tiền phụ thuộc thời điểm hủy tour. Tripeasy sẽ thông báo chi tiết ngay sau khi tiếp nhận yêu cầu.',
    },
    {
        question: 'Tôi có thể thay đổi lịch trình không?',
        answer: 'Bạn có thể yêu cầu điều chỉnh lịch trình trước ngày khởi hành. Đội ngũ tư vấn sẽ xác nhận khả năng áp dụng.',
    },
];

const Contact = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        subject: 'Tư vấn đặt tour',
        message: '',
    });
    const [openFAQ, setOpenFAQ] = useState(0);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    const toggleFAQ = (index) => {
        setOpenFAQ((prev) => (prev === index ? -1 : index));
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <ClientNavbar />

            <main className="pt-16">
                <ContactHero />
                <ContactInfoCards />
                <ContactMessageSection
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                />
                <ContactFaqSection faqs={faqs} openFAQ={openFAQ} onToggleFAQ={toggleFAQ} />
                <ContactMapSection />
            </main>

            <ClientFooter />
        </div>
    );
};

export default Contact;
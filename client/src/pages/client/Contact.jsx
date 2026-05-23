import React, { useState } from 'react';
import toast from 'react-hot-toast';
import ClientNavbar from '../../components/common/ClientNavbar';
import ClientFooter from '../../components/common/ClientFooter';
import ContactHero from '../../components/client/contact/ContactHero';
import ContactInfoCards from '../../components/client/contact/ContactInfoCards';
import ContactMessageSection from '../../components/client/contact/ContactMessageSection';
import ContactFaqSection from '../../components/client/contact/ContactFaqSection';
import ContactMapSection from '../../components/client/contact/ContactMapSection';
import contactService from '../../services/contactService';

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
    const [submitting, setSubmitting] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { fullName, email, subject, message } = formData;
        if (!fullName || !email || !subject || !message) {
            toast.error('Vui lòng điền đầy đủ các trường bắt buộc!');
            return;
        }

        try {
            setSubmitting(true);
            const response = await contactService.submitContactForm(formData);
            if (response.success) {
                toast.success(response.message || 'Gửi liên hệ thành công!');
                setFormData({
                    fullName: '',
                    phone: '',
                    email: '',
                    subject: 'Tư vấn đặt tour',
                    message: '',
                });
            } else {
                toast.error(response.message || 'Gửi liên hệ thất bại.');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.';
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
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
                    submitting={submitting}
                />
                <ContactFaqSection faqs={faqs} openFAQ={openFAQ} onToggleFAQ={toggleFAQ} />
                <ContactMapSection />
            </main>

            <ClientFooter />
        </div>
    );
};

export default Contact;
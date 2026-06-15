import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosClient from '../../services/axiosClient';
import { compressImages } from '../../utils/imageCompressor';
import { uploadTourImagesBackground } from '../../services/imageUploadService';
import { getTodayDateString, calculateEndDate } from '../../utils/dateHelper';

import TourBasicInfoSection from '../../components/admin/addTour/TourBasicInfoSection';
import TourPricingSection from '../../components/admin/addTour/TourPricingSection';
import TourImageUploadSection from '../../components/admin/addTour/TourImageUploadSection';
import TourItinerarySection from '../../components/admin/addTour/TourItinerarySection';
import TourFormActions from '../../components/admin/addTour/TourFormActions';
import TourDeparturesSection from '../../components/admin/addTour/TourDeparturesSection';
import TourExtrasSection from '../../components/admin/addTour/TourExtrasSection';
import TourPoliciesSection from '../../components/admin/addTour/TourPoliciesSection';

const AddTour = () => {
    const navigate = useNavigate();

    // 1. Khai báo Form State
    const [formData, setFormData] = useState({
        title: '', destination: '', duration: '', region: '', max_guests: '0',
        price_adult: '', price_child: '', old_price: '',
        itinerary: '', highlights: '', included: '', excluded: '',
        start_location: '', transport: '', category: ''
    });

    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [itinerary, setItinerary] = useState([{ day: 1, title: '', content: '' }]);

    // State cho các trường MỚI
    const [departures, setDepartures] = useState([{ start_date: '', end_date: '', stock: '' }]);
    const [highlights, setHighlights] = useState([{ title: '', desc: '' }]);
    const [included, setIncluded] = useState(['']);
    const [excluded, setExcluded] = useState(['']);

    const [isCompressing, setIsCompressing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [policyChild, setPolicyChild] = useState(['']);
    const [policyCancel, setPolicyCancel] = useState(['']);
    const [policyOther, setPolicyOther] = useState(['']);

    // Tự động tính lại ngày về của các ngày khởi hành khi thời lượng tour thay đổi
    useEffect(() => {
        if (!formData.duration || departures.length === 0) return;
        setDepartures(prev => prev.map(dep => {
            if (dep.start_date) {
                const calculatedEnd = calculateEndDate(dep.start_date, formData.duration);
                if (calculatedEnd && calculatedEnd !== dep.end_date) {
                    return { ...dep, end_date: calculatedEnd };
                }
            }
            return dep;
        }));
    }, [formData.duration]);

    // Helpers
    const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        setIsCompressing(true);
        try {
            const compressedFiles = await compressImages(files);
            const newPreviews = compressedFiles.map(file => URL.createObjectURL(file));
            setImages(prev => [...prev, ...compressedFiles]);
            setImagePreviews(prev => [...prev, ...newPreviews]);
            toast.success(`✅ ${compressedFiles.length} ảnh đã sẵn sàng (đã nén)`);
        } catch (error) { toast.error('❌ Lỗi nén ảnh: ' + error.message); } finally { setIsCompressing(false); }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        if (files.length === 0) return;
        setIsCompressing(true);
        try {
            const compressedFiles = await compressImages(files);
            const newPreviews = compressedFiles.map(file => URL.createObjectURL(file));
            setImages(prev => [...prev, ...compressedFiles]);
            setImagePreviews(prev => [...prev, ...newPreviews]);
            toast.success(`✅ ${compressedFiles.length} ảnh đã sẵn sàng (đã nén)`);
        } catch (error) { toast.error('❌ Lỗi nén ảnh: ' + error.message); } finally { setIsCompressing(false); }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
        URL.revokeObjectURL(imagePreviews[index]);
    };

    // Helpers cho Lịch trình & Lịch khởi hành
    const addItineraryDay = () => setItinerary(prev => [...prev, { day: prev.length + 1, title: '', content: '' }]);
    const removeItineraryDay = (index) => {
        if (itinerary.length > 1) {
            setItinerary(prev => {
                const filtered = prev.filter((_, i) => i !== index);
                return filtered.map((item, i) => ({ ...item, day: i + 1 }));
            });
        }
    };
    const updateItinerary = (index, field, value) => setItinerary(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));

    const addDeparture = () => setDepartures(prev => [...prev, { start_date: '', end_date: '', stock: '' }]);
    const removeDeparture = (index) => setDepartures(prev => prev.filter((_, i) => i !== index));
    const updateDeparture = (index, field, value) => setDepartures(prev => prev.map((dep, i) => i === index ? { ...dep, [field]: value } : dep));

    const handleCancel = () => navigate('/admin/tours');

    // 2. Xử lý Nút LƯU
    const handleSubmit = async () => {
        try {
            if (!formData.title || !formData.destination || !formData.price_adult) {
                toast.error('Vui lòng điền đầy đủ Tên tour, Điểm đến và Giá người lớn!');
                return;
            }

            const todayStr = getTodayDateString();
            const hasPastDate = departures.some(d => d.start_date && d.start_date < todayStr);
            if (hasPastDate) {
                toast.error('Lịch khởi hành không được chứa ngày đi ở quá khứ!');
                return;
            }

            setIsSubmitting(true);
            const toastId = toast.loading('⏳ Đang lưu tour...');

            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'price_adult' || key === 'price_child' || key === 'old_price' || key === 'max_guests') {
                    const cleanNum = formData[key].toString().replace(/\D/g, '');
                    formDataToSend.append(key, cleanNum || '0');
                } else if (formData[key] !== null && formData[key] !== '') {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Parse Mảng dữ liệu thành JSON String trước khi gửi xuống DB
            const cleanedDepartures = departures
                .filter(d => d.start_date && d.end_date)
                .map(d => ({
                    start_date: d.start_date,
                    end_date: d.end_date,
                    stock: d.stock !== null && d.stock !== undefined && d.stock !== '' ? parseInt(d.stock) : 20,
                    status: d.status || 'AVAILABLE'
                }));

            formDataToSend.append('itinerary', JSON.stringify(itinerary));
            formDataToSend.append('departures', JSON.stringify(cleanedDepartures));
            formDataToSend.append('highlights', JSON.stringify(highlights.filter(h => h.title)));
            formDataToSend.append('included', JSON.stringify(included.filter(i => i.trim() !== '')));
            formDataToSend.append('excluded', JSON.stringify(excluded.filter(e => e.trim() !== '')));
            formDataToSend.append('policy_child', JSON.stringify(policyChild.filter(i => i.trim() !== '')));
            formDataToSend.append('policy_cancel', JSON.stringify(policyCancel.filter(i => i.trim() !== '')));
            formDataToSend.append('policy_other', JSON.stringify(policyOther.filter(i => i.trim() !== '')));

            const response = await axiosClient.post('/tours', formDataToSend, { headers: { 'Content-Type': 'multipart/form-data' } });

            if (response.data.success) {
                const tourId = response.data.data.tour_id;
                toast.success('✅ Tour đã được tạo thành công!', { id: toastId });

                if (images.length > 0) {
                    uploadTourImagesBackground(tourId, [...images]);
                }

                setTimeout(() => {
                    setIsSubmitting(false);
                    navigate('/admin/tours');
                }, 1000);
            } else {
                toast.error('❌ Có lỗi xảy ra: ' + response.data.message, { id: toastId });
                setIsSubmitting(false);
            }
        } catch (error) {
            toast.error('❌ Lỗi tạo tour: ' + (error.response?.data?.message || error.message));
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full">
            <div className="max-w-5xl mx-auto space-y-6">
                <TourBasicInfoSection formData={formData} handleInputChange={handleInputChange} />

                {/* Khu vực tạo Lịch Khởi Hành */}
                <TourDeparturesSection
                    departures={departures} addDeparture={addDeparture}
                    removeDeparture={removeDeparture} updateDeparture={updateDeparture}
                    duration={formData.duration}
                />

                <TourPricingSection formData={formData} handleInputChange={handleInputChange} />

                {/* Khu vực tạo Điểm nhấn & Dịch vụ */}
                <TourExtrasSection
                    highlights={highlights} setHighlights={setHighlights}
                    included={included} setIncluded={setIncluded}
                    excluded={excluded} setExcluded={setExcluded}
                />

                <TourPoliciesSection
                    policyChild={policyChild} setPolicyChild={setPolicyChild}
                    policyCancel={policyCancel} setPolicyCancel={setPolicyCancel}
                    policyOther={policyOther} setPolicyOther={setPolicyOther}
                />

                <TourImageUploadSection
                    images={images} setImages={setImages} imagePreviews={imagePreviews}
                    setImagePreviews={setImagePreviews} handleImageUpload={handleImageUpload}
                    handleDrop={handleDrop} removeImage={removeImage} isCompressing={isCompressing}
                />
                <TourItinerarySection itinerary={itinerary} addItineraryDay={addItineraryDay} removeItineraryDay={removeItineraryDay} updateItinerary={updateItinerary} />
                <TourFormActions handleCancel={handleCancel} handleSubmit={handleSubmit} isLoading={isSubmitting} />
            </div>
        </div>
    );
};

export default AddTour;
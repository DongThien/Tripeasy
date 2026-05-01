import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosClient from '../../services/axiosClient';
import { compressImages } from '../../utils/imageCompressor';
import { uploadTourImagesBackground } from '../../services/imageUploadService';
import TourBasicInfoSection from '../../components/admin/addTour/TourBasicInfoSection';
import TourPricingSection from '../../components/admin/addTour/TourPricingSection';
import TourImageUploadSection from '../../components/admin/addTour/TourImageUploadSection';
import TourDescriptionSection from '../../components/admin/addTour/TourDescriptionSection';
import TourItinerarySection from '../../components/admin/addTour/TourItinerarySection';
import TourFormActions from '../../components/admin/addTour/TourFormActions';

const AddTour = () => {
    const navigate = useNavigate();

    // State Management
    const [formData, setFormData] = useState({
        title: '',
        destination: '',
        duration: '',
        region: '',
        max_guests: '',
        start_date: '',
        end_date: '',
        price_adult: '',
        price_child: '',
        description: ''
    });

    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [itinerary, setItinerary] = useState([
        { day: 1, title: '', content: '' }
    ]);
    const [isCompressing, setIsCompressing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle form input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle image upload với nén ảnh
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsCompressing(true);
        try {
            // Nén ảnh tự động
            const compressedFiles = await compressImages(files);

            // Tạo preview từ ảnh đã nén
            const newPreviews = compressedFiles.map(file => URL.createObjectURL(file));

            setImages(prev => [...prev, ...compressedFiles]);
            setImagePreviews(prev => [...prev, ...newPreviews]);

            toast.success(`✅ ${compressedFiles.length} ảnh đã sẵn sàng (đã nén)`);
        } catch (error) {
            toast.error('❌ Lỗi nén ảnh: ' + error.message);
        } finally {
            setIsCompressing(false);
        }
    };

    // Handle drag and drop với nén ảnh
    const handleDrop = async (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        if (files.length === 0) return;

        setIsCompressing(true);
        try {
            // Nén ảnh tự động
            const compressedFiles = await compressImages(files);

            // Tạo preview từ ảnh đã nén
            const newPreviews = compressedFiles.map(file => URL.createObjectURL(file));

            setImages(prev => [...prev, ...compressedFiles]);
            setImagePreviews(prev => [...prev, ...newPreviews]);

            toast.success(`✅ ${compressedFiles.length} ảnh đã sẵn sàng (đã nén)`);
        } catch (error) {
            toast.error('❌ Lỗi nén ảnh: ' + error.message);
        } finally {
            setIsCompressing(false);
        }
    };

    // Remove image
    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);

        URL.revokeObjectURL(imagePreviews[index]);

        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    // Handle itinerary
    const addItineraryDay = () => {
        setItinerary(prev => [
            ...prev,
            { day: prev.length + 1, title: '', content: '' }
        ]);
    };

    const removeItineraryDay = (index) => {
        if (itinerary.length > 1) {
            setItinerary(prev => prev.filter((_, i) => i !== index));
        }
    };

    const updateItinerary = (index, field, value) => {
        setItinerary(prev => prev.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        ));
    };

    // Handle cancel action
    const handleCancel = () => {
        navigate('/admin/tours');
    };

    // Handle form submission - GIẢI PHÁP 2: Lưu tour trước, upload ảnh sau
    const handleSubmit = async () => {
        try {
            // Validation cơ bản
            if (!formData.title || !formData.destination || !formData.price_adult) {
                toast.error('Vui lòng điền đầy đủ thông tin bắt buộc (Tên tour, Điểm đến, Giá người lớn)');
                return;
            }

            setIsSubmitting(true);
            // Hiển thị loading
            const toastId = toast.loading('⏳ Đang lưu tour...');

            // Create FormData object - KHÔNG bao gồm ảnh
            const formDataToSend = new FormData();

            // Add form fields with special handling for price fields
            Object.keys(formData).forEach(key => {
                // Always send certain required fields even if empty
                if (key === 'region') {
                    formDataToSend.append(key, formData[key] || '');
                }
                else if (formData[key] !== null && formData[key] !== '') {
                    // Clean price fields by removing all non-digit characters
                    if (key === 'price_adult' || key === 'price_child') {
                        const cleanPrice = formData[key].toString().replace(/\D/g, '');
                        formDataToSend.append(key, cleanPrice || '0');
                    }
                    // Clean max_guests field
                    else if (key === 'max_guests') {
                        const cleanGuests = formData[key].toString().replace(/\D/g, '');
                        formDataToSend.append(key, cleanGuests || '0');
                    }
                    // Other fields remain unchanged
                    else {
                        formDataToSend.append(key, formData[key]);
                    }
                }
            });

            // Add itinerary as JSON string
            formDataToSend.append('itinerary', JSON.stringify(itinerary));

            // ⭐ KHÔNG thêm ảnh vào FormData - sẽ upload riêng sau

            console.log('Sending tour data (without images) to API...');

            // Call API - Lưu tour trước
            const response = await axiosClient.post('/tours', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                const tourId = response.data.data.tour_id;

                // ✅ Tour được lưu thành công ngay lập tức
                toast.success('✅ Tour đã được tạo thành công!', {
                    id: toastId,
                });

                console.log('Tour created with ID:', tourId);

                // Lưu danh sách ảnh cần upload ở background
                const imagesToUpload = images.length > 0 ? [...images] : [];

                // Reset form
                setFormData({
                    title: '',
                    destination: '',
                    duration: '',
                    region: '',
                    max_guests: '',
                    start_date: '',
                    end_date: '',
                    price_adult: '',
                    price_child: '',
                    description: ''
                });
                setImages([]);
                setImagePreviews([]);
                setItinerary([
                    { day: 1, title: '', content: '' }
                ]);

                // Chuyển về trang tours
                setTimeout(() => {
                    setIsSubmitting(false);
                    navigate('/admin/tours');
                }, 1000);

                // 🎯 Upload ảnh ở BACKGROUND - không block UI
                if (imagesToUpload.length > 0) {
                    uploadTourImagesBackground(tourId, imagesToUpload);
                }
            } else {
                toast.error('❌ Có lỗi xảy ra: ' + response.data.message, {
                    id: toastId,
                });
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Error submitting tour:', error);
            toast.error('❌ Lỗi tạo tour: ' + (error.response?.data?.message || error.message), {
                duration: 4000,
            });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full">
            <div className="max-w-5xl mx-auto space-y-6">
                <TourBasicInfoSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                />

                <TourPricingSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                />

                <TourImageUploadSection
                    images={images}
                    setImages={setImages}
                    imagePreviews={imagePreviews}
                    setImagePreviews={setImagePreviews}
                    handleImageUpload={handleImageUpload}
                    handleDrop={handleDrop}
                    removeImage={removeImage}
                    isCompressing={isCompressing}
                />

                <TourDescriptionSection
                    formData={formData}
                    handleInputChange={handleInputChange}
                />

                <TourItinerarySection
                    itinerary={itinerary}
                    addItineraryDay={addItineraryDay}
                    removeItineraryDay={removeItineraryDay}
                    updateItinerary={updateItinerary}
                />

                <TourFormActions
                    handleCancel={handleCancel}
                    handleSubmit={handleSubmit}
                    isLoading={isSubmitting}
                />
            </div>
        </div>
    );
};

export default AddTour;
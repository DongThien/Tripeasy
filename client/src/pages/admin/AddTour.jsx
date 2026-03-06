import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';
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

    // Handle form input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newPreviews = files.map(file => URL.createObjectURL(file));

        setImages(prev => [...prev, ...files]);
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    // Handle drag and drop
    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        if (files.length === 0) return;

        const newPreviews = files.map(file => URL.createObjectURL(file));

        setImages(prev => [...prev, ...files]);
        setImagePreviews(prev => [...prev, ...newPreviews]);
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

    // Handle form submission
    const handleSubmit = async () => {
        try {
            // Validation cơ bản
            if (!formData.title || !formData.destination || !formData.price_adult) {
                alert('Vui lòng điền đầy đủ thông tin bắt buộc (Tên tour, Điểm đến, Giá người lớn)');
                return;
            }

            // Create FormData object
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

            // Add images
            images.forEach(image => {
                formDataToSend.append('images', image);
            });

            console.log('Sending form data to API...');

            // Debug: Log the region value being sent
            console.log('Region value:', formData.region);
            console.log('FormData entries:');
            for (let [key, value] of formDataToSend.entries()) {
                console.log(`${key}:`, value);
            }

            // Call API
            const response = await axiosClient.post('/tours', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                alert('Tour đã được tạo thành công!');
                console.log('Tour created:', response.data.data);

                // Reset form sau khi thành công
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
            } else {
                alert('Có lỗi xảy ra: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error submitting tour:', error);
            alert('Có lỗi xảy ra khi tạo tour: ' + (error.response?.data?.message || error.message));
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
                />
            </div>
        </div>
    );
};

export default AddTour;
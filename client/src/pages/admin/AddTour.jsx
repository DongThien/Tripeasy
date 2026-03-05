import React, { useState } from 'react';
import axiosClient from '../../services/axiosClient';
import {
    Info,
    DollarSign,
    Image as ImageIcon,
    FileText,
    Map,
    UploadCloud,
    Plus,
    Trash2,
    Bold,
    Italic,
    List,
    Link,
    X
} from 'lucide-react';

const AddTour = () => {
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
                if (formData[key] !== null && formData[key] !== '') {
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

                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Thêm Tour Mới</h2>
                    <p className="text-gray-500 mt-2">Tạo và xuất bản các tour du lịch mới cho khách hàng của bạn.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <Info className="w-5 h-5 text-[#8B1A1A]" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên tour</label>
                            <input
                                type="text"
                                placeholder="Nhập tên tour"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent outline-none"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Điểm đến</label>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: Đà Nẵng, Phú Quốc..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent outline-none"
                                    value={formData.destination}
                                    onChange={(e) => handleInputChange('destination', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian</label>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: 3N2Đ"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent outline-none"
                                    value={formData.duration}
                                    onChange={(e) => handleInputChange('duration', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Khu vực</label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent outline-none"
                                    value={formData.region}
                                    onChange={(e) => handleInputChange('region', e.target.value)}
                                >
                                    <option value="">Chọn khu vực</option>
                                    <option value="Miền Bắc">Miền Bắc</option>
                                    <option value="Miền Trung">Miền Trung</option>
                                    <option value="Miền Nam">Miền Nam</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Ví dụ: 20"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent outline-none"
                                    value={formData.max_guests}
                                    onChange={(e) => handleInputChange('max_guests', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày khởi hành</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent outline-none"
                                    value={formData.start_date}
                                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent outline-none"
                                    value={formData.end_date}
                                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <DollarSign className="w-5 h-5 text-[#8B1A1A]" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Giá tour (VND)</h3>
                    </div>

                    <div className="max-w-[400px]">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Người lớn</label>
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#8B1A1A] focus-within:ring-1 focus-within:ring-[#8B1A1A] transition-colors">
                                    <input
                                        type="text"
                                        placeholder="2,500,000"
                                        className="w-full px-3 py-2 outline-none border-none"
                                        value={formData.price_adult}
                                        onChange={(e) => handleInputChange('price_adult', e.target.value)}
                                    />
                                    <span className="px-3 py-2 bg-gray-50 text-gray-500 text-sm border-l border-gray-200">VND</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Trẻ em</label>
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#8B1A1A] focus-within:ring-1 focus-within:ring-[#8B1A1A] transition-colors">
                                    <input
                                        type="text"
                                        placeholder="1,800,000"
                                        className="w-full px-3 py-2 outline-none border-none"
                                        value={formData.price_child}
                                        onChange={(e) => handleInputChange('price_child', e.target.value)}
                                    />
                                    <span className="px-3 py-2 bg-gray-50 text-gray-500 text-sm border-l border-gray-200">VND</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <ImageIcon className="w-5 h-5 text-[#8B1A1A]" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Hình ảnh</h3>
                    </div>

                    {images.length === 0 ? (
                        <div className="mb-4">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:border-[#8B1A1A] hover:bg-red-50 transition-colors"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                            >
                                <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 font-medium mb-2">Kéo thả ảnh vào đây hoặc click để chọn ảnh</p>
                                <p className="text-sm text-gray-400">PNG, JPG, JPEG tối đa 10MB</p>
                            </label>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-4 items-center">
                            {imagePreviews.map((preview, index) => (
                                <div
                                    key={index}
                                    className="relative"
                                    style={{ width: '120px', height: '120px', flex: '0 0 auto' }}
                                >
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeImage(index);
                                        }}
                                        className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg z-20 cursor-pointer transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            <div
                                className="relative rounded-lg border-2 border-dashed border-gray-300 hover:border-[#8B1A1A] hover:bg-red-50 transition-colors"
                                style={{ width: '120px', height: '120px', flex: '0 0 auto' }}
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="add-more-images"
                                />
                                <label
                                    htmlFor="add-more-images"
                                    className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}
                                >
                                    <Plus className="w-6 h-6 text-gray-400 mb-1" />
                                    <span className="text-sm text-gray-500 font-medium">Thêm ảnh</span>
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <FileText className="w-5 h-5 text-[#8B1A1A]" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Mô tả chi tiết</h3>
                    </div>

                    <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg mb-4">
                        <button type="button" className="p-2 hover:bg-gray-100 rounded">
                            <Bold className="w-4 h-4 text-gray-600" />
                        </button>
                        <button type="button" className="p-2 hover:bg-gray-100 rounded">
                            <Italic className="w-4 h-4 text-gray-600" />
                        </button>
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        <button type="button" className="p-2 hover:bg-gray-100 rounded">
                            <List className="w-4 h-4 text-gray-600" />
                        </button>
                        <button type="button" className="p-2 hover:bg-gray-100 rounded">
                            <Link className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>

                    <textarea
                        rows={10}
                        placeholder="Nhập mô tả chi tiết về tour du lịch..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent outline-none resize-none"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-50 rounded-lg">
                                <Map className="w-5 h-5 text-[#8B1A1A]" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Lịch trình</h3>
                        </div>
                        <button
                            type="button"
                            onClick={addItineraryDay}
                            className="flex items-center gap-2 px-4 py-2 text-[#8B1A1A] hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="font-medium">Thêm ngày</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {itinerary.map((day, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="bg-[#8B1A1A] text-white px-3 py-1 rounded-full text-sm font-medium">
                                        Ngày {day.day}
                                    </span>
                                    {itinerary.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItineraryDay(index)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Tiêu đề ngày (VD: Đón khách - Tham quan Sơn Trà)"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent outline-none"
                                        value={day.title}
                                        onChange={(e) => updateItinerary(index, 'title', e.target.value)}
                                    />
                                    <textarea
                                        rows={4}
                                        placeholder="Chi tiết các hoạt động trong ngày..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B1A1A] focus:border-transparent outline-none resize-none"
                                        value={day.content}
                                        onChange={(e) => updateItinerary(index, 'content', e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 pb-8">
                    <button type="button" className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-6 py-3 bg-[#8B1A1A] text-white font-medium rounded-lg hover:bg-[#a83232] transition-colors"
                    >
                        Lưu Tour
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AddTour;
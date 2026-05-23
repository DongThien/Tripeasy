import React, { useState, useEffect } from 'react';
import { X, Save, ToggleLeft, ToggleRight, CheckCircle2 } from 'lucide-react';
import axiosClient from '../../../services/axiosClient';
import toast from 'react-hot-toast';
import { compressImages } from '../../../utils/imageCompressor';
import { uploadTourImagesBackground } from '../../../services/imageUploadService';

// Tái sử dụng 100% Component từ AddTour
import TourBasicInfoSection from '../addTour/TourBasicInfoSection';
import TourDeparturesSection from '../addTour/TourDeparturesSection';
import TourPricingSection from '../addTour/TourPricingSection';
import TourExtrasSection from '../addTour/TourExtrasSection';
import TourPoliciesSection from '../addTour/TourPoliciesSection';
import TourItinerarySection from '../addTour/TourItinerarySection';
import TourImageUploadSection from '../addTour/TourImageUploadSection';

const EditTourForm = ({ tourData, onClose, onSaved }) => {
    // 1. Khai báo Form State
    const [formData, setFormData] = useState({
        title: '', destination: '', duration: '', region: '', max_guests: '',
        price_adult: '', price_child: '', old_price: '',
        start_location: '', transport: '', category: ''
    });

    const [availability, setAvailability] = useState(true);
    const [departures, setDepartures] = useState([]);
    const [highlights, setHighlights] = useState([]);
    const [included, setIncluded] = useState([]);
    const [excluded, setExcluded] = useState([]);
    const [policyChild, setPolicyChild] = useState([]);
    const [policyCancel, setPolicyCancel] = useState([]);
    const [policyOther, setPolicyOther] = useState([]);
    const [itinerary, setItinerary] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [isCompressing, setIsCompressing] = useState(false);

    // 2. Đổ dữ liệu từ bảng (tourData) vào Form khi mở Modal
    useEffect(() => {
        if (!tourData) return;
        let isActive = true;

        const parseJSON = (data, defaultVal) => {
            if (!data) return defaultVal;
            try { return typeof data === 'string' ? JSON.parse(data) : data; }
            catch { return defaultVal; }
        };

        const removeDecimals = (val) => {
            if (val === null || val === undefined || val === '') return '';
            return Number(val).toString();
        };

        const hydrateFromTour = (source) => {
            setFormData({
                title: source.title || '',
                destination: source.destination || '',
                duration: source.duration || '',
                region: source.region || '',
                max_guests: source.quantity || '',
                price_adult: removeDecimals(source.price_adult),
                price_child: removeDecimals(source.price_child),
                old_price: removeDecimals(source.old_price),
                start_location: source.start_location || '',
                transport: source.transport || '',
                category: source.category || ''
            });

            setAvailability(source.availability ?? true);
            setDepartures(parseJSON(source.departures, [{ start_date: '', end_date: '', stock: '' }]));
            setHighlights(parseJSON(source.highlights, [{ title: '', desc: '' }]));
            setIncluded(parseJSON(source.included, ['']));
            setExcluded(parseJSON(source.excluded, ['']));
            setPolicyChild(parseJSON(source.policy_child, ['']));
            setPolicyCancel(parseJSON(source.policy_cancel, ['']));
            setPolicyOther(parseJSON(source.policy_other, ['']));
            setItinerary(parseJSON(source.itinerary, [{ day: 1, title: '', content: '' }]));

            const incomingImages = Array.isArray(source.images)
                ? source.images
                : (source.image_url ? [source.image_url] : []);
            setExistingImages(incomingImages.filter(Boolean));
            setImages([]);
            setImagePreviews([]);
        };

        const loadDetails = async () => {
            hydrateFromTour(tourData);
            try {
                const res = await axiosClient.get(`/tours/${tourData.tour_id}/images`);
                if (isActive && res.data?.success) {
                    setExistingImages((res.data.data || []).filter(Boolean));
                }
            } catch {
                // Fallback to data already in tourData
            }
        };

        loadDetails();

        return () => {
            isActive = false;
        };
    }, [tourData]);

    // Khóa cuộn trang nền khi mở Modal
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    // 3. Các hàm Helpers dùng chung cho Components
    const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const addDeparture = () => setDepartures(prev => [...prev, { start_date: '', end_date: '', stock: '' }]);
    const removeDeparture = (index) => setDepartures(prev => prev.filter((_, i) => i !== index));
    const updateDeparture = (index, field, value) => setDepartures(prev => prev.map((dep, i) => i === index ? { ...dep, [field]: value } : dep));

    const addItineraryDay = () => setItinerary(prev => [...prev, { day: prev.length + 1, title: '', content: '' }]);
    const removeItineraryDay = (index) => { if (itinerary.length > 1) setItinerary(prev => prev.filter((_, i) => i !== index)); };
    const updateItinerary = (index, field, value) => setItinerary(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setIsCompressing(true);
        try {
            const compressedFiles = await compressImages(files);
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

    const handleDrop = async (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files || []).filter(file => file.type.startsWith('image/'));
        if (files.length === 0) return;
        setIsCompressing(true);
        try {
            const compressedFiles = await compressImages(files);
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

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        if (imagePreviews[index]) {
            URL.revokeObjectURL(imagePreviews[index]);
        }
    };

    const handleRemoveExistingImage = async (imageUrl) => {
        try {
            const res = await axiosClient.delete(`/tours/${tourData.tour_id}/images`, {
                data: { image_url: imageUrl }
            });
            if (res.data?.success) {
                setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
                toast.success('✅ Đã xóa ảnh');
            } else {
                toast.error('❌ Không thể xóa ảnh');
            }
        } catch (err) {
            toast.error('❌ Lỗi xóa ảnh: ' + (err.response?.data?.message || err.message));
        }
    };

    // 4. Xử lý Cập nhật (Submit)
    const handleSubmit = async () => {
        if (!formData.title || !formData.destination || !formData.price_adult) {
            toast.error('Vui lòng điền tên tour, điểm đến và giá người lớn!');
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading('⏳ Đang cập nhật tour...');

        try {
            // ĐÃ FIX: Hàm cleanNum an toàn, không bị lỗi khi người dùng gõ nhầm chữ
            const cleanNum = (val) => {
                if (!val) return 0;
                const cleanStr = String(val).replace(/,/g, '').replace(/\s/g, '');
                return Math.round(parseFloat(cleanStr)) || 0;
            };

            // Đóng gói JSON Payload
            const payload = {
                ...formData,
                max_guests: cleanNum(formData.max_guests),
                price_adult: cleanNum(formData.price_adult),
                price_child: cleanNum(formData.price_child),
                old_price: cleanNum(formData.old_price),
                availability: availability,
                departures: JSON.stringify(departures.filter(d => d.start_date && d.end_date)),
                highlights: JSON.stringify(highlights.filter(h => h.title)),
                included: JSON.stringify(included.filter(i => i.trim() !== '')),
                excluded: JSON.stringify(excluded.filter(i => i.trim() !== '')),
                policy_child: JSON.stringify(policyChild.filter(i => i.trim() !== '')),
                policy_cancel: JSON.stringify(policyCancel.filter(i => i.trim() !== '')),
                policy_other: JSON.stringify(policyOther.filter(i => i.trim() !== '')),
                itinerary: JSON.stringify(itinerary)
            };

            const res = await axiosClient.put(`/tours/${tourData.tour_id}`, payload);

            if (res.data.success) {
                toast.success('✅ Cập nhật tour thành công!', { id: toastId });
                if (images.length > 0) {
                    uploadTourImagesBackground(tourData.tour_id, [...images]);
                }
                onSaved?.(res.data.data);
            } else {
                toast.error('❌ Lỗi: ' + res.data.message, { id: toastId });
            }
        } catch (err) {
            toast.error('❌ Lỗi hệ thống: ' + (err.response?.data?.message || err.message), { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!tourData) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="relative bg-[#F9F6F4] rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>

                {/* ── HEADER ── */}
                <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 rounded-t-2xl flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Chỉnh sửa Tour</h2>
                        <p className="text-sm font-semibold text-[#8B1A1A] mt-0.5">Mã: TRP-{tourData.tour_id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition" aria-label="Đóng">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* ── BODY (Sử dụng lại các Section) ── */}
                <div className="overflow-y-auto flex-1 px-6 py-6 space-y-6">
                    <TourBasicInfoSection formData={formData} handleInputChange={handleInputChange} />

                    <TourDeparturesSection departures={departures} addDeparture={addDeparture} removeDeparture={removeDeparture} updateDeparture={updateDeparture} />

                    <TourPricingSection formData={formData} handleInputChange={handleInputChange} />

                    <TourExtrasSection highlights={highlights} setHighlights={setHighlights} included={included} setIncluded={setIncluded} excluded={excluded} setExcluded={setExcluded} />

                    <TourPoliciesSection policyChild={policyChild} setPolicyChild={setPolicyChild} policyCancel={policyCancel} setPolicyCancel={setPolicyCancel} policyOther={policyOther} setPolicyOther={setPolicyOther} />

                    {existingImages.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-50 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-[#8B1A1A]" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Ảnh hiện tại</h3>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {existingImages.map((img, index) => (
                                    <div
                                        key={`${img}-${index}`}
                                        className="relative"
                                        style={{ width: '120px', height: '120px', flex: '0 0 auto' }}
                                    >
                                        <img
                                            src={img}
                                            alt={`Current ${index + 1}`}
                                            className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExistingImage(img)}
                                            className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg z-20 cursor-pointer transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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

                    <TourItinerarySection itinerary={itinerary} addItineraryDay={addItineraryDay} removeItineraryDay={removeItineraryDay} updateItinerary={updateItinerary} />

                    {/* Khối Trạng thái Tour (Dành riêng cho Edit) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-50 rounded-lg"><CheckCircle2 className="w-5 h-5 text-[#8B1A1A]" /></div>
                            <h3 className="text-lg font-semibold text-gray-900">Trạng thái hiển thị</h3>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Trạng thái hoạt động</p>
                                <p className="text-xs text-gray-500 mt-1">{availability ? 'Tour đang được hiển thị công khai trên website' : 'Tour đang bị ẩn (Bản nháp)'}</p>
                            </div>
                            <button type="button" onClick={() => setAvailability(!availability)} className="focus:outline-none">
                                {availability ? <ToggleRight className="w-10 h-10 text-green-500" /> : <ToggleLeft className="w-10 h-10 text-gray-400" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── FOOTER ── */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 bg-white border-t border-gray-100 rounded-b-2xl flex-shrink-0">
                    <button onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50">
                        Hủy
                    </button>
                    <button onClick={handleSubmit} disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-white bg-[#8B1A1A] rounded-lg hover:bg-[#a83232] transition flex items-center gap-2 disabled:opacity-60">
                        {isSubmitting ? 'Đang lưu...' : <><Save className="w-4 h-4" /> Lưu thay đổi</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTourForm;
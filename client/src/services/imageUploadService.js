import axiosClient from './axiosClient';
import toast from 'react-hot-toast';

/**
 * Upload ảnh riêng lên server (sau khi tour đã được tạo)
 * @param {number} tourId - ID của tour vừa tạo
 * @param {File[]} images - Mảng file ảnh cần upload
 * @param {Function} onProgress - Callback theo dõi tiến trình (optional)
 * @returns {Promise<Object>} - Kết quả upload
 */
export const uploadTourImages = async (tourId, images, onProgress) => {
    if (!images || images.length === 0) {
        return { success: true, data: null, message: 'Không có ảnh để upload' };
    }

    try {
        const formData = new FormData();

        // Thêm tất cả ảnh vào FormData
        images.forEach((image, index) => {
            formData.append('images', image);
        });

        // Upload với progress tracking
        const response = await axiosClient.post(`/tours/${tourId}/images`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentComplete = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress(percentComplete);
                }
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error uploading tour images:', error);
        throw error;
    }
};

/**
 * Upload ảnh ở background (không block UI)
 * Gọi hàm này KHÔNG cần await
 * @param {number} tourId - ID của tour
 * @param {File[]} images - Mảng ảnh cần upload
 */
export const uploadTourImagesBackground = (tourId, images) => {
    if (!images || images.length === 0) return;

    // Chạy ở background - không block UI
    (async () => {
        try {
            const toastId = toast.loading('📤 Đang upload ảnh...');

            const response = await uploadTourImages(tourId, images, (progress) => {
                // Có thể theo dõi progress nếu cần
                console.log(`Upload progress: ${progress}%`);
            });

            if (response.success) {
                toast.success(`✅ ${response.data.images_count || images.length} ảnh đã được upload thành công!`, {
                    id: toastId,
                });
            } else {
                toast.error(`❌ Upload ảnh thất bại: ${response.message}`, {
                    id: toastId,
                });
            }
        } catch (error) {
            toast.error('❌ Lỗi upload ảnh: ' + (error.response?.data?.message || error.message), {
                duration: 4000,
            });
        }
    })();
};

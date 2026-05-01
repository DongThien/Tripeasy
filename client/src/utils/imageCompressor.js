/**
 * Nén ảnh bằng Canvas API (không cần external library)
 * @param {File} file - File ảnh cần nén
 * @param {number} maxWidth - Chiều rộng tối đa (default: 1024px)
 * @param {number} quality - Chất lượng 0-1 (default: 0.8)
 * @returns {Promise<File>} - File ảnh đã nén
 */
export const compressImage = (file, maxWidth = 1024, quality = 0.8) => {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Tính toán kích thước mới giữ tỷ lệ
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                // Vẽ ảnh lên canvas
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Chuyển canvas thành Blob
                canvas.toBlob(
                    (blob) => {
                        // Tạo File object từ Blob
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });

                        // Log thông tin nén
                        const originalSize = (file.size / 1024).toFixed(2);
                        const compressedSize = (compressedFile.size / 1024).toFixed(2);
                        const ratio = ((1 - compressedFile.size / file.size) * 100).toFixed(1);
                        console.log(
                            `✅ Nén ảnh: ${file.name} | Gốc: ${originalSize}KB → Nén: ${compressedSize}KB (↓${ratio}%)`
                        );

                        resolve(compressedFile);
                    },
                    'image/jpeg',
                    quality
                );
            };

            img.onerror = () => {
                console.error('Error loading image:', file.name);
                // Nếu lỗi, trả về file gốc
                resolve(file);
            };

            img.src = event.target.result;
        };

        reader.onerror = () => {
            console.error('Error reading file:', file.name);
            // Nếu lỗi, trả về file gốc
            resolve(file);
        };

        reader.readAsDataURL(file);
    });
};

/**
 * Nén nhiều ảnh song song
 * @param {File[]} files - Mảng file cần nén
 * @returns {Promise<File[]>} - Mảng file đã nén
 */
export const compressImages = async (files) => {
    try {
        const compressedFiles = await Promise.all(
            files.map(file => compressImage(file))
        );
        return compressedFiles;
    } catch (error) {
        console.error('Error compressing images:', error);
        return files; // Trả về file gốc nếu lỗi
    }
};

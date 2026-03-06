import React from 'react';
import { Image as ImageIcon, UploadCloud, Plus, X } from 'lucide-react';

const TourImageUploadSection = ({
    images,
    setImages,
    imagePreviews,
    setImagePreviews,
    handleImageUpload,
    handleDrop,
    removeImage
}) => {
    return (
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
    );
};

export default TourImageUploadSection;
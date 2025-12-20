import React, { useState, useRef, useCallback } from 'react';
import { Camera, X, Check, Loader2, Scissors } from 'lucide-react';
import { router } from '@inertiajs/react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage';
import style from '@/css/profileSettingsModal.module.css';

export default function ProfileSettingsModal({ isOpen, onClose, user }) {

    // 🔹 ALL HOOKS FIRST (NO CONDITIONS)
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    // ✅ SAFE EARLY RETURN (AFTER HOOKS)
    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setError('File is too large (max 2MB)');
            return;
        }

        setError(null);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setIsCropping(true);
        };
        reader.readAsDataURL(file);
    };

    const handleApplyCrop = async () => {
        if (!croppedAreaPixels) return;

        setIsUploading(true);
        try {
            const croppedImage = await getCroppedImg(imagePreview, croppedAreaPixels);
            setSelectedFile(croppedImage);
            setImagePreview(URL.createObjectURL(croppedImage));
            setIsCropping(false);
        } catch {
            setError('Failed to crop image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('profile_pic', selectedFile);

        router.post(route('profile.update-picture'), formData, {
            forceFormData: true,
            onSuccess: () => {
                setIsUploading(false);
                onClose();
            },
            onError: () => setIsUploading(false),
        });
    };

    return (
        <div
            className={style.overlay}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className={style.modal}>
                <div className={style.header}>
                    <h2>Profile Settings</h2>
                    <button onClick={onClose} className={style.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                <div className={style.body}>
                    {!isCropping ? (
                        <>
                            <div className={style.avatarWrapper}>
                                <div className={style.avatar}>
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" />
                                    ) : user.avatar_url ? (
                                        <img src={user.avatar_url} alt={user.name} />
                                    ) : (
                                        user.name?.charAt(0).toUpperCase()
                                    )}
                                </div>

                                <button
                                    className={style.camBtn}
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <Camera size={20} />
                                </button>
                            </div>

                            <h3>{user.name}</h3>
                            <p>{user.email}</p>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                hidden
                            />

                            {error && <p className={style.errorMsg}>{error}</p>}

                            {imagePreview && selectedFile && (
                                <button
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className={style.saveBtn}
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 size={18} className={style.spin} />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={18} className={style.mr_2} />
                                            Save Picture
                                        </>
                                    )}
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <div className={style.cropperContainer}>
                                <Cropper
                                    image={imagePreview}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                            </div>

                            <input
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                onChange={(e) => setZoom(e.target.value)}
                                className={style.zoomSlider}
                            />

                            <div className={style.cropActions}>
                                <button
                                    onClick={() => setIsCropping(false)}
                                    className={style.cancelBtn}
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleApplyCrop}
                                    disabled={isUploading}
                                    className={style.saveBtn}
                                >
                                    {isUploading ? (
                                        <Loader2 size={18} className={style.spin} />
                                    ) : (
                                        <>
                                            <Scissors size={18} className={style.mr_2} />
                                            Apply Crop
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

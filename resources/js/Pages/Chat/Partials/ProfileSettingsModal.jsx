import React, { useState, useRef, useCallback } from 'react';
import { Camera, X, Check, Loader2, Scissors } from 'lucide-react';
import { router } from '@inertiajs/react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropImage';
import style from '@/css/profileSettingsModal.module.css';

export default function ProfileSettingsModal({ isOpen, onClose, user }) {
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isCropping, setIsCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const fileInputRef = useRef(null);

    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size < 2 * 1024 * 1024) {
            setError(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setIsCropping(true);
            };
            reader.readAsDataURL(file);
        } else if (file) {
            setError('File is too large (max 2MB)');
        }
    };

    const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleApplyCrop = async () => {
        setIsUploading(true);
        setError(null);
        try {
            const croppedImage = await getCroppedImg(imagePreview, croppedAreaPixels);
            setSelectedFile(croppedImage);
            setImagePreview(URL.createObjectURL(croppedImage));
            setIsCropping(false);
        } catch (e) {
            console.error(e);
            setError('Failed to crop image. Please try another one.');
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
            onError: (errors) => {
                setIsUploading(false);
                console.error(errors);
            }
        });
    };

    return (
        <div className={style.overlay} onClick={onClose}>
            <div className={style.modal} onClick={e => e.stopPropagation()}>
                <div className={style.content}>
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

                                    {imagePreview ? (
                                        <button
                                            onClick={() => {
                                                setImagePreview(null);
                                                setSelectedFile(null);
                                            }}
                                            className={style.cancelSelectionBtn}
                                            title="Cancel Selection"
                                        >
                                            <X size={16} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className={style.camBtn}
                                        >
                                            <Camera size={20} />
                                        </button>
                                    )}
                                </div>

                                <div className={style.userInfo}>
                                    <h3 className={style.userName}>{user.name}</h3>
                                    <p className={style.userEmail}>{user.email}</p>
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />

                                {error && <p className={style.errorMsg}>{error}</p>}

                                <p className={style.footerNote}>
                                    Only JPG, PNG or GIF. Max 2MB.
                                </p>
                            </>
                        ) : (
                            <div className="w-full">
                                <div className={style.cropHeader}>
                                    <h3>Select relevant area</h3>
                                    <p>Drag and zoom to fit the square</p>
                                </div>
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
                                {error && <p className={style.errorMsg}>{error}</p>}
                                <div className={style.cropControls}>
                                    <input
                                        type="range"
                                        value={zoom}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        aria-labelledby="Zoom"
                                        onChange={(e) => setZoom(e.target.value)}
                                        className={style.zoomSlider}
                                    />
                                    <div className={style.cropActions}>
                                        <button
                                            onClick={() => {
                                                setIsCropping(false);
                                                setImagePreview(null);
                                                setError(null);
                                            }}
                                            className={`${style.saveBtn} ${style.cropCancelBtn}`}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleApplyCrop}
                                            disabled={isUploading}
                                            className={style.saveBtn}
                                        >
                                            {isUploading ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <>
                                                    <Scissors size={18} />
                                                    Apply Crop
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

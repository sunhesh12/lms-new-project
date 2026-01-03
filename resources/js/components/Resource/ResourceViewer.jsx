import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFile,
    faFilePdf,
    faFileWord,
    faFileExcel,
    faFilePowerpoint,
    faFileImage,
    faFileVideo,
    faFileArchive,
    faDownload,
    faExpand,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./css/resource-viewer.module.css";

export default function ResourceViewer({ resource, basePath = "/storage/uploads/resources" }) {
    const [isImageExpanded, setIsImageExpanded] = useState(false);
    
    if (!resource || resource.is_deleted) return null;

    const fileName = resource.url.split("/").pop() || resource.url;
    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    
    // Determine file type
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext);
    const isVideo = ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(ext);
    const isPdf = ext === 'pdf';
    const isWord = ['doc', 'docx'].includes(ext);
    const isExcel = ['xls', 'xlsx', 'csv'].includes(ext);
    const isPowerpoint = ['ppt', 'pptx'].includes(ext);
    const isArchive = ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext);
    
    // Get appropriate icon
    const getFileIcon = () => {
        if (isPdf) return faFilePdf;
        if (isWord) return faFileWord;
        if (isExcel) return faFileExcel;
        if (isPowerpoint) return faFilePowerpoint;
        if (isImage) return faFileImage;
        if (isVideo) return faFileVideo;
        if (isArchive) return faFileArchive;
        return faFile;
    };

    // Get file type label for accessibility
    const getFileTypeLabel = () => {
        if (isImage) return 'Image file';
        if (isVideo) return 'Video file';
        if (isPdf) return 'PDF document';
        if (isWord) return 'Word document';
        if (isExcel) return 'Excel spreadsheet';
        if (isPowerpoint) return 'PowerPoint presentation';
        if (isArchive) return 'Archive file';
        return 'File';
    };

    const fileUrl = `${basePath}/${resource.url}`;
    const downloadUrl = fileUrl; // Can be modified to use a download route if needed

    const handleDownload = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImageClick = () => {
        if (isImage) {
            setIsImageExpanded(true);
        }
    };

    return (
        <>
            <div 
                className={styles.resourceCard}
                role="article"
                aria-label={`${getFileTypeLabel()}: ${resource.caption || fileName}`}
            >
                {/* Resource Header */}
                <div className={styles.resourceHeader}>
                    <div className={styles.resourceInfo}>
                        <div className={styles.fileIconContainer}>
                            <FontAwesomeIcon 
                                icon={getFileIcon()} 
                                className={styles.fileIcon}
                                aria-hidden="true"
                            />
                        </div>
                        <div className={styles.resourceDetails}>
                            <h4 className={styles.resourceTitle}>
                                {resource.caption || fileName}
                            </h4>
                            <p className={styles.fileName} aria-label={`File name: ${fileName}`}>
                                {fileName}
                            </p>
                        </div>
                    </div>
                    <div className={styles.resourceActions}>
                        <button
                            className={styles.actionButton}
                            onClick={handleDownload}
                            aria-label={`Download ${resource.caption || fileName}`}
                            title={`Download ${fileName}`}
                        >
                            <FontAwesomeIcon icon={faDownload} />
                            <span className={styles.srOnly}>Download</span>
                        </button>
                        {isImage && (
                            <button
                                className={styles.actionButton}
                                onClick={handleImageClick}
                                aria-label={`Expand ${resource.caption || fileName}`}
                                title="View full size"
                            >
                                <FontAwesomeIcon icon={faExpand} />
                                <span className={styles.srOnly}>Expand image</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Resource Content */}
                <div className={styles.resourceContent}>
                    {isImage ? (
                        <div 
                            className={styles.imageContainer}
                            role="img"
                            aria-label={resource.caption || fileName}
                        >
                            <img 
                                src={fileUrl} 
                                alt={resource.caption || fileName}
                                className={styles.image}
                                onClick={handleImageClick}
                                loading="lazy"
                            />
                        </div>
                    ) : isVideo ? (
                        <div className={styles.videoContainer}>
                            <video 
                                controls 
                                className={styles.video}
                                aria-label={resource.caption || fileName}
                            >
                                <source src={fileUrl} type={`video/${ext}`} />
                                <track kind="captions" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ) : isPdf ? (
                        <div className={styles.documentContainer}>
                            <iframe
                                src={fileUrl}
                                className={styles.pdfViewer}
                                title={resource.caption || fileName}
                                aria-label={`PDF viewer for ${resource.caption || fileName}`}
                            />
                            <div className={styles.documentFallback}>
                                <a 
                                    href={fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={styles.documentLink}
                                    aria-label={`Open ${resource.caption || fileName} in new tab`}
                                >
                                    Open PDF in new tab
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.fileContainer}>
                            <div className={styles.filePreview}>
                                <FontAwesomeIcon 
                                    icon={getFileIcon()} 
                                    className={styles.largeFileIcon}
                                    aria-hidden="true"
                                />
                                <p className={styles.fileType}>{ext.toUpperCase()} File</p>
                            </div>
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.fileLink}
                                aria-label={`Open ${resource.caption || fileName} in new tab`}
                            >
                                Open {fileName}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Modal/Expanded View */}
            {isImageExpanded && (
                <div 
                    className={styles.imageModal}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Expanded view of ${resource.caption || fileName}`}
                    onClick={() => setIsImageExpanded(false)}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            setIsImageExpanded(false);
                        }
                    }}
                    tabIndex={-1}
                >
                    <button
                        className={styles.closeButton}
                        onClick={() => setIsImageExpanded(false)}
                        aria-label="Close expanded view"
                        autoFocus
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <div 
                        className={styles.expandedImageContainer}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img 
                            src={fileUrl} 
                            alt={resource.caption || fileName}
                            className={styles.expandedImage}
                        />
                    </div>
                </div>
            )}
        </>
    );
}


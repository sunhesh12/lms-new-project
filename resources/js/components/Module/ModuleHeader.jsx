import styles from "./css/module-header.module.css";

export default function ModuleHeader({moduleName, subTitle, coverImage}) {
    // Construct the full image path if coverImage is provided
    const imageSrc = coverImage 
        ? (coverImage.startsWith('/') ? coverImage : `/storage/uploads/modules/${coverImage}`)
        : '/images/welcome-image.png';
    
    return (
        <header id="module-header" className={styles.moduleHeader}>
            <div id="module-cover" className={styles.moduleCoverContainer}>
                <img
                    className={styles.coverImage}
                    src={imageSrc}
                    alt={moduleName || 'Module cover'}
                    onError={(e) => {
                        // Fallback to default image if the uploaded image fails to load
                        e.target.src = '/images/welcome-image.png';
                    }}
                />
                <div className={styles.gradientOverlay} />
            </div>
            <div id="module-info" className={styles.moduleInfo}>
                <h1>{moduleName}</h1>
                <p>{subTitle}</p>
            </div>
        </header>
    );
}

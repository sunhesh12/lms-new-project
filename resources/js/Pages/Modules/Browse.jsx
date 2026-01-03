import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { BookOpen, Search, UserPlus, ArrowRight, ShieldCheck, Star } from "lucide-react";
import styles from "@/css/modules.module.css";
import { useState } from "react";

export default function Browse({ modules }) {
    const { auth } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");

    // Filter modules based on search term
    const filteredModules = modules.filter(module => 
        module.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        module.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const ModuleCard = ({ module }) => (
        <div className={styles.card}>
            {/* Cover Image Section */}
            <div className={styles.imageSection}>
                <div className={styles.imageOverlay} />
                {module.cover_image_url ? (
                    <img
                        src={`/storage/uploads/modules/${module.cover_image_url}`}
                        alt={module.name}
                        className={styles.image}
                    />
                ) : (
                    <div className={styles.placeholderImage}>
                        <BookOpen size={48} className={styles.placeholderIcon} />
                    </div>
                )}
                
                <div className={styles.creditBadge}>
                    {module.credit_value} Credits
                </div>
            </div>

            {/* Content Section */}
            <div className={styles.content}>
                <h3 className={styles.cardTitle}>{module.name}</h3>
                <p className={styles.cardDesc}>{module.description}</p>
                
                {module.lecturers && module.lecturers.length > 0 && (
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={12} />
                        {module.lecturers.map(l => l.user.name).join(", ")}
                    </div>
                )}

                <div className={styles.cardFooter}>
                    {module.is_enrolled ? (
                        <Link
                            href={route('module.show', module.id)}
                            className={styles.footerAction}
                            style={{ color: '#16a34a' }} // Green for enrolled
                        >
                            <span>Enter Learning Space</span>
                            <ArrowRight size={16} className={styles.arrowIcon} />
                        </Link>
                    ) : (
                        <Link
                            href={route('module.join_page', module.id)}
                            className={styles.footerAction}
                            style={{ color: '#2563eb' }}
                        >
                            <span>Enroll Now</span>
                            <UserPlus size={16} className={styles.arrowIcon} />
                        </Link>
                    )}
                </div>
            </div>
            
            <div className={styles.bottomGlow} />
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Browse Catalogue
                    </h2>
                </div>
            }
        >
            <Head title="Browse Modules" />

            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Explore Modules</h1>
                    <p className={styles.subtitle}>
                        Discover new courses and expand your knowledge.
                    </p>
                    
                    {/* Search Bar */}
                    <div style={{ 
                        marginTop: '20px', 
                        maxWidth: '500px', 
                        position: 'relative', 
                        background: 'white', 
                        borderRadius: '8px', 
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 15px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}>
                        <Search size={20} color="#9ca3af" />
                        <input 
                            type="text" 
                            placeholder="Search modules..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                                border: 'none', 
                                outline: 'none', 
                                width: '100%', 
                                marginLeft: '10px', 
                                fontSize: '15px' 
                            }} 
                        />
                    </div>
                </header>

                <div className={styles.grid}>
                    {filteredModules.length > 0 ? (
                        filteredModules.map((module) => (
                            <ModuleCard key={module.id} module={module} />
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <p className={styles.emptySubtitle}>No modules found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

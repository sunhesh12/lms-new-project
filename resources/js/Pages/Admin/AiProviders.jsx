import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import styles from '@/css/aiProviders.module.css';

export default function AiProviders() {
    const { props } = usePage();
    const providers = props.providers || [];
    const [form, setForm] = useState({ name: '', identifier: '', api_key: '', base_url: '', enabled: true });
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await axios.put(route('admin.ai-providers.update', editingId), form);
            } else {
                await axios.post(route('admin.ai-providers.store'), form);
            }
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Failed to save provider');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (provider) => {
        setEditingId(provider.id);
        const apiKey = ''; // Don't show existing key for security
        setForm({
            name: provider.name,
            identifier: provider.identifier,
            api_key: apiKey,
            base_url: provider.base_url || '',
            enabled: Boolean(provider.enabled)
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm({ name: '', identifier: '', api_key: '', base_url: '', enabled: true });
    };

    const handleHealth = async (id) => {
        try {
            const resp = await axios.get(`/admin/ai-providers/${id}/health`);
            alert(resp.data.ok ? '✅ Service is Healthy' : '❌ Service Unhealthy: ' + JSON.stringify(resp.data));
        } catch (e) {
            alert('Health check failed: ' + e.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this provider?')) return;
        try {
            await axios.delete(route('admin.ai-providers.destroy', id));
            window.location.reload();
        } catch (e) {
            alert('Delete failed');
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="AI Providers" />

            <div className={styles.pageContainer}>
                <div className={styles.header}>
                    <h2 className={styles.title}>AI Service Providers</h2>
                </div>

                <div className={styles.grid}>
                    {/* Left Column: List */}
                    <div className={styles.card}>
                        <h3 className={styles.sectionTitle}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Active Providers
                        </h3>

                        <div className={styles.providerList}>
                            {providers.length === 0 && (
                                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                                    No providers configured yet.
                                </p>
                            )}

                            {providers.map((p) => (
                                <div key={p.id} className={styles.providerItem}>
                                    <div className={styles.providerInfo}>
                                        <div className={styles.providerName}>
                                            {p.name}
                                            <span className={styles.providerIdentifier}>{p.identifier}</span>
                                            {p.enabled ?
                                                <span style={{ color: '#10b981', fontSize: '0.8em' }}>●</span> :
                                                <span style={{ color: '#ef4444', fontSize: '0.8em' }}>●</span>
                                            }
                                        </div>
                                        <div className={styles.providerUrl}>{p.base_url || 'Default Cloud Endpoint'}</div>
                                    </div>
                                    <div className={styles.providerActions}>
                                        <button className={styles.testBtn} onClick={() => handleEdit(p)}>Edit</button>
                                        <button className={styles.testBtn} onClick={() => handleHealth(p.id)}>Test Connection</button>
                                        <button className={styles.deleteBtn} onClick={() => handleDelete(p.id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Add Form */}
                    <div className={styles.card}>
                        <h3 className={styles.sectionTitle}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {editingId ? 'Edit Provider' : 'Add New Provider'}
                        </h3>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Display Name</label>
                                <input
                                    className={styles.input}
                                    placeholder="e.g. OpenAI GPT-4"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Service Identifier</label>
                                <input
                                    className={styles.input}
                                    placeholder="openai, anthropic, gemini..."
                                    value={form.identifier}
                                    onChange={e => setForm({ ...form, identifier: e.target.value })}
                                    required
                                    disabled={!!editingId} // Identifier cannot be changed
                                    style={editingId ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>API Key {editingId && <span style={{ fontWeight: 'normal', fontSize: '0.8em' }}>(Leave blank to keep existing)</span>}</label>
                                <input
                                    className={styles.input}
                                    type="password"
                                    placeholder={editingId ? "********" : "sk-..."}
                                    value={form.api_key}
                                    onChange={e => setForm({ ...form, api_key: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Base URL (Optional)</label>
                                <input
                                    className={styles.input}
                                    placeholder="https://api.openai.com/v1"
                                    value={form.base_url}
                                    onChange={e => setForm({ ...form, base_url: e.target.value })}
                                />
                            </div>

                            <label className={styles.checkboxWrapper}>
                                <input
                                    type="checkbox"
                                    className={styles.checkbox}
                                    checked={form.enabled}
                                    onChange={e => setForm({ ...form, enabled: e.target.checked })}
                                />
                                <span className={styles.checkboxLabel}>Enable this provider</span>
                            </label>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className={styles.submitBtn} type="submit" disabled={loading}>
                                    {loading ? 'Saving...' : (editingId ? 'Update Provider' : 'Add Provider')}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '0.75rem',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--bg-main)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

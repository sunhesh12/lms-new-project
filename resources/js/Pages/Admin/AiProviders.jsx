import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';


export default function AiProviders() {
    const { props } = usePage();
    const providers = props.providers || [];
    const [form, setForm] = useState({ name: '', identifier: '', api_key: '', base_url: '', enabled: true });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post(route('admin.ai-providers.store'), form);
        window.location.reload();
    };

    const handleHealth = async (id) => {
        try {
            const resp = await axios.get(`/admin/ai-providers/${id}/health`);
            alert('Health: ' + JSON.stringify(resp.data));
        } catch (e) {
            alert('Health check failed: ' + e.message);
        }
    };

    return (
        <AuthenticatedLayout header={<h2>AI Providers</h2>}>
            <Head title="AI Providers" />

            <div className="aiProvidersWrapper">
                <h3 className="sectionTitle">Existing Providers</h3>
                <div className="aiProvidersList">
                    {providers.map((p) => (
                        <div key={p.id} className="aiProviderItem">
                            <div className="aiProviderMeta">
                                <div className="name">{p.name} (<span className="identifier">{p.identifier}</span>)</div>
                                <div className="identifier">{p.base_url}</div>
                            </div>
                            <div className="aiProviderActions">
                                <button className="btn btn-sm" onClick={() => handleHealth(p.id)}>Test</button>
                            </div>
                        </div>
                    ))}
                </div>

                <h3 className="sectionTitle">Add Provider</h3>
                <form onSubmit={handleSubmit} className="aiProviderForm">
                    <div className="full">
                        <input className="input" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                    </div>
                    <div>
                        <input className="input" placeholder="Identifier (openai|deepseek|gemini|claude)" value={form.identifier} onChange={e => setForm({...form, identifier: e.target.value})} required />
                    </div>
                    <div>
                        <input className="input" placeholder="API Key" value={form.api_key} onChange={e => setForm({...form, api_key: e.target.value})} />
                    </div>
                    <div className="full">
                        <input className="input" placeholder="Base URL (optional)" value={form.base_url} onChange={e => setForm({...form, base_url: e.target.value})} />
                    </div>
                    <div>
                        <label className="inlineFlex"><input type="checkbox" checked={form.enabled} onChange={e => setForm({...form, enabled: e.target.checked})} /> <span className="labelText">Enabled</span></label>
                    </div>
                    <div>
                        <button className="btn" type="submit">Add Provider</button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}

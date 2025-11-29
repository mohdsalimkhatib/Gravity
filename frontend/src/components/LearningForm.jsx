import React, { useState, useEffect } from 'react';

const LearningForm = ({ onSubmit, onCancel, initialData, categories = ['Job', 'Life'] }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: categories[0] || 'Job',
        date: new Date().toISOString().split('T')[0],
        tags: '',
        imageUrl: '',
        customProperties: {}
    });
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [customCategory, setCustomCategory] = useState('');
    const [uploading, setUploading] = useState(false);
    const [customProps, setCustomProps] = useState([]); // [{key: '', value: ''}, ...]

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            if (!categories.includes(initialData.category)) {
                setIsCustomCategory(true);
                setCustomCategory(initialData.category);
            }
            // Load custom properties
            if (initialData.customProperties) {
                const props = typeof initialData.customProperties === 'string'
                    ? JSON.parse(initialData.customProperties)
                    : initialData.customProperties;
                const propsArray = Object.entries(props).map(([key, value]) => ({ key, value }));
                setCustomProps(propsArray);
            }
        }
    }, [initialData, categories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'category') {
            if (value === 'CREATE_NEW') {
                setIsCustomCategory(true);
                setCustomCategory('');
                setFormData(prev => ({ ...prev, category: '' }));
            } else {
                setIsCustomCategory(false);
                setFormData(prev => ({ ...prev, category: value }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCustomCategoryChange = (e) => {
        setCustomCategory(e.target.value);
        setFormData(prev => ({ ...prev, category: e.target.value }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('https://localhost:8080/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const imageUrl = await response.text();
                setFormData(prev => ({ ...prev, imageUrl }));
            } else {
                console.error('Failed to upload image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleAddCustomProperty = () => {
        setCustomProps([...customProps, { key: '', value: '' }]);
    };

    const handleRemoveCustomProperty = (index) => {
        setCustomProps(customProps.filter((_, i) => i !== index));
    };

    const handleCustomPropertyChange = (index, field, value) => {
        const updated = [...customProps];
        updated[index][field] = value;
        setCustomProps(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert custom properties array to object
        const customPropertiesObj = {};
        customProps.forEach(prop => {
            if (prop.key.trim()) {
                customPropertiesObj[prop.key.trim()] = prop.value;
            }
        });
        const dataToSubmit = {
            ...formData,
            customProperties: Object.keys(customPropertiesObj).length > 0
                ? JSON.stringify(customPropertiesObj)
                : null
        };
        onSubmit(dataToSubmit);
    };

    return (
        <div className="card fade-in">
            <h2 style={{ marginBottom: '1.5rem' }}>{initialData ? 'Edit Learning' : 'Add New Learning'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="What did you learn?"
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</label>
                    {!isCustomCategory ? (
                        <select name="category" value={formData.category} onChange={handleChange}>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                            <option value="CREATE_NEW">+ Create New...</option>
                        </select>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={customCategory}
                                onChange={handleCustomCategoryChange}
                                placeholder="Enter new category name"
                                required
                                autoFocus
                            />
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => {
                                    setIsCustomCategory(false);
                                    setFormData(prev => ({ ...prev, category: categories[0] }));
                                }}
                                title="Cancel custom category"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                        placeholder="Describe your learning..."
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                    />
                    {uploading && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Uploading...</p>}
                    {formData.imageUrl && (
                        <div style={{ marginTop: '0.5rem' }}>
                            <img
                                src={formData.imageUrl}
                                alt="Preview"
                                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                            <button
                                type="button"
                                className="btn-secondary"
                                style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                            >
                                Remove Image
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Tags (comma separated)</label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="e.g. java, react, leadership"
                    />
                </div>

                {/* Custom Properties Section */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label style={{ fontWeight: '500' }}>Custom Properties</label>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={handleAddCustomProperty}
                            style={{ fontSize: '0.875rem', padding: '0.4rem 0.8rem' }}
                        >
                            + Add Property
                        </button>
                    </div>
                    {customProps.length === 0 ? (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                            No custom properties yet. Click "+ Add Property" to add fields like Source, Author, etc.
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {customProps.map((prop, index) => (
                                <div key={index} className="custom-property-row">
                                    <input
                                        type="text"
                                        placeholder="Property name (e.g., Source)"
                                        value={prop.key}
                                        onChange={(e) => handleCustomPropertyChange(index, 'key', e.target.value)}
                                        style={{ flex: '0 0 30%' }}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Value (e.g., https://example.com)"
                                        value={prop.value}
                                        onChange={(e) => handleCustomPropertyChange(index, 'value', e.target.value)}
                                        style={{ flex: '1' }}
                                    />
                                    <button
                                        type="button"
                                        className="btn-danger"
                                        onClick={() => handleRemoveCustomProperty(index)}
                                        style={{ fontSize: '0.875rem', padding: '0.4rem 0.8rem' }}
                                        title="Remove property"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="button" className="btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                        {initialData ? 'Update Learning' : 'Save Learning'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LearningForm;

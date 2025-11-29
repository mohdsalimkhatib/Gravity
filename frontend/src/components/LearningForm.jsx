import React, { useState, useEffect, useRef } from 'react';

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
    const editorRef = useRef(null);

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
            // Initialize editor with existing description
            if (initialData.description && editorRef.current) {
                editorRef.current.innerHTML = initialData.description;
            }
        } else {
            // Reset editor for new form
            if (editorRef.current) {
                editorRef.current.innerHTML = '';
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
            const response = await fetch('http://localhost:8080/api/upload', {
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

    const handleEditorChange = () => {
        if (editorRef.current) {
            const htmlContent = editorRef.current.innerHTML;
            setFormData(prev => ({ ...prev, description: htmlContent }));
        }
    };

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
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
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                        {/* Toolbar */}
                        <div style={{
                            padding: '8px',
                            borderBottom: '1px solid #e2e8f0',
                            background: '#f8fafc',
                            display: 'flex',
                            gap: '4px',
                            flexWrap: 'wrap'
                        }}>
                            <button
                                type="button"
                                onClick={() => execCommand('bold')}
                                style={{
                                    padding: '4px 8px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    background: 'white',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                                title="Bold"
                            >
                                B
                            </button>
                            <button
                                type="button"
                                onClick={() => execCommand('italic')}
                                style={{
                                    padding: '4px 8px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    background: 'white',
                                    cursor: 'pointer',
                                    fontStyle: 'italic'
                                }}
                                title="Italic"
                            >
                                I
                            </button>
                            <button
                                type="button"
                                onClick={() => execCommand('underline')}
                                style={{
                                    padding: '4px 8px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    background: 'white',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                                title="Underline"
                            >
                                U
                            </button>
                            <button
                                type="button"
                                onClick={() => execCommand('insertUnorderedList')}
                                style={{
                                    padding: '4px 8px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    background: 'white',
                                    cursor: 'pointer'
                                }}
                                title="Bullet List"
                            >
                                •
                            </button>
                            <button
                                type="button"
                                onClick={() => execCommand('insertOrderedList')}
                                style={{
                                    padding: '4px 8px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    background: 'white',
                                    cursor: 'pointer'
                                }}
                                title="Numbered List"
                            >
                                1.
                            </button>
                            <button
                                type="button"
                                onClick={() => execCommand('justifyLeft')}
                                style={{
                                    padding: '4px 8px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    background: 'white',
                                    cursor: 'pointer'
                                }}
                                title="Align Left"
                            >
                                ⬅
                            </button>
                            <button
                                type="button"
                                onClick={() => execCommand('justifyCenter')}
                                style={{
                                    padding: '4px 8px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    background: 'white',
                                    cursor: 'pointer'
                                }}
                                title="Align Center"
                            >
                                ⬌
                            </button>
                            <button
                                type="button"
                                onClick={() => execCommand('justifyRight')}
                                style={{
                                    padding: '4px 8px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '4px',
                                    background: 'white',
                                    cursor: 'pointer'
                                }}
                                title="Align Right"
                            >
                                ➡
                            </button>
                        </div>

                        {/* Editor */}
                        <div
                            ref={editorRef}
                            contentEditable
                            onInput={handleEditorChange}
                            style={{
                                minHeight: '200px',
                                padding: '12px',
                                outline: 'none',
                                fontFamily: 'inherit',
                                fontSize: '14px',
                                lineHeight: '1.6'
                            }}
                            placeholder="Describe your learning..."
                        />
                    </div>
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

import React, { useState, useEffect, useRef } from 'react';

const LearningForm = ({ onSubmit, onCancel, initialData, categories = ['Job', 'Life'] }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: categories[0] || 'Job',
        date: new Date().toISOString().split('T')[0],
        tags: '',
        attachments: [],
        customProperties: {}
    });
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [customCategory, setCustomCategory] = useState('');
    const [uploading, setUploading] = useState(false);
    const [customProps, setCustomProps] = useState([]); // [{key: '', value: ''}, ...]
    const editorRef = useRef(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                attachments: initialData.attachments ? (typeof initialData.attachments === 'string' ? JSON.parse(initialData.attachments) : initialData.attachments) : []
            });
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
            // Reset form
            setFormData({
                title: '',
                description: '',
                category: categories[0] || 'Job',
                date: new Date().toISOString().split('T')[0],
                tags: '',
                attachments: [],
                customProperties: {}
            });
            setCustomProps([]);
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

    const handleAddAttachments = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        const formDataObj = new FormData();
        files.forEach(file => formDataObj.append('files', file));

        try {
            const response = await fetch('/upload/multiple', {
                method: 'POST',
                body: formDataObj,
            });

            if (response.ok) {
                const newAttachments = JSON.parse(await response.text());
                setFormData(prev => ({
                    ...prev,
                    attachments: [...prev.attachments, ...newAttachments]
                }));
            } else {
                console.error('Failed to upload attachments');
            }
        } catch (error) {
            console.error('Error uploading attachments:', error);
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleReplaceAttachment = async (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formDataObj = new FormData();
        formDataObj.append('files', file);

        try {
            const response = await fetch('/upload/multiple', {
                method: 'POST',
                body: formDataObj,
            });

            if (response.ok) {
                const newAttachments = JSON.parse(await response.text());
                if (newAttachments.length > 0) {
                    setFormData(prev => {
                        const updated = [...prev.attachments];
                        updated[index] = newAttachments[0];
                        return { ...prev, attachments: updated };
                    });
                }
            } else {
                console.error('Failed to replace attachment');
            }
        } catch (error) {
            console.error('Error replacing attachment:', error);
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    const handleRemoveAttachment = (index) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
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
            attachments: formData.attachments.length > 0 ? JSON.stringify(formData.attachments) : null,
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label style={{ fontWeight: '500' }}>Attachments</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx,.txt"
                            onChange={handleAddAttachments}
                            disabled={uploading}
                            style={{ fontSize: '0.875rem' }}
                        />
                    </div>
                    {uploading && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Uploading...</p>}
                    {formData.attachments.length === 0 ? (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                            No attachments yet. Select files above to add them.
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {formData.attachments.map((attachment, index) => {
                                const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(attachment.filename);
                                return (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        background: '#f8fafc'
                                    }}>
                                        {isImage ? (
                                            <img
                                                src={attachment.url}
                                                alt={attachment.filename}
                                                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '60px',
                                                height: '60px',
                                                background: '#e2e8f0',
                                                borderRadius: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.5rem',
                                                color: '#64748b'
                                            }}>
                                                📄
                                            </div>
                                        )}
                                        <div style={{ flex: '1', minWidth: '0' }}>
                                            <p style={{
                                                fontSize: '0.875rem',
                                                fontWeight: '500',
                                                margin: '0',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {attachment.filename}
                                            </p>
                                            <a
                                                href={attachment.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ fontSize: '0.75rem', color: '#3b82f6' }}
                                            >
                                                View/Download
                                            </a>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <label style={{ fontSize: '0.75rem', cursor: 'pointer', color: '#3b82f6' }}>
                                                Replace
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf,.doc,.docx,.txt"
                                                    onChange={(e) => handleReplaceAttachment(index, e)}
                                                    style={{ display: 'none' }}
                                                    disabled={uploading}
                                                />
                                            </label>
                                            <button
                                                type="button"
                                                className="btn-danger"
                                                onClick={() => handleRemoveAttachment(index)}
                                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                                title="Remove attachment"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
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

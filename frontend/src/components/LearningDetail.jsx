import React from 'react';

const LearningDetail = ({ learning, onClose, onEdit }) => {
    if (!learning) return null;

    return (
        <div className="detail-overlay" onClick={onClose}>
            <div className="detail-card" onClick={(e) => e.stopPropagation()}>
                <div className="detail-header">
                    <div>
                        <span className={`tag ${learning.category === 'Job' ? 'tag-job' : 'tag-life'}`}>
                            {learning.category}
                        </span>
                        <span className="date" style={{ marginLeft: '1rem' }}>{learning.date}</span>
                    </div>
                    <button className="close-button" onClick={onClose} aria-label="Close">
                        ✕
                    </button>
                </div>

                <h2 style={{ margin: '1.5rem 0 1rem', fontSize: '2rem', color: 'var(--text-primary)' }}>
                    {learning.title}
                </h2>

                {learning.attachments && (() => {
                    const attachments = typeof learning.attachments === 'string'
                        ? JSON.parse(learning.attachments)
                        : learning.attachments;

                    if (attachments.length === 0) return null;

                    return (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                Attachments
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {attachments.map((attachment, index) => {
                                    const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(attachment.filename);
                                    return (
                                        <div key={index} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            padding: '1rem',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '8px',
                                            background: 'var(--bg-secondary)'
                                        }}>
                                            {isImage ? (
                                                <img
                                                    src={attachment.url}
                                                    alt={attachment.filename}
                                                    style={{
                                                        width: '100px',
                                                        height: '100px',
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                        boxShadow: 'var(--shadow-sm)'
                                                    }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    background: 'var(--bg-tertiary)',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '2rem',
                                                    color: 'var(--text-secondary)'
                                                }}>
                                                    📄
                                                </div>
                                            )}
                                            <div style={{ flex: '1' }}>
                                                <p style={{
                                                    fontSize: '1rem',
                                                    fontWeight: '500',
                                                    margin: '0 0 0.5rem',
                                                    color: 'var(--text-primary)'
                                                }}>
                                                    {attachment.filename}
                                                </p>
                                                <a
                                                    href={attachment.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        fontSize: '0.875rem',
                                                        color: 'var(--primary-color)',
                                                        textDecoration: 'none'
                                                    }}
                                                >
                                                    {isImage ? 'View Image' : 'Download File'}
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })()}

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                        Description
                    </h3>
                    <div style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.8',
                        fontSize: '1rem'
                    }}
                    dangerouslySetInnerHTML={{ __html: learning.description || '' }}
                    />
                </div>

                {learning.tags && (
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                            Tags
                        </h3>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {learning.tags.split(',').map((tag, i) => (
                                <span
                                    key={i}
                                    style={{
                                        fontSize: '0.875rem',
                                        color: 'var(--primary-color)',
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        padding: '4px 12px',
                                        borderRadius: '6px',
                                        fontWeight: '500'
                                    }}
                                >
                                    #{tag.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {learning.customProperties && (() => {
                    const props = typeof learning.customProperties === 'string'
                        ? JSON.parse(learning.customProperties)
                        : learning.customProperties;
                    const entries = Object.entries(props);

                    if (entries.length === 0) return null;

                    return (
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                Custom Properties
                            </h3>
                            <div className="custom-property-display">
                                {entries.map(([key, value]) => {
                                    const isUrl = typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));
                                    return (
                                        <div key={key} className="custom-property-item">
                                            <span className="custom-property-key">{key}:</span>
                                            <span className="custom-property-value">
                                                {isUrl ? (
                                                    <a href={value} target="_blank" rel="noopener noreferrer">
                                                        {value}
                                                    </a>
                                                ) : (
                                                    value
                                                )}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })()}

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <button className="btn-secondary" onClick={onClose}>
                        Close
                    </button>
                    <button className="btn-primary" onClick={() => onEdit(learning)}>
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LearningDetail;

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

                {learning.imageUrl && (
                    <div style={{ marginBottom: '2rem' }}>
                        <img
                            src={learning.imageUrl}
                            alt={learning.title}
                            style={{
                                width: '100%',
                                borderRadius: '12px',
                                objectFit: 'contain',
                                maxHeight: '500px',
                                boxShadow: 'var(--shadow-md)'
                            }}
                        />
                    </div>
                )}

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                        Description
                    </h3>
                    <p style={{
                        color: 'var(--text-secondary)',
                        lineHeight: '1.8',
                        fontSize: '1rem',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {learning.description}
                    </p>
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

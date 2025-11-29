import React from 'react';

const LearningList = ({ learnings, onEdit, onDelete, onView }) => {
  if (!learnings.length) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3 style={{ color: 'var(--text-secondary)' }}>No learnings documented yet.</h3>
        <p>Start by adding a new learning!</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {learnings.map((learning, index) => (
        <div key={learning.id} className="card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span className={`tag ${learning.category === 'Job' ? 'tag-job' : 'tag-life'}`}>
              {learning.category}
            </span>
            <span className="date">{learning.date}</span>
          </div>

          <h3 style={{ margin: '0 0 0.5rem 0' }}>{learning.title}</h3>
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem' }}
               dangerouslySetInnerHTML={{ __html: learning.description || '' }}
          />

          {learning.imageUrl && (
            <div style={{ marginBottom: '1.5rem' }}>
              <img
                src={learning.imageUrl}
                alt={learning.title}
                style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', maxHeight: '300px' }}
              />
            </div>
          )}

          {learning.tags && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {learning.tags.split(',').map((tag, i) => (
                <span key={i} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
            <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => onView(learning)}>
              View
            </button>
            <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => onEdit(learning)}>
              Edit
            </button>
            <button className="btn-danger" onClick={() => onDelete(learning.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LearningList;

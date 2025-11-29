import React from 'react';

const LearningListTable = ({ learnings, onEdit, onDelete, onView, sortBy, setSortBy }) => {
    const [sortDirection, setSortDirection] = React.useState('desc'); // 'asc' or 'desc'

    const handleColumnClick = (column) => {
        if (sortBy === column) {
            // Toggle direction if clicking the same column
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // New column, default to ascending
            setSortBy(column);
            setSortDirection('asc');
        }
    };

    // Apply sort direction to learnings
    const sortedLearnings = [...learnings];
    if (sortDirection === 'desc' && sortBy === 'date') {
        // Date is already sorted desc by default, keep as is
    } else if (sortDirection === 'asc' && sortBy === 'date') {
        sortedLearnings.reverse();
    } else if (sortDirection === 'desc' && (sortBy === 'category' || sortBy === 'title')) {
        sortedLearnings.reverse();
    }

    const getSortIndicator = (column) => {
        if (sortBy !== column) return null;
        return sortDirection === 'asc' ? ' ↑' : ' ↓';
    };

    if (!learnings.length) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <h3 style={{ color: 'var(--text-secondary)' }}>No learnings documented yet.</h3>
                <p>Start by adding a new learning!</p>
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className="learning-table">
                <thead>
                    <tr>
                        <th
                            className="table-header sortable"
                            onClick={() => handleColumnClick('category')}
                            style={{ width: '120px' }}
                        >
                            Category{getSortIndicator('category')}
                        </th>
                        <th
                            className="table-header sortable"
                            onClick={() => handleColumnClick('title')}
                            style={{ width: '200px' }}
                        >
                            Title{getSortIndicator('title')}
                        </th>
                        <th className="table-header" style={{ width: 'auto', minWidth: '250px' }}>
                            Description
                        </th>
                        <th className="table-header" style={{ width: '150px' }}>
                            Tags
                        </th>
                        <th
                            className="table-header sortable"
                            onClick={() => handleColumnClick('date')}
                            style={{ width: '120px' }}
                        >
                            Date{getSortIndicator('date')}
                        </th>
                        <th className="table-header" style={{ width: '200px' }}>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedLearnings.map((learning, index) => (
                        <tr key={learning.id} className="table-row" style={{ animationDelay: `${index * 0.05}s` }}>
                            <td>
                                <span className={`tag ${learning.category === 'Job' ? 'tag-job' : 'tag-life'}`}>
                                    {learning.category}
                                </span>
                            </td>
                            <td style={{ fontWeight: '600' }}>
                                {learning.imageUrl && (
                                    <img
                                        src={learning.imageUrl}
                                        alt=""
                                        style={{
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '4px',
                                            objectFit: 'cover',
                                            marginRight: '8px',
                                            verticalAlign: 'middle'
                                        }}
                                    />
                                )}
                                {learning.title}
                            </td>
                            <td style={{ color: 'var(--text-secondary)' }}>
                                <div style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    lineHeight: '1.4'
                                }}
                                dangerouslySetInnerHTML={{ __html: learning.description || '' }}
                                />
                            </td>
                            <td>
                                {learning.tags && (
                                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                        {learning.tags.split(',').slice(0, 2).map((tag, i) => (
                                            <span
                                                key={i}
                                                style={{
                                                    fontSize: '0.7rem',
                                                    color: 'var(--text-secondary)',
                                                    background: '#f1f5f9',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                #{tag.trim()}
                                            </span>
                                        ))}
                                        {learning.tags.split(',').length > 2 && (
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                                +{learning.tags.split(',').length - 2}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </td>
                            <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                {learning.date}
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        className="btn-secondary"
                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                        onClick={() => onView(learning)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="btn-secondary"
                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                        onClick={() => onEdit(learning)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-danger"
                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                        onClick={() => onDelete(learning.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LearningListTable;

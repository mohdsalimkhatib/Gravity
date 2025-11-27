import React, { useState, useEffect } from 'react';
import LearningList from './components/LearningList';
import LearningListTable from './components/LearningListTable';
import LearningForm from './components/LearningForm';
import LearningDetail from './components/LearningDetail';

function App() {
  const [learnings, setLearnings] = useState([]);
  const [view, setView] = useState('list'); // 'list', 'add', 'edit', 'view'
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'category', 'title'
  const [viewMode, setViewMode] = useState('tiles'); // 'tiles' or 'list'

  useEffect(() => {
    fetchLearnings();
  }, []);

  const fetchLearnings = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/learnings');
      if (response.ok) {
        const data = await response.json();
        setLearnings(data);
      }
    } catch (error) {
      console.error('Error fetching learnings:', error);
    }
  };

  const handleAddClick = () => {
    setEditingItem(null);
    setView('add');
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setViewingItem(null);
    setView('edit');
  };

  const handleViewClick = (item) => {
    setViewingItem(item);
    setEditingItem(null);
    setView('view');
  };

  const handleCancel = () => {
    setView('list');
    setEditingItem(null);
    setViewingItem(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this learning?')) {
      try {
        await fetch(`http://localhost:8080/api/learnings/${id}`, {
          method: 'DELETE',
        });
        fetchLearnings();
      } catch (error) {
        console.error('Error deleting learning:', error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const url = editingItem
        ? `http://localhost:8080/api/learnings/${editingItem.id}`
        : 'http://localhost:8080/api/learnings';

      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchLearnings();
        setView('list');
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error saving learning:', error);
    }
  };

  const categories = [...new Set(learnings.map(l => l.category))];
  const defaultCategories = ['Job', 'Life'];
  const allCategories = [...new Set([...defaultCategories, ...categories])];

  const filteredLearnings = learnings.filter(learning => {
    const term = searchTerm.toLowerCase();
    const titleMatch = (learning.title || '').toLowerCase().includes(term);
    const descMatch = (learning.description || '').toLowerCase().includes(term);
    const tagsMatch = (learning.tags || '').toLowerCase().includes(term);
    const catMatch = (learning.category || '').toLowerCase().includes(term);

    return titleMatch || descMatch || tagsMatch || catMatch;
  });

  // Sort the filtered learnings
  const sortedLearnings = [...filteredLearnings].sort((a, b) => {
    if (sortBy === 'category') {
      return (a.category || '').localeCompare(b.category || '');
    } else if (sortBy === 'title') {
      return (a.title || '').localeCompare(b.title || '');
    } else {
      // Sort by date (newest first)
      return new Date(b.date) - new Date(a.date);
    }
  });

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', background: 'linear-gradient(135deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Gravity
          </h1>
          <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)' }}>Document your journey.</p>
        </div>

        {view === 'list' && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search learnings..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.625rem 1rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: 'white',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none',
              }}
            >
              <option value="date">Sort by Date</option>
              <option value="category">Sort by Category</option>
              <option value="title">Sort by Title</option>
            </select>

            {/* View Toggle Buttons */}
            <div style={{ display: 'flex', gap: '0.25rem', marginLeft: '0.5rem' }}>
              <button
                className={`view-toggle ${viewMode === 'tiles' ? 'active' : ''}`}
                onClick={() => setViewMode('tiles')}
                title="Tiles View"
              >
                ⊞
              </button>
              <button
                className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                ☰
              </button>
            </div>
          </div>
        )}

        {view === 'list' && (
          <button className="btn-primary" onClick={handleAddClick}>
            + Add Learning
          </button>
        )}
      </header>

      <main>
        {view === 'list' ? (
          viewMode === 'tiles' ? (
            <LearningList
              learnings={sortedLearnings}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              onView={handleViewClick}
            />
          ) : (
            <LearningListTable
              learnings={sortedLearnings}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              onView={handleViewClick}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          )
        ) : view === 'view' ? (
          <LearningDetail
            learning={viewingItem}
            onClose={handleCancel}
            onEdit={handleEditClick}
          />
        ) : (
          <LearningForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={editingItem}
            categories={allCategories}
          />
        )}
      </main>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import LearningList from './components/LearningList';
import LearningListTable from './components/LearningListTable';
import LearningForm from './components/LearningForm';
import LearningDetail from './components/LearningDetail';
import Login from './components/Login';
import Register from './components/Register';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, loading: authLoading, user, logout, token } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [learnings, setLearnings] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
    pageSize: 10,
    hasNext: false,
    hasPrevious: false
  });
  const [view, setView] = useState('list'); // 'list', 'add', 'edit', 'view'
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'category', 'title'
  const [viewMode, setViewMode] = useState('tiles'); // 'tiles' or 'list'

  // Fetch learnings when authenticated or search term changes
  useEffect(() => {
    if (isAuthenticated) {
      const timeoutId = setTimeout(() => {
        fetchLearnings(0, 10, searchTerm);
      }, searchTerm ? 300 : 0); // Debounce search, but fetch immediately on login
      return () => clearTimeout(timeoutId);
    } else {
      setLearnings([]); // Clear data if not authenticated
    }
  }, [isAuthenticated, searchTerm, token]);

  const fetchLearnings = async (page = 0, size = 10, searchTerm = '') => {
    try {
      const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/learnings?page=${page}&size=${size}${searchParam}`, {
        headers
      });

      if (response.ok) {
        const data = await response.json();
        setLearnings(data.learnings || []);
        setPagination({
          currentPage: data.currentPage || 0,
          totalItems: data.totalItems || 0,
          totalPages: data.totalPages || 0,
          pageSize: data.pageSize || 10,
          hasNext: data.hasNext || false,
          hasPrevious: data.hasPrevious || false
        });
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
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        await fetch(`/api/learnings/${id}`, {
          method: 'DELETE',
          headers
        });
        fetchLearnings(pagination.currentPage, 10, searchTerm);
      } catch (error) {
        console.error('Error deleting learning:', error);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const url = editingItem
        ? `/api/learnings/${editingItem.id}`
        : '/api/learnings';

      const method = editingItem ? 'PUT' : 'POST';

      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: method,
        headers,
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchLearnings(pagination.currentPage, 10, searchTerm);
        setView('list');
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error saving learning:', error);
    }
  };

  const handlePageChange = (newPage) => {
    fetchLearnings(newPage, 10, searchTerm);
  };

  const handlePreviousPage = () => {
    if (pagination.hasPrevious) {
      fetchLearnings(pagination.currentPage - 1, 10, searchTerm);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
      fetchLearnings(pagination.currentPage + 1, 10, searchTerm);
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

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Show login/register if not authenticated
  if (!isAuthenticated) {
    if (authView === 'login') {
      return <Login onSwitchToRegister={() => setAuthView('register')} />;
    } else {
      return <Register onSwitchToLogin={() => setAuthView('login')} />;
    }
  }

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 style={{ margin: 0, fontSize: '2rem', background: 'linear-gradient(135deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>

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
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {user?.username}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {user?.roles?.includes('ROLE_ADMIN') && '(Admin)'}
              </span>
            </div>
            <button className="btn-secondary" onClick={logout} style={{ padding: '0.5rem 1rem' }}>
              Logout
            </button>
            <button className="btn-primary" onClick={handleAddClick}>
              + Add Learning
            </button>
          </div>
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
            token={token}
          />
        )}

        {/* Pagination Controls */}
        {view === 'list' && pagination.totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '2rem',
            padding: '1rem',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            <button
              className="btn-secondary"
              onClick={handlePreviousPage}
              disabled={!pagination.hasPrevious}
              style={{
                opacity: pagination.hasPrevious ? 1 : 0.5,
                cursor: pagination.hasPrevious ? 'pointer' : 'not-allowed'
              }}
            >
              ← Previous
            </button>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Page {pagination.currentPage + 1} of {pagination.totalPages}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                ({pagination.totalItems} total items)
              </span>
            </div>

            <button
              className="btn-secondary"
              onClick={handleNextPage}
              disabled={!pagination.hasNext}
              style={{
                opacity: pagination.hasNext ? 1 : 0.5,
                cursor: pagination.hasNext ? 'pointer' : 'not-allowed'
              }}
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

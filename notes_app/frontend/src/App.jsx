import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getNotes = async () => {
    try {
      const res = await axios.get(`${API}/notes`);
      setNotes(res.data);
    } catch (err) {
      setError('Gagal memuat catatan.');
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Judul dan isi catatan tidak boleh kosong.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`${API}/notes/${editId}`, { title, content });
      } else {
        await axios.post(`${API}/notes`, { title, content });
      }
      setTitle('');
      setContent('');
      setEditId(null);
      getNotes();
    } catch (err) {
      setError('Gagal menyimpan catatan.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setEditId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus catatan ini?')) return;
    try {
      await axios.delete(`${API}/notes/${id}`);
      getNotes();
    } catch (err) {
      setError('Gagal menghapus catatan.');
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setTitle('');
    setContent('');
    setError('');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📝 Notes App</h1>
        <p className="subtitle">Simpan dan kelola catatan kamu</p>
      </header>

      <div className="form-card">
        <h2>{editId ? '✏️ Edit Catatan' : '➕ Tambah Catatan'}</h2>

        {error && <div className="error-msg">{error}</div>}

        <input
          className="input-field"
          type="text"
          placeholder="Judul catatan..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="textarea-field"
          placeholder="Isi catatan..."
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="form-actions">
          <button
            className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Menyimpan...' : editId ? 'Update' : 'Tambah'}
          </button>
          {editId && (
            <button className="btn btn-secondary" onClick={handleCancel}>
              Batal
            </button>
          )}
        </div>
      </div>

      <div className="notes-section">
        <h2>📋 Daftar Catatan ({notes.length})</h2>
        {notes.length === 0 ? (
          <div className="empty-state">Belum ada catatan. Tambahkan yang pertama!</div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <div key={note.id} className="note-card">
                <div className="note-header">
                  <h3 className="note-title">{note.title}</h3>
                  <span className="note-id">#{note.id}</span>
                </div>
                <p className="note-content">{note.content}</p>
                <div className="note-actions">
                  <button className="btn btn-edit" onClick={() => handleEdit(note)}>
                    ✏️ Edit
                  </button>
                  <button className="btn btn-delete" onClick={() => handleDelete(note.id)}>
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
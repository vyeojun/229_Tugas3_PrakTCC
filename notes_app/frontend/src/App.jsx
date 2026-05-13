import axios from 'axios';
import { useEffect, useState } from 'react';

const API = 'http://localhost:8080';

function App() {

  const [notes, setNotes] = useState([]);

  // INPUT STATE
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const getNotes = async () => {
    const res = await axios.get(`${API}/notes`);
    setNotes(res.data);
  };

  useEffect(() => {
    getNotes();
  }, []);

  const addNote = async () => {
    await axios.post(`${API}/notes`, {
      title,
      content
    });

    getNotes();
  };

  return (
    <div>

      <h1>Notes App</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      <br /><br />

      <button onClick={addNote}>
        Tambah
      </button>

      <hr />

      {notes.map((note) => (
        <div key={note.id}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
        </div>
      ))}

    </div>
  );
}

export default App;
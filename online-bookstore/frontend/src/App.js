
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({ title: '', author: '', image: null });
  const [auth, setAuth] = useState({ username: '', password: '', token: localStorage.getItem('token') });
  const [registerData, setRegisterData] = useState({ username: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(!!auth.token);

  const fetchBooks = async () => {
    const res = await fetch('/api/books', {
      headers: { Authorization: auth.token },
    });
    const data = await res.json();
    setBooks(data);
  };

  useEffect(() => {
    if (isLoggedIn) fetchBooks();
  }, [isLoggedIn]);

  const handleLogin = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: auth.username, password: auth.password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      setAuth({ ...auth, token: data.token });
      setIsLoggedIn(true);
    }
  };

  const handleRegister = async () => {
    await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData),
    });
    alert('User registered, now login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', formData.title);
    form.append('author', formData.author);
    if (formData.image) form.append('image', formData.image);

    await fetch('/api/books', {
      method: 'POST',
      body: form,
      headers: { Authorization: auth.token },
    });
    fetchBooks();
  };

  if (!isLoggedIn) {
    return (
      <div className="App">
        <h2>Login</h2>
        <input placeholder="Username" onChange={e => setAuth({ ...auth, username: e.target.value })} />
        <input type="password" placeholder="Password" onChange={e => setAuth({ ...auth, password: e.target.value })} />
        <button onClick={handleLogin}>Login</button>

        <h2>Register</h2>
        <input placeholder="Username" onChange={e => setRegisterData({ ...registerData, username: e.target.value })} />
        <input type="password" placeholder="Password" onChange={e => setRegisterData({ ...registerData, password: e.target.value })} />
        <button onClick={handleRegister}>Register</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Online Bookstore</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" onChange={e => setFormData({ ...formData, title: e.target.value })} required />
        <input type="text" placeholder="Author" onChange={e => setFormData({ ...formData, author: e.target.value })} required />
        <input type="file" accept="image/*" onChange={e => setFormData({ ...formData, image: e.target.files[0] })} />
        <button type="submit">Add Book</button>
      </form>
      <ul>
        {books.map(book => (
          <li key={book.id}>
            {book.image && <img src={book.image} alt={book.title} width="100" />}<br />
            {book.title} by {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

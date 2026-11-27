import React, { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { authorsEndpoint } from '../config';

const emptyAuthor = {
  name: '',
  email: '',
  location: '',
  github: '',
  twitter: '',
  latest_article_published: '',
};

const authorId = (author) => author.id ?? author.user_id;

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [form, setForm] = useState(emptyAuthor);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const requestHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  });

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await fetch(authorsEndpoint(), {
        method: 'GET',
        headers: requestHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAuthors(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch authors:', err);
      setError('Failed to load authors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const showCreateForm = () => {
    setForm(emptyAuthor);
    setEditingId(null);
    setNotice(null);
    setShowForm(true);
  };

  const showEditForm = (author) => {
    setForm({
      name: author.name || '',
      email: author.email || '',
      location: author.location || '',
      github: author.github || '',
      twitter: author.twitter || '',
      latest_article_published: author.latest_article_published || '',
    });
    setEditingId(authorId(author));
    setNotice(null);
    setShowForm(true);
  };

  const errorMessage = async (response, fallback) => {
    try {
      const data = await response.json();
      if (data.errors) {
        return Object.values(data.errors).flat().join(' ');
      }
      return data.error || data.message || fallback;
    } catch {
      return fallback;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice(null);

    try {
      const url = editingId
        ? `${authorsEndpoint()}/${editingId}`
        : authorsEndpoint();

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: requestHeaders(),
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(
          await errorMessage(response, `HTTP error! status: ${response.status}`)
        );
      }

      setShowForm(false);
      setNotice(editingId ? 'Author updated.' : 'Author added.');
      await fetchAuthors();
    } catch (err) {
      setNotice(`Could not save author: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (author) => {
    if (!window.confirm(`Delete ${author.name}?`)) return;

    setNotice(null);
    try {
      const response = await fetch(`${authorsEndpoint()}/${authorId(author)}`, {
        method: 'DELETE',
        headers: requestHeaders(),
      });

      if (!response.ok) {
        throw new Error(
          await errorMessage(response, `HTTP error! status: ${response.status}`)
        );
      }

      setNotice('Author deleted.');
      await fetchAuthors();
    } catch (err) {
      setNotice(`Could not delete author: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="loading-message">Loading authors...</div>;
  }

  return (
    <div className="authors-container">
      <div className="d-flex justify-content-between align-items-center">
        <h2>All Authors</h2>
        <Button variant="primary" onClick={showCreateForm}>Add author</Button>
      </div>

      {notice && (
        <Alert
          className="mt-3"
          variant={notice.startsWith('Could not') ? 'danger' : 'success'}
          onClose={() => setNotice(null)}
          dismissible
        >
          {notice}
        </Alert>
      )}

      {error && <Alert className="mt-3" variant="danger">Error: {error}</Alert>}

      {showForm && (
        <Form className="mt-3 mb-4" onSubmit={handleSubmit}>
          <h4>{editingId ? 'Edit author' : 'New author'}</h4>
          <Form.Group className="mb-2" controlId="authorName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="authorEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="authorLocation">
            <Form.Label>Location (letters only, no spaces)</Form.Label>
            <Form.Control
              name="location"
              value={form.location}
              onChange={handleChange}
              pattern="[A-Za-z]+"
              required
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="authorGithub">
            <Form.Label>GitHub username</Form.Label>
            <Form.Control
              name="github"
              value={form.github}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="authorTwitter">
            <Form.Label>Twitter username</Form.Label>
            <Form.Control
              name="twitter"
              value={form.twitter}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="authorArticle">
            <Form.Label>Latest article published</Form.Label>
            <Form.Control
              name="latest_article_published"
              value={form.latest_article_published}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <div className="d-flex gap-2">
            <Button type="submit" variant="success" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowForm(false)}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </Form>
      )}

      {authors.length > 0 ? (
        <table className="authors-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>GitHub</th>
              <th>Twitter</th>
              <th>Latest Article</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author) => (
              <tr key={authorId(author)}>
                <td>{author.name}</td>
                <td>{author.email}</td>
                <td>{author.location}</td>
                <td>
                  <a
                    href={`https://github.com/${author.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {author.github}
                  </a>
                </td>
                <td>
                  <a
                    href={`https://twitter.com/${author.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {author.twitter}
                  </a>
                </td>
                <td>{author.latest_article_published}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => showEditForm(author)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(author)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No authors found. Use "Add author" to create the first one.</p>
      )}
    </div>
  );
};

export default Authors;

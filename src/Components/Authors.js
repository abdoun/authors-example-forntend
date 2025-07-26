import React, { useState, useEffect } from 'react';

const Authors = () => {
  // 1. State for data, loading, and error
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. useEffect for fetching data
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const rawToken = localStorage.getItem('token');
        console.log('Raw token:', rawToken);

        const token = rawToken.replace(/^"(.*)"$/, '$1'); // remove wrapping quotes if any
        console.log('Clean token:', token);

        const response = await fetch('http://authors-backend/api/authors', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        
        // Handle non-successful HTTP responses
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAuthors(data);
        setError(null); // Clear any previous errors

      } catch (err) {
        // Handle network errors or other exceptions
        console.error("Failed to fetch authors:", err);
        setError("Failed to load authors. Please try again later.");

      } finally {
        // Always set loading to false, regardless of success or failure
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []); // The empty dependency array [] ensures this runs only once when the component mounts

  // 3. Conditional rendering based on state
  if (loading) {
    return <div className="loading-message">Loading authors...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  // 4. Render the list of authors
  return (
    <div className="authors-container">
      <h1>All Authors</h1>
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
            </tr>
          </thead>
          <tbody>
            {authors.map((author) => (
              <tr key={author.user_id}>
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
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No authors found.</p>
      )}
    </div>
  );
};

export default Authors;
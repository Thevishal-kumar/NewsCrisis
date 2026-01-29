import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px', color: '#fff' }}>
      <h1 style={{ fontSize: '72px', color: '#ff4d4d' }}>404</h1>
      <h2>Oops! Page Not Found</h2>
      <p>The link you followed might be broken, or the page may have been removed.</p>
      <Link to="/" style={{ color: '#00ccff', textDecoration: 'none', fontWeight: 'bold' }}>
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
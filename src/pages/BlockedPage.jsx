import React from 'react';
import { Navigate } from 'react-router-dom';

const BlockedPage = () => {
  // This page is shown if a user tries to access a restricted route
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <h1 style={{ color: '#d32f2f', fontSize: '2rem', marginBottom: '1rem' }}>Access Restricted</h1>
      <p style={{ fontSize: '1.2rem', color: '#555' }}>
        You do not have permission to access this page.
      </p>
      <button
        style={{ marginTop: '2rem', padding: '0.75rem 2rem', background: '#12b48b', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}
        onClick={() => window.location.href = '/dashboard'}
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default BlockedPage;

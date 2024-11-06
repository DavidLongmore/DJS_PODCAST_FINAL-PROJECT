// src/components/Loader.jsx
import React from 'react';

const Loader = () => (
    <div style={styles.loader}>
        <p>Loading...</p> {/* You could add a spinner here if preferred */}
    </div>
);

const styles = {
    loader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '20px',
        color: '#666',
    },
};

export default Loader;

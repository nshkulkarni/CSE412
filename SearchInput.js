// SearchInput.js
import React, { useState } from 'react';

function SearchInput({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for songs..."
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
}

export default SearchInput;

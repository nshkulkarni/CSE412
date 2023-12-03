// Home.js
import React, { useState } from 'react';
import SearchInput from './SearchInput';

function Home({ songs }) {
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (query) => {
        // Implement the logic to search for songs based on the query
        // Update the searchResults state with the search results
        // For example, you might fetch data from an API endpoint with the search query

        // Placeholder logic:
        setSearchResults(songs.filter((song) => song.title.includes(query)));
    };

    return (
        <div>
            <h1>Song List</h1>
            <SearchInput onSearch={handleSearch} />

            <ul>
                {searchResults.map((song) => (
                    <li key={song.id}>
                        <strong>Title:</strong> {song.title}, <strong>Artist:</strong> {song.artist}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Home;

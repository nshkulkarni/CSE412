import React, { useState, useEffect } from 'react';

function Playlist({ handleAddToPlaylist }) {
  const [playlistTitle, setPlaylistTitle] = useState('');
  const [playlists, setPlaylists] = useState([]);

  const handleCreatePlaylist = async () => {
    // Make a POST request to the backend for creating a new playlist
    try {
      const response = await fetch('http://localhost:4000/api/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: playlistTitle }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        // Refresh the playlists after creating a new one
        fetchPlaylists();
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchPlaylists = async () => {
    // Fetch all playlists from the backend
    try {
      const response = await fetch('http://localhost:4000/api/playlists');
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  // Fetch playlists on component mount
  useEffect(() => {
    fetchPlaylists();
  }, []);

  return (
    <div>
      <h1>Playlists</h1>
      <form>
        <label>
          Playlist Title:
          <input
            type="text"
            value={playlistTitle}
            onChange={(e) => setPlaylistTitle(e.target.value)}
          />
        </label>
        <button type="button" onClick={handleCreatePlaylist}>
          Create Playlist
        </button>
      </form>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.p_id}>{playlist.p_title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Playlist;

import React, { Fragment, useState, useEffect } from 'react';
import Playlist from './Playlist';

function Home() {
  const [title, setTitle] = useState("");
  const [song, setSong] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [playlists, setPlaylists] = useState([]);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/api/song/?title=${title}`);
      const parseResponse = await response.json();
      setSong(parseResponse);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleAddToPlaylist = async (songId) => {
    // Make a request to the backend to add the song to the selected playlist
    try {
      if (!selectedPlaylistId) {
        console.error("Please select a playlist.");
        return;
      }

      console.log("Playlist ID: ", selectedPlaylistId, "Song ID: ", songId);
      const response = await fetch(`http://localhost:4000/api/playlists/${selectedPlaylistId}/add-song`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songId }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        // Optionally, update the UI to reflect the change
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePlaylistChange = (e) => {
    setSelectedPlaylistId(e.target.value);
  };

  useEffect(() => {
    // Fetch playlists on component mount
    const fetchPlaylists = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/playlists');
        const data = await response.json();
        setPlaylists(data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <Fragment>
      <div className='home-container'>
        <div className='box1'>
          <h1>Search</h1>
          <form onSubmit={onSubmitForm}>
            <input
              type="text"
              name="title"
              className='text-box'
              placeholder="Enter song title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <button className='submitBtn'>Submit</button>
          </form>
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <table>
              <thead>
                <tr className='label'>
                  <th style={{ textAlign: 'left' }}>Song Title</th>
                  <th style={{ textAlign: 'left' }}>Artist Name</th>
                  <th style={{ textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody className='label'>
                {song.map(s => (
                  <tr key={s.s_serial}>
                    <td>{s.s_title}</td>
                    <td>{s.a_name}</td>
                    <td>
                      <select className='rounded-input' onChange={handlePlaylistChange}>
                        <option value="" disabled selected>Select Playlist</option>
                        {playlists.map(playlist => (
                          <option className='rounded-input' key={playlist.p_id} value={playlist.p_id}>{playlist.p_title}</option>
                        ))}
                      </select>
                      <button
                        className='btn'
                        onClick={() => handleAddToPlaylist(s.s_id)}
                        disabled={!selectedPlaylistId}
                      >
                        Add to Playlist
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
        <div className='box2'>
          {/* Right side - Playlist */}
          <Playlist />
        </div>
      </div>
    </Fragment>
  );
}

export default Home;

// Home.js
import React, { Fragment, useState } from 'react';
import Playlist from './Playlist'; // Import Playlist component


function Home() {
  const [title, setTitle] = useState("");
  const [song, setSong] = useState([]);
  const onSubmitForm = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:4000/api/song/?title=${title}`);

      const parseResponse = await response.json();

      setSong(parseResponse);
    } catch (err) {
      console.error(err.message)
    }
  }

  const handleAddToPlaylist = async (playlistId, songId) => {
    // Make a request to the backend to add the song to the selected playlist
    try {
      const response = await fetch(`http://localhost:4000/api/playlists/${playlistId}/add-song`, {
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

  return (
    <Fragment>
      <div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
        <h1>Search</h1>
        <form onSubmit={onSubmitForm}>
          <input
            type="text"
            name="title"
            placeholder="Enter song title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <button>Submit</button>
        </form>
        <table>
          <thead>
            <tr>
            <th style={{ textAlign: 'left' }}>Song Title</th>
            <th style={{ textAlign: 'left' }}>Artist Name</th>
            </tr>
          </thead>
          <tbody>
            {
              song.map(s => (
                <tr key={s.s_serial}>
                  <td>{s.s_title}</td>
                  <td>{s.a_name}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
        </div>
        <div style={{ flex: 1 }}>
          {/* Right side - Playlist */}
          <Playlist />
        </div>
      </div>
      </div>
    </Fragment>
  );

}

export default Home;

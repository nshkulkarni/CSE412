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
            const playlistsData = await response.json();

            // Fetch songs for each playlist
            const playlistsWithSongs = await Promise.all(
                playlistsData.map(async (playlist) => {
                    const songResponse = await fetch(`http://localhost:4000/api/playlists/${playlist.p_id}/songs`);
                    const songsData = await songResponse.json();
                    return { ...playlist, songs: songsData };
                })
            );

            setPlaylists(playlistsWithSongs);
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
                <input
                    type="text"
                    className='text-box'
                    placeholder='Enter playlist title'
                    value={playlistTitle}
                    onChange={(e) => setPlaylistTitle(e.target.value)}
                />
                <button className='btn' type="button" onClick={handleCreatePlaylist}>
                    Create Playlist
                </button>
            </form>
            <ul style={{listStyle: 'none'}}>
                {playlists.map((playlist) => (
                    <li className='playlist' key={playlist.p_id} style={{ marginBottom: '15px' }}>
                        {playlist.p_title}
                        {playlist.songs && playlist.songs.length > 0 && (
                            <ul style={{listStyle: 'none'}}>
                                {playlist.songs.map((song) => (
                                    <li key={song.s_id}>{song.s_title}</li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Playlist;

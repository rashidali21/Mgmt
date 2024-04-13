import React, { useState, useEffect } from 'react';
import img from '../assets/img.png';
import axios from 'axios';

const TopArtist = () => {
  const [artist, setArtist] = useState();

  useEffect(() => {
    if (!artist || artist.length === 0) {
      axios.get('http://127.0.0.1:5000/top_artist')
        .then(response => {
          setArtist(response.data.top_artist);
          console.log(response.data.top_artist);
        })
        .catch(error => {
          console.error('Error fetching top tracks:', error);
        });
    }
  }, [artist]);

  return (
    <div className="w-full pl-4">
      <h1 className="pb-4 pl-4 font-bold text-2xl text-gray-50">Top Artist</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {artist && artist.length > 0 && artist.map((artistName, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 8px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', marginBottom: '4px' }}>
              <img src={img} alt={artistName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <p className='text-sm text-gray-50'>{artistName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopArtist;

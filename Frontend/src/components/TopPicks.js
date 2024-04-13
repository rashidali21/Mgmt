import React, { useEffect, useState } from "react";
import img from "../assets/img.png";
import axios from 'axios';

const TopPicks = () => {
  const [track, setTrack] = useState();

  useEffect(() => {
    if (!track || track.length === 0) {
      axios.get('http://127.0.0.1:5000/top_track')
        .then(response => {
          setTrack(response.data.top_tracks);
          console.log(response.data.top_tracks);
        })
        .catch(error => {
          console.error('Error fetching top tracks:', error);
        });
    }
  }, [track]);

  return (
    <div className="w-full p-8">
      <h1 className="pb-2 font-bold text-2xl text-gray-50">Top Picks</h1>
      {track && track.length > 0 && track.map((track, index) => (
        <div
          key={index}
          className="w-full p-2 bg-slate-800 bg-opacity-7 rounded-md"
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={img}
              alt={track.track_name}
              style={{ width: "60px", height: "60px", marginRight: "10px" }}
            />
            <div>
              <div className="font-bold text-gray-200">{track.track_name}</div>
              <div className="text-xs text-gray-500">{track.artists}</div>
            </div>
          </div>
          <button className="mt-4 px-4 py-1 rounded-full bg-slate-600 text-sm font-bold text-white uppercase transform hover:scale-101 hover:bg-[#21e065] transition-colors duration-200 h-8 w-35">
            Play
          </button>

        </div>
      ))}
    </div>
  );
};

export default TopPicks;

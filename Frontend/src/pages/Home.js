import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SongCard from "../components/SongCard";
import TopPicks from "../components/TopPicks";
import TopArtist from "../components/TopArtist";
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

const Home = () => {

  const [result, setResult] = useState([
    { track_id: 1, track_name: "Song 1", artists: "Artist 1" },
    { track_id: 2, track_name: "Song 2", artists: "Artist 2" },
    { track_id: 3, track_name: "Song 3", artists: "Artist 3" },
  ]);

  const [search, setSearch] = useState('');

  const Recommend = () => {
    if (search.length === 0) {
      alert("Nothing has been searched!");
    }
    else {
      axios.post('http://127.0.0.1:5000/search', {
        text: search,
      })
        .then(function (response) {
          console.log(response);
          setResult(response.data)
        })
        .catch(function (error) {
          console.log(error, 'error');
          if (error.response.status === 401) {
            alert("Invalid search");
          }
        });
    }
  }

  return (
    <div className="grid md:grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-2 bg-slate-950 h-screen overflow-y-auto overflow-x-hidden">

        <div className="pt-5 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="relative w-1/2">
              <input
                type="search"
                placeholder="Search..."
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 rounded-full border border-black outline-none text-black bg-white placeholder-gray-400"
              />
              <FaSearch
                className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-3 text-black cursor-pointer"
                onClick={Recommend}
              />
            </div>
            <Link to={"/login"} className="inline-flex h-12 mt-4 mr-8 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              Login
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {result.length > 0 ? (
            result.map((song) => (
              <SongCard key={song.track_id} song={song} />
            ))
          ) : null
          }
        </div>

      </div>

      <aside className="lg:col-span-1 bg-slate-700">
        <TopPicks />
        <TopArtist />
      </aside>
    </div>

  );
};

export default Home;

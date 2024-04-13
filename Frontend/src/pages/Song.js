import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import SongCard from "../components/SongCard";
import img from '../assets/img.png';

const Song = () => {

    const [songs, setSongs] = useState([]);
    const location = useLocation();
    const song_name = location.state.song_name
    const artist_name = location.state.song_artist

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:5000/recommend', {
                    song_name: song_name,
                    artist_name: artist_name,
                });
                setSongs(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                if (error.response && error.response.status === 401) {
                    alert("Invalid search");
                }
            }
        };

        fetchData();

        return () => {
        };
    }, [location.state.song_name, location.state.song_artist]);

    return (
        <div className="flex flex-col h-screen bg-slate-950">
            <div className="flex-1 overflow-y-auto m-4">
                {song_name && (
                    <div className="grid grid-cols-2 justify-center items-center h-screen/2">
                        <div className="col-span-1 flex justify-end mx-4">
                            <img src={img} alt={song_name} className="h-60 w-auto" />
                        </div>
                        <div className="col-span-1">
                            <h2 className="text-2xl text-white font-bold">{song_name}</h2>
                            <p className="text-sm text-white font-bold mb-16">{artist_name}</p>
                            <audio controls autoPlay>
                                {/* <source src={} type="audio/mp3" /> */}
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </div>
                )}                <div className="flex flex-col mt-8">
                    <h2 className="text-2xl text-white font-bold mx-24">Recommendations</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                        {songs.length > 0 ? (
                            songs.map((song) => (
                                <SongCard key={song.track_id} song={song} />
                            ))
                        ) : null}
                    </div>
                </div>
            </div>
            <div className="flex items-end justify-center p-4">
                <button
                    className="px-8 py-2 rounded-full bg-slate-600 font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200"
                >
                    Play
                </button>
            </div>
        </div>
    );
};

export default Song;

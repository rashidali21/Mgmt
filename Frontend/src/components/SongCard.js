import img from '../assets/img.png';
import React, { useEffect, useState } from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';


function SongCard({ song }) {

  const [image, setImage] = useState();

  useEffect(() => {
    getData()
  })

  const getData = async () => {
    const options = {
      method: 'GET',
      url: 'https://spotify23.p.rapidapi.com/tracks/',
      params: {
        ids: `${song.track_id}`
      },
      headers: {
        'X-RapidAPI-Key': '4f69dea2dfmsh5928286bd0af087p1ad2b1jsn76b7993ac668',
        'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      setImage(response.data.tracks[0].album.images[0].url)
    } catch (error) {
      console.error(error);
    }
  }

  const navigate = useNavigate();

  const handlePlay = (song) => {
    console.log(song);
    navigate("/song", { state: { song_name: song.track_name, song_artist: song.artists }, });
  };

  return (
    <CardContainer className="inter-var mb-4">
      <CardBody className="bg-gray-50 relative group/card  flex flex-col items-center justify-center rounded-md my-2 mx-4 hover:shadow-2xl hover:shadow-emerald-500/[0.1] bg-slate-900 border-white/[0.2] border-black/[0.1] w-auto sm:w-[13rem] h-[22rem] rounded-xl p-6 border  ">
        <CardItem
          translateZ="50"
          className="text-l font-bold text-neutral-600 text-white text-center"
        >
          {song.track_name}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-xs max-w-sm mt-1 text-neutral-300 text-center"
        >
          {song.artists}
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <img
            src={image}
            height="1000"
            width="1000"
            className="h-30 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>
        <div className="flex justify-between items-center mb-2">
          <CardItem
            translateZ={20}
            className="px-4 py-2 rounded-xl text-xs font-normal text-white"
          >
            <button onClick={() => handlePlay(song)} className="px-8 py-2 rounded-full bg-slate-600 font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200">
              Play
            </button>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}


export default SongCard
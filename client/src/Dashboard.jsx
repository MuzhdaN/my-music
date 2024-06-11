import { useEffect, useState } from 'react';
import useAuth from './useAuth';
import SpotifyWebApi from 'spotify-web-api-node';
import SongResults from './SongResults';
import Player from './Player';


const spotifyApi = new SpotifyWebApi({
  clientId: import.meta.env.VITE_CLIENT_ID,
});

const Dashboard = ({ code }) => {
  const accessToken = useAuth(code);

  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [playingTrack, setPlayingTrack] = useState(null);

  function chooseTrack(track) {
    setPlayingTrack(track);
    setQuery('');
  }

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!query) return;
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(query).then((res) => {
      if (cancel) return;
      
      setData(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height > smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });

    return () => (cancel = true);
  }, [query, accessToken]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-evenly mb-8 md:flex-row flex-col-reverse py-7">

        <div className="w-2/4 mb-2 ">
          <input
            type="text"
            placeholder="Search for music"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border-b border-gray-300 py-2 px-4 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="ml-4">
          <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
        </div>
      </div>

    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-2">Results</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {data.map((item) => (
          <SongResults key={item.uri} item={item} chooseTrack={chooseTrack} />
        ))}
      </div>
    </div>
  </div>
  );
};

export default Dashboard;

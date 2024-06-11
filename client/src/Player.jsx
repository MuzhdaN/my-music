const Player = ({ accessToken, trackUri }) => {

  if (!accessToken || !trackUri) return null;

  const embedUrl = `https://open.spotify.com/embed/track/${trackUri.split(':')[2]}`;

  return (
    <div className="spotify-player">
      <iframe
        src={embedUrl}
        width="300"
        height="380"
        allow="encrypted-media"
        title="Spotify Player"
      ></iframe>
    </div>
  );
};

export default Player;

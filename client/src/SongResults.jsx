const SongResults = ({ item, chooseTrack }) => {
  function handlePlay() {
    console.log('Playing track:', item);
    chooseTrack(item);
  }

  return (
    <div className="bg-white rounded-xl shadow-xl" onClick={handlePlay}>
      <li className="flex items-center flex-col mb-4">
        <img src={item.albumUrl} className="h-52 w-auto mt-5" alt="album cover" />
        <span>{item.title}</span>
        <span className="text-gray-400">{item.artist}</span>
      </li>
    </div>
  );
};

export default SongResults;

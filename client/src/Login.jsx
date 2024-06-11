
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${import.meta.env.VITE_CLIENT_ID}&response_type=code&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

const Login = () => {
  return (
    <div className="h-lvh w-auto flex justify-center items-center">
        <a 
          className="btn bg-teal-400 rounded-xl p-6" 
          href={AUTH_URL}
        >
          Login with Spotify
        </a>
    </div>
  )
}

export default Login
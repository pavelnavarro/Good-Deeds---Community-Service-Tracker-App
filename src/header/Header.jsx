import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className="h-20 bg-[#409dc4] w-screen flex justify-evenly items-center text-white text-2xl shadow-lg">
      <Link to="/home">
        <button className="text-white text-5xl font-bold">GoodDeeds</button>
      </Link>
      <div className="flex space-x-6">
        <Link to="/streak">
          <button className="bg-[#5ab2da] hover:bg-[#66bde6] text-white py-2 px-6 rounded-full transition duration-300">
            Streak
          </button>
        </Link>
        <Link to="/events">
          <button className="bg-[#5ab2da] hover:bg-[#66bde6] text-white py-2 px-6 rounded-full transition duration-300">
            Events
          </button>
        </Link>
        <Link to="/logout">
          <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-full transition duration-300">
            Log Out
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Header;

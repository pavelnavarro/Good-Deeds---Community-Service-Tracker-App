import Login from "../Authentication/Login";
import { Link } from 'react-router-dom';

function LandingPage() {
    return (
        <div className="bg-[#b0e0f8] w-screen h-screen flex">
            {/* Left Section */}
            <div className="w-1/2 h-full flex items-center justify-center">
                <div className="pl-20">
                    <h2 className="text-8xl font-extrabold leading-snug text-[#0d3b66]">
                        <span className="text-[#1c84d1]">GOOD DEEDS</span> <br />
                        MAKE YOUR <span className="text-[#1c84d1]">COMMUNITY</span> BETTER
                    </h2>
                    <p className="mt-6 text-xl text-[#0d3b66] leading-relaxed">
                        Join us and start making an impact in your community by participating in meaningful volunteer work.
                    </p>
                </div>
            </div>

            {/* Right Section - Login */}
            <div className="bg-white w-1/2 h-full flex items-center justify-center">
                <div className="flex flex-col justify-center items-center bg-[#d0f1ff] p-10 rounded-2xl shadow-xl">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
                        {/* Login Form */}
                        <Login />

                        {/* Divider */}
                        <div className="h-[2px] w-full bg-gray-300 my-6"></div>

                        {/* Signup Link */}
                        <Link to="/signup">
                            <h2 className="text-2xl px-6 py-3 mb-4 border-4 rounded-full text-center font-semibold text-[#007bff] hover:bg-[#cce5ff] transition duration-300">
                                Create Account
                            </h2>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;

import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Firestore and Auth connection
import { collection, onSnapshot, deleteDoc, doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Header from "../header/Header";

function HomePage() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch events from Firestore in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const eventList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventList);
    });

    return () => unsubscribe();
  }, []);

  // Monitor the user's authentication state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Register for an event
  const handleRegister = async (eventId, eventName) => {
    if (!user) {
      alert("Please log in to register for an event.");
      return;
    }

    try {
      await setDoc(doc(db, "eventRegistrations", `${user.uid}_${eventId}`), {
        userId: user.uid,
        eventId: eventId,
        eventName: eventName,
        hoursApproved: 0,
        status: "registered",
        registeredAt: new Date(),
      });
      alert("Successfully registered for the event!");
    } catch (error) {
      console.error("Error registering for event: ", error);
      alert("Failed to register for the event. Please try again.");
    }
  };

  // Delete event
  const handleDelete = async (id) => {
    const eventDoc = doc(db, "events", id);
    try {
      await deleteDoc(eventDoc);
      alert("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event: ", error);
      alert("Failed to delete event. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="flex w-screen h-screen bg-gradient-to-r from-[#e4f4fd] to-[#ffffff] text-gray-800">
        {/* Filter Sidebar */}
        <div className="w-1/4 bg-[#f0f4f8] p-8 shadow-xl rounded-xl text-gray-800">
          <h2 className="text-2xl font-bold mb-8">Filters</h2>
          <div className="mb-8">
            <label className="block text-lg font-medium mb-4">City</label>
            <select className="w-full p-4 border-none rounded-lg focus:outline-none focus:ring-4 focus:ring-[#5ab2da] transition duration-300 bg-[#eaf6fb] text-gray-800">
              <option value="">All Cities</option>
              <option value="El Paso">El Paso</option>
              <option value="Juarez">Juarez</option>
            </select>
          </div>
          <div className="mb-8">
            <label className="block text-lg font-medium mb-4">Hours</label>
            <input
              type="text"
              className="w-full p-4 border-none rounded-lg focus:outline-none focus:ring-4 focus:ring-[#5ab2da] transition duration-300 bg-[#eaf6fb] text-gray-800"
              placeholder="e.g., 8:00 am - 7:00 pm"
            />
          </div>
          <div className="mb-8">
            <label className="block text-lg font-medium mb-4">Availability</label>
            <select className="w-full p-4 border-none rounded-lg focus:outline-none focus:ring-4 focus:ring-[#5ab2da] transition duration-300 bg-[#eaf6fb] text-gray-800">
              <option value="">Anytime</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </select>
          </div>
        </div>

        {/* Events List */}
        <div className="w-3/4 bg-[#ffffff] p-10 ml-6 shadow-xl rounded-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">Community Service Events</h2>
          <div className="grid grid-cols-1 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-[#abdffa] p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-500">
                <h3 className="text-2xl font-semibold text-[#409dc4] mb-4">{event.name}</h3>
                <p className="text-lg text-gray-700 mb-2">{event.description}</p>
                <p className="text-lg text-gray-600 mb-2">Location: {event.location}</p>
                <p className="text-lg text-gray-600 mb-2">Date: {event.date}</p>
                <p className="text-lg text-gray-600 mb-2">Address: {event.address}</p>
                <p className="text-lg text-gray-600 mb-2">User Limit: {event.userLimit}</p>

                {/* Register Button */}
                <button
                  onClick={() => handleRegister(event.id, event.name)}
                  className="mt-6 bg-[#409dc4] text-white py-3 px-6 rounded-full shadow-lg hover:bg-[#4da8cf] transition duration-300"
                >
                  Register for Event
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(event.id)}
                  className="mt-6 ml-4 bg-red-500 text-white py-3 px-6 rounded-full shadow-lg hover:bg-red-600 transition duration-300"
                >
                  Delete Event
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;

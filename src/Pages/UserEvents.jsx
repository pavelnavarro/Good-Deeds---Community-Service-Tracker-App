import React, { useState } from "react";
import { db } from "../firebase"; // Ensure you have Firebase set up
import { collection, addDoc } from "firebase/firestore";
import Header from "../header/Header"; // Restored the top menu

function UserEvents() {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    date: "",
    location: "El Paso",
    address: "",
    userLimit: 0,
  });

  const [successMessage, setSuccessMessage] = useState(""); // For success message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add new event to the Firestore collection
      await addDoc(collection(db, "events"), eventData);
      setSuccessMessage("Event created successfully!"); // Set success message
      // Reset form after successful submission
      setEventData({
        name: "",
        description: "",
        date: "",
        location: "El Paso",
        address: "",
        userLimit: 0,
      });
    } catch (error) {
      console.error("Error creating event: ", error);
      alert("Failed to create event. Please try again.");
    }
  };

  return (
    <>
      <Header /> {/* Top Menu Restored */}
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-indigo-600">
          Create a Community Service Event
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
        >
          {/* Name */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Event Name:
            </label>
            <input
              type="text"
              name="name"
              value={eventData.name}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter event name"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Description:
            </label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe the event"
              required
            />
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Date:
            </label>
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Location:
            </label>
            <select
              name="location"
              value={eventData.location}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="El Paso">El Paso</option>
              <option value="Juarez">Juarez</option>
            </select>
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Address:
            </label>
            <input
              type="text"
              name="address"
              value={eventData.address}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter address"
              required
            />
          </div>

          {/* User Limit */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              User Limit:
            </label>
            <input
              type="number"
              name="userLimit"
              value={eventData.userLimit}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Maximum number of participants"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 font-semibold shadow-lg"
          >
            Create Event
          </button>
        </form>

        {/* Success Message */}
        {successMessage && (
          <p className="text-green-600 text-lg text-center mt-4 font-semibold">
            {successMessage}
          </p>
        )}
      </div>
    </>
  );
}

export default UserEvents;

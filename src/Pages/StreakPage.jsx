import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Firestore and Auth connection
import { collection, doc, onSnapshot, updateDoc, addDoc, query, where, setDoc, deleteDoc, getDocs } from "firebase/firestore"; // Firestore functions
import { onAuthStateChanged } from "firebase/auth";
import Header from "../header/Header"; // Always show the header (menu)
import { FaCoins } from "react-icons/fa"; // Coin icon from react-icons

function StreakPage() {
  const [user, setUser] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]); // Track events the user is registered for
  const [newHours, setNewHours] = useState({}); // Track hours per event
  const totalRequiredHours = 100; // Total hours required for each event streak
  const [totalApprovedHours, setTotalApprovedHours] = useState(0); // Total approved hours across all events
  const totalRequiredGlobalHours = 500; // Total hours for the global streak certificate
  const [coins, setCoins] = useState(0); // Track user coins

  // Fetch registered events and approved hours for the current user
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        // Check if the user document exists and if "coins" field exists, otherwise initialize it
        const userDocRef = doc(db, "users", user.uid);
        const docSnapshot = await onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            // If the "coins" field doesn't exist, initialize it to 0
            if (!docSnapshot.data().hasOwnProperty("coins")) {
              updateDoc(userDocRef, { coins: 0 });
              setCoins(0); // Set local state coins to 0
            } else {
              setCoins(docSnapshot.data().coins || 0);
            }
          } else {
            // If the user document does not exist, create it with coins initialized to 0
            setDoc(userDocRef, { coins: 0 });
            setCoins(0); // Set local state coins to 0
          }
        });

        // Query only events registered by the user
        const eventQuery = query(
          collection(db, "eventRegistrations"),
          where("userId", "==", user.uid),
          where("status", "==", "registered")
        );

        // Listen to changes in the 'eventRegistrations' collection for the current user
        const unsubscribe = onSnapshot(eventQuery, (snapshot) => {
          const events = [];
          let totalHours = 0; // Track total approved hours across all events
          snapshot.docs.forEach((doc) => {
            const event = doc.data();
            events.push({
              eventId: event.eventId,
              eventName: event.eventName, // Use eventName from Firestore
              approvedHours: event.hoursApproved || 0, // Approved hours for this event
            });
            totalHours += event.hoursApproved || 0; // Add the approved hours for the event to the total
          });
          setRegisteredEvents(events);
          setTotalApprovedHours(totalHours); // Update the global approved hours
        });

        return () => {
          unsubscribe();
        };
      } else {
        setUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Listen to hour approvals for the user
  useEffect(() => {
    if (user) {
      // Query hourRequests where the status is "approved" for the current user
      const hourRequestQuery = query(
        collection(db, "hourRequests"),
        where("userId", "==", user.uid),
        where("status", "==", "approved")
      );

      const unsubscribeHourRequests = onSnapshot(hourRequestQuery, (snapshot) => {
        const approvedHoursMap = {};
        let totalApprovedHoursAcrossRequests = 0; // Track the approved hours from all requests

        snapshot.docs.forEach((doc) => {
          const request = doc.data();
          if (approvedHoursMap[request.eventId]) {
            approvedHoursMap[request.eventId] += request.hoursRequested;
          } else {
            approvedHoursMap[request.eventId] = request.hoursRequested;
          }
          totalApprovedHoursAcrossRequests += request.hoursRequested; // Add approved hours to the total
        });

        // Update the registered events with approved hours
        setRegisteredEvents((prevEvents) =>
          prevEvents.map((event) => ({
            ...event,
            approvedHours: approvedHoursMap[event.eventId]
              ? approvedHoursMap[event.eventId]
              : event.approvedHours,
          }))
        );

        setTotalApprovedHours(totalApprovedHoursAcrossRequests); // Update the total approved hours for the global bar

        // Calculate virtual coins earned based on 30-hour increments
        const earnedCoins = Math.floor(totalApprovedHoursAcrossRequests / 30) * 10;
        if (earnedCoins !== coins) {
          // Update the coin count in Firestore if new coins are earned
          const userDocRef = doc(db, "users", user.uid);
          updateDoc(userDocRef, { coins: earnedCoins }).then(() => {
            setCoins(earnedCoins); // Update local state
          });
        }
      });

      return () => unsubscribeHourRequests();
    }
  }, [user, totalApprovedHours]); // Recalculate coins whenever total approved hours change

  // Function to request hours for a specific event
  const handleRequestHours = async (e, eventId) => {
    e.preventDefault();
    const hoursRequested = parseInt(newHours[eventId]);

    if (isNaN(hoursRequested) || hoursRequested <= 0) {
      alert("Please enter a valid number of hours.");
      return;
    }

    // Add the hour request to Firestore for the specific event
    try {
      await addDoc(collection(db, "hourRequests"), {
        userId: user.uid,
        eventId: eventId,
        hoursRequested,
        status: "pending", // Default status is pending until admin approval
        requestedAt: new Date(),
      });

      // Clear the input for that specific event
      setNewHours((prevState) => ({ ...prevState, [eventId]: "" }));
      alert("Hours requested successfully! Waiting for approval.");
    } catch (error) {
      console.error("Error requesting hours: ", error);
      alert("Failed to request hours. Please try again.");
    }
  };

  // Function to unregister (remove the event registration) and delete the streak
  const handleUnregister = async (eventId) => {
    if (!window.confirm("Are you sure you want to unregister from this event?")) {
      return;
    }

    try {
      // Find the document in 'eventRegistrations' where userId and eventId match
      const eventQuery = query(
        collection(db, "eventRegistrations"),
        where("userId", "==", user.uid),
        where("eventId", "==", eventId)
      );

      const querySnapshot = await getDocs(eventQuery);

      if (!querySnapshot.empty) {
        // Assume only one document exists for this user/event combination
        const docId = querySnapshot.docs[0].id;

        // Delete the document using the found document ID
        await deleteDoc(doc(db, "eventRegistrations", docId));

        alert("You have successfully unregistered from the event!");
      } else {
        alert("No matching registration found.");
      }
    } catch (error) {
      console.error("Error unregistering from event: ", error);
      alert("Failed to unregister. Please try again.");
    }
  };

  // Function to generate a certificate for an event
  const generateCertificate = () => {
    window.open("https://drive.google.com/file/d/1yt1IM2a_z7qwCnJWPy3xmEL86kGzcbeH/view?usp=sharing", "_blank");
  };

  // Function to generate the global certificate when total hours reach 500
  const generateGlobalCertificate = () => {
    alert(`Congratulations! You have earned the global service certificate!`);
  };

  return (
    <>
      <Header /> {/* Restored the top menu */}
      
      {/* Coins and coin icon in the top-right corner */}
      {user && (
        <div className="absolute top-6 right-6 flex items-center bg-yellow-300 px-3 py-2 rounded-lg shadow-lg">
          <FaCoins className="text-yellow-500 text-xl mr-2" /> {/* Coin icon */}
          <span className="text-lg font-bold">{coins} Coins</span>
        </div>
      )}
      
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-extrabold mb-6 text-blue-600">Streak Page</h1> {/* Updated title design */}

        {user ? (
          <div>
            <h2 className="text-2xl mb-6 font-bold text-gray-700">Hello, {user.displayName || user.email}</h2> {/* User title design */}

            {/* Global Streak Bar for Total Hours */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-green-700 mb-2 underline">Total Service Hours Streak:</h3> {/* Styled streak title */}
              <p className="text-lg font-medium">
                Total Approved Hours: <span className="text-blue-500">{totalApprovedHours}</span>/{totalRequiredGlobalHours}
              </p>
              <div className="w-full bg-gray-300 rounded-full h-8 mb-2 shadow-lg relative">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-8 rounded-full shadow-md"
                  style={{
                    width: `${(totalApprovedHours / totalRequiredGlobalHours) * 100}%`,
                  }}
                ></div>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white font-bold">
                  {totalApprovedHours}/{totalRequiredGlobalHours}
                </span>
              </div>

              {/* Button to generate global certificate if total approved hours >= 500 */}
              {totalApprovedHours >= totalRequiredGlobalHours && (
                <button
                  onClick={generateGlobalCertificate}
                  className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
                >
                  Download Global Certificate
                </button>
              )}
            </div>

            {/* Display registered events and their progress bars */}
            {registeredEvents.length > 0 ? (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-green-700 mb-4 underline">Your Event Streaks:</h3> {/* Styled event streaks title */}
                {registeredEvents.map((event) => (
                  <div key={event.eventId} className="mb-8">
                    <p className="font-medium text-lg text-gray-800">Event: <span className="text-indigo-600">{event.eventName}</span></p> {/* Event title design */}
                    <p className="text-md text-gray-700">
                      Approved Hours: <span className="text-blue-500">{event.approvedHours}</span>/{totalRequiredHours}
                    </p>

                    {/* Progress bar for each event */}
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-4 shadow-md relative">
                      <div
                        className="bg-green-500 h-4 rounded-full"
                        style={{
                          width: `${(event.approvedHours / totalRequiredHours) * 100}%`,
                        }}
                      ></div>
                      <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-800 font-bold">
                        {event.approvedHours}/{totalRequiredHours}
                      </span>
                    </div>

                    {/* Form to request hours for this specific event */}
                    <form onSubmit={(e) => handleRequestHours(e, event.eventId)} className="flex flex-wrap justify-center gap-4 mt-4">
                      <input
                        type="number"
                        value={newHours[event.eventId] || ""}
                        onChange={(e) =>
                          setNewHours((prevState) => ({
                            ...prevState,
                            [event.eventId]: e.target.value,
                          }))
                        }
                        placeholder="Enter hours"
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm"
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                      >
                        Request Hours
                      </button>

                      {/* Unregister button next to Request Hours */}
                      <button
                        type="button"
                        onClick={() => handleUnregister(event.eventId)}
                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
                      >
                        Unregister from Event
                      </button>

                      {/* Certificate generation when required hours are met */}
                      {event.approvedHours >= totalRequiredHours && (
                        <button
                          onClick={generateCertificate}
                          className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition duration-300"
                        >
                          Generate Certificate for {event.eventName}
                        </button>
                      )}
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-lg text-gray-700">You are not registered for any events yet.</p>
            )}
          </div>
        ) : (
          <p className="text-xl text-red-500">Please log in to track your streak and request hours.</p>
        )}
      </div>
    </>
  );
}

export default StreakPage;

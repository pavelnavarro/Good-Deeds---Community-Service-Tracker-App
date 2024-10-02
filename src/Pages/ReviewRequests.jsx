import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import Header from "../header/Header"; // Assuming we have a Header component

function ReviewRequests() {
  const [requests, setRequests] = useState([]);

  // Fetch pending requests from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "hourRequests"), (snapshot) => {
      const pendingRequests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })).filter(request => request.status === "pending");
      setRequests(pendingRequests);
    });

    return () => unsubscribe();
  }, []);

  // Approve request and update user hours
  const approveRequest = async (request) => {
    const userEventRef = doc(db, "users", request.userId, "events", request.eventId); // Use a subcollection for events
    const requestDocRef = doc(db, "hourRequests", request.id);
  
    try {
      // Update the specific event's hours
      const eventDoc = await getDoc(userEventRef);
      const currentHours = eventDoc.exists() ? eventDoc.data().hours : 0;
      const updatedHours = currentHours + request.hoursRequested;
  
      await updateDoc(userEventRef, { 
        hours: updatedHours,
        status: "approved" // Track status per event
      });
  
      // Mark the request as approved
      await updateDoc(requestDocRef, { status: "approved" });
    } catch (error) {
      console.error("Error approving request: ", error);
    }
  };

  // Reject request and remove from Firestore
  const rejectRequest = async (requestId) => {
    try {
      const requestDocRef = doc(db, "hourRequests", requestId);
      await updateDoc(requestDocRef, { status: "rejected" }); // Optional: You can delete it instead.
      alert("Request rejected.");
    } catch (error) {
      console.error("Error rejecting request: ", error);
      alert("Failed to reject request.");
    }
  };

  return (
    <>
      <Header /> {/* Top Menu */}
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Review Hour Requests</h1>

        {requests.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-gray-100 p-4 rounded-xl shadow-md">
                <p>User ID: {request.userId}</p>
                <p>Hours Requested: {request.hoursRequested}</p>
                <p>Status: {request.status}</p>
                <div className="mt-4">
                  <button
                    className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 mr-4"
                    onClick={() => approveRequest(request)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
                    onClick={() => rejectRequest(request.id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No pending hour requests at the moment.</p>
        )}
      </div>
    </>
  );
}

export default ReviewRequests;

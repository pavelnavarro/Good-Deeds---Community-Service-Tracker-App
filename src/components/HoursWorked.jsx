import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { useAuth } from './useAuth'; // Custom hook to get the current user (implement as needed)

function HoursWorked() {
  const [hoursWorked, setHoursWorked] = useState(0);
  const [newHours, setNewHours] = useState('');
  const { user } = useAuth(); // Assumes you have a way to get the current user
  const userDocRef = user ? doc(db, 'users', user.uid) : null;

  // Fetch user's hours worked from Firestore
  useEffect(() => {
    if (userDocRef) {
      const fetchUserData = async () => {
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setHoursWorked(docSnap.data().hoursWorked);
          } else {
            // Initialize if user data doesn't exist
            await setDoc(userDocRef, { hoursWorked: 0 });
            setHoursWorked(0);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }
  }, [userDocRef]);

  // Update user's hours worked in Firestore
  const handleUpdateHours = async () => {
    if (userDocRef && !isNaN(newHours)) {
      try {
        await updateDoc(userDocRef, {
          hoursWorked: parseFloat(newHours),
        });
        setHoursWorked(parseFloat(newHours));
        setNewHours('');
      } catch (error) {
        console.error('Error updating hours:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Hours Worked</h1>
      <p className="mb-4">Current Hours Worked: {hoursWorked}</p>
      <input
        type="number"
        value={newHours}
        onChange={(e) => setNewHours(e.target.value)}
        placeholder="Enter new hours"
        className="border p-2 mr-2 rounded"
      />
      <button onClick={handleUpdateHours} className="bg-blue-500 text-white p-2 rounded">
        Update Hours
      </button>
    </div>
  );
}

export default HoursWorked;
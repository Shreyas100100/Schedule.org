import React, { useEffect, useState } from "react";
import { auth } from "../firebase";  // Ensure the path is correct
import { onAuthStateChanged } from "firebase/auth";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <>
          <h1>Welcome, {user.displayName || user.email}</h1>
          <p>User ID: {user.uid}</p>
          {/* Display more user information as needed */}
        </>
      ) : (
        <h1>No user is signed in</h1>
      )}
    </div>
  );
}

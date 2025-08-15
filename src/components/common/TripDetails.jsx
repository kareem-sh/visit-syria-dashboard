
import React from "react";

const TripDetails = ({ tripData }) => {
  return (
    <div className="trip-details">
      <h2>Trip Details</h2>
      <p>{tripData.description}</p>
      <ul>
        {tripData.activities.map((activity, idx) => (
          <li key={idx}>{activity}</li>
        ))}
      </ul>
    </div>
  );
};

export default TripDetails;

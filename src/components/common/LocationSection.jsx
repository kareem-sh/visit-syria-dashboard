// components/details/LocationSection.jsx
import React from "react";

const LocationSection = ({ location, fullWidth = false }) => {
  const containerStyle = fullWidth ? { width: "100%" } : { maxWidth: "400px" };
  return (
    <div className="location-section" style={containerStyle}>
      <h3>Location</h3>
      {/* For simplicity, you could embed a map or simply show an address */}
      <p>{location.address}</p>
      {location.mapEmbed && (
        <iframe
          src={location.mapEmbed}
          title="Map"
          width="100%"
          height="300"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

export default LocationSection;

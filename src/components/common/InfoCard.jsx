// components/details/InfoCard.jsx
import React from "react";

const InfoCard = ({ info, fullWidth = true }) => {
  return (
    <div
      className={`info-card ${fullWidth ? "full-width" : "narrow"}`}
      style={{ padding: "1rem", border: "1px solid #ccc" }}
    >
      {info.title && <h3>{info.title}</h3>}
      {info.description && <p>{info.description}</p>}
      {/* Add more info fields as needed */}
    </div>
  );
};

export default InfoCard;

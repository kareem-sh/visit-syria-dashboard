// components/details/ImageSection.jsx
import React from "react";

const ImageSection = ({ mainImage, secondaryImage, layout = "default" }) => {
  if (layout === "event") {
    return (
      <div
        className="image-section image-event-layout"
        style={{ display: "flex" }}
      >
        <div className="secondary-image" style={{ marginRight: "1rem" }}>
          <img
            src={secondaryImage}
            alt="Secondary"
            style={{ width: "150px" }}
          />
        </div>
        <div className="main-image">
          <img src={mainImage} alt="Main" style={{ width: "100%" }} />
        </div>
      </div>
    );
  }

  // Default layout for hotels, restaurants, places, trips, etc.
  return (
    <div
      className="image-section image-default-layout"
      style={{ position: "relative" }}
    >
      <img src={mainImage} alt="Main" style={{ width: "100%" }} />
      {secondaryImage && (
        <div
          className="secondary-image-overlay"
          style={{ position: "absolute", bottom: "10px", right: "10px" }}
        >
          <img
            src={secondaryImage}
            alt="Secondary"
            style={{ width: "150px" }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageSection;

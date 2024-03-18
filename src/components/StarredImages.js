import React from "react";
import "./../App.css";

const StarredImages = ({ starredImages, toggleStarred }) => {
  return (
    <div className="container">
      <h2 className="title">Starred Images</h2>
      <div className="images">
        {starredImages.map((imageId) => (
          <div key={imageId} className="image-container">
            <img
              src={`https://source.unsplash.com/${imageId}`}
              alt={`Starred Image ${imageId}`}
              className="image"
            />
            <button className="unstar-button" onClick={() => toggleStarred(imageId)}>
                {starredImages.includes(imageId) ? "★" : "☆"}
              </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StarredImages;

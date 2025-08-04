// components/details/CommentsSection.jsx
import React from "react";

const CommentsSection = ({ comments, variant = "default" }) => {
  return (
    <div className={`comments-section ${variant}`}>
      <h3>Comments</h3>
      {comments.map((comment, idx) => (
        <div key={idx} className="comment">
          <p>{comment.text}</p>
          <small>{comment.author}</small>
        </div>
      ))}
    </div>
  );
};

export default CommentsSection;

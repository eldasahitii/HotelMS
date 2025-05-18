import React from "react";
import tryroms from "../../Assets/images/tryroms.jpg";

function RoomsHeader() {
  const bgStyle = {
    backgroundImage: `url(${tryroms})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "500px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    textShadow: "2px 2px 6px rgba(0,0,0,0.7)",
  };

  return (
    <div className="container-fluid p-0">
      <div style={bgStyle}>
        <h2
          className="text-center slide-in-text"
          style={{ fontFamily: "'Crimson Text', serif", fontSize: "55px" }}
        >
          Welcome to our exquisite hotel rooms!
        </h2>
      </div>
    </div>
  );
}

export default RoomsHeader;

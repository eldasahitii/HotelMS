import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./Rooms.css";

const RoomSlider = ({ images, interval = 2500, alt = "Room image" }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const imgCount = images.length;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % imgCount);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  return (
    <div className="room-slider-wrapper position-relative" style={{ height: "425px" }}>
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={alt}
          className="img-fluid rounded position-absolute top-0 start-0 w-100 h-100"
          style={{
            objectFit: "cover",
            opacity: i === index ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
            zIndex: i === index ? 2 : 1,
          }}
        />
      ))}
    </div>
  );
};

RoomSlider.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  interval: PropTypes.number,
  alt: PropTypes.string,
};

export default RoomSlider;

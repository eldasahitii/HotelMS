import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const RoomSlider = ({ images, interval = 2000, alt = "Room image" }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const imgCount = images.length;
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % imgCount);
    }, interval);

    return () => clearInterval(timer); // Clean up on unmount
  }, [images, interval]);

  return (
    <img
      src={images[index]}
      alt={alt}
      className="img-fluid rounded"
      style={{ width: "100%", height: "auto" }}
    />
  );
};

RoomSlider.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  interval: PropTypes.number,
  alt: PropTypes.string,
};

export default RoomSlider;

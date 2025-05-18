import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";

const RoomCard = ({ title, capacity, size, description, images, link, isReversed }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [images]);

  const content = (
    <>
      <Col md={6}>
        <img src={images[index]} alt={title} className="img-fluid rounded shadow" />
      </Col>
      <Col md={6} className="d-flex flex-column justify-content-center">
        <h3>{title}</h3>
        <p>Capacity: {capacity}</p>
        <p>Size: {size}</p>
        <p>{description}</p>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <Button variant="primary">View More</Button>
        </a>
      </Col>
    </>
  );

  return (
    <Row className="my-5 align-items-center">
      {isReversed ? React.Children.toArray(content).reverse() : content}
    </Row>
  );
};

export default RoomCard;

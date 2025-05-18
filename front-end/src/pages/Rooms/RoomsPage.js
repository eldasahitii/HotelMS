import React from "react";
import { Card, Button } from "react-bootstrap";
import RoomSlider from "./RoomSlider";

const RoomCard = ({ title, capacity, size, description, images, link, isReversed }) => {
  return (
    <Card className={`mb-5 d-flex flex-row ${isReversed ? "flex-row-reverse" : ""} align-items-center`}>
      <div style={{ flex: 1 }}>
        <RoomSlider id={title.replace(/\s+/g, "")} images={images} alt={title} />
      </div>
      <Card.Body style={{ flex: 1 }}>
        <Card.Title>{title}</Card.Title>
        <Card.Text><strong>Capacity:</strong> {capacity}</Card.Text>
        <Card.Text><strong>Size:</strong> {size}</Card.Text>
        <Card.Text>{description}</Card.Text>
        <Button href={link} target="_blank" variant="primary">
          View More
        </Button>
      </Card.Body>
    </Card>
  );
};

export default RoomCard;

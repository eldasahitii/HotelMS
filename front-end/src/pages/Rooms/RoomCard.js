import React from "react";
import { Card, Button } from "react-bootstrap";
import RoomSlider from "./RoomSlider";

const RoomCard = ({ title, capacity, size, description, images, link, isReversed }) => {
  const safeTitle = title || "Room";
  const safeId = safeTitle.replace(/\s+/g, "");
  const safeImages = Array.isArray(images) ? images : [];

  return (
    <Card className={`mb-5 d-flex flex-row ${isReversed ? "flex-row-reverse" : ""} align-items-center`}>
      <div style={{ flex: 1 }}>
        <RoomSlider id={safeId} images={safeImages} alt={safeTitle} />
      </div>
      <Card.Body style={{ flex: 1 }}>
        <Card.Title>{safeTitle}</Card.Title>
        <Card.Text><strong>Capacity:</strong> {capacity || "N/A"}</Card.Text>
        <Card.Text><strong>Size:</strong> {size || "N/A"}</Card.Text>
        <Card.Text>{description || "No description available."}</Card.Text>
        <Button href={link || "#"} target="_blank" variant="primary">
          View More
        </Button>
      </Card.Body>
    </Card>
  );
};

export default RoomCard;

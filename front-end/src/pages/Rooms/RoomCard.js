import React from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import RoomSlider from "./RoomSlider";
import "./Rooms.css";

const RoomCard = ({ title, capacity, size, description, images, link, reverse }) => {
  return (
    <Container fluid className="custom-container" style={{ marginBottom: "100px" }}>
      <Card className="border-0 shadow-none">
        <Row className={`align-items-center ${reverse ? "flex-row-reverse" : ""}`}>
          <Col md={6} className="p-0">
            <RoomSlider images={images} alt={title} />
          </Col>
          <Col md={6}>
            <Card.Body className="border rounded p-4 room-description">
              <Card.Title className="room-title">{title}</Card.Title>
              <Card.Text><strong>Capacity:</strong> {capacity}</Card.Text>
              <Card.Text><strong>Size:</strong> {size}</Card.Text>
              <Card.Text>{description}</Card.Text>
              <Button href={link || "#"} target="_blank" variant="primary">
                View More
              </Button>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default RoomCard;

import React from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import RoomSlider from "./RoomSlider";
import "./Rooms.css";

const RoomCard = ({ title, capacity, size, description, images, link, reverse, price }) => {
  return (
    <Container
      fluid
      className="custom-container px-2 px-md-5"
      style={{ marginBottom: "130px" }}
    >
      <Card className="border-0 shadow-none">
        <Row className={`align-items-center ${reverse ? "flex-row-reverse" : ""}`}>
          <Col md={6} className="p-0 pe-md-4">
            <RoomSlider images={images} alt={title} />
          </Col>
          <Col md={6}>
            <Card.Body
              className="border rounded p-5 p-md-4 p-sm-3 d-flex flex-column lh-base"
              style={{ height: "430px", fontFamily: "'Crimson Text', serif", fontWeight: 100 }}
            >
              <Card.Title
                className="fs-1 fs-md-2 fs-sm-3 mb-4 text-dark"
                style={{ fontWeight: 100 }}
              >
                {title}
              </Card.Title>

              <Card.Text className="fs-5 fs-md-6">
                <strong>Capacity:</strong> {capacity}
              </Card.Text>

              <Card.Text className="fs-5 fs-md-6">
                <strong>Size:</strong> {size}
              </Card.Text>

              <Card.Text className="fs-5 fs-md-6 fw-bold">
                <strong>Price:</strong> ${price}
              </Card.Text>

              <Card.Text className="fs-6 fs-md-5">{description}</Card.Text>

              <Button
                href={link || "#"}
                target="_blank"
                variant="outline-danger"
                className="mt-auto w-auto px-4 py-2 fs-5 fs-md-6"
                style={{ maxWidth: "150px" }}
              >
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

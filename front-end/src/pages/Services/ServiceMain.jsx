import React, { useState } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import PoolService from './PoolService';
import SpaService from './SpaService';
import EventsService from './EventsService';

const ServicesMain = () => {
  const [activeService, setActiveService] = useState('');

  const renderServiceComponent = () => {
    switch (activeService) {
      case 'pool': return <PoolService />;
      case 'spa': return <SpaService />;
      case 'events': return <EventsService />;
      default: return <p>Select a service to view details.</p>;
    }
  };

  return (
    <Container className="my-4">
      <Row className="mb-3">
        <Col><Button variant="primary" onClick={() => setActiveService('pool')}>Pool</Button></Col>
        <Col><Button variant="info" onClick={() => setActiveService('spa')}>Spa</Button></Col>
        <Col><Button variant="success" onClick={() => setActiveService('events')}>Events</Button></Col>
      </Row>
      <Row>
        <Col>{renderServiceComponent()}</Col>
      </Row>
    </Container>
  );
};

export default ServicesMain;

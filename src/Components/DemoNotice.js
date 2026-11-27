import React, { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';

const DemoNotice = ({ onOpenPrivacy }) => {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <Alert variant="warning" className="mb-3" dismissible onClose={() => setShow(false)}>
      <Alert.Heading>Demo only — please don't use real personal data</Alert.Heading>
      <p className="mb-2">
        This application is a demonstration. Do not enter real names, email
        addresses, passwords or other sensitive information, and never share
        your login token. Use test data only — anything you add may be visible
        to other users of this demo.
      </p>
      <Button variant="outline-dark" size="sm" onClick={onOpenPrivacy}>
        Read the privacy policy
      </Button>
    </Alert>
  );
};

export default DemoNotice;

import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const DemoNotice = ({ onOpenPrivacy }) => {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="demo-notice" role="note">
      <span className="demo-notice__icon" aria-hidden="true">⚠️</span>
      <div className="demo-notice__body">
        <p className="demo-notice__title">Demo application — test data only</p>
        <p className="demo-notice__text">
          Please don't enter real names, email addresses, passwords or other
          sensitive information, and never share your login token. Anything you
          add here may be visible to other people using this demo.
        </p>
        <div className="demo-notice__actions">
          <Button size="sm" variant="outline-dark" onClick={onOpenPrivacy}>
            Privacy policy
          </Button>
          <button
            type="button"
            className="demo-notice__dismiss"
            onClick={() => setShow(false)}
            aria-label="Dismiss notice"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoNotice;

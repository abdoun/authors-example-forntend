import React from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';

const PrivacyPolicy = ({ show, onHide }) => (
  <Modal show={show} onHide={onHide} size="lg" centered scrollable>
    <Modal.Header closeButton>
      <Modal.Title>Privacy policy — demo application</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Alert variant="warning">
        This is a demo. Do not use real personal or sensitive data here, and do
        not share your login token.
      </Alert>

      <h5>What this demo stores</h5>
      <ul>
        <li>
          <strong>token (localStorage):</strong> the JWT issued by the separate
          auth backend. It contains your user id, name and email, is signed but
          not encrypted, and is removed when you log out or when it expires.
          Treat it like a password.
        </li>
        <li>
          <strong>jwt_token (cookie):</strong> a host-scoped cookie with path
          <code> /</code> and <code>SameSite=Lax</code> that expires with the
          token. It shares one sign-in session with the companion
          <code> user-auth-react</code> app when both are opened on the same
          host. Logging out from either app clears it.
        </li>
        <li>
          <strong>Author records:</strong> the name, email, location, GitHub
          and Twitter handles and latest article you enter through the Authors
          page are stored in the demo backend database.
        </li>
      </ul>

      <h5>Who receives the data</h5>
      <p>
        Login requests go to the auth backend through this app's <code>/auth</code>
        proxy, and author requests go to the authors API through <code>/api</code>.
        Both run on the same server. There are no third-party analytics,
        advertising or tracking services in this demo.
      </p>

      <h5>Use only test data</h5>
      <p>
        Anything you add may be visible to other people who use this demo, and
        no production-grade protections, backups or availability guarantees are
        provided. Use fake names, test email addresses and sample content only.
        You can remove authors you created with the Delete button, log out to
        clear your session, and clear this site's browser storage and cookies
        at any time.
      </p>

      <h5>Contact</h5>
      <p>
        Questions about this demo: abdoun79@gmail.com ·
        {' '}<a href="https://github.com/abdoun" target="_blank" rel="noopener noreferrer">github.com/abdoun</a>
      </p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={onHide}>Close</Button>
    </Modal.Footer>
  </Modal>
);

export default PrivacyPolicy;

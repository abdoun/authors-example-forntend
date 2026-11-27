import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const Section = ({ number, title, children }) => (
  <section className="privacy-section">
    <h5><span className="privacy-section__number">{number}</span>{title}</h5>
    {children}
  </section>
);

const PrivacyPolicy = ({ show, onHide }) => (
  <Modal className="privacy-modal" show={show} onHide={onHide} size="lg" centered scrollable>
    <Modal.Header closeButton>
      <div>
        <Modal.Title>Privacy policy</Modal.Title>
        <p className="privacy-subtitle mb-0">Authors Example · demonstration app</p>
      </div>
    </Modal.Header>

    <Modal.Body>
      <div className="privacy-callout">
        <strong>Demo only.</strong> Use fake names, test email addresses and
        sample content. Do not use or share real personal or sensitive data.
      </div>

      <Section number="1" title="What this demo stores">
        <ul>
          <li>
            <code>token</code> (localStorage) — the JWT from the auth backend.
            It contains your user id, name and email, is signed but not
            encrypted, and is removed on logout or expiry. Treat it like a
            password.
          </li>
          <li>
            <code>jwt_token</code> (cookie) — host-scoped, <code>path=/</code>,
            <code> SameSite=Lax</code>, expires with the token. It shares a
            sign-in session with <code>user-auth-react</code> only when both
            apps are opened on the <strong>same hostname</strong>. Logging out
            from either app clears it.
          </li>
          <li>
            Author records — the name, email, location, GitHub and Twitter
            handles and latest article you enter are stored in the demo
            backend database.
          </li>
        </ul>
      </Section>

      <Section number="2" title="Who receives the data">
        <p>
          Login requests go to the auth backend via this app's <code>/auth</code>
          proxy and author requests go to the authors API via <code>/api</code>.
          Both run on the same server. There are no third-party analytics,
          advertising or tracking services.
        </p>
      </Section>

      <Section number="3" title="Different hostnames">
        <p>
          Cookies are scoped to a host, not a port. If you switch between a LAN
          IP, a Tailscale IP and a domain name, each is a separate session. Use
          one hostname consistently for both apps to stay signed in across
          them.
        </p>
      </Section>

      <Section number="4" title="Your choices">
        <p>
          Delete authors you added with the Delete button, log out to clear
          your session, and clear this site's browser storage and cookies at
          any time. This demo provides no production guarantees, backups or
          availability commitments.
        </p>
      </Section>

      <Section number="5" title="Contact">
        <p>
          abdoun79@gmail.com ·{' '}
          <a href="https://github.com/abdoun" target="_blank" rel="noopener noreferrer">
            github.com/abdoun
          </a>
        </p>
      </Section>
    </Modal.Body>

    <Modal.Footer>
      <Button variant="primary" onClick={onHide}>Got it</Button>
    </Modal.Footer>
  </Modal>
);

export default PrivacyPolicy;

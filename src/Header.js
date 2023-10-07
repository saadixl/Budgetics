import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { signOut } from "./auth";

export default function Header(props) {
  const { currentUser, handleLoginClick, cleanUpOldData, handleResetMonth } =
    props;

  const handleSignoutClick = () => {
    signOut(cleanUpOldData);
  };

  if (currentUser && currentUser.uid) {
    const { displayName, photoURL } = currentUser;
    return (
      <Col xs={12} className="header">
        <Row>
          <Col xs={2}>
            <img alt="Profile" className="header-img" src={photoURL} />
          </Col>
          <Col xs={8}>
            <p className="welcome-back-text">
              Welcome back
              <br />
              <span className="name">{displayName}</span>
            </p>
          </Col>
          <Col className="header-right" xs={2}>
            <Dropdown data-bs-theme="dark">
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                <i className="fa-solid fa-bars"></i>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleResetMonth}>
                  Reset data
                </Dropdown.Item>
                <Dropdown.Item onClick={handleSignoutClick}>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Col>
    );
  } else {
    return (
      <Col xs={12}>
        <Button
          className="login-btn"
          variant="danger"
          size="lg"
          onClick={handleLoginClick}
        >
          Login with Google
        </Button>
      </Col>
    );
  }
}

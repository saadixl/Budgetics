import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { signOut } from "./auth";

export default function Header(props) {
  const { currentUser, handleLoginClick, cleanUpOldData } = props;

  const handleSignoutClick = () => {
    signOut(cleanUpOldData);
  };

  if (currentUser && currentUser.uid) {
    const { displayName, photoURL } = currentUser;
    return (
      <Col xs={12} className="header">
        <Row>
          <Col xs={8}>
            <p>
              Welcome back
              <br />
              {displayName}
            </p>
          </Col>
          <Col className="header-right" xs={4}>
            <img className="header-img" src={photoURL} />
            <i
              onClick={handleSignoutClick}
              className="fa-solid fa-right-from-bracket signout-out-icon"
            ></i>
          </Col>
        </Row>
      </Col>
    );
  } else {
    return (
      <Col xs={12}>
        <div className="d-grid gap-2">
          <Button variant="danger" size="lg" onClick={handleLoginClick}>
            Login with Google
          </Button>
        </div>
      </Col>
    );
  }
}

import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { signOut } from "../services/auth";
import CategorySelector from "./CategorySelector";

export default function Header(props) {
  const {
    currentUser,
    handleLoginClick,
    cleanUpOldData,
    handleResetMonth,
    handleArchiveMonth,
    handleShowBudgetEditor,
    remoteBudgets,
    selectedBudgetType,
    setSelectedBudgetType,
  } = props;

  const handleSignoutClick = () => {
    signOut(cleanUpOldData);
  };

  if (currentUser && currentUser.uid) {
    const { displayName } = currentUser;
    return (
      <Col xs={12} className="header">
        <Row className="align-items-center">
          <Col xs={10} className="header-content">
            <div className="welcome-back-text">
              <span className="welcome-label">Welcome back</span>
              <h2 className="welcome-name">{displayName}</h2>
            </div>
          </Col>
          <Col className="header-right" xs={2}>
            <Dropdown data-bs-theme="dark">
              <Dropdown.Toggle 
                variant="success" 
                id="dropdown-basic"
                className="header-menu-toggle"
              >
                <i className="fa-solid fa-bars"></i>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleShowBudgetEditor}>
                  <i className="fa-solid fa-edit" style={{ marginRight: '8px', color: '#00BCD4' }}></i>
                  Edit budgets
                </Dropdown.Item>
                <Dropdown.Item onClick={handleResetMonth}>
                  <i className="fa-solid fa-rotate" style={{ marginRight: '8px', color: '#00BCD4' }}></i>
                  Reset month
                </Dropdown.Item>
                <Dropdown.Item onClick={handleArchiveMonth}>
                  <i className="fa-solid fa-box-archive" style={{ marginRight: '8px', color: '#00BCD4' }}></i>
                  Archive month
                </Dropdown.Item>
                <Dropdown.Item onClick={handleSignoutClick}>
                  <i className="fa-solid fa-sign-out-alt" style={{ marginRight: '8px', color: '#00BCD4' }}></i>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        {remoteBudgets && remoteBudgets.length > 0 && (
          <Row className="header-category-row">
            <Col xs={12} className="header-category-col">
              <CategorySelector
                onChange={setSelectedBudgetType}
                remoteBudgets={remoteBudgets}
                selectedBudgetType={selectedBudgetType}
              />
            </Col>
          </Row>
        )}
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
          style={{
            background: 'linear-gradient(135deg, rgba(0, 188, 212, 0.25) 0%, rgba(0, 172, 193, 0.2) 100%)',
            border: '1px solid rgba(0, 188, 212, 0.3)',
            color: '#00BCD4',
            boxShadow: '0 2px 8px rgba(0, 188, 212, 0.15)'
          }}
        >
          <i className="fa-brands fa-google" style={{ marginRight: '8px' }}></i>
          Login with Google
        </Button>
      </Col>
    );
  }
}

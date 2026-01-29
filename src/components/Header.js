import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { signOut } from "../services/auth";
import { calculateDailySpend, calculateDaysRemaining } from "../services/utils";

export default function Header(props) {
  const {
    currentUser,
    handleLoginClick,
    cleanUpOldData,
    handleResetMonth,
    handleArchiveMonth,
    handleShowBudgetEditor,
    budgetTypes,
  } = props;

  // Calculate totals
  let totalBudgeted = 0;
  let totalSpent = 0;
  let totalLeft = 0;
  let percentageSpent = 0;
  let percentageLeft = 0;
  let dailyAverageSpend = 0;
  let daysRemaining = null;

  if (budgetTypes && Object.keys(budgetTypes).length > 0) {
    // Combine all history from all categories
    const allHistory = {};
    let historyIndex = 0;
    
    Object.keys(budgetTypes).forEach((key) => {
      const { budget = 0, current = 0, history = {} } = budgetTypes[key];
      totalBudgeted += budget;
      totalSpent += current;
      
      // Merge history entries from this category
      if (history && typeof history === 'object' && Object.keys(history).length > 0) {
        Object.keys(history).forEach((historyKey) => {
          const historyEntry = history[historyKey];
          if (historyEntry && historyEntry.timestamp) {
            // Use unique key to avoid collisions
            allHistory[`cat_${key}_idx_${historyIndex++}`] = historyEntry;
          }
        });
      }
    });
    
    totalLeft = totalBudgeted - totalSpent;
    if (totalBudgeted > 0) {
      percentageSpent = (totalSpent / totalBudgeted) * 100;
      percentageLeft = (totalLeft / totalBudgeted) * 100;
    }
    
    // Calculate daily average spend from all categories combined
    if (Object.keys(allHistory).length > 0) {
      dailyAverageSpend = calculateDailySpend(allHistory);
      // Calculate days remaining
      daysRemaining = calculateDaysRemaining(totalLeft, dailyAverageSpend);
    }
  }

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
        {budgetTypes && Object.keys(budgetTypes).length > 0 && (
          <div className="header-budget-summary">
            <div className="header-budget-row">
              <div className="header-budget-stat">
                <div className="header-budget-label">Total Budgeted</div>
                <div className="header-budget-value">${totalBudgeted.toFixed(2)}</div>
              </div>
              <div className="header-budget-stat">
                <div className="header-budget-label">Total Left</div>
                <div className="header-budget-value header-budget-value-left">${totalLeft.toFixed(2)}</div>
              </div>
            </div>
            <div className="header-budget-row">
              <div className="header-budget-stat">
                <div className="header-budget-label">Spent</div>
                <div className="header-budget-percentage">{percentageSpent.toFixed(1)}%</div>
              </div>
              <div className="header-budget-stat">
                <div className="header-budget-label">Left</div>
                <div className="header-budget-percentage header-budget-percentage-left">{percentageLeft.toFixed(1)}%</div>
              </div>
            </div>
            <div className="header-budget-row">
              <div className="header-budget-stat">
                <div className="header-budget-label">Daily Average</div>
                <div className="header-budget-value">${dailyAverageSpend.toFixed(2)}</div>
              </div>
              <div className="header-budget-stat">
                <div className="header-budget-label">Will Last</div>
                <div className="header-budget-value header-budget-value-left">
                  {daysRemaining !== null ? `${daysRemaining} days` : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}
      </Col>
    );
  } else {
    return (
      <Col xs={12} style={{ position: 'relative', minHeight: '60vh' }}>
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

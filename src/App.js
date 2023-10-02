import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

import Header from "./Header";
import BudgetTypes from "./BudgetTypes";
import { getBudgets, updateCurrent, resetMonth } from "./data";
import { signInWithGoogle } from "./auth";

function BalanceCard(props) {
  const { amount, title } = props;
  return (
    <Card data-bs-theme="dark" className="balance-card">
      <Card.Body>
        <Card.Title>{amount}</Card.Title>
        <Card.Text className="small">{title}</Card.Text>
      </Card.Body>
    </Card>
  );
}

function App() {
  const [selectedBudgetType, setSelectedBudgetType] = useState("");
  const [budgetTypes, setBudgetTypes] = useState({});
  const [amount, setAmount] = useState(0);
  const [currentUser, setCurrentUser] = useState();
  const [currentUid, setCurrentUid] = useState("test-user-id");

  const cleanUpOldData = () => {
    setBudgetTypes({});
    setSelectedBudgetType("");
    setAmount(0);
    setCurrentUser();
    setCurrentUid();
    localStorage.removeItem("currentUser");
  };

  useEffect(() => {
    let cachedCurrentUser = localStorage.getItem("currentUser");
    cachedCurrentUser = JSON.parse(cachedCurrentUser) || {};
    if (cachedCurrentUser && cachedCurrentUser.uid) {
      setCurrentUser(cachedCurrentUser);
    }
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      setCurrentUid(currentUser.uid);
    }
  }, [currentUser]);

  useEffect(() => {
    getBudgets(currentUid, setBudgetTypes);
  }, [currentUid]);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleTrackExpenseClick = () => {
    if (selectedBudgetType && amount) {
      updateCurrent(
        selectedBudgetType,
        currentUid,
        parseFloat(amount) +
          parseFloat(
            (budgetTypes[selectedBudgetType] &&
              budgetTypes[selectedBudgetType].current) ||
              0,
          ),
      );
    }
  };

  const handleResetMonth = () => {
    const confirm = window.confirm("Do you want to reset the month?");
    if (confirm) {
      resetMonth(currentUid);
    }
  };

  const handleLoginClick = () => {
    signInWithGoogle(setCurrentUser);
  };

  console.log("currentUser", currentUser);

  const { budget = 0, current = 0 } = budgetTypes[selectedBudgetType] || {};
  return (
    <Container>
      <Row>
        <Header
          currentUser={currentUser}
          handleLoginClick={handleLoginClick}
          cleanUpOldData={cleanUpOldData}
        />
        <Col xs={12}>
          <BudgetTypes setSelectedBudgetType={setSelectedBudgetType} />
        </Col>
        <Col xs={12}>
          <BalanceCard amount={budget} title="Budget" />
        </Col>
        <Col xs={6}>
          <BalanceCard amount={current} title="Current" />
        </Col>
        <Col xs={6}>
          <BalanceCard amount={budget - current} title="Remaining" />
        </Col>

        <Col xs={12}>
          <Form.Control
            data-bs-theme="dark"
            size="lg"
            type="number"
            placeholder="Type amount spent"
            pattern={"[0-9]*"}
            inputMode={"numeric"}
            onChange={handleAmountChange}
          />
        </Col>
        <Col xs={12}>
          <div className="d-grid gap-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleTrackExpenseClick}
            >
              Track expense
            </Button>
          </div>
        </Col>
        <Col xs={12}>
          <div className="d-grid gap-2">
            <Button variant="warning" size="lg" onClick={handleResetMonth}>
              Reset month
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;

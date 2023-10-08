import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import Header from "./Header";
import BudgetTypes, { getBudgetTitle } from "./BudgetTypes";
import BalanceCard, { EditableCard } from "./BalanceCard";
import History from "./History";
import {
  getBudgets,
  updateCurrent,
  resetMonth,
  updateBudget,
  archiveMonth,
} from "./data";
import { signInWithGoogle } from "./auth";

function App() {
  const [selectedBudgetType, setSelectedBudgetType] = useState("");
  const [budgetTypes, setBudgetTypes] = useState({});
  const [amount, setAmount] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [description, setDescription] = useState("Unknown expense");
  const [currentUser, setCurrentUser] = useState();
  const [currentUid, setCurrentUid] = useState();

  const cleanUpOldData = () => {
    setBudgetTypes({});
    setSelectedBudgetType("");
    setAmount(0);
    setDescription("Unknown expense");
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
    getBudgets(currentUid, setBudgetTypes, setTotalBalance);
  }, [currentUid]);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleTrackExpenseClick = () => {
    if (selectedBudgetType && amount) {
      updateCurrent(currentUid, {
        amount:
          parseFloat(amount) +
          parseFloat(
            (budgetTypes[selectedBudgetType] &&
              budgetTypes[selectedBudgetType].current) ||
              0,
          ),
        description,
        amountForHistory: parseFloat(amount),
        budget: selectedBudgetType,
      });
    }
  };

  const handleResetMonth = () => {
    const confirm = window.confirm("Do you want to reset the month?");
    if (confirm) {
      resetMonth(currentUid);
    }
  };

  const handleArchiveMonth = () => {
    const confirm = window.confirm(
      "Do you want to save this months data in archive?",
    );
    if (confirm) {
      archiveMonth(currentUid);
    }
  };

  const handleLoginClick = () => {
    signInWithGoogle(setCurrentUser);
  };

  const {
    budget = 0,
    current = 0,
    history,
  } = budgetTypes[selectedBudgetType] || {};

  return (
    <Container>
      <div className="header-on-background"></div>
      <Row>
        <Header
          currentUser={currentUser}
          handleLoginClick={handleLoginClick}
          cleanUpOldData={cleanUpOldData}
          handleResetMonth={handleResetMonth}
          handleArchiveMonth={handleArchiveMonth}
        />
        <Col xs={12}>
          <BalanceCard
            className="remaining"
            amount={budget - current}
            title={`${getBudgetTitle(selectedBudgetType)} balance`}
            secondaryTitle={`Total $${totalBalance.toFixed(2)}`}
          />
        </Col>
        <Col className="budget-type-wrapper" xs={12}>
          <BudgetTypes setSelectedBudgetType={setSelectedBudgetType} />
        </Col>
        <Col xs={6}>
          <EditableCard
            uid={currentUid}
            amount={budget}
            title="Budgeted"
            selectedBudgetType={selectedBudgetType}
            editOperation={updateBudget}
          />
        </Col>
        <Col xs={6}>
          <EditableCard
            uid={currentUid}
            amount={current}
            title="Currently spent"
            selectedBudgetType={selectedBudgetType}
            editOperation={updateCurrent}
          />
        </Col>
        <Col xs={12}>
          <Form.Control
            data-bs-theme="dark"
            size="lg"
            type="number"
            placeholder="Insert amount spent"
            pattern={"[0-9]*"}
            inputMode={"numeric"}
            onChange={handleAmountChange}
          />
        </Col>
        <Col xs={12}>
          <Form.Control
            data-bs-theme="dark"
            size="lg"
            type="text"
            placeholder="Write some description (optional)"
            onChange={handleDescriptionChange}
          />
        </Col>
        <Col xs={12}>
          <div className="d-grid gap-2">
            <Button
              className="action-button money-green"
              variant="primary"
              size="lg"
              onClick={handleTrackExpenseClick}
            >
              Track expense
            </Button>
          </div>
        </Col>
        <Col xs={12}>
          <History
            uid={currentUid}
            data={history}
            current={current}
            selectedBudgetType={selectedBudgetType}
            title={`Recent ${getBudgetTitle(
              selectedBudgetType,
            ).toLowerCase()} history`}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default App;

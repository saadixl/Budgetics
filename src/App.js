import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import AddModal from "./AddModal";
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
  const [showAddModal, setShowAddModal] = useState(false);

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
        <i
          onClick={() => {
            setShowAddModal(true);
          }}
          className="fa-solid fa-circle-plus sticky-add-btn"
        ></i>
        <AddModal
          show={showAddModal}
          onHide={() => {
            setShowAddModal(false);
          }}
          handleAmountChange={handleAmountChange}
          handleDescriptionChange={handleDescriptionChange}
          handleTrackExpenseClick={handleTrackExpenseClick}
          selectedBudgetType={selectedBudgetType}
        />
        <Col xs={12}>
          <BalanceCard
            className="remaining"
            amount={budget - current}
            denominator={budget}
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

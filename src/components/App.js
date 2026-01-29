import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ToastContainer } from "react-toastify";
import AddModal from "./AddModal";
import Header from "./Header";
import CategorySelector from "./CategorySelector";
import CategoryEditor from "./CategoryEditor";
import BalanceCard, { EditableCard } from "./BalanceCard";
import History from "./History";
import { AllBudgetsChart } from "./Chart";
import {
  getCurrentMonthsBudgets,
  updateCurrent,
  resetMonth,
  updateBudget,
  archiveMonth,
  getBudgetTemplate,
  updateBudgetTemplate,
  deleteBudget,
} from "../services/api";
import { showAlert, getChartData, getBudgetTitle, calculateDailySpend, calculateDaysRemaining } from "../services/utils";
import { signInWithGoogle } from "../services/auth";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [selectedBudgetType, setSelectedBudgetType] = useState("");
  const [budgetTypes, setBudgetTypes] = useState({});
  const [amount, setAmount] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [description, setDescription] = useState("Unknown expense");
  const [currentUser, setCurrentUser] = useState();
  const [currentUid, setCurrentUid] = useState();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryEditorModal, setShowCategoryEditorModal] = useState(false);
  const [remoteBudgets, setRemoteBudgets] = useState([]);
  const [dirtyBudgetUpdate, setDirtyBudgetUpdate] = useState(Date.now());

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
    getCurrentMonthsBudgets(currentUid, setBudgetTypes, setTotalBalance);
    getBudgetTemplate(currentUid, setRemoteBudgets);
  }, [currentUid, dirtyBudgetUpdate]);

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
      showAlert("New expense added");
    }
  };

  const handleResetMonth = () => {
    const confirm = window.confirm("Do you want to reset the month?");
    if (confirm) {
      resetMonth(currentUid);
      showAlert("Month reset completed", "warning");
    }
  };

  const handleArchiveMonth = () => {
    const confirm = window.confirm(
      "Do you want to save this months data in archive?",
    );
    if (confirm) {
      archiveMonth(currentUid);
      showAlert("Current months data archived");
    }
  };

  const handleLoginClick = () => {
    signInWithGoogle(setCurrentUser);
  };

  const handleShowBudgetEditor = () => {
    setShowCategoryEditorModal(true);
  };

  const {
    budget = 0,
    current = 0,
    history,
  } = budgetTypes[selectedBudgetType] || {};

  const chartData = getChartData(budgetTypes);
  
  // Calculate daily spend and days remaining
  const dailySpend = selectedBudgetType ? calculateDailySpend(history) : 0;
  const remainingBudget = budget - current;
  const daysRemaining = selectedBudgetType ? calculateDaysRemaining(remainingBudget, dailySpend) : null;

  return (
    <Container style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '24px', paddingBottom: '40px' }}>
      <div className="header-on-background"></div>
      <Row style={{ gap: '0' }}>
        <Header
          currentUser={currentUser}
          handleLoginClick={handleLoginClick}
          cleanUpOldData={cleanUpOldData}
          handleResetMonth={handleResetMonth}
          handleArchiveMonth={handleArchiveMonth}
          handleShowBudgetEditor={handleShowBudgetEditor}
          remoteBudgets={remoteBudgets}
          selectedBudgetType={selectedBudgetType}
          setSelectedBudgetType={setSelectedBudgetType}
        />
        <button
          onClick={() => {
            setShowAddModal(true);
          }}
          className="sticky-add-btn"
          aria-label="Add expense"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
        <AddModal
          show={showAddModal}
          onHide={() => {
            setShowAddModal(false);
          }}
          handleAmountChange={handleAmountChange}
          handleDescriptionChange={handleDescriptionChange}
          handleTrackExpenseClick={handleTrackExpenseClick}
          selectedBudgetType={selectedBudgetType}
          setSelectedBudgetType={setSelectedBudgetType}
          remoteBudgets={remoteBudgets}
        />
        <CategoryEditor
          uid={currentUid}
          show={showCategoryEditorModal}
          remoteBudgets={remoteBudgets}
          setDirtyBudgetUpdate={setDirtyBudgetUpdate}
          updateBudgetTemplate={updateBudgetTemplate}
          onHide={() => {
            setShowCategoryEditorModal(false);
          }}
          deleteBudget={deleteBudget}
        />
        <ToastContainer />
        <Col xs={12}>
          <BalanceCard
            className="remaining"
            amount={budget - current}
            denominator={budget}
            title={`${getBudgetTitle(
              remoteBudgets,
              selectedBudgetType,
            )} balance`}
          />
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
        {selectedBudgetType && (
          <>
            <Col xs={6}>
              <BalanceCard
                amount={dailySpend}
                title="Daily average spend"
              />
            </Col>
            <Col xs={6}>
              <BalanceCard
                amount={daysRemaining !== null ? daysRemaining : 0}
                title={daysRemaining !== null ? "Daily avg will last" : "No spending data"}
                className={daysRemaining !== null && daysRemaining <= 7 ? "low-balance" : ""}
                isDays={true}
              />
            </Col>
          </>
        )}
        {selectedBudgetType ? null : (
          <Col xs={12}>
            <AllBudgetsChart
              title="Current months statistics for all budgets"
              chartData={chartData}
            />
          </Col>
        )}
        <Col xs={12}>
          <History
            budgetTypes={budgetTypes}
            remoteBudgets={remoteBudgets}
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

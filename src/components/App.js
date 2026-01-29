import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ToastContainer } from "react-toastify";
import AddModal from "./AddModal";
import Header from "./Header";
import CategoryEditor from "./CategoryEditor";
import CategoryCard from "./CategoryCard";
import CategoryDetailModal from "./CategoryDetailModal";
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
import { showAlert, getChartData } from "../services/utils";
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
  const [showCategoryDetailModal, setShowCategoryDetailModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
      setDirtyBudgetUpdate(Date.now());
    }
  };

  const handleCategoryCardClick = (category) => {
    setSelectedCategory(category);
    setSelectedBudgetType(category.key);
    setShowCategoryDetailModal(true);
  };

  const handleCategoryDetailModalClose = () => {
    setShowCategoryDetailModal(false);
    setSelectedCategory(null);
  };

  const handleAddExpenseFromCategory = (categoryKey) => {
    setSelectedBudgetType(categoryKey);
    setShowCategoryDetailModal(false);
    setShowAddModal(true);
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

  const chartData = getChartData(budgetTypes);

  return (
    <Container style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '24px', paddingBottom: '40px' }}>
      <div className="header-on-background"></div>
      <Row style={{ gap: '0' }}>
        <Header
          currentUser={currentUser}
          handleLoginClick={handleLoginClick}
          cleanUpOldData={cleanUpOldData}
          handleResetMonth={handleResetMonth}
          handleArchiveMonth={handleArchiveMonth}
          handleShowBudgetEditor={handleShowBudgetEditor}
        />
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
        {remoteBudgets && remoteBudgets.length > 0 ? (
          <Row className="category-cards-row">
            {remoteBudgets.map((category) => {
              const budgetData = budgetTypes[category.key] || {};
              return (
                <Col key={category.key} xs={12} sm={6} md={6} lg={4} xl={3} className="mb-3">
                  <CategoryCard
                    category={category}
                    budgetData={budgetData}
                    onClick={() => handleCategoryCardClick(category)}
                  />
                </Col>
              );
            })}
          </Row>
        ) : (
          <Col xs={12}>
            <AllBudgetsChart
              title="Current months statistics for all budgets"
              chartData={chartData}
            />
          </Col>
        )}
        {selectedCategory && (
          <CategoryDetailModal
            show={showCategoryDetailModal}
            onHide={handleCategoryDetailModalClose}
            category={selectedCategory}
            budgetData={budgetTypes[selectedCategory.key]}
            remoteBudgets={remoteBudgets}
            budgetTypes={budgetTypes}
            currentUid={currentUid}
            setDirtyBudgetUpdate={setDirtyBudgetUpdate}
            onAddExpense={handleAddExpenseFromCategory}
          />
        )}
      </Row>
    </Container>
  );
}

export default App;

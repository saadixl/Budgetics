import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import BalanceCard, { EditableCard } from "./BalanceCard";
import History from "./History";
import { getBudgetTitle, calculateDailySpend, calculateDaysRemaining } from "../services/utils";
import { updateBudget, updateCurrent } from "../services/api";

export default function CategoryDetailModal(props) {
  const {
    show,
    onHide,
    category,
    budgetData,
    remoteBudgets,
    budgetTypes,
    currentUid,
    setDirtyBudgetUpdate,
    onAddExpense,
  } = props;

  if (!category) return null;

  const { title, key } = category;
  const { budget = 0, current = 0, history = {} } = budgetData || {};
  
  const remainingBudget = budget - current;
  const dailySpend = calculateDailySpend(history);
  const daysRemaining = calculateDaysRemaining(remainingBudget, dailySpend);

  // Wrapper functions to trigger updates after editing
  const handleUpdateBudget = (uid, payload) => {
    updateBudget(uid, payload);
    if (setDirtyBudgetUpdate) {
      setDirtyBudgetUpdate(Date.now());
    }
  };

  const handleUpdateCurrent = (uid, payload) => {
    updateCurrent(uid, payload);
    if (setDirtyBudgetUpdate) {
      setDirtyBudgetUpdate(Date.now());
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="category-detail-modal"
      data-bs-theme="dark"
    >
      <Modal.Header closeButton className="category-modal-header">
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="category-modal-body">
        <Row>
          <Col xs={12} className="mb-3">
            <BalanceCard
              className="remaining"
              amount={remainingBudget}
              denominator={budget}
              title={`${title} balance`}
            />
          </Col>
          <Col xs={6} className="mb-3">
            <EditableCard
              uid={currentUid}
              amount={budget}
              title="Budgeted"
              selectedBudgetType={key}
              editOperation={handleUpdateBudget}
            />
          </Col>
          <Col xs={6} className="mb-3">
            <EditableCard
              uid={currentUid}
              amount={current}
              title="Currently spent"
              selectedBudgetType={key}
              editOperation={handleUpdateCurrent}
            />
          </Col>
          <Col xs={6} className="mb-3">
            <BalanceCard
              amount={dailySpend}
              title="Daily average spend"
            />
          </Col>
          <Col xs={6} className="mb-3">
            <BalanceCard
              amount={daysRemaining !== null ? daysRemaining : 0}
              title={daysRemaining !== null ? "Daily avg will last" : "No spending data"}
              className={daysRemaining !== null && daysRemaining <= 7 ? "low-balance" : ""}
              isDays={true}
            />
          </Col>
          <Col xs={12}>
            <History
              budgetTypes={budgetTypes}
              remoteBudgets={remoteBudgets}
              uid={currentUid}
              data={history}
              current={current}
              selectedBudgetType={key}
              title={`Recent ${title.toLowerCase()} history`}
            />
          </Col>
        </Row>
      </Modal.Body>
      {onAddExpense && (
        <Modal.Footer className="category-modal-footer">
          <Button
            className="category-add-expense-btn"
            onClick={() => {
              if (onAddExpense) {
                onAddExpense(key);
              }
            }}
            aria-label="Add expense to this category"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Add Expense</span>
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
}

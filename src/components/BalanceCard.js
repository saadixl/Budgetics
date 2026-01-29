import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { showAlert } from "../services/utils";

export default function BalanceCard(props) {
  const { amount = 0, title, className, secondaryTitle, denominator, isDays = false, icon } = props;
  const lowBalance =
    denominator && amount / denominator <= 0.33 ? "low-balance" : "";
  
  let displayValue;
  if (isDays) {
    // For days, show as whole number
    displayValue = Math.floor(amount);
  } else {
    // For money, show with decimal
    const splittedAmount = amount.toFixed(2).split(".");
    displayValue = (
      <>
        <span>{splittedAmount[0]}</span>.
        <span className="amount-after-decimal-point">{splittedAmount[1]}</span>
      </>
    );
  }
  
  const prefix = isDays ? "" : "$";
  
  return (
    <Card data-bs-theme="dark" className={"balance-card " + (className || "")}>
      <Card.Body>
        <Card.Text className="small">{title}</Card.Text>
        <Card.Title className={lowBalance}>
          {prefix}{displayValue}
          {isDays && <span style={{ fontSize: '60%', marginLeft: '4px', fontWeight: '400' }}>days</span>}
        </Card.Title>
        {secondaryTitle && <p className="balance-card-secondary">{secondaryTitle}</p>}
      </Card.Body>
    </Card>
  );
}

export function EditableCard(props) {
  const { uid, amount, title, selectedBudgetType, editOperation } = props;
  const [showEditor, setShowEditor] = useState(false);
  const [editedAmount, setEditedAmount] = useState(amount);

  useEffect(() => {
    setEditedAmount(amount);
  }, [amount]);

  const handleChange = (e) => {
    setEditedAmount(e.target.value);
  };

  const nonEditingMode = (
    <>
      <BalanceCard {...props} />
      <span
        className="edit-action-btn"
        onClick={() => {
          setShowEditor(true);
        }}
      >
        Edit
      </span>
    </>
  );

  const handleEditConfirmClick = () => {
    if (uid && selectedBudgetType && !isNaN(editedAmount)) {
      editOperation(uid, {
        amount: editedAmount,
        budget: selectedBudgetType,
      });
      setShowEditor(false);
      showAlert("Edit completed");
    }
  };

  const handleEditCancelClick = () => {
    setShowEditor(false);
  };

  const editingMode = (
    <>
      <Card data-bs-theme="dark" className="balance-card">
        <Card.Body>
          <Card.Title>
            <Form.Control
              data-bs-theme="dark"
              size="lg"
              type="number"
              placeholder="Insert budget"
              value={editedAmount}
              pattern={"[0-9]*"}
              inputMode={"numeric"}
              onChange={handleChange}
            />
          </Card.Title>
          <Card.Text className="small">{title}</Card.Text>
        </Card.Body>
      </Card>
      <span className="edit-cancel-action-btn" onClick={handleEditCancelClick}>
        Cancel
      </span>{" "}
      <span className="edit-action-btn" onClick={handleEditConfirmClick}>
        Confirm
      </span>
    </>
  );

  return (
    <div className="editable-card-wrapper">
      {showEditor ? editingMode : nonEditingMode}
    </div>
  );
}

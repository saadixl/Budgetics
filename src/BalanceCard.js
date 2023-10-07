import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

export default function BalanceCard(props) {
  const { amount = 0, title, className, secondaryTitle } = props;
  const splittedAmount = amount.toFixed(2).split(".");
  const styledAmount = (
    <>
      <span>{splittedAmount[0]}</span>.
      <span className="amount-after-decimal-point">{splittedAmount[1]}</span>
    </>
  );
  return (
    <Card data-bs-theme="dark" className={"balance-card " + className}>
      <Card.Body>
        <Card.Text className="small">{title}</Card.Text>
        <Card.Title>${styledAmount}</Card.Title>
        <p className="balance-card-secondary">{secondaryTitle}</p>
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

import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

export default function BalanceCard(props) {
  const { amount, title, className } = props;
  return (
    <Card data-bs-theme="dark" className={"balance-card " + className}>
      <Card.Body>
        <Card.Text className="small">{title}</Card.Text>
        <Card.Title>${amount.toFixed(2)}</Card.Title>
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
      editOperation(selectedBudgetType, uid, editedAmount);
      setShowEditor(false);
    }
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

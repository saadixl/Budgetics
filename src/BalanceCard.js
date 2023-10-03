import { useState } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

export default function BalanceCard(props) {
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

export function EditableCard(props) {
  const [showEditor, setShowEditor] = useState(false);
  const { amount, title } = props;
  console.log("amount", amount);

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
              value={amount}
              pattern={"[0-9]*"}
              inputMode={"numeric"}
            />
          </Card.Title>
          <Card.Text className="small">{title}</Card.Text>
        </Card.Body>
      </Card>
      <span
        className="edit-action-btn"
        onClick={() => {
          setShowEditor(false);
        }}
      >
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

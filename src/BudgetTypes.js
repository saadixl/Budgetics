import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function BudgetTypes(props) {
  const [budgetTypes, setBudgetTypes] = useState([]);
  const { remoteBudgets, setSelectedBudgetType } = props;

  useEffect(() => {
    setBudgetTypes(remoteBudgets);
  }, [remoteBudgets, setBudgetTypes]);

  function handleChange(e) {
    setSelectedBudgetType(e.target.value);
  }

  const options = budgetTypes.map((budgetType) => {
    const { title, key } = budgetType;
    return (
      <option key={key} value={key}>
        {title}
      </option>
    );
  });

  return (
    <div>
      <span className="category-dropdown-label">Choose a category</span>
      <Form.Select
        onChange={handleChange}
        data-bs-theme="dark"
        aria-label="Default select example"
        size="lg"
      >
        <option value="">Select a budget type</option>
        {options}
      </Form.Select>
    </div>
  );
}

export function getBudgetTitle(budgetTypes, key) {
  if (key) {
    const matched = budgetTypes.filter((item) => {
      return item.key === key;
    });
    return matched[0].title;
  }
  return "Unknown";
}

export function BudgetTypesEditor(props) {
  const {
    handleAmountChange,
    handleDescriptionChange,
    handleTrackExpenseClick,
    onHide,
    selectedBudgetType,
  } = props;
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="add-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Category setting
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
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
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          className="money-green"
          onClick={() => {
            handleTrackExpenseClick();
            onHide();
          }}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

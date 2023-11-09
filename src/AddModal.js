import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { BudgetTypeSelector } from "./BudgetTypes";

function AddModal(props) {
  const {
    handleAmountChange,
    handleDescriptionChange,
    handleTrackExpenseClick,
    onHide,
    selectedBudgetType,
    remoteBudgets,
    setSelectedBudgetType,
  } = props;

  const handleBudgetTypeSelect = (selected) => {
    setSelectedBudgetType(selected);
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="add-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="add-modal-title"
        >
          Add new{" "}
          <BudgetTypeSelector
            onChange={handleBudgetTypeSelect}
            remoteBudgets={remoteBudgets}
            selectedBudgetType={selectedBudgetType}
          />{" "}
          expense
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
          disabled={selectedBudgetType === ""}
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

export default AddModal;

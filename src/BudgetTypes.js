import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { showAlert } from "./utils";

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
        <option value="">-- NONE --</option>
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
    if (matched && matched.length) {
      return matched[0].title;
    }
  }
  return "Unknown";
}

export function BudgetTypesEditor(props) {
  const {
    uid,
    remoteBudgets,
    updateBudgetTemplate,
    onHide,
    setDirtyBudgetUpdate,
  } = props;
  const [localBudgets, setLocalBudgets] = useState([]);
  useEffect(() => {
    setLocalBudgets(remoteBudgets);
  }, [remoteBudgets, setLocalBudgets]);

  const handleChange = (e, key, target) => {
    let localBudgetsClone = [...localBudgets];
    for (let i = 0; i < localBudgetsClone.length; i++) {
      if (localBudgetsClone[i].key === key) {
        const newValue = e.target.value;
        if (target === "title") {
          localBudgetsClone[i].title = newValue;
        } else if (target === "budget") {
          localBudgetsClone[i].budget = parseFloat(newValue);
        }
        setLocalBudgets(localBudgetsClone);
        break;
      }
    }
  };

  const handleDelete = (key) => {
    let newLocalBudgets = localBudgets.filter((x) => x.key !== key);
    setLocalBudgets(newLocalBudgets);
  };

  const handleNew = () => {
    setLocalBudgets([
      ...localBudgets,
      {
        title: "",
        key: `newbudget-${Date.now()}`,
        budget: 0,
      },
    ]);
  };

  const update = () => {
    updateBudgetTemplate(uid, localBudgets);
    showAlert("Budget categories updated");
    setDirtyBudgetUpdate(Date.now());
    onHide();
  };

  const fieldRows = localBudgets.map((item) => {
    const { budget, title, key } = item;
    return (
      <Row key={key}>
        <Col xs={7}>
          <Form.Control
            data-bs-theme="dark"
            size="lg"
            type="text"
            placeholder="Category"
            value={title}
            onChange={(e) => {
              handleChange(e, key, "title");
            }}
          />
        </Col>
        <Col xs={4}>
          <Form.Control
            data-bs-theme="dark"
            size="lg"
            type="number"
            value={budget}
            placeholder="Amount"
            onChange={(e) => {
              handleChange(e, key, "budget");
            }}
          />
        </Col>
        <Col xs={1}>
          <i
            onClick={() => handleDelete(key)}
            className="fa-solid fa-xmark budget-category-delete-icon"
          ></i>
        </Col>
      </Row>
    );
  });
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
          Budget category setting
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{fieldRows}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleNew}>
          Add new
        </Button>
        <Button variant="success" onClick={update}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

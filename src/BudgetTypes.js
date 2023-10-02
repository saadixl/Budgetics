import Form from "react-bootstrap/Form";

const budgetTypes = [
  {
    title: "Bills",
    key: "bills",
  },
  {
    title: "Commmute",
    key: "commute",
  },
  {
    title: "Eating out",
    key: "eatingout",
  },
  {
    title: "Groceries",
    key: "groceries",
  },
  {
    title: "Health",
    key: "health",
  },
  {
    title: "Shopping",
    key: "shopping",
  }
];

export default function BudgetTypes(props) {
  function handleChange(e) {
    props.setSelectedBudgetType(e.target.value);
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
    <Form.Select
      onChange={handleChange}
      data-bs-theme="dark"
      aria-label="Default select example"
      size="lg"
    >
      <option value="">Select a budget type</option>
      {options}
    </Form.Select>
  );
}

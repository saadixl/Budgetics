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
  },
  {
    title: "Exception",
    key: "exception",
  },
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

export function getBudgetTitle(key) {
  const matched = budgetTypes.filter((item) => item.key === key);
  return matched && matched.length ? matched[0].title : "Unknown";
}

import Card from "react-bootstrap/Card";

export default function CategoryCard(props) {
  const { category, budgetData, onClick } = props;
  const { title, key, budget: budgetAmount } = category;
  const { current = 0, budget = budgetAmount || 0 } = budgetData || {};
  
  const spent = current || 0;
  const remaining = budget - spent;
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  const isOverBudget = spent > budget;
  
  // Determine progress bar color based on percentage
  let progressClass = "progress-success";
  if (percentage >= 100) {
    progressClass = "progress-danger";
  } else if (percentage >= 75) {
    progressClass = "progress-warning";
  } else if (percentage >= 50) {
    progressClass = "progress-info";
  }

  return (
    <Card 
      data-bs-theme="dark" 
      className={`category-card ${progressClass}`}
      onClick={onClick}
      style={{ 
        cursor: 'pointer',
        '--progress-percentage': `${Math.min(percentage, 100)}%`
      }}
    >
      <Card.Body>
        <Card.Title className="category-card-title">{title}</Card.Title>
        <div className="category-card-amounts">
          <div className="category-card-item">
            <span className="category-card-label">Spent</span>
            <span className="category-card-value spent-value">
              ${spent.toFixed(2)}
            </span>
          </div>
          <div className="category-card-item">
            <span className="category-card-label">Budget</span>
            <span className="category-card-value budget-value">
              ${budget.toFixed(2)}
            </span>
          </div>
          <div className="category-card-item">
            <span className="category-card-label">Remaining</span>
            <span className="category-card-value remaining-value">
              ${remaining >= 0 ? remaining.toFixed(2) : `-${Math.abs(remaining).toFixed(2)}`}
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

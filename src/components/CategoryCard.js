import Card from "react-bootstrap/Card";
import { ProgressBar } from "react-bootstrap";

export default function CategoryCard(props) {
  const { category, budgetData, onClick } = props;
  const { title, key, budget: budgetAmount } = category;
  const { current = 0, budget = budgetAmount || 0 } = budgetData || {};
  
  const spent = current || 0;
  const remaining = budget - spent;
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  const isOverBudget = spent > budget;
  
  // Determine progress bar color based on percentage
  let progressVariant = "success";
  if (percentage >= 100) {
    progressVariant = "danger";
  } else if (percentage >= 75) {
    progressVariant = "warning";
  } else if (percentage >= 50) {
    progressVariant = "info";
  }

  return (
    <Card 
      data-bs-theme="dark" 
      className="category-card"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <Card.Body>
        <Card.Title className="category-card-title">{title}</Card.Title>
        <div className="category-card-amounts">
          <div className="category-card-spent">
            <span className="category-card-label">Spent</span>
            <span className="category-card-value spent-value">
              ${spent.toFixed(2)}
            </span>
          </div>
          <div className="category-card-budget">
            <span className="category-card-label">Budget</span>
            <span className="category-card-value budget-value">
              ${budget.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="category-card-progress">
          <ProgressBar 
            now={Math.min(percentage, 100)} 
            variant={progressVariant}
            className="category-progress-bar"
            style={{ 
              height: '8px',
              borderRadius: '4px',
              overflow: 'hidden'
            }}
          />
        </div>
        {remaining >= 0 ? (
          <div className="category-card-remaining">
            <span className="remaining-label">Remaining:</span>
            <span className="remaining-value">${remaining.toFixed(2)}</span>
          </div>
        ) : (
          <div className="category-card-overbudget">
            <span className="overbudget-label">Over budget:</span>
            <span className="overbudget-value">${Math.abs(remaining).toFixed(2)}</span>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

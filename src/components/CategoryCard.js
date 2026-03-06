import Card from "react-bootstrap/Card";

const CATEGORY_ICONS = {
  food: 'fa-utensils',
  groceries: 'fa-cart-shopping',
  grocery: 'fa-cart-shopping',
  transport: 'fa-car',
  transportation: 'fa-car',
  entertainment: 'fa-film',
  shopping: 'fa-bag-shopping',
  health: 'fa-heart-pulse',
  healthcare: 'fa-heart-pulse',
  rent: 'fa-house',
  housing: 'fa-house',
  utilities: 'fa-bolt',
  education: 'fa-graduation-cap',
  travel: 'fa-plane',
  fitness: 'fa-dumbbell',
  gym: 'fa-dumbbell',
  savings: 'fa-piggy-bank',
  insurance: 'fa-shield-halved',
  clothing: 'fa-shirt',
  clothes: 'fa-shirt',
  subscriptions: 'fa-rotate',
  internet: 'fa-wifi',
  phone: 'fa-mobile-screen',
  gas: 'fa-gas-pump',
  fuel: 'fa-gas-pump',
  pet: 'fa-paw',
  pets: 'fa-paw',
  coffee: 'fa-mug-hot',
  dining: 'fa-utensils',
  bills: 'fa-file-invoice-dollar',
  misc: 'fa-ellipsis',
  other: 'fa-ellipsis',
};

function getCategoryIcon(title) {
  const lower = (title || '').toLowerCase();
  for (const [keyword, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(keyword)) {
      return icon;
    }
  }
  return 'fa-receipt';
}

export default function CategoryCard(props) {
  const { category, budgetData, onClick } = props;
  const { title, key, budget: budgetAmount } = category;
  const { current = 0, budget = budgetAmount || 0 } = budgetData || {};

  const spent = current || 0;
  const remaining = budget - spent;
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  const clampedPercentage = Math.min(percentage, 100);

  // Determine progress bar color based on percentage
  let progressClass = "progress-success";
  let ringColor = "#28a745";
  if (percentage >= 100) {
    progressClass = "progress-danger";
    ringColor = "#dc3545";
  } else if (percentage >= 75) {
    progressClass = "progress-warning";
    ringColor = "#ffc107";
  } else if (percentage >= 50) {
    progressClass = "progress-info";
    ringColor = "#17a2b8";
  }

  const icon = getCategoryIcon(title);

  // SVG circle progress
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  return (
    <Card
      data-bs-theme="dark"
      className={`category-card ${progressClass}`}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        '--progress-percentage': `${clampedPercentage}%`
      }}
    >
      <Card.Body>
        <div className="category-card-top">
          <div className="category-card-icon-ring">
            <svg className="category-progress-ring" width="52" height="52" viewBox="0 0 52 52">
              <circle
                className="category-progress-ring-bg"
                cx="26"
                cy="26"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="3"
              />
              <circle
                className="category-progress-ring-fill"
                cx="26"
                cy="26"
                r={radius}
                fill="none"
                stroke={ringColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 26 26)"
                style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.3s ease' }}
              />
            </svg>
            <div className="category-card-icon">
              <i className={`fa-solid ${icon}`}></i>
            </div>
          </div>
          <div className="category-card-title-group">
            <Card.Title className="category-card-title">{title}</Card.Title>
            <span className="category-card-percentage" style={{ color: ringColor }}>
              {percentage.toFixed(0)}%
            </span>
          </div>
        </div>
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
            <span className="category-card-label">Left</span>
            <span className={`category-card-value remaining-value ${remaining < 0 ? 'over-budget' : ''}`}>
              ${remaining >= 0 ? remaining.toFixed(2) : `-${Math.abs(remaining).toFixed(2)}`}
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

import Card from "react-bootstrap/Card";

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
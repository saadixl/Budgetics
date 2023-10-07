import { useEffect, useState } from "react";
import moment from "moment";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { deleteHistory } from "./data";

export default function History(props) {
  const { data, title, selectedBudgetType, current = 0, uid } = props;
  const [history, setHistory] = useState();

  useEffect(() => {
    setHistory(data);
  }, [data]);

  let historyComp = (
    <Row>
      <Col xs={12}>
        <p>N/A</p>
      </Col>
    </Row>
  );

  const handleDeleteHistory = (key, amount, current) => {
    const confirm = window.confirm(`Do you really want delte this history?`);
    if (confirm) {
      deleteHistory(uid, {
        amount,
        budget: selectedBudgetType,
        current,
        key,
      });
    }
  };

  if (history) {
    historyComp = Object.keys(history).map((key) => {
      const { amount, description, timestamp } = history[key];
      return (
        <Row key={key} className="history-item-row small">
          <Col xs={8}>
            <p className="history-datetime">
              {moment(timestamp).format("DD/MM/YYYY hh:mm A")}
            </p>
            {description}
          </Col>
          <Col xs={3} className="amount-col">
            ${amount}
          </Col>
          <Col xs={1} className="amount-col">
            <i
              onClick={() => handleDeleteHistory(key, amount, current)}
              className="fa-solid fa-xmark"
            ></i>
          </Col>
        </Row>
      );
    });
  }

  return (
    <Card data-bs-theme="dark">
      <Card.Body>
        <Card.Title className="history-header">{title}</Card.Title>
        {historyComp}
      </Card.Body>
    </Card>
  );
}

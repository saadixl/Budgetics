import { useEffect, useState } from "react";
import moment from "moment";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { deleteHistory, moveHistory } from "./data";
import { HistoryChart } from "./Chart";
import { showAlert } from "./utils";
import { BudgetTypeSelector } from "./BudgetTypes";

export default function History(props) {
  const {
    data,
    title,
    selectedBudgetType,
    current = 0,
    uid,
    remoteBudgets,
    budgetTypes,
  } = props;
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
      showAlert("Expense history deleted", "warning");
    }
  };

  const handleHistoryMove = ({
    key,
    amount,
    current,
    newBudgetType,
    description,
  }) => {
    if (selectedBudgetType !== newBudgetType) {
      moveHistory(uid, {
        key,
        amount,
        oldCurrent: current,
        oldBudgetType: selectedBudgetType,
        newBudgetType,
        newCurrent: budgetTypes[newBudgetType].current,
        description,
      });
      showAlert(
        `Expense history moved to ${budgetTypes[newBudgetType].title}`,
        "warning",
      );
    }
  };

  let dataForChart = {},
    historyChart = null;

  if (history) {
    historyComp = Object.keys(history)
      .reverse()
      .map((key) => {
        const { amount, description, timestamp } = history[key];
        const dateObj = new Date(timestamp);
        const theDate = dateObj.getDate();
        const date = `${theDate}/${dateObj.getMonth()}`;
        if (!dataForChart[theDate]) {
          dataForChart[theDate] = {
            date,
            amount,
          };
        } else {
          dataForChart[theDate] = {
            date,
            amount: dataForChart[theDate].amount + amount,
          };
        }
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
            <Col xs={12} className="history-budget-type-seelctor-col">
              <BudgetTypeSelector
                onChange={(newBudgetType) => {
                  handleHistoryMove({
                    key,
                    amount,
                    current,
                    newBudgetType,
                    description,
                  });
                }}
                remoteBudgets={remoteBudgets}
                selectedBudgetType={selectedBudgetType}
              />
            </Col>
          </Row>
        );
      });

    const labels = [],
      data1 = [];
    Object.keys(dataForChart).forEach((key) => {
      const { amount, date } = dataForChart[key];
      labels.push(date);
      data1.push(amount);
    });
    historyChart = (
      <HistoryChart
        chartData={{ labels, data1 }}
        title={`Daily spends on ${selectedBudgetType}`}
      />
    );
  }

  return (
    <>
      {historyChart}
      <Card data-bs-theme="dark">
        <Card.Body>
          <Card.Title className="history-header">{title}</Card.Title>
          {historyComp}
        </Card.Body>
      </Card>
    </>
  );
}

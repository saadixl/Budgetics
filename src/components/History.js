import { useEffect, useState } from "react";
import moment from "moment";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { deleteHistory, moveHistory } from "../services/api";
import { HistoryChart } from "./Chart";
import { showAlert, getBudgetTitle } from "../services/utils";
import CategorySelector from "./CategorySelector";

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

  // Group transactions by date
  const groupTransactionsByDate = (historyData) => {
    if (!historyData) return {};
    
    const grouped = {};
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'days').startOf('day');
    
    Object.keys(historyData).reverse().forEach((key) => {
      const { amount, description, timestamp } = historyData[key];
      const dateObj = moment(timestamp);
      const dateKey = dateObj.startOf('day');
      
      let dateLabel;
      if (dateKey.isSame(today, 'day')) {
        dateLabel = 'Today';
      } else if (dateKey.isSame(yesterday, 'day')) {
        dateLabel = 'Yesterday';
      } else {
        dateLabel = dateObj.format('DD MMM YYYY');
      }
      
      if (!grouped[dateLabel]) {
        grouped[dateLabel] = [];
      }
      
      grouped[dateLabel].push({
        key,
        amount,
        description,
        timestamp,
        dateObj,
      });
      
      // For chart data
      const theDate = dateObj.date();
      const date = `${theDate}/${dateObj.month()}`;
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
    });
    
    return grouped;
  };

  if (history) {
    const groupedHistory = groupTransactionsByDate(history);
    
    historyComp = Object.keys(groupedHistory).map((dateLabel) => (
      <div key={dateLabel} className="history-date-group">
        <h3 className="history-date-header">{dateLabel}</h3>
        <div className="history-date-transactions">
          {groupedHistory[dateLabel].map(({ key, amount, description, timestamp, dateObj }) => {
            const categoryTitle = getBudgetTitle(remoteBudgets, selectedBudgetType);
            return (
              <div key={key} className="history-transaction-item">
                <div className="history-transaction-icon">
                  <i className="fa-solid fa-receipt"></i>
                </div>
                <div className="history-transaction-content">
                  <div className="history-transaction-name">{description || 'Unknown expense'}</div>
                  <div className="history-transaction-datetime">
                    {dateObj.format('DD MMM YYYY, hh:mm A')}
                  </div>
                  {categoryTitle && categoryTitle !== 'Unknown' && (
                    <span className="history-transaction-category">
                      {categoryTitle}
                    </span>
                  )}
                </div>
                <div className="history-transaction-right">
                  <span className="history-transaction-amount">${amount.toFixed(2)}</span>
                  <button
                    className="history-delete-btn"
                    onClick={() => handleDeleteHistory(key, amount, current)}
                    aria-label="Delete transaction"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ));

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
      <Card data-bs-theme="dark" className="history-card">
        <Card.Body>
          <Card.Title className="history-header">{title}</Card.Title>
          <div className="history-list">
            {historyComp}
          </div>
        </Card.Body>
      </Card>
    </>
  );
}

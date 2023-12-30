
import React, { useState } from 'react';

const Button = ({ text, handleClick }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad, total }) => {
  const average = ((good - bad) / total).toFixed(1);
  const percent = ((good / total) * 100).toFixed(1);

  if (total === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    );
  }

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={total} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="percent" value={`${percent} %`} />
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);

  const handleGood = () => {
    setGood(good + 1);
    setTotal(total + 1);
  };

  const handleNeutral = () => {
    setNeutral(neutral + 1);
    setTotal(total + 1);
  };

  const handleBad = () => {
    setBad(bad + 1);
    setTotal(total + 1);
  };

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="Good" handleClick={handleGood} />
      <Button text="Neutral" handleClick={handleNeutral} />
      <Button text="Bad" handleClick={handleBad} />
      <Statistics good={good} neutral={neutral} bad={bad} total={total} />
    </div>
  );
};

export default App;


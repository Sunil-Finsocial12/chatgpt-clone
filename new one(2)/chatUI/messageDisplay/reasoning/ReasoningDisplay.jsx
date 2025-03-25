import React from 'react';
import './ReasoningDisplay.css';

/**
 * Component for displaying AI reasoning steps
 * @param {Object} props - Component props
 * @param {Array} props.steps - Array of reasoning step objects with step number and content
 * @returns {JSX.Element} ReasoningDisplay component
 */
const ReasoningDisplay = ({ steps = [] }) => {
  if (!steps || steps.length === 0) {
    return null;
  }
  
  return (
    <div className="reasoning-display">
      <h4 className="reasoning-title">Reasoning Process:</h4>
      <div className="reasoning-steps">
        {steps.map((step, index) => (
          <div key={index} className="reasoning-step">
            <div className="step-number">{step.step || index + 1}</div>
            <div className="step-content">{step.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReasoningDisplay;

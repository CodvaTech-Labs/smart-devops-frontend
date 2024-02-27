import React from 'react';
import './MetricsTable.css'; // Import CSS file for styling

function MetricsTable({ metricsData }) {
  return (
    <div className="metrics-table-container">
      <table className="metrics-table">
        <thead>
          <tr>
            <th>Total Deployments</th>
            <th>Passed Deployments</th>
            <th>Failed Deployments</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{metricsData && metricsData.total_deployments}</td>
            <td>{metricsData && metricsData.passed_deployments}</td>
            <td>{metricsData && metricsData.failed_deployments}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default MetricsTable;

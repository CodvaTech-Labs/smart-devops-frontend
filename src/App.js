import React, { useState } from 'react';
import Dropdown from './Dropdown';
import MetricsTable from './MetricsTable';
import './demo.css';

function App() {
  const [selectedApp, setSelectedApp] = useState('');
  const [metricsData, setMetricsData] = useState(null);
  const [generatedText, setGeneratedText] = useState('');

  const handleViewMetrics = async () => {
    try {
      const response = await fetch(`http://devops-backend-788241747.ap-south-1.elb.amazonaws.com/metrics?app_name=${selectedApp}`);
      const data = await response.json();
      setMetricsData(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const runOpenAIQuery = async () => {
    const openaiApiKey = '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';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    };

    const appName = selectedApp;
    const totalDeployments = metricsData?.total_deployments || 0;
    const failedDeployments = metricsData?.failed_deployments || 0;

    const queryPrompt = `
      Generate a comprehensive DevOps metrics report in HTML format. Use professional UI with CSS orange and white table format. Include details such as the total deployments, failed deployments, deployment success rate, change failure rate, and corresponding categories (Elite, High, Medium, Low). Additionally, provide detailed recommendations for each category based on the metrics. This report will help in assessing and improving the efficiency of the application's DevOps practices." 
      Note that return only HTML code. Also add save to pdf option in HTML page.
      Application Name: ${appName}
      Total deployment: ${totalDeployments}
      Failed deployment: ${failedDeployments}
    `;

    const data = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: queryPrompt }],
      temperature: 0.7
    };

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        const generatedText = result.choices[0].message.content;

        // Set the generated text to the state
        setGeneratedText(generatedText);
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDORARecommendationReport = async () => {
    try {
      const response = await fetch(`http://devops-backend-788241747.ap-south-1.elb.amazonaws.com/metrics?app_name=${selectedApp}`);
      const data = await response.json();
      alert(`DORA Application Name: ${selectedApp}\nTotal Deployments: ${data.total_deployments}\nPassed Deployments: ${data.passed_deployments}\nFailed Deployments: ${data.failed_deployments}`);
      // Run OpenAI query after displaying DORA report
      await runOpenAIQuery();
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  return (
    <div className="App">
      <h1>DORA Metrics Dashboard</h1>
      <Dropdown setSelectedApp={setSelectedApp} />
      <button onClick={handleViewMetrics}>View Metrics</button>
      {metricsData && <MetricsTable metricsData={metricsData} />}
      <button onClick={runOpenAIQuery}>DORA Recommendation Report</button>
      
      {/* Render the generated text */}
      {generatedText && (
        <div>
          <h2>DORA Recommendation</h2>
          <div dangerouslySetInnerHTML={{ __html: generatedText }} />
        </div>
      )}
    </div>
  );
}

export default App;

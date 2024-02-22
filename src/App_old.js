import "./App.css";
import React, { useState } from "react";

function App() {
  const [emailData, setEmailData] = useState([]);
  const [averageStats, setAverageStats] = useState({
    avgTokens: 0,
    avgDuration: 0,
  });

  const calculateAverages = (emails) => {
    const total = emails.reduce(
      (acc, email) => {
        if (email.tokens) acc.tokens += email.tokens;
        if (email.duration) acc.duration += email.duration;
        return acc;
      },
      { tokens: 0, duration: 0, count: emails.length }
    );
    return {
      avgTokens: total.tokens / total.count || 0,
      avgDuration: total.duration / total.count || 0,
    };
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = JSON.parse(e.target.result);
        setEmailData(content.flat()); // Flattens the array and sets the emails
        setAverageStats(calculateAverages(content.flat()));
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a JSON file.");
    }
  };

  const renderEmailBody = (body) => {
    return body.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  const renderEmailStats = (email) => {
    const { tokens, duration, id } = email;
    return (
      <div className="email-stats">
        {tokens && (
          <p>
            <strong>Tokens:</strong> {tokens}
          </p>
        )}
        {duration && (
          <p>
            <strong>Duration:</strong> {duration.toFixed(2)} seconds
          </p>
        )}
        {id && (
          <p>
            <strong>ID:</strong> {id}
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="header-container">
        <div>
          <h1>Prettify JSON with emails</h1>
          <label htmlFor="file-upload" className="upload-btn">
            Upload JSON File
          </label>
          <input
            type="file"
            id="file-upload"
            accept=".json"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </div>
        {/* <div className="stats-summary">
          <h2>Stats Summary</h2>
          <p>Average Tokens Used: <strong>{averageStats.avgTokens.toFixed(2)}</strong></p>
          <p>Average Generation Time: <strong>{averageStats.avgDuration.toFixed(2)}</strong> seconds</p>
      </div> */}
      </div>
  <div>
  {emailData.map((userData) => {
    // Calculating total tokens and total duration
    const totalTokens = userData.previews.reduce((sum, email) => sum + email.tokens, 0);
    const totalDuration = userData.previews.reduce((sum, email) => sum + email.duration, 0);

    // Calculating averages
    const averageTokens = totalTokens / userData.previews.length;
    const averageDuration = totalDuration / userData.previews.length;

    return (
      <div key={userData.uid}> {/* Unique key for each user */}
        {/* Separate div for company name */}
        <div className="company-name">
          <h2>{userData.userCompanyName}</h2>
          {/* Displaying averages */}
          <p>Average Tokens: {averageTokens.toFixed(2)}</p>
          <p>Average Duration: {averageDuration.toFixed(2)} seconds</p>
        </div>

        {/* email-grid div for the previews */}
        <div className="email-grid">
          {userData.previews.map((email, index) => (
            <div key={index} className="email-card">
              <h2>{email.subject}</h2>
              <div className="email-body">
                {renderEmailBody(email.body)}
              </div>
              <div className="spacer"></div>
              {renderEmailStats(email)}
            </div>
          ))}
        </div>
      </div>
    );
  })}
</div>
      {/* <div className="email-grid">
        {emails.map((email, index) => (
          <div key={index} className="email-card">
            <h2>{email.subject}</h2>
            <p><strong>From:</strong> {email.userCompany}</p>
            <p><strong>To:</strong> {email.leadCompany}</p>
            <div className="email-body">{renderEmailBody(email.body)}</div>
            <div className="spacer"></div>
            {renderEmailStats(email)}
          </div>
        ))}
      </div> */}
    </div>
  );
}

export default App;

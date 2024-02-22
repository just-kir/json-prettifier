import React, { useState } from "react";
import "./App.css";

interface Email {
  tokens?: number;
  duration?: number;
  subject: string;
  body: string;
  id?: string;
}

interface UserData {
  uid: string;
  userCompanyName: string;
  previews: Email[];
}

interface AverageStats {
  avgTokens: number;
  avgDuration: number;
  avgWords: number;
}

function App() {
  const [emailData, setEmailData] = useState<UserData[]>([]);
  const [averageStats, setAverageStats] = useState<AverageStats>({ avgTokens: 0, avgDuration: 0, avgWords: 0 });

  function countWords(s: string): number {
    return s.split(/\s+/).filter(Boolean).length;
  }

  const calculateAverages = (emails: Email[]): AverageStats => {
    const total = emails.reduce(
      (acc, email) => {
        acc.tokens += email.tokens ?? 0;
        acc.duration += email.duration ?? 0;
        acc.words += countWords(email.body);
        return acc;
      },
      { tokens: 0, duration: 0, count: emails.length, words: 0}
    );

    return {
      avgTokens: total.count > 0 ? total.tokens / total.count : 0,
      avgDuration: total.count > 0 ? total.duration / total.count : 0,
      avgWords: total.count > 0 ? total.words / total.count : 0

    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = JSON.parse(e.target?.result as string) as UserData[];
        setEmailData(content);
        setAverageStats(calculateAverages(content.flatMap((c) => c.previews)));
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a JSON file.");
    }
  };

  const renderEmailBody = (body: string) => {
    return body.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  const renderEmailStats = (email: Email) => {
    return (
      <div className="email-stats">
        <p><strong>Tokens:</strong> {email.tokens} &nbsp;&nbsp;&nbsp;<strong>Words:</strong> {countWords(email.body)}</p>
        <p><strong>Duration:</strong> {email.duration?.toFixed(2)} seconds</p>

        {email.id && <p><strong>ID:</strong> {email.id}</p>}
      </div>
    );
  };

  const calculateWordCounts = () => {
    return emailData.flatMap(userData => userData.previews.map(email => countWords(email.body)));
  };

  return (
    <div>
      <div className="header-container">
        <h1>Prettify JSON with emails</h1>
        <label htmlFor="file-upload" className="upload-btn">
          Upload JSON File
        </label>
        <input type="file" id="file-upload" accept=".json" onChange={handleFileUpload} style={{ display: "none" }} />
        <div className="stats-summary">
          <h2>Stats Summary</h2>
          <p>Average Tokens Used: <strong>{averageStats.avgTokens.toFixed(2)}</strong></p>
          <p>Average Generation Time: <strong>{averageStats.avgDuration.toFixed(2)}</strong> seconds</p>
          <p>Average Words Generated: <strong>{averageStats.avgWords.toFixed(2)}</strong></p>
        </div>
      </div>
      {emailData.map((userData, index) => (
        <div key={index}>
          <div className="company-name">
            <h2>{userData.userCompanyName}</h2>
            {/* Calculated within render to simplify logic */}
            <p>Average Tokens: {calculateAverages(userData.previews).avgTokens.toFixed(2)}</p>
            <p>Average Duration: {calculateAverages(userData.previews).avgDuration.toFixed(2)} seconds</p>
            <p>Average Words: {calculateAverages(userData.previews).avgWords.toFixed(2)}</p>
          </div>
          <div className="email-grid">
            {userData.previews.map((email, emailIndex) => (
              <div key={emailIndex} className="email-card">
                <h2>{email.subject}</h2>
                <div className="email-body">{renderEmailBody(email.body)}</div>
                <div className="spacer"></div>
                {renderEmailStats(email)}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="word-counts-array">
        Word Counts: [{calculateWordCounts().join(", ")}]
      </div>
    </div>
  );
}

export default App;

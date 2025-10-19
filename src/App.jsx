import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import StatusTracker from "./components/StatusTracker";
import DownloadLink from "./components/DownloadLink";

function App() {
  const [jobId, setJobId] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  return (
    <div className="app-container">
      <h1>PII Redaction Portal</h1>

      {!jobId && <UploadForm onUploadComplete={(id) => setJobId(id)} />}

      {jobId && !downloadUrl && (
        <StatusTracker jobId={jobId} onReady={(url) => setDownloadUrl(url)} />
      )}

      {downloadUrl && <DownloadLink url={downloadUrl} />}
    </div>
  );
}

export default App;

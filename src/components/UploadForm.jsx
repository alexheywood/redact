import React, { useState } from "react";
import { uploadFile } from "../services/api";

export default function UploadForm({ onUploadComplete }) {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const response = await uploadFile(file);
    onUploadComplete(response.jobId); // Return job ID for polling
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit">Upload & Redact</button>
    </form>
  );
}

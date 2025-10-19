import React, { useEffect, useState } from "react";
import { checkStatus } from "../services/api";

export default function StatusTracker({ jobId, onReady }) {
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await checkStatus(jobId);
      setStatus(result.status);
      if (result.status === "Completed") {
        clearInterval(interval);
        onReady(result.downloadUrl);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [jobId]);

  return <p>Status: {status}</p>;
}

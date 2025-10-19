const API_BASE = "https://your-api-gateway-url";

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });
  return res.json(); // { jobId }
}

export async function checkStatus(jobId) {
  const res = await fetch(`${API_BASE}/status/${jobId}`);
  return res.json(); // { status, downloadUrl }
}

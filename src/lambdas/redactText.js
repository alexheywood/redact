exports.handler = async (event) => {
  try {
    const { jobId, originalText, redactions } = event;

    // Sort redactions by BeginOffset descending to avoid index shifting
    const sorted = redactions.sort((a, b) => b.BeginOffset - a.BeginOffset);

    let redactedText = originalText;

    for (const entity of sorted) {
      const start = entity.BeginOffset;
      const end = entity.EndOffset;
      redactedText =
        redactedText.slice(0, start) + "[REDACTED]" + redactedText.slice(end);
    }

    return {
      jobId,
      redactedText,
    };
  } catch (err) {
    console.error("Redaction failed:", err);
    throw new Error("Redaction error");
  }
};

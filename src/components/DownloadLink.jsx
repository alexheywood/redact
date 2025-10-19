export default function DownloadLink({ url }) {
  return (
    <div>
      <h3>Your redacted file is ready!</h3>
      <a href={url} target="_blank" rel="noopener noreferrer">
        Download
      </a>
    </div>
  );
}

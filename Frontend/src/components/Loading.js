import './Loading.css';

export default function Loading() {
  return (
    <div className="loading-container">
      Waiting for response...
      <div className="loading-spinner">
      </div>
    </div>
  );
}
export default function Loader({ text = 'Загрузка...' }) {
  return (
    <div className="d-flex align-items-center gap-2 text-secondary" role="status">
      <div className="spinner-border spinner-border-sm" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}

import { useDispatch, useSelector } from 'react-redux';
import { chooseBrand } from '../store/searchSlice';
import ErrorAlert from './ErrorAlert.jsx';
import Loader from './Loader.jsx';

export default function ManufacturerList() {
  const dispatch = useDispatch();
  const { manufacturers, selectedBrand } = useSelector((state) => state.search);

  if (manufacturers.status === 'idle') return null;
  if (manufacturers.status === 'loading') {
    return (
      <div className="mb-4">
        <Loader text="Поиск производителей..." />
      </div>
    );
  }
  if (manufacturers.status === 'failed') {
    return (
      <div className="mb-4">
        <ErrorAlert message={manufacturers.error} />
      </div>
    );
  }
  if (manufacturers.items.length === 0) {
    return <div className="alert alert-warning mb-4">Деталь с таким номером не найдена</div>;
  }

  return (
    <div className="card mb-4">
      <div className="card-header fw-semibold">Выберите производителя</div>
      <div className="list-group list-group-flush">
        {manufacturers.items.map((item) => (
          <button
            key={item.brand}
            type="button"
            className={`list-group-item list-group-item-action ${
              selectedBrand === item.brand ? 'active' : ''
            }`}
            onClick={() => dispatch(chooseBrand(item.brand))}
          >
            <div className="fw-semibold">{item.brand}</div>
            <small className={selectedBrand === item.brand ? '' : 'text-secondary'}>
              {[item.number, item.name].filter(Boolean).join(' — ')}
            </small>
          </button>
        ))}
      </div>
    </div>
  );
}

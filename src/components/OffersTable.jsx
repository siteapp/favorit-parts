import { useSelector } from 'react-redux';
import { formatPrice } from '../utils/normalize';
import ErrorAlert from './ErrorAlert.jsx';
import Loader from './Loader.jsx';

export default function OffersTable() {
  const { selectedBrand, offers } = useSelector((state) => state.search);

  if (!selectedBrand || offers.status === 'idle') return null;

  let body;
  if (offers.status === 'loading') {
    body = (
      <div className="p-3">
        <Loader text="Загрузка аналогов и предложений..." />
      </div>
    );
  } else if (offers.status === 'failed') {
    body = (
      <div className="p-3">
        <ErrorAlert message={offers.error} />
      </div>
    );
  } else if (offers.items.length === 0) {
    body = <div className="p-3 text-secondary">Аналоги и предложения не найдены</div>;
  } else {
    body = (
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Название / Производитель</th>
              <th>Номер</th>
              <th className="text-end">Цена</th>
              <th className="text-end">Остаток</th>
              <th>Склады</th>
            </tr>
          </thead>
          <tbody>
            {offers.items.map((offer) => (
              <tr key={offer.key}>
                <td>
                  <div className="fw-semibold">{offer.name || '—'}</div>
                  <div className="small text-secondary">{offer.brand}</div>
                  {offer.notRefund && (
                    <span className="badge text-bg-warning mt-1">Невозвратная</span>
                  )}
                </td>
                <td>{offer.number}</td>
                <td className="text-end">{formatPrice(offer.price)}</td>
                <td className={`text-end ${offer.stock > 0 ? '' : 'text-danger'}`}>
                  {offer.stock}
                </td>
                <td className="small">{offer.warehouses || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        Аналоги и предложения: <strong>{selectedBrand}</strong>
      </div>
      <div className="card-body p-0">{body}</div>
    </div>
  );
}

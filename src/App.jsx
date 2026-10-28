import SearchForm from './components/SearchForm.jsx';
import ManufacturerList from './components/ManufacturerList.jsx';
import OffersTable from './components/OffersTable.jsx';

export default function App() {
  return (
    <div className="container py-4" style={{ maxWidth: 1100 }}>
      <h1 className="h3 mb-4">Подбор автозапчастей и аналогов</h1>
      <SearchForm />
      <ManufacturerList />
      <OffersTable />
    </div>
  );
}

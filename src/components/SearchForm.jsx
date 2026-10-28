import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { MIN_NUMBER_LENGTH, searchByNumber } from '../store/searchSlice';

const DEBOUNCE_MS = 500;

export default function SearchForm() {
  const dispatch = useDispatch();
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => dispatch(searchByNumber(value.trim())), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [value, dispatch]);

  return (
    <div className="mb-4">
      <label htmlFor="partNumber" className="form-label fw-semibold">
        Артикул (номер) детали
      </label>
      <input
        id="partNumber"
        type="text"
        className="form-control form-control-lg"
        placeholder="Например, 7160500039S"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="off"
      />
      <div className="form-text">
        Введите минимум {MIN_NUMBER_LENGTH} символа — производители загрузятся автоматически
      </div>
    </div>
  );
}

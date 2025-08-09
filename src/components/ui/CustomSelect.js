import React, { useEffect, useState, useRef } from 'react';

function CustomSelect({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const dropdownRef = useRef(null);

  // Cập nhật selectedValues khi prop value thay đổi
  useEffect(() => {
    const valuesArray = typeof value === 'string' ? value.split(',').filter(Boolean) : [];
    setSelectedValues(valuesArray);
  }, [value]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (optionValue) => {
    let updated;
    if (selectedValues.includes(optionValue)) {
      updated = selectedValues.filter((val) => val !== optionValue);
    } else {
      updated = [...selectedValues, optionValue];
    }
    setSelectedValues(updated);
    onChange(updated.join(','));
  };

  const handleSelectAll = () => {
    const allValues = options.map((opt) => opt.value);
    setSelectedValues(allValues);
    onChange(allValues.join(','));
  };

  const handleClearAll = () => {
    setSelectedValues([]);
    onChange('');
  };

  const isAllSelected = options.length > 0 && selectedValues.length === options.length;

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative', width: '200px' }} ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        style={{
          border: '1px solid #ccc',
          padding: '6px 8px',
          backgroundColor: '#fff',
          cursor: 'pointer',
          borderRadius: '4px',
        }}
      >
        {selectedValues.length === 0
          ? placeholder
          : selectedValues.length === options.length
          ? 'Tất cả'
          : `${selectedValues.length} đã chọn`}
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
            maxHeight: '200px',
            overflowY: 'auto',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ padding: '6px', borderBottom: '1px solid #eee' }}>
            <label>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) =>
                  e.target.checked ? handleSelectAll() : handleClearAll()
                }
              />
              {' '}Chọn tất cả
            </label>
          </div>

          {options.map((opt) => (
            <div
              key={opt.value}
              style={{
                padding: '6px 10px',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <label>
                <input
                  type="checkbox"
                  checked={selectedValues.includes(opt.value)}
                  onChange={() => handleOptionClick(opt.value)}
                />
                {' '}{opt.label}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomSelect;

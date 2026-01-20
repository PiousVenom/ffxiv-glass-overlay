import { useState, useEffect, useRef, useCallback, useId } from 'react';

import styles from './CustomSelect.module.css';

import type { SelectOption } from '../../../types';

interface CustomSelectProps<T extends string = string> {
  /** Currently selected value */
  value: T;
  /** Available options */
  options: SelectOption<T>[];
  /** Callback when selection changes */
  onChange: (value: T) => void;
  /** Accessible label for the select */
  ariaLabel?: string;
}

/**
 * Custom dropdown component for ACT browser compatibility
 * Includes full keyboard navigation and ARIA attributes
 */
export function CustomSelect<T extends string = string>({
  value,
  options,
  onChange,
  ariaLabel = 'Select option',
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selectedOption = options.find((opt) => opt.value === value) ||
    options[0] || { value: '' as T, label: '' };
  const selectedIndex = options.findIndex((opt) => opt.value === value);

  const handleClickOutside = useCallback((e: MouseEvent | TouchEvent) => {
    if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, handleClickOutside, selectedIndex]);

  const handleSelect = (option: SelectOption<T>) => {
    onChange(option.value);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          handleSelect(options[focusedIndex]);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;
      case 'Home':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(0);
        }
        break;
      case 'End':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(options.length - 1);
        }
        break;
      case 'Tab':
        if (isOpen) {
          setIsOpen(false);
          setFocusedIndex(-1);
        }
        break;
    }
  };

  // Determine option class based on selected and focused states
  const getOptionClass = (isSelected: boolean, isFocused: boolean): string => {
    if (isSelected && isFocused) {
      return styles.selectOptionSelectedFocused;
    }
    if (isSelected) {
      return styles.selectOptionSelected;
    }
    if (isFocused) {
      return styles.selectOptionFocused;
    }
    return styles.selectOption;
  };

  return (
    <div
      className={isOpen ? styles.customSelectOpen : styles.customSelect}
      ref={selectRef}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls={listboxId}
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.selectSelected} onClick={() => setIsOpen(!isOpen)}>
        {selectedOption.label}
      </div>
      <div className={styles.selectOptions} role="listbox" id={listboxId} aria-label={ariaLabel}>
        {options.map((option, index) => (
          <div
            key={option.value}
            className={getOptionClass(option.value === value, index === focusedIndex)}
            role="option"
            aria-selected={option.value === value}
            onClick={() => handleSelect(option)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
}

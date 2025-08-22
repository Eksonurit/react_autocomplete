import { useState } from 'react';
import { Person } from '../types/Person';

type AutocompleteProps = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person) => void;
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [prevQuery, setPrevQuery] = useState<string>('');
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputValue(value);
    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      if (value === prevQuery) {
        return;
      }

      setIsOpen(true);
      setPrevQuery(value);
      setSuggestions(
        people.filter(person =>
          person.name.toLowerCase().includes(value.toLowerCase()),
        ),
      );
    }, delay);

    setTimer(newTimer);
  };

  const handleSelect = (person: Person) => {
    setInputValue(person.name);
    setIsOpen(false);
    onSelected(person);
  };

  return (
    <div className={`dropdown ${isOpen ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={inputValue}
          onChange={handleChange}
          onFocus={() => {
            if (!inputValue) {
              setSuggestions(people);
            }

            setIsOpen(true);
          }}
        />
      </div>

      {isOpen && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {suggestions.length > 0 ? (
              suggestions.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  onClick={() => handleSelect(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            ) : (
              <div className="dropdown-item">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

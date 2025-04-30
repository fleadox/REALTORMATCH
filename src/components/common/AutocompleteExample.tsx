import React, { useState } from 'react';
import Autocomplete, { AutocompleteOption } from './Autocomplete';

const AutocompleteExample: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<AutocompleteOption[]>([]);
  const [error, setError] = useState<string>();

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(undefined);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock results
      const results: AutocompleteOption[] = [
        { id: '1', label: `Result 1 for "${query}"`, value: 'result-1' },
        { id: '2', label: `Result 2 for "${query}"`, value: 'result-2' },
        { id: '3', label: `Result 3 for "${query}"`, value: 'result-3' },
      ];
      
      setOptions(results);
    } catch (err) {
      setError('Failed to fetch results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (option: AutocompleteOption) => {
    console.log('Selected:', option);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <Autocomplete
        label="Search Example"
        placeholder="Type to search..."
        options={options}
        onSearch={handleSearch}
        onSelect={handleSelect}
        isLoading={isLoading}
        error={error}
        minChars={2}
      />
    </div>
  );
};

export default AutocompleteExample;
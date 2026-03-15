import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { identifyPlant } from '../services/api';

/**
 * usePlantScan Custom Hook
 * Encapsulates the entire plant scan flow - image → backend → result page.
 * Keeps loading, error, and submission logic out of the UI components.
 * 
 * Returns:
 *   - selectedFile: File | null - The currently selected plant image
 *   - isLoading: boolean - True while the scan is in progress
 *   - error: string | null - Error message if something went wrong
 *   - setSelectedFile: function - Set the selected image file
 *   - handleScan: function - Trigger the scan process
 *   - clearError: function - Clear the error state
 */
function usePlantScan() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Sends the selected image to the backend and navigates to the result page
   */
  const handleScan = async () => {
    if (!selectedFile) {
      setError('Please select or capture a plant image first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await identifyPlant(selectedFile);

      if (result.success) {
        // Navigate to result page, passing full plant data via router state
        navigate('/result', {
          state: { plantData: result.data },
        });
      } else {
        setError('Plant identification failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    selectedFile,
    isLoading,
    error,
    setSelectedFile,
    handleScan,
    clearError,
  };
}

export default usePlantScan;

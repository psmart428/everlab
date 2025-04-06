import React from 'react';
import axios from 'axios';

interface ORUFileUploaderProps {
  onUploadSuccess: (data: any) => void;
  onLoadingChange: (isLoading: boolean) => void;
}

const ORUFileUploader: React.FC<ORUFileUploaderProps> = ({ onUploadSuccess, onLoadingChange }) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.name.endsWith('.oru') && !file.name.endsWith('.txt')) {
      alert('Please upload a file with .oru extension');
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      onLoadingChange(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload-oru`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      onUploadSuccess(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload and parse file.');
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Upload ORU File</h2>
      <input
        type="file"
        accept=".oru,.txt"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-600
                   file:mr-4 file:py-2 file:px-4
                   file:rounded file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
      />
    </div>
  );
};

export default ORUFileUploader;


import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
      <strong className="font-bold">Error: </strong>
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;

import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = React.createContext();

export function ToastProvider({ children }) {
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="colored"
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return React.useContext(ToastContext);
} 
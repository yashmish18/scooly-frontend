import React, { useContext, useState, useEffect } from 'react';
import api from '../../utils/api';

export const StudentContext = React.createContext();

export function useStudent() {
  return useContext(StudentContext);
}

export function StudentProvider({ children }) {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const res = await api.get('/dashboard/student');
        setStudent(res.data.data?.student || null);
      } catch (err) {
        setStudent(null);
      }
    }
    fetchStudent();
  }, []);

  return (
    <StudentContext.Provider value={{ student, setStudent }}>
      {children}
    </StudentContext.Provider>
  );
}

export default StudentContext; 
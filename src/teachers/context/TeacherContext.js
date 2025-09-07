import { createContext, useState } from 'react';

export const TeacherContext = createContext(null);

export function TeacherProvider({ children }) {
  const [teacher, setTeacher] = useState(null);
  return (
    <TeacherContext.Provider value={{ teacher, setTeacher }}>
      {children}
    </TeacherContext.Provider>
  );
}

export default TeacherContext; 
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';

async function fetchStudentAssignments() {
  const response = await api.get('/assignments/student');
  return response.data.data;
}

export function useStudentAssignments() {
  return useQuery({
    queryKey: ['studentAssignments'],
    queryFn: fetchStudentAssignments,
  });
} 
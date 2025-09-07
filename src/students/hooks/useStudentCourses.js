import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';

async function fetchStudentCourses() {
  const response = await api.get('/subjects/current');
  return response.data.data;
}

export function useStudentCourses() {
  return useQuery({
    queryKey: ['studentCourses'],
    queryFn: fetchStudentCourses,
  });
} 
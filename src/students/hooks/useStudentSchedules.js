import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';

async function fetchStudentSchedules() {
  const response = await api.get('/class-schedules/student');
  return response.data.data;
}

export function useStudentSchedules() {
  return useQuery({
    queryKey: ['studentSchedules'],
    queryFn: fetchStudentSchedules,
  });
} 
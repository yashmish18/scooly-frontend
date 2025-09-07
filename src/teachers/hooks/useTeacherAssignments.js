import { useQuery } from '@tanstack/react-query';

function fetchAssignments() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          title: 'Essay on Modern Literature',
          course: 'English 101',
          due: '2024-05-15',
          status: 'Published',
          submissions: '25/30',
          action: 'View',
        },
        {
          title: 'Lab Report: Physics Experiment',
          course: 'Physics 201',
          due: '2024-05-20',
          status: 'Published',
          submissions: '18/20',
          action: 'View',
        },
        {
          title: 'Presentation on Climate Change',
          course: 'Environmental Science 301',
          due: '2024-05-25',
          status: 'Draft',
          submissions: '0/25',
          action: 'Edit',
        },
        {
          title: 'Research Paper: History of Art',
          course: 'Art History 401',
          due: '2024-05-30',
          status: 'Published',
          submissions: '15/20',
          action: 'View',
        },
        {
          title: 'Case Study: Business Ethics',
          course: 'Business 101',
          due: '2024-06-05',
          status: 'Published',
          submissions: '22/25',
          action: 'View',
        },
      ]);
    }, 600);
  });
}

export function useTeacherAssignments() {
  return useQuery({
    queryKey: ['teacherAssignments'],
    queryFn: fetchAssignments,
  });
} 
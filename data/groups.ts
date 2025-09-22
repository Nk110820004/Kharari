export interface StudyGroup {
  id: string;
  topic: string;
  name: string;
  description: string;
  members: number;
}

export const initialGroups: StudyGroup[] = [
  {
    id: 'sg-1',
    topic: 'Machine Learning',
    name: 'ML Pioneers',
    description: 'A group for beginners diving into the world of machine learning. We cover everything from linear regression to neural networks.',
    members: 24,
  },
  {
    id: 'sg-2',
    topic: 'ReactJS',
    name: 'React Enthusiasts',
    description: 'Join us to build amazing UIs with React. We tackle hooks, state management, and the latest features in the ecosystem.',
    members: 42,
  },
  {
    id: 'sg-3',
    topic: 'Python',
    name: 'Python for Data Science',
    description: 'A hands-on group focused on using Python libraries like Pandas, NumPy, and Scikit-learn for data analysis.',
    members: 58,
  },
  {
    id: 'sg-4',
    topic: 'UX/UI Design',
    name: 'Design Thinkers',
    description: 'For aspiring designers to share their work, get feedback, and discuss principles of user-centric design.',
    members: 15,
  },
  {
    id: 'sg-5',
    topic: 'Algorithms & Data Structures',
    name: 'LeetCode Challengers',
    description: 'Preparing for technical interviews? Let\'s solve LeetCode problems together and master core algorithms.',
    members: 78,
  },
  {
    id: 'sg-6',
    topic: 'Cloud Computing',
    name: 'AWS Cloud Architects',
    description: 'A group dedicated to learning and getting certified in AWS. We discuss services like EC2, S3, Lambda, and more.',
    members: 33,
  },
];

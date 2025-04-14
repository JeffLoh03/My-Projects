export interface Todo {
  _id?: string;
  title: string;
  category: 'Mindfulness' | 'Exercise' | 'Self Care';
  completed: boolean;
  dueDate: Date;
}

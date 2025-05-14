export interface Task {
  text: string;
  done: boolean;
  createdAt: number; // timestamp для сортировки
}

export type Filter = 'all' | 'active' | 'completed';
export type TodoProps = {
  id: number;
  description: string;
  due_date: Date;
  completed: boolean;
  toggleCompleted: (id: number) => void;
};

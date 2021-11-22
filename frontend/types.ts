export type TodoProps = {
  id: number;
  description: string;
  due_date: Date;
  completed: boolean;
  updateTask?: (task: TodoProps) => void;
  //  toggleCompleted?: (id: number) => void;
  deleteTask?: (id: number) => void;
};

export type AddTaskProps = {
  closeModal: () => void;
  addTask: (todo: TodoProps) => void;
};

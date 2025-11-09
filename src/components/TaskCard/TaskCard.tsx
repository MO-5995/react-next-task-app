import { TaskDocument } from "@/models/task";
import TaskDeleteButton from "./TaskDeleteButton/TaskDeleteButton";
import TaskEditButton from "./TaskEditButton/TaskEditButton";
import TaskDoneButton from "./TaskDoneButton/TaskDoneButton";

interface TaskCardProps {
  task: TaskDocument;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div
      className={`w-64 h-52 p-4 rounded-md shadow-md flex flex-col justify-between ${
        task.isCompleted ? "bg-gray-200" : "bg-white"
      }`}
    >
      <header>
        <h1 className="text-lg font-semibold">{task.title}</h1>
        <div className="mt-1 text-sm line-clamp-3">{task.description}</div>
      </header>
      <div>
        <div className="text-sm mb-3">{task.dueDate}</div>
        <div className="flex justify-between items-center">
          <div className="text-sm mt-1 px-2 py-1 w-24 text-center border-1 border-black-300 rounded-md">
            {task.category}
          </div>
          <div className="flex gap-4">
            <TaskDoneButton status={task.isCompleted} id={task._id} />
            <TaskEditButton id={task._id} />
            <TaskDeleteButton id={task._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

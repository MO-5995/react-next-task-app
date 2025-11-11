"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "@/components/TaskCard/TaskCard";
import { TaskDocument } from "@/models/task";

interface TaskListProps {
  tasks: TaskDocument[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const [taskList, setTaskList] = useState(tasks);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    // 並び替え処理（フロント側）
    const newTasks = Array.from(taskList);
    const [movedTask] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, movedTask);
    setTaskList(newTasks);

    // 並び順をサーバーに保存
    try {
      await fetch("/api/tasks/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderedIds: newTasks.map((t) => t._id),
        }),
      });
    } catch (error) {
      console.error("並び順の保存に失敗しました:", error);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="task-list" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-wrap gap-4"
          >
            {taskList.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard task={task} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

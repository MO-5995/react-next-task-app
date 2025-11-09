"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface TaskDoneButtonProps {
  id: string;
  status: boolean;
}

const TaskDoneButton: React.FC<TaskDoneButtonProps> = ({ id, status }) => {
  const [isCompleted, setIsCompleted] = useState(status);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.checked;
    setIsCompleted(newStatus);

    startTransition(async () => {
      const res = await fetch("/api/tasks/completed", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isCompleted: newStatus }),
      });

      if (!res.ok) {
        alert("更新に失敗しました");
        setIsCompleted(status);
        return;
      }

      router.refresh();
    });
  };

  return (
    <input
      type="checkbox"
      checked={isCompleted}
      disabled={isPending}
      onChange={handleChange}
      className="w-4 h-4"
    />
  );
};

export default TaskDoneButton;

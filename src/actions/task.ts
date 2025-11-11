"use server";

import { Task, TaskModel } from "@/models/task";
import { connectDb } from "@/utils/database";
import { redirect } from "next/navigation";

export interface FormState {
  error: string;
}

export const createTask = async (state: FormState, formData: FormData) => {
  const count = await TaskModel.countDocuments();

  const newTask: Task = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    dueDate: formData.get("dueDate") as string,
    isCompleted: false,
    category: formData.get("category") as string,
    order: count,
  };
  try {
    await connectDb();
    await TaskModel.create(newTask);
  } catch (error) {
    state.error = "タスクの作成に失敗しました";
    return state;
  }

  redirect("/");
};

export const updateTask = async (
  id: string,
  state: FormState,
  formData: FormData
) => {
  const updateTask: Task = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    dueDate: formData.get("dueDate") as string,
    isCompleted: Boolean(formData.get("isCompleted")),
    category: formData.get("category") as string,
  };
  try {
    await connectDb();
    await TaskModel.updateOne({ _id: id }, updateTask);
  } catch (error) {
    state.error = "タスクの更新に失敗しました";
    return state;
  }

  redirect("/");
};

export const deleteTask = async (id: string, state: FormState) => {
  try {
    await connectDb();
    await TaskModel.deleteOne({ _id: id });
  } catch (error) {
    state.error = "タスクの削除に失敗しました";
    return state;
  }

  redirect("/");
};

export const changeStatus = async (
  id: string,
  state: FormState,
  formData: FormData
) => {
  const isCompleted = formData.get("isCompleted") === "on"; // checkboxは "on" が送られる
  try {
    await connectDb();
    await TaskModel.updateOne({ _id: id }, { $set: { isCompleted } });
  } catch (error) {
    state.error = "タスクの更新に失敗しました";
    return state;
  }

  redirect("/");
};

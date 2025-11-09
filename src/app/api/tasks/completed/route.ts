import { TaskDocument, TaskModel } from "@/models/task";
import { connectDb } from "@/utils/database";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDb();
    const completedTasks: TaskDocument[] = await TaskModel.find({
      isCompleted: true,
    });

    return NextResponse.json({
      message: "タスク取得成功",
      tasks: completedTasks,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "タスク取得失敗" }, { status: 500 });
  }
};

export const PATCH = async (request: Request) => {
  try {
    await connectDb();
    const { id, isCompleted } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "IDが必要です" }, { status: 400 });
    }

    await TaskModel.updateOne({ _id: id }, { $set: { isCompleted } });

    return NextResponse.json({
      message: "ステータス更新成功",
      updated: { id, isCompleted },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "ステータス更新失敗" },
      { status: 500 }
    );
  }
};

export const dynamic = "force-dynamic";

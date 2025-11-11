import { connectDb } from "@/utils/database";
import { TaskModel } from "@/models/task";
import { NextResponse } from "next/server";

export const PUT = async (req: Request) => {
  try {
    await connectDb();
    const { orderedIds } = await req.json(); // ["taskId1", "taskId2", "taskId3", ...]

    if (!orderedIds || !Array.isArray(orderedIds)) {
      return NextResponse.json(
        { message: "無効なデータ形式です" },
        { status: 400 }
      );
    }

    // 並び順に応じてorderフィールドを更新
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      },
    }));

    await TaskModel.bulkWrite(bulkOps);

    return NextResponse.json({ message: "並び順を更新しました" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "並び順の更新に失敗しました" },
      { status: 500 }
    );
  }
};

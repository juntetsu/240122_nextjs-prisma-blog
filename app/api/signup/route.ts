import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/lib/prisma";

// サインアップ
export async function POST(req: Request) {
  try {
    // リクエストボディを取得
    const body = await req.json();
    const { name, email, password } = body;

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 12);

    // ユーザーを作成
    const res = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    return NextResponse.json(res);
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
}

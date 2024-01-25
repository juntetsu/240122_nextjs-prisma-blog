import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/lib/prisma";

// 投稿編集
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // リクエストボディの取得
    const body = await req.json();
    const { title, content, image } = body;

    // ログインユーザーの取得
    const currentUser = await getCurrentUser();

    // ログインしていない場合はエラー
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("認証していません", { status: 401 });
    }

    // 投稿の作成
    const res = await prisma.post.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        content,
        image,
      },
    });

    return NextResponse.json(res);
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
}

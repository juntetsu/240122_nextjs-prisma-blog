import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

// ログインユーザー取得
const getCurrentUser = async () => {
  try {
    // セッション情報を取得
    const session = await getServerSession(authOptions);

    // ログインしていない場合
    if (!session?.user?.email) {
      return null;
    }

    // ログインユーザー取得
    const response = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    // ユーザーが存在しない場合
    if (!response) {
      return null;
    }

    // ユーザー情報が存在する場合、ユーザー情報を返す
    return response;

  } catch (error) {
    return null;
  }
};

export default getCurrentUser;
import prisma from "@/app/lib/prisma";

// 投稿一覧の取得
const getPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      // 並び順を降順に
      orderBy: {
        createdAt: "desc",
      },
      // リスト形式でユーザー情報を取得
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
    return posts;
  } catch (error) {
    return [];
  }
};

export default getPosts;

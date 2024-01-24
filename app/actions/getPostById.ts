import prisma from "@/app/lib/prisma";

// 投稿詳細を取得
const getPostById = async ({ id }: { id: string }) => {
  // ③getPostById({id: "3"})の場合、分割代入でidを取得し、この場合はid = "3"となる
  try {
    // 投稿詳細取得
    const post = await prisma.post.findUnique({
      where: {
        id: id, // ④id = "3"となる
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // 投稿が存在しない場合
    if (!post) {
      return null;
    }

    return post;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default getPostById;

import PostDetail from "@/app/components/post/PostDetail";
import getPostById from "@/app/actions/getPostById";
import getCurrentUser from "@/app/actions/getCurrentUser";

type PageProps = {
  params: {
    id: string;
  };
};

// 投稿詳細ページ
const PostDetailPage = async ({ params }: PageProps) => {
  // ①[id]が3の場合、paramsは{ id: "3" }となる
  // 投稿詳細を取得
  const post = await getPostById(params); // ②getPostById({ id: "3" })となる
  // ログインユーザーを取得
  const currentUser = await getCurrentUser();

  // 投稿がない場合
  if (!post) {
    return <div className="text-center">投稿はありません</div>;
  }

  // 投稿がある場合
  return <PostDetail post={post} currentUser={currentUser} />;
};

export default PostDetailPage;

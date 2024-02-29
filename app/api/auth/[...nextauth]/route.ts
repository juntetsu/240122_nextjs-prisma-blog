// import NextAuth, { NextAuthOptions } from "next-auth";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { authOptions } from "@/app/lib/auth";
import NextAuth from "next-auth";

// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import bcrypt from "bcrypt";
// import prisma from "@/app/lib/prisma";

// // NextAuth設定
// export const authOptions: NextAuthOptions = {
//   // Prismaを使うための設定
//   adapter: PrismaAdapter(prisma),
//   // 認証プロバイダーの設定
//   providers: [
//     // Google認証
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),

//     // メールアドレス認証
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         // メールアドレスとパスワード
//         email: { label: "email", type: "text" },
//         password: { label: "password", type: "password" },
//       },

//       async authorize(credentials) {
//         // メールアドレスとパスワードがない場合はエラー
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("メールアドレスとパスワードが存在しません");
//         }

//         // メールアドレスでユーザーを検索
//         const user = await prisma.user.findUnique({
//           where: {
//             email: credentials.email,
//           },
//         });

//         // ユーザーが存在しない場合はエラー
//         if (!user || !user?.hashedPassword) {
//           throw new Error("ユーザーが存在しません");
//         }

//         // パスワードが一致しない場合はエラー
//         const isCorrectPassword = await bcrypt.compare(
//           credentials.password,
//           user.hashedPassword
//         );

//         if (!isCorrectPassword) {
//           throw new Error("パスワードが一致しません");
//         }

//         // チェックが全て通ったらユーザー情報を返す
//         return user;
//       },
//     }),
//   ],
//   // セッションの保存方法設定
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// ハンドラー作成
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };

"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import toast, { Toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useLoginModal from "@/app/hooks/useLoginModal";
import useSignupModal from "@/app/hooks/useSignupModal";
import Modal from "@/app/components/modals/Modal";
import Input from "@/app/components/input/Input";
import Button from "@/app/components/button/Button";
import axios from "axios";
import * as z from "zod";

// zodで入力データの検証ルールを定義
const schema = z.object({
  name: z.string().min(2, { message: "名前は2文字以上で入力してください" }),
  email: z
    .string()
    .email({ message: "メールアドレスの形式で入力してください" }),
  password: z
    .string()
    .min(6, { message: "パスワードは6文字以上で入力してください" }),
});

// サインアップモーダル
const SignupModal = () => {
  const router = useRouter();
  const signupModal = useSignupModal();
  const loginModal = useLoginModal();
  const [loading, setLoading] = useState(false);

  // React Hook FormのuseFormを使用して、フォームの状態を管理
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    // 初期値
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    // 入力値の検証
    resolver: zodResolver(schema),
  });

  // ログインモーダルを開く関数
  const onToggle = useCallback(() => {
    signupModal.onClose();
    loginModal.onOpen();
  }, [signupModal, loginModal]);

  // 送信時に実行される関数
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);

    try {
      // サインアップ
      const res = await axios.post("/api/signup", data);
      // サインアップに成功したら、トースターを表示
      if (res.status === 200) {
        toast.success("サインアップに成功しました。");

        // ログイン
        await signIn("credentials", {
          ...data,
          redirect: false,
        });

        signupModal.onClose();
        router.refresh();
      }
    } catch (error) {
      toast.error("エラーが発生しました。" + error);
    } finally {
      setLoading(false);
    }
  };

  // モーダルの内容
  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        id="name"
        label="名前"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />

      <Input
        id="email"
        label="メールアドレス"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />

      <Input
        id="password"
        label="パスワード"
        type="password"
        disabled={loading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  // フッターの内容
  const footerContent = (
    <div className="mt-3 flex flex-col gap-4">
      <hr />
      {/* Googleログイン */}
      <Button
        outline
        label="Googleアカウントでログイン"
        // icon={FcGoogle}
        Icon={FcGoogle}
        onClick={() => signIn("google")}
      />

      {/* ログインリンク */}
      <div className="mt-4 text-center">
        <div
          onClick={onToggle}
          className="cursor-pointer text-sm text-neutral-500 hover:underline"
        >
          ログインする
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={loading}
      isOpen={signupModal.isOpen}
      title="サインアップ"
      primaryLabel="サインアップ"
      onClose={signupModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default SignupModal;

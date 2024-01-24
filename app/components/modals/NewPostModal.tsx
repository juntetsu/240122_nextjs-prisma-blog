"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";

import useNewPostModal from "@/app/hooks/useNewPostModal";
import Modal from "@/app/components/modals/Modal";
import Input from "@/app/components/input/Input";
import Textarea from "@/app/components/input/Textarea";
import ImageUpload from "@/app/components/input/ImageUpload";
import axios from "axios";
import * as z from "zod";

// ステップの定義
enum STEPS {
  CONTENT = 0,
  IMAGE = 1,
}

// 入力データの検証ルールを定義
const schema = z.object({
  title: z.string().min(2, { message: "2文字以上入力してください。" }),
  content: z.string().min(2, { message: "2文字以上入力してください。" }),
  image: z.string().optional(),
});

// 新規投稿用モーダル
const NewPostModal = () => {
  const router = useRouter();
  const newPostModal = useNewPostModal();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(STEPS.CONTENT);

  // react-hook-formのuseFormを使用して、フォームの状態を管理
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    // 初期値
    defaultValues: {
      title: "",
      content: "",
      image: "",
    },
    // 入力値の検証
    resolver: zodResolver(schema),
  });

  // 画像の監視
  const image = watch("image");

  // カスタム値（画像の入力値）を設定
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  // ステップを戻す
  const onBack = () => {
    setStep((value) => value - 1);
  };

  // ステップを進める
  const onNext = () => {
    setStep((value) => value + 1);
  };

  // メインボタンのラベル
  const primaryLabel = useMemo(() => {
    if (step === STEPS.IMAGE) {
      return "作成";
    }

    return "次へ";
  }, [step]);

  // サブボタンのラベル
  const secondaryLabel = useMemo(() => {
    if (step === STEPS.CONTENT) {
      return undefined;
    }

    return "戻る";
  }, [step]);

  // 送信時の処理
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // 最後のステップ以外は次へ
    if (step !== STEPS.IMAGE) {
      return onNext();
    }

    setLoading(true);

    try {
      // 新規投稿
      const res = await axios.post("/api/post", data);

      if (res.status === 200) {
        toast.success("新規投稿しました！");
        setStep(STEPS.CONTENT);
        reset();
        newPostModal.onClose();
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("エラーが発生しました。" + error);
      return;
    } finally {
      setLoading(false);
    }
  };

  // モーダルの内容
  const getBodyContent = (): React.ReactElement => {
    // STEPがIMAGEの場合
    if (step === STEPS.IMAGE) {
      return (
        <div>
          <ImageUpload
            onChange={(value) => setCustomValue("image", value)}
            value={image}
          />
        </div>
      );
    }

    // STEPがCONTENTの場合
    return (
      <div className="flex flex-col gap-4">
        <Input
          id="title"
          label="タイトル"
          type="text"
          disabled={loading}
          register={register}
          errors={errors}
          required
        />
        <Textarea
          id="content"
          label="内容"
          disabled={loading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  };

  // 共通のモーダルコンポーネント
  return (
    <Modal
      disabled={loading}
      isOpen={newPostModal.isOpen}
      title="新規投稿"
      primaryLabel={primaryLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryLabel={secondaryLabel}
      secondaryAction={step === STEPS.CONTENT ? undefined : onBack}
      onClose={newPostModal.onClose}
      body={getBodyContent()}
    />
  );
};

export default NewPostModal;

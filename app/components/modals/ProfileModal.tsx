"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { User } from "@prisma/client";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";

import useProfileModal from "@/app/hooks/useProfileModal";
import Modal from "@/app/components/modals/Modal";
import Input from "@/app/components/input/Input";
import ImageUpload from "@/app/components/input/ImageUpload";
import axios from "axios";
import * as z from "zod";

// ステップの定義（名前の入力→プロフィール画像のアップロード）
enum STEPS {
  CONTENT = 0,
  IMAGE = 1,
}

// zodで入力データの検証ルールを定義
const schema = z.object({
  name: z.string().min(2, { message: "名前は2文字以上で入力してください" }),
  image: z.string().optional(), // 必須ではないのでoptional()
});

type ProfileModalProps = {
  currentUser: User | null;
};

// プロフィールモーダル
const ProfileModal: React.FC<ProfileModalProps> = ({ currentUser }) => {
  const router = useRouter();
  const profileModal = useProfileModal();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(STEPS.CONTENT);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    // 入力値の検証
    resolver: zodResolver(schema),
  });

  // 画像の監視
  const image = watch("image");

  // カスタム値の設定
  const setCustomeValue = (id: string, value: string) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  // 初期値設定
  useEffect(() => {
    if (currentUser) {
      reset({
        name: currentUser.name,
        image: currentUser.image || "",
      });
    }
  }, [currentUser, reset]);

  // ステップを戻す関数
  const onBack = () => {
    setStep((value) => value - 1);
  };

  // ステップを進める関数
  const onNext = () => {
    setStep((value) => value + 1);
  };

  // メインボタンのラベル
  const primaryLabel = useMemo(() => {
    if (step === STEPS.IMAGE) {
      return "編集";
    }

    return "次へ";
  }, [step]);

  // サブボタンのラベル（最初のステップでは表示しない）
  const secondaryLabel = useMemo(() => {
    if (step === STEPS.CONTENT) {
      return undefined;
    }

    return "戻る";
  }, [step]);

  // 送信時に実行される関数
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // 最後のステップ以外は次へ
    if (step !== STEPS.IMAGE) {
      return onNext();
    }

    setLoading(true);

    try {
      // プロフィールの更新
      const res = await axios.patch("/api/profile", data);

      if (res.status === 200) {
        toast.success("プロフィールを更新しました。");
        setStep(STEPS.CONTENT);
        profileModal.onClose();
        router.refresh();
      }
    } catch (error) {
      toast.error("エラーが発生しました。" + error);
    } finally {
      setLoading(false);
    }
  };

  // モーダルの内容
  const getBodyContent = (): React.ReactElement => {
    // ステップが画像の場合
    if (step === STEPS.IMAGE) {
      return (
        <div>
          <ImageUpload
            onChange={(value) => setCustomeValue("image", value)}
            value={image}
          />
        </div>
      );
    }

    // ステップが名前の場合
    return (
      <div>
        <Input
          id="name"
          label="名前"
          type="text"
          disabled={loading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  };

  return (
    <Modal
      disabled={loading}
      isOpen={profileModal.isOpen}
      title="プロフィール"
      primaryLabel={primaryLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryLabel={secondaryLabel}
      secondaryAction={step === STEPS.CONTENT ? undefined : onBack}
      onClose={() => {
        profileModal.onClose();
        setStep(STEPS.CONTENT);
      }}
      body={getBodyContent()}
    />
  );
};

export default ProfileModal;

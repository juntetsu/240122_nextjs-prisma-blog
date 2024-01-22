import { create } from "zustand";
import { ModalType } from "@/app/types";

// サインアップ管理状態
const useSignupModal = create<ModalType>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useSignupModal;

import { create } from "zustand";
import { ModalType } from "@/app/types";

const useNewPostModal = create<ModalType>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useNewPostModal
"use client";

import { useRouter } from "next/navigation";
import { Register } from "@/components/register";

export default function RegisterModal() {
  const router = useRouter();

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-sm relative">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
        <Register onSuccess={() => router.back()} />
      </div>

      <div className="modal-backdrop" onClick={() => router.back()}>
        <button type="button">close</button>
      </div>
    </dialog>
  );
}

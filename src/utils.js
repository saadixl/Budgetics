import { toast } from "react-toastify";

export function showAlert(message, type) {
  let customToast = toast.success;
  if (type === "warning") {
    customToast = toast.warning;
  }
  customToast(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
}

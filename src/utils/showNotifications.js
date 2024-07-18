import { toast } from "react-toastify";

const showNotification = (type, message) => {
  const style = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  };
  if (type === "error") {
    toast.error(message, style);
  }
  if (type === "success") {
    toast.success(message, style);
  }
  if (type === "warning") {
    toast.warning(message, style);
  }
  if (type === "info") {
    toast.info(message, style);
  }
};
export { showNotification };

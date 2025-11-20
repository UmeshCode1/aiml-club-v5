import toast from 'react-hot-toast';

export const showToast = {
  success: (message: string) => toast.success(message, {
    duration: 3000,
    icon: '✅',
  }),
  
  error: (message: string) => toast.error(message, {
    duration: 4000,
    icon: '❌',
  }),
  
  loading: (message: string) => toast.loading(message),
  
  promise: async <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages);
  },

  info: (message: string) => toast(message, {
    duration: 3000,
    icon: 'ℹ️',
  }),

  dismiss: (toastId?: string) => toast.dismiss(toastId),
};

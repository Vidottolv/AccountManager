import ToastRef from 'react-native-toast-notifications';
let toastRef: ToastRef | null = null;

export const setToastRef = (ref: ToastRef) => {
  toastRef = ref;
};

export const showToast = (
  message: string,
  type: 'success' | 'danger' | 'warning' | 'normal' = 'normal',
  placement: 'top' | 'bottom' | 'center' = 'top'
) => {
  toastRef?.show(message, {
    type,
    placement,
    animationType: 'slide-in',
  });
};

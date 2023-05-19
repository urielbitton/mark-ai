export const infoToast = (message, keep) => {
  return prev => [...prev, {
    message,
    icon: 'fas fa-exclamation-circle',
    toastID: Date.now(),
    keep,
    color: 'var(--orange)'
  }]
}

export const errorToast = (message, keep=false) => {
  return prev => [...prev, {
    message,
    icon: 'fas fa-times-circle',
    toastID: Date.now(),
    keep,
    color: 'var(--red)'
  }]
}

export const successToast = (message, keep) => {
  return prev => [...prev, {
    message,
    icon: 'fas fa-check-circle',
    toastID: Date.now(),
    keep,
    color: 'var(--primary)'
  }]
}

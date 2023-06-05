export const IdentityController = {
  Login: `identity/login`,
  ForgetPassword: (email: string) => `identity/${email}/forget-password`,
  ResetPassword: (email: string) => `identity/${email}/reset-password`,
  ChangePassword: 'identity/change-password',
}

export const UsersController = {
  Users: `users`,
  UsersDrp: `users/dropdown`,
  ExportToExcel: `users/export`,
  UpdateUser: 'users/my-profile',
  MyProfile: `users/my-profile`,
  CreateLocalAdmin: `users/local-admin`,
  Unlock: (id: string) => `users/${id}/unlock`,
  Activate: (id: string) => `users/${id}/activate`,
  Deactivate: (id: string) => `users/${id}/deactivate`,
  Delete: (id: string) => `users/${id}`,
  VendorAdmin: (vendorId: string) => `vendors/${vendorId}/vendor-admins`,
  ExportVendorAdmin: (vendorId: string) => `vendors/${vendorId}/vendor-admins/export`,
  GetCurrentUserAudits: `users/my-audits`,
  GetUsersAuditsForAdmins: (userId: string) => `users/${userId}/audits`,
  GetUsersAuditsForVendor: (userId: string) => `users/${userId}/member-audits`
}

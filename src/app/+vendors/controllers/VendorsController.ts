export const VendorsController = {
  GetVendors: `vendors`,
  Details: (userId: string) => `vendors/${userId}`,
  Activities: (userId: string) => `vendors/${userId}/activities`,
  Create: `vendors`,
  Register: `vendors/register`,
  Verify: `vendors/verify`,
  GetVendorVerificationDocument: `vendors/verification-document`
}

export const MembersController = {
  Search: `members`,
  GetAssignMembersToEvent: (id: string) => `members/unassigned-members-to-event/${id}`,
  ExportToExcel: `members/export`,
  MembersDrp: `members/vendor/dropdown`,
  CreateCommitteeMemberAndAssignToEvent: (id: string) => `members/${id}/create-and-assign`,
  CreateCommitteeMember: `members/committee-member`,
  CreateVendorAdmin: `members/vendor-admin`,
  GetVendorMembersByVendor: `members/by-vendor`,
  GetMembersForVendor: (vendorId : string) => `members/by-vendor/${vendorId}`,
  Details: (userId: string) => `members/${userId}`,
  Activities: (userId: string) => `members/${userId}/activities`,
  UpgradeMember: (userId: string) => `members/${userId}/upgrade`,
  DowngradeMember: (userId: string) => `members/${userId}/downgrade`,
  ExportCommitteeMembersToExcel:(vendorId : string)=> `members/${vendorId}/export-members`,
}


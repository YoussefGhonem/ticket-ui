export const EventMembersController = {
  GetEventMembers: (id: string) => `events/${id}/members`,
  SetMemberAsContact: (id: string, memberId: string) => `events/${id}/members/${memberId}/set-as-contact`,
  RemoveContactStatusFromAssignedMember: (id: string, memberId: string) => `events/${id}/members/${memberId}/remove-contact-status`,
  RemoveMembersFromEvent: (id: string) => `events/${id}/members/unassign-members`,
  SetMembersAsContacts: (id: string) => `events/${id}/members/set-as-contacts`,
  RemoveMembersAsContacts: (id: string) => `events/${id}/members/remove-contact-mark-from-members`,
  ExportToExcel: (id: string) => `events/${id}/members/export`,
  AssignMembersToEvent: (id: string) => `events/${id}/members`,
  RemoveMemberFromEvent: (id: string, memberId: string) => `events/${id}/members/${memberId}`,
  SetMembersAsContact: (id: string) => `events/${id}/members/set-as-contacts`,
  RemoveMembersFromContact: (id: string) => `events/${id}/members/remove-contact-mark-from-members`,
}

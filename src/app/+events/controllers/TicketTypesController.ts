export const TicketTypesController = {
  GetTicketTypes: (id: string) => `events/${id}/ticket-types`,
  GetInvitedClients: (id: string, ticketTypeId: string) => `events/${id}/ticket-types/${ticketTypeId}/invited-clients`,
  ExportToExcel: (id: string) => `events/${id}/ticket-types/export`,
  GetTicketTypesDropdown: (id: string) => `events/${id}/ticket-types/dropdown`,
  GetTicketTypesNeedApprovalDropdown: (id: string) => `events/${id}/ticket-types/dropdown-needs-approval`,
  CreateEventTicketType: (id: string) => `events/${id}/ticket-types`,
  UpdateEventTicketType: (id: string, ticketTypeId: string) => `events/${id}/ticket-types/${ticketTypeId}`,
  DeleteEventTicketType: (id: string, ticketTypeId: string) => `events/${id}/ticket-types/${ticketTypeId}`,
  IncreaseTicketsQuantity: (id: string, ticketTypeId: string) => `events/${id}/ticket-types/${ticketTypeId}/increase-quantity`,
  AddNewInvitedClients: (id: string, ticketTypeId: string) => `events/${id}/ticket-types/${ticketTypeId}/add-clients`,
}

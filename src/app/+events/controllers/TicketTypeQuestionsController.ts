export const TicketTypeQuestionsController = {
  GetTicketTypeQuestions: (id: string, ticketTypeId: string) => `events/${id}/ticket-types/${ticketTypeId}/questions`,
  CreateTicketTypeQuestion: (id: string, ticketTypeId: string) => `events/${id}/ticket-types/${ticketTypeId}/questions`,
  UpdateTicketTypeQuestion: (id: string, ticketTypeId: string, questionId: string) => `events/${id}/ticket-types/${ticketTypeId}/questions/${questionId}`,
  DeleteTicketTypeQuestion: (id: string, ticketTypeId: string, questionId: string) => `events/${id}/ticket-types/${ticketTypeId}/questions/${questionId}`,
}

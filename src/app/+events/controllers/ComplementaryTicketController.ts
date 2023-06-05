export const ComplementaryTicketController = {
    CreateComplementaryTicket: (eventId: string) => `events/${eventId}/complimentary-ticket`,
    GetComplementaryTicket: (eventId: string) => `events/${eventId}/complimentary-ticket`,
    DeleteComplementary: (eventId: string) => `events/${eventId}/complimentary-ticket`,
    UpdateComplementary: (eventId: string) => `events/${eventId}/complimentary-ticket`
}

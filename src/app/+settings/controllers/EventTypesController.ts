export const EventTypesController = {
  EventTypes: `event-types`,
  ExportToExcel: `event-types/export`,
  DropDownForActiveEventTypes: `event-types/dropdown`,
  DropDownForEventEdit: (id:string) => `event-types/event-edit-dropdown/${id}`,
  DropDownForEventsFilter: `event-types/events-filter-dropdown`,
  Create: `event-types`,
  Update: (id: string) => `event-types/${id}`,
  Delete: (id: string) => `event-types/${id}`,
  Activate: (id: string) => `event-types/${id}/activate`,
  Deactivate: (id: string) => `event-types/${id}/deactivate`,
  GetEventTypeAudits: (id: string) => `event-types/${id}/audits`,
}

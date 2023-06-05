export const EventRequestsController = {
    GetEventRequests: (id: string) => `requests/by-event/${id}`,
    Reject: (id: string) => `requests/reject`,
    Approve: (id: string) => `requests/approve/for-event/${id}`,
    ExportToExcel: (id: string) => `requests/export/by-event/${id}`,
    GetRequestAudits: (id: string) => `requests/${id}/audits`,
    GetRequestById: (id: string) => `requests/${id}`,
  }
  
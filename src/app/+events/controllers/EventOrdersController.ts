export const EventOrdersController = {
    GetOrders: (id: string) => `orders/by-event/${id}`,
    GetOrdersPerRequest: (id: string) => `orders/by-request/${id}`,
    GetOrderItems: (id: string) => `orders/${id}/items`,
    GetOrderById: (id: string) => `orders/${id}`,
    ExportToExcel: (id: string) => `orders/export/by-event/${id}`
}
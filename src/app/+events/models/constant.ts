import { SortModel } from './../../../@libs/primeng-table/models/sort-object.model';

export const TicketTypesSort: SortModel[] = [
    {displayName: 'Title', propertyName: 'Title'},
    {displayName: 'CreatedDate', propertyName: 'CreatedDate'},
    {displayName: 'Price', propertyName: 'TicketPrice'},
    {displayName: 'Quantity', propertyName: 'Quota.TotalTickets'},
];

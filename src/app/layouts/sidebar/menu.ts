import { RolesEnum } from 'app/+auth/models';
import { MenuItem } from './menu.model';


function role(role: RolesEnum): string {
  return RolesEnum[role];
}

export const MENU: MenuItem[] = [
  {
    id: 10,
    label: 'Dashboard',
    icon: 'ri-dashboard-2-line',
    link: '/dashboard/admin',
    roles: [role(RolesEnum.SuperAdmin), role(RolesEnum.LocalAdmin)]
  },
  {
    id: 2,
    label: 'Settings',
    isTitle: true,
    roles: [role(RolesEnum.SuperAdmin), role(RolesEnum.LocalAdmin)]

  },
  {
    id: 3,
    label: 'Settings',
    icon: ' ri-settings-2-line',
    roles: [role(RolesEnum.SuperAdmin), role(RolesEnum.LocalAdmin)],
    subItems: [
      {
        id: 'Settings',
        label: 'Settings',
        link: '/settings',
        parentId: 3
      },
      {
        id: 'Settings Audits',
        label: 'Settings Audits',
        link: '/settings/audits',
        parentId: 3
      }
    ]
  },
  {
    id: 4,
    label: 'Countries',
    icon: 'ri-map-pin-line',
    link: '/settings/countries',
    roles: [role(RolesEnum.SuperAdmin), role(RolesEnum.LocalAdmin)]

  },
  {
    id: 5,
    label: 'Event Types',
    icon: 'ri-pushpin-fill',
    link: '/settings/event-types',
    roles: [role(RolesEnum.SuperAdmin), role(RolesEnum.LocalAdmin)]

  },


  {
    id: 11,
    label: 'Dashboard',
    icon: 'ri-dashboard-2-line',
    link: '/dashboard/vendor',
    roles: [role(RolesEnum.Vendor), role(RolesEnum.VendorAdmin)]
  },
  {
    id: 6,
    label: 'Users',
    icon: 'ri-group-fill',
    link: '/users',
    roles: [role(RolesEnum.SuperAdmin), role(RolesEnum.LocalAdmin)]
  },


  {
    id: 7,
    label: 'Users',
    icon: 'ri-team-fill',
    link: '/vendors/commitee-members',
    roles: [role(RolesEnum.Vendor), role(RolesEnum.VendorAdmin)]

  },

  {
    id: 8,
    label: 'Events',
    icon: 'ri-external-link-line',
    link: '/events'
  },

  {
    id: 9,
    label: 'Orders',
    icon: 'ri-money-dollar-circle-line',
    link: ''
  },


];

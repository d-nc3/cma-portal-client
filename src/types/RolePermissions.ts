

export type Permission =
  | 'CREATE_USER'
  | 'EDIT_USER'
  | 'DELETE_USER'
  | 'VIEW_REPORTS'
  | 'EDIT_POST'
  | 'APPROVE_REQUEST';


export type Role = 'Admin' | 'driver' | 'viewer' | 'manager';

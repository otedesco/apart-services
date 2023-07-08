export interface AccountRole {
  id: string;
  account: string; //many to one relationship account
  profile: string[]; // many to one relationship profile
  role: string; //reference to roles enum table

  // timestamps
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

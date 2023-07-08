export interface Account {
  id?: number;
  email: string;
  password?: string;
  password_confirmation?: string;
  salt?: string;
  external_type?: string; // Should be related with auth types enum table
  external_id?: string; // External API login (Like Google, facebook Github, ect)
  status?: string; //Current account state ex: (VERIFIED, EMAIL_VERIFICATION_PENDING, etc) it should be a enum reference to account_status table
  roles?: string[]; // Should be related to account_role table (Account may one role for profile and it may have many associeted profiles)
  sessions?: string[]; //should be related to sessions table one account may have many sessions

  created_at?: string;
  updated_at?: string;
  delete_at?: string;
}

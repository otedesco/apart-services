import { Profile } from '../../profile/interfaces/Profile';

import { AccountStatusType } from './AccountStatusType';
import { ExternalAuthType } from './ExternalAuthType';
import { Session } from './Session';

export interface Account {
  id: string;
  email: string;
  password: string;
  salt: string;
  externalAuthType?: ExternalAuthType['type'] | ExternalAuthType;
  externalId?: string;
  status: AccountStatusType['status'] | AccountStatusType;
  sessions?: Session['id'][] | Session[];
  profiles?: Profile['id'][] | Profile[];

  createdAt: string;
  updatedAt: string;
}

// interface Account {
//   id: number;
//   email: string;
//   password: string;
//   salt: string;
//   external_id: string;
//   external_type: ExternalAuthType['id'];
//   status: AccountStatus['id'];
//   sessions: Sessions['id'][];
//   profiles: Profile['id'][];

//   created_at: string;
//   updated_at: string;
//   delete_at: string;
// }

// interface Profile {
//   id: number;
//   name: string;
//   last_name: string;
//   avatar_url: string;
//   type: ProfileType['id'];
//   role: Role['id'];
//   organization: Organization['id'] | null;

//   created_at: string;
//   updated_at: string;
//   delete_at: string;
// }

// interface Organization {
//   id: number;
//   name: string;
//   collaborators: Profile['id'][];
//   // ...TBD

//   created_at: string;
//   updated_at: string;
//   delete_at: string;
// }

// interface ExternalAuthType {
//   id: number;
//   type: string;
// }

// interface AccountStatus {
//   id: number;
//   status: string;
// }

// interface Sessions {
//   id: number;
//   account: Account['id'];
//   // ...Some Session metadata
// }

// interface ProfileType {
//   id: number;
//   type: string; // collaborator | individual
// }

// interface Role {
//   id: number;
//   role: string; // ADMIN, READ_ONLY, WRITE, etc...
// }

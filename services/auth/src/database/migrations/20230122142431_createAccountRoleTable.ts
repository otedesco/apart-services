import { Knex } from 'knex';

import { ACCOUNT_ROLE_TYPE_TABLE } from '../../configs/DBConfig';
import { AccountRoleEnum } from '../../enums/AccountRoleEnum';

export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async () => {
    await knex.schema.createTable(ACCOUNT_ROLE_TYPE_TABLE, table => {
      table.specificType('id', 'serial').notNullable();
      table.string('role', 15).notNullable();
      table.primary(['role']);

      table.timestamps(true, true);
    });

    await knex(ACCOUNT_ROLE_TYPE_TABLE).insert([{ role: AccountRoleEnum.OWNER }, { role: AccountRoleEnum.ADMIN }]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(ACCOUNT_ROLE_TYPE_TABLE);
}

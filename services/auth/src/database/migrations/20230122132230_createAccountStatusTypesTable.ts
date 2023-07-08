import { Knex } from 'knex';

import { ACCOUNT_STATUS_TYPE_TABLE } from '../../configs/DBConfig';
import { AccountStatusEnum } from '../../enums/AccountStatusEnum';

export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async () => {
    await knex.schema.createTable(ACCOUNT_STATUS_TYPE_TABLE, table => {
      table.specificType('id', 'serial').notNullable();
      table.string('status', 30).notNullable();
      table.primary(['status']);

      table.timestamps(true, true);
    });

    await knex(ACCOUNT_STATUS_TYPE_TABLE).insert([
      { status: AccountStatusEnum.VERIFIED },
      { status: AccountStatusEnum.EMAIL_VERIFICATION_PENDING },
    ]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(ACCOUNT_STATUS_TYPE_TABLE);
}

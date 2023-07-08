import { Knex } from 'knex';

import { EXTERNAL_AUTH_TYPE_TABLE } from '../../configs/DBConfig';
import { ExternalAuthTypeEnum } from '../../enums/ExternalAuthTypeEnum';

export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async () => {
    await knex.schema.createTable(EXTERNAL_AUTH_TYPE_TABLE, table => {
      table.specificType('id', 'serial').notNullable();
      table.string('type', 15).notNullable();
      table.primary(['type']);

      table.timestamps(true, true);
    });

    await knex(EXTERNAL_AUTH_TYPE_TABLE).insert([
      { type: ExternalAuthTypeEnum.GOOGLE },
      { type: ExternalAuthTypeEnum.FACEBOOK },
      { type: ExternalAuthTypeEnum.GITHUB },
    ]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(EXTERNAL_AUTH_TYPE_TABLE);
}

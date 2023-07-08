import { Knex } from 'knex';

import { ACCOUNT_ROLES_TABLE, ACCOUNT_ROLE_TYPE_TABLE, ACCOUNT_TABLE, PROFILE_TABLE } from '../../configs/DBConfig';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(ACCOUNT_ROLES_TABLE, table => {
    table.specificType('id', 'uuid').notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('account').notNullable();
    table.uuid('profile').notNullable();
    table.string('role').notNullable();
    table.uuid('updated_by').notNullable();

    table.timestamps(true, true);

    table.primary(['id']);
    table.foreign(['role']).references(['role']).inTable(ACCOUNT_ROLE_TYPE_TABLE);
    table.foreign(['account']).references(['id']).inTable(ACCOUNT_TABLE);
    table.foreign(['updated_by']).references(['id']).inTable(ACCOUNT_TABLE);
    table.foreign(['profile']).references(['id']).inTable(PROFILE_TABLE);

    table.unique(['account', 'profile'], { indexName: 'idx_account_profile', storageEngineIndexType: 'hash' });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(ACCOUNT_ROLES_TABLE);
}

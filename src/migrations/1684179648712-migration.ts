import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateDatabaseTables1684179648712 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          { name: 'id', type: 'int', isPrimary: true },
          { name: 'username', type: 'varchar', isUnique: true },
          { name: 'firstName', type: 'varchar' },
          { name: 'lastName', type: 'varchar' },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar' },
          { name: 'salt', type: 'varchar' },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'task',
        columns: [
          { name: 'id', type: 'int', isPrimary: true },
          { name: 'title', type: 'varchar' },
          { name: 'description', type: 'varchar', isNullable: true },
          { name: 'dueDate', type: 'timestamptz', isNullable: true },
          { name: 'status', type: 'varchar' },
          { name: 'userId', type: 'int' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'task',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'project',
        columns: [
          { name: 'id', type: 'int', isPrimary: true },
          { name: 'title', type: 'varchar' },
          { name: 'description', type: 'varchar', isNullable: true },
          { name: 'userId', type: 'int' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'project',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('project', 'userId');
    await queryRunner.dropTable('project');

    await queryRunner.dropForeignKey('task', 'userId');
    await queryRunner.dropTable('task');

    await queryRunner.dropTable('user');
  }
}

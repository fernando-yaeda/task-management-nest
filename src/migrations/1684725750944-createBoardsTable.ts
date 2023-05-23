import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class CreateBoardsTable1684725750944 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'board',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'title', type: 'varchar' },
          { name: 'description', type: 'varchar', isNullable: true },
          { name: 'projectId', type: 'int' },
          { name: 'userId', type: 'int' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'board',
      new TableForeignKey({
        columnNames: ['projectId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'project',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'board',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.addColumn(
      'task',
      new TableColumn({
        name: 'boardId',
        type: 'int',
      }),
    );

    await queryRunner.createForeignKey(
      'task',
      new TableForeignKey({
        columnNames: ['boardId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'board',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('board', 'userId');
    await queryRunner.dropForeignKey('board', 'projectId');
    await queryRunner.dropForeignKey('task', 'boardId');
    await queryRunner.dropColumn('task', 'boardId');
    await queryRunner.dropTable('board');
  }
}

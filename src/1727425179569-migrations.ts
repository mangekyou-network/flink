import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1727425179569 implements MigrationInterface {
    name = 'Migrations1727425179569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."intention_record_tx_status_enum" AS ENUM('pending', 'success', 'faild')`);
        await queryRunner.query(`CREATE TABLE "intention_record_tx" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "intentionRecordId" integer NOT NULL, "txHash" bytea NOT NULL, "chainId" integer NOT NULL, "status" "public"."intention_record_tx_status_enum" NOT NULL, CONSTRAINT "PK_90360e5acfd1eb5a78451b6483c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d7e06e1eaa7ad0b1897c40fe02" ON "intention_record_tx" ("txHash", "chainId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3deac0791bf973f98ccafb5f6d" ON "intention_record_tx" ("intentionRecordId") `);
        await queryRunner.query(`CREATE TYPE "public"."intention_record_status_enum" AS ENUM('waiting', 'pending', 'success', 'faild')`);
        await queryRunner.query(`CREATE TABLE "intention_record" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "intentionCode" character varying NOT NULL, "address" bytea NOT NULL, "status" "public"."intention_record_status_enum" NOT NULL, "intention" jsonb NOT NULL, "opUserHash" bytea, "opUserChainId" integer NOT NULL, CONSTRAINT "PK_83a4a49b1d7f417b618fd977e58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f9ae6c3cb88bb3315f5cf4398c" ON "intention_record" ("opUserHash", "opUserChainId") `);
        await queryRunner.query(`CREATE INDEX "IDX_acef01de54eb4bdad83839a8f3" ON "intention_record" ("address") `);
        await queryRunner.query(`CREATE INDEX "IDX_409e50e5e6cfc088829c4f3f8c" ON "intention_record" ("intentionCode") `);
        await queryRunner.query(`CREATE TYPE "public"."creator_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "creator" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "address" bytea NOT NULL, "status" "public"."creator_status_enum" NOT NULL, CONSTRAINT "PK_43e489c9896f9eb32f7a0b912c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b0a70384cd0d4a601ead21c0f4" ON "creator" ("address") `);
        await queryRunner.query(`CREATE TABLE "intention" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "code" character varying NOT NULL, "creatorId" integer NOT NULL, "actionId" character varying NOT NULL, "actionVersion" character varying NOT NULL DEFAULT 'v1', "title" character varying NOT NULL, "description" character varying NOT NULL, "metadata" character varying NOT NULL, "settings" jsonb NOT NULL, "active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_0a8e6162c44d361415629cce490" PRIMARY KEY ("code"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b648296e4e523b6801168d5ba4" ON "intention" ("creatorId") `);
        await queryRunner.query(`CREATE TABLE "action" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" character varying(20) NOT NULL, "title" character varying(40) NOT NULL, "logo" character varying(255) NOT NULL, "networks" jsonb NOT NULL, "description" character varying(255) NOT NULL, "author" jsonb NOT NULL, "dApp" jsonb NOT NULL, "magicLinkMetadata" jsonb NOT NULL DEFAULT '{}', "intent" jsonb NOT NULL, "intentionCount" integer NOT NULL DEFAULT '0', "interaction" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_2d9db9cf5edfbbae74eb56e3a39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dd5404c43fc1adcb4c242acc12" ON "action" ("intentionCount") `);
        await queryRunner.query(`CREATE INDEX "IDX_47dc39f427aa1175603d6e8945" ON "action" ("interaction") `);
        await queryRunner.query(`ALTER TABLE "intention_record_tx" ADD CONSTRAINT "FK_3deac0791bf973f98ccafb5f6d2" FOREIGN KEY ("intentionRecordId") REFERENCES "intention_record"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "intention" ADD CONSTRAINT "FK_b648296e4e523b6801168d5ba42" FOREIGN KEY ("creatorId") REFERENCES "creator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "intention" ADD CONSTRAINT "FK_8b7409224328b3c1fe7e09e3f0b" FOREIGN KEY ("actionId") REFERENCES "action"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "intention" DROP CONSTRAINT "FK_8b7409224328b3c1fe7e09e3f0b"`);
        await queryRunner.query(`ALTER TABLE "intention" DROP CONSTRAINT "FK_b648296e4e523b6801168d5ba42"`);
        await queryRunner.query(`ALTER TABLE "intention_record_tx" DROP CONSTRAINT "FK_3deac0791bf973f98ccafb5f6d2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_47dc39f427aa1175603d6e8945"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dd5404c43fc1adcb4c242acc12"`);
        await queryRunner.query(`DROP TABLE "action"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b648296e4e523b6801168d5ba4"`);
        await queryRunner.query(`DROP TABLE "intention"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b0a70384cd0d4a601ead21c0f4"`);
        await queryRunner.query(`DROP TABLE "creator"`);
        await queryRunner.query(`DROP TYPE "public"."creator_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_409e50e5e6cfc088829c4f3f8c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_acef01de54eb4bdad83839a8f3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f9ae6c3cb88bb3315f5cf4398c"`);
        await queryRunner.query(`DROP TABLE "intention_record"`);
        await queryRunner.query(`DROP TYPE "public"."intention_record_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3deac0791bf973f98ccafb5f6d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d7e06e1eaa7ad0b1897c40fe02"`);
        await queryRunner.query(`DROP TABLE "intention_record_tx"`);
        await queryRunner.query(`DROP TYPE "public"."intention_record_tx_status_enum"`);
    }

}

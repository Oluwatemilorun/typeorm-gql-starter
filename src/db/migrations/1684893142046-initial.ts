import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1684893142046 implements MigrationInterface {
    name = 'Initial1684893142046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying NOT NULL, "middleName" character varying NOT NULL, "lastName" character varying NOT NULL, "password" character varying NOT NULL, "locationId" uuid, CONSTRAINT "REL_49acb911ee20b02f86ec532a12" UNIQUE ("locationId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "restaurant_location" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "address" character varying(50) NOT NULL, "street" character varying(50) NOT NULL, "city" character varying(50) NOT NULL, "state" character varying(50) NOT NULL, "postalCode" character varying, "latlng" jsonb, CONSTRAINT "PK_cb49509e38be7c51870af77b8e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_location" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "address" character varying(50) NOT NULL, "street" character varying(50) NOT NULL, "city" character varying(50) NOT NULL, "state" character varying(50) NOT NULL, "postalCode" character varying, "latlng" jsonb, CONSTRAINT "PK_37bfb01591406f0fefaed6799a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(50) NOT NULL, "description" character varying(150) NOT NULL, "coverUrl" character varying(1000), "iconUrl" character varying(1000), CONSTRAINT "PK_52ed46113ccd539004fd1b016ea" PRIMARY KEY ("id", "name"))`);
        await queryRunner.query(`CREATE TABLE "menu" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying(150) NOT NULL, "coverUrl" character varying(1000), "restaurantId" uuid, CONSTRAINT "PK_35b2a8f47d153ff7a41860cceeb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dish" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(150) NOT NULL, "shortDescription" character varying(200) NOT NULL, "description" character varying(1500), "coverUrl" character varying, "gallery" text NOT NULL, "price" integer NOT NULL, "currency" character varying DEFAULT 'NGN', "unit" character varying(20) NOT NULL, "menuId" uuid, "restaurantId" uuid, CONSTRAINT "PK_59ac7b35af39b231276bfc4c00c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "dish-name-idx" ON "dish" ("name") `);
        await queryRunner.query(`CREATE TABLE "restaurant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(200) NOT NULL, "shortDescription" character varying(200) NOT NULL, "description" character varying(1500), "logoUrl" character varying NOT NULL, "coverUrl" character varying, "locationId" uuid, CONSTRAINT "REL_d869ee46445a391f13451d287f" UNIQUE ("locationId"), CONSTRAINT "PK_649e250d8b8165cb406d99aa30f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "restaurant-name-idx" ON "restaurant" ("name") `);
        await queryRunner.query(`CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "customerName" character varying NOT NULL, "customerEmail" character varying NOT NULL, "customerPhone" character varying NOT NULL, "status" character varying NOT NULL, "restaurantId" uuid, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dish_categories_category" ("dishId" uuid NOT NULL, "categoryId" uuid NOT NULL, "categoryName" character varying(50) NOT NULL, CONSTRAINT "PK_1a6c056397b970576f1d0a4d88c" PRIMARY KEY ("dishId", "categoryId", "categoryName"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5d1711e6796df7846e2a5df4f0" ON "dish_categories_category" ("dishId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a447a15e11df38648f721c83b4" ON "dish_categories_category" ("categoryId", "categoryName") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_49acb911ee20b02f86ec532a122" FOREIGN KEY ("locationId") REFERENCES "user_location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu" ADD CONSTRAINT "FK_085156de3c3a44eba017a6a0846" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dish" ADD CONSTRAINT "FK_b43c2b159b975d6f0f9828f563f" FOREIGN KEY ("menuId") REFERENCES "menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dish" ADD CONSTRAINT "FK_3bf1369e81b12358ba268f7f689" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "restaurant" ADD CONSTRAINT "FK_d869ee46445a391f13451d287f5" FOREIGN KEY ("locationId") REFERENCES "restaurant_location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_c93f22720c77241d2476c07cabf" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dish_categories_category" ADD CONSTRAINT "FK_5d1711e6796df7846e2a5df4f08" FOREIGN KEY ("dishId") REFERENCES "dish"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "dish_categories_category" ADD CONSTRAINT "FK_a447a15e11df38648f721c83b44" FOREIGN KEY ("categoryId", "categoryName") REFERENCES "category"("id","name") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dish_categories_category" DROP CONSTRAINT "FK_a447a15e11df38648f721c83b44"`);
        await queryRunner.query(`ALTER TABLE "dish_categories_category" DROP CONSTRAINT "FK_5d1711e6796df7846e2a5df4f08"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_c93f22720c77241d2476c07cabf"`);
        await queryRunner.query(`ALTER TABLE "restaurant" DROP CONSTRAINT "FK_d869ee46445a391f13451d287f5"`);
        await queryRunner.query(`ALTER TABLE "dish" DROP CONSTRAINT "FK_3bf1369e81b12358ba268f7f689"`);
        await queryRunner.query(`ALTER TABLE "dish" DROP CONSTRAINT "FK_b43c2b159b975d6f0f9828f563f"`);
        await queryRunner.query(`ALTER TABLE "menu" DROP CONSTRAINT "FK_085156de3c3a44eba017a6a0846"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_49acb911ee20b02f86ec532a122"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a447a15e11df38648f721c83b4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5d1711e6796df7846e2a5df4f0"`);
        await queryRunner.query(`DROP TABLE "dish_categories_category"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP INDEX "public"."restaurant-name-idx"`);
        await queryRunner.query(`DROP TABLE "restaurant"`);
        await queryRunner.query(`DROP INDEX "public"."dish-name-idx"`);
        await queryRunner.query(`DROP TABLE "dish"`);
        await queryRunner.query(`DROP TABLE "menu"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "user_location"`);
        await queryRunner.query(`DROP TABLE "restaurant_location"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}

<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250414131619 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" ADD username VARCHAR(255) DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" ADD firstname VARCHAR(100) DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" ADD lastname VARCHAR(100) DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" ADD bio TEXT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" ADD city VARCHAR(100) DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" ADD state VARCHAR(100) DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" ADD country VARCHAR(100) DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" ADD sex VARCHAR(1) DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" ADD premium BOOLEAN NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" ADD summit BOOLEAN NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" ADD updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" ADD badge_type_id INT DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" ADD weight DOUBLE PRECISION DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" ADD profile_medium VARCHAR(255) DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" ADD profile VARCHAR(255) DEFAULT NULL
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE SCHEMA public
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" DROP username
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" DROP firstname
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" DROP lastname
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" DROP bio
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" DROP city
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" DROP state
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" DROP country
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" DROP sex
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" DROP premium
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" DROP summit
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" DROP created_at
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" DROP updated_at
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" DROP badge_type_id
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" DROP weight
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" DROP profile_medium
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE "user" DROP profile
        SQL);
    }
}

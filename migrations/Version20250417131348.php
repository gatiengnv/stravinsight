<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250417131348 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE hearth_rate_zones (id SERIAL NOT NULL, strava_user_id INT DEFAULT NULL, zone1 TEXT DEFAULT NULL, zone2 TEXT DEFAULT NULL, zone3 TEXT DEFAULT NULL, zone4 TEXT DEFAULT NULL, zone5 TEXT DEFAULT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_A693B56462982261 ON hearth_rate_zones (strava_user_id)
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN hearth_rate_zones.zone1 IS '(DC2Type:array)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN hearth_rate_zones.zone2 IS '(DC2Type:array)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN hearth_rate_zones.zone3 IS '(DC2Type:array)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN hearth_rate_zones.zone4 IS '(DC2Type:array)'
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN hearth_rate_zones.zone5 IS '(DC2Type:array)'
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE hearth_rate_zones ADD CONSTRAINT FK_A693B56462982261 FOREIGN KEY (strava_user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE SCHEMA public
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE hearth_rate_zones DROP CONSTRAINT FK_A693B56462982261
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE hearth_rate_zones
        SQL);
    }
}

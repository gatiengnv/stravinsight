<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250424084502 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE activity_stream (activity_id BIGINT NOT NULL, latlng_data JSON DEFAULT NULL, velocity_data JSON DEFAULT NULL, grade_data JSON DEFAULT NULL, cadence_data JSON DEFAULT NULL, distance_data JSON DEFAULT NULL, altitude_data JSON DEFAULT NULL, heartrate_data JSON DEFAULT NULL, time_data JSON DEFAULT NULL, original_size INT DEFAULT NULL, resolution VARCHAR(50) DEFAULT NULL, PRIMARY KEY(activity_id))
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE activity_stream ADD CONSTRAINT FK_A29F5E1C81C06096 FOREIGN KEY (activity_id) REFERENCES activity (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE SCHEMA public
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE activity_stream DROP CONSTRAINT FK_A29F5E1C81C06096
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE activity_stream
        SQL);
    }
}

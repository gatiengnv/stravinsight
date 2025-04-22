<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250422084617 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE activity_details (activity_id BIGINT NOT NULL, map_polyline TEXT DEFAULT NULL, visibility VARCHAR(50) DEFAULT NULL, heartrate_opt_out BOOLEAN DEFAULT NULL, display_hide_heartrate_option BOOLEAN DEFAULT NULL, elevation_high DOUBLE PRECISION DEFAULT NULL, elevation_low DOUBLE PRECISION DEFAULT NULL, upload_id_str VARCHAR(255) DEFAULT NULL, description TEXT DEFAULT NULL, calories DOUBLE PRECISION DEFAULT NULL, perceived_exertion INT DEFAULT NULL, prefer_perceived_exertion BOOLEAN DEFAULT NULL, segment_efforts JSON DEFAULT NULL, splits_metric JSON DEFAULT NULL, splits_standard JSON DEFAULT NULL, laps JSON DEFAULT NULL, best_efforts JSON DEFAULT NULL, gear_details JSON DEFAULT NULL, photos_details JSON DEFAULT NULL, stats_visibility JSON DEFAULT NULL, hide_from_home BOOLEAN DEFAULT NULL, device_name VARCHAR(255) DEFAULT NULL, embed_token VARCHAR(255) DEFAULT NULL, similar_activities JSON DEFAULT NULL, available_zones JSON DEFAULT NULL, PRIMARY KEY(activity_id))
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE activity_details ADD CONSTRAINT FK_72747D6A81C06096 FOREIGN KEY (activity_id) REFERENCES activity (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE SCHEMA public
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE activity_details DROP CONSTRAINT FK_72747D6A81C06096
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE activity_details
        SQL);
    }
}

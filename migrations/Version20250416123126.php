<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250416123126 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE activity (id BIGINT NOT NULL, strava_user_id INT NOT NULL, gear_id VARCHAR(255) DEFAULT NULL, name VARCHAR(255) DEFAULT NULL, type VARCHAR(50) DEFAULT NULL, sport_type VARCHAR(100) DEFAULT NULL, workout_type INT DEFAULT NULL, start_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, start_date_local TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, timezone VARCHAR(255) DEFAULT NULL, utc_offset INT DEFAULT NULL, moving_time INT DEFAULT NULL, elapsed_time INT DEFAULT NULL, distance DOUBLE PRECISION DEFAULT NULL, total_elevation_gain DOUBLE PRECISION DEFAULT NULL, average_speed DOUBLE PRECISION DEFAULT NULL, max_speed DOUBLE PRECISION DEFAULT NULL, average_watts DOUBLE PRECISION DEFAULT NULL, weighted_average_watts INT DEFAULT NULL, max_watts DOUBLE PRECISION DEFAULT NULL, device_watts BOOLEAN DEFAULT NULL, kilojoules DOUBLE PRECISION DEFAULT NULL, has_heartrate BOOLEAN DEFAULT NULL, average_heartrate DOUBLE PRECISION DEFAULT NULL, max_heartrate INT DEFAULT NULL, suffer_score INT DEFAULT NULL, average_cadence DOUBLE PRECISION DEFAULT NULL, start_latlng JSON DEFAULT NULL, end_latlng JSON DEFAULT NULL, location_city VARCHAR(255) DEFAULT NULL, location_state VARCHAR(255) DEFAULT NULL, location_country VARCHAR(255) DEFAULT NULL, map_id VARCHAR(255) DEFAULT NULL, summary_polyline TEXT DEFAULT NULL, achievement_count INT DEFAULT NULL, kudos_count INT DEFAULT NULL, comment_count INT DEFAULT NULL, athlete_count INT DEFAULT NULL, photo_count INT DEFAULT NULL, total_photo_count INT DEFAULT NULL, pr_count INT DEFAULT NULL, has_kudoed BOOLEAN DEFAULT NULL, trainer BOOLEAN DEFAULT NULL, commute BOOLEAN DEFAULT NULL, manual BOOLEAN DEFAULT NULL, private BOOLEAN DEFAULT NULL, flagged BOOLEAN DEFAULT NULL, from_accepted_tag BOOLEAN DEFAULT NULL, resource_state INT DEFAULT NULL, external_id VARCHAR(255) DEFAULT NULL, upload_id VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_AC74095A62982261 ON activity (strava_user_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE "user" (id SERIAL NOT NULL, strava_id VARCHAR(180) NOT NULL, username VARCHAR(255) DEFAULT NULL, firstname VARCHAR(100) DEFAULT NULL, lastname VARCHAR(100) DEFAULT NULL, bio TEXT DEFAULT NULL, city VARCHAR(100) DEFAULT NULL, state VARCHAR(100) DEFAULT NULL, country VARCHAR(100) DEFAULT NULL, sex VARCHAR(1) DEFAULT NULL, premium BOOLEAN NOT NULL, summit BOOLEAN NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, badge_type_id INT DEFAULT NULL, weight DOUBLE PRECISION DEFAULT NULL, profile_medium VARCHAR(255) DEFAULT NULL, profile VARCHAR(255) DEFAULT NULL, roles JSON NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_IDENTIFIER_STRAVA_ID ON "user" (strava_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE activity ADD CONSTRAINT FK_AC74095A62982261 FOREIGN KEY (strava_user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE SCHEMA public
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE activity DROP CONSTRAINT FK_AC74095A62982261
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE activity
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE "user"
        SQL);
    }
}

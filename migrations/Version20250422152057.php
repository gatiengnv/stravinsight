<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250422152057 extends AbstractMigration
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
            CREATE TABLE activity_details (activity_id BIGINT NOT NULL, map_polyline TEXT DEFAULT NULL, visibility VARCHAR(50) DEFAULT NULL, heartrate_opt_out BOOLEAN DEFAULT NULL, display_hide_heartrate_option BOOLEAN DEFAULT NULL, elevation_high DOUBLE PRECISION DEFAULT NULL, elevation_low DOUBLE PRECISION DEFAULT NULL, upload_id_str VARCHAR(255) DEFAULT NULL, description TEXT DEFAULT NULL, calories DOUBLE PRECISION DEFAULT NULL, perceived_exertion INT DEFAULT NULL, prefer_perceived_exertion BOOLEAN DEFAULT NULL, segment_efforts JSON DEFAULT NULL, splits_metric JSON DEFAULT NULL, splits_standard JSON DEFAULT NULL, laps JSON DEFAULT NULL, best_efforts JSON DEFAULT NULL, gear_details JSON DEFAULT NULL, photos_details JSON DEFAULT NULL, stats_visibility JSON DEFAULT NULL, hide_from_home BOOLEAN DEFAULT NULL, device_name VARCHAR(255) DEFAULT NULL, embed_token VARCHAR(255) DEFAULT NULL, similar_activities JSON DEFAULT NULL, available_zones JSON DEFAULT NULL, PRIMARY KEY(activity_id))
        SQL);
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
            CREATE TABLE "user" (id SERIAL NOT NULL, strava_id VARCHAR(180) NOT NULL, username VARCHAR(255) DEFAULT NULL, firstname VARCHAR(100) DEFAULT NULL, lastname VARCHAR(100) DEFAULT NULL, bio TEXT DEFAULT NULL, city VARCHAR(100) DEFAULT NULL, state VARCHAR(100) DEFAULT NULL, country VARCHAR(100) DEFAULT NULL, sex VARCHAR(1) DEFAULT NULL, premium BOOLEAN NOT NULL, summit BOOLEAN NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, badge_type_id INT DEFAULT NULL, weight DOUBLE PRECISION DEFAULT NULL, profile_medium VARCHAR(255) DEFAULT NULL, profile VARCHAR(255) DEFAULT NULL, roles JSON NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_IDENTIFIER_STRAVA_ID ON "user" (strava_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE activity ADD CONSTRAINT FK_AC74095A62982261 FOREIGN KEY (strava_user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE activity_details ADD CONSTRAINT FK_72747D6A81C06096 FOREIGN KEY (activity_id) REFERENCES activity (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE hearth_rate_zones ADD CONSTRAINT FK_A693B56462982261 FOREIGN KEY (strava_user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE activity DROP CONSTRAINT FK_AC74095A62982261
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE activity_details DROP CONSTRAINT FK_72747D6A81C06096
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE hearth_rate_zones DROP CONSTRAINT FK_A693B56462982261
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE activity
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE activity_details
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE hearth_rate_zones
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE "user"
        SQL);
    }
}

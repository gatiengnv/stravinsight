<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250505130431 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE airesponse (activity_id BIGINT NOT NULL, overview TEXT DEFAULT NULL, charts TEXT DEFAULT NULL, splits TEXT DEFAULT NULL, PRIMARY KEY(activity_id))
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE airesponse ADD CONSTRAINT FK_7636E45581C06096 FOREIGN KEY (activity_id) REFERENCES activity (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE SCHEMA public
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE airesponse DROP CONSTRAINT FK_7636E45581C06096
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE airesponse
        SQL);
    }
}

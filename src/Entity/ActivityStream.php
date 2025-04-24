<?php

namespace App\Entity;

use App\Repository\ActivityStreamRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ActivityStreamRepository::class)]
#[ORM\Table(name: 'activity_stream')]
class ActivityStream
{
    #[ORM\Id]
    #[ORM\OneToOne(targetEntity: Activity::class, inversedBy: 'activityStream')]
    #[ORM\JoinColumn(name: 'activity_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?Activity $activity = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $latlngData = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $velocityData = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $gradeData = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $cadenceData = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $distanceData = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $altitudeData = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $heartrateData = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $timeData = null;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $originalSize = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $resolution = null;

    public function getId(): ?int
    {
        return $this->activity?->getId();
    }

    public function getActivity(): ?Activity
    {
        return $this->activity;
    }

    public function setActivity(?Activity $activity): static
    {
        $this->activity = $activity;

        return $this;
    }

    public function getLatlngData(): ?array
    {
        return $this->latlngData;
    }

    public function setLatlngData(?array $latlngData): static
    {
        $this->latlngData = $latlngData;

        return $this;
    }

    public function getVelocityData(): ?array
    {
        return $this->velocityData;
    }

    public function setVelocityData(?array $velocityData): static
    {
        $this->velocityData = $velocityData;

        return $this;
    }

    public function getGradeData(): ?array
    {
        return $this->gradeData;
    }

    public function setGradeData(?array $gradeData): static
    {
        $this->gradeData = $gradeData;

        return $this;
    }

    public function getCadenceData(): ?array
    {
        return $this->cadenceData;
    }

    public function setCadenceData(?array $cadenceData): static
    {
        $this->cadenceData = $cadenceData;

        return $this;
    }

    public function getDistanceData(): ?array
    {
        return $this->distanceData;
    }

    public function setDistanceData(?array $distanceData): static
    {
        $this->distanceData = $distanceData;

        return $this;
    }

    public function getAltitudeData(): ?array
    {
        return $this->altitudeData;
    }

    public function setAltitudeData(?array $altitudeData): static
    {
        $this->altitudeData = $altitudeData;

        return $this;
    }

    public function getHeartrateData(): ?array
    {
        return $this->heartrateData;
    }

    public function setHeartrateData(?array $heartrateData): static
    {
        $this->heartrateData = $heartrateData;

        return $this;
    }

    public function getTimeData(): ?array
    {
        return $this->timeData;
    }

    public function setTimeData(?array $timeData): static
    {
        $this->timeData = $timeData;

        return $this;
    }

    public function getOriginalSize(): ?int
    {
        return $this->originalSize;
    }

    public function setOriginalSize(?int $originalSize): static
    {
        $this->originalSize = $originalSize;

        return $this;
    }

    public function getResolution(): ?string
    {
        return $this->resolution;
    }

    public function setResolution(?string $resolution): static
    {
        $this->resolution = $resolution;

        return $this;
    }
}

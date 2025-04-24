<?php

namespace App\Entity;

use App\Repository\ActivityDetailsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ActivityDetailsRepository::class)]
#[ORM\Table(name: 'activity_details')]
class ActivityDetails
{
    #[ORM\Id]
    #[ORM\OneToOne(targetEntity: Activity::class, inversedBy: 'activityDetails')]
    #[ORM\JoinColumn(name: 'activity_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?Activity $activity = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $mapPolyline = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $visibility = null;

    #[ORM\Column(type: Types::BOOLEAN, nullable: true)]
    private ?bool $heartrateOptOut = null;

    #[ORM\Column(type: Types::BOOLEAN, nullable: true)]
    private ?bool $displayHideHeartrateOption = null;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $elevationHigh = null;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $elevationLow = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $uploadIdStr = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $calories = null;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $perceivedExertion = null;

    #[ORM\Column(type: Types::BOOLEAN, nullable: true)]
    private ?bool $preferPerceivedExertion = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $segmentEfforts = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $splitsMetric = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $splitsStandard = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $laps = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $bestEfforts = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $gearDetails = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $photosDetails = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $statsVisibility = null;

    #[ORM\Column(type: Types::BOOLEAN, nullable: true)]
    private ?bool $hideFromHome = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $deviceName = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $embedToken = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $similarActivities = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $availableZones = null;

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

    public function getMapPolyline(): ?string
    {
        return $this->mapPolyline;
    }

    public function setMapPolyline(?string $mapPolyline): static
    {
        $this->mapPolyline = $mapPolyline;

        return $this;
    }

    public function getVisibility(): ?string
    {
        return $this->visibility;
    }

    public function setVisibility(?string $visibility): static
    {
        $this->visibility = $visibility;

        return $this;
    }

    public function isHeartrateOptOut(): ?bool
    {
        return $this->heartrateOptOut;
    }

    public function setHeartrateOptOut(?bool $heartrateOptOut): static
    {
        $this->heartrateOptOut = $heartrateOptOut;

        return $this;
    }

    public function isDisplayHideHeartrateOption(): ?bool
    {
        return $this->displayHideHeartrateOption;
    }

    public function setDisplayHideHeartrateOption(?bool $displayHideHeartrateOption): static
    {
        $this->displayHideHeartrateOption = $displayHideHeartrateOption;

        return $this;
    }

    public function getElevationHigh(): ?float
    {
        return $this->elevationHigh;
    }

    public function setElevationHigh(?float $elevationHigh): static
    {
        $this->elevationHigh = $elevationHigh;

        return $this;
    }

    public function getElevationLow(): ?float
    {
        return $this->elevationLow;
    }

    public function setElevationLow(?float $elevationLow): static
    {
        $this->elevationLow = $elevationLow;

        return $this;
    }

    public function getUploadIdStr(): ?string
    {
        return $this->uploadIdStr;
    }

    public function setUploadIdStr(?string $uploadIdStr): static
    {
        $this->uploadIdStr = $uploadIdStr;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getCalories(): ?float
    {
        return $this->calories;
    }

    public function setCalories(?float $calories): static
    {
        $this->calories = $calories;

        return $this;
    }

    public function getPerceivedExertion(): ?int
    {
        return $this->perceivedExertion;
    }

    public function setPerceivedExertion(?int $perceivedExertion): static
    {
        $this->perceivedExertion = $perceivedExertion;

        return $this;
    }

    public function isPreferPerceivedExertion(): ?bool
    {
        return $this->preferPerceivedExertion;
    }

    public function setPreferPerceivedExertion(?bool $preferPerceivedExertion): static
    {
        $this->preferPerceivedExertion = $preferPerceivedExertion;

        return $this;
    }

    public function getSegmentEfforts(): ?array
    {
        return $this->segmentEfforts;
    }

    public function setSegmentEfforts(?array $segmentEfforts): static
    {
        $this->segmentEfforts = $segmentEfforts;

        return $this;
    }

    public function getSplitsMetric(): ?array
    {
        return $this->splitsMetric;
    }

    public function setSplitsMetric(?array $splitsMetric): static
    {
        $this->splitsMetric = $splitsMetric;

        return $this;
    }

    public function getSplitsStandard(): ?array
    {
        return $this->splitsStandard;
    }

    public function setSplitsStandard(?array $splitsStandard): static
    {
        $this->splitsStandard = $splitsStandard;

        return $this;
    }

    public function getLaps(): ?array
    {
        return $this->laps;
    }

    public function setLaps(?array $laps): static
    {
        $this->laps = $laps;

        return $this;
    }

    public function getBestEfforts(): ?array
    {
        return $this->bestEfforts;
    }

    public function setBestEfforts(?array $bestEfforts): static
    {
        $this->bestEfforts = $bestEfforts;

        return $this;
    }

    public function getGearDetails(): ?array
    {
        return $this->gearDetails;
    }

    public function setGearDetails(?array $gearDetails): static
    {
        $this->gearDetails = $gearDetails;

        return $this;
    }

    public function getPhotosDetails(): ?array
    {
        return $this->photosDetails;
    }

    public function setPhotosDetails(?array $photosDetails): static
    {
        $this->photosDetails = $photosDetails;

        return $this;
    }

    public function getStatsVisibility(): ?array
    {
        return $this->statsVisibility;
    }

    public function setStatsVisibility(?array $statsVisibility): static
    {
        $this->statsVisibility = $statsVisibility;

        return $this;
    }

    public function isHideFromHome(): ?bool
    {
        return $this->hideFromHome;
    }

    public function setHideFromHome(?bool $hideFromHome): static
    {
        $this->hideFromHome = $hideFromHome;

        return $this;
    }

    public function getDeviceName(): ?string
    {
        return $this->deviceName;
    }

    public function setDeviceName(?string $deviceName): static
    {
        $this->deviceName = $deviceName;

        return $this;
    }

    public function getEmbedToken(): ?string
    {
        return $this->embedToken;
    }

    public function setEmbedToken(?string $embedToken): static
    {
        $this->embedToken = $embedToken;

        return $this;
    }

    public function getSimilarActivities(): ?array
    {
        return $this->similarActivities;
    }

    public function setSimilarActivities(?array $similarActivities): static
    {
        $this->similarActivities = $similarActivities;

        return $this;
    }

    public function getAvailableZones(): ?array
    {
        return $this->availableZones;
    }

    public function setAvailableZones(?array $availableZones): static
    {
        $this->availableZones = $availableZones;

        return $this;
    }
}

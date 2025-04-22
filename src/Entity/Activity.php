<?php

namespace App\Entity;

use App\Repository\ActivityRepository;
use DateTimeInterface;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

#[ORM\Entity(repositoryClass: ActivityRepository::class)]
#[UniqueEntity('id')]
class Activity
{
    #[ORM\Id]
    #[ORM\Column(type: Types::BIGINT)]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'activities')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $stravaUser = null;

    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private ?string $gearId = null;

    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private ?string $name = null;

    #[ORM\Column(type: Types::STRING, length: 50, nullable: true)]
    private ?string $type = null;

    #[ORM\Column(type: Types::STRING, length: 100, nullable: true)]
    private ?string $sportType = null;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $workoutType = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?DateTimeInterface $startDate = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?DateTimeInterface $startDateLocal = null;

    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private ?string $timezone = null;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $utcOffset = null;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $movingTime = null;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $elapsedTime = null;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $distance = null;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $totalElevationGain = null;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $averageSpeed = null;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $maxSpeed = null;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $averageWatts = null;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $weightedAverageWatts = null;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $maxWatts = null;

    #[ORM\Column(type: Types::BOOLEAN, nullable: true)]
    private ?bool $deviceWatts = null;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $kilojoules = null;

    #[ORM\Column(type: Types::BOOLEAN, nullable: true)]
    private ?bool $hasHeartrate = null;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $averageHeartrate = null;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $maxHeartrate = null;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $sufferScore = null;

    #[ORM\Column(type: Types::FLOAT, nullable: true)]
    private ?float $averageCadence = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $startLatlng = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    private ?array $endLatlng = null;

    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private ?string $locationCity = null;

    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private ?string $locationState = null;

    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private ?string $locationCountry = null;

    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private ?string $mapId = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $summaryPolyline = null;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $achievementCount = null;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $kudosCount = null;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $commentCount = null;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $athleteCount = null;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $photoCount = null;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $totalPhotoCount = null;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $prCount = null;

    #[ORM\Column(type: Types::BOOLEAN, nullable: true)]
    private ?bool $hasKudoed = null;

    #[ORM\Column(type: Types::BOOLEAN, nullable: true)]
    private ?bool $trainer = null;

    #[ORM\Column(type: Types::BOOLEAN, nullable: true)]
    private ?bool $commute = null;

    #[ORM\Column(type: Types::BOOLEAN, nullable: true)]
    private ?bool $manual = null;

    #[ORM\Column(type: Types::BOOLEAN, nullable: true)]
    private ?bool $private = null;

    #[ORM\Column(type: Types::BOOLEAN, nullable: true)]
    private ?bool $flagged = null;

    #[ORM\Column(type: Types::BOOLEAN, nullable: true)]
    private ?bool $fromAcceptedTag = null;

    #[ORM\Column(type: Types::INTEGER, nullable: true)]
    private ?int $resourceState = null;

    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private ?string $externalId = null;

    #[ORM\Column(type: Types::STRING, length: 255, nullable: true)]
    private ?string $uploadId = null;

    #[ORM\OneToOne(mappedBy: 'activity', cascade: ['persist', 'remove'])]
    private ?ActivityDetails $activityDetails = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getStravaUser(): ?User
    {
        return $this->stravaUser;
    }

    public function setStravaUser(?User $stravaUser): static
    {
        $this->stravaUser = $stravaUser;

        return $this;
    }

    public function getGearId(): ?string
    {
        return $this->gearId;
    }

    public function setGearId(?string $gearId): static
    {
        $this->gearId = $gearId;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getSportType(): ?string
    {
        return $this->sportType;
    }

    public function setSportType(?string $sportType): static
    {
        $this->sportType = $sportType;

        return $this;
    }

    public function getWorkoutType(): ?int
    {
        return $this->workoutType;
    }

    public function setWorkoutType(?int $workoutType): static
    {
        $this->workoutType = $workoutType;

        return $this;
    }

    public function getStartDate(): ?DateTimeInterface
    {
        return $this->startDate;
    }

    public function setStartDate(?DateTimeInterface $startDate): static
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getStartDateLocal(): ?DateTimeInterface
    {
        return $this->startDateLocal;
    }

    public function setStartDateLocal(?DateTimeInterface $startDateLocal): static
    {
        $this->startDateLocal = $startDateLocal;

        return $this;
    }

    public function getTimezone(): ?string
    {
        return $this->timezone;
    }

    public function setTimezone(?string $timezone): static
    {
        $this->timezone = $timezone;

        return $this;
    }

    public function getUtcOffset(): ?int
    {
        return $this->utcOffset;
    }

    public function setUtcOffset(?int $utcOffset): static
    {
        $this->utcOffset = $utcOffset;

        return $this;
    }

    public function getMovingTime(): ?int
    {
        return $this->movingTime;
    }

    public function setMovingTime(?int $movingTime): static
    {
        $this->movingTime = $movingTime;

        return $this;
    }

    public function getElapsedTime(): ?int
    {
        return $this->elapsedTime;
    }

    public function setElapsedTime(?int $elapsedTime): static
    {
        $this->elapsedTime = $elapsedTime;

        return $this;
    }

    public function getDistance(): ?float
    {
        return $this->distance;
    }

    public function setDistance(?float $distance): static
    {
        $this->distance = $distance;

        return $this;
    }

    public function getTotalElevationGain(): ?float
    {
        return $this->totalElevationGain;
    }

    public function setTotalElevationGain(?float $totalElevationGain): static
    {
        $this->totalElevationGain = $totalElevationGain;

        return $this;
    }

    public function getAverageSpeed(): ?float
    {
        return $this->averageSpeed;
    }

    public function setAverageSpeed(?float $averageSpeed): static
    {
        $this->averageSpeed = $averageSpeed;

        return $this;
    }

    public function getMaxSpeed(): ?float
    {
        return $this->maxSpeed;
    }

    public function setMaxSpeed(?float $maxSpeed): static
    {
        $this->maxSpeed = $maxSpeed;

        return $this;
    }

    public function getAverageWatts(): ?float
    {
        return $this->averageWatts;
    }

    public function setAverageWatts(?float $averageWatts): static
    {
        $this->averageWatts = $averageWatts;

        return $this;
    }

    public function getWeightedAverageWatts(): ?int
    {
        return $this->weightedAverageWatts;
    }

    public function setWeightedAverageWatts(?int $weightedAverageWatts): static
    {
        $this->weightedAverageWatts = $weightedAverageWatts;

        return $this;
    }

    public function getMaxWatts(): ?float
    {
        return $this->maxWatts;
    }

    public function setMaxWatts(?float $maxWatts): static
    {
        $this->maxWatts = $maxWatts;

        return $this;
    }

    public function isDeviceWatts(): ?bool
    {
        return $this->deviceWatts;
    }

    public function setDeviceWatts(?bool $deviceWatts): static
    {
        $this->deviceWatts = $deviceWatts;

        return $this;
    }

    public function getKilojoules(): ?float
    {
        return $this->kilojoules;
    }

    public function setKilojoules(?float $kilojoules): static
    {
        $this->kilojoules = $kilojoules;

        return $this;
    }

    public function isHasHeartrate(): ?bool
    {
        return $this->hasHeartrate;
    }

    public function setHasHeartrate(?bool $hasHeartrate): static
    {
        $this->hasHeartrate = $hasHeartrate;

        return $this;
    }

    public function getAverageHeartrate(): ?float
    {
        return $this->averageHeartrate;
    }

    public function setAverageHeartrate(?float $averageHeartrate): static
    {
        $this->averageHeartrate = $averageHeartrate;

        return $this;
    }

    public function getMaxHeartrate(): ?int
    {
        return $this->maxHeartrate;
    }

    public function setMaxHeartrate(?int $maxHeartrate): static
    {
        $this->maxHeartrate = $maxHeartrate;

        return $this;
    }

    public function getSufferScore(): ?int
    {
        return $this->sufferScore;
    }

    public function setSufferScore(?int $sufferScore): static
    {
        $this->sufferScore = $sufferScore;

        return $this;
    }

    public function getAverageCadence(): ?float
    {
        return $this->averageCadence;
    }

    public function setAverageCadence(?float $averageCadence): static
    {
        $this->averageCadence = $averageCadence;

        return $this;
    }

    public function getStartLatlng(): ?array
    {
        return $this->startLatlng;
    }

    public function setStartLatlng(?array $startLatlng): static
    {
        $this->startLatlng = $startLatlng;

        return $this;
    }

    public function getEndLatlng(): ?array
    {
        return $this->endLatlng;
    }

    public function setEndLatlng(?array $endLatlng): static
    {
        $this->endLatlng = $endLatlng;

        return $this;
    }

    public function getLocationCity(): ?string
    {
        return $this->locationCity;
    }

    public function setLocationCity(?string $locationCity): static
    {
        $this->locationCity = $locationCity;

        return $this;
    }

    public function getLocationState(): ?string
    {
        return $this->locationState;
    }

    public function setLocationState(?string $locationState): static
    {
        $this->locationState = $locationState;

        return $this;
    }

    public function getLocationCountry(): ?string
    {
        return $this->locationCountry;
    }

    public function setLocationCountry(?string $locationCountry): static
    {
        $this->locationCountry = $locationCountry;

        return $this;
    }

    public function getMapId(): ?string
    {
        return $this->mapId;
    }

    public function setMapId(?string $mapId): static
    {
        $this->mapId = $mapId;

        return $this;
    }

    public function getSummaryPolyline(): ?string
    {
        return $this->summaryPolyline;
    }

    public function setSummaryPolyline(?string $summaryPolyline): static
    {
        $this->summaryPolyline = $summaryPolyline;

        return $this;
    }

    public function getAchievementCount(): ?int
    {
        return $this->achievementCount;
    }

    public function setAchievementCount(?int $achievementCount): static
    {
        $this->achievementCount = $achievementCount;

        return $this;
    }

    public function getKudosCount(): ?int
    {
        return $this->kudosCount;
    }

    public function setKudosCount(?int $kudosCount): static
    {
        $this->kudosCount = $kudosCount;

        return $this;
    }

    public function getCommentCount(): ?int
    {
        return $this->commentCount;
    }

    public function setCommentCount(?int $commentCount): static
    {
        $this->commentCount = $commentCount;

        return $this;
    }

    public function getAthleteCount(): ?int
    {
        return $this->athleteCount;
    }

    public function setAthleteCount(?int $athleteCount): static
    {
        $this->athleteCount = $athleteCount;

        return $this;
    }

    public function getPhotoCount(): ?int
    {
        return $this->photoCount;
    }

    public function setPhotoCount(?int $photoCount): static
    {
        $this->photoCount = $photoCount;

        return $this;
    }

    public function getTotalPhotoCount(): ?int
    {
        return $this->totalPhotoCount;
    }

    public function setTotalPhotoCount(?int $totalPhotoCount): static
    {
        $this->totalPhotoCount = $totalPhotoCount;

        return $this;
    }

    public function getPrCount(): ?int
    {
        return $this->prCount;
    }

    public function setPrCount(?int $prCount): static
    {
        $this->prCount = $prCount;

        return $this;
    }

    public function isHasKudoed(): ?bool
    {
        return $this->hasKudoed;
    }

    public function setHasKudoed(?bool $hasKudoed): static
    {
        $this->hasKudoed = $hasKudoed;

        return $this;
    }

    public function isTrainer(): ?bool
    {
        return $this->trainer;
    }

    public function setTrainer(?bool $trainer): static
    {
        $this->trainer = $trainer;

        return $this;
    }

    public function isCommute(): ?bool
    {
        return $this->commute;
    }

    public function setCommute(?bool $commute): static
    {
        $this->commute = $commute;

        return $this;
    }

    public function isManual(): ?bool
    {
        return $this->manual;
    }

    public function setManual(?bool $manual): static
    {
        $this->manual = $manual;

        return $this;
    }

    public function isPrivate(): ?bool
    {
        return $this->private;
    }

    public function setPrivate(?bool $private): static
    {
        $this->private = $private;

        return $this;
    }

    public function isFlagged(): ?bool
    {
        return $this->flagged;
    }

    public function setFlagged(?bool $flagged): static
    {
        $this->flagged = $flagged;

        return $this;
    }

    public function isFromAcceptedTag(): ?bool
    {
        return $this->fromAcceptedTag;
    }

    public function setFromAcceptedTag(?bool $fromAcceptedTag): static
    {
        $this->fromAcceptedTag = $fromAcceptedTag;

        return $this;
    }

    public function getResourceState(): ?int
    {
        return $this->resourceState;
    }

    public function setResourceState(?int $resourceState): static
    {
        $this->resourceState = $resourceState;

        return $this;
    }

    public function getExternalId(): ?string
    {
        return $this->externalId;
    }

    public function setExternalId(?string $externalId): static
    {
        $this->externalId = $externalId;

        return $this;
    }

    public function getUploadId(): ?string
    {
        return $this->uploadId;
    }

    public function setUploadId(?string $uploadId): static
    {
        $this->uploadId = $uploadId;

        return $this;
    }

    public function getActivityDetails(): ?ActivityDetails
    {
        return $this->activityDetails;
    }

    public function setActivityDetails(?ActivityDetails $activityDetails): static
    {
        if ($activityDetails === null && $this->activityDetails !== null) {
            $this->activityDetails->setActivity(null);
        }

        if ($activityDetails !== null && $activityDetails->getActivity() !== $this) {
            $activityDetails->setActivity($this);
        }

        $this->activityDetails = $activityDetails;

        return $this;
    }
}

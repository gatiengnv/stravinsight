<?php

namespace App\Entity;

use App\Repository\HearthRateZonesRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: HearthRateZonesRepository::class)]
class HearthRateZones
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::ARRAY, nullable: true)]
    private ?array $zone1 = null;

    #[ORM\Column(type: Types::ARRAY, nullable: true)]
    private ?array $zone2 = null;

    #[ORM\Column(type: Types::ARRAY, nullable: true)]
    private ?array $zone3 = null;

    #[ORM\Column(type: Types::ARRAY, nullable: true)]
    private ?array $zone4 = null;

    #[ORM\Column(type: Types::ARRAY, nullable: true)]
    private ?array $zone5 = null;

    #[ORM\OneToOne(inversedBy: 'hearthRateZones', cascade: ['persist', 'remove'])]
    private ?User $stravaUser = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getZone1(): ?array
    {
        return $this->zone1;
    }

    public function setZone1(?array $zone1): static
    {
        $this->zone1 = $zone1;

        return $this;
    }

    public function getZone2(): ?array
    {
        return $this->zone2;
    }

    public function setZone2(?array $zone2): static
    {
        $this->zone2 = $zone2;

        return $this;
    }

    public function getZone3(): ?array
    {
        return $this->zone3;
    }

    public function setZone3(?array $zone3): static
    {
        $this->zone3 = $zone3;

        return $this;
    }

    public function getZone4(): ?array
    {
        return $this->zone4;
    }

    public function setZone4(?array $zone4): static
    {
        $this->zone4 = $zone4;

        return $this;
    }

    public function getZone5(): ?array
    {
        return $this->zone5;
    }

    public function setZone5(?array $zone5): static
    {
        $this->zone5 = $zone5;

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
}

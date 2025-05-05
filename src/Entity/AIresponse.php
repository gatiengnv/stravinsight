<?php

namespace App\Entity;

use App\Repository\AIresponseRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AIresponseRepository::class)]
class AIresponse
{
    #[ORM\Id]
    #[ORM\OneToOne(targetEntity: Activity::class, inversedBy: 'AIresponse')]
    #[ORM\JoinColumn(name: 'activity_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?Activity $activity = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $overview = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $charts = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $splits = null;
    
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

    public function getOverview(): ?string
    {
        return $this->overview;
    }

    public function setOverview(?string $overview): static
    {
        $this->overview = $overview;

        return $this;
    }

    public function getCharts(): ?string
    {
        return $this->charts;
    }

    public function setCharts(?string $charts): static
    {
        $this->charts = $charts;

        return $this;
    }

    public function getSplits(): ?string
    {
        return $this->splits;
    }

    public function setSplits(?string $splits): static
    {
        $this->splits = $splits;

        return $this;
    }
}

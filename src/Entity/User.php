<?php

namespace App\Entity;

use App\Repository\UserRepository;
use DateTimeInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_STRAVA_ID', fields: ['stravaId'])]
class User implements UserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private ?string $stravaId = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $username = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $firstname = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $lastname = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $bio = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $city = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $state = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $country = null;

    #[ORM\Column(length: 1, nullable: true)]
    private ?string $sex = null;

    #[ORM\Column(type: 'boolean')]
    private bool $premium = false;

    #[ORM\Column(type: 'boolean')]
    private bool $summit = false;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?DateTimeInterface $createdAt = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?DateTimeInterface $updatedAt = null;

    #[ORM\Column(type: 'integer', nullable: true)]
    private ?int $badgeTypeId = null;

    #[ORM\Column(type: 'float', nullable: true)]
    private ?float $weight = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $profileMedium = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $profile = null;

    #[ORM\Column(type: 'json')]
    private array $roles = [];

    /**
     * @var Collection<int, Activity>
     */
    #[ORM\OneToMany(targetEntity: Activity::class, mappedBy: 'stravaUser', orphanRemoval: true)]
    private Collection $activities;

    #[ORM\OneToOne(mappedBy: 'stravaUser', cascade: ['persist', 'remove'])]
    private ?HearthRateZones $hearthRateZones = null;

    public function __construct()
    {
        $this->activities = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStravaId(): ?string
    {
        return $this->stravaId;
    }

    public function setStravaId(string $stravaId): static
    {
        $this->stravaId = $stravaId;

        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string)$this->stravaId;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    public function eraseCredentials(): void
    {
        // Nothing to erase
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(?string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(?string $firstname): static
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(?string $lastname): static
    {
        $this->lastname = $lastname;

        return $this;
    }

    public function getBio(): ?string
    {
        return $this->bio;
    }

    public function setBio(?string $bio): static
    {
        $this->bio = $bio;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(?string $city): static
    {
        $this->city = $city;

        return $this;
    }

    public function getState(): ?string
    {
        return $this->state;
    }

    public function setState(?string $state): static
    {
        $this->state = $state;

        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(?string $country): static
    {
        $this->country = $country;

        return $this;
    }

    public function getSex(): ?string
    {
        return $this->sex;
    }

    public function setSex(?string $sex): static
    {
        $this->sex = $sex;

        return $this;
    }

    public function isPremium(): bool
    {
        return $this->premium;
    }

    public function setPremium(bool $premium): static
    {
        $this->premium = $premium;

        return $this;
    }

    public function isSummit(): bool
    {
        return $this->summit;
    }

    public function setSummit(bool $summit): static
    {
        $this->summit = $summit;

        return $this;
    }

    public function getCreatedAt(): ?DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(?DateTimeInterface $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?DateTimeInterface $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getBadgeTypeId(): ?int
    {
        return $this->badgeTypeId;
    }

    public function setBadgeTypeId(?int $badgeTypeId): static
    {
        $this->badgeTypeId = $badgeTypeId;

        return $this;
    }

    public function getWeight(): ?float
    {
        return $this->weight;
    }

    public function setWeight(?float $weight): static
    {
        $this->weight = $weight;

        return $this;
    }

    public function getProfileMedium(): ?string
    {
        return $this->profileMedium;
    }

    public function setProfileMedium(?string $profileMedium): static
    {
        $this->profileMedium = $profileMedium;

        return $this;
    }

    public function getProfile(): ?string
    {
        return $this->profile;
    }

    public function setProfile(?string $profile): static
    {
        $this->profile = $profile;

        return $this;
    }

    /**
     * @return Collection<int, Activity>
     */
    public function getActivities(): Collection
    {
        return $this->activities;
    }

    public function addActivity(Activity $activity): static
    {
        if (!$this->activities->contains($activity)) {
            $this->activities->add($activity);
            $activity->setStravaUser($this);
        }

        return $this;
    }

    public function removeActivity(Activity $activity): static
    {
        if ($this->activities->removeElement($activity)) {
            // set the owning side to null (unless already changed)
            if ($activity->getStravaUser() === $this) {
                $activity->setStravaUser(null);
            }
        }

        return $this;
    }

    public function getHearthRateZones(): ?HearthRateZones
    {
        return $this->hearthRateZones;
    }

    public function setHearthRateZones(?HearthRateZones $hearthRateZones): static
    {
        // unset the owning side of the relation if necessary
        if (null === $hearthRateZones && null !== $this->hearthRateZones) {
            $this->hearthRateZones->setStravaUser(null);
        }

        // set the owning side of the relation if necessary
        if (null !== $hearthRateZones && $hearthRateZones->getStravaUser() !== $this) {
            $hearthRateZones->setStravaUser($this);
        }

        $this->hearthRateZones = $hearthRateZones;

        return $this;
    }
}

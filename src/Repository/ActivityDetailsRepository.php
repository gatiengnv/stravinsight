<?php

namespace App\Repository;

use App\Entity\ActivityDetails;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ActivityDetails>
 */
class ActivityDetailsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ActivityDetails::class);
    }

    public function getActivityDetails(int $activityDetailsId): ?array
    {
        $activityDetails = $this->createQueryBuilder('a')
            ->where('a.activity = :activityId')
            ->setParameter('activityId', $activityDetailsId)
            ->getQuery()
            ->getOneOrNullResult();

        if (!$activityDetails) {
            return null;
        }

        return [
            'splitsMetric' => $activityDetails->getSplitsMetric(),
        ];
    }
}

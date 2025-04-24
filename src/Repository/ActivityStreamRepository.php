<?php

namespace App\Repository;

use App\Entity\ActivityStream;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ActivityStream>
 */
class ActivityStreamRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ActivityStream::class);
    }

    public function getActivityStreams(int $activityStreamsId): ?array
    {
        $activityStreams = $this->createQueryBuilder('a')
            ->where('a.activity = :activityId')
            ->setParameter('activityId', $activityStreamsId)
            ->getQuery()
            ->getOneOrNullResult();

        if (!$activityStreams) {
            return null;
        }

        return [
            'latlng' => $activityStreams->getLatlngData(),
            'velocity' => $activityStreams->getVelocityData(),
            'grade' => $activityStreams->getGradeData(),
            'cadence' => $activityStreams->getCadenceData(),
            'distance' => $activityStreams->getDistanceData(),
            'altitude' => $activityStreams->getAltitudeData(),
        ];
    }
}

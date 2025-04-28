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
            'latlngData' => $activityStreams->getLatlngData(),
            'velocityData' => $activityStreams->getVelocityData(),
            'gradeData' => $activityStreams->getGradeData(),
            'cadenceData' => $activityStreams->getCadenceData(),
            'distanceData' => $activityStreams->getDistanceData(),
            'altitudeData' => $activityStreams->getAltitudeData(),
            'heartrateData' => $activityStreams->getHeartrateData(),
            'timeData' => $activityStreams->getTimeData(),
            'originalSize' => $activityStreams->getOriginalSize(),
            'resolution' => $activityStreams->getResolution(),
        ];
    }
}

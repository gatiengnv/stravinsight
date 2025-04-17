<?php

namespace App\Repository;

use App\Entity\Activity;
use DateTime;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Activity>
 */
class ActivityRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Activity::class);
    }

    //    /**
    //     * @return Activity[] Returns an array of Activity objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('a')
    //            ->andWhere('a.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('a.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Activity
    //    {
    //        return $this->createQueryBuilder('a')
    //            ->andWhere('a.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
    // src/Repository/ActivityRepository.php

    public function getActivityDifferenceFromLastMonth(int $userId): array
    {
        $currentMonthStart = (new DateTime('first day of this month'))->setTime(0, 0);
        $currentMonthEnd = (new DateTime('last day of this month'))->setTime(23, 59, 59);

        $lastMonthStart = (new DateTime('first day of last month'))->setTime(0, 0);
        $lastMonthEnd = (new DateTime('last day of last month'))->setTime(23, 59, 59);

        $currentMonthData = $this->createQueryBuilder('a')
            ->select('COUNT(a.id) as activityCount, SUM(a.distance) as totalDistance, SUM(a.movingTime) as totalTime, AVG(a.averageSpeed) as avgSpeed')
            ->where('a.stravaUser = :userId')
            ->andWhere('a.startDateLocal BETWEEN :currentStart AND :currentEnd')
            ->setParameter('userId', $userId)
            ->setParameter('currentStart', $currentMonthStart)
            ->setParameter('currentEnd', $currentMonthEnd)
            ->getQuery()
            ->getSingleResult();

        $lastMonthData = $this->createQueryBuilder('a')
            ->select('COUNT(a.id) as activityCount, SUM(a.distance) as totalDistance, SUM(a.movingTime) as totalTime, AVG(a.averageSpeed) as avgSpeed')
            ->where('a.stravaUser = :userId')
            ->andWhere('a.startDateLocal BETWEEN :lastStart AND :lastEnd')
            ->setParameter('userId', $userId)
            ->setParameter('lastStart', $lastMonthStart)
            ->setParameter('lastEnd', $lastMonthEnd)
            ->getQuery()
            ->getSingleResult();

        return [
            'activityDifference' => (int)$currentMonthData['activityCount'] - (int)$lastMonthData['activityCount'],
            'distanceDifference' => round(((float)$currentMonthData['totalDistance'] - (float)$lastMonthData['totalDistance']) / 1000, 2),
            'timeDifference' => round(((int)$currentMonthData['totalTime'] - (int)$lastMonthData['totalTime']) / 3600, 2),
            'speedDifference' => round(((float)$currentMonthData['avgSpeed'] - (float)$lastMonthData['avgSpeed']) * 3.6, 2),
        ];
    }

    public function getActivity(int $userId, int $limit = 5): array
    {
        $activities = $this->createQueryBuilder('a')
            ->where('a.stravaUser = :userId')
            ->setParameter('userId', $userId)
            ->orderBy('a.startDateLocal', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();

        return array_map(function (Activity $activity) {
            return [
                'id' => $activity->getId(),
                'name' => $activity->getName(),
                'distance' => round($activity->getDistance() / 1000, 2) . ' km',
                'movingTime' => gmdate('H:i:s', $activity->getMovingTime()),
                'averageSpeed' => round($activity->getAverageSpeed() * 3.6, 2) . ' km/h',
                'startDateLocal' => $activity->getStartDateLocal()?->format('Y-m-d H:i:s'),
                'type' => $activity->getType(),
            ];
        }, $activities);
    }
}

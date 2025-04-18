<?php

namespace App\Repository;

use App\Entity\Activity;
use App\Entity\User;
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

    public function getActivityRecords(int $userId): array
    {
        $result = $this->createQueryBuilder('a')
            ->select(
                'MAX(a.distance) as maxDistance',
                '(SELECT a1.startDateLocal FROM App\Entity\Activity a1 WHERE a1.distance = MAX(a.distance) AND a1.stravaUser = :userId) as maxDistanceDate',
                'MAX(a.averageSpeed) as maxAverageSpeed',
                '(SELECT a2.startDateLocal FROM App\Entity\Activity a2 WHERE a2.averageSpeed = MAX(a.averageSpeed) AND a2.stravaUser = :userId) as maxAverageSpeedDate',
                'MAX(a.movingTime) as maxMovingTime',
                '(SELECT a3.startDateLocal FROM App\Entity\Activity a3 WHERE a3.movingTime = MAX(a.movingTime) AND a3.stravaUser = :userId) as maxMovingTimeDate',
                'MAX(a.totalElevationGain) as maxElevationGain',
                '(SELECT a4.startDateLocal FROM App\Entity\Activity a4 WHERE a4.totalElevationGain = MAX(a.totalElevationGain) AND a4.stravaUser = :userId) as maxElevationGainDate'
            )
            ->where('a.stravaUser = :userId')
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getSingleResult();

        return [
            [
                'name' => 'Max distance',
                'value' => round($result['maxDistance'] / 1000, 2) . ' km',
                'date' => $result['maxDistanceDate'],
            ],
            [
                'name' => 'Max average speed',
                'value' => round($result['maxAverageSpeed'] * 3.6, 2) . ' km/h',
                'date' => $result['maxAverageSpeedDate'],
            ],
            [
                'name' => 'Max moving time',
                'value' => $result['maxMovingTime'] ? gmdate('H:i:s', $result['maxMovingTime']) : '00:00:00',
                'date' => $result['maxMovingTimeDate'],
            ],
            [
                'name' => 'Max elevation gain',
                'value' => $result['maxElevationGain'] . ' m',
                'date' => $result['maxElevationGainDate'],
            ],
        ];
    }

    public function getHeartRateZoneDistribution(int $userId): array
    {
        $entityManager = $this->getEntityManager();
        $user = $entityManager->getRepository(User::class)->find($userId);

        if (!$user || !$user->getHearthRateZones()) {
            return [
                'zone1' => ['percentage' => 0, 'minmax' => '(0 - 0)'],
                'zone2' => ['percentage' => 0, 'minmax' => '(0 - 0)'],
                'zone3' => ['percentage' => 0, 'minmax' => '(0 - 0)'],
                'zone4' => ['percentage' => 0, 'minmax' => '(0 - 0)'],
                'zone5' => ['percentage' => 0, 'minmax' => '(0 - ∞)'],
            ];
        }

        $zones = $user->getHearthRateZones();

        $zone1 = $zones->getZone1();
        $zone2 = $zones->getZone2();
        $zone3 = $zones->getZone3();
        $zone4 = $zones->getZone4();
        $zone5 = $zones->getZone5();

        $totalActivities = $this->createQueryBuilder('a')
            ->select('COUNT(a.id) as total')
            ->where('a.stravaUser = :userId')
            ->andWhere('a.averageHeartrate IS NOT NULL')
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getSingleScalarResult();

        if (0 == $totalActivities) {
            return [
                'zone1' => ['percentage' => 0, 'minmax' => '(0 - 0)'],
                'zone2' => ['percentage' => 0, 'minmax' => '(0 - 0)'],
                'zone3' => ['percentage' => 0, 'minmax' => '(0 - 0)'],
                'zone4' => ['percentage' => 0, 'minmax' => '(0 - 0)'],
                'zone5' => ['percentage' => 0, 'minmax' => '(0 - ∞)'],
            ];
        }

        $zoneQuery = $this->createQueryBuilder('a')
            ->select(
                'SUM(CASE WHEN a.averageHeartrate BETWEEN :zone1Min AND :zone1Max THEN 1 ELSE 0 END) as zone1',
                'SUM(CASE WHEN a.averageHeartrate BETWEEN :zone2Min AND :zone2Max THEN 1 ELSE 0 END) as zone2',
                'SUM(CASE WHEN a.averageHeartrate BETWEEN :zone3Min AND :zone3Max THEN 1 ELSE 0 END) as zone3',
                'SUM(CASE WHEN a.averageHeartrate BETWEEN :zone4Min AND :zone4Max THEN 1 ELSE 0 END) as zone4',
                'SUM(CASE WHEN a.averageHeartrate >= :zone5Min THEN 1 ELSE 0 END) as zone5'
            )
            ->where('a.stravaUser = :userId')
            ->andWhere('a.averageHeartrate IS NOT NULL')
            ->setParameter('userId', $userId)
            ->setParameter('zone1Min', $zone1['min'] ?? 0)
            ->setParameter('zone1Max', $zone1['max'] ?? 0)
            ->setParameter('zone2Min', $zone2['min'] ?? 0)
            ->setParameter('zone2Max', $zone2['max'] ?? 0)
            ->setParameter('zone3Min', $zone3['min'] ?? 0)
            ->setParameter('zone3Max', $zone3['max'] ?? 0)
            ->setParameter('zone4Min', $zone4['min'] ?? 0)
            ->setParameter('zone4Max', $zone4['max'] ?? 0)
            ->setParameter('zone5Min', $zone5['min'] ?? 0)
            ->getQuery()
            ->getSingleResult();

        return [
            'zone1' => [
                'percentage' => round(($zoneQuery['zone1'] / $totalActivities) * 100, 2),
                'minmax' => '(' . $zone1['min'] . ' - ' . $zone1['max'] . ')',
            ],
            'zone2' => [
                'percentage' => round(($zoneQuery['zone2'] / $totalActivities) * 100, 2),
                'minmax' => '(' . $zone2['min'] . ' - ' . $zone2['max'] . ')',
            ],
            'zone3' => [
                'percentage' => round(($zoneQuery['zone3'] / $totalActivities) * 100, 2),
                'minmax' => '(' . $zone3['min'] . ' - ' . $zone3['max'] . ')',
            ],
            'zone4' => [
                'percentage' => round(($zoneQuery['zone4'] / $totalActivities) * 100, 2),
                'minmax' => '(' . $zone4['min'] . ' - ' . $zone4['max'] . ')',
            ],
            'zone5' => [
                'percentage' => round(($zoneQuery['zone5'] / $totalActivities) * 100, 2),
                'minmax' => '(' . $zone5['min'] . ' - ∞)',
            ],
        ];
    }

    public function getWeeklyFitnessData(int $userId, int $weeks): array
    {
        $endDate = new DateTime();
        $startDate = (new DateTime())->modify("-{$weeks} weeks");

        $activities = $this->createQueryBuilder('a')
            ->where('a.stravaUser = :userId')
            ->andWhere('a.startDateLocal BETWEEN :startDate AND :endDate')
            ->setParameter('userId', $userId)
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate)
            ->getQuery()
            ->getResult();

        $weeklyData = [];

        foreach ($activities as $activity) {
            $week = $activity->getStartDateLocal()->format('o-W');
            if (!isset($weeklyData[$week])) {
                $weeklyData[$week] = 0;
            }

            if ($activity->getAverageHeartrate()) {
                $weeklyData[$week] += $this->calculateRelativeEffort($activity->getAverageHeartrate(), $activity->getMovingTime());
            } elseif ($activity->getAverageWatts()) {
                $weeklyData[$week] += $this->calculatePowerEffort($activity->getAverageWatts(), $activity->getMovingTime());
            }
        }

        $formattedData = [];
        for ($i = 0; $i < $weeks; $i++) {
            $week = (new DateTime())->modify("-{$i} weeks")->format('o-W');
            $formattedData[] = $weeklyData[$week] ?? 0;
        }

        return array_reverse($formattedData);
    }

    private function calculateRelativeEffort(float $averageHeartrate, int $movingTime): float
    {
        return $averageHeartrate * $movingTime / 1000;
    }

    private function calculatePowerEffort(float $averageWatts, int $movingTime): float
    {
        return $averageWatts * $movingTime / 3600;
    }


}

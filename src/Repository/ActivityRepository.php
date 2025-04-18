<?php

namespace App\Repository;

use App\Entity\Activity;
use App\Entity\User;
use DateTime;
use DateTimeInterface;
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

    public function getActivities(int $userId, int $limit = 5): array
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

    /**
     * Calculates various achievements based on a user's activities.
     *
     * @param int $userId The ID of the User entity
     * @return array An array of achievement statuses.
     */
    public function getAchievements(int $userId): array
    {
        $achievements = [];
        $entityManager = $this->getEntityManager();

        $user = $entityManager->getRepository(User::class)->find($userId);
        if (!$user) {
            return [];
        }

        $centuryRide = $this->createQueryBuilder('a')
            ->select('MAX(a.startDateLocal) as achievedDate')
            ->where('a.stravaUser = :userId')
            ->andWhere('a.distance >= 100000')
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getOneOrNullResult();

        $achievements[] = [
            'name' => 'Century Ride',
            'description' => 'Complete a 100 km ride',
            'achieved' => !empty($centuryRide['achievedDate']),
            'progression' => !empty($centuryRide['achievedDate'])
                ? 'Achieved on: ' . (new DateTime($centuryRide['achievedDate']))->format('Y-m-d')
                : $this->getMaxDistanceProgression($userId, 100000) . '/100 km',
        ];

        $ultraDistance = $this->createQueryBuilder('a')
            ->select('MAX(a.startDateLocal) as achievedDate')
            ->where('a.stravaUser = :userId')
            ->andWhere('a.distance >= 200000')
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getOneOrNullResult();

        $achievements[] = [
            'name' => 'Ultra Distance',
            'description' => 'Complete an activity of 200 km or more',
            'achieved' => !empty($ultraDistance['achievedDate']),
            'progression' => !empty($ultraDistance['achievedDate'])
                ? 'Achieved on: ' . (new DateTime($ultraDistance['achievedDate']))->format('Y-m-d')
                : $this->getMaxDistanceProgression($userId, 200000) . '/200 km',
        ];

        $streakActivities = $this->createQueryBuilder('a')
            ->select('a.startDateLocal')
            ->where('a.stravaUser = :userId')
            ->orderBy('a.startDateLocal', 'ASC')
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getResult();

        $maxStreak = 0;
        $currentStreak = 0;
        $previousDate = null;

        foreach ($streakActivities as $activity) {
            if (!$activity['startDateLocal'] instanceof DateTimeInterface) {
                continue;
            }
            $currentDate = $activity['startDateLocal'];

            if ($previousDate &&
                $currentDate->format('Y-m-d') !== $previousDate->format('Y-m-d') &&
                $currentDate->diff($previousDate)->days === 1) {
                $currentStreak++;
            } else if ($previousDate && $currentDate->format('Y-m-d') === $previousDate->format('Y-m-d')) {
                // Do nothing
            } else {
                $currentStreak = 1;
            }

            $maxStreak = max($maxStreak, $currentStreak);
            $previousDate = $currentDate;
        }
        $streakGoal = 7;
        $achievements[] = [
            'name' => 'Streak Master',
            'description' => 'Complete activities for 7 consecutive days',
            'achieved' => $maxStreak >= $streakGoal,
            'progression' => $maxStreak . '/' . $streakGoal . ' days',
        ];

        $marathon = $this->createQueryBuilder('a')
            ->select('MAX(a.startDateLocal) as achievedDate')
            ->where('a.stravaUser = :userId')
            ->andWhere('a.type = :type OR a.sportType = :type')
            ->andWhere('a.distance >= 42195')
            ->setParameter('userId', $userId)
            ->setParameter('type', 'Run')
            ->getQuery()
            ->getOneOrNullResult();

        $achievements[] = [
            'name' => 'Marathon Finisher',
            'description' => 'Complete a marathon (42.195 km run)',
            'achieved' => !empty($marathon['achievedDate']),
            'progression' => !empty($marathon['achievedDate'])
                ? 'Achieved on: ' . (new DateTime($marathon['achievedDate']))->format('Y-m-d')
                : $this->getMaxDistanceProgression($userId, 42195, 'Run') . '/42.2 km',
        ];

        $earlyBirdActivities = $this->createQueryBuilder('a')
            ->select('a.startDateLocal')
            ->where('a.stravaUser = :userId')
            ->andWhere('a.startDateLocal IS NOT NULL')
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getResult();

        $earlyBirdCount = 0;
        foreach ($earlyBirdActivities as $activity) {
            if ($activity['startDateLocal'] instanceof DateTimeInterface) {
                if ((int)$activity['startDateLocal']->format('H') < 7) {
                    $earlyBirdCount++;
                }
            }
        }

        $earlyBirdGoal = 10;
        $achievements[] = [
            'name' => 'Early Bird',
            'description' => 'Complete 10 activities starting before 7 AM',
            'achieved' => $earlyBirdCount >= $earlyBirdGoal,
            'progression' => $earlyBirdCount . '/' . $earlyBirdGoal,
        ];

        $startOfMonth = (new DateTime('first day of this month'))->setTime(0, 0, 0);
        $endOfMonth = (new DateTime('last day of this month'))->setTime(23, 59, 59);

        $elevationGain = $this->createQueryBuilder('a')
            ->select('SUM(a.totalElevationGain) as totalGain')
            ->where('a.stravaUser = :userId')
            ->andWhere('a.startDateLocal BETWEEN :start AND :end')
            ->setParameter('userId', $userId)
            ->setParameter('start', $startOfMonth)
            ->setParameter('end', $endOfMonth)
            ->getQuery()
            ->getSingleScalarResult();

        $elevationGain = $elevationGain ?: 0;
        $elevationGoal = 5000;
        $achievements[] = [
            'name' => 'Monthly Climb Challenge',
            'description' => 'Climb 5,000 meters in the current calendar month',
            'achieved' => $elevationGain >= $elevationGoal,
            'progression' => round($elevationGain) . '/' . $elevationGoal . ' m',
        ];

        $endDate = new DateTime();
        $startDate = (new DateTime())->modify('-28 days')->setTime(0, 0, 0);

        $recentRuns = $this->createQueryBuilder('a')
            ->select('a.startDateLocal')
            ->where('a.stravaUser = :userId')
            ->andWhere('a.type = :type OR a.sportType = :type')
            ->andWhere('a.startDateLocal BETWEEN :startDate AND :endDate')
            ->setParameter('userId', $userId)
            ->setParameter('type', 'Run')
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate)
            ->orderBy('a.startDateLocal', 'ASC')
            ->getQuery()
            ->getResult();

        $runsPerWeek = [];
        foreach ($recentRuns as $run) {
            if ($run['startDateLocal'] instanceof DateTimeInterface) {
                $weekNumber = $run['startDateLocal']->format('o-W');
                if (!isset($runsPerWeek[$weekNumber])) {
                    $runsPerWeek[$weekNumber] = 0;
                }
                $runsPerWeek[$weekNumber]++;
            }
        }

        $completedWeeksCount = 0;
        $today = new DateTime();
        for ($i = 0; $i < 4; $i++) {
            $checkDate = (clone $today)->modify("-$i week");
            $checkWeekNumber = $checkDate->format('o-W');
            if (isset($runsPerWeek[$checkWeekNumber]) && $runsPerWeek[$checkWeekNumber] >= 3) {
                $completedWeeksCount++;
            }
        }
        $consistencyGoalWeeks = 4;
        $achievements[] = [
            'name' => 'Consistent Runner',
            'description' => 'Run 3 times a week for 4 consecutive weeks',
            'achieved' => $completedWeeksCount >= $consistencyGoalWeeks,
            'progression' => $completedWeeksCount . '/' . $consistencyGoalWeeks . ' weeks',
        ];

        $explorerCities = $this->createQueryBuilder('a')
            ->select('COUNT(DISTINCT LOWER(a.locationCity)) as cities')
            ->where('a.stravaUser = :userId')
            ->andWhere('a.locationCity IS NOT NULL')
            ->andWhere("a.locationCity != ''")
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getSingleScalarResult();

        $explorerCities = $explorerCities ?: 0;
        $explorerGoal = 5;
        $achievements[] = [
            'name' => 'Explorer',
            'description' => 'Complete activities in 5 different cities',
            'achieved' => $explorerCities >= $explorerGoal,
            'progression' => $explorerCities . '/' . $explorerGoal . ' cities',
        ];

        $totalDistanceResult = $this->createQueryBuilder('a')
            ->select('SUM(a.distance) as totalDistance')
            ->where('a.stravaUser = :userId')
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getSingleScalarResult();
        $totalDistance = $totalDistanceResult ?: 0;
        $goalDistance = 1000000;
        $achievedTotalDistance = $totalDistance >= $goalDistance;
        $achievements[] = [
            'name' => 'Global Trotter',
            'description' => 'Accumulate a total distance of 1,000 km across all activities',
            'achieved' => $achievedTotalDistance,
            'progression' => round($totalDistance / 1000) . '/' . round($goalDistance / 1000) . ' km',
        ];

        $totalElevationResult = $this->createQueryBuilder('a')
            ->select('SUM(a.totalElevationGain) as totalGain')
            ->where('a.stravaUser = :userId')
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getSingleScalarResult();
        $totalElevation = $totalElevationResult ?: 0;
        $goalElevationEverest = 8848;
        $achievedEverest = $totalElevation >= $goalElevationEverest;
        $achievements[] = [
            'name' => 'Everest Climber',
            'description' => 'Accumulate a total elevation gain equivalent to Mount Everest (8,848 m)',
            'achieved' => $achievedEverest,
            'progression' => round($totalElevation) . '/' . $goalElevationEverest . ' m',
        ];

        $nightOwlActivities = $this->createQueryBuilder('a')
            ->select('a.startDateLocal')
            ->where('a.stravaUser = :userId')
            ->andWhere('a.startDateLocal IS NOT NULL')
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getResult();

        $nightOwlCount = 0;
        foreach ($nightOwlActivities as $activity) {
            if ($activity['startDateLocal'] instanceof DateTimeInterface) {
                if ((int)$activity['startDateLocal']->format('H') >= 21) {
                    $nightOwlCount++;
                }
            }
        }
        $goalNightOwl = 10;
        $achievedNightOwl = $nightOwlCount >= $goalNightOwl;
        $achievements[] = [
            'name' => 'Night Owl',
            'description' => 'Complete 10 activities starting after 9 PM local time',
            'achieved' => $achievedNightOwl,
            'progression' => $nightOwlCount . '/' . $goalNightOwl,
        ];

        $weekendActivities = $this->createQueryBuilder('a')
            ->select('a.startDateLocal', 'a.distance')
            ->where('a.stravaUser = :userId')
            ->andWhere('a.distance IS NOT NULL')
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getResult();

        $weekendDistance = 0;
        foreach ($weekendActivities as $activity) {
            if ($activity['startDateLocal'] instanceof DateTimeInterface && $activity['distance'] > 0) {
                $dayOfWeek = (int)$activity['startDateLocal']->format('N');
                if ($dayOfWeek === 6 || $dayOfWeek === 7) {
                    $weekendDistance += (float)$activity['distance'];
                }
            }
        }
        $goalWeekendDistance = 500000;
        $achievedWeekendWarrior = $weekendDistance >= $goalWeekendDistance;
        $achievements[] = [
            'name' => 'Weekend Warrior',
            'description' => 'Accumulate 500 km on weekend activities (Sat/Sun)',
            'achieved' => $achievedWeekendWarrior,
            'progression' => round($weekendDistance / 1000) . '/' . round($goalWeekendDistance / 1000) . ' km',
        ];

        $sportTypes = $this->createQueryBuilder('a')
            ->select('DISTINCT COALESCE(LOWER(a.type), LOWER(a.sportType)) as uniqueType')
            ->where('a.stravaUser = :userId')
            ->andWhere('a.type IS NOT NULL OR a.sportType IS NOT NULL')
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getScalarResult();

        $validSportTypesCount = count(array_filter($sportTypes, function ($typeArray) {
            return !empty($typeArray['uniqueType']);
        }));

        $goalTypes = 3;
        $achievedMultiSport = $validSportTypesCount >= $goalTypes;
        $achievements[] = [
            'name' => 'Multi-Sport Athlete',
            'description' => 'Log activities of at least 3 different types (e.g., Run, Ride, Swim)',
            'achieved' => $achievedMultiSport,
            'progression' => $validSportTypesCount . '/' . $goalTypes . ' types',
        ];

        return $achievements;
    }

    /**
     * Helper function to get max distance for progression display.
     *
     * @param int $userId
     * @param int $goalDistanceMeters
     * @param string|null $activityType
     * @return string
     */
    private function getMaxDistanceProgression(int $userId, int $goalDistanceMeters, ?string $activityType = null): string
    {
        $qb = $this->createQueryBuilder('a')
            ->select('MAX(a.distance) as maxDistance')
            ->where('a.stravaUser = :userId')
            ->setParameter('userId', $userId);

        if ($activityType !== null) {
            $qb->andWhere('a.type = :type OR a.sportType = :type')
                ->setParameter('type', $activityType);
        }

        $maxDistance = $qb->getQuery()->getSingleScalarResult();
        $maxDistance = $maxDistance ?: 0;

        $displayDistance = min($maxDistance, $goalDistanceMeters);

        return round($displayDistance / 1000, 1);
    }
}

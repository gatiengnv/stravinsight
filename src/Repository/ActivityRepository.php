<?php

namespace App\Repository;

use App\Entity\Activity;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * @extends ServiceEntityRepository<Activity>
 */
#[\AllowDynamicProperties] class ActivityRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry, RequestStack $requestStack)
    {
        parent::__construct($registry, Activity::class);
        $this->requestStack = $requestStack;
    }

    public function getActivityDifferenceFromLastMonth(int $userId): array
    {
        $request = $this->requestStack->getCurrentRequest();
        $startDate = $request?->query->get('startDate');
        $endDate = $request?->query->get('endDate');
        $sport = $request?->query->get('sport');

        if ($startDate && $endDate) {
            $currentPeriodStart = new \DateTime($startDate);
            $currentPeriodEnd = new \DateTime($endDate);

            $interval = $currentPeriodStart->diff($currentPeriodEnd);
            $previousPeriodEnd = clone $currentPeriodStart;
            $previousPeriodEnd->modify('-1 day');
            $previousPeriodStart = clone $previousPeriodEnd;
            $previousPeriodStart->sub($interval);
        } else {
            $currentPeriodStart = (new \DateTime('first day of this month'))->setTime(0, 0);
            $currentPeriodEnd = (new \DateTime('last day of this month'))->setTime(23, 59, 59);

            $previousPeriodStart = (new \DateTime('first day of last month'))->setTime(0, 0);
            $previousPeriodEnd = (new \DateTime('last day of last month'))->setTime(23, 59, 59);
        }

        $currentPeriodQuery = $this->createQueryBuilder('a')
            ->select('COUNT(a.id) as activityCount, SUM(a.distance) as totalDistance, SUM(a.movingTime) as totalTime, AVG(a.averageSpeed) as avgSpeed')
            ->where('a.stravaUser = :userId')
            ->andWhere('a.startDateLocal BETWEEN :currentStart AND :currentEnd')
            ->setParameter('userId', $userId)
            ->setParameter('currentStart', $currentPeriodStart)
            ->setParameter('currentEnd', $currentPeriodEnd);

        if ($sport) {
            $currentPeriodQuery->andWhere('a.sportType = :sport')
                ->setParameter('sport', $sport);
        }

        $currentPeriodData = $currentPeriodQuery->getQuery()->getSingleResult();

        $previousPeriodQuery = $this->createQueryBuilder('a')
            ->select('COUNT(a.id) as activityCount, SUM(a.distance) as totalDistance, SUM(a.movingTime) as totalTime, AVG(a.averageSpeed) as avgSpeed')
            ->where('a.stravaUser = :userId')
            ->andWhere('a.startDateLocal BETWEEN :previousStart AND :previousEnd')
            ->setParameter('userId', $userId)
            ->setParameter('previousStart', $previousPeriodStart)
            ->setParameter('previousEnd', $previousPeriodEnd);

        if ($sport) {
            $previousPeriodQuery->andWhere('a.sportType = :sport')
                ->setParameter('sport', $sport);
        }

        $previousPeriodData = $previousPeriodQuery->getQuery()->getSingleResult();

        return [
            'activityDifference' => (int) $currentPeriodData['activityCount'] - (int) $previousPeriodData['activityCount'],
            'distanceDifference' => round(((float) $currentPeriodData['totalDistance'] - (float) $previousPeriodData['totalDistance']) / 1000, 2),
            'timeDifference' => round(((int) $currentPeriodData['totalTime'] - (int) $previousPeriodData['totalTime']) / 3600, 2),
            'speedDifference' => round(((float) $currentPeriodData['avgSpeed'] - (float) $previousPeriodData['avgSpeed']) * 3.6, 2),
        ];
    }

    public function getActivities(int $userId, int $limit = 10, int $offset = 0): array
    {
        $activities = $this->createQueryBuilder('a')
            ->where('a.stravaUser = :userId')
            ->setParameter('userId', $userId)
            ->orderBy('a.startDateLocal', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();

        return array_map(function (Activity $activity) {
            return [
                'id' => $activity->getId(),
                'name' => $activity->getName(),
                'distance' => round($activity->getDistance() / 1000, 2).' km',
                'movingTime' => gmdate('H:i:s', $activity->getMovingTime()),
                'averageSpeed' => round($activity->getAverageSpeed() * 3.6, 2).' km/h',
                'startDateLocal' => $activity->getStartDateLocal()?->format('Y-m-d H:i:s'),
                'type' => $activity->getType(),
            ];
        }, $activities);
    }

    public function getActivity(int $activityId): ?array
    {
        $activity = $this->createQueryBuilder('a')
            ->where('a.id = :activityId')
            ->setParameter('activityId', $activityId)
            ->getQuery()
            ->getOneOrNullResult();

        if (!$activity) {
            return null;
        }

        return [
            'id' => $activity->getId(),
            'name' => $activity->getName(),
            'distance' => round($activity->getDistance() / 1000, 2),
            'movingTime' => gmdate('H:i:s', $activity->getMovingTime()),
            'averagePace' => gmdate('i:s', $activity->getMovingTime() / ($activity->getDistance() / 1000)),
            'averageSpeed' => round($activity->getAverageSpeed() * 3.6, 2),
            'startDateLocal' => $activity->getStartDateLocal()?->format('Y-m-d H:i:s'),
            'totalElevationGain' => $activity->getTotalElevationGain(),
            'averageHeartrate' => $activity->getAverageHeartrate(),
            'type' => $activity->getType(),
        ];
    }

    public function getActivityRecords(int $userId): array
    {
        $maxDistanceRecord = $this->createQueryBuilder('a')
            ->select('a.distance, a.startDateLocal')
            ->where('a.stravaUser = :userId')
            ->orderBy('a.distance', 'DESC')
            ->setParameter('userId', $userId)
            ->setMaxResults(1);
        $this->applyFilter($maxDistanceRecord);
        $maxDistanceRecord = $maxDistanceRecord->getQuery()
            ->getOneOrNullResult();

        $maxSpeedRecord = $this->createQueryBuilder('a')
            ->select('a.averageSpeed, a.startDateLocal')
            ->where('a.stravaUser = :userId')
            ->orderBy('a.averageSpeed', 'DESC')
            ->setParameter('userId', $userId)
            ->setMaxResults(1);
        $this->applyFilter($maxSpeedRecord);
        $maxSpeedRecord = $maxSpeedRecord->getQuery()
            ->getOneOrNullResult();

        $maxTimeRecord = $this->createQueryBuilder('a')
            ->select('a.movingTime, a.startDateLocal')
            ->where('a.stravaUser = :userId')
            ->orderBy('a.movingTime', 'DESC')
            ->setParameter('userId', $userId)
            ->setMaxResults(1);
        $this->applyFilter($maxTimeRecord);
        $maxTimeRecord = $maxTimeRecord->getQuery()
            ->getOneOrNullResult();

        $maxElevationRecord = $this->createQueryBuilder('a')
            ->select('a.totalElevationGain, a.startDateLocal')
            ->where('a.stravaUser = :userId')
            ->orderBy('a.totalElevationGain', 'DESC')
            ->setParameter('userId', $userId)
            ->setMaxResults(1);
        $this->applyFilter($maxElevationRecord);
        $maxElevationRecord = $maxElevationRecord->getQuery()
            ->getOneOrNullResult();

        return [
            [
                'name' => 'Max distance',
                'value' => round(($maxDistanceRecord['distance'] ?? 0) / 1000, 2).' km',
                'date' => $maxDistanceRecord['startDateLocal']->format('Y-m-d H:i:s') ?? null,
            ],
            [
                'name' => 'Max average speed',
                'value' => round(($maxSpeedRecord['averageSpeed'] ?? 0) * 3.6, 2).' km/h',
                'date' => $maxSpeedRecord['startDateLocal']->format('Y-m-d H:i:s') ?? null,
            ],
            [
                'name' => 'Max moving time',
                'value' => isset($maxTimeRecord['movingTime']) ? gmdate('H:i:s', $maxTimeRecord['movingTime']) : '00:00:00',
                'date' => $maxTimeRecord['startDateLocal']->format('Y-m-d H:i:s') ?? null,
            ],
            [
                'name' => 'Max elevation gain',
                'value' => ($maxElevationRecord['totalElevationGain'] ?? 0).' m',
                'date' => $maxElevationRecord['startDateLocal']->format('Y-m-d H:i:s') ?? null,
            ],
        ];
    }

    private function applyFilter($qb): void
    {
        if (!$qb instanceof QueryBuilder) {
            return;
        }

        $request = $this->requestStack->getCurrentRequest();
        $startDate = $request?->query->get('startDate');
        $endDate = $request?->query->get('endDate');
        $sport = $request?->query->get('sport');

        if ($startDate) {
            $startDate = new \DateTime($startDate);
            $qb->andWhere('a.startDateLocal >= :startDate')
                ->setParameter('startDate', $startDate);
        }

        if ($endDate) {
            $endDate = new \DateTime($endDate);
            $qb->andWhere('a.startDateLocal <= :endDate')
                ->setParameter('endDate', $endDate);
        }

        if ($sport) {
            $qb->andWhere('a.sportType = :sport')
                ->setParameter('sport', $sport);
        }
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
            ->setParameter('userId', $userId);

        $this->applyFilter($totalActivities);

        $totalActivities = $totalActivities->getQuery()->getSingleScalarResult();

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
            ->setParameter('zone5Min', $zone5['min'] ?? 0);
        $this->applyFilter($zoneQuery);
        $zoneQuery = $zoneQuery->getQuery()
            ->getSingleResult();

        return [
            'zone1' => [
                'percentage' => round(($zoneQuery['zone1'] / $totalActivities) * 100, 2),
                'minmax' => '('.$zone1['min'].' - '.$zone1['max'].')',
            ],
            'zone2' => [
                'percentage' => round(($zoneQuery['zone2'] / $totalActivities) * 100, 2),
                'minmax' => '('.$zone2['min'].' - '.$zone2['max'].')',
            ],
            'zone3' => [
                'percentage' => round(($zoneQuery['zone3'] / $totalActivities) * 100, 2),
                'minmax' => '('.$zone3['min'].' - '.$zone3['max'].')',
            ],
            'zone4' => [
                'percentage' => round(($zoneQuery['zone4'] / $totalActivities) * 100, 2),
                'minmax' => '('.$zone4['min'].' - '.$zone4['max'].')',
            ],
            'zone5' => [
                'percentage' => round(($zoneQuery['zone5'] / $totalActivities) * 100, 2),
                'minmax' => '('.$zone5['min'].' - ∞)',
            ],
        ];
    }

    public function getWeeklyFitnessData(int $userId, int $defaultWeeks = 10): array
    {
        $request = $this->requestStack->getCurrentRequest();

        $hasStartDate = $request?->query->has('startDate');
        $hasEndDate = $request?->query->has('endDate');
        $hasSport = $request?->query->has('sport');

        $endDate = $hasEndDate
            ? new \DateTime($request->query->get('endDate'))
            : new \DateTime();

        $startDate = null;

        $sport = $hasSport
            ? $request->query->get('sport')
            : null;
        if ($hasStartDate) {
            $startDate = new \DateTime($request->query->get('startDate'));
        } elseif (!$hasEndDate) {
            $startDate = (new \DateTime())->modify("-{$defaultWeeks} weeks");
        }

        $qb = $this->createQueryBuilder('a')
            ->where('a.stravaUser = :userId')
            ->setParameter('userId', $userId);

        if ($startDate) {
            $qb->andWhere('a.startDateLocal >= :startDate')
                ->setParameter('startDate', $startDate);
        }

        if ($endDate) {
            $qb->andWhere('a.startDateLocal <= :endDate')
                ->setParameter('endDate', $endDate);
        }

        if ($sport) {
            $qb->andWhere('a.sportType = :sport')
                ->setParameter('sport', $sport);
        }

        $activities = $qb->getQuery()->getResult();

        $weeklyData = [];
        foreach ($activities as $activity) {
            $week = $activity->getStartDateLocal()->format('o-W');
            if (!isset($weeklyData[$week])) {
                $weeklyData[$week] = 0;
            }

            if ($activity->getAverageHeartrate()) {
                $weeklyData[$week] += round($this->calculateRelativeEffort($activity->getAverageHeartrate(), $activity->getMovingTime()));
            } elseif ($activity->getAverageWatts()) {
                $weeklyData[$week] += round($this->calculatePowerEffort($activity->getAverageWatts(), $activity->getMovingTime()));
            }
        }

        $periodStart = $startDate ? clone $startDate : null;
        $periodEnd = clone $endDate;

        if (!$periodStart && !empty($activities)) {
            $oldestActivity = end($activities);
            $periodStart = clone $oldestActivity->getStartDateLocal();
            $periodStart->modify('monday this week');
        }

        $weeks = 1;
        if ($periodStart) {
            $weeks = max(1, intdiv($periodEnd->diff($periodStart)->days, 7) + 1);
        }

        $formattedData = [];
        if ($periodStart) {
            $periodStart->modify('monday this week');

            for ($i = 0; $i < $weeks; ++$i) {
                $weekStart = (clone $periodStart)->modify("+{$i} weeks");
                $weekKey = $weekStart->format('o-W');
                $formattedData[] = $weeklyData[$weekKey] ?? 0;
            }
        }

        return $formattedData;
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
     *
     * @return array an array of achievement statuses
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
                ? 'Achieved on: '.(new \DateTime($centuryRide['achievedDate']))->format('Y-m-d')
                : $this->getMaxDistanceProgression($userId, 100000).'/100 km',
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
                ? 'Achieved on: '.(new \DateTime($ultraDistance['achievedDate']))->format('Y-m-d')
                : $this->getMaxDistanceProgression($userId, 200000).'/200 km',
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
            if (!$activity['startDateLocal'] instanceof \DateTimeInterface) {
                continue;
            }
            $currentDate = $activity['startDateLocal'];

            if ($previousDate
                && $currentDate->format('Y-m-d') !== $previousDate->format('Y-m-d')
                && 1 === $currentDate->diff($previousDate)->days) {
                ++$currentStreak;
            } elseif ($previousDate && $currentDate->format('Y-m-d') === $previousDate->format('Y-m-d')) {
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
            'progression' => $maxStreak.'/'.$streakGoal.' days',
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
                ? 'Achieved on: '.(new \DateTime($marathon['achievedDate']))->format('Y-m-d')
                : $this->getMaxDistanceProgression($userId, 42195, 'Run').'/42.2 km',
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
            if ($activity['startDateLocal'] instanceof \DateTimeInterface) {
                if ((int) $activity['startDateLocal']->format('H') < 7) {
                    ++$earlyBirdCount;
                }
            }
        }

        $earlyBirdGoal = 10;
        $achievements[] = [
            'name' => 'Early Bird',
            'description' => 'Complete 10 activities starting before 7 AM',
            'achieved' => $earlyBirdCount >= $earlyBirdGoal,
            'progression' => $earlyBirdCount.'/'.$earlyBirdGoal,
        ];

        $startOfMonth = (new \DateTime('first day of this month'))->setTime(0, 0, 0);
        $endOfMonth = (new \DateTime('last day of this month'))->setTime(23, 59, 59);

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
            'progression' => round($elevationGain).'/'.$elevationGoal.' m',
        ];

        $endDate = new \DateTime();
        $startDate = (new \DateTime())->modify('-28 days')->setTime(0, 0, 0);

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
            if ($run['startDateLocal'] instanceof \DateTimeInterface) {
                $weekNumber = $run['startDateLocal']->format('o-W');
                if (!isset($runsPerWeek[$weekNumber])) {
                    $runsPerWeek[$weekNumber] = 0;
                }
                ++$runsPerWeek[$weekNumber];
            }
        }

        $completedWeeksCount = 0;
        $today = new \DateTime();
        for ($i = 0; $i < 4; ++$i) {
            $checkDate = (clone $today)->modify("-$i week");
            $checkWeekNumber = $checkDate->format('o-W');
            if (isset($runsPerWeek[$checkWeekNumber]) && $runsPerWeek[$checkWeekNumber] >= 3) {
                ++$completedWeeksCount;
            }
        }
        $consistencyGoalWeeks = 4;
        $achievements[] = [
            'name' => 'Consistent Runner',
            'description' => 'Run 3 times a week for 4 consecutive weeks',
            'achieved' => $completedWeeksCount >= $consistencyGoalWeeks,
            'progression' => $completedWeeksCount.'/'.$consistencyGoalWeeks.' weeks',
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
            'progression' => $explorerCities.'/'.$explorerGoal.' cities',
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
            'progression' => round($totalDistance / 1000).'/'.round($goalDistance / 1000).' km',
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
            'progression' => round($totalElevation).'/'.$goalElevationEverest.' m',
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
            if ($activity['startDateLocal'] instanceof \DateTimeInterface) {
                if ((int) $activity['startDateLocal']->format('H') >= 21) {
                    ++$nightOwlCount;
                }
            }
        }
        $goalNightOwl = 10;
        $achievedNightOwl = $nightOwlCount >= $goalNightOwl;
        $achievements[] = [
            'name' => 'Night Owl',
            'description' => 'Complete 10 activities starting after 9 PM local time',
            'achieved' => $achievedNightOwl,
            'progression' => $nightOwlCount.'/'.$goalNightOwl,
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
            if ($activity['startDateLocal'] instanceof \DateTimeInterface && $activity['distance'] > 0) {
                $dayOfWeek = (int) $activity['startDateLocal']->format('N');
                if (6 === $dayOfWeek || 7 === $dayOfWeek) {
                    $weekendDistance += (float) $activity['distance'];
                }
            }
        }
        $goalWeekendDistance = 500000;
        $achievedWeekendWarrior = $weekendDistance >= $goalWeekendDistance;
        $achievements[] = [
            'name' => 'Weekend Warrior',
            'description' => 'Accumulate 500 km on weekend activities (Sat/Sun)',
            'achieved' => $achievedWeekendWarrior,
            'progression' => round($weekendDistance / 1000).'/'.round($goalWeekendDistance / 1000).' km',
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
            'progression' => $validSportTypesCount.'/'.$goalTypes.' types',
        ];

        return $achievements;
    }

    private function getMaxDistanceProgression(int $userId, int $goalDistanceMeters, ?string $activityType = null): string
    {
        $qb = $this->createQueryBuilder('a')
            ->select('MAX(a.distance) as maxDistance')
            ->where('a.stravaUser = :userId')
            ->setParameter('userId', $userId);

        if (null !== $activityType) {
            $qb->andWhere('a.type = :type OR a.sportType = :type')
                ->setParameter('type', $activityType);
        }

        $maxDistance = $qb->getQuery()->getSingleScalarResult();
        $maxDistance = $maxDistance ?: 0;

        $displayDistance = min($maxDistance, $goalDistanceMeters);

        return round($displayDistance / 1000, 1);
    }

    public function getWeeklyDistance(int $userId): array
    {
        $request = $this->requestStack->getCurrentRequest();

        $hasStartDate = $request->query->has('startDate');
        $hasEndDate = $request->query->has('endDate');
        $hasSport = $request?->query->has('sport');

        $endDate = $hasEndDate
            ? new \DateTime($request->query->get('endDate'))
            : new \DateTime();

        $sport = $hasSport
            ? $request->query->get('sport')
            : null;

        $startDate = null;
        if ($hasStartDate) {
            $startDate = new \DateTime($request->query->get('startDate'));
        } elseif (!$hasEndDate) {
            $startDate = (new \DateTime())->modify('-12 weeks');
        }

        $qb = $this->createQueryBuilder('a')
            ->select('a')
            ->where('a.stravaUser = :userId')
            ->setParameter('userId', $userId);

        if ($startDate) {
            $qb->andWhere('a.startDateLocal >= :startDate')
                ->setParameter('startDate', $startDate);
        }

        if ($endDate) {
            $qb->andWhere('a.startDateLocal <= :endDate')
                ->setParameter('endDate', $endDate);
        }

        if ($sport) {
            $qb->andWhere('a.sportType = :sport')
                ->setParameter('sport', $sport);
        }

        $activities = $qb->getQuery()->getResult();

        $dataByWeek = [];
        foreach ($activities as $activity) {
            $dateTime = $activity->getStartDateLocal();
            if ($dateTime instanceof \DateTimeInterface) {
                $yearWeek = $dateTime->format('o-W');

                if (!isset($dataByWeek[$yearWeek])) {
                    $dataByWeek[$yearWeek] = [
                        'distance' => 0,
                        'elevation' => 0,
                        'time' => 0,
                    ];
                }

                $dataByWeek[$yearWeek]['distance'] += $activity->getDistance() / 1000;
                $dataByWeek[$yearWeek]['elevation'] += $activity->getTotalElevationGain();
                $dataByWeek[$yearWeek]['time'] += $activity->getMovingTime();
            }
        }

        $periodStart = $startDate ? clone $startDate : null;
        $periodEnd = clone $endDate;

        if (!$periodStart && !empty($activities)) {
            $oldestActivity = end($activities);
            $periodStart = clone $oldestActivity->getStartDateLocal();
            $periodStart->modify('monday this week');
        }

        $weeks = 1;
        if ($periodStart) {
            $weeks = max(1, intdiv($periodEnd->diff($periodStart)->days, 7) + 1);
        }

        $weeklyData = [];
        if ($periodStart) {
            $periodStart->modify('monday this week');

            for ($i = 0; $i < $weeks; ++$i) {
                $weekStart = (clone $periodStart)->modify("+{$i} weeks");
                $weekEnd = (clone $weekStart)->modify('+6 days');

                $weekKey = $weekStart->format('o-W');
                $weeklyData[] = [
                    'label' => $weekStart->format('d M').' - '.$weekEnd->format('d M'),
                    'distance' => isset($dataByWeek[$weekKey]) ? round($dataByWeek[$weekKey]['distance'], 2) : 0,
                    'elevation' => isset($dataByWeek[$weekKey]) ? round($dataByWeek[$weekKey]['elevation']) : 0,
                    'time' => isset($dataByWeek[$weekKey]) ? $dataByWeek[$weekKey]['time'] : 0,
                ];
            }
        }

        return $weeklyData;
    }

    public function getActivityCountBySport(int $userId): array
    {
        $qb = $this->createQueryBuilder('a');

        $qb->select('COALESCE(a.type, a.sportType) as sportType, COUNT(a.id) as activityCount')
            ->where('a.stravaUser = :userId')
            ->andWhere('a.type IS NOT NULL OR a.sportType IS NOT NULL')
            ->groupBy('sportType')
            ->orderBy('activityCount', 'DESC')
            ->setParameter('userId', $userId);
        $this->applyFilter($qb);
        $result = $qb->getQuery()->getResult();

        $sportDistribution = [];
        foreach ($result as $row) {
            $sportDistribution[] = [
                'type' => $row['sportType'],
                'count' => (int) $row['activityCount'],
            ];
        }

        return $sportDistribution;
    }

    public function getActivityStats(int $userId): array
    {
        $qb = $this->createQueryBuilder('a')
            ->select(
                'COUNT(a.id) as totalActivities',
                'SUM(a.distance) as rawTotalDistance',
                'SUM(a.movingTime) as rawTotalTime',
                'AVG(a.averageSpeed) as rawAverageSpeed'
            )
            ->where('a.stravaUser = :userId')
            ->setParameter('userId', $userId);

        $this->applyFilter($qb);

        $result = $qb->getQuery()->getSingleResult();

        return [
            'totalActivities' => $result['totalActivities'],
            'totalDistance' => round(($result['rawTotalDistance'] ?? 0) / 1000, 2),
            'totalTime' => round(($result['rawTotalTime'] ?? 0) / 3600, 2).' h',
            'averageSpeed' => round(($result['rawAverageSpeed'] ?? 0) * 3.6, 2).' km/h',
        ];
    }

    public function getAthleteSports(int $userId): array
    {
        $qb = $this->createQueryBuilder('a')
            ->select('DISTINCT a.sportType')
            ->where('a.stravaUser = :userId')
            ->setParameter('userId', $userId);

        $this->applyFilter($qb);

        return array_map(function ($row) {
            return $row['sportType'];
        }, $qb->getQuery()->getArrayResult());
    }
}

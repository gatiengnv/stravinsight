<?php

namespace App\Factory;

use App\Entity\ActivityDetails;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<ActivityDetails>
 */
final class ActivityDetailsFactory extends PersistentProxyObjectFactory
{
    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     *
     * @todo inject services if required
     */
    public function __construct()
    {
        parent::__construct();
    }

    public static function class(): string
    {
        return ActivityDetails::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        $distanceInKm = mt_rand(1, 30);
        $runPoints = $this->generateRandomRun($distanceInKm);
        $encodedPolyline = $this->encodePolyline($runPoints);

        return [
            'visibility' => 'everyone',
            'mapPolyline' => $encodedPolyline,
            'elevationHigh' => self::faker()->numberBetween(100, 150),
            'elevationLow' => self::faker()->numberBetween(50, 130),
            'uploadIdStr' => self::faker()->unique()->numberBetween(1, 1000000),
            'description' => self::faker()->text(),
            'calories' => self::faker()->numberBetween(100, 1500),
            'segmentEfforts' => $this->generateRandomSegments(self::faker()->numberBetween(1, 3)),
            'splitsMetric' => $this->generateRandomSplits(self::faker()->numberBetween(1, 11)),
            'splitsStandard' => $this->generateRandomMileSplits(self::faker()->numberBetween(1, 7)),
            'laps' => $this->generateRandomLaps(self::faker()->numberBetween(1, 15)),
            'bestEfforts' => $this->generateRandomBestEfforts(self::faker()->numberBetween(1, 7)),
            'gearDetails' => $this->generateRandomGear(self::faker()->numberBetween(1, 1)),
            'statsVisibility' => $this->generateRandomStatsVisibility(self::faker()->numberBetween(1, 5)),
            'deviceName' => self::faker()->randomElement(['Samsung Health', 'Strava', 'Apple Health', 'Garmin Connect', 'Fitbit']),
            'embedToken' => self::faker()->uuid(),
            'similarActivities' => $this->generateRandomEffortData(self::faker()->numberBetween(1, 10)),
            'availableZones' => ['heartrate', 'pace'],
        ];
    }

    private function generateRandomRun(int $distanceInKm): array
    {
        $points = [];
        $currentLat = 48.8566;
        $currentLng = 2.3522;

        $points[] = ['lat' => $currentLat, 'lng' => $currentLng];

        for ($i = 0; $i < $distanceInKm * 10; ++$i) {
            $currentLat += mt_rand(-10, 10) / 10000;
            $currentLng += mt_rand(-10, 10) / 10000;
            $points[] = ['lat' => $currentLat, 'lng' => $currentLng];
        }

        return $points;
    }

    private function encodePolyline(array $points): string
    {
        $encoded = '';
        $prevLat = 0;
        $prevLng = 0;

        foreach ($points as $point) {
            $lat = (int) round($point['lat'] * 1e5);
            $lng = (int) round($point['lng'] * 1e5);

            $dLat = $lat - $prevLat;
            $dLng = $lng - $prevLng;

            $encoded .= $this->encodeSignedNumber($dLat);
            $encoded .= $this->encodeSignedNumber($dLng);

            $prevLat = $lat;
            $prevLng = $lng;
        }

        return $encoded;
    }

    public function encodeSignedNumber(int $num): string
    {
        $num = $num < 0 ? ~($num << 1) : ($num << 1);

        return $this->encodeNumber($num);
    }

    private function encodeNumber(int $num): string
    {
        $encoded = '';
        while ($num >= 0x20) {
            $encoded .= chr((0x20 | ($num & 0x1F)) + 63);
            $num >>= 5;
        }
        $encoded .= chr($num + 63);

        return $encoded;
    }

    private function generateRandomSegments(int $count = 3): array
    {
        $segments = [];

        for ($i = 0; $i < $count; ++$i) {
            $segments[] = [
                'id' => self::faker()->unique()->randomNumber(9, true),
                'resource_state' => 2,
                'name' => self::faker()->word(),
                'activity' => [
                    'id' => self::faker()->unique()->randomNumber(8, true),
                    'visibility' => self::faker()->randomElement(['everyone', 'only_me']),
                    'resource_state' => 1,
                ],
                'athlete' => [
                    'id' => self::faker()->unique()->randomNumber(8, true),
                    'resource_state' => 1,
                ],
                'elapsed_time' => self::faker()->numberBetween(100, 300),
                'moving_time' => self::faker()->numberBetween(100, 300),
                'start_date' => self::faker()->dateTime()->format('Y-m-d\TH:i:s\Z'),
                'start_date_local' => self::faker()->dateTime()->format('Y-m-d\TH:i:s\Z'),
                'distance' => self::faker()->randomFloat(1, 100, 1000),
                'start_index' => self::faker()->numberBetween(0, 1000),
                'end_index' => self::faker()->numberBetween(1000, 2000),
                'average_cadence' => self::faker()->randomFloat(1, 70, 80),
                'device_watts' => self::faker()->boolean(),
                'average_heartrate' => self::faker()->randomFloat(1, 120, 180),
                'max_heartrate' => self::faker()->randomFloat(1, 150, 200),
                'segment' => [
                    'id' => self::faker()->unique()->randomNumber(8, true),
                    'resource_state' => 2,
                    'name' => self::faker()->word(),
                    'activity_type' => 'Run',
                    'distance' => self::faker()->randomFloat(1, 100, 1000),
                    'average_grade' => self::faker()->randomFloat(1, -5, 5),
                    'maximum_grade' => self::faker()->randomFloat(1, 0, 10),
                    'elevation_high' => self::faker()->randomFloat(1, 100, 200),
                    'elevation_low' => self::faker()->randomFloat(1, 50, 100),
                    'start_latlng' => [self::faker()->latitude(), self::faker()->longitude()],
                    'end_latlng' => [self::faker()->latitude(), self::faker()->longitude()],
                    'city' => self::faker()->city(),
                    'state' => self::faker()->state(),
                    'country' => self::faker()->country(),
                    'private' => self::faker()->boolean(),
                    'hazardous' => self::faker()->boolean(),
                    'starred' => self::faker()->boolean(),
                ],
                'pr_rank' => self::faker()->optional()->numberBetween(1, 10),
                'achievements' => [
                    [
                        'type_id' => 7,
                        'type' => 'segment_effort_count_leader',
                        'rank' => 1,
                        'effort_count' => self::faker()->numberBetween(1, 10),
                    ],
                ],
                'visibility' => self::faker()->randomElement(['everyone', 'only_me']),
                'kom_rank' => self::faker()->optional()->numberBetween(1, 10),
                'hidden' => self::faker()->boolean(),
            ];
        }

        return $segments;
    }

    private function generateRandomSplits(int $count = 11): array
    {
        $splits = [];

        for ($i = 1; $i <= $count; ++$i) {
            $splits[] = [
                'distance' => self::faker()->randomFloat(1, 900, 1100),
                'elapsed_time' => self::faker()->numberBetween(300, 400),
                'elevation_difference' => self::faker()->randomFloat(1, -20, 20),
                'moving_time' => self::faker()->numberBetween(300, 400),
                'split' => $i,
                'average_speed' => self::faker()->randomFloat(2, 2.5, 3.5),
                'average_grade_adjusted_speed' => self::faker()->randomFloat(2, 2.5, 3.5),
                'average_heartrate' => self::faker()->randomFloat(2, 120, 180),
                'pace_zone' => self::faker()->numberBetween(1, 5),
            ];
        }

        return $splits;
    }

    private function generateRandomMileSplits(int $count = 7): array
    {
        $mileSplits = [];

        for ($i = 1; $i <= $count; ++$i) {
            $mileSplits[] = [
                'distance' => self::faker()->randomFloat(1, 1600, 1620),
                'elapsed_time' => self::faker()->numberBetween(500, 600),
                'elevation_difference' => self::faker()->randomFloat(1, -30, 30),
                'moving_time' => self::faker()->numberBetween(500, 600),
                'split' => $i,
                'average_speed' => self::faker()->randomFloat(2, 2.8, 3.2),
                'average_grade_adjusted_speed' => self::faker()->randomFloat(2, 2.9, 3.2),
                'average_heartrate' => self::faker()->randomFloat(2, 140, 180),
                'pace_zone' => self::faker()->numberBetween(1, 5),
            ];
        }

        return $mileSplits;
    }

    private function generateRandomLaps(int $count = 1): array
    {
        $laps = [];

        for ($i = 1; $i <= $count; ++$i) {
            $laps[] = [
                'id' => self::faker()->unique()->randomNumber(8, true),
                'resource_state' => 2,
                'name' => 'Lap '.$i,
                'activity' => [
                    'id' => self::faker()->unique()->randomNumber(8, true),
                    'visibility' => self::faker()->randomElement(['everyone', 'only_me']),
                    'resource_state' => 1,
                ],
                'athlete' => [
                    'id' => self::faker()->unique()->randomNumber(8, true),
                    'resource_state' => 1,
                ],
                'elapsed_time' => self::faker()->numberBetween(3000, 4000),
                'moving_time' => self::faker()->numberBetween(3000, 4000),
                'start_date' => self::faker()->dateTime()->format('Y-m-d\TH:i:s\Z'),
                'start_date_local' => self::faker()->dateTime()->format('Y-m-d\TH:i:s\Z'),
                'distance' => self::faker()->randomFloat(1, 9000, 11000),
                'average_speed' => self::faker()->randomFloat(2, 2.5, 3.5),
                'max_speed' => self::faker()->randomFloat(3, 4.5, 6.0),
                'lap_index' => $i,
                'split' => $i,
                'start_index' => self::faker()->numberBetween(0, 100),
                'end_index' => self::faker()->numberBetween(1000, 4000),
                'total_elevation_gain' => self::faker()->randomFloat(1, 50, 100),
                'average_cadence' => self::faker()->randomFloat(1, 70, 80),
                'device_watts' => self::faker()->boolean(),
                'average_heartrate' => self::faker()->randomFloat(1, 120, 180),
                'max_heartrate' => self::faker()->randomFloat(1, 150, 200),
                'pace_zone' => self::faker()->numberBetween(1, 5),
            ];
        }

        return $laps;
    }

    private function generateRandomBestEfforts(int $count = 7): array
    {
        $bestEfforts = [];

        for ($i = 1; $i <= $count; ++$i) {
            $bestEfforts[] = [
                'id' => self::faker()->unique()->randomNumber(8, true),
                'resource_state' => 2,
                'name' => self::faker()->randomElement(['400m', '1/2 mile', '1K', '1 mile', '2 mile', '5K', '10K']),
                'activity' => [
                    'id' => self::faker()->unique()->randomNumber(8, true),
                    'visibility' => self::faker()->randomElement(['everyone', 'only_me']),
                    'resource_state' => 1,
                ],
                'athlete' => [
                    'id' => self::faker()->unique()->randomNumber(8, true),
                    'resource_state' => 1,
                ],
                'elapsed_time' => self::faker()->numberBetween(100, 4000),
                'moving_time' => self::faker()->numberBetween(100, 4000),
                'start_date' => self::faker()->dateTime()->format('Y-m-d\TH:i:s\Z'),
                'start_date_local' => self::faker()->dateTime()->format('Y-m-d\TH:i:s\Z'),
                'distance' => self::faker()->randomElement([400, 805, 1000, 1609, 3219, 5000, 10000]),
                'pr_rank' => null,
                'achievements' => [],
                'start_index' => self::faker()->numberBetween(0, 3000),
                'end_index' => self::faker()->numberBetween(3000, 4000),
            ];
        }

        return $bestEfforts;
    }

    private function generateRandomGear(int $count = 1): array
    {
        $gears = [];

        for ($i = 0; $i < $count; ++$i) {
            $gears[] = [
                'id' => 'g'.self::faker()->unique()->randomNumber(8, true),
                'primary' => self::faker()->boolean(),
                'name' => self::faker()->randomElement(['ASICS Gel-Glorify 5', 'Nike Air Zoom Pegasus', 'Adidas Ultraboost']),
                'nickname' => self::faker()->optional()->word(),
                'resource_state' => 2,
                'retired' => self::faker()->boolean(),
                'distance' => self::faker()->numberBetween(100000, 2000000),
                'converted_distance' => self::faker()->randomFloat(1, 100, 2000),
            ];
        }

        return $gears;
    }

    private function generateRandomStatsVisibility(int $count = 5): array
    {
        $statsVisibility = [];

        for ($i = 0; $i < $count; ++$i) {
            $statsVisibility[] = [
                'type' => self::faker()->randomElement(['heart_rate', 'pace', 'power', 'speed', 'calories']),
                'visibility' => self::faker()->randomElement(['everyone', 'only_me', 'followers']),
            ];
        }

        return $statsVisibility;
    }

    private function generateRandomEffortData(int $count = 1): array
    {
        $effortData = [];

        for ($i = 0; $i < $count; ++$i) {
            $averageSpeed = self::faker()->randomFloat(6, 2.5, 4.0);
            $effortData[] = [
                'effort_count' => self::faker()->numberBetween(1, 10),
                'average_speed' => $averageSpeed,
                'min_average_speed' => $averageSpeed,
                'mid_average_speed' => $averageSpeed,
                'max_average_speed' => $averageSpeed,
                'pr_rank' => null,
                'frequency_milestone' => null,
                'trend' => [
                    'speeds' => [$averageSpeed],
                    'current_activity_index' => 0,
                    'min_speed' => $averageSpeed,
                    'mid_speed' => $averageSpeed,
                    'max_speed' => $averageSpeed,
                    'direction' => 0,
                ],
                'resource_state' => 2,
            ];
        }

        return $effortData;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this// ->afterInstantiate(function(ActivityDetails $activityDetails): void {})
        ;
    }

    private function generateRandomPrimaryCount(int $count = 1): array
    {
        $primaryCounts = [];

        for ($i = 0; $i < $count; ++$i) {
            $primaryCounts[] = [
                'primary' => self::faker()->optional()->boolean(null),
                'count' => self::faker()->numberBetween(0, 100),
            ];
        }

        return $primaryCounts;
    }
}

<?php

namespace App\Factory;

use App\Entity\Activity;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<Activity>
 */
final class ActivityFactory extends PersistentProxyObjectFactory
{
    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     *
     * @todo inject services if required
     */
    public function __construct()
    {
    }

    public static function class(): string
    {
        return Activity::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        $sport = self::faker()->randomElement([
            [
                'type' => 'Run',
                'name' => 'My Run'
            ],
            [
                'type' => 'Swim',
                'name' => 'My Swim'
            ],
            [
                'type' => 'Ride',
                'name' => 'My Ride'
            ],
            [
                'type' => 'Walk',
                'name' => 'My Walk'
            ]
        ]);

        $startDate = self::faker()->dateTimeBetween('-1 years', 'now');
        $time = self::faker()->numberBetween(1000, 10000);
        $distance = $time * self::faker()->randomFloat(2, 2, 5);
        $averageHeartRate = self::faker()->numberBetween(100, 190);
        $distanceInKm = mt_rand(1, 30);
        $runPoints = $this->generateRandomRun($distanceInKm);
        $encodedPolyline = $this->encodePolyline($runPoints);


        return [
            'stravaUser' => UserFactory::random(),
            'id' => self::faker()->unique()->numberBetween(1, 1000000),
            'gearId' => self::faker()->unique()->numberBetween(1, 100000),
            'name' => $sport['name'],
            'type' => $sport['type'],
            'sportType' => $sport['type'],
            'startDate' => $startDate,
            'startDateLocal' => $startDate,
            'timezone' => '(GMT+01:00) Europe/Paris',
            'utcOffset' => self::faker()->randomElement([3600, 7200]),
            'movingTime' => $time,
            'elapsedTime' => $time,
            'distance' => $distance,
            'totalElevationGain' => self::faker()->numberBetween(0, 100),
            'averageSpeed' => $distance / $time,
            'maxSpeed' => ($distance / $time) * 1.5,
            'hasHeartrate' => true,
            'averageHeartrate' => $averageHeartRate,
            'maxHeartrate' => $averageHeartRate * 1.25,
            'sufferScore' => self::faker()->numberBetween(0, 100),
            'averageCadence' => self::faker()->numberBetween(75, 100),
            'startLatlng' => [self::faker()->latitude(), self::faker()->longitude()],
            'endLatlng' => [self::faker()->latitude(), self::faker()->longitude()],
            'locationCity' => self::faker()->city(),
            'locationState' => 'Marne',
            'locationCountry' => self::faker()->country(),
            'mapId' => 'a' . self::faker()->unique()->numberBetween(1, 100000),
            'summaryPolyline' => $encodedPolyline,
            'achievementCount' => self::faker()->numberBetween(0, 10),
            'kudosCount' => self::faker()->numberBetween(0, 1000),
            'commentCount' => self::faker()->numberBetween(0, 100),
            'athleteCount' => self::faker()->numberBetween(0, 100),
            'photoCount' => self::faker()->numberBetween(0, 10),
            'totalPhotoCount' => self::faker()->numberBetween(0, 10),
            'prCount' => self::faker()->numberBetween(0, 5)
        ];
    }

    private function generateRandomRun(int $distanceInKm): array
    {
        $points = [];
        $currentLat = 48.8566;
        $currentLng = 2.3522;

        $points[] = ['lat' => $currentLat, 'lng' => $currentLng];

        for ($i = 0; $i < $distanceInKm * 10; $i++) {
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
            $lat = (int)round($point['lat'] * 1e5);
            $lng = (int)round($point['lng'] * 1e5);

            $dLat = $lat - $prevLat;
            $dLng = $lng - $prevLng;

            $encoded .= $this->encodeSignedNumber($dLat);
            $encoded .= $this->encodeSignedNumber($dLng);

            $prevLat = $lat;
            $prevLng = $lng;
        }

        return $encoded;
    }

    function encodeSignedNumber(int $num): string
    {
        $num = $num < 0 ? ~($num << 1) : ($num << 1);
        return $this->encodeNumber($num);
    }

    private function encodeNumber(int $num): string
    {
        $encoded = '';
        while ($num >= 0x20) {
            $encoded .= chr((0x20 | ($num & 0x1f)) + 63);
            $num >>= 5;
        }
        $encoded .= chr($num + 63);
        return $encoded;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this// ->afterInstantiate(function(Activity $activity): void {})
            ;
    }
}

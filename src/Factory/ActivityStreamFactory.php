<?php

namespace App\Factory;

use App\Entity\ActivityStream;
use Faker\Factory;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<ActivityStream>
 */
final class ActivityStreamFactory extends PersistentProxyObjectFactory
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
        return ActivityStream::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     * @return array|callable
     */
    protected function defaults(): array|callable
    {
        $data = $this->generateRandomActivityData();
        return [
            'latlngData' => $data['lating_data'],
            'velocityData' => $data['velocity_data'],
            'gradeData' => $data['grade_data'],
            'cadenceData' => $data['cadence_data'],
            'distanceData' => $data['distance_data'],
            'altitudeData' => $data['altitude_data'],
            'heartrateData' => $data['heartrate_data'],
            'timeData' => $data['time_data'],
            'originalSize' => 4075,
            'resolution' => self::faker()->randomElement(['high', 'medium', 'low'])
        ];
    }

    public function generateRandomActivityData(): array
    {
        $faker = Factory::create();

        $latingData = [];
        for ($i = 0; $i < 8; $i++) {
            $latingData[] = [
                $faker->latitude(49.0, 50.0),
                $faker->longitude(4.0, 5.0)
            ];
        }

        $velocityData = [];
        for ($i = 0; $i < 100; $i++) {
            $velocityData[] = $faker->randomFloat(3, 0.0, 5.0);
        }

        $gradeData = [];
        for ($i = 0; $i < 100; $i++) {
            $gradeData[] = $faker->randomFloat(1, -5.0, 5.0);
        }

        $cadenceData = [];
        for ($i = 0; $i < 100; $i++) {
            $cadenceData[] = $faker->numberBetween(60, 100);
        }

        $distanceData = [];
        $distance = 0.0;
        for ($i = 0; $i < 100; $i++) {
            $distance += $faker->randomFloat(1, 0.5, 5.0);
            $distanceData[] = $distance;
        }

        $altitudeData = [];
        for ($i = 0; $i < 100; $i++) {
            $altitudeData[] = $faker->randomFloat(1, 100.0, 200.0);
        }

        $heartrateData = [];
        for ($i = 0; $i < 100; $i++) {
            $heartrateData[] = $faker->numberBetween(100, 180);
        }

        $timeData = [];
        $time = 0;
        for ($i = 0; $i < 100; $i++) {
            $time += $faker->numberBetween(1, 5);
            $timeData[] = $time;
        }

        return [
            'lating_data' => $latingData,
            'velocity_data' => $velocityData,
            'grade_data' => $gradeData,
            'cadence_data' => $cadenceData,
            'distance_data' => $distanceData,
            'altitude_data' => $altitudeData,
            'heartrate_data' => $heartrateData,
            'time_data' => $timeData,
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this// ->afterInstantiate(function(ActivityStream $activityStream): void {})
            ;
    }
}

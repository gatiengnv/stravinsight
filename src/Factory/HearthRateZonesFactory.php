<?php

namespace App\Factory;

use App\Entity\HearthRateZones;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<HearthRateZones>
 */
final class HearthRateZonesFactory extends PersistentProxyObjectFactory
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
        return HearthRateZones::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        return [
            'zone1' => ['min' => random_int(40, 60), 'max' => random_int(61, 100)],
            'zone2' => ['min' => random_int(101, 120), 'max' => random_int(121, 140)],
            'zone3' => ['min' => random_int(141, 160), 'max' => random_int(161, 180)],
            'zone4' => ['min' => random_int(181, 200), 'max' => random_int(201, 220)],
            'zone5' => ['min' => random_int(221, 240), 'max' => random_int(241, 260)],
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this// ->afterInstantiate(function(HearthRateZones $hearthRateZones): void {})
        ;
    }
}

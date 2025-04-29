<?php

namespace App\Factory;

use App\Entity\User;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<User>
 */
final class UserFactory extends PersistentProxyObjectFactory
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
        return User::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        return [
            'stravaId' => self::faker()->unique()->numberBetween(1, 1000000),
            'username' => self::faker()->userName(),
            'firstname' => self::faker()->firstName(),
            'lastname' => self::faker()->lastName(),
            'bio' => self::faker()->text(),
            'city' => self::faker()->city(),
            'state' => 'Marne',
            'country' => self::faker()->country(),
            'sex' => self::faker()->randomElement(['M', 'F']),
            'premium' => self::faker()->boolean(0.1),
            'summit' => self::faker()->boolean(0.1),
            'createdAt' => self::faker()->dateTimeBetween('-1 years', 'now'),
            'updatedAt' => self::faker()->dateTimeBetween('-1 years', 'now'),
            'weight' => self::faker()->numberBetween(25, 250),
            'profileMedium' => 'https://picsum.photos/200',
            'profile' => 'https://picsum.photos/200',
            'hearthRateZones' => HearthRateZonesFactory::createOne(),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this// ->afterInstantiate(function(User $user): void {})
        ;
    }
}

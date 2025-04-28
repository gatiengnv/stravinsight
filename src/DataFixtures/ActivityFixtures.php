<?php

namespace App\DataFixtures;

use App\Factory\ActivityDetailsFactory;
use App\Factory\ActivityFactory;
use App\Factory\ActivityStreamFactory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class ActivityFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        for ($i = 0; $i < 100; $i++) {
            $activity = ActivityFactory::createOne();
            ActivityDetailsFactory::createOne([
                'activity' => $activity,
            ]);
            ActivityStreamFactory::createOne([
                'activity' => $activity,
            ]);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }
}

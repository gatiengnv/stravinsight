<?php

namespace App\Strava\Client;

use App\Entity\Activity;

interface Strava
{
    public function setAccessToken(string $accessToken): void;

    /** @return Activity[] */
    public function getAllActivities(): array;

    public function getUserInfo(): array;

    public function getAthleteZones(): array;

    public function getActivityDetails(int $activityId): array;

    public function getActivityStreams(int $activityId): array;
}

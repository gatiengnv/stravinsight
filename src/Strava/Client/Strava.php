<?php

namespace App\Strava\Client;

use App\Strava\Activities;

interface Strava
{
    public function setAccessToken(string $accessToken): void;

    /** @return Activities[] */
    public function getAllActivities(): array;

    public function getUserInfo(): array;
}

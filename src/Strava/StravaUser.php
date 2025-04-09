<?php

namespace App\Strava;

use GuzzleHttp\Client;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\GuzzleException;

class StravaUser
{
    public function __construct(
        private string $accessToken,
        private ClientInterface $httpClient = new Client(),
    ) {
    }

    public function getAccessToken(): string
    {
        return $this->accessToken;
    }

    public function setAccessToken(string $accessToken): void
    {
        $this->accessToken = $accessToken;
    }

    public function getHttpClient(): ClientInterface
    {
        return $this->httpClient;
    }

    public function setHttpClient(ClientInterface $httpClient): void
    {
        $this->httpClient = $httpClient;
    }

    /**
     * @throws GuzzleException
     */
    public function getAllActivities(): array
    {
        $request = $this->httpClient->request('GET',
            'https://www.strava.com/api/v3/athlete/activities',
            ['headers' => [
                'Authorization' => 'Bearer '.$this->accessToken,
            ],
            ]
        )->getBody()->getContents();

        return json_decode($request, true);
    }
}

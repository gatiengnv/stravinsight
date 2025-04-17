<?php

namespace App\Strava\Client;

use App\Entity\Activity;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class StravaClient implements Strava
{
    private string $accessToken = '';

    public function __construct(
        private HttpClientInterface $httpClient,
    ) {
    }

    public function setAccessToken(string $accessToken): void
    {
        $this->accessToken = $accessToken;
    }

    /**
     * @return Activity[]
     */
    public function getAllActivities(): array
    {
        $responseBody = $this->httpClient->request(
            'GET',
            'https://www.strava.com/api/v3/athlete/activities?per_page=200',
            [
                'headers' => [
                    'Authorization' => \sprintf('Bearer %s', $this->accessToken),
                ],
            ]
        )->getContent();

        /*
         * $serializer = new Serializer(
            [new GetSetMethodNormalizer(), new ArrayDenormalizer()],
            [new JsonEncoder()]
        );

        return $serializer->deserialize($responseBody, Activity::class.'[]', 'json');
         */

        return json_decode($responseBody, true);
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function getUserInfo(): array
    {
        $responseBody = $this->httpClient->request(
            'GET',
            'https://www.strava.com/api/v3/athlete',
            [
                'headers' => [
                    'Authorization' => \sprintf('Bearer %s', $this->accessToken),
                ],
            ]
        )->getContent();

        return json_decode($responseBody, true);
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function getAthleteZones(): array
    {
        $responseBody = $this->httpClient->request(
            'GET',
            'https://www.strava.com/api/v3/athlete/zones',
            [
                'headers' => [
                    'Authorization' => \sprintf('Bearer %s', $this->accessToken),
                ],
            ]
        )->getContent();

        return json_decode($responseBody, true);
    }
}

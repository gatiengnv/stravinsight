<?php

namespace App\Strava\Client;

use App\Strava\Activities;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use function sprintf;

class StravaClient implements Strava
{
    private string $accessToken = '';

    public function __construct(
        private HttpClientInterface $httpClient,
    )
    {
    }

    public function setAccessToken(string $accessToken): void
    {
        $this->accessToken = $accessToken;
    }

    /**
     * @return Activities[]
     */
    public function getAllActivities(): array
    {
        $responseBody = $this->httpClient->request(
            'GET',
            'https://www.strava.com/api/v3/athlete/activities?per_page=200',
            [
                'headers' => [
                    'Authorization' => sprintf('Bearer %s', $this->accessToken),
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

    public function getUserInfo(): array
    {
        $responseBody = $this->httpClient->request(
            'GET',
            'https://www.strava.com/api/v3/athlete',
            [
                'headers' => [
                    'Authorization' => sprintf('Bearer %s', $this->accessToken),
                ],
            ]
        )->getContent();

        return json_decode($responseBody, true);
    }
}

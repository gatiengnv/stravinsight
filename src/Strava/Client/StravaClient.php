<?php

namespace App\Strava\Client;

use App\Entity\Activity;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use function sprintf;

class StravaClient implements Strava
{
    private string $accessToken = '';

    public function __construct(
        private HttpClientInterface $httpClient,
        private RequestStack        $requestStack
    )
    {
        $session = $this->requestStack->getSession();
        if ($session->has('access_token')) {
            $this->accessToken = $session->get('access_token');
        }

    }

    public function setAccessToken(string $accessToken): void
    {
        $this->accessToken = $accessToken;
        $this->requestStack->getSession()->set('access_token', $accessToken);
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
                    'Authorization' => sprintf('Bearer %s', $this->accessToken),
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
    public function getActivityDetails(int $activityId): array
    {
        $responseBody = $this->httpClient->request(
            'GET',
            sprintf('https://www.strava.com/api/v3/activities/%s?include_all_efforts=', $activityId),
            [
                'headers' => [
                    'Authorization' => sprintf('Bearer %s', $this->accessToken),
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
                    'Authorization' => sprintf('Bearer %s', $this->accessToken),
                ],
            ]
        )->getContent();

        return json_decode($responseBody, true);
    }


}

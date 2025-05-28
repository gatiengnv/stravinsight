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
    private string $refreshToken = '';

    public function __construct(
        private HttpClientInterface $httpClient,
        private RequestStack        $requestStack,
    )
    {
        $session = $this->requestStack->getSession();
        if ($session->has('access_token')) {
            $this->accessToken = $session->get('access_token');
        }
        if ($session->has('refresh_token')) {
            $this->refreshToken = $session->get('refresh_token');
        }
    }

    /**
     * @return Activity[]
     * @throws ClientExceptionInterface
     */
    public function getAllActivities(int $pageNumber = 1): array
    {
        return $this->executeRequest(
            'GET',
            sprintf('https://www.strava.com/api/v3/athlete/activities?page=%s&per_page=200', $pageNumber)
        );
    }

    private function executeRequest(string $method, string $url, array $options = []): array
    {
        if (!isset($options['headers'])) {
            $options['headers'] = [];
        }
        $options['headers']['Authorization'] = sprintf('Bearer %s', $this->accessToken);

        try {
            $response = $this->httpClient->request($method, $url, $options);

            return json_decode($response->getContent(), true);
        } catch (ClientExceptionInterface $e) {
            if (in_array($e->getResponse()->getStatusCode(), [401, 403])) {
                $this->refreshTokens();
                $options['headers']['Authorization'] = sprintf('Bearer %s', $this->accessToken);
                $response = $this->httpClient->request($method, $url, $options);

                return json_decode($response->getContent(), true);
            }
            throw $e;
        }
    }

    public function refreshTokens(): void
    {
        $responseBody = $this->httpClient->request(
            'POST',
            'https://www.strava.com/oauth/token',
            [
                'body' => [
                    'client_id' => $_ENV['OAUTH_STRAVA_CLIENT_ID'],
                    'client_secret' => $_ENV['OAUTH_STRAVA_CLIENT_SECRET'],
                    'refresh_token' => $this->refreshToken,
                    'grant_type' => 'refresh_token',
                ],
            ]
        )->getContent();

        $response = json_decode($responseBody, true);
        $this->setAccessToken($response['access_token']);
        $this->setRefreshToken($response['refresh_token']);
    }

    public function setAccessToken(string $accessToken): void
    {
        $this->accessToken = $accessToken;
        $this->requestStack->getSession()->set('access_token', $accessToken);
    }

    public function setRefreshToken(string $refreshToken): void
    {
        $this->refreshToken = $refreshToken;
        $this->requestStack->getSession()->set('refresh_token', $refreshToken);
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function getActivityDetails(int $activityId): array
    {
        return $this->executeRequest(
            'GET',
            sprintf('https://www.strava.com/api/v3/activities/%s?include_all_efforts=', $activityId)
        );
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function getUserInfo(): array
    {
        return $this->executeRequest(
            'GET',
            'https://www.strava.com/api/v3/athlete'
        );
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ServerExceptionInterface
     * @throws RedirectionExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function getAthleteZones(): array
    {
        return $this->executeRequest(
            'GET',
            'https://www.strava.com/api/v3/athlete/zones'
        );
    }

    public function getActivityStreams(int $activityId): array
    {
        return $this->executeRequest(
            'GET',
            sprintf('https://www.strava.com/api/v3/activities/%s/streams?keys=time,distance,latlng,altitude,velocity_smooth,heartrate,cadence,watts,temp,grade_smooth&key_by_type=true', $activityId)
        );
    }

    public function logout(): void
    {
        $this->httpClient->request(
            'POST',
            'https://www.strava.com/oauth/deauthorize',
            [
                'headers' => [
                    'Authorization' => sprintf('Bearer %s', $this->accessToken),
                ],
            ]
        );
    }
}

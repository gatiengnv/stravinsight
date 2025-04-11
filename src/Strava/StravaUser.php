<?php

namespace App\Strava;

use GuzzleHttp\Client;
use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\GuzzleException;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ArrayDenormalizer;
use Symfony\Component\Serializer\Normalizer\GetSetMethodNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

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
    public function getAllActivities(): mixed
    {
        $responseBody = $this->httpClient->request(
            'GET',
            'https://www.strava.com/api/v3/athlete/activities',
            [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->accessToken,
                ],
            ]
        )->getBody()->getContents();

        $serializer = new Serializer(
            [new GetSetMethodNormalizer(), new ArrayDenormalizer()],
            [new JsonEncoder()]
        );

        return $serializer->deserialize($responseBody, Activities::class . '[]', 'json');
    }
}

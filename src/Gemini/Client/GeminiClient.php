<?php

namespace App\Gemini\Client;

use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class GeminiClient implements Gemini
{
    private string $apiKey;
    private ?array $activity = null;
    private ?array $activityDetail = null;
    private ?array $activityStream = null;
    private ?array $performanceData = null;

    public function __construct(private readonly HttpClientInterface $httpClient)
    {
        $this->apiKey = $_ENV['GEMINI_API_KEY'];
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ClientExceptionInterface
     */
    public function getOverviewDescription(): string
    {
        return $this->makeRequest(
            sprintf(
                'Generate a concise, motivational summary of my activity using the following details: %s, %s, %s. Compare this effort with my past 3 months of performance data: %s. Highlight any notable progress or achievements. Use a friendly, energetic tone, similar to Strava AI summaries. Keep it short and shareable, like a social media post. Do not include any introduction or explanation — go straight to the analysis.',
                json_encode($this->activity),
                json_encode($this->activityDetail),
                json_encode($this->activityStream),
                json_encode($this->performanceData)
            )
        );
    }

    public function makeRequest(string $prompt): string
    {
        $response = $this->httpClient->request(
            'POST',
            sprintf('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=%s', $this->apiKey),
            [
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'contents' => [
                        'parts' => [
                            [
                                'text' => $prompt,
                            ],
                        ],
                    ],
                ],
            ]
        );

        try {
            return json_decode($response->getContent(), true)['candidates'][0]['content']['parts'][0]['text'];
        } catch (ClientExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface|TransportExceptionInterface $e) {
            return $e->getMessage();
        }
    }

    /**
     * @throws ClientExceptionInterface
     */
    public function initActivity(array $details, array $performanceData): void
    {
        $this->activity = $details['activity'];
        $this->activityDetail = $details['activityDetail'];
        $this->activityStream = $details['activityStream'];
        $this->performanceData = $performanceData;
    }

    public function getChartsDescription(): string
    {
        return $this->makeRequest(
            sprintf(
                'Based on the following chart data: %s, write a concise and insightful analysis in the style of Strava AI. Highlight trends, improvements, or anomalies. Compare with past performance like %s if available, and emphasize any progress or standout moments. Use a motivational and data-aware tone. Keep the response short, clear, and focused purely on the insights. Do not include any introduction or explanation — go straight to the analysis.',
                json_encode($this->activityStream),
                json_encode($this->performanceData)
            )
        );
    }

    public function getSplitDescription(): string
    {
        return $this->makeRequest(
            sprintf(
                'Analyze the following split data: %s. Write a short and focused summary in the style of Strava AI. Highlight pacing trends, consistency, negative or positive splits, and any standout intervals. Mention if the pacing suggests strong endurance, a fast finish, or fatigue. Do not include any introduction or explanation — start directly with the analysis.',
                json_encode($this->activityDetail)
            )
        );
    }
}

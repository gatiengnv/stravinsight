<?php

namespace App\Controller;

use App\Entity\Activity;
use App\Entity\AIresponse;
use App\Gemini\Client\GeminiClient;
use App\Repository\ActivityRepository;
use App\Service\StravaImportService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

#[IsGranted('IS_AUTHENTICATED')]
final class ActivityController extends AbstractController
{
    public function __construct(
        private readonly ActivityRepository  $activityRepository,
        private readonly StravaImportService $stravaImportService,
        private readonly GeminiClient        $geminiClient,
    )
    {
    }

    #[Route('/activities', name: 'app_activity')]
    public function index(Request $request): Response
    {
        $userSports = $this->activityRepository->getAthleteSports();
        $page = max(1, (int)$request->query->get('page', 1));
        $limit = 25;
        $offset = ($page - 1) * $limit;

        $startDate = $request->query->get('startDate');
        $endDate = $request->query->get('endDate');
        $sport = $request->query->get('sport');

        $activities = $this->activityRepository->getActivities(
            $limit,
            $offset,
            $startDate,
            $endDate,
            $sport
        );

        if ($request->isXmlHttpRequest()) {
            return $this->json([
                'activities' => $activities,
                'hasMore' => count($activities) == $limit,
                'nextPage' => $page + 1,
            ]);
        }

        return $this->render('activity/index.html.twig', [
            'activities' => $activities,
            'currentPage' => $page,
            'userSports' => $userSports
        ]);
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ClientExceptionInterface
     */
    #[Route('/activities/{id}', requirements: ['id' => '\d+'])]
    public function show(
        int                    $id,
        EntityManagerInterface $entityManager,
    ): Response
    {
        $details = $this->stravaImportService->importUserActivityDetails($id, $entityManager);
        $this->geminiClient->initActivity($details, $this->activityRepository->getAthletePerformanceData());

        return $this->render('activity/show.html.twig', [
            'activity' => $details['activity'],
            'activityDetail' => $details['activityDetail'],
            'activityStream' => $details['activityStream'],
        ]);
    }

    #[Route('/activities/{id}/initialize', name: 'app_activities_initialize')]
    public function initialize(
        int $id,
    ): Response
    {
        return $this->render('activity/initialize.html.twig', [
            'endpoint' => "/api/activity/$id/sync",
            'redirectUrl' => "/activities/$id",
        ]);
    }

    #[Route('/api/activity/{id}/sync', name: 'app_activity_synchronize')]
    public function synchronize(
        int                    $id,
        EntityManagerInterface $entityManager,
    ): Response
    {
        $details = $this->stravaImportService->importUserActivityDetails($id, $entityManager);
        $this->geminiClient->initActivity($details, $this->activityRepository->getAthletePerformanceData());

        return $this->json(
            [
                'status' => 'success',
            ]
        );
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ClientExceptionInterface
     */
    /**
     * @throws TransportExceptionInterface
     * @throws ClientExceptionInterface
     */
    #[Route('/api/activities/{id}/overview', methods: ['GET'])]
    public function getActivityOverview(int $id, EntityManagerInterface $entityManager): Response
    {
        $AIresponse = $this->getOrCreateAiResponse($entityManager, $id);

        if (!$AIresponse->getOverview()) {
            $details = $this->stravaImportService->importUserActivityDetails($id, $entityManager);
            $this->geminiClient->initActivity($details, $this->activityRepository->getAthletePerformanceData());

            $overviewDescription = $this->geminiClient->getOverviewDescription();

            $AIresponse->setOverview($overviewDescription);

            $entityManager->flush();
        }

        return $this->json(
            trim(str_replace(["\n", "\r"], ' ', $AIresponse->getOverview()))
        );
    }

    private function getOrCreateAiResponse(EntityManagerInterface $entityManager, int $id): AIresponse|JsonResponse
    {
        $AIresponse = $entityManager->getRepository(AIresponse::class)->findOneBy(['activity' => $id]);

        if (!$AIresponse) {
            $activity = $entityManager->getRepository(Activity::class)->find($id);
            if (!$activity) {
                return $this->json(['error' => 'Sorry there is a problem'], Response::HTTP_NOT_FOUND);
            }

            $AIresponse = new AIresponse();
            $AIresponse->setActivity($activity);
            $entityManager->persist($AIresponse);
        }

        return $AIresponse;
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ClientExceptionInterface
     */
    #[Route('/api/activities/{id}/charts', methods: ['GET'])]
    public function getActivityCharts(int $id, EntityManagerInterface $entityManager): Response
    {
        $AIresponse = $this->getOrCreateAiResponse($entityManager, $id);

        if (!$AIresponse->getCharts()) {
            $details = $this->stravaImportService->importUserActivityDetails($id, $entityManager);
            $this->geminiClient->initActivity($details, $this->activityRepository->getAthletePerformanceData());

            $chartDescription = $this->geminiClient->getChartsDescription();

            $AIresponse->setCharts($chartDescription);

            $entityManager->flush();
        }

        return $this->json(
            trim(str_replace(["\n", "\r"], ' ', $AIresponse->getCharts()))
        );
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ClientExceptionInterface
     */
    #[Route('/api/activities/{id}/splits', methods: ['GET'])]
    public function getActivitySplits(int $id, EntityManagerInterface $entityManager): Response
    {
        $AIresponse = $this->getOrCreateAiResponse($entityManager, $id);

        if (!$AIresponse->getSplits()) {
            $details = $this->stravaImportService->importUserActivityDetails($id, $entityManager);
            $this->geminiClient->initActivity($details, $this->activityRepository->getAthletePerformanceData());

            $splitDescription = $this->geminiClient->getSplitDescription();

            $AIresponse->setSplits($splitDescription);

            $entityManager->flush();
        }

        return $this->json(
            trim(str_replace(["\n", "\r"], ' ', $AIresponse->getSplits()))
        );
    }
}

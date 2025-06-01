<?php

namespace App\Controller;

use App\Entity\Activity;
use App\Entity\AIresponse;
use App\Gemini\Client\GeminiClient;
use App\Repository\ActivityRepository;
use App\Service\StravaImportService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
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
    private ?int $userId = null;

    public function __construct(
        private readonly ActivityRepository $activityRepository,
        private readonly StravaImportService $stravaImportService,
        private readonly GeminiClient $geminiClient,
        private readonly Security $security,
    ) {
        $user = $this->security->getUser();
        if ($user) {
            $this->userId = $user->getId();
        }
    }

    #[Route('/activities', name: 'app_activity')]
    public function index(Request $request): Response
    {
        if (null === $this->userId) {
            return $this->redirectToRoute('app_login');
        }
        $userSports = $this->activityRepository->getAthleteSports($this->userId);
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = 25;
        $offset = ($page - 1) * $limit;

        $startDate = $request->query->get('startDate');
        $endDate = $request->query->get('endDate');
        $sport = $request->query->get('sport');

        $activities = $this->activityRepository->getActivities(
            $this->userId,
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
            'userSports' => $userSports,
        ]);
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ClientExceptionInterface
     */
    #[Route('/activities/{id}', requirements: ['id' => '\d+'])]
    public function show(
        int $id,
        EntityManagerInterface $entityManager,
    ): Response {
        if (null === $this->userId) {
            return $this->redirectToRoute('app_login');
        }
        try {
            $details = $this->stravaImportService->importUserActivityDetails($id, $entityManager);
            $this->geminiClient->initActivity($details, $this->activityRepository->getAthletePerformanceData($this->userId));
        } catch (\Exception $e) {
            return $this->render('activity/error.html.twig');
        }

        return $this->render('activity/show.html.twig', [
            'activity' => $details['activity'],
            'activityDetail' => $details['activityDetail'],
            'activityStream' => $details['activityStream'],
        ]);
    }

    #[Route('/activities/{id}/initialize', name: 'app_activities_initialize')]
    public function initialize(
        int $id,
    ): Response {
        return $this->render('activity/initialize.html.twig', [
            'endpoint' => "/api/activity/$id/sync",
            'redirectUrl' => "/activities/$id",
        ]);
    }

    #[Route('/api/activity/{id}/sync', name: 'app_activity_synchronize')]
    public function synchronize(
        int $id,
        EntityManagerInterface $entityManager,
    ): Response {
        if (null === $this->userId) {
            return $this->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
        $details = $this->stravaImportService->importUserActivityDetails($id, $entityManager);
        $this->geminiClient->initActivity($details, $this->activityRepository->getAthletePerformanceData($this->userId));

        return $this->json(
            [
                'status' => 'success',
            ]
        );
    }

    #[Route('/api/activities/{id}/overview', methods: ['GET'])]
    public function getActivityOverview(int $id, EntityManagerInterface $entityManager): Response
    {
        if (null === $this->userId) {
            return $this->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
        $aiResponseOrError = $this->getOrCreateAiResponse($entityManager, $id);
        if ($aiResponseOrError instanceof JsonResponse) {
            return $aiResponseOrError;
        }
        $aiResponse = $aiResponseOrError;

        if (!$aiResponse->getOverview()) {
            $details = $this->stravaImportService->importUserActivityDetails($id, $entityManager);
            $this->geminiClient->initActivity($details, $this->activityRepository->getAthletePerformanceData($this->userId));

            $overviewDescription = $this->geminiClient->getOverviewDescription();

            $aiResponse->setOverview($overviewDescription);

            $entityManager->flush();
        }

        return $this->json(
            trim(str_replace(["\n", "\r"], ' ', $aiResponse->getOverview() ?? ''))
        );
    }

    private function getOrCreateAiResponse(EntityManagerInterface $entityManager, int $id): AIresponse|JsonResponse
    {
        $aiResponse = $entityManager->getRepository(AIresponse::class)->findOneBy(['activity' => $id]);

        if (!$aiResponse) {
            $activity = $entityManager->getRepository(Activity::class)->find($id);
            if (!$activity) {
                return $this->json(['error' => 'Activity not found'], Response::HTTP_NOT_FOUND);
            }

            $aiResponse = new AIresponse();
            $aiResponse->setActivity($activity);
            $entityManager->persist($aiResponse);
        }

        return $aiResponse;
    }

    #[Route('/api/activities/{id}/charts', methods: ['GET'])]
    public function getActivityCharts(int $id, EntityManagerInterface $entityManager): Response
    {
        if (null === $this->userId) {
            return $this->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
        $aiResponseOrError = $this->getOrCreateAiResponse($entityManager, $id);
        if ($aiResponseOrError instanceof JsonResponse) {
            return $aiResponseOrError;
        }
        $aiResponse = $aiResponseOrError;

        if (!$aiResponse->getCharts()) {
            $details = $this->stravaImportService->importUserActivityDetails($id, $entityManager);
            $this->geminiClient->initActivity($details, $this->activityRepository->getAthletePerformanceData($this->userId));

            $chartDescription = $this->geminiClient->getChartsDescription();

            $aiResponse->setCharts($chartDescription);

            $entityManager->flush();
        }

        return $this->json(
            trim(str_replace(["\n", "\r"], ' ', $aiResponse->getCharts() ?? ''))
        );
    }

    #[Route('/api/activities/{id}/splits', methods: ['GET'])]
    public function getActivitySplits(int $id, EntityManagerInterface $entityManager): Response
    {
        if (null === $this->userId) {
            return $this->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
        $aiResponseOrError = $this->getOrCreateAiResponse($entityManager, $id);
        if ($aiResponseOrError instanceof JsonResponse) {
            return $aiResponseOrError;
        }
        $aiResponse = $aiResponseOrError;

        if (!$aiResponse->getSplits()) {
            $details = $this->stravaImportService->importUserActivityDetails($id, $entityManager);
            $this->geminiClient->initActivity($details, $this->activityRepository->getAthletePerformanceData($this->userId));

            $splitDescription = $this->geminiClient->getSplitDescription();

            $aiResponse->setSplits($splitDescription);

            $entityManager->flush();
        }

        return $this->json(
            trim(str_replace(["\n", "\r"], ' ', $aiResponse->getSplits() ?? ''))
        );
    }
}

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
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;

final class ActivityController extends AbstractController
{
    public function __construct(
        private readonly Security            $security,
        private readonly ActivityRepository  $activityRepository,
        private readonly StravaImportService $stravaImportService,
        private GeminiClient                 $geminiClient,
    )
    {
    }

    #[Route('/activities', name: 'app_activity')]
    public function index(Request $request): Response
    {
        $page = max(1, (int)$request->query->get('page', 1));
        $limit = 25;
        $offset = ($page - 1) * $limit;

        $activities = $this->activityRepository->getActivities(
            $this->security->getUser()->getId(),
            $limit,
            $offset
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
        $this->geminiClient->initActivity($details, $this->activityRepository->getAthletePerformanceData(
            $this->security->getUser()->getId()));

        return $this->render('activity/show.html.twig', [
            'activity' => $details['activity'],
            'activityDetail' => $details['activityDetail'],
            'activityStream' => $details['activityStream'],
        ]);
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
        $activity = $entityManager->getRepository(Activity::class)->find($id);
        if (!$activity) {
            return $this->json(['error' => 'Sorry there is a problem'], Response::HTTP_NOT_FOUND);
        }

        $AIresponse = $entityManager->getRepository(AIresponse::class)->findOneBy(['activity' => $activity]);

        if ($AIresponse !== null && $AIresponse->getOverview() !== null) {
            return $this->json(
                trim(str_replace(["\n", "\r"], ' ', $AIresponse->getOverview()))
            );
        }

        $details = $this->stravaImportService->importUserActivityDetails($id, $entityManager);
        $this->geminiClient->initActivity($details, $this->activityRepository->getAthletePerformanceData(
            $this->security->getUser()->getId()));

        $overviewDescription = $this->geminiClient->getOverviewDescription();

        if ($AIresponse === null) {
            $AIresponse = new AIresponse();
            $AIresponse->setActivity($activity);
            $entityManager->persist($AIresponse);
        }

        $AIresponse->setOverview($overviewDescription);
        $entityManager->flush();

        return $this->json(
            trim(str_replace(["\n", "\r"], ' ', $overviewDescription))
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
    #[Route('/api/activities/{id}/charts', methods: ['GET'])]
    public function getActivityCharts(int $id, EntityManagerInterface $entityManager): Response
    {
        $activity = $entityManager->getRepository(Activity::class)->find($id);
        if (!$activity) {
            return $this->json(['error' => 'Sorry there is a problem'], Response::HTTP_NOT_FOUND);
        }

        $AIresponse = $entityManager->getRepository(AIresponse::class)->findOneBy(['activity' => $activity]);

        if ($AIresponse !== null && $AIresponse->getCharts() !== null) {
            return $this->json(
                trim(str_replace(["\n", "\r"], ' ', $AIresponse->getCharts()))
            );
        }

        $details = $this->stravaImportService->importUserActivityDetails($id, $entityManager);
        $this->geminiClient->initActivity($details, $this->activityRepository->getAthletePerformanceData(
            $this->security->getUser()->getId()));

        $chartsDescription = $this->geminiClient->getChartsDescription();

        if ($AIresponse === null) {
            $AIresponse = new AIresponse();
            $AIresponse->setActivity($activity);
            $entityManager->persist($AIresponse);
        }

        $AIresponse->setCharts($chartsDescription);
        $entityManager->flush();

        return $this->json(
            trim(str_replace(["\n", "\r"], ' ', $chartsDescription))
        );
    }

    /**
     * @throws TransportExceptionInterface
     * @throws ClientExceptionInterface
     */
    #[Route('/api/activities/{id}/splits', methods: ['GET'])]
    public function getActivitySplits(int $id, EntityManagerInterface $entityManager): Response
    {
        $activity = $entityManager->getRepository(Activity::class)->find($id);
        if (!$activity) {
            return $this->json(['error' => 'Sorry there is a problem'], Response::HTTP_NOT_FOUND);
        }

        $AIresponse = $entityManager->getRepository(AIresponse::class)->findOneBy(['activity' => $activity]);

        if ($AIresponse !== null && $AIresponse->getSplits() !== null) {
            return $this->json(
                trim(str_replace(["\n", "\r"], ' ', $AIresponse->getSplits()))
            );
        }

        $details = $this->stravaImportService->importUserActivityDetails($id, $entityManager);
        $this->geminiClient->initActivity($details, $this->activityRepository->getAthletePerformanceData(
            $this->security->getUser()->getId()));

        $splitsDescription = $this->geminiClient->getSplitDescription();

        if ($AIresponse === null) {
            $AIresponse = new AIresponse();
            $AIresponse->setActivity($activity);
            $entityManager->persist($AIresponse);
        }

        $AIresponse->setSplits($splitsDescription);
        $entityManager->flush();

        return $this->json(
            trim(str_replace(["\n", "\r"], ' ', $splitsDescription))
        );
    }
}

<?php

namespace App\Controller;

use App\Repository\ActivityRepository;
use App\Service\StravaImportService;
use App\Strava\Client\Strava;
use GuzzleHttp\Exception\GuzzleException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class DashboardController extends AbstractController
{
    public function __construct(
        private readonly Strava              $client,
        private readonly Security            $security,
        private readonly ActivityRepository  $activityRepository,
        private readonly StravaImportService $stravaImportService,
    )
    {
    }

    /**
     * @throws GuzzleException
     */
    #[IsGranted('IS_AUTHENTICATED')]
    #[Route('/dashboard', name: 'app_dashboard')]
    public function index(): Response
    {
        $user = $this->security->getUser();
        $userId = $user?->getId();

        $this->activityRepository->setUserId($userId);

        $activityDifference = $this->activityRepository->getActivityDifferenceFromLastMonth();
        $activities = $this->activityRepository->getActivities(7);
        $records = $this->activityRepository->getActivityRecords();
        $hearthRatePercentage = $this->activityRepository->getHeartRateZoneDistribution();
        $fitnessTrend = $this->activityRepository->getWeeklyFitnessData();
        $achievements = $this->activityRepository->getAchievements();
        $weeklyDistance = $this->activityRepository->getWeeklyDistance();
        $activityCountBySport = $this->activityRepository->getActivityCountBySport();
        $stats = $this->activityRepository->getActivityStats();
        $userSports = $this->activityRepository->getAthleteSports();

        return $this->render('dashboard/index.html.twig',
            [
                'activityDifference' => $activityDifference,
                'activities' => $activities, 'records' => $records,
                'hearthRatePercentage' => $hearthRatePercentage,
                'fitnessTrend' => $fitnessTrend,
                'achievements' => $achievements,
                'weeklyDistance' => $weeklyDistance,
                'activityCountBySport' => $activityCountBySport,
                'stats' => $stats,
                'userSports' => $userSports,
            ]);
    }

    #[Route('/initialize', name: 'app_initialize')]
    public function initialize(): Response
    {
        return $this->render('dashboard/initialize.html.twig');
    }

    #[Route('/api/activities/sync', name: 'app_synchronize')]
    public function synchronize(Request $request): Response
    {
        $accessToken = $request->getSession()->get('access_token');

        $user = $this->stravaImportService->importUserData($accessToken);

        $this->security->login($user);

        return $this->json(
            [
                'status' => 'success',
            ]
        );
    }

    #[Route('/logout', name: 'app_logout')]
    public function logout(): Response
    {
        $this->client->logout();
        $this->security->logout();

        return $this->redirectToRoute('app_home');
    }
}

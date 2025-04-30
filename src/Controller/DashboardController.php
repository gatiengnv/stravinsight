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

final class DashboardController extends AbstractController
{
    public function __construct(
        private readonly Strava $client,
        private readonly Security $security,
        private readonly ActivityRepository $activityRepository,
        private readonly StravaImportService $stravaImportService,
    ) {
    }

    /**
     * @throws GuzzleException
     */
    #[Route('/dashboard', name: 'app_dashboard')]
    public function index(): Response
    {
        $activityDifference = $this->activityRepository->getActivityDifferenceFromLastMonth($this->security->getUser()->getId());
        $activity = $this->activityRepository->getActivities($this->security->getUser()->getId());
        $records = $this->activityRepository->getActivityRecords($this->security->getUser()->getId());
        $hearthRatePercentage = $this->activityRepository->getHeartRateZoneDistribution($this->security->getUser()->getId());
        $fitnessTrend = $this->activityRepository->getWeeklyFitnessData($this->security->getUser()->getId(), 10);
        $achievements = $this->activityRepository->getAchievements($this->security->getUser()->getId());
        $weeklyDistance = $this->activityRepository->getWeeklyDistance($this->security->getUser()->getId());
        $activityCountBySport = $this->activityRepository->getActivityCountBySport($this->security->getUser()->getId());
        $stats = $this->activityRepository->getActivityStats($this->security->getUser()->getId());

        return $this->render('dashboard/index.html.twig',
            [
                'activityDifference' => $activityDifference,
                'activities' => $activity, 'records' => $records,
                'hearthRatePercentage' => $hearthRatePercentage,
                'fitnessTrend' => $fitnessTrend,
                'achievements' => $achievements,
                'weeklyDistance' => $weeklyDistance,
                'activityCountBySport' => $activityCountBySport,
                'stats' => $stats,
            ]);
    }

    #[Route('/initialize', name: 'app_initialize')]
    public function initialize(Request $request): Response
    {
        $accessToken = $request->getSession()->get('access_token');

        $user = $this->stravaImportService->importUserData($accessToken);

        $this->security->login($user);

        return $this->redirectToRoute('app_dashboard');
    }

    #[Route('/logout', name: 'app_logout')]
    public function logout(): Response
    {
        $this->client->logout();
        $this->security->logout();

        return $this->redirectToRoute('app_home');
    }
}

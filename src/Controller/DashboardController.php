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
        private readonly Strava $client,
        private readonly Security $security,
        private readonly ActivityRepository $activityRepository,
        private readonly StravaImportService $stravaImportService,
    ) {
    }

    /**
     * @throws GuzzleException
     */
    #[IsGranted('IS_AUTHENTICATED')]
    #[Route('/dashboard', name: 'app_dashboard')]
    public function index(): Response
    {
        $activityDifference = $this->activityRepository->getActivityDifferenceFromLastMonth($this->getUserId());
        $activities = $this->activityRepository->getActivities($this->getUserId(), 7);
        $records = $this->activityRepository->getActivityRecords($this->getUserId());
        $hearthRatePercentage = $this->activityRepository->getHeartRateZoneDistribution($this->getUserId());
        $fitnessTrend = $this->activityRepository->getWeeklyFitnessData($this->getUserId());
        $achievements = $this->activityRepository->getAchievements($this->getUserId());
        $weeklyDistance = $this->activityRepository->getWeeklyDistance($this->getUserId());
        $activityCountBySport = $this->activityRepository->getActivityCountBySport($this->getUserId());
        $stats = $this->activityRepository->getActivityStats($this->getUserId());
        $userSports = $this->activityRepository->getAthleteSports($this->getUserId());

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

    private function getUserId(): ?int
    {
        return $this->security->getUser()?->getId();
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
        $this->security->logout(false);

        return $this->redirectToRoute('app_home');
    }
}

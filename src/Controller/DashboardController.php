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
    private ?int $userId = null;

    public function __construct(
        private readonly Strava $client,
        private readonly Security $security,
        private readonly ActivityRepository $activityRepository,
        private readonly StravaImportService $stravaImportService,
    ) {
        $user = $this->security->getUser();
        if ($user) {
            $this->userId = $user->getId();
        }
    }

    /**
     * @throws GuzzleException
     */
    #[IsGranted('IS_AUTHENTICATED')]
    #[Route('/dashboard', name: 'app_dashboard')]
    public function index(): Response
    {
        if (null === $this->userId) {
            $this->userId = $this->security->getUser()?->getId();
        }

        $activityDifference = $this->activityRepository->getActivityDifferenceFromLastMonth($this->userId);
        $activities = $this->activityRepository->getActivities($this->userId, 7);
        $records = $this->activityRepository->getActivityRecords($this->userId);
        $hearthRatePercentage = $this->activityRepository->getHeartRateZoneDistribution($this->userId);
        $fitnessTrend = $this->activityRepository->getWeeklyFitnessData($this->userId);
        $achievements = $this->activityRepository->getAchievements($this->userId);
        $weeklyDistance = $this->activityRepository->getWeeklyDistance($this->userId);
        $activityCountBySport = $this->activityRepository->getActivityCountBySport($this->userId);
        $stats = $this->activityRepository->getActivityStats($this->userId);
        $userSports = $this->activityRepository->getAthleteSports($this->userId);

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
        if ($user) {
            $this->userId = $user->getId();
        }

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
        $this->userId = null;

        return $this->redirectToRoute('app_home');
    }
}

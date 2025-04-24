<?php

namespace App\Controller;

use App\Entity\Activity;
use App\Entity\HearthRateZones;
use App\Entity\User;
use App\Repository\ActivityRepository;
use App\Strava\Client\Strava;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use GuzzleHttp\Exception\GuzzleException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class DashboardController extends AbstractController
{
    public function __construct(private readonly Strava $client, private readonly Security $security, private ActivityRepository $activityRepository)
    {
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

        return $this->render('dashboard/index.html.twig',
            [
                'activityDifference' => $activityDifference,
                'activities' => $activity, 'records' => $records,
                'hearthRatePercentage' => $hearthRatePercentage,
                'fitnessTrend' => $fitnessTrend,
                'achievements' => $achievements,
            ]);
    }

    #[Route('/initialize', name: 'app_initialize')]
    public function initialize(Request $request, EntityManagerInterface $entityManager): Response
    {
        $accessToken = $request->getSession()->get('access_token');
        $this->client->setAccessToken($accessToken);
        $userInfo = $this->client->getUserInfo();

        // check if user already exists
        $user = $entityManager->getRepository(User::class)->findOneBy(['stravaId' => $userInfo['id']]);

        // if user doesn't exist, add the user
        if (!$user) {
            $user = new User();
            $user->setStravaId($userInfo['id']);
            $user->setUsername($userInfo['username']);
            $user->setFirstname($userInfo['firstname']);
            $user->setLastname($userInfo['lastname']);
            $user->setBio($userInfo['bio']);
            $user->setCity($userInfo['city']);
            $user->setState($userInfo['state']);
            $user->setCountry($userInfo['country']);
            $user->setSex($userInfo['sex']);
            $user->setPremium($userInfo['premium']);
            $user->setSummit($userInfo['summit']);
            $user->setCreatedAt(new DateTime($userInfo['created_at']));
            $user->setUpdatedAt(new DateTime($userInfo['updated_at']));
            $user->setBadgeTypeId($userInfo['badge_type_id']);
            $user->setWeight($userInfo['weight']);
            $user->setProfileMedium($userInfo['profile_medium']);
            $user->setProfile($userInfo['profile']);

            $entityManager->persist($user);
            $entityManager->flush();
        }

        // add/update activities in database
        $activities = $this->client->getAllActivities();
        foreach ($activities as $activityData) {
            $existingActivity = $entityManager->getRepository(Activity::class)
                ->findOneBy(['id' => $activityData['id']]);

            if ($existingActivity) {
                continue;
            }

            $activity = new Activity();
            $activity->setStravaUser($user);
            $activity->setId($activityData['id']);
            $activity->setGearId($activityData['gear_id'] ?? null);
            $activity->setName($activityData['name'] ?? null);
            $activity->setType($activityData['type'] ?? null);
            $activity->setSportType($activityData['sport_type'] ?? null);
            $activity->setWorkoutType(isset($activityData['workout_type']) ? (int)$activityData['workout_type'] : null);
            $activity->setStartDate(!empty($activityData['start_date']) ? new DateTime($activityData['start_date']) : null);
            $activity->setStartDateLocal(!empty($activityData['start_date_local']) ? new DateTime($activityData['start_date_local']) : null);
            $activity->setTimezone($activityData['timezone'] ?? null);
            $activity->setUtcOffset($activityData['utc_offset'] ?? null);
            $activity->setMovingTime($activityData['moving_time'] ?? null);
            $activity->setElapsedTime($activityData['elapsed_time'] ?? null);
            $activity->setDistance($activityData['distance'] ?? null);
            $activity->setTotalElevationGain($activityData['total_elevation_gain'] ?? null);
            $activity->setAverageSpeed($activityData['average_speed'] ?? null);
            $activity->setMaxSpeed($activityData['max_speed'] ?? null);
            $activity->setAverageWatts($activityData['average_watts'] ?? null);
            $activity->setWeightedAverageWatts($activityData['weighted_average_watts'] ?? null);
            $activity->setMaxWatts($activityData['max_watts'] ?? null);
            $activity->setDeviceWatts($activityData['device_watts'] ?? null);
            $activity->setKilojoules($activityData['kilojoules'] ?? null);
            $activity->setHasHeartrate($activityData['has_heartrate'] ?? null);
            $activity->setAverageHeartrate($activityData['average_heartrate'] ?? null);
            $activity->setMaxHeartrate($activityData['max_heartrate'] ?? null);
            $activity->setSufferScore($activityData['suffer_score'] ?? null);
            $activity->setAverageCadence($activityData['average_cadence'] ?? null);
            $activity->setStartLatlng($activityData['start_latlng'] ?? null);
            $activity->setEndLatlng($activityData['end_latlng'] ?? null);
            $activity->setLocationCity($activityData['location_city'] ?? null);
            $activity->setLocationState($activityData['location_state'] ?? null);
            $activity->setLocationCountry($activityData['location_country'] ?? null);
            $activity->setMapId($activityData['map']['id'] ?? null);
            $activity->setSummaryPolyline($activityData['map']['summary_polyline'] ?? null);
            $activity->setAchievementCount($activityData['achievement_count'] ?? null);
            $activity->setKudosCount($activityData['kudos_count'] ?? null);
            $activity->setCommentCount($activityData['comment_count'] ?? null);
            $activity->setAthleteCount($activityData['athlete_count'] ?? null);
            $activity->setPhotoCount($activityData['photo_count'] ?? null);
            $activity->setTotalPhotoCount($activityData['total_photo_count'] ?? null);
            $activity->setPrCount($activityData['pr_count'] ?? null);
            $activity->setHasKudoed($activityData['has_kudoed'] ?? null);
            $activity->setTrainer($activityData['trainer'] ?? null);
            $activity->setCommute($activityData['commute'] ?? null);
            $activity->setManual($activityData['manual'] ?? null);
            $activity->setPrivate($activityData['private'] ?? null);
            $activity->setFlagged($activityData['flagged'] ?? null);
            $activity->setFromAcceptedTag($activityData['from_accepted_tag'] ?? null);
            $activity->setResourceState($activityData['resource_state'] ?? null);
            $activity->setExternalId($activityData['external_id'] ?? null);
            $activity->setUploadId(isset($activityData['upload_id']) ? (string)$activityData['upload_id'] : null);
            $user->addActivity($activity);
            $entityManager->persist($activity);
        }

        $entityManager->flush();

        // add/update athlete zones in database
        $existingAthleteZones = $entityManager->getRepository(HearthRateZones::class)
            ->findOneBy(['stravaUser' => $user]);
        if (!$existingAthleteZones) {
            $athleteZonesData = $this->client->getAthleteZones();
            $athleteZones = new HearthRateZones();
            $athleteZones->setStravaUser($user);
            $athleteZones->setZone1($athleteZonesData['heart_rate']['zones'][0]);
            $athleteZones->setZone2($athleteZonesData['heart_rate']['zones'][1]);
            $athleteZones->setZone3($athleteZonesData['heart_rate']['zones'][2]);
            $athleteZones->setZone4($athleteZonesData['heart_rate']['zones'][3]);
            $athleteZones->setZone5($athleteZonesData['heart_rate']['zones'][4]);

            $entityManager->persist($athleteZones);
            $entityManager->flush();
        }

        // login with the user
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

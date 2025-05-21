<?php

namespace App\Service;

use App\Entity\Activity;
use App\Entity\ActivityDetails;
use App\Entity\ActivityStream;
use App\Entity\HearthRateZones;
use App\Entity\User;
use App\Repository\ActivityDetailsRepository;
use App\Repository\ActivityRepository;
use App\Repository\ActivityStreamRepository;
use App\Strava\Client\Strava;
use Doctrine\ORM\EntityManagerInterface;

class StravaImportService
{
    public function __construct(
        private readonly Strava $client,
        private readonly EntityManagerInterface $entityManager,
        private readonly ActivityRepository $activityRepository,
        private readonly ActivityStreamRepository $activityStreamRepository,
        private readonly ActivityDetailsRepository $activityDetailsRepository,
    ) {
    }

    public function importUserData(string $accessToken): User
    {
        $this->client->setAccessToken($accessToken);
        $userInfo = $this->client->getUserInfo();

        $user = $this->findOrCreateUser($userInfo);
        $this->activityRepository->setUserId($user->getId());

        $this->importUserActivities($user);

        $this->importHeartRateZones($user);

        return $user;
    }

    private function findOrCreateUser(array $userInfo): User
    {
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['stravaId' => $userInfo['id']]);

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
            $user->setCreatedAt(new \DateTime($userInfo['created_at']));
            $user->setUpdatedAt(new \DateTime($userInfo['updated_at']));
            $user->setBadgeTypeId($userInfo['badge_type_id']);
            $user->setWeight($userInfo['weight']);
            $user->setProfileMedium($userInfo['profile_medium']);
            $user->setProfile($userInfo['profile']);

            $this->entityManager->persist($user);
            $this->entityManager->flush();
        }

        return $user;
    }

    private function importUserActivities(User $user): void
    {
        $pagesNumber = 1;
        $activities = $this->client->getAllActivities($pagesNumber);
        $activitiesCount = count($activities);

        while ($activitiesCount > 0) {
            foreach ($activities as $activityData) {
                $this->processActivity($user, (array) $activityData);
            }
            ++$pagesNumber;
            $activities = $this->client->getAllActivities($pagesNumber);
            $activitiesCount = count($activities);
        }

        $this->entityManager->flush();
    }

    private function processActivity(User $user, array $activityData): void
    {
        $existingActivity = $this->entityManager->getRepository(Activity::class)
            ->findOneBy(['id' => $activityData['id']]);

        if ($existingActivity) {
            return;
        }

        $activity = new Activity();
        $activity->setStravaUser($user);
        $activity->setId($activityData['id']);
        $activity->setGearId($activityData['gear_id'] ?? null);
        $activity->setName($activityData['name'] ?? null);
        $activity->setType($activityData['type'] ?? null);
        $activity->setSportType($activityData['sport_type'] ?? null);
        $activity->setWorkoutType(isset($activityData['workout_type']) ? (int) $activityData['workout_type'] : null);
        $activity->setStartDate(!empty($activityData['start_date']) ? new \DateTime($activityData['start_date']) : null);
        $activity->setStartDateLocal(!empty($activityData['start_date_local']) ? new \DateTime($activityData['start_date_local']) : null);
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
        $activity->setUploadId(isset($activityData['upload_id']) ? (string) $activityData['upload_id'] : null);

        $user->addActivity($activity);
        $this->entityManager->persist($activity);
    }

    private function importHeartRateZones(User $user): void
    {
        $existingAthleteZones = $this->entityManager->getRepository(HearthRateZones::class)
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

            $this->entityManager->persist($athleteZones);
            $this->entityManager->flush();
        }
    }

    public function importUserActivityDetails($id, $entityManager): array
    {
        // retrieve the activity details
        $activityDetail = $this->findOrCreateActivityDetails($id, $entityManager);

        // retrieve the activity
        $activity = $this->activityRepository->getActivity($id);

        // retrieve the activity stream
        $activityStream = $this->findOrCreateActivityStreams($entityManager, $id);

        return [
            'activity' => $activity,
            'activityDetail' => $activityDetail,
            'activityStream' => $activityStream,
        ];
    }

    public function findOrCreateActivityDetails($id, $entityManager): ?array
    {
        // check if details already exist
        $activityDetail = $this->activityDetailsRepository->getActivityDetails($id);
        // if the activity doesn't exist
        if (!$activityDetail) {
            $activityEntity = $entityManager->getRepository(Activity::class)->find($id);
            $detailsData = $this->client->getActivityDetails($id);
            $details = new ActivityDetails();
            $details->setActivity($activityEntity);
            $details->setMapPolyline($detailsData['map']['polyline'] ?? null);
            $details->setVisibility($detailsData['visibility'] ?? null);
            $details->setHeartrateOptOut($detailsData['heartrate_opt_out'] ?? null);
            $details->setDisplayHideHeartrateOption($detailsData['display_hide_heartrate_option'] ?? null);
            $details->setElevationHigh($detailsData['elev_high'] ?? null);
            $details->setElevationLow($detailsData['elev_low'] ?? null);
            $details->setUploadIdStr($detailsData['upload_id_str'] ?? null);
            $details->setDescription($detailsData['description'] ?? null);
            $details->setCalories($detailsData['calories'] ?? null);
            $details->setPerceivedExertion($detailsData['perceived_exertion'] ?? null);
            $details->setPreferPerceivedExertion($detailsData['prefer_perceived_exertion'] ?? null);
            $details->setSegmentEfforts($detailsData['segment_efforts'] ?? null);
            $details->setSplitsMetric($detailsData['splits_metric'] ?? null);
            $details->setSplitsStandard($detailsData['splits_standard'] ?? null);
            $details->setLaps($detailsData['laps'] ?? null);
            $details->setBestEfforts($detailsData['best_efforts'] ?? null);
            $details->setGearDetails($detailsData['gear'] ?? null);
            $details->setPhotosDetails($detailsData['photos'] ?? null);
            $details->setStatsVisibility($detailsData['stats_visibility'] ?? null);
            $details->setHideFromHome($detailsData['hide_from_home'] ?? null);
            $details->setDeviceName($detailsData['device_name'] ?? null);
            $details->setEmbedToken($detailsData['embed_token'] ?? null);
            $details->setSimilarActivities($detailsData['similar_activities'] ?? null);
            $details->setAvailableZones($detailsData['available_zones'] ?? null);

            $entityManager->persist($details);
            $entityManager->flush();

            $activityDetail = $this->activityDetailsRepository->getActivityDetails($id);
        }

        return $activityDetail;
    }

    public function findOrCreateActivityStreams($entityManager, $id): ?array
    {
        $activityStream = $this->activityStreamRepository->getActivityStreams($id);

        // if the streams don't exist
        if (!$activityStream) {
            $activityEntity = $entityManager->getRepository(Activity::class)->find($id);
            $streamsData = $this->client->getActivityStreams($id);
            $stream = new ActivityStream();
            $stream->setActivity($activityEntity);
            $stream->setLatlngData($streamsData['latlng']['data'] ?? null);
            $stream->setVelocityData($streamsData['velocity_smooth']['data'] ?? ($streamsData['velocity']['data'] ?? null));
            $stream->setGradeData($streamsData['grade_smooth']['data'] ?? ($streamsData['grade']['data'] ?? null));
            $stream->setCadenceData($streamsData['cadence']['data'] ?? null);
            $stream->setDistanceData($streamsData['distance']['data'] ?? null);
            $stream->setAltitudeData($streamsData['altitude']['data'] ?? null);
            $stream->setHeartrateData($streamsData['heartrate']['data'] ?? null);
            $stream->setTimeData($streamsData['time']['data'] ?? null);

            $firstStreamKey = array_key_first($streamsData);
            if (null !== $firstStreamKey && isset($streamsData[$firstStreamKey])) {
                $stream->setOriginalSize($streamsData[$firstStreamKey]['original_size'] ?? null);
                $stream->setResolution($streamsData[$firstStreamKey]['resolution'] ?? null);
            }

            $entityManager->persist($stream);
            $entityManager->flush();

            $activityStream = $this->activityStreamRepository->getActivityStreams($id);
        }

        return $activityStream;
    }
}

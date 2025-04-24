<?php

namespace App\Controller;

use App\Entity\Activity;
use App\Entity\ActivityDetails;
use App\Entity\ActivityStream;
use App\Repository\ActivityDetailsRepository;
use App\Repository\ActivityRepository;
use App\Repository\ActivityStreamRepository;
use App\Strava\Client\Strava;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ActivityController extends AbstractController
{
    public function __construct(private readonly Strava $client, private readonly Security $security, private readonly ActivityRepository $activityRepository, private readonly ActivityDetailsRepository $activityDetailsRepository, private readonly ActivityStreamRepository $activityStreamRepository)
    {
    }

    #[Route('/activities', name: 'app_activity')]
    public function index(): Response
    {
        $activities = $this->activityRepository->getActivities($this->security->getUser()->getId(), 200);

        return $this->render('activity/index.html.twig', [
            'activities' => $activities,
        ]);
    }

    #[Route('/activities/{id}', requirements: ['id' => '\d+'])]
    public function show(
        int                    $id,
        EntityManagerInterface $entityManager,
    ): Response
    {
        // retrieve the activity
        $activity = $this->activityRepository->getActivity($id);

        // check if details already exist
        $activityDetail = $this->activityDetailsRepository->getActivityDetails($id);

        // check if streams already exist
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

        return $this->render('activity/show.html.twig', [
            'activity' => $activity,
            'activityDetail' => $activityDetail,
            'activityStream' => $activityStream
        ]);
    }
}

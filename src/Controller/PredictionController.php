<?php

namespace App\Controller;

use App\Repository\ActivityRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class PredictionController extends AbstractController
{
    public function __construct(
        private readonly ActivityRepository $activityRepository,
        private readonly Security $security,
    ) {
    }

    #[Route('/predict', name: 'app_prediction')]
    public function index(): Response
    {
        $hearthRatePercentage = $this->activityRepository->getHeartRateZoneDistribution($this->security->getUser()->getId());

        return $this->render('prediction/index.html.twig', [
            'heartRateZone' => array_column($hearthRatePercentage, 'minmax'),
        ]);
    }

    #[Route('/api/similar-activities/{distance}', name: 'app_prediction_activities')]
    public function getSimilarActivities(float $distance): Response
    {
        $activities = $this->activityRepository->getSimilarActivities($this->security->getUser()->getId(), $distance);

        return $this->json([
            'activities' => $activities,
        ]);
    }
}

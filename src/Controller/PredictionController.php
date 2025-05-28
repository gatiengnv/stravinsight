<?php

namespace App\Controller;

use App\Repository\ActivityRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('IS_AUTHENTICATED')]
final class PredictionController extends AbstractController
{
    public function __construct(
        private readonly ActivityRepository $activityRepository,
        private readonly Security           $security,
    )
    {
        $this->activityRepository->setUserId($security->getUser()->getId());
    }

    #[Route('/predict', name: 'app_prediction')]
    public function index(Security $security): Response
    {
        $hearthRatePercentage = $this->activityRepository->getHeartRateZoneDistribution();

        return $this->render('prediction/index.html.twig', [
            'heartRateZone' => array_column($hearthRatePercentage, 'minmax'),
        ]);
    }

    #[Route('/api/similar-activities/{distance}', name: 'app_prediction_activities')]
    public function getSimilarActivities(float $distance): Response
    {
        $activities = $this->activityRepository->getSimilarActivities($distance);

        return $this->json([
            'activities' => $activities,
        ]);
    }
}

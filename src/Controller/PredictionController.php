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
        private readonly Security $security,
    ) {
    }

    #[Route('/predict', name: 'app_prediction')]
    public function index(): Response
    {
        if (null === $this->getUserId()) {
            return $this->redirectToRoute('app_login');
        }
        $hearthRatePercentage = $this->activityRepository->getHeartRateZoneDistribution($this->getUserId());

        return $this->render('prediction/index.html.twig', [
            'heartRateZone' => array_column($hearthRatePercentage, 'minmax'),
        ]);
    }

    private function getUserId(): ?int
    {
        return $this->security->getUser()?->getId();
    }

    #[Route('/api/all-activities', name: 'app_prediction_all_activities')]
    public function getAllActivities(): Response
    {
        if (null === $this->getUserId()) {
            return $this->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
        $activities = $this->activityRepository->getActivities($this->getUserId(), 500);

        return $this->json([
            'activities' => $activities,
        ]);
    }

    #[Route('/api/similar-activities/{distance}', name: 'app_prediction_activities')]
    public function getSimilarActivities(float $distance): Response
    {
        if (null === $this->getUserId()) {
            return $this->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
        $activities = $this->activityRepository->getSimilarActivities($this->getUserId(), $distance);

        return $this->json([
            'activities' => $activities,
        ]);
    }
}

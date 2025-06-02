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
    private ?int $userId = null;

    public function __construct(
        private readonly ActivityRepository $activityRepository,
        private readonly Security $security,
    ) {
        $user = $this->security->getUser();
        if ($user) {
            $this->userId = $user->getId();
        }
    }

    #[Route('/predict', name: 'app_prediction')]
    public function index(): Response
    {
        if (null === $this->userId) {
            return $this->redirectToRoute('app_login');
        }
        $hearthRatePercentage = $this->activityRepository->getHeartRateZoneDistribution($this->userId);

        return $this->render('prediction/index.html.twig', [
            'heartRateZone' => array_column($hearthRatePercentage, 'minmax'),
        ]);
    }

    #[Route('/api/all-activities', name: 'app_prediction_all_activities')]
    public function getAllActivities(): Response
    {
        if (null === $this->userId) {
            return $this->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
        $activities = $this->activityRepository->getActivities($this->userId, 500);

        return $this->json([
            'activities' => $activities,
        ]);
    }

    #[Route('/api/similar-activities/{distance}', name: 'app_prediction_activities')]
    public function getSimilarActivities(float $distance): Response
    {
        if (null === $this->userId) {
            return $this->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }
        $activities = $this->activityRepository->getSimilarActivities($this->userId, $distance);

        return $this->json([
            'activities' => $activities,
        ]);
    }
}

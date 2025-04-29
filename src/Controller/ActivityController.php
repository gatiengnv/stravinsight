<?php

namespace App\Controller;

use App\Repository\ActivityRepository;
use App\Service\StravaImportService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ActivityController extends AbstractController
{
    public function __construct(
        private readonly Security $security,
        private readonly ActivityRepository $activityRepository,
        private readonly StravaImportService $stravaImportService,
    ) {
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
        int $id,
        EntityManagerInterface $entityManager,
    ): Response {
        $details = $this->stravaImportService->importUserActivityDetails($id, $entityManager);

        return $this->render('activity/show.html.twig', [
            'activity' => $details['activity'],
            'activityDetail' => $details['activityDetail'],
            'activityStream' => $details['activityStream'],
        ]);
    }
}

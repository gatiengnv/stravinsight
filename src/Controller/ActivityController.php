<?php

namespace App\Controller;

use App\Repository\ActivityRepository;
use App\Service\StravaImportService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
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
    public function index(Request $request): Response
    {
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = 25;
        $offset = ($page - 1) * $limit;

        $activities = $this->activityRepository->getActivities(
            $this->security->getUser()->getId(),
            $limit,
            $offset
        );

        if ($request->isXmlHttpRequest()) {
            return $this->json([
                'activities' => $activities,
                'hasMore' => count($activities) == $limit,
                'nextPage' => $page + 1,
            ]);
        }

        return $this->render('activity/index.html.twig', [
            'activities' => $activities,
            'currentPage' => $page,
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

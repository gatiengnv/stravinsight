<?php

namespace App\Controller;

use App\Repository\ActivityRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ActivityController extends AbstractController
{
    public function __construct(private readonly Security $security, private readonly ActivityRepository $activityRepository)
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

    #[Route('/activity/{id}', requirements: ['id' => '\d+'])]
    public function show(
        int $id,
    ): Response
    {
        $activity = $this->activityRepository->getActivity($id);
        return $this->render('activity/show.html.twig', [
            'activity' => $activity
        ]);
    }
}

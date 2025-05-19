<?php

namespace App\Controller;

use App\Repository\ActivityRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('IS_AUTHENTICATED')]
final class HeatmapController extends AbstractController
{
    public function __construct(
        private readonly Security           $security,
        private readonly ActivityRepository $activityRepository,
    )
    {
    }

    #[Route('/heatmap', name: 'app_heatmap')]
    public function index(): Response
    {
        $activities = $this->activityRepository->getActivities($this->security->getUser()->getId(), PHP_INT_MAX);

        return $this->render('heatmap/index.html.twig', [
            'activities' => $activities,
        ]);
    }
}

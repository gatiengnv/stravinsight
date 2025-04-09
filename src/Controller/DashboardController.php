<?php

namespace App\Controller;

use App\Strava\StravaUser;
use GuzzleHttp\Exception\GuzzleException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class DashboardController extends AbstractController
{
    /**
     * @throws GuzzleException
     */
    #[Route('/dashboard', name: 'app_dashboard')]
    public function index(Request $request): Response
    {
        $accessToken = $request->getSession()->get('access_token');
        $user = new StravaUser($accessToken);
        dump($user->getAllActivities());
        return $this->render('dashboard/index.html.twig');
    }
}

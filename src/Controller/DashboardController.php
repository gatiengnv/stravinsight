<?php

namespace App\Controller;

use App\Strava\Client\Strava;
use GuzzleHttp\Exception\GuzzleException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class DashboardController extends AbstractController
{
    public function __construct(private Strava $client)
    {
    }

    /**
     * @throws GuzzleException
     */
    #[Route('/dashboard', name: 'app_dashboard')]
    public function index(Request $request): Response
    {
        $accessToken = $request->getSession()->get('access_token');

        $this->client->setAccessToken($accessToken);
        $this->client->getAllActivities();

        return $this->render('dashboard/index.html.twig');
    }
}

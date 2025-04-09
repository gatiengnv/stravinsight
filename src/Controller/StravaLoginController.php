<?php

namespace App\Controller;

use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use KnpU\OAuth2ClientBundle\Client\Provider\StravaClient;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class StravaLoginController extends AbstractController
{
    #[Route('/connect/strava', name: 'connect_strava_start')]
    public function connectAction(ClientRegistry $clientRegistry): RedirectResponse
    {
        return $clientRegistry
            ->getClient('strava')
            ->redirect([
                'read_all,activity:read_all',
            ]);
    }

    #[Route('/connect/strava/check', name: 'connect_strava_check')]
    public function connectCheckAction(Request $request, ClientRegistry $clientRegistry): RedirectResponse
    {
        /** @var StravaClient $client */
        $client = $clientRegistry->getClient('strava');

        try {
            $accessToken = $client->getAccessToken();
            $request->getSession()->set('access_token', $accessToken);
        } catch (IdentityProviderException $e) {
            var_dump($e->getMessage());
            exit;
        }

        return $this->redirectToRoute('app_dashboard');
    }
}

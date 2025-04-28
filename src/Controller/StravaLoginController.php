<?php

namespace App\Controller;

use App\Repository\UserRepository;
use KnpU\OAuth2ClientBundle\Client\ClientRegistry;
use KnpU\OAuth2ClientBundle\Client\Provider\StravaClient;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
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
                'read,read_all,profile:read_all,activity:read,activity:read_all',
            ]);
    }

    #[Route('/connect/strava/check', name: 'connect_strava_check')]
    public function connectCheckAction(Request $request, ClientRegistry $clientRegistry): RedirectResponse
    {
        /** @var StravaClient $client */
        $client = $clientRegistry->getClient('strava');
        try {
            $accessToken = $client->getAccessToken();
            $request->getSession()->set('access_token', $accessToken->getToken());
            $request->getSession()->set('refresh_token', $accessToken->getRefreshToken());
        } catch (IdentityProviderException $e) {
            var_dump($e->getMessage());
            exit;
        }

        return $this->redirectToRoute('app_initialize');
    }

    #[Route('/login/test', name: 'app_login_test')]
    public function loginTest(Security $security, UserRepository $userRepository): RedirectResponse
    {
        $env = getenv('APP_ENV');
        if ($env != 'dev') {
            $this->redirectToRoute('app_home');
        }

        $users = $userRepository->findAll();

        $security->login($users[array_rand($users)]);

        return $this->redirectToRoute('app_dashboard');
    }
}

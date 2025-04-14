<?php

namespace App\Controller;

use App\Entity\User;
use App\Strava\Client\Strava;
use Doctrine\ORM\EntityManagerInterface;
use GuzzleHttp\Exception\GuzzleException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class DashboardController extends AbstractController
{
    public function __construct(private readonly Strava $client, private readonly Security $security)
    {
    }

    /**
     * @throws GuzzleException
     */
    #[Route('/dashboard', name: 'app_dashboard')]
    public function index(Request $request): Response
    {
        return $this->render('dashboard/index.html.twig');
    }

    #[Route('/initialize', name: 'app_initialize')]
    public function initialize(Request $request, EntityManagerInterface $entityManager): Response
    {
        $accessToken = $request->getSession()->get('access_token');
        $this->client->setAccessToken($accessToken);
        $userInfo = $this->client->getUserInfo();

        // check if user already exists
        $user = $entityManager->getRepository(User::class)->findOneBy(['stravaId' => $userInfo['id']]);

        // if user doesn't exist, add the user
        if (!$user) {
            $user = new User();
            $user->setStravaId($userInfo['id']);
            $user->setUsername($userInfo['username']);
            $user->setFirstname($userInfo['firstname']);
            $user->setLastname($userInfo['lastname']);
            $user->setBio($userInfo['bio']);
            $user->setCity($userInfo['city']);
            $user->setState($userInfo['state']);
            $user->setCountry($userInfo['country']);
            $user->setSex($userInfo['sex']);
            $user->setPremium($userInfo['premium']);
            $user->setSummit($userInfo['summit']);
            $user->setCreatedAt(new \DateTime($userInfo['created_at']));
            $user->setUpdatedAt(new \DateTime($userInfo['updated_at']));
            $user->setBadgeTypeId($userInfo['badge_type_id']);
            $user->setWeight($userInfo['weight']);
            $user->setProfileMedium($userInfo['profile_medium']);
            $user->setProfile($userInfo['profile']);

            $entityManager->persist($user);
            $entityManager->flush();
        }

        // login with the user
        $this->security->login($user);

        return $this->redirectToRoute('app_dashboard');
    }
}

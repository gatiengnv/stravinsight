<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(Security $security): Response
    {
        $isLoggedIn = $security->isGranted('IS_AUTHENTICATED_FULLY');

        return $this->render('home/index.html.twig', [
            'isLoggedIn' => $isLoggedIn,
        ]);
    }
}

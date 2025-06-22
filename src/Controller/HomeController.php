<?php

namespace App\Controller;

use Stripe\Exception\ApiErrorException;
use Stripe\Price;
use Stripe\Stripe;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class HomeController extends AbstractController
{
    private string $stripeSecretKey;
    private string $stripePriceId;
    private RequestStack $requestStack;

    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
        $this->stripeSecretKey = $_ENV['STRIPE_SECRET_KEY'];
        $this->stripePriceId = $_ENV['STRIPE_PRICE_ID'];
        Stripe::setApiKey($this->stripeSecretKey);
    }

    #[Route('/', name: 'app_home')]
    public function index(Security $security): Response
    {
        $locale = $this->requestStack->getCurrentRequest()->getLocale();
        $numberFormatter = new \NumberFormatter($locale, \NumberFormatter::CURRENCY);

        $isLoggedIn = $security->isGranted('IS_AUTHENTICATED_FULLY');
        $premiumMode = $_ENV['PREMIUM_MODE'];

        try {
            $price = Price::retrieve($this->stripePriceId);
            $formattedPrice = $numberFormatter->formatCurrency($price->unit_amount / 100, $price->currency);
        } catch (ApiErrorException $e) {
            $formattedPrice = $numberFormatter->formatCurrency(0, 'EUR'); // EUR comme devise par défaut
        }

        return $this->render('home/index.html.twig', [
            'isLoggedIn' => $isLoggedIn,
            'price' => $formattedPrice,
            'premiumMode' => $premiumMode,
        ]);
    }
}

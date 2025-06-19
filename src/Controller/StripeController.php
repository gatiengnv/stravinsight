<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;
use Stripe\Stripe;
use Stripe\Subscription;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('IS_AUTHENTICATED')]
final class StripeController extends AbstractController
{
    private string $stripeSecretKey;
    private string $stripePriceId;
    private string $websiteUrl;

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly Security $security,
    ) {
        $this->stripeSecretKey = $_ENV['STRIPE_SECRET_KEY'];
        $this->stripePriceId = $_ENV['STRIPE_PRICE_ID'];
        $this->websiteUrl = $_ENV['WEBSITE_URL'];
        Stripe::setApiKey($this->stripeSecretKey);
    }

    #[Route('/premium/pay', name: 'app_premium_pay')]
    public function pay(): RedirectResponse
    {
        $user = $this->getCurrentUser();
        try {
            $sessionData = [
                'line_items' => [[
                    'price' => $this->stripePriceId,
                    'quantity' => 1,
                ]],
                'mode' => 'subscription',
                'success_url' => $this->websiteUrl.'/premium/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => $this->websiteUrl.'/',
            ];

            if (!$user->isFreeTrial()) {
                $sessionData['subscription_data'] = [
                    'trial_period_days' => 15,
                ];
            }

            $session = Session::create($sessionData);

            return $this->redirect($session->url);
        } catch (ApiErrorException $e) {
            return $this->redirectToRoute('app_premium');
        }
    }

    #[Route('/premium/success', name: 'app_premium_success')]
    public function success(Request $request): RedirectResponse
    {
        $sessionId = $request->query->get('session_id');
        if (!$sessionId) {
            return $this->redirectToRoute('app_premium');
        }

        try {
            $session = Session::retrieve($sessionId);
            $user = $this->getCurrentUser();

            if (!$user) {
                return $this->redirectToRoute('app_premium');
            }

            if ('paid' === $session->payment_status) {
                $subscription = Subscription::retrieve($session->subscription);
                $user->setStripeSubscriptionId($subscription->id);
                $user->setFreeTrial(true);
                $this->entityManager->flush();

                return $this->redirectToRoute('app_dashboard');
            } else {
                return $this->redirectToRoute('app_premium');
            }
        } catch (ApiErrorException $e) {
            return $this->redirectToRoute('app_premium');
        }
    }

    private function getCurrentUser(): ?User
    {
        $user = $this->security->getUser();
        if (!$user) {
            return null;
        }

        return $this->entityManager->getRepository(User::class)->find($user->getId());
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/premium/cancel', name: 'app_premium_cancel')]
    public function cancel(): RedirectResponse
    {
        $user = $this->getCurrentUser();
        if (!$user || !$user->getStripeSubscriptionId()) {
            return $this->redirectToRoute('app_profile');
        }

        try {
            Subscription::update($user->getStripeSubscriptionId(), [
                'cancel_at_period_end' => true,
            ]);

            return $this->redirectToRoute('app_profile');
        } catch (ApiErrorException $e) {
            return $this->redirectToRoute('app_profile');
        }
    }

    #[IsGranted('ROLE_USER')]
    #[Route('/premium/reactivate', name: 'app_premium_reactivate')]
    public function reactivate(): RedirectResponse
    {
        $user = $this->getCurrentUser();
        if (!$user || !$user->getStripeSubscriptionId()) {
            return $this->redirectToRoute('app_profile');
        }

        try {
            Subscription::update($user->getStripeSubscriptionId(), [
                'cancel_at_period_end' => false,
            ]);

            return $this->redirectToRoute('app_profile');
        } catch (ApiErrorException $e) {
            return $this->redirectToRoute('app_profile');
        }
    }

    #[IsGranted('IS_AUTHENTICATED')]
    #[Route('/profile', name: 'app_profile')]
    public function profile(Request $request): Response
    {
        $user = $this->getCurrentUser();
        if (!$user || !$user->getStripeSubscriptionId()) {
            $route = $request->headers->get('referer') ?? '/';

            return $this->redirect($route);
        }

        try {
            $subscription = Subscription::retrieve($user->getStripeSubscriptionId());

            return $this->render('stripe/index.html.twig', [
                'subscription' => $subscription
            ]);
        } catch (ApiErrorException $e) {
            return $this->redirectToRoute('app_home');
        }
    }
}

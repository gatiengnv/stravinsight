<?php

namespace App\Service;

use Stripe\Stripe;
use Stripe\Subscription;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class SubscriptionCheckerService
{
    public function __construct(
        private readonly Security $security,
        private readonly UrlGeneratorInterface $urlGenerator,
        private readonly string $stripeSecretKey,
    ) {
        Stripe::setApiKey($this->stripeSecretKey);
    }

    public function checkSubscription(): ?RedirectResponse
    {
        $user = $this->security->getUser();
        if (!$user) {
            return new RedirectResponse($this->urlGenerator->generate('app_home'));
        }

        if ('false' == $_ENV['PREMIUM_MODE']) {
            return null;
        }

        if (!$user->getStripeSubscriptionId()) {
            return new RedirectResponse($this->urlGenerator->generate('app_premium_pay'));
        }

        $status = Subscription::retrieve($user->getStripeSubscriptionId())->status;
        if ('active' !== $status) {
            return new RedirectResponse($this->urlGenerator->generate('app_premium_pay'));
        }

        return null;
    }
}

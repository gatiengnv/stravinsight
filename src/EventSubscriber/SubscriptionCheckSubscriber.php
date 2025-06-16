<?php

namespace App\EventSubscriber;

use App\Service\SubscriptionCheckerService;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Http\Attribute\IsGranted;

readonly class SubscriptionCheckSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private SubscriptionCheckerService $subscriptionChecker,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::CONTROLLER => 'onKernelController',
        ];
    }

    /**
     * @throws \ReflectionException
     */
    public function onKernelController(ControllerEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $controller = $event->getController();

        if (!is_array($controller)) {
            return;
        }

        $controllerObject = $controller[0];
        $method = $controller[1];

        $reflectionMethod = new \ReflectionMethod($controllerObject, $method);
        $attributes = $reflectionMethod->getAttributes(IsGranted::class);

        if (empty($attributes)) {
            return;
        }

        $redirect = $this->subscriptionChecker->checkSubscription();
        if ($redirect) {
            $event->setController(function () use ($redirect) {
                return $redirect;
            });
        }
    }
}

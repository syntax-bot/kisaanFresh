"""
ASGI config for kissan_market project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
import bidding.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "kissan_market.settings")

django_asgi_app = get_asgi_application()
from bidding.scheduler import start_scheduler
start_scheduler()
print("Scheduler started...")
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(
            bidding.routing.websocket_urlpatterns
        )
    ),
})

import bidding.routing
print("LOADED WEBSOCKET URLS →", bidding.routing.websocket_urlpatterns)

import os

from channels.routing import ProtocolTypeRouter, URLRouter, ChannelNameRouter
from django.core.asgi import get_asgi_application
from home.routing import websocket_urlpatterns
from home.consumers import AudioConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'texttools.settings')

django_asgi_app = get_asgi_application()


application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        'websocket': URLRouter(websocket_urlpatterns),
        "channel": ChannelNameRouter({
            "audio": AudioConsumer.as_asgi(),
        })
    }
)
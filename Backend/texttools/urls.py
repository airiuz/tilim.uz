from django.contrib import admin
from collections import OrderedDict
from django.urls import re_path, path, include

from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import APIRootView

api_root_dict = OrderedDict()
api_root_dict['auth'] = 'auth-root'
api_root_dict['user'] = 'user-root'
api_root_dict['text'] = 'text-root'
root_view = APIRootView.as_view(api_root_dict=api_root_dict)

urlpatterns = [
    path('process/', include('front.urls')),
    path('admin/', admin.site.urls),
    re_path(r'^$', root_view, name='api-root'),
    path('auth/', include('authuser.urls')),
    path('api/', include('translit.urls')),
    path('', include('home.urls')),

]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

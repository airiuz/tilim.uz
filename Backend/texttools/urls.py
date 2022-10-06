
from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken import views

urlpatterns = [
	path('', include('translit.urls')),
	path('token-auth/', views.obtain_auth_token),
	path('process/', include('front.urls')),
    path('admin/', admin.site.urls),
]
urlpatterns+=static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)


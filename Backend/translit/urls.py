from django.urls import path
from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter
from .api_views import ChangeTextAPIView, DocumentChangeAPIView, TypeFastAPIView
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('', views.index, name='index'),
    path('api/change/', ChangeTextAPIView.as_view()),
    path('api/changefile/', DocumentChangeAPIView.as_view()),
    path('api/typefast/', TypeFastAPIView.as_view()),
]



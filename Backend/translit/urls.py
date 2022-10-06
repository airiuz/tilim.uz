from django.urls import path
from django.urls import path
from .api_views import (
    ChangeTextAPIView, DocumentChangeAPIView, TypeFastAPIView, NameofTopAPIView,
    CreateTextAPIView, SessionUserView, CreateUser
)
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('api/change/', ChangeTextAPIView.as_view()),
    path('api/changefile/', DocumentChangeAPIView.as_view()),
    path('api/typefast/', TypeFastAPIView.as_view()),
    path('api/typefast/', TypeFastAPIView.as_view()),
    path('api/accounted/', NameofTopAPIView.as_view()),
    path('api/createtext/', CreateTextAPIView.as_view()),
    path('api/session/', SessionUserView.as_view()),
    path('api/createuser/', CreateUser.as_view()),
    
]



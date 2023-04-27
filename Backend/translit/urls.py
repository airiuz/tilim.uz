from django.urls import path
from django.urls import path
from .api_views import (
    ChangeTextAPIView, DocumentChangeAPIView, TypeFastAPIView, TopUsersViewSet,
    CreateTextAPIView, SessionUserView, CreateUser, FixWordsViewSet, TypeFastGetTextAPIView
)
from rest_framework.routers import DefaultRouter
from texttools.routers import CustomRouter
from .api_views import TextStatisticViewSet


router = CustomRouter(root_view_name='text-root')
router.register('statistic', TextStatisticViewSet, basename='statistic')
router.register('fix', FixWordsViewSet, basename='fixwords')
router.register("topusers", TopUsersViewSet, basename="topusers"),

urlpatterns = [
                  path('change/', ChangeTextAPIView.as_view()),
                  path('changefile/', DocumentChangeAPIView.as_view()),
                  path('typefast/', TypeFastAPIView.as_view()),
                  path('gettext/', TypeFastGetTextAPIView.as_view()),
                  path('createtext/', CreateTextAPIView.as_view()),
                  path('session/', SessionUserView.as_view()),
                  path('createuser/', CreateUser.as_view()),

              ] + router.urls

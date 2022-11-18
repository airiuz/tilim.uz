from rest_framework import response
from django.contrib.auth import login, logout
from rest_framework.permissions import AllowAny

from .serializers import LoginSerializer, UserSerializer, UserRegisterSerializer
from rest_framework.viewsets import ViewSet
from rest_framework import exceptions
from rest_framework import permissions


class SessionViewSet(ViewSet):
    permission_classes = (AllowAny,)

    def list(self, request):
        if not request.user.is_authenticated:
            raise exceptions.NotAuthenticated()
        serializer = UserSerializer(request.user)
        return response.Response(data=serializer.data)

    def create(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return response.Response(UserSerializer(user).data, status=201)

    def delete(self, request):
        logout(request)
        return response.Response(status=204)

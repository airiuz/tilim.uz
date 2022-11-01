import random

from django.contrib.auth.models import User

import autocorrector
import json
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework import status, generics, permissions
from rest_framework.response import Response
import front.translit_file, front.translit_text
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .serializers import FixWordSerializer
import re
from .utils import GetAddressApiView
from .serializers import MyFileSerializer, MyTextSerializer, MyOutFileSerializer, NameofTopSerializer, \
    TypeFastOutSerializer, TypeFastSerializer, NameofTop, UserOutSerializer, UserSerializer, TextStatisticSerializer
from .models import MyFile, TypeFastModel, TypeFastOutModel, TextLikeUnlike
from rest_framework.parsers import FileUploadParser, MultiPartParser
from translit import type_fast
from rest_framework.viewsets import ViewSet, ModelViewSet


class ChangeTextAPIView(GetAddressApiView):
    @csrf_exempt
    def post(self, request):
        # count ip address
        # ChangeTextAPIView.get_ip(request)

        serializer = MyTextSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        a = serializer.validated_data.get('data')
        t = serializer.validated_data.get('type')
        t = '1' if t in '1' else t == '0'
        incorrect_words = [re.sub(r'[\.\,\:$]', r'', x) for x in a.split(' ') if autocorrector.check(x) == False]
        result = front.translit_text.to_cyrillic(a) if t == '1' else front.translit_text.to_latin(a)
        content = {'text': result, 'incorrect_words': incorrect_words}
        return HttpResponse(json.dumps(content), content_type='application/json')


class FixWordsViewSet(ViewSet):
    permission_classes = (permissions.AllowAny,)

    def create(self, request):
        serializer = FixWordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        word = serializer.validated_data.get('word')
        words = autocorrector.suggestions(word) if autocorrector.check(word) == False else word
        return HttpResponse(json.dumps({'recommended': words}), content_type='application/json')


class DocumentChangeAPIView(GetAddressApiView):
    parser_classes = (MultiPartParser, FileUploadParser)

    def post(self, request):
        # count ip address
        ChangeTextAPIView.get_ip(request)

        serializer = MyFileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        file = MyFile.objects.get(id=serializer.data.get('id'))
        myfile = file.in_file
        t = serializer.validated_data.get('t')

        outfile = front.translit_file.translit_file(t, myfile)
        if isinstance(outfile['out_file'], str):
            return Response(data=outfile['out_file'])
        else:
            serializer = MyOutFileSerializer(data=outfile)
            serializer.is_valid(raise_exception=True)
            return Response(serializer.data)


class TypeFastAPIView(GetAddressApiView):
    def get(self, request):
        # count ip address
        ChangeTextAPIView.get_ip(request)

        ids = [x.id for x in TypeFastModel.objects.all()]
        x = random.choice(ids)
        text_m = TypeFastModel.objects.filter(id=x).first()
        serializer = TypeFastSerializer(text_m, many=False)
        return Response(serializer.data)

    @csrf_exempt
    def post(self, request):
        # count ip address
        ChangeTextAPIView.get_ip(request)

        serializer = TypeFastOutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        type_m = TypeFastModel.objects.filter(id=serializer.data['text_id']).first()
        type_fast_result = type_fast.find_difference_text(type_m.text, serializer.validated_data['text'])

        content = TypeFastOutModel.objects.create(text_id=serializer.validated_data['text_id'],
                                                  text=serializer.validated_data['text'],
                                                  true_answers=len(type_fast_result))
        content.save()

        top_results = [x.true_answers for x in TypeFastOutModel.objects.all().order_by('-true_answers')[:20]]
        all_results = [x.true_answers for x in TypeFastOutModel.objects.all().order_by('-true_answers')]
        leader = True if content.true_answers in top_results else False
        place = all_results.index(content.true_answers) + 1
        return_content = {'data': type_fast_result, 'place': place, 'leader': leader}
        return HttpResponse(json.dumps(return_content), content_type='application/json')


class NameofTopAPIView(generics.ListCreateAPIView):
    serializer_class = NameofTopSerializer
    queryset = NameofTop.objects.all()


class CreateTextAPIView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdminUser)
    serializer_class = TypeFastSerializer
    queryset = TypeFastModel.objects.all()


class SessionUserView(APIView):
    permission_classes = (IsAuthenticated, IsAdminUser)

    def get(self, request):
        user = User.objects.get(pk=self.request.user.id)
        serializer = UserOutSerializer(user)
        return Response(data=serializer.data)


class CreateUser(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdminUser)
    serializer_class = UserSerializer
    queryset = User.objects.all()


class TextStatisticViewSet(ModelViewSet):
    serializer_class = TextStatisticSerializer
    queryset = TextLikeUnlike.objects.all()

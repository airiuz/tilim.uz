import random

from django.contrib.auth.models import User
import re
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
from front.translit_text import to_cyrillic, to_latin
from .utils import GetAddressApiView
from .serializers import MyFileSerializer, MyTextSerializer, MyOutFileSerializer, NameofTopSerializer, \
    TypeFastOutSerializer, TypeFastSerializer, TopUsers, \
    UserOutSerializer, UserSerializer, TextStatisticSerializer, ChooseLanguageSerializer
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
        translate = to_cyrillic if t=='1' else to_latin
        translated = to_latin(a)
        incorrect_words = [re.sub(r'[\.\,\:$]', r'', translate(x)) for x in re.findall(r'([a-zA-z\'ʻ‘`ʼ’\-]+)' if autocorrector.check(x) == False]
        result = translate(a)
        incorrect_words = [x for x in incorrect_words if x.isalpha()]
        content = {'text': result, 'incorrect_words': incorrect_words}
        return HttpResponse(json.dumps(content), content_type='application/json')


class FixWordsViewSet(ViewSet):
    permission_classes = (permissions.AllowAny,)
    def create(self, request):
        serializer = FixWordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        word = serializer.validated_data.get('word')
        t = serializer.validated_data.get("type")
        word = to_latin(word) if t == '1' else word
        words = autocorrector.suggestions(word) if autocorrector.check(word) == False else word
        if t=='1' and isinstance(words, list):
            words = [to_cyrillic(x) for x in words]
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
    @csrf_exempt
    def post(self, request):

        serializer = TypeFastOutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        type_m = TypeFastModel.objects.filter(id=serializer.data['text_id']).first()
        alpha = serializer.data.get('t')
        model_text = to_cyrillic(str(type_m.text)) if alpha == '1' else str(type_m.text)
        type_fast_result = type_fast.find_difference_text(model_text, serializer.validated_data['text'])
        # content = TypeFastOutModel.objects.create(text_id=serializer.validated_data['text_id'],
        #                                           text=serializer.validated_data['text'],
        #                                           true_answers=len(type_fast_result["true_answers"]),
        #                                           alpha = serializer.validated_data['t'])
        # content.save()

        percent = type_fast_result['percent']
        true_answers=len(type_fast_result["true_answers"])
        # top_results = [x.true_answers for x in TypeFastOutModel.objects.filter(alpha=alpha).order_by('-true_answers')[:10]]
        
        # leader = True if true_answers in top_results else False
        place = 1
        topusers = TopUsers.objects.filter(t=alpha).order_by("percent")
        for x in topusers:
            # 70 
            if x.percent>=percent:
                place = x.place + 1 
                break
        leader = True if place <= 20 else False
        return_content = {'data': type_fast_result['true_answers'], 'place': place, 'leader': leader, 
                 "percent":type_fast_result['percent'], "chars":type_fast_result['chars']}
        return HttpResponse(json.dumps(return_content), content_type='application/json')


class TypeFastGetTextAPIView(GetAddressApiView):
    def post(self,request):
        serializer = ChooseLanguageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ChangeTextAPIView.get_ip(request)

        ids = [x.id for x in TypeFastModel.objects.all()]
        x = random.choice(ids)
        text_m = TypeFastModel.objects.filter(id=x).first()
        t = serializer.data.get('t')
        text_to_send = to_cyrillic(str(text_m.text)) if t == '1' else text_m.text
        content = {"text_id":text_m.id, "text":text_to_send}
        return HttpResponse(json.dumps(content), content_type='application/json')


class CreateTextAPIView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsAdminUser)
    serializer_class = TypeFastSerializer
    queryset = TypeFastModel.objects.all()

class TopUsersViewSet(ViewSet):
    def list(self, request):
        queryset = TopUsers.objects.all()
        serializer = NameofTopSerializer(queryset, many=True)
        return Response(serializer.data)
    def create(self, request):
        serializer = NameofTopSerializer (data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

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

import random
import json
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework import status, permissions, generics
from rest_framework.response import Response
from django.contrib.auth import login, logout
import front.translit_file, front.translit_text
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from .serializers import LoginSerializer, MyFileSerializer, MyTextSerializer, MyOutFileSerializer, NameofTopSerializer, TypeFastOutSerializer, TypeFastSerializer, NameofTop, UserOutSerializer, UserSerializer
from .models import MyFile, TypeFastModel, TypeFastOutModel
from rest_framework.parsers import FileUploadParser, MultiPartParser, FormParser
from rest_framework.viewsets import ViewSet
from translit import serializers, type_fast


class ChangeTextAPIView(APIView):
    @csrf_exempt
    def post(self, request):
        serializer = MyTextSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            a = serializer.data.get('data')
            t = serializer.data.get('type')
            t = '1' if t in ['1', 'lotin'] else t == '0'
            result = front.translit_text.to_cyrillic(a) if t=='1' else front.translit_text.to_latin(a)
            return Response(result)
        else:
            return Response(serializer.errors)


class DocumentChangeAPIView(APIView):
    parser_classes = (MultiPartParser, FileUploadParser)
    def post(self, request):
        serializer = MyFileSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            file = MyFile.objects.get(id=serializer.data.get('id'))
            myfile = file.in_file
            t = serializer.data.get('t')

            outfile = front.translit_file.translit_file(t, myfile)
            if isinstance(outfile['out_file'], str):
                return Response(data=outfile['out_file'])
            else:
                serializer = MyOutFileSerializer(data=outfile)
                if serializer.is_valid(raise_exception=True):
                    return Response(serializer.data)
                return Response(data=serializer.errors)
        else:
            return Response(
                        data=serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)


class TypeFastAPIView(APIView):
    def get(self, request):
        ids = [x.id for x in TypeFastModel.objects.all()]
        x = random.choice(ids)
        text_m = TypeFastModel.objects.filter(id=x).first()
        serializer = TypeFastSerializer(text_m, many=False)
        return Response(serializer.data)
    
    @csrf_exempt
    def post(self, request):
        serializer = TypeFastOutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        type_m = TypeFastModel.objects.filter(id=serializer.data['text_id']).first()
        type_fast_result = type_fast.find_difference_text(type_m.text, serializer.data['text'])
        
        content = TypeFastOutModel.objects.create(text_id=serializer.data['text_id'], text=serializer.data['text'], true_answers=len(type_fast_result))
        content.save()
        
        top_results = [x.true_answers for x in TypeFastOutModel.objects.all().order_by('-true_answers')[:5]]
        all_results = [x.true_answers for x in TypeFastOutModel.objects.all().order_by('-true_answers')]
        leader = True if content.true_answers in top_results else False
        place = all_results.index(content.true_answers)+1
        return_content = {'data':type_fast_result, 'place':place, 'leader':leader}
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
        

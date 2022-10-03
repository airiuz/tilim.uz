import random
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
import front.translit_file, front.translit_text
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .serializers import MyFileSerializer, MyTextSerializer, MyOutFileSerializer, TypeFastOutSerializer, TypeFastSerializer
from .models import MyFile, TypeFastModel
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
        type_m = TypeFastModel.objects.filter(id=serializer.data['id']).first()
        type_fast_result = type_fast.find_difference_text(type_m.text, serializer.data['text'])
        return Response(type_fast_result)    


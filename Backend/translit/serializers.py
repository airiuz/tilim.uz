from rest_framework import serializers
from .models import MyFile, MyOutFile, TypeFastModel


class TypeFastSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeFastModel
        fields = '__all__'

class TypeFastOutSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    text = serializers.CharField(max_length=500)
    
class MyTextSerializer(serializers.Serializer):
    data = serializers.CharField(required=True)
    type = serializers.CharField(required=True)

class MyFileSerializer(serializers.ModelSerializer):
    in_file = serializers.FileField(
        max_length = 10000000,
        allow_empty_file = False,
        use_url = False,
    )
    t = serializers.CharField(
        max_length = 100,
        required=True)

    class Meta:
        model = MyFile
        fields = ['id', 'in_file', 't']

    def create(self, validated_data):
        # print(validated_data)
        file = validated_data.pop('in_file')
        t = validated_data.pop('t')
        return MyFile.objects.create(in_file=file, t=t)

class MyOutFileSerializer(serializers.ModelSerializer):
    out_file = serializers.FileField()
    class Meta:
        model = MyOutFile
        fields = ['id', 'out_file']
        read_only_fields = ['id', 'out_file']

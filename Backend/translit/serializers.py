from rest_framework import serializers
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import MyFile, MyOutFile, NameofTop, TypeFastModel, TypeFastOutModel, TextLikeUnlike
from rest_framework.validators import UniqueValidator
from django.contrib.auth import authenticate
import front
from django.core.validators import RegexValidator


class TypeFastSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeFastModel
        fields = '__all__'


class TypeFastOutSerializer(serializers.Serializer):
    text_id = serializers.IntegerField()
    text = serializers.CharField(max_length=500)


class NameofTopSerializer(serializers.ModelSerializer):
    class Meta:
        model = NameofTop
        fields = ['type_fast_out_id', 'name']

    def create(self, validated_data):
        return NameofTop.objects.create(type_fast_out_id=validated_data.pop('type_fast_out_id'),
                                        name=validated_data.pop('name'))


class MyTextSerializer(serializers.Serializer):
    data = serializers.CharField(required=True, trim_whitespace=False)
    type = serializers.CharField(required=True)


class FixWordSerializer(serializers.Serializer):
    word = serializers.CharField()


class TextStatisticSerializer(serializers.ModelSerializer):
    class Meta:
        model = TextLikeUnlike
        fields = '__all__'


class MyFileSerializer(serializers.ModelSerializer):
    in_file = serializers.FileField(
        max_length=10000000,
        allow_empty_file=False,
        use_url=False,
    )
    t = serializers.CharField(
        max_length=100,
        required=True)

    class Meta:
        model = MyFile
        fields = ['id', 'in_file', 't']

    def create(self, validated_data):
        file = validated_data.pop('in_file')
        t = validated_data.pop('t')
        return MyFile.objects.create(in_file=file, t=t)

class MyOutFileSerializer(serializers.ModelSerializer):
    out_file = serializers.FileField()

    class Meta:
        model = MyOutFile
        fields = ['id', 'out_file']
        read_only_fields = ['id', 'out_file']


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    password = serializers.CharField(write_only=True, required=True, validators=[
        RegexValidator(regex="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$")],
                                     style={'input_type': 'password', 'placeholder': 'Password'})
    password2 = serializers.CharField(write_only=True, required=True,
                                      style={'input_type': 'password', 'placeholder': 'Password'})

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name', 'is_staff')
        extra_kwargs = {
            'username': {'required': True},
            'password': {'required': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
            'is_staff': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_staff=validated_data['is_staff']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserOutSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser')
        read_only_fields = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser')

from rest_framework import serializers
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import MyFile, MyOutFile, TopUsers, TypeFastModel, TypeFastOutModel, TextLikeUnlike
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
    t = serializers.CharField()


class NameofTopSerializer(serializers.ModelSerializer):
    class Meta:
        model = TopUsers
        fields = ["name", "place", "t", "true_answers", "percent", "chars"]
    def create(self, validated_data):
        place = validated_data.pop('place')
        t = validated_data.pop('t')
        topusers = TopUsers.objects.filter(t=t)
        lower_users = topusers.filter(place__gte=place)
        for x in lower_users:
            x.place += 1
            x.save()
        over_users = TopUsers.objects.filter(place__gt=20)
        over_users.delete()

        return TopUsers.objects.create(name=validated_data.pop('name'), place=place,
                                       t=t, true_answers=validated_data.pop('true_answers'),
                                       percent=validated_data.pop("percent"), chars=validated_data.pop("chars"))

class MyTextSerializer(serializers.Serializer):
    data = serializers.CharField(required=True, trim_whitespace=False)
    type = serializers.CharField(required=True)

class ChooseLanguageSerializer(serializers.Serializer):
    t = serializers.CharField()

class FixWordSerializer(serializers.Serializer):
    type = serializers.CharField()
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

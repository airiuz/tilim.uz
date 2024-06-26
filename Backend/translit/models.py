import re
from django.conf import settings
from django.db import models
from django.core.files.storage import FileSystemStorage
from os.path import join as join_path
from .storage import MyStorage

input_storage = MyStorage(location=settings.INPUT_ROOT)
output_storage = MyStorage(location=settings.OUTPUT_ROOT)


class MyFile(models.Model):
    id = models.AutoField(primary_key=True)
    in_file = models.FileField(storage=input_storage)
    t = models.CharField(max_length=100)

    def __str__(self):
        return self.in_file.name


class MyOutFile(models.Model):
    id = models.AutoField(primary_key=True)
    out_file = models.FileField(storage=output_storage)

    def __str__(self):
        return self.out_file.name


class TypeFastModel(models.Model):
    text = models.TextField(default="")

    def __str__(self):
        return self.text[:60]


class TypeFastOutModel(models.Model):
    text_id = models.IntegerField()
    text = models.TextField(default="")
    true_answers = models.IntegerField()
    alpha = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return self.text[:50]


class TopUsers(models.Model):
    name = models.CharField(max_length=200)
    place = models.IntegerField()
    t = models.CharField(max_length=200)
    percent = models.IntegerField()
    wpm = models.IntegerField(default=0)

    def __str__(self):
        return self.name


class TextLikeUnlike(models.Model):
    text = models.TextField()
    like = models.BooleanField()

    def __str__(self):
        return self.text


class User(models.Model):
    user = models.TextField(default=None)

    def __str__(self):
        return self.user

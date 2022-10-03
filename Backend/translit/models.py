import re
from django.conf import settings
from django.db import models
from django.core.files.storage import FileSystemStorage
from os.path import join as join_path

input_storage = FileSystemStorage(location=settings.INPUT_ROOT)
output_storage = FileSystemStorage(location=settings.OUTPUT_ROOT)

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
    text = models.CharField(max_length=500)

    def __str__(self):
        return self.text[:60]
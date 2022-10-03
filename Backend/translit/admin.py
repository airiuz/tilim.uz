from django.contrib import admin

# Register your models here.
from .models import MyFile, MyOutFile, TypeFastModel
admin.site.register(MyFile)
admin.site.register(MyOutFile)
admin.site.register(TypeFastModel)



from django.contrib import admin

# Register your models here.
from .models import MyFile, MyOutFile, TypeFastModel, NameofTop, TypeFastOutModel, TextLikeUnlike,User

admin.site.register(MyFile)
admin.site.register(MyOutFile)
admin.site.register(TypeFastModel)
admin.site.register(NameofTop)
admin.site.register(TypeFastOutModel)
admin.site.register(TextLikeUnlike)
admin.site.register(User)

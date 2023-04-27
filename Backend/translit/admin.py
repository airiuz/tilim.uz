from django.contrib import admin

# Register your models here.
from .models import MyFile, MyOutFile, TypeFastModel, TopUsers, TypeFastOutModel, TextLikeUnlike,User

admin.site.register(MyFile)
admin.site.register(MyOutFile)
admin.site.register(TypeFastModel)
admin.site.register(TopUsers)
admin.site.register(TypeFastOutModel)
admin.site.register(TextLikeUnlike)
admin.site.register(User)

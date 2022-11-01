from django.db.models import Q
from .models import User
from rest_framework.views import APIView


class GetAddressApiView(APIView):
    @classmethod
    def get_ip(self, request):
        address = request.META.get('HTTP_X_FORWARDED_FOR')
        if address:
            ip = address.split(',')[-1].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        u = User(user=ip)
        result = User.objects.filter(Q(user__icontains=ip))
        if len(result) == 1:
            pass
        elif len(result) > 1:
            pass
        else:
            u.save()

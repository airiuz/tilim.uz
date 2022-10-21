from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def process(request):
    pt = request.POST.get('type')
    pd = request.POST.get('data')

    return HttpResponse("type: "+pt+"data: "+pd)

    
from django.shortcuts import render
import re
import front.translit_file, front.translit_text
from django.utils.encoding import smart_str


from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def process(request):
	if request.method=="POST":
		a=request.POST['data']
		t=request.POST['type']
		return HttpResponse((front.translit_text.translit(t,a)))
	return HttpResponse("bir nima noto'g'ri ketdi...")

def document(request):
	if request.method=="POST":
		t=request.POST['t']
		myfile = request.FILES['myfile']
		return render(request,'document.html',{'sfile':front.translit_file.translit_file(t,myfile), 'name':myfile.name})
	return render(request,'document.html')


from django.shortcuts import render

def index(request):
    context = {'latest_question_list': 0}
    return render(request, 'translit/index.html', context)




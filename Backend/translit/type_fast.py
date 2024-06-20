import re
from translit.models import TopUsers


def find_difference_text(m_text, input_text, time=60):
    # out_words = [x for x in m_text.split(' ')]
    # in_words = [x for x in input_text.split(' ')]
    # difference = [in_words[n] for n in list(range(len(in_words))) if out_words[n] == in_words[n]]
    wpm = int((len(input_text) / 5) / (time / 60))
    # percent = (len(difference) * 100) // len(out_words)
    # chars = len(''.join(x for x in difference))
    return {"wpm": wpm}


def place_finder(percent, wpm, alpha):
    place = 1
    top_users = TopUsers.objects.filter(t=alpha).order_by('place')
    for x in top_users:
        if x.percent * x.wpm >= percent * wpm:
            place = x.place + 1


    return place

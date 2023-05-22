import re

def find_difference_text(m_text, input_text):
    
    out_words = [x for x in m_text.split(' ')]
    in_words = [x for x in input_text.split(' ')]
    difference = [in_words[n] for n in list(range(len(in_words))) if out_words[n] == in_words[n]]  
    percent = (len(difference) * 100)//len(out_words)
    chars = len(''.join(x for x in difference))
    return {"true_answers":difference, "percent":percent, "chars":chars}



from .translit_text import to_cyrillic, to_latin


def transliterate(file_path, file_path2, t):
    mytransliterate = lambda text: to_cyrillic(text) if t == '1' else to_latin(text) 
    file = open(file_path, 'r')
    content = file.read()
    print(content)
    tarjima_file = open(file_path2, 'w')
    matn = mytransliterate(content)
    tarjima_file.write(matn)
    tarjima_file.close()
    file.close()
    return tarjima_file
    
   
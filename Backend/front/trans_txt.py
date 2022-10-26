from .translit_text import to_cyrillic, to_latin

def transliterate(file_path, file_path2, t):
    mytransliterate = lambda text: to_cyrillic(text) if t == '1' else to_latin(text) 
    with open(file_path, 'r') as file, open(file_path2, 'w') as tarjima_file:
        content = file.read()
        matn = mytransliterate(content)
        tarjima_file.write(matn)
        return tarjima_file
    

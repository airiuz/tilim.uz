from .translit_text import to_cyrillic, to_latin
from docx import Document
from translit.models import MyOutFile

def transliterate(file_path, file_path2, t):
    mytranslate = lambda text:to_cyrillic(text) if t == '1' else to_latin(text)
    def repl(doc_obj):
        for p in doc_obj.paragraphs:
            inline = p.runs
            for n in inline:
                if n.text and n.text.strip():
                    text = mytranslate(n.text)
                    n.text = text

        for table in doc_obj.tables:
            for row in table.rows:
                for cell in row.cells:
                    if cell.text and cell.text.strip():
                        matn = mytranslate(cell.text)
                        cell.text = matn

    doc = Document(file_path)
    repl(doc)

    doc.save(file_path2)



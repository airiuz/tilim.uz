from .translit_text import to_cyrillic, to_latin
from docx import Document
from docx.opc.constants import RELATIONSHIP_TYPE as RT

def transliterate(file_path, file_path2, t):
    mytranslate = lambda text:to_cyrillic(text) if t == '1' else to_latin(text)
    doc_obj = Document(file_path)
    
    for p in doc_obj.paragraphs:
        if p.text and p.text.strip():
            p.text = mytranslate(p.text)
        
    for table in doc_obj.tables:
        for row in table.rows:
            for cell in row.cells:
                if cell.text and cell.text.strip():
                    matn = mytranslate(cell.text)
                    cell.text = matn
                    
    rels = doc_obj.part.rels

    for rel in rels:
        if rels[rel].reltype == RT.HYPERLINK:
            print(rels[rel]._target)      


#     tree = lxml.etree.fromstring(xml)
# all_c = tree.findall('./cs/c')
# results = []
# for c in all_c:
#     myid = c.find('id').text
#     c.find('test').text = 'jdjdjdjdj'
#     print(c.find('test').text)
    doc_obj.save(file_path2)



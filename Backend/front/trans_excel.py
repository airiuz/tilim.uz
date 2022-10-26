import re
import openpyxl
from front.translit_text import to_latin, to_cyrillic

import re
import shutil
from zipfile import ZipFile, ZIP_DEFLATED


def transliterate(file_path1, file_path2, t):
    mytransliterate = lambda text: to_cyrillic(text) if t == '1' else to_latin(text)

    def convert(match_obj):
            data = match_obj.groupdict()
            return b"<t " + data['attrs'] + b">" + mytransliterate(data['text'].decode("utf-8")).encode() + b"</t>"

    with ZipFile(file_path1, 'r') as inzip, ZipFile(file_path2, 'w', ZIP_DEFLATED) as outzip:
        for inzipinfo in inzip.infolist():
            with inzip.open(inzipinfo) as infile:
                if inzipinfo.filename == "xl/sharedStrings.xml":
                    new_content = re.sub(rb"<t(?P<attrs>[^>]*)>(?P<text>[^<]+)<\/t>", convert, infile.read())
                    outzip.writestr(inzipinfo.filename, new_content)
                else:
                    outzip.writestr(inzipinfo.filename, infile.read())



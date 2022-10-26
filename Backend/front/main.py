import glob
import pdf2docx
from . import trans_txt

import front.trans_docx
import front.trans_pptx
import front.trans_excel
from translit.models import input_storage, output_storage

def trans(filenomi, t):
	# dalolatnoma.docx
	path='front/files'
	file_path  = input_storage.path(filenomi)
	file_path2 = output_storage.path(filenomi)
	file_name  = filenomi.rsplit('.',1)[0]
	file_type  = filenomi.split('.')[-1]

	file_types =['pptx', 'docx', 'xlsx', 'txt']

	if file_type not in file_types:
		return "Xa'tolik, fayl formati xa'to"

	if file_type == file_types[0]:
		front.trans_pptx.transliterate(file_path, file_path2, t)
	elif file_type == file_types[1]:
		front.trans_docx.transliterate(file_path, file_path2, t)
	elif file_type == file_types[2]:
		front.trans_excel.transliterate(file_path, file_path2, t)
	elif file_type == file_types[3]:
		trans_txt.transliterate(file_path, file_path2, t)
	return filenomi


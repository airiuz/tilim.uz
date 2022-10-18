import re
import openpyxl
from front.translit_text import to_latin, to_cyrillic


def transliterate(file_path, file_path2, t):
	mytranslate = lambda text: to_cyrillic(text) if t == '1' else to_latin(text)
	excel = openpyxl.load_workbook(file_path)
	
	for sh_name in excel.sheetnames:
		sh = excel[sh_name]

		for r in range(1, sh.max_column + 1):
			for c in range(1, sh.max_row + 1):	
				matn = str(sh.cell(row=c, column=r).value)
				translated_text = mytranslate(matn)
				sh.cell(row=c, column=r).value = translated_text
	excel.save(file_path2)

	
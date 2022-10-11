from front.translit_text import to_cyrillic, to_latin
from pptx import Presentation
from pptx.enum.shapes import MSO_SHAPE_TYPE

def transliterate(file_path, file_path2, t):

	def replace_text(shapes):
		mytransliterate = lambda text: to_cyrillic(text) if t == '1' else to_latin(text) 
		for shape in shapes:
			if shape.has_text_frame:
				text_frame = shape.text_frame
				for paragraph in text_frame.paragraphs:
					new_text = mytransliterate(paragraph.text)
					paragraph.text = new_text
                            	
			elif shape.shape_type == MSO_SHAPE_TYPE.GROUP:
				for sh in shape.shapes:
					if sh.has_text_frame:
						text_frame = sh.text_frame
						for paragraph in text_frame.paragraphs:
							new_text = mytransliterate(paragraph.text)
							paragraph.text = new_text
								
					if sh.has_table:
						for row in shape.table.rows:
							for cell in row.cells:
								cur_text = cell.text
								new_text = mytransliterate(cur_text)
								cell.text = new_text

			if shape.has_table:
				for row in shape.table.rows:
					for cell in row.cells:
						cur_text = cell.text
						new_text = mytransliterate(cur_text)
						cell.text = new_text
				
	prs = Presentation(file_path)
	
	slides = [slide for slide in prs.slides]
	shapes = []
	for slide in slides:
		for shape in slide.shapes:
			shapes.append(shape)
	
	replace_text(shapes)
	prs.save(file_path2)

import front.main
from translit.models import MyOutFile


def translit_file(t, myfile):
	translated_filename = front.main.trans(myfile.name, t)
	if translated_filename != "Xa'tolik, fayl formati xa'to":
		outfile = MyOutFile.objects.create(out_file=translated_filename)
		outfile.save()
		return {"out_file": outfile.out_file}
	return {"out_file":"Xa'tolik, fayl formati xa'to"}


	# translated_filename = front.main.trans(myfile.name, t)
	# try:
	# 	outfile = MyOutFile.objects.create(out_file=translated_filename)
	# 	outfile.save()
	# 	result = {'out_file':outfile.out_file}
	# except FileNotFoundError as e:
	# 	result = {'out_file':"Xa'tolik, fayl formati xa'to"}
	# return result



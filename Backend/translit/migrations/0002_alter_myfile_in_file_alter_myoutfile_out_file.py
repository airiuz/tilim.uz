# Generated by Django 4.2 on 2023-04-13 20:39

from django.db import migrations, models
import translit.storage


class Migration(migrations.Migration):

    dependencies = [
        ('translit', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='myfile',
            name='in_file',
            field=models.FileField(storage=translit.storage.MyStorage(location='/home/legion/samandar/airi/demo/tilim.uz/Backend/front/files/input'), upload_to=''),
        ),
        migrations.AlterField(
            model_name='myoutfile',
            name='out_file',
            field=models.FileField(storage=translit.storage.MyStorage(location='/home/legion/samandar/airi/demo/tilim.uz/Backend/front/files/output'), upload_to=''),
        ),
    ]

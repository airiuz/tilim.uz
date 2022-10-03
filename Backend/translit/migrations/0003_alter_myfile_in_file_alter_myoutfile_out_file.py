# Generated by Django 4.1.1 on 2022-09-16 05:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("translit", "0002_alter_myfile_in_file_alter_myoutfile_out_file"),
    ]

    operations = [
        migrations.AlterField(
            model_name="myfile",
            name="in_file",
            field=models.FileField(upload_to="front/files/input"),
        ),
        migrations.AlterField(
            model_name="myoutfile",
            name="out_file",
            field=models.FileField(upload_to="front/files/output"),
        ),
    ]

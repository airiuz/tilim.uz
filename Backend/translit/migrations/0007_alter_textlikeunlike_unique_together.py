# Generated by Django 4.1.2 on 2022-10-20 11:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('translit', '0006_alter_myfile_in_file_alter_myoutfile_out_file_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='textlikeunlike',
            unique_together=set(),
        ),
    ]
# Generated by Django 4.2 on 2023-04-27 21:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('translit', '0004_topuers_delete_nameoftop'),
    ]

    operations = [
        migrations.RenameField(
            model_name='topuers',
            old_name='alpha',
            new_name='t',
        ),
    ]
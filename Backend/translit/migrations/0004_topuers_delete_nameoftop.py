# Generated by Django 4.2 on 2023-04-27 20:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('translit', '0003_typefastoutmodel_alpha'),
    ]

    operations = [
        migrations.CreateModel(
            name='TopUers',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('place', models.IntegerField()),
                ('alpha', models.CharField(max_length=200)),
            ],
        ),
        migrations.DeleteModel(
            name='NameofTop',
        ),
    ]

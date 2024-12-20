# Generated by Django 5.1.2 on 2024-12-06 17:40

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_productos_imagen_product'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='carritodecompras',
            name='Productos',
        ),
        migrations.RemoveField(
            model_name='carritodecompras',
            name='cantidad',
        ),
        migrations.RemoveField(
            model_name='carritodecompras',
            name='precio_unitario',
        ),
        migrations.AddField(
            model_name='carritodecompras',
            name='section',
            field=models.CharField(default='default_value', max_length=100),
        ),
        migrations.AddField(
            model_name='carritodecompras',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='CartItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('Productos', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.productos')),
                ('cart', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='api.carritodecompras')),
            ],
        ),
    ]

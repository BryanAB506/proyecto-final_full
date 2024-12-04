from django.db import models
from django.contrib.auth.models import User


    

class Direcciones_envio(models.Model):
    Usuarios = models.ForeignKey(User, on_delete=models.CASCADE)
    provincia = models.CharField(max_length=255, default="Sin provincia")
    Canton = models.CharField(max_length=100, default="Sin canton")
    Distrito = models.CharField(max_length=100, default="Sin distrito")
    direccion = models.CharField(max_length=255)
    codigo_postal = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.Usuarios} - {self.provincia} - {self.Canton} - {self.Distrito} - {self.direccion} -{self.codigo_postal}"
    

class Categorias(models.Model):
    nombre_categoria = models.CharField(max_length=100)
    descripcion = models.TextField()

    def __str__(self):
        return f'{self.nombre_categoria} - {self.descripcion}'
    

class Productos(models.Model):
    imagen_product = models.TextField(default="0")
    nombre = models.CharField(max_length=100)
    descripcion_producto = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    Categorias = models.ForeignKey('Categorias', on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.imagen_product} - {self.nombre} - {self.descripcion_producto} - {self.precio} - {self.stock} - {self.Categorias}' 


class CarritoDeCompras(models.Model):
    Productos = models.ForeignKey('Productos', on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    def __str__(self):
        return f"{self.Productos} - {self.cantidad} - {self.precio_unitario} - {self.total}"
    


class Ordenes(models.Model):
    ESTADO_Orden = [
        ('pendiente', 'Pendiente'),
        ('procesando', 'Procesando'),
        ('enviado', 'Enviado'),
        ('entregado', 'Entregado')
    ]
    Usuarios = models.ForeignKey(User, on_delete=models.CASCADE)
    carrito = models.ForeignKey(CarritoDeCompras, on_delete=models.CASCADE)
    fecha_orden = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=10, choices=ESTADO_Orden)
    

    def __str__(self):
        return f"{self.Usuarios} - {self.carrito} - {self.fecha_orden} - {self.estado}"
    

class Pagos(models.Model):
    Ordenes = models.ForeignKey('Ordenes', on_delete=models.CASCADE)
    metodo_pago = models.CharField(max_length=50)
    comprobante_pago = models.BinaryField()

    def __str__(self):
        return f"{self.Ordenes} - {self.metodo_pago} - {self.comprobante_pago}"

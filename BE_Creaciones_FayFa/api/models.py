from django.db import models
from django.contrib.auth.models import User

class Usuarios(models.Model):
    Usuarios = models.OneToOneField(User, on_delete=models.CASCADE)
    
    def __str__(self):  
        return f'{self.Usuarios}'



# class Usuario(models.Model):
#     nombre_usuario = models.CharField(max_length=100)
#     apellido_usuario = models.CharField(max_length=100)
#     email = models.EmailField(unique=True)
#     telefono = models.CharField(max_length=15)
#     password = models.CharField(max_length=100)
#     fecha_registro = models.DateField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.nombre_usuario} - {self.apellido_usuario} - {self.email} - {self.email} - {self.telefono} - {self.password} - {self.fecha_registro}"
    

class Direcciones_envio(models.Model):
    Usuarios = models.ForeignKey('Usuarios', on_delete=models.CASCADE)
    direccion = models.CharField(max_length=255)
    ciudad = models.CharField(max_length=100)
    estado = models.CharField(max_length=100)
    codigo_postal = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.Usuarios} - {self.direccion} - {self.ciudad} - {self.estado} - {self.codigo_postal}"
    

class Categorias(models.Model):
    nombre_categoria = models.CharField(max_length=100)
    descripcion = models.TextField()

    def __str__(self):
        return f'{self.nombre_categoria} - {self.descripcion}'
    

class Productos(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion_producto = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    Categorias = models.ForeignKey('Categorias', on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.nombre} - {self.descripcion_producto} - {self.precio} - {self.stock} - {self.Categorias}' 


class CarritoDeCompras(models.Model):
    Productos = models.ForeignKey('Productos', on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.Productos} - {self.cantidad} - {self.precio_unitario}"
    


class Ordenes(models.Model):
    ESTADO_Orden = [
        ('pendiente', 'Pendiente'),
        ('procesando', 'Procesando'),
        ('enviado', 'Enviado'),
        ('entregado', 'Entregado')
    ]
    Usuarios = models.ForeignKey(Usuarios, on_delete=models.CASCADE)
    carrito = models.ForeignKey(CarritoDeCompras, on_delete=models.CASCADE)
    fecha_orden = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=10, choices=ESTADO_Orden)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.Usuarios} - {self.carrito} - {self.fecha_orden} - {self.estado} - {self.total}"
    

class Pagos(models.Model):
    Ordenes = models.ForeignKey('Ordenes', on_delete=models.CASCADE)
    metodo_pago = models.CharField(max_length=50)
    comprobante_pago = models.BinaryField()

    def __str__(self):
        return f"{self.Ordenes} - {self.metodo_pago} - {self.comprobante_pago}"

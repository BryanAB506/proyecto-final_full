from rest_framework import serializers
from .models import Direcciones_envio, Categorias, Productos, CarritoDeCompras, Ordenes, Pagos, CartItem
from django.contrib.auth.models import User

# Serializador para el modelo de usuarios de Django
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # Modelo base de usuarios de Django
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined']  # Campos a incluir en el JSON



# Validación personalizada para el nombre de usuario
def validate_Nombre_Usuario(self, value):
    if User.objects.filter(username=value).exists():  # Verifica si ya existe un usuario con el mismo nombre
        raise serializers.ValidationError("Ya existe un usuario con este nombre.")  # Lanza error si es duplicado
    return value



# Validación personalizada para el correo electrónico
def validate_email(self, value):
    if User.objects.filter(email=value).exists():  # Verifica si ya existe un correo registrado
        raise serializers.ValidationError("Ya existe un correo registrado con este email.")  # Lanza error si es duplicado
    return value



# Serializador para direcciones de envío
class Direcciones_envioSerializer(serializers.ModelSerializer):
    email_usuario = serializers.CharField(source='Usuarios.email', read_only=True)  # Muestra el correo electrónico del usuario asociado

    class Meta:
        model = Direcciones_envio  # Modelo de direcciones de envío
        fields = '__all__'  # Incluye todos los campos del modelo

    # Validaciones específicas para direcciones
    def validate(self, data):
        if not data.get('direccion'):  # Valida que se haya ingresado una dirección
            raise serializers.ValidationError({"direccion": "La dirección es obligatoria."})
        if not data.get('codigo_postal'):  # Valida que se haya ingresado un código postal
            raise serializers.ValidationError({"codigo_postal": "El código postal es obligatorio."})
        return data



# Serializador para categorías
class CategoriasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorias  # Modelo de categorías
        fields = '__all__'  # Incluye todos los campos



# Serializador para productos
class ProductosSerializer(serializers.ModelSerializer):
    nombre_categoria = serializers.CharField(source='Categorias.nombre_categoria', read_only=True)  # Incluye el nombre de la categoría asociada

    class Meta:
        model = Productos  # Modelo de productos
        fields = ['id', 'nombre', 'descripcion_producto', 'precio', 'stock', 'Categorias', 'nombre_categoria', 'imagen_product']  # Campos incluidos



# Serializador para el carrito de compras
class CarritoDeComprasSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarritoDeCompras  # Modelo del carrito
        fields = '__all__'  # Incluye todos los campos



# Serializador para los ítems del carrito
class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem  # Modelo de ítems en el carrito
        fields = ['Productos', 'quantity', 'price']  # Campos específicos



# Serializador para órdenes
class OrdenesSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField()  # Campo calculado para el total
    carrito_items = CartItemSerializer(source='carrito.items', many=True, read_only=True)  # Ítems del carrito asociados
    email = serializers.CharField(source='Usuarios.email', read_only=True)  # Correo del usuario asociado
    usuario_nombre = serializers.CharField(source='Usuarios.get_full_name', read_only=True)  # Nombre completo del usuario asociado

    class Meta:
        model = Ordenes  # Modelo de órdenes
        fields = ['id', 'fecha_orden', 'estado', 'Usuarios', 'usuario_nombre', 'email', 'carrito', 'total', 'carrito_items']  # Campos incluidos

    # Método para calcular el total de la orden
    def get_total(self, obj):
        return obj.carrito.total if obj.carrito else None  # Retorna el total si el carrito existe



# Serializador para pagos
class PagosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pagos  # Modelo de pagos
        fields = '__all__'  # Incluye todos los campos



# Serializador para registrar nuevos usuarios
class RegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # Modelo base de usuarios de Django
        fields = ("first_name", "last_name", "email", "username", "password", 'is_staff')  # Campos necesarios para el registro

    # Método para crear un nuevo usuario
    def create(self, validated_data):
        is_staff = validated_data.get('is_staff', 0)  # Obtiene el valor de is_staff, por defecto es 0
        usuario = User(**validated_data)  # Crea una instancia del usuario
        usuario.set_password(validated_data['password'])  # Cifra la contraseña
        usuario.is_staff = bool(is_staff)  # Define si es miembro del staff
        usuario.save()  # Guarda el usuario en la base de datos
        return usuario

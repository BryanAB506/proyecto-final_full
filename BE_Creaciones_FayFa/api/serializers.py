from rest_framework import serializers
from .models import Direcciones_envio, Categorias, Productos, CarritoDeCompras, Ordenes, Pagos, CartItem
from django.contrib.auth.models import User



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined']

#validacione para el usuario         
def validate_Nombre_Usuario (self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Ya existe un usuario con este nombre.")
        return value
        
                      
def validate_email (self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Ya existe un correo registrado con este email.")
        return value


     
     
class Direcciones_envioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direcciones_envio
        fields = '__all__'
        
           
class CategoriasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorias
        fields = '__all__'
        


class ProductosSerializer(serializers.ModelSerializer):
    nombre_categoria = serializers.CharField(source='Categorias.nombre_categoria', read_only=True)

    class Meta:
        model = Productos
        fields = ['id', 'nombre', 'descripcion_producto', 'precio', 'stock', 'Categorias', 'nombre_categoria', 'imagen_product']




class CarritoDeComprasSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarritoDeCompras
        fields = '__all__'
        
        
# class CartItemSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CartItem
#         fields = '__all__'
class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['Productos', 'quantity', 'price']



class OrdenesSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField()
    
    carrito_items = CartItemSerializer(source='carrito.items', many=True, read_only=True)
    email = serializers.CharField(source='Usuarios.email', read_only=True)
    # Corrige el 'source' para acceder al nombre del usuario
    usuario_nombre = serializers.CharField(source='Usuarios.get_full_name', read_only=True)

    class Meta:
        model = Ordenes
        fields = ['id', 'fecha_orden', 'estado', 'Usuarios', 'usuario_nombre','email', 'carrito', 'total','carrito_items']

    def get_total(self, obj):
        return obj.carrito.total if obj.carrito else None

    

    
        
class PagosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pagos
        fields = '__all__'
        
class RegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ( "first_name", "last_name", "email", "username",  "password", 'is_staff')

    def create(self, validated_data):
        # Extraer is_staff del validated_data
        is_staff = validated_data.get('is_staff', 0)  # Valor por defecto 0 
        usuario = User(**validated_data)
        usuario.set_password(validated_data['password'])
        usuario.is_staff = bool(is_staff)
        usuario.save()  

        return usuario
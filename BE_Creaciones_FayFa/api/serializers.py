from rest_framework import serializers
from .models import Direcciones_envio, Categorias, Productos, CarritoDeCompras, Ordenes, Pagos
from django.contrib.auth.models import User




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
    class Meta:
        model = Productos
        fields = '__all__'
        
class CarritoDeComprasSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarritoDeCompras
        fields = '__all__'
        
class OrdenesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ordenes
        fields = '__all__'
        
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
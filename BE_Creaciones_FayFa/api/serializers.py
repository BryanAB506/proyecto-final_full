from rest_framework import serializers
from .models import Usuarios, Direcciones_envio, Categorias, Productos, CarritoDeCompras, Ordenes, Pagos
from django.contrib.auth.models import User


class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = '__all__'
              
    def validate_Nombre_Usuario (self, value):
        if Usuarios.objects.filter(username =value).exists():
            raise serializers.ValidationError("Ya existe un usuario con este nombre.")
        return value
        
                      
    def validate_correo (self, value):
        if Usuarios.objects.filter(email =value).exists():
            raise serializers.ValidationError("Ya existe un correo con este nombre.")
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
    is_staff = serializers.ChoiceField(choices=[0, 1])
   
    class Meta:
        model = User
        fields = ( "first_name", "last_name", "email", "username",  "password", "is_staff")

    def create(self, validated_data):
        # Extraer is_staff del validated_data
        is_staff = validated_data.get('is_staff', 0)  # Valor por defecto 0 

        usuario = User(**validated_data)
        usuario.set_password(validated_data['password']) 

        # Asignar el valor correcto a is_staff
        usuario.is_staff = is_staff == 1  # Admin
        usuario.save()  
        

        return usuario
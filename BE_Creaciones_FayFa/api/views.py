from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission  
from django.contrib.auth.models import User
# from django.db.models import Count
from .models import Direcciones_envio, Categorias, Productos, CarritoDeCompras, Ordenes, Pagos
from .serializers import Direcciones_envioSerializer, CategoriasSerializer, ProductosSerializer, CarritoDeComprasSerializer, OrdenesSerializer, PagosSerializer, RegistroSerializer
# from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from rest_framework_simplejwt.tokens import RefreshToken
# from .firebase.firestore import subir_imagen_firestore  # La función creada anteriormente

#user
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from rest_framework.decorators import api_view, permission_classes

@api_view(['GET'])
@permission_classes([AllowAny])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True) 
    return Response(serializer.data, status=status.HTTP_200_OK)

#agregar productos
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Productos, CarritoDeCompras

from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Productos, CarritoDeCompras

# Agregar productos al carrito
def add_to_cart(request, producto_id):
    if request.method == "POST":
        # Obtener el producto
        producto = get_object_or_404(Productos, id=producto_id)
        cantidad = int(request.POST.get("cantidad", 1))

        # Verificar si hay suficiente stock
        if producto.stock < cantidad:
            return JsonResponse({"error": "Stock insuficiente"}, status=400)

        # Verificar si el producto ya está en el carrito
        carrito_item, created = CarritoDeCompras.objects.get_or_create(
            Productos=producto,
            defaults={
                "cantidad": cantidad,
                "precio_unitario": producto.precio,
            }
        )

        if not created:
            # Si ya existe, actualizar la cantidad y el total
            carrito_item.cantidad += cantidad
            carrito_item.precio_unitario = producto.precio
            carrito_item.save()

        # Reducir el stock del producto
        producto.stock -= cantidad
        producto.save()

        return JsonResponse({"message": "Producto agregado al carrito con éxito"})
    return JsonResponse({"error": "Método no permitido"}, status=405)


# Ver el carrito
from django.http import JsonResponse
from .models import CarritoDeCompras, Productos

def view_cart(request):
    carrito = CarritoDeCompras.objects.all()

    cart_items = []

    for item in carrito:
        try:
            producto = item.Productos  # Accedemos al producto desde 'item.Productos'
            categoria = producto.Categorias  # Accedemos a la categoría del producto

            # Verificar si imagen_product es bytes y convertirlo a cadena si es necesario
            imagen_url = producto.imagen_product

            if isinstance(imagen_url, bytes):
                # Si imagen_product está en bytes, decodificarla
                imagen_url = imagen_url.decode('utf-8')  # Decodificamos de bytes a texto

            # Verificamos que la URL esté bien formada
            if imagen_url:
                pass  # Ya es una URL válida, no hay que hacer nada
            else:
                # Si no hay imagen, podemos asignar None o una imagen por defecto
                imagen_url = None

            # Verificar si el precio es válido antes de convertirlo a float
            precio_unitario = item.precio_unitario if item.precio_unitario is not None else 0.0
            # Verificar que el precio es un número válido
            precio_unitario = float(producto.precio) if producto.precio else 0.0

            try:
                precio_unitario = float(precio_unitario)  # Intentar convertirlo a float
            except (ValueError, TypeError):
                precio_unitario = 0.0  # Asignar un valor predeterminado en caso de error

            cart_items.append({
                "id": producto.id,
                "name": producto.nombre,
                "description": producto.descripcion_producto,
                "price": producto.precio,
                "quantity": item.cantidad,
                "total": float(item.total),
                "image": imagen_url,  # Usamos la URL de la imagen
                "category": categoria.nombre_categoria if categoria else "Sin categoría",
            })
        except Productos.DoesNotExist:
            # Si el producto no existe, lo eliminamos o lo marcamos como no disponible
            item.delete()

    total_carrito = sum(item['total'] for item in cart_items)

    return JsonResponse({"carrito": cart_items, "total_carrito": total_carrito})


# Actualizar cantidad en el carrito
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Productos, CarritoDeCompras
import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def update_cart(request, producto_id, cantidad):
    if request.method == 'PUT':
        try:
            body = json.loads(request.body)
            # Implementa la lógica para actualizar el carrito
            return JsonResponse({'success': True, 'message': 'Carrito actualizado'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return JsonResponse({'error': 'Método no permitido'}, status=405)



# Eliminar producto del carrito
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Productos, CarritoDeCompras

# Eliminar producto del carrito
def remove_from_cart(request, producto_id):
    if request.method == "POST":
        carrito_item = get_object_or_404(CarritoDeCompras, Productos_id=producto_id)
        producto = carrito_item.Productos

        # Devolver el stock al producto
        producto.stock += carrito_item.cantidad
        producto.save()

        # Eliminar el producto del carrito
        carrito_item.delete()

        return JsonResponse({"message": "Producto eliminado del carrito"})
    return JsonResponse({"error": "Método no permitido"}, status=405)


#permisos para admin

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff


class RegistroView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistroSerializer
    permission_classes = [AllowAny]


class RegistroDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = RegistroSerializer
    permission_classes = [IsAdminUser]

    def get(self, request):
     return Response ({"message": "solo los administradores utilizan esta vita "})

    
# Direcciones_envio

class Direcciones_envioListCreate(generics.ListCreateAPIView):
    queryset = Direcciones_envio.objects.all()
    serializer_class = Direcciones_envioSerializer
    permission_classes = [AllowAny]
    
class Direcciones_envioDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Direcciones_envio.objects.all()
    serializer_class = Direcciones_envioSerializer
    permission_classes = [AllowAny] 
    
# Categorias

class CategoriasListCreate(generics.ListCreateAPIView):
    queryset = Categorias.objects.all()
    serializer_class = CategoriasSerializer
    permission_classes = [AllowAny]
    
class CategoriasDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Categorias.objects.all()
    serializer_class = CategoriasSerializer
    permission_classes = [IsAuthenticated] 

# Productos

class ProductosListCreate(generics.ListCreateAPIView):
    queryset = Productos.objects.all()
    serializer_class = ProductosSerializer
    permission_classes = [AllowAny]

    
    
class ProductosDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Productos.objects.all()
    serializer_class = ProductosSerializer
    permission_classes = [IsAuthenticated] 


# CarritoDeCompras

class CarritoDeComprasListCreate(generics.ListCreateAPIView):
    queryset = CarritoDeCompras.objects.all()
    serializer_class = CarritoDeComprasSerializer
    permission_classes = [AllowAny]
    
class CarritoDeComprasDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = CarritoDeCompras.objects.all()
    serializer_class = CarritoDeComprasSerializer
    permission_classes = [IsAuthenticated] 
    
# Ordenes

class OrdenesListCreate(generics.ListCreateAPIView):
    queryset = Ordenes.objects.all()
    serializer_class = OrdenesSerializer
    permission_classes = [AllowAny]
    
class OrdenesDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ordenes.objects.all()
    serializer_class = OrdenesSerializer
    permission_classes = [IsAuthenticated] 
    
# Pagos
class PagosListCreate(generics.ListCreateAPIView):
    queryset = Pagos.objects.all()
    serializer_class = PagosSerializer
    permission_classes = [AllowAny]
    
class PagosDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pagos.objects.all()
    serializer_class = PagosSerializer
    permission_classes = [IsAuthenticated] 
    
    
class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)  # Inicia sesión al usuario
            refresh = RefreshToken.for_user(user)  # Genera tokens
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Credenciales inválidas'}, status=400)
    

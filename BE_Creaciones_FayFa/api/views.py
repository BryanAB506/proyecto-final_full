from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission  
from django.contrib.auth.models import User
# from django.db.models import Count
from .models import Direcciones_envio, Categorias, Productos, CarritoDeCompras, Ordenes, Pagos, CartItem
from .serializers import Direcciones_envioSerializer, CategoriasSerializer, ProductosSerializer, CarritoDeComprasSerializer, OrdenesSerializer, PagosSerializer, RegistroSerializer, CartItemSerializer
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

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import CarritoDeCompras, CartItem

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_cart(request, section='default_section'):
    try:
        # Obtener el carrito de compras de un usuario y sección específica
        carrito = CarritoDeCompras.objects.get(user=request.user, section=section)
        
        # Obtener los items del carrito
        cart_items = CartItem.objects.filter(cart=carrito).select_related('Productos', 'Productos__Categorias')
        
        # Crear la lista de productos con los datos que quieres mostrar
        cart_items_data = []
        for item in cart_items:
            cart_items_data.append({
                'product_id': item.Productos.id,
                'product_name': item.Productos.nombre,
                'product_description': item.Productos.descripcion_producto,
                'product_price': item.Productos.precio,
                'product_image': item.Productos.imagen_product,
                'product_category': item.Productos.Categorias.nombre_categoria,
                'quantity': item.quantity,
                'total_price': item.total(),  # Precio total por item
            })
        
        # Preparar la respuesta con el total del carrito y los productos
        data = {
            'cart_total': carrito.total,
            'cart_items': cart_items_data,
        }
        return Response(data, status=200)
    
    except CarritoDeCompras.DoesNotExist:
        return Response({'cart_total': 0, 'cart_items': []}, status=200)


from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from .models import Productos, CarritoDeCompras, CartItem

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def add_to_cart(request, product_id, quantity, section='default_section'):
    try:
        producto = Productos.objects.get(id=product_id)
    except Productos.DoesNotExist:
        raise NotFound(detail="Producto no encontrado")
    
    # Verificar si ya existe un carrito para el usuario
    carrito, created = CarritoDeCompras.objects.get_or_create(
        user=request.user,
        section=section,  # Puedes permitir al usuario seleccionar la sección o usar una predeterminada
        defaults={'total': 0.0}
    )
    
    # Verificar si el producto ya está en el carrito
    cart_item, item_created = CartItem.objects.get_or_create(
        cart=carrito,
        Productos=producto,
        defaults={
            'quantity': quantity,
            'price': producto.precio,
        }
    )
    
    if not item_created:
        # Si el producto ya existe en el carrito, actualizamos la cantidad
        cart_item.quantity += quantity
        cart_item.save()
    
    # Actualizamos el total del carrito
    carrito.actualizar_total()
    
    # Retornar respuesta con el carrito actualizado
    return Response({'cart_total': carrito.total, 'items_count': carrito.items.count()}, status=status.HTTP_200_OK)

#actualizar productos carrito
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, product_id, quantity, section='default_section'):
    try:
        producto = Productos.objects.get(id=product_id)
    except Productos.DoesNotExist:
        raise NotFound(detail="Producto no encontrado")
    
    try:
        carrito = CarritoDeCompras.objects.get(user=request.user, section=section)
    except CarritoDeCompras.DoesNotExist:
        raise NotFound(detail="Carrito no encontrado")
    
    try:
        cart_item = CartItem.objects.get(cart=carrito, Productos=producto)
    except CartItem.DoesNotExist:
        raise NotFound(detail="Producto no está en el carrito")
    
    # Reducir la cantidad o eliminar el producto
    if quantity >= cart_item.quantity:
        cart_item.delete()
    else:
        cart_item.quantity -= quantity
        cart_item.save()
    
    # Actualizar el total del carrito
    carrito.actualizar_total()
    
    return Response({'cart_total': carrito.total, 'items_count': carrito.items.count()}, status=status.HTTP_200_OK)


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
    
    
# CartItem

class CartItemListCreate(generics.ListCreateAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [AllowAny]
    
class CartItemDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated] 
# Ordenes



class OrdenesListCreate(generics.ListCreateAPIView):
    serializer_class = OrdenesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtra las órdenes para que solo aparezcan las del usuario autenticado
        return Ordenes.objects.filter(Usuarios=self.request.user)


class OrdenesDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OrdenesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtra las órdenes para que solo aparezcan las del usuario autenticado
        return Ordenes.objects.filter(Usuarios=self.request.user)



    
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
    

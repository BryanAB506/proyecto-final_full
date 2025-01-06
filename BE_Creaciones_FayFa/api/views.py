from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import (
    Direcciones_envio, Categorias, Productos, CarritoDeCompras, 
    Ordenes, Pagos, CartItem
)
from .serializers import (
    Direcciones_envioSerializer, CategoriasSerializer, ProductosSerializer, 
    CarritoDeComprasSerializer, OrdenesSerializer, PagosSerializer, 
    RegistroSerializer, CartItemSerializer, UserSerializer
)

# Usuarios
@api_view(['GET'])
@permission_classes([AllowAny])
def get_users(request):
    """
    Vista para obtener una lista de todos los usuarios registrados.
    Permite el acceso a cualquier usuario (autenticado o no).
    """
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, pk):
    """
    Vista para eliminar un usuario específico por su ID.
    Solo está disponible para usuarios autenticados.
    """
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({"detail": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)
    user.delete()
    return Response({"detail": "Usuario eliminado correctamente."}, status=status.HTTP_204_NO_CONTENT)

# Carrito de compras
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_cart(request, section='default_section'):
    """
    Muestra los detalles del carrito de compras del usuario autenticado.
    Incluye los productos, cantidades y total.
    """
    try:
        carrito = CarritoDeCompras.objects.get(user=request.user, section=section)
        cart_items = CartItem.objects.filter(cart=carrito).select_related('Productos', 'Productos__Categorias')
        cart_items_data = []
        total_quantity = 0
        for item in cart_items:
            cart_items_data.append({
                'product_id': item.Productos.id,
                'product_name': item.Productos.nombre,
                'product_description': item.Productos.descripcion_producto,
                'product_price': item.Productos.precio,
                'product_image': item.Productos.imagen_product,
                'product_category': item.Productos.Categorias.nombre_categoria,
                'quantity': item.quantity,
                'total_price': item.total(),
            })
            total_quantity += item.quantity

        data = {
            'cart_id': carrito.id,
            'cart_total': carrito.total,
            'cart_items': cart_items_data,
            'cart_count': total_quantity,
        }
        return Response(data, status=200)
    except CarritoDeCompras.DoesNotExist:
        return Response({'cart_id': None, 'cart_total': 0, 'cart_items': [], 'cart_count': 0}, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def add_to_cart(request, product_id, quantity, section='default_section'):
    """
    Agrega un producto al carrito de compras.
    Si el producto ya está en el carrito, incrementa la cantidad.
    """
    try:
        producto = Productos.objects.get(id=product_id)
    except Productos.DoesNotExist:
        raise NotFound(detail="Producto no encontrado")

    carrito, created = CarritoDeCompras.objects.get_or_create(
        user=request.user,
        section=section,
        defaults={'total': 0.0}
    )

    cart_item, item_created = CartItem.objects.get_or_create(
        cart=carrito,
        Productos=producto,
        defaults={
            'quantity': quantity,
            'price': producto.precio,
        }
    )

    if not item_created:
        cart_item.quantity += quantity
        cart_item.save()

    carrito.actualizar_total()
    return Response({'cart_total': carrito.total, 'items_count': carrito.items.count()}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, product_id, quantity, section='default_section'):
    """
    Elimina una cantidad específica de un producto del carrito.
    Si la cantidad eliminada es mayor o igual a la existente, elimina el producto.
    """
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

    if quantity >= cart_item.quantity:
        cart_item.delete()
    else:
        cart_item.quantity -= quantity
        cart_item.save()

    carrito.actualizar_total()
    return Response({'cart_total': carrito.total, 'items_count': carrito.items.count()}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    """
    Vacía el carrito de compras eliminando todos los productos que contiene.
    """
    try:
        carrito = CarritoDeCompras.objects.get(user=request.user)
        CartItem.objects.filter(cart=carrito).delete()
        carrito.actualizar_total()
        return Response({
            "message": "El carrito ha sido vaciado exitosamente.",
            "cart_id": carrito.id,
            "cart_total": carrito.total,
        }, status=status.HTTP_200_OK)
    except CarritoDeCompras.DoesNotExist:
        return Response({"error": "No se encontró un carrito para el usuario autenticado."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": f"Ha ocurrido un error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Permisos para admin
class IsAdminUser(BasePermission):
    """
    Permiso personalizado que permite el acceso solo a usuarios administradores.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

# Registro de usuarios
class RegistroView(generics.ListCreateAPIView):
    """
    Vista para listar y registrar nuevos usuarios.
    Permite el acceso a cualquier usuario (autenticado o no).
    """
    queryset = User.objects.all()
    serializer_class = RegistroSerializer
    permission_classes = [AllowAny]

class RegistroDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar información de un usuario específico.
    Solo accesible para administradores.
    """
    queryset = User.objects.all()
    serializer_class = RegistroSerializer
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({"message": "Solo los administradores utilizan esta vista"})

# Direcciones de envío
class Direcciones_envioListCreate(generics.ListCreateAPIView):
    """
    Vista para listar o crear direcciones de envío.
    Permite el acceso a cualquier usuario (autenticado o no).
    """
    queryset = Direcciones_envio.objects.all()
    serializer_class = Direcciones_envioSerializer
    permission_classes = [AllowAny]

class Direcciones_envioDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar una dirección específica.
    Permite el acceso a cualquier usuario (autenticado o no).
    """
    queryset = Direcciones_envio.objects.all()
    serializer_class = Direcciones_envioSerializer
    permission_classes = [AllowAny]

# Categorías de productos
class CategoriasListCreate(generics.ListCreateAPIView):
    """
    Vista para listar o crear categorías de productos.
    Permite el acceso a cualquier usuario (autenticado o no).
    """
    queryset = Categorias.objects.all()
    serializer_class = CategoriasSerializer
    permission_classes = [AllowAny]

class CategoriasDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar una categoría específica.
    Solo accesible para usuarios autenticados.
    """
    queryset = Categorias.objects.all()
    serializer_class = CategoriasSerializer
    permission_classes = [IsAuthenticated]

# Productos
class ProductosListCreate(generics.ListCreateAPIView):
    """
    Vista para listar o crear productos.
    Permite el acceso a cualquier usuario (autenticado o no).
    """
    queryset = Productos.objects.all()
    serializer_class = ProductosSerializer
    permission_classes = [AllowAny]

class ProductosDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar un producto específico.
    Solo accesible para usuarios autenticados.
    """
    queryset = Productos.objects.all()
    serializer_class = ProductosSerializer
    permission_classes = [IsAuthenticated]

# Carrito de compras
class CarritoDeComprasListCreate(generics.ListCreateAPIView):
    """
    Vista para listar o crear carritos de compras.
    Permite el acceso a cualquier usuario (autenticado o no).
    """
    queryset = CarritoDeCompras.objects.all()
    serializer_class = CarritoDeComprasSerializer
    permission_classes = [AllowAny]

class CarritoDeComprasDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar un carrito de compras específico.
    Solo accesible para usuarios autenticados.
    """
    queryset = CarritoDeCompras.objects.all()
    serializer_class = CarritoDeComprasSerializer
    permission_classes = [IsAuthenticated]

# Items en el carrito
class CartItemListCreate(generics.ListCreateAPIView):
    """
    Vista para listar o crear elementos en un carrito.
    Permite el acceso a cualquier usuario (autenticado o no).
    """
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [AllowAny]

class CartItemDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar un elemento específico en un carrito.
    Solo accesible para usuarios autenticados.
    """
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

# Órdenes de compra para usuarios
class OrdenesListCreate(generics.ListCreateAPIView):
    """
    Vista para listar o crear órdenes de compra asociadas al usuario autenticado.
    """
    serializer_class = OrdenesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ordenes.objects.filter(Usuarios=self.request.user)

class OrdenesDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar una orden de compra específica del usuario autenticado.
    """
    serializer_class = OrdenesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ordenes.objects.filter(Usuarios=self.request.user)

# Órdenes de compra para administradores
class OrdenesAdminListCreate(generics.ListCreateAPIView):
    """
    Vista para listar o crear todas las órdenes de compra. Acceso para administradores.
    """
    queryset = Ordenes.objects.all()
    serializer_class = OrdenesSerializer
    permission_classes = [AllowAny]

class OrdenesAdminDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar cualquier orden de compra.
    Solo accesible para usuarios autenticados.
    """
    queryset = Ordenes.objects.all()
    serializer_class = OrdenesSerializer
    permission_classes = [IsAuthenticated]

def get_ordenes_admin(request):
    """
    Vista para obtener una lista detallada de todas las órdenes, incluyendo productos relacionados.
    Acceso exclusivo para administradores.
    """
    ordenes = Ordenes.objects.select_related('carrito').prefetch_related('carrito__items__Productos').all()
    data = []
    for orden in ordenes:
        productos = [
            {
                'nombre': item.Productos.nombre,
                'descripcion': item.Productos.descripcion_producto,
                'precio': float(item.price),
                'categoria': item.Productos.Categorias.nombre_categoria,
                'cantidad': item.quantity,
            }
            for item in orden.carrito.items.all()
        ]
        data.append({
            'id': orden.id,
            'fecha_orden': orden.fecha_orden,
            'estado': orden.estado,
            'usuario_nombre': orden.Usuarios.first_name,
            'usuario_apellido': orden.Usuarios.last_name,
            'email': orden.Usuarios.email,
            'productos': productos,
        })
    return JsonResponse(data, safe=False)

# Pagos
class PagosListCreate(generics.ListCreateAPIView):
    """
    Vista para listar o crear registros de pagos.
    Permite el acceso a cualquier usuario (autenticado o no).
    """
    queryset = Pagos.objects.all()
    serializer_class = PagosSerializer
    permission_classes = [AllowAny]

class PagosDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar un registro de pago específico.
    Solo accesible para usuarios autenticados.
    """
    queryset = Pagos.objects.all()
    serializer_class = PagosSerializer
    permission_classes = [IsAuthenticated]

# Sesión y autenticación
class LoginView(generics.GenericAPIView):
    """
    Vista para iniciar sesión utilizando credenciales de usuario.
    Genera y devuelve tokens de acceso y refresco JWT.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Credenciales inválidas'}, status=400)


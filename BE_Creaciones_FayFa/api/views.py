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

# User
@api_view(['GET'])
@permission_classes([AllowAny])
def get_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True) 
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, pk):
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

#añade los productos a cartItem y crea el carrito si el usuario no tiene aun
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def add_to_cart(request, product_id, quantity, section='default_section'):
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
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

# Registro
class RegistroView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistroSerializer
    permission_classes = [AllowAny]

class RegistroDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = RegistroSerializer
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({"message": "Solo los administradores utilizan esta vista"})

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

# Ordenes para usuarios
class OrdenesListCreate(generics.ListCreateAPIView):
    serializer_class = OrdenesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ordenes.objects.filter(Usuarios=self.request.user)

class OrdenesDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OrdenesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ordenes.objects.filter(Usuarios=self.request.user)

# Ordenes admin
class OrdenesAdminListCreate(generics.ListCreateAPIView):
    queryset = Ordenes.objects.all()
    serializer_class = OrdenesSerializer
    permission_classes = [AllowAny]

class OrdenesAdminDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ordenes.objects.all()
    serializer_class = OrdenesSerializer
    permission_classes = [IsAuthenticated]

def get_ordenes_admin(request):
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
            'usuario_apellido':orden.Usuarios.last_name,
            'email': orden.Usuarios.email,
            'productos': productos,
        })

    return JsonResponse(data, safe=False)

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
            login(request, user)
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Credenciales inválidas'}, status=400)

class CrearOrdenView(APIView):
    def post(self, request):
        user = request.user
        carrito_id = request.data.get("carrito_id")
        carrito = get_object_or_404(CarritoDeCompras, id=carrito_id, user=user)
        orden, created = Ordenes.objects.get_or_create(
            Usuarios=user,
            carrito=carrito,
            defaults={'estado': 'pendiente'}
        )
        if not created:
            orden.estado = 'pendiente'
            orden.save()
        serializer = OrdenesSerializer(orden)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@csrf_exempt
def eliminar_pedido(request, pedido_id):
    try:
        pedido = Ordenes.objects.get(id=pedido_id)
        pedido.delete()
        return JsonResponse({"message": "Pedido eliminado con éxito."}, status=200)
    except Ordenes.DoesNotExist:
        return JsonResponse({"error": "Pedido no encontrado."}, status=404)

@api_view(['PUT'])
def actualizar_estado_pedido(request, pedido_id):
    try:
        pedido = Ordenes.objects.get(id=pedido_id)
    except Ordenes.DoesNotExist:
        return Response({"error": "Pedido no encontrado"}, status=404)

    nuevo_estado = request.data.get('estado')
    if nuevo_estado not in dict(Ordenes.ESTADO_Orden).keys():
        return Response({"error": "Estado no válido"}, status=400)

    pedido.estado = nuevo_estado
    pedido.save()
    serializer = OrdenesSerializer(pedido)
    return Response(serializer.data, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def usuarioLogueado(request):
    user = request.user
    return Response({
        "id_usuario": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }, status=status.HTTP_200_OK)

#editar usuario
class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        data = request.data

        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)

        user.save()
        return Response({
            "message": "Datos actualizados exitosamente.",
            "data": {
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name
            }
        }, status=status.HTTP_200_OK)
        
#editar direccion
from rest_framework import serializers, status
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from .models import Direcciones_envio
from .serializers import Direcciones_envioSerializer

class DireccionUpdateView(UpdateAPIView):
    queryset = Direcciones_envio.objects.all()
    serializer_class = Direcciones_envioSerializer

    def update(self, request, *args, **kwargs):
        # Asegurarse de que el usuario está autenticado
        if not request.user.is_authenticated:
            return Response({"detail": "No autorizado"}, status=status.HTTP_401_UNAUTHORIZED)

        # Obtener la dirección que se va a actualizar
        direccion = self.get_object()

        # Asegurarse de que la dirección pertenece al usuario actual
        if direccion.Usuarios != request.user:
            return Response({"detail": "No autorizado a editar esta dirección"}, status=status.HTTP_403_FORBIDDEN)

        # Validar y actualizar la dirección
        serializer = self.get_serializer(direccion, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
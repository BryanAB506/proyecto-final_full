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

#eliminar usuario
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({"detail": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

    # Eliminar el usuario
    user.delete()
    return Response({"detail": "Usuario eliminado correctamente."}, status=status.HTTP_204_NO_CONTENT)


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
        total_quantity = 0  # Variable para contar la cantidad total de productos
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
            total_quantity += item.quantity  # Sumar la cantidad de cada producto
        
        # Preparar la respuesta con el ID del carrito, total y productos
        data = {
            'cart_id': carrito.id,  # Incluye el ID del carrito
            'cart_total': carrito.total,
            'cart_items': cart_items_data,
            'cart_count': total_quantity,  # Incluye el total de productos
        }
        return Response(data, status=200)
    
    except CarritoDeCompras.DoesNotExist:
        return Response({'cart_id': None, 'cart_total': 0, 'cart_items': [], 'cart_count': 0}, status=200)  # Incluye un cart_count de 0



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

# limpiar cart items
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import CarritoDeCompras, CartItem

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    try:
        # Buscar el carrito correspondiente al usuario
        carrito = CarritoDeCompras.objects.get(user=request.user)
        
        # Eliminar todos los ítems del carrito
        CartItem.objects.filter(cart=carrito).delete()
        
        # Actualizar el total del carrito
        carrito.actualizar_total()
        
        return Response({
            "message": "El carrito ha sido vaciado exitosamente.",
            "cart_id": carrito.id,
            "cart_total": carrito.total,
        }, status=status.HTTP_200_OK)
    
    except CarritoDeCompras.DoesNotExist:
        return Response({
            "error": "No se encontró un carrito para el usuario autenticado."
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "error": f"Ha ocurrido un error: {str(e)}"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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



#ordenes para usuarios
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

#ordenes admin
class OrdenesAdminListCreate(generics.ListCreateAPIView):
    queryset = Ordenes.objects.all()
    serializer_class = OrdenesSerializer
    permission_classes = [AllowAny]
    
class OrdenesAdminDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ordenes.objects.all()
    serializer_class = OrdenesSerializer
    permission_classes = [IsAuthenticated] 


from django.http import JsonResponse
from .models import Ordenes, CartItem

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
            login(request, user)  # Inicia sesión al usuario
            refresh = RefreshToken.for_user(user)  # Genera tokens
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({'error': 'Credenciales inválidas'}, status=400)
    

from django.shortcuts import get_object_or_404

class CrearOrdenView(APIView):
    def post(self, request):
        user = request.user
        carrito_id = request.data.get("carrito_id")
        
        # Verificar que el carrito existe y pertenece al usuario
        carrito = get_object_or_404(CarritoDeCompras, id=carrito_id, user=user)

        # Verificar si ya existe una orden pendiente asociada al carrito
        orden, created = Ordenes.objects.get_or_create(
            Usuarios=user,
            carrito=carrito,
            defaults={'estado': 'pendiente'}
        )

        # Si la orden ya existe, actualizar el estado (opcional)
        if not created:
            orden.estado = 'pendiente'
            orden.save()

        # Serializar y retornar la respuesta
        serializer = OrdenesSerializer(orden)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
#eliminar orden
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Ordenes

@csrf_exempt  # Para desactivar la protección CSRF para este caso (usar con precaución)
def eliminar_pedido(request, pedido_id):
    try:
        # Obtener el pedido por su ID
        pedido = Ordenes.objects.get(id=pedido_id)
        # Eliminar el pedido
        pedido.delete()
        return JsonResponse({"message": "Pedido eliminado con éxito."}, status=200)
    except Ordenes.DoesNotExist:
        return JsonResponse({"error": "Pedido no encontrado."}, status=404)

#Actualizar el estado de un pedido
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Ordenes
from .serializers import OrdenesSerializer  # Asegúrate de tener un serializador

@api_view(['PUT'])
def actualizar_estado_pedido(request, pedido_id):
    try:
        pedido = Ordenes.objects.get(id=pedido_id)  # Obtener el pedido por ID
    except Ordenes.DoesNotExist:
        return Response({"error": "Pedido no encontrado"}, status=404)

    # Obtener el nuevo estado del pedido desde el request (debe ser un valor válido)
    nuevo_estado = request.data.get('estado')
    if nuevo_estado not in dict(Ordenes.ESTADO_Orden).keys():
        return Response({"error": "Estado no válido"}, status=400)

    # Actualizar el estado del pedido
    pedido.estado = nuevo_estado
    pedido.save()

    # Devolver la respuesta con el pedido actualizado
    serializer = OrdenesSerializer(pedido)
    return Response(serializer.data, status=200)


#usuario logueado
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
def usuarioLogueado(request):
    permission_classes = [IsAuthenticated]
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
    })

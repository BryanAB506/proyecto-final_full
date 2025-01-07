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

# Función para obtener todos los usuarios
# Permite a cualquier persona (AllowAny) obtener la lista de todos los usuarios registrados.
@api_view(['GET'])
@permission_classes([AllowAny])
def get_users(request):
    users = User.objects.all()  # Recupera todos los usuarios del modelo User
    serializer = UserSerializer(users, many=True)  # Serializa los datos de los usuarios
    return Response(serializer.data, status=status.HTTP_200_OK)  # Devuelve los datos serializados con un código 200

# Función para eliminar un usuario por ID
# Requiere autenticación (IsAuthenticated) para garantizar que solo usuarios autenticados puedan eliminar cuentas.
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, pk):
    try:
        user = User.objects.get(pk=pk)  # Intenta recuperar el usuario por su ID
    except User.DoesNotExist:
        # Devuelve un error si el usuario no existe
        return Response({"detail": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

    user.delete()  # Elimina el usuario
    return Response({"detail": "Usuario eliminado correctamente."}, status=status.HTTP_204_NO_CONTENT)

# Función para visualizar el carrito de compras
# Requiere que el usuario esté autenticado y muestra los detalles de su carrito, incluyendo productos, cantidades y totales.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_cart(request, section='default_section'):
    try:
        # Recupera el carrito del usuario autenticado en la sección especificada
        carrito = CarritoDeCompras.objects.get(user=request.user, section=section)
        # Recupera los elementos del carrito con relaciones preseleccionadas para optimizar consultas
        cart_items = CartItem.objects.filter(cart=carrito).select_related('Productos', 'Productos__Categorias')
        cart_items_data = []
        total_quantity = 0
        
        # Itera por cada ítem en el carrito para preparar los datos serializados
        for item in cart_items:
            cart_items_data.append({
                'product_id': item.Productos.id,
                'product_name': item.Productos.nombre,
                'product_description': item.Productos.descripcion_producto,
                'product_price': item.Productos.precio,
                'product_image': item.Productos.imagen_product,
                'product_category': item.Productos.Categorias.nombre_categoria,
                'quantity': item.quantity,
                'total_price': item.total(),  # Calcula el precio total del producto en base a la cantidad
            })
            total_quantity += item.quantity

        # Devuelve los datos del carrito
        data = {
            'cart_id': carrito.id,
            'cart_total': carrito.total,
            'cart_items': cart_items_data,
            'cart_count': total_quantity,
        }
        return Response(data, status=200)

    except CarritoDeCompras.DoesNotExist:
        # Si no existe un carrito, devuelve un carrito vacío
        return Response({'cart_id': None, 'cart_total': 0, 'cart_items': [], 'cart_count': 0}, status=200)

# Función para añadir productos al carrito de compras
# Si el carrito no existe para el usuario, lo crea automáticamente.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def add_to_cart(request, product_id, quantity, section='default_section'):
    try:
        producto = Productos.objects.get(id=product_id)  # Recupera el producto por ID
    except Productos.DoesNotExist:
        raise NotFound(detail="Producto no encontrado")  # Devuelve un error si no encuentra el producto

    # Recupera o crea el carrito para el usuario en la sección especificada
    carrito, created = CarritoDeCompras.objects.get_or_create(
        user=request.user,
        section=section,
        defaults={'total': 0.0}
    )

    # Recupera o crea un ítem en el carrito asociado al producto
    cart_item, item_created = CartItem.objects.get_or_create(
        cart=carrito,
        Productos=producto,
        defaults={
            'quantity': quantity,
            'price': producto.precio,
        }
    )

    if not item_created:
        # Si el ítem ya existía, actualiza la cantidad
        cart_item.quantity += quantity
        cart_item.save()

    # Actualiza el total del carrito
    carrito.actualizar_total()
    return Response({'cart_total': carrito.total, 'items_count': carrito.items.count()}, status=status.HTTP_200_OK)

# Función para eliminar productos del carrito
# Reduce la cantidad del producto especificado o lo elimina completamente si la cantidad llega a 0.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, product_id, quantity, section='default_section'):
    try:
        producto = Productos.objects.get(id=product_id)  # Recupera el producto por ID
    except Productos.DoesNotExist:
        raise NotFound(detail="Producto no encontrado")  # Devuelve un error si no encuentra el producto

    try:
        carrito = CarritoDeCompras.objects.get(user=request.user, section=section)  # Recupera el carrito del usuario
    except CarritoDeCompras.DoesNotExist:
        raise NotFound(detail="Carrito no encontrado")  # Devuelve un error si no existe el carrito

    try:
        cart_item = CartItem.objects.get(cart=carrito, Productos=producto)  # Recupera el ítem del carrito
    except CartItem.DoesNotExist:
        raise NotFound(detail="Producto no está en el carrito")  # Devuelve un error si el producto no está en el carrito

    if quantity >= cart_item.quantity:
        # Si la cantidad a eliminar es mayor o igual a la existente, elimina el ítem
        cart_item.delete()
    else:
        # Reduce la cantidad del ítem
        cart_item.quantity -= quantity
        cart_item.save()

    # Actualiza el total del carrito
    carrito.actualizar_total()
    return Response({'cart_total': carrito.total, 'items_count': carrito.items.count()}, status=status.HTTP_200_OK)

# Función para vaciar completamente el carrito
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    try:
        carrito = CarritoDeCompras.objects.get(user=request.user)  # Recupera el carrito del usuario autenticado
        CartItem.objects.filter(cart=carrito).delete()  # Elimina todos los ítems del carrito
        carrito.actualizar_total()  # Actualiza el total del carrito
        return Response({
            "message": "El carrito ha sido vaciado exitosamente.",
            "cart_id": carrito.id,
            "cart_total": carrito.total,
        }, status=status.HTTP_200_OK)

    except CarritoDeCompras.DoesNotExist:
        # Devuelve un error si el carrito no existe
        return Response({"error": "No se encontró un carrito para el usuario autenticado."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # Maneja otros errores inesperados
        return Response({"error": f"Ha ocurrido un error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Clase de permiso personalizada para usuarios administradores
# Verifica si el usuario autenticado es un administrador (is_staff).
class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff




# Vistas relacionadas con el registro de usuarios
class RegistroView(generics.ListCreateAPIView):
    # Permite listar y crear usuarios
    queryset = User.objects.all()
    serializer_class = RegistroSerializer
    permission_classes = [AllowAny]  # No requiere autenticación para acceder

class RegistroDetail(generics.RetrieveUpdateDestroyAPIView):
    # Permite recuperar, actualizar o eliminar usuarios
    queryset = User.objects.all()
    serializer_class = RegistroSerializer
    permission_classes = [IsAdminUser]  # Solo los administradores pueden acceder

    def get(self, request):
        # Sobrescribe el método GET para devolver un mensaje personalizado
        return Response({"message": "Solo los administradores utilizan esta vista"})


# Vistas para manejar direcciones de envío
class Direcciones_envioListCreate(generics.ListCreateAPIView):
    # Permite listar y crear direcciones de envío
    queryset = Direcciones_envio.objects.all()
    serializer_class = Direcciones_envioSerializer
    permission_classes = [AllowAny]  # Acceso sin restricciones

class Direcciones_envioDetail(generics.RetrieveUpdateDestroyAPIView):
    # Permite recuperar, actualizar o eliminar una dirección de envío específica
    queryset = Direcciones_envio.objects.all()
    serializer_class = Direcciones_envioSerializer
    permission_classes = [AllowAny]


# Vistas para manejar categorías de productos
class CategoriasListCreate(generics.ListCreateAPIView):
    # Permite listar y crear categorías
    queryset = Categorias.objects.all()
    serializer_class = CategoriasSerializer
    permission_classes = [AllowAny]  # Acceso sin restricciones

class CategoriasDetail(generics.RetrieveUpdateDestroyAPIView):
    # Permite recuperar, actualizar o eliminar una categoría específica
    queryset = Categorias.objects.all()
    serializer_class = CategoriasSerializer
    permission_classes = [IsAuthenticated]  # Requiere autenticación


# Vistas para manejar productos
class ProductosListCreate(generics.ListCreateAPIView):
    # Permite listar y crear productos
    queryset = Productos.objects.all()
    serializer_class = ProductosSerializer
    permission_classes = [AllowAny]  # Acceso sin restricciones

class ProductosDetail(generics.RetrieveUpdateDestroyAPIView):
    # Permite recuperar, actualizar o eliminar un producto específico
    queryset = Productos.objects.all()
    serializer_class = ProductosSerializer
    permission_classes = [IsAuthenticated]  # Requiere autenticación


# Vistas para manejar el carrito de compras
class CarritoDeComprasListCreate(generics.ListCreateAPIView):
    # Permite listar y crear carritos de compras
    queryset = CarritoDeCompras.objects.all()
    serializer_class = CarritoDeComprasSerializer
    permission_classes = [AllowAny]  # Acceso sin restricciones

class CarritoDeComprasDetail(generics.RetrieveUpdateDestroyAPIView):
    # Permite recuperar, actualizar o eliminar un carrito específico
    queryset = CarritoDeCompras.objects.all()
    serializer_class = CarritoDeComprasSerializer
    permission_classes = [IsAuthenticated]  # Requiere autenticación


# Vistas para manejar los items dentro del carrito
class CartItemListCreate(generics.ListCreateAPIView):
    # Permite listar y crear ítems del carrito
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [AllowAny]  # Acceso sin restricciones

class CartItemDetail(generics.RetrieveUpdateDestroyAPIView):
    # Permite recuperar, actualizar o eliminar un ítem del carrito específico
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]  # Requiere autenticación


# Vistas para manejar órdenes de los usuarios autenticados
class OrdenesListCreate(generics.ListCreateAPIView):
    # Permite listar y crear órdenes asociadas al usuario autenticado
    serializer_class = OrdenesSerializer
    permission_classes = [IsAuthenticated]  # Requiere autenticación

    def get_queryset(self):
        # Filtra las órdenes del usuario que hizo la solicitud
        return Ordenes.objects.filter(Usuarios=self.request.user)

class OrdenesDetail(generics.RetrieveUpdateDestroyAPIView):
    # Permite recuperar, actualizar o eliminar órdenes específicas del usuario autenticado
    serializer_class = OrdenesSerializer
    permission_classes = [IsAuthenticated]  # Requiere autenticación

    def get_queryset(self):
        # Filtra las órdenes del usuario que hizo la solicitud
        return Ordenes.objects.filter(Usuarios=self.request.user)


# Vistas para manejar órdenes desde la perspectiva del administrador
class OrdenesAdminListCreate(generics.ListCreateAPIView):
    # Permite listar y crear todas las órdenes (sin filtrar por usuario)
    queryset = Ordenes.objects.all()
    serializer_class = OrdenesSerializer
    permission_classes = [AllowAny]  # Acceso sin restricciones

class OrdenesAdminDetail(generics.RetrieveUpdateDestroyAPIView):
    # Permite recuperar, actualizar o eliminar órdenes específicas (sin filtrar por usuario)
    queryset = Ordenes.objects.all()
    serializer_class = OrdenesSerializer
    permission_classes = [IsAuthenticated]  # Requiere autenticación


# Vista adicional para obtener las órdenes en detalle para un administrador
def get_ordenes_admin(request):
    # Obtiene las órdenes con detalles completos, incluyendo productos y cantidades
    ordenes = Ordenes.objects.select_related('carrito').prefetch_related('carrito__items__Productos').all()
    data = []
    for orden in ordenes:
        # Procesa los productos dentro de cada orden
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
        # Construye la respuesta de datos
        data.append({
            'id': orden.id,
            'fecha_orden': orden.fecha_orden,
            'estado': orden.estado,
            'usuario_nombre': orden.Usuarios.first_name,
            'usuario_apellido': orden.Usuarios.last_name,
            'email': orden.Usuarios.email,
            'productos': productos,
        })

    return JsonResponse(data, safe=False)  # Retorna un JSON con la información


# Vistas para manejar los pagos
class PagosListCreate(generics.ListCreateAPIView):
    # Permite listar y crear registros de pagos
    queryset = Pagos.objects.all()
    serializer_class = PagosSerializer
    permission_classes = [AllowAny]  # Acceso sin restricciones

class PagosDetail(generics.RetrieveUpdateDestroyAPIView):
    # Permite recuperar, actualizar o eliminar registros de pagos específicos
    queryset = Pagos.objects.all()
    serializer_class = PagosSerializer
    permission_classes = [IsAuthenticated]  # Requiere autenticación




# LoginView es una vista genérica que permite iniciar sesión en el sistema.
# Utiliza un token JWT para autenticar al usuario y generar los tokens de acceso y de actualización.
class LoginView(generics.GenericAPIView):
    # Se permite el acceso a esta vista sin restricciones de permisos.
    permission_classes = [AllowAny]

    def post(self, request):
        # Extrae las credenciales del cuerpo de la solicitud.
        username = request.data.get('username')
        password = request.data.get('password')

        # Intenta autenticar al usuario con las credenciales proporcionadas.
        user = authenticate(request, username=username, password=password)

        if user is not None:
            # Si las credenciales son válidas, inicia sesión al usuario y genera tokens JWT.
            login(request, user)
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        
        # Si las credenciales no son válidas, retorna un error.
        return Response({'error': 'Credenciales inválidas'}, status=400)

# CrearOrdenView permite crear una nueva orden basada en el carrito de compras del usuario.
class CrearOrdenView(APIView):
    def post(self, request):
        # Obtiene el usuario autenticado.
        user = request.user
        carrito_id = request.data.get("carrito_id")

        # Obtiene el carrito asociado al usuario y al ID proporcionado.
        carrito = get_object_or_404(CarritoDeCompras, id=carrito_id, user=user)

        # Crea una nueva orden o obtiene una existente con estado 'pendiente'.
        orden, created = Ordenes.objects.get_or_create(
            Usuarios=user,
            carrito=carrito,
            defaults={'estado': 'pendiente'}
        )

        # Si la orden ya existía, actualiza su estado a 'pendiente'.
        if not created:
            orden.estado = 'pendiente'
            orden.save()

        # Serializa la orden creada y la devuelve en la respuesta.
        serializer = OrdenesSerializer(orden)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# eliminar_pedido es una función que permite eliminar una orden específica.
@csrf_exempt
def eliminar_pedido(request, pedido_id):
    try:
        # Busca la orden por su ID y la elimina.
        pedido = Ordenes.objects.get(id=pedido_id)
        pedido.delete()
        return JsonResponse({"message": "Pedido eliminado con éxito."}, status=200)
    except Ordenes.DoesNotExist:
        # Retorna un error si no se encuentra la orden.
        return JsonResponse({"error": "Pedido no encontrado."}, status=404)

# actualizar_estado_pedido permite actualizar el estado de una orden específica.
@api_view(['PUT'])
def actualizar_estado_pedido(request, pedido_id):
    try:
        # Busca la orden por su ID.
        pedido = Ordenes.objects.get(id=pedido_id)
    except Ordenes.DoesNotExist:
        # Retorna un error si no se encuentra la orden.
        return Response({"error": "Pedido no encontrado"}, status=404)

    # Obtiene el nuevo estado de la orden del cuerpo de la solicitud.
    nuevo_estado = request.data.get('estado')

    # Verifica que el estado proporcionado sea válido.
    if nuevo_estado not in dict(Ordenes.ESTADO_Orden).keys():
        return Response({"error": "Estado no válido"}, status=400)

    # Actualiza el estado de la orden y guarda los cambios.
    pedido.estado = nuevo_estado
    pedido.save()

    # Serializa la orden actualizada y la devuelve en la respuesta.
    serializer = OrdenesSerializer(pedido)
    return Response(serializer.data, status=200)

# usuarioLogueado retorna los datos del usuario autenticado.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def usuarioLogueado(request):
    # Retorna información básica del usuario autenticado.
    user = request.user
    return Response({
        "id_usuario": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }, status=status.HTTP_200_OK)

# UpdateUserView permite al usuario autenticado actualizar sus datos.
class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        # Obtiene el usuario autenticado y los nuevos datos proporcionados.
        user = request.user
        data = request.data

        # Actualiza los campos del usuario con los nuevos valores o mantiene los existentes.
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)

        # Guarda los cambios en la base de datos.
        user.save()

        # Retorna un mensaje de éxito junto con los datos actualizados.
        return Response({
            "message": "Datos actualizados exitosamente.",
            "data": {
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name
            }
        }, status=status.HTTP_200_OK)

# DireccionUpdateView permite actualizar una dirección de envío específica.
class DireccionUpdateView(UpdateAPIView):
    queryset = Direcciones_envio.objects.all()
    serializer_class = Direcciones_envioSerializer

    def update(self, request, *args, **kwargs):
        # Verifica si el usuario está autenticado.
        if not request.user.is_authenticated:
            return Response({"detail": "No autorizado"}, status=status.HTTP_401_UNAUTHORIZED)

        # Obtiene la dirección que se va a actualizar.
        direccion = self.get_object()

        # Verifica que la dirección pertenezca al usuario autenticado.
        if direccion.Usuarios != request.user:
            return Response({"detail": "No autorizado a editar esta dirección"}, status=status.HTTP_403_FORBIDDEN)

        # Valida y actualiza los datos de la dirección.
        serializer = self.get_serializer(direccion, data=request.data, partial=True)

        if serializer.is_valid():
            # Guarda los cambios y retorna los datos actualizados.
            serializer.save()
            return Response(serializer.data)
        else:
            # Retorna los errores de validación si existen.
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

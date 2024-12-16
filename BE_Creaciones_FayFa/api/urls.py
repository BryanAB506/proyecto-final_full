from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import get_users, remove_from_cart, view_cart, CrearOrdenView, delete_user, usuarioLogueado, clear_cart


urlpatterns = [
    #admin ordenes
    path('adminOrdenes/', views.get_ordenes_admin, name='get_ordenes_admin'),
    #eliminar orden
    path('adminOrdenes/<int:pedido_id>/eliminar/', views.eliminar_pedido, name='eliminar_pedido'),
    #crear orden
    path('crear-orden/', CrearOrdenView.as_view(), name='crear-orden'),
    #agregar producto a acarrito
    path('add_to_cart/<int:product_id>/<int:quantity>/', views.add_to_cart, name='add_to_cart'),
    #quitar proudcto carrito
    path('remove_from_cart/<int:product_id>/<int:quantity>/', remove_from_cart, name='remove_from_cart'),
    path('view-cart/', view_cart, name='view_cart'),
    #limpiar cart
    path('cartClear/', clear_cart, name='clear_cart'),
    #user
    path('users/', get_users, name='get_users'),
    # user log
    path('usuarioLog/', usuarioLogueado, name='current_user'),
    #edit user
    path('users/<int:pk>/', delete_user, name='delete_user'),

    # Direcciones de envío
    path('Direcciones_envio/', views.Direcciones_envioListCreate.as_view(), name='Direcciones_envio-list'),
    path('Direcciones_envio/<int:pk>/', views.Direcciones_envioDetail.as_view(), name='Direcciones_envio-detail'),

    # Categorías
    path('categorias/', views.CategoriasListCreate.as_view(), name='Categorias-list'),
    path('categorias/<int:pk>/', views.CategoriasDetail.as_view(), name='Categorias-detail'),

    # Productos
    path('productos/', views.ProductosListCreate.as_view(), name='Productos-list'),
    path('productos/<int:pk>/', views.ProductosDetail.as_view(), name='Productos-detail'),
    # path('productos/<int:producto_id>/imagen/', views.SubirImagenFirestore.as_view(), name='subir-imagen'),

    # Carrito de compras
    path('CarritoDeCompras/', views.CarritoDeComprasListCreate.as_view(), name='CarritoDeCompras-list'),
    path('CarritoDeCompras/<int:pk>/', views.CarritoDeComprasDetail.as_view(), name='CarritoDeCompras-detail'),

    # Carrito de compras
    path('CartItem/', views.CartItemListCreate.as_view(), name='CartItem-list'),
    path('CartItem/<int:pk>/', views.CartItemDetail.as_view(), name='CartItem-detail'),
    
    # Órdenes
    path('Ordenes/', views.OrdenesListCreate.as_view(), name='Ordenes-list'),
    path('Ordenes/<int:pk>/', views.OrdenesDetail.as_view(), name='Ordenes-detail'),
    
    #ordenes admin
    path('OrdenesAdmin/', views.OrdenesAdminListCreate.as_view(), name='OrdenesAdmin-list'),
    path('OrdenesAdmin/<int:pk>/', views.OrdenesAdminDetail.as_view(), name='OrdenesAdmin-detail'),
    #editar estado
    path('actualizar-estado/<int:pedido_id>/', views.actualizar_estado_pedido, name='actualizar_estado_pedido'),

    # Pagos
    path('pagos/', views.PagosListCreate.as_view(), name='Pagos-list'),
    path('pagos/<int:pk>/', views.PagosDetail.as_view(), name='Pagos-detail'),

    # Autenticación y registro
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegistroView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),

]

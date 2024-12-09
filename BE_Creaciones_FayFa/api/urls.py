from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import get_users, remove_from_cart, view_cart


urlpatterns = [
    #agregar producto a acarrito
    path('add_to_cart/<int:product_id>/<int:quantity>/', views.add_to_cart, name='add_to_cart'),
    #quitar proudcto carrito
    path('remove_from_cart/<int:product_id>/<int:quantity>/', remove_from_cart, name='remove_from_cart'),
    path('view-cart/', view_cart, name='view_cart'),
    #user
    path('users/', get_users, name='get_users'),

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

    # Pagos
    path('pagos/', views.PagosListCreate.as_view(), name='Pagos-list'),
    path('pagos/<int:pk>/', views.PagosDetail.as_view(), name='Pagos-detail'),

    # Autenticación y registro
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegistroView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),

]

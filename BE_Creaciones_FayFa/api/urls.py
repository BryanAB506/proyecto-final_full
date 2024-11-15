from django.urls import path, include
from django.contrib import admin
from . import views
from .views import RegistroView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    
    path('Usuarios/', views.UsuariosListCreate.as_view(), name='Usuarios-list'),
    path('Usuarios/<int:pk>/', views.UsuariosDetail.as_view(), name='Usuarios-detail'),
    path('Direcciones_envio/', views.Direcciones_envioListCreate.as_view(), name='Direcciones_envio-list'),
    path('Direcciones_envio/<int:pk>/', views.Direcciones_envioDetail.as_view(), name='Direcciones_envio-detail'),
    path('Categorias/', views.CategoriasListCreate.as_view(), name='Categorias-list'),
    path('Categorias/<int:pk>/', views.CategoriasDetail.as_view(), name='Categorias-detail'),
    path('Productos/', views.ProductosListCreate.as_view(), name='Productos-list'),
    path('Productos/<int:pk>/', views.ProductosDetail.as_view(), name='Productos-detail'),
    path('CarritoDeCompras/', views.CarritoDeComprasListCreate.as_view(), name='CarritoDeCompras-list'),
    path('CarritoDeCompras/<int:pk>/', views.CarritoDeComprasDetail.as_view(), name='CarritoDeCompras-detail'),
    path('Ordenes/', views.OrdenesListCreate.as_view(), name='Ordenes-list'),
    path('Ordenes/<int:pk>/', views.OrdenesDetail.as_view(), name='Ordenes-detail'),
    path('Pagos/', views.PagosListCreate.as_view(), name='Pagos-list'),
    path('Pagos/<int:pk>/', views.PagosDetail.as_view(), name='Pagos-detail'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegistroView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login')
]
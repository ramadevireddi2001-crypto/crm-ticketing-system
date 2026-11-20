from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('tickets/', include('ticketting_app.urls')),

    path('login/', TokenObtainPairView.as_view(),
         name='token_obtain_pair'),

    path('refresh_login/', TokenRefreshView.as_view(),
         name='token_refresh'),
]
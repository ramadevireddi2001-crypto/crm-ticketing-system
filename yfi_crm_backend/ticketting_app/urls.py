from django.urls import path
from . import views

urlpatterns = [
    path("", views.get_tickets, name="ticket_list"),
    path("engineers/", views.get_engineers_list, name="engineers_list"),
    path("<int:id>/", views.get_single_ticket, name="ticket_detail"),
    path("<int:id>/updates/", views.add_ticket_update, name="ticket_update"),
    path("register/", views.register_user, name="register_user"),
]
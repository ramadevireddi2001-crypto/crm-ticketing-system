from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.models import User


from .models import Ticket, TicketUpdate
from .serializers import (
    TicketSerializer,
    RegisterUserSerializer,
    TicketUpdateSerializer,
)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def get_tickets(request):

    if request.method == "GET":

        tickets = Ticket.objects.none()

        if request.user.has_perm("tickets.view_ticket"):

            tickets = Ticket.objects.all()

            if (
                request.user.groups.filter(name="Admin").exists()
                or request.user.groups.filter(name="Manager").exists()
            ):
                pass

            elif request.user.groups.filter(name="Engineer").exists():
                tickets = tickets.filter(assigned_to=request.user)

            else:
                tickets = tickets.filter(user=request.user)

        # Filter by priority
        priority = request.query_params.get("priority")
        if priority:
            tickets = tickets.filter(priority=priority.upper())

        # Filter by customer name
        name = request.query_params.get("name")
        if name:
            tickets = tickets.filter(customer_name__icontains=name)

        # Sorting
        sort_by = request.query_params.get("sort_by", "id")
        sort_order = request.query_params.get("sort_order", "asc")

        if sort_order.lower() == "desc":
            sort_by = "-" + sort_by

        tickets = tickets.order_by(sort_by)

        # Pagination
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(tickets, request)

        serializer = TicketSerializer(page, many=True)

        return paginator.get_paginated_response(serializer.data)

    # POST
    serializer = TicketSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(["GET", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def get_single_ticket(request, id):

    ticket = get_object_or_404(Ticket, id=id)

    full_access = (
        request.user.groups.filter(name="Admin").exists()
        or request.user.groups.filter(name="Manager").exists()
    )

    engineer_access = (
        request.user.groups.filter(name="Engineer").exists()
        and ticket.assigned_to == request.user
    )

    user_access = ticket.user == request.user

    if request.method == "GET":

        if full_access or engineer_access or user_access:

            serializer = TicketSerializer(ticket)
            return Response(serializer.data)

        return Response(
            {"message": "Unauthorized"},
            status=status.HTTP_403_FORBIDDEN,
        )

    elif request.method == "PATCH":

        if full_access or engineer_access:

            serializer = TicketSerializer(
                ticket,
                data=request.data,
                partial=True,
            )

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"message": "Unauthorized"},
            status=status.HTTP_403_FORBIDDEN,
        )

    elif request.method == "DELETE":

        if full_access:

            ticket.delete()

            return Response(
                {"message": "Ticket deleted successfully"},
                status=status.HTTP_204_NO_CONTENT,
            )

        return Response(
            {"message": "Unauthorized"},
            status=status.HTTP_403_FORBIDDEN,
        )


@api_view(["POST"])
def register_user(request):

    serializer = RegisterUserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def add_ticket_update(request, id):

    ticket = get_object_or_404(Ticket, id=id)

    full_access = (
        request.user.groups.filter(name="Admin").exists()
        or request.user.groups.filter(name="Manager").exists()
    )

    engineer_access = (
        request.user.groups.filter(name="Engineer").exists()
        and ticket.assigned_to == request.user
    )

    user_access = ticket.user == request.user

    if not (full_access or engineer_access or user_access):
        return Response(
            {"message": "Unauthorized"},
            status=status.HTTP_403_FORBIDDEN,
        )

    if request.method == "GET":

        updates = TicketUpdate.objects.filter(ticket=ticket)

        serializer = TicketUpdateSerializer(
            updates,
            many=True,
        )

        return Response(serializer.data)

    serializer = TicketUpdateSerializer(data=request.data)

    if serializer.is_valid():

        serializer.save(
            ticket=ticket,
            user=request.user,
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_engineers_list(request):
    if not(request.user.groups.filter(name__in=["Admin", "Manager"]).exists()):
        return Response(
            {"error": "Unauthorized"},
            status=status.HTTP_403_FORBIDDEN,)
    engineers=User.objects.filter(groups__name="Engineer")
    engineers_list=[]
    for engineer in engineers:
        engineers_list.append({
            "id": engineer.id,
            "username": engineer.username
        })
    return Response(engineers_list)


    
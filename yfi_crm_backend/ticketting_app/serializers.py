from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Ticket, TicketUpdate


class DisplayUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class TicketUpdateSerializer(serializers.ModelSerializer):
    user = DisplayUserSerializer(read_only=True)

    class Meta:
        model = TicketUpdate
        fields = ["id", "user", "message", "created_at"]


class TicketSerializer(serializers.ModelSerializer):
    user = DisplayUserSerializer(read_only=True)
    updates = TicketUpdateSerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = [
            "id",
            "user",
            "customer_name",
            "issue_description",
            "priority",
            "status",
            "assigned_to",
            "updates",
        ]


class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "password", "email"]
        extra_kwargs = {
            "password": {
                "write_only": True
            }
        }

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
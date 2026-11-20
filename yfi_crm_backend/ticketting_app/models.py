from django.db import models
from django.contrib.auth.models import User


class Ticket(models.Model):

    class TicketPriority(models.TextChoices):
        HIGH = "HIGH", "High"
        MEDIUM = "MEDIUM", "Medium"
        LOW = "LOW", "Low"
        UNASSIGNED = "UNASSIGNED", "Unassigned"

    class TicketStatus(models.TextChoices):
        OPEN = "OPEN", "Open"
        ASSIGNED = "ASSIGNED", "Assigned"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        RESOLVED = "RESOLVED", "Resolved"

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="tickets",
        default=1
    )

    customer_name = models.CharField(max_length=100)
    issue_description = models.TextField()

    priority = models.CharField(
        max_length=20,
        choices=TicketPriority.choices,
        default=TicketPriority.UNASSIGNED
    )

    status = models.CharField(
        max_length=20,
        choices=TicketStatus.choices,
        default=TicketStatus.OPEN
    )

    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_tickets",
        limit_choices_to={"groups__name": "Engineer"},
    )

    def __str__(self):
        return (
            f"Customer: {self.customer_name} | "
            f"Priority: {self.priority} | "
            f"Status: {self.status}"
        )


class TicketUpdate(models.Model):
    ticket = models.ForeignKey(
        Ticket,
        on_delete=models.CASCADE,
        related_name="updates"
    )

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )

    message = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        username = self.user.username if self.user else "Unknown"
        return f"Update on Ticket {self.ticket.id} by {username}"
import random
from datetime import datetime

from django.contrib.auth.models import User
from django.db import models


class Incident(models.Model):
    PRIORITY_CHOICES = [
        ('HIGH', 'High'),
        ('MEDIUM', 'Medium'),
        ('LOW', 'Low'),
    ]

    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('IN_PROGRESS', 'In Progress'),
        ('CLOSED', 'Closed'),
    ]

    TYPE_CHOICES = [
        ('ENTERPRISE', 'Enterprise'),
        ('GOVERNMENT', 'Government'),
    ]

    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='incidents')
    incident_id = models.CharField(max_length=15, unique=True, editable=False)
    incident_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    reporter_name = models.CharField(max_length=100)
    details = models.TextField()
    reported_date = models.DateTimeField(auto_now_add=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='Open')

    def __str__(self):
        return self.incident_id

    class Meta:
        ordering = ['-reported_date']

    def save(self, *args, **kwargs):
        if not self.incident_id:
            while True:
                incident_id = self.generate_incident_id()
                if not Incident.objects.filter(incident_id=incident_id).exists():
                    self.incident_id = incident_id
                    break
        super().save(*args, **kwargs)

    def generate_incident_id(self):
        random_num = str(random.randint(10000, 99999))
        year = str(datetime.now().year)
        # year = timezone.now().year
        return f'RMG{random_num}{year}'

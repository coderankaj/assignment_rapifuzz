from rest_framework import serializers

from .models import Incident


class IncidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incident
        fields = ['incident_id', 'reporter', 'incident_type', 'reporter_name', 'details', 'reported_date', 'priority', 'status']
        read_only_fields = ['incident_id', 'reported_date']

    def create(self, validated_data):
        incident = Incident.objects.create(**validated_data)
        return incident

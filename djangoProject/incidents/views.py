from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Incident
from .serializers import IncidentSerializer


class IncidentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get_incident_by_id(self, request, incident_id):
        try:
            incident = request.user.incidents.get(incident_id=incident_id)
            serializer = IncidentSerializer(incident)
            return Response(serializer.data)
        except Incident.DoesNotExist:
            return Response({'error': 'Incident not found.'}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, incident_id=None):
        if incident_id:
            # Search for a specific incident by ID
            return self.get_incident_by_id(request, incident_id)

        # If no ID is provided, return all incidents for the user
        incidents = request.user.incidents.all()
        serializer = IncidentSerializer(incidents, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        data['reporter_name'] = request.user.username  # Auto-fill reporter name
        data['reporter'] = request.user.id  # Link the incident to the logged-in user
        serializer = IncidentSerializer(data=data)
        if serializer.is_valid():
            incident = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, incident_id):
        try:
            incident = request.user.incidents.get(incident_id=incident_id)
            if incident.status == 'CLOSED':
                return Response({'error': 'Cannot edit closed incidents.'}, status=status.HTTP_400_BAD_REQUEST)

            serializer = IncidentSerializer(incident, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Incident.DoesNotExist:
            return Response({'error': 'Incident not found.'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, incident_id):
        try:
            incident = request.user.incidents.get(incident_id=incident_id)
            incident.delete()
            return Response({"success": "Incident successfully deleted!"}, status=status.HTTP_200_OK)
        except Incident.DoesNotExist:
            return Response({'error': 'Incident not found.'}, status=status.HTTP_404_NOT_FOUND)

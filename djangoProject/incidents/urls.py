from django.urls import path
from .views import  IncidentAPIView

urlpatterns = [
    path('', IncidentAPIView.as_view(), name='incident-list'),
    path('<str:incident_id>/', IncidentAPIView.as_view(), name='incident-detail'),
]

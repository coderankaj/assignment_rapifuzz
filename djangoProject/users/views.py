import requests
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from users.serializers import UserSerializer


class UserRegistrationAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Create a mutable copy of request.data
        request_data = request.data.copy()
        profile_data = request_data.get('profile', {})
        pincode = profile_data.get('pincode')
        password = request_data.get('password')

        # Validate pincode
        if not pincode:
            raise ValidationError({"pincode": ['This field is required.']})

        # Validate password
        if not password:
            raise ValidationError({"password": ['This field is required.']})

        # API call to get city and country based on pin code
        response = requests.get(f'https://api.postalpincode.in/pincode/{pincode}')
        if response.status_code == 200:
            location_data = response.json()
            if location_data[0]['Status'] == 'Success' and location_data[0]['PostOffice']:
                location_data_first = location_data[0]['PostOffice'][0]
                city = location_data_first.get('District')  # Use District for city
                country = location_data_first.get('Country')
                address = f"{location_data_first.get('Name')}, {city}, {location_data_first.get('State')}-{pincode}"

                # Update profile data
                profile_data['city'] = city
                profile_data['country'] = country
                profile_data['pincode'] = pincode
                profile_data['address'] = address

                # Update the profile in the mutable copy
                request_data['profile'] = profile_data

                # Hash the password before saving
                request_data['password'] = make_password(password)

                # Now use the modified request_data for serialization
                serializer = UserSerializer(data=request_data)
                if serializer.is_valid():
                    user = serializer.save()

                    # Remove the password from the response data
                    user_data = serializer.data
                    user_data.pop('password', None)  # Safely remove the password if it exists

                    return Response({
                        "message": "Account created successfully",
                        "user": user_data
                    }, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error': 'Invalid pincode or no data found.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Failed to retrieve location data'}, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    """
    API View to handle user login and return authentication token.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            # User is authenticated, get or create token
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

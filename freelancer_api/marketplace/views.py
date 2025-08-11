from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import generics, status, permissions, viewsets, serializers, filters
from rest_framework.exceptions import PermissionDenied
from .serializers import ProjectSerializer, BidSerializer
from .models import User, Bid, Project
from rest_framework.serializers import ModelSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated


# Create your views here.
class UserRegistrationSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    # Used create_user() (instead of create()) to name the method/function because 
    # it ensures the password is hashed and not stored in plain text.
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role']
        )
        return user
    
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({
            'token': token.key,
            'user_id': token.user_id,
            'username': token.user.username,
            'role': token.user.role,
        })


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission Only the owner can edit/delete.
    """

    def has_object_permission(self, request, view, obj):
        # SAFE methods (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True
        # Only the project owner (client) can edit/delete
        return obj.client == request.user

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title']
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        # Automatically assign the logged-in user as the client
        serializer.save(client=self.request.user)

    def get_queryset(self):
        queryset = Project.objects.all()
        client = self.request.query_params.get('client')
        if client == 'me':
            queryset = queryset.filter(client=self.request.user)
        return queryset.select_related('client')
    
    def update(self, request, *args, **kwargs):
        project = self.get_object()
        if project.client != request.user:
            raise PermissionDenied("You can only update your own projects.")
        return super().update(request, *args, **kwargs)


class IsFreelancer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'freelancer'

class BidViewSet(viewsets.ModelViewSet):
    queryset = Bid.objects.all()
    serializer_class = BidSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Freelancers see their own bids, clients see bids on their projects
        if self.request.user.role == 'freelancer':
            return Bid.objects.filter(freelancer=self.request.user)
        elif self.request.user.role == 'client':
            return Bid.objects.filter(project__client=self.request.user)
        return Bid.objects.none()
    
    def perform_create(self, serializer):
        # Only freelancers can create bids
        if self.request.user.role != 'freelancer':
            raise PermissionDenied("Only freelancers can create bids.")
        serializer.save(freelancer=self.request.user)
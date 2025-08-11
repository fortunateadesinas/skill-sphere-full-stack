from django.urls import path, include
from .views import RegisterView, CustomAuthToken, ProjectViewSet, BidViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='projects')
router.register(r'bids', BidViewSet, basename='bids')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomAuthToken.as_view(), name='login'),
    path('', include(router.urls)),
]
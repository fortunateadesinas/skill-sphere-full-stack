from rest_framework import serializers
from .models import Project, Bid

class ProjectSerializer(serializers.ModelSerializer):
    client = serializers.StringRelatedField(read_only=True)  # Optional: cleaner response

    class Meta:
        model = Project
        fields = '__all__'  # Serialize all fields of the Project model
        read_only_fields = ['client', 'created_at']  # Make client & created_at read-only

class BidSerializer(serializers.ModelSerializer):
    project = serializers.StringRelatedField()  # shows project title (via __str__)
    freelancer = serializers.StringRelatedField()  # shows freelancer username

    class Meta:
        model = Bid
        fields = '__all__'
        read_only_fields = ['freelancer']
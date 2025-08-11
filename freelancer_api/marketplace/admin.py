from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Project

# Register your models here.

class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),  # Add the role field to the admin form
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role',)}),  # Add the role field to the add form
    )

    list_display = UserAdmin.list_display + ('role',)  # Display the role in the list view

admin.site.register(User, CustomUserAdmin)
admin.site.register(Project)  # Register the Project model

from rest_framework.routers import DefaultRouter
from .views import UserViewSet, OrganizationViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'organizations', OrganizationViewSet)

urlpatterns = router.urls
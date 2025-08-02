from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, JobViewSet

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet)
router.register(r'jobs', JobViewSet)

urlpatterns = router.urls
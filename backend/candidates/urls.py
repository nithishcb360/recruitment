from rest_framework.routers import DefaultRouter
from .views import CandidateViewSet, JobApplicationViewSet, ApplicationActivityViewSet, CandidateNoteViewSet

router = DefaultRouter()
router.register(r'candidates', CandidateViewSet)
router.register(r'applications', JobApplicationViewSet)
router.register(r'activities', ApplicationActivityViewSet)
router.register(r'candidate-notes', CandidateNoteViewSet)

urlpatterns = router.urls
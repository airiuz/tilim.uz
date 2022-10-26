from texttools.routers import CustomRouter
from .views import SessionViewSet

router = CustomRouter(root_view_name='auth-root')
router.register('session', SessionViewSet, basename='session')
urlpatterns = router.urls

# -*- coding: utf-8 -*-

from django.conf.urls import *
#from django.conf.urls.i18n import i18n_patterns
from django.conf.urls import patterns
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from roadtrip.views import *
from roadtrip.importData import *

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^get-poi-info.*', getPOIInfo),
    url(r'^admin/', include(admin.site.urls)),
    #url(r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_ROOT}),
    #url(r'^photologue/', include('photologue.urls')),
    url(r'^import/', importData),
    url(r'^add-to-trip/', addToTrip),
    url(r'^remove-from-trip/', removeFromTrip),
    url(r'^get-trip/', getTrip),
    url(r'^register/', registerUser),
    url(r'^', include('cms.urls')),
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG:
    urlpatterns = patterns('',
      url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
          {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
      url(r'', include('django.contrib.staticfiles.urls')),
    ) + urlpatterns


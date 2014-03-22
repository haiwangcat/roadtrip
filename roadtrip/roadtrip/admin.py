from django.contrib import admin
from roadtrip.models import *
from photologue.models import Photo

class POIInline(admin.StackedInline):
  model = POI
  extra = 0

class POIPhotoInline(admin.StackedInline):
  model = POIPhoto
  extra = 0

class ParkAdmin(admin.ModelAdmin):
  inlines = [POIInline]

class POIAdmin(admin.ModelAdmin):
  inlines = [POIPhotoInline]

admin.site.register(Park, ParkAdmin)
admin.site.register(POI, POIAdmin)
admin.site.register(Trail)
admin.site.register(POIPhoto)
admin.site.register(ThirdPartyMap)

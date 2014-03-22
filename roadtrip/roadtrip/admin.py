from django.contrib import admin
from roadtrip.models import *
from photologue.models import Photo

class POIInline(admin.StackedInline):
  model = POI
  extra = 0

class PhotoInline(admin.StackedInline):
  model = Photo
  extra = 0

class ParkAdmin(admin.ModelAdmin):
  inlines = [POIInline]

class POIAdmin(admin.ModelAdmin):
  inlines = [PhotoInline]

admin.site.register(Park, ParkAdmin)
admin.site.register(POI, POIAdmin)
admin.site.register(Trail)
admin.site.register(POIPhoto)
admin.site.register(ThirdPartyMap)

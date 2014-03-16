from django.contrib import admin
from roadtrip.models import Park
from roadtrip.models import POI

class POIInline(admin.StackedInline):
  model = POI
  extra = 0

class ParkAdmin(admin.ModelAdmin):
  inlines = [POIInline]

admin.site.register(Park, ParkAdmin)
admin.site.register(POI)

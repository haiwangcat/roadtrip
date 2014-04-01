from django.db import models
from photologue.models import Photo

class Park(models.Model):
  name_cn = models.CharField(max_length=100)
  name_en = models.CharField(max_length=100)
  center_gps_coordinate = models.CharField(max_length=50)
  zoom = models.IntegerField(default=10)
  description = models.TextField(blank=True, null=True)

  def __unicode__(self):
    return self.name_cn

class POI(models.Model):
  name_cn = models.CharField(max_length=100)
  name_en = models.CharField(max_length=100)
  gps_coordinate = models.CharField(max_length=50)
  park_id = models.ForeignKey(Park)
  description = models.TextField(blank=True, null=True)
  zoom = models.IntegerField(default=12)
  score = models.IntegerField(default=5)
  parking_gps_coordinate = models.CharField(max_length=50, null=True)
  wiki_link = models.CharField(max_length=200, null=True, blank=True)
  website = models.CharField(max_length=200, null=True, blank=True)
  category = models.CharField(max_length=100, null=True)
  address = models.CharField(max_length=1000, blank=True, null=True)
  ratings = models.FloatField(blank=True, null=True)
  phone_number = models.CharField(max_length=100, blank=True, null=True)
  tags = models.CharField(max_length=1000, blank=True, null=True)
  
  
  def __unicode__(self):
    return self.name_cn

class POIPhoto(Photo):
  poi_id = models.ForeignKey(POI)

  def __unicode__(self):
    return self.title

class Trail(models.Model):
  name_cn = models.CharField(max_length=100)
  name_en = models.CharField(max_length=100)
  poi_id = models.ForeignKey(POI)
  routes = models.TextField(blank=True)
  description = models.TextField(blank=True, null=True)
  zoom = models.IntegerField(default=12)
  score = models.IntegerField(default=5)
  duration = models.IntegerField(default=0)
  distance = models.IntegerField(default=0)
  trail_type = models.IntegerField("Trail Type: One way-0, Loop-1, Other-2.", default=0)

  def __unicode__(self):
    return self.name_cn

class ThirdPartyMap(models.Model):
  name_cn = models.CharField(max_length=100)
  name_en = models.CharField(max_length=100)
  park_id = models.ForeignKey(Park)
  filename = models.CharField(max_length=100)
  gps_southwest_bound = models.CharField(max_length=50) 
  gps_northeast_bound = models.CharField(max_length=50) 
  map_link = models.CharField(max_length=200, default='', null=True) 

  def __unicode__(self):
    return self.name_cn

class Trip(models.Model):
  trip_name = models.CharField(max_length = 1000)
  pois = models.ManyToManyField(POI)
  
  def __unicode__(self):
    return self.trip_name

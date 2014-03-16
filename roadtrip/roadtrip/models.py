from django.db import models

class Park(models.Model):
  name_cn = models.CharField(max_length=100)
  name_en = models.CharField(max_length=100)
  center_gps_coordinate = models.CharField(max_length=50)
  zoom = models.IntegerField(default=10)

  def __unicode__(self):
    return self.name_cn

class POI(models.Model):
  name_cn = models.CharField(max_length=100)
  name_en = models.CharField(max_length=100)
  gps_coordinate = models.CharField(max_length=50)
  park_id = models.ForeignKey(Park)
  description = models.CharField(max_length=5000, default=' ')
  zoom = models.IntegerField(default=10)
  score = models.IntegerField(default=5)
 
  def __unicode__(self):
    return self.name_cn

# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'TripItem'
        db.create_table(u'roadtrip_tripitem', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('trip_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['roadtrip.Trip'])),
            ('poi_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['roadtrip.POI'])),
        ))
        db.send_create_signal(u'roadtrip', ['TripItem'])

        # Deleting field 'Trip.latlng_list'
        db.delete_column(u'roadtrip_trip', 'latlng_list')

        # Deleting field 'Trip.poi_list'
        db.delete_column(u'roadtrip_trip', 'poi_list')


    def backwards(self, orm):
        # Deleting model 'TripItem'
        db.delete_table(u'roadtrip_tripitem')

        # Adding field 'Trip.latlng_list'
        db.add_column(u'roadtrip_trip', 'latlng_list',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=10000),
                      keep_default=False)

        # Adding field 'Trip.poi_list'
        db.add_column(u'roadtrip_trip', 'poi_list',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=10000),
                      keep_default=False)


    models = {
        u'photologue.photo': {
            'Meta': {'ordering': "['-date_added']", 'object_name': 'Photo'},
            'caption': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'crop_from': ('django.db.models.fields.CharField', [], {'default': "'center'", 'max_length': '10', 'blank': 'True'}),
            'date_added': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'date_taken': ('django.db.models.fields.DateTimeField', [], {'null': 'True', 'blank': 'True'}),
            'effect': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'photo_related'", 'null': 'True', 'to': u"orm['photologue.PhotoEffect']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image': ('django.db.models.fields.files.ImageField', [], {'max_length': '100'}),
            'is_public': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'slug': ('django.db.models.fields.SlugField', [], {'unique': 'True', 'max_length': '50'}),
            'tags': ('photologue.models.TagField', [], {'max_length': '255', 'blank': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '50'}),
            'view_count': ('django.db.models.fields.PositiveIntegerField', [], {'default': '0'})
        },
        u'photologue.photoeffect': {
            'Meta': {'object_name': 'PhotoEffect'},
            'background_color': ('django.db.models.fields.CharField', [], {'default': "'#FFFFFF'", 'max_length': '7'}),
            'brightness': ('django.db.models.fields.FloatField', [], {'default': '1.0'}),
            'color': ('django.db.models.fields.FloatField', [], {'default': '1.0'}),
            'contrast': ('django.db.models.fields.FloatField', [], {'default': '1.0'}),
            'description': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'filters': ('django.db.models.fields.CharField', [], {'max_length': '200', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'}),
            'reflection_size': ('django.db.models.fields.FloatField', [], {'default': '0'}),
            'reflection_strength': ('django.db.models.fields.FloatField', [], {'default': '0.6'}),
            'sharpness': ('django.db.models.fields.FloatField', [], {'default': '1.0'}),
            'transpose_method': ('django.db.models.fields.CharField', [], {'max_length': '15', 'blank': 'True'})
        },
        u'roadtrip.park': {
            'Meta': {'object_name': 'Park'},
            'center_gps_coordinate': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name_cn': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name_en': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'zoom': ('django.db.models.fields.IntegerField', [], {'default': '10'})
        },
        u'roadtrip.poi': {
            'Meta': {'object_name': 'POI'},
            'address': ('django.db.models.fields.CharField', [], {'max_length': '1000', 'null': 'True', 'blank': 'True'}),
            'category': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'gps_coordinate': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name_cn': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name_en': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'park_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['roadtrip.Park']"}),
            'parking_gps_coordinate': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True'}),
            'phone_number': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'ratings': ('django.db.models.fields.FloatField', [], {'null': 'True', 'blank': 'True'}),
            'score': ('django.db.models.fields.IntegerField', [], {'default': '5'}),
            'tags': ('django.db.models.fields.CharField', [], {'max_length': '1000', 'null': 'True', 'blank': 'True'}),
            'website': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'wiki_link': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'zoom': ('django.db.models.fields.IntegerField', [], {'default': '12'})
        },
        u'roadtrip.poiphoto': {
            'Meta': {'ordering': "['-date_added']", 'object_name': 'POIPhoto', '_ormbases': [u'photologue.Photo']},
            u'photo_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['photologue.Photo']", 'unique': 'True', 'primary_key': 'True'}),
            'poi_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['roadtrip.POI']"})
        },
        u'roadtrip.thirdpartymap': {
            'Meta': {'object_name': 'ThirdPartyMap'},
            'filename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'gps_northeast_bound': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'gps_southwest_bound': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'map_link': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '200', 'null': 'True'}),
            'name_cn': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name_en': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'park_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['roadtrip.Park']"})
        },
        u'roadtrip.trail': {
            'Meta': {'object_name': 'Trail'},
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'distance': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'duration': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name_cn': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name_en': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'poi_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['roadtrip.POI']"}),
            'routes': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'score': ('django.db.models.fields.IntegerField', [], {'default': '5'}),
            'trail_type': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'zoom': ('django.db.models.fields.IntegerField', [], {'default': '12'})
        },
        u'roadtrip.trip': {
            'Meta': {'object_name': 'Trip'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'trip_name': ('django.db.models.fields.CharField', [], {'max_length': '1000'})
        },
        u'roadtrip.tripitem': {
            'Meta': {'object_name': 'TripItem'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'poi_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['roadtrip.POI']"}),
            'trip_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['roadtrip.Trip']"})
        }
    }

    complete_apps = ['roadtrip']
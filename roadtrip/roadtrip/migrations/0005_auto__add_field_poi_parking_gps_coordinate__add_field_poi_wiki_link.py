# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'POI.parking_gps_coordinate'
        db.add_column(u'roadtrip_poi', 'parking_gps_coordinate',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True),
                      keep_default=False)

        # Adding field 'POI.wiki_link'
        db.add_column(u'roadtrip_poi', 'wiki_link',
                      self.gf('django.db.models.fields.CharField')(max_length=200, null=True),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'POI.parking_gps_coordinate'
        db.delete_column(u'roadtrip_poi', 'parking_gps_coordinate')

        # Deleting field 'POI.wiki_link'
        db.delete_column(u'roadtrip_poi', 'wiki_link')


    models = {
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
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'gps_coordinate': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name_cn': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name_en': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'park_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['roadtrip.Park']"}),
            'parking_gps_coordinate': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True'}),
            'score': ('django.db.models.fields.IntegerField', [], {'default': '5'}),
            'wiki_link': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True'}),
            'zoom': ('django.db.models.fields.IntegerField', [], {'default': '10'})
        }
    }

    complete_apps = ['roadtrip']
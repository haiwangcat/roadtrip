# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'ThirdPartyMap'
        db.create_table(u'roadtrip_thirdpartymap', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name_cn', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('name_en', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('park_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['roadtrip.Park'])),
            ('filename', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('gps_southwest_bound', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('gps_northeast_bound', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('map_link', self.gf('django.db.models.fields.CharField')(max_length=200, null=True)),
        ))
        db.send_create_signal(u'roadtrip', ['ThirdPartyMap'])


    def backwards(self, orm):
        # Deleting model 'ThirdPartyMap'
        db.delete_table(u'roadtrip_thirdpartymap')


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
            'zoom': ('django.db.models.fields.IntegerField', [], {'default': '12'})
        },
        u'roadtrip.thirdpartymap': {
            'Meta': {'object_name': 'ThirdPartyMap'},
            'filename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'gps_northeast_bound': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'gps_southwest_bound': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'map_link': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True'}),
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
        }
    }

    complete_apps = ['roadtrip']
# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Park'
        db.create_table(u'roadtrip_park', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name_cn', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('name_en', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('center_gps_coordinate', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('zoom', self.gf('django.db.models.fields.IntegerField')(default=10)),
        ))
        db.send_create_signal(u'roadtrip', ['Park'])

        # Adding model 'POI'
        db.create_table(u'roadtrip_poi', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name_cn', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('name_en', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('gps_coordinate', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('park_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['roadtrip.Park'])),
            ('description', self.gf('django.db.models.fields.CharField')(default=' ', max_length=5000)),
            ('zoom', self.gf('django.db.models.fields.IntegerField')(default=10)),
            ('score', self.gf('django.db.models.fields.IntegerField')(default=5)),
        ))
        db.send_create_signal(u'roadtrip', ['POI'])


    def backwards(self, orm):
        # Deleting model 'Park'
        db.delete_table(u'roadtrip_park')

        # Deleting model 'POI'
        db.delete_table(u'roadtrip_poi')


    models = {
        u'roadtrip.park': {
            'Meta': {'object_name': 'Park'},
            'center_gps_coordinate': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name_cn': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name_en': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'zoom': ('django.db.models.fields.IntegerField', [], {'default': '10'})
        },
        u'roadtrip.poi': {
            'Meta': {'object_name': 'POI'},
            'description': ('django.db.models.fields.CharField', [], {'default': "' '", 'max_length': '5000'}),
            'gps_coordinate': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name_cn': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name_en': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'park_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['roadtrip.Park']"}),
            'score': ('django.db.models.fields.IntegerField', [], {'default': '5'}),
            'zoom': ('django.db.models.fields.IntegerField', [], {'default': '10'})
        }
    }

    complete_apps = ['roadtrip']
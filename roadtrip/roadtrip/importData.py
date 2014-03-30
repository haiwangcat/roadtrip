# -*- coding: utf-8 -*-

from django.http import HttpResponse
from django.shortcuts import render_to_response
from roadtrip.models import *

import csv

def importData(request):
    csvfile = open('roadtrip/static/yose_poi.csv','rU')
    csvreader = csv.reader(csvfile)
    
    count_saved = 0
    count_unsaved = 0
    
    for row in csvreader:
      poi = POI()
      if row[0] == '' or row[0] == 'name_cn':
        continue
      poi.name_cn = row[0]
      poi.name_en = row[1]
      poi.gps_coordinate = row[2]
      poi.park_id = Park.objects.all().filter(name_en='Yosemite National Park')[0]
      poi.description = row[4]
      poi.zoom = int(row[5])
      poi.score = row[6]
      poi.parking_gps_coordinate = row[7]
      poi.wiki_link = row[8]
      poi.website = row[9]
      poi.category = row[10]
      poi.tags = row[11]
      poi.address = row[12]
      poi.ratings = 0. if row[13].strip() == '' else float(row[13])
      poi.phone_number = row[14].replace('p','')

      if len(POI.objects.all().filter(gps_coordinate=poi.gps_coordinate)) == 1:
        POI.objects.all().filter(gps_coordinate=poi.gps_coordinate)[0].delete()
      print poi.name_cn
      poi.save()

    return HttpResponse('success')
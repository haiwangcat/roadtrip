# -*- coding: utf-8 -*-

from django.http import HttpResponse
from django.shortcuts import render_to_response
from roadtrip.models import *

def getPOIInfo(request):
  if request.is_ajax():
    poi_id = request.GET.get('poi', '')
    poi = POI.objects.all().filter(id=poi_id)[0]
    return render_to_response('info-panel.html', {'poi': poi})

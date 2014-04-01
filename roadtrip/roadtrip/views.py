# -*- coding: utf-8 -*-

from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template.context import RequestContext
from roadtrip.models import *
#from django.template import RequestContext
from django.core.context_processors import csrf

def getPOIInfo(request):
  if request.is_ajax():
    poi_id = request.GET.get('poi', '')
    poi = POI.objects.all().filter(id=poi_id)[0]
    return render_to_response('info-panel.html', {'poi': poi})

def saveTrip(request):
  if request.is_ajax():
    #return render_to_response('park.html', {'message': message}, context_instance = RequestContext(request))
    poi_list = request.POST['pois_name']
    poi_latlng = request.POST['pois_latlng']
    
    trip = Trip()
    trip.trip_name = 'mingchang'
    trip.poi_list = poi_list
    trip.latlng_list = poi_latlng
    if len(Trip.objects.all().filter(trip_name=trip.trip_name)) == 1:
        Trip.objects.all().filter(trip_name=trip.trip_name)[0].delete()
    trip.save() 
    return HttpResponse('trip added: '+ trip.trip_name)
    
def getTrip(request):
  if request.is_ajax():
    trip_name = request.GET.get('trip','')
    trip = Trip.objects.all().filter(trip_name = trip_name)[0]
    return render_to_response('trip-panel.html', {'trip': trip})
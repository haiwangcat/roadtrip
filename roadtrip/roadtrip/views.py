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
    poi = POI.objects.filter(id=poi_id)[0]
    return render_to_response('info-panel.html', {'poi': poi})

def addToTrip(request):
  if request.is_ajax():
    #return render_to_response('park.html', {'message': message}, context_instance = RequestContext(request))
    trip = None
    if len(Trip.objects.all()) == 1:
      trip = Trip.objects.all()[0]
    else:
      trip = Trip(trip_name='mingchang')

    poi_id = request.POST['poi_id']
    poi = POI.objects.get(id=poi_id)
    if len(trip.pois.all().filter(id=poi_id)) > 0:
      return HttpResponse(poi.name_cn + ' is already added to trip: '+ trip.trip_name)

    print dir(trip.pois)
    trip.pois.add(poi)
    trip.save()
    return HttpResponse(poi.name_cn + ' added to trip: '+ trip.trip_name)

def removeFromTrip(request):
  if request.is_ajax():
    trip = None
    if len(Trip.objects.all()) == 1:
      trip = Trip.objects.all()[0]
    else:
      trip = Trip(trip_name='mingchang')

    poi_id = request.POST['poi_id']
    poi = POI.objects.get(id=poi_id)
    trip.pois.remove(poi)
    trip.save()
    return HttpResponse(poi.name_cn + ' removed from trip: '+ trip.trip_name)
    
def getTrip(request):
  if request.is_ajax():
    #trip_id = request.GET.get('trip_id','')
    trip = Trip.objects.all()[0]
    return render_to_response('trip-panel.html', {'trip': trip, 'trip_pois': trip.pois.all()})

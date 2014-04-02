# -*- coding: utf-8 -*-

from django import forms
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.contrib.auth.models import User
#from django.template import RequestContext
from django.core.context_processors import csrf
from django.core.validators import validate_email
from roadtrip.models import *

def registerUser(request):
  if request.is_ajax() and request.method == "POST":
    username = request.POST['username']
    password = request.POST['password']
    password_confirm = request.POST['password_confirm']
    email = request.POST['email']

    if len(username) < 3:
      return HttpResponse(u"用户名不可以少于3个字")
    if len(username) > 16:
      return HttpResponse(u"用户名不可以超过16个字")
    if len(User.objects.filter(username=username)) > 0:
      return HttpResponse(u"该用户已存在")

    try:
      validate_email(request.POST.get("email", ""))
    except forms.ValidationError:
      return HttpResponse(u"邮箱地址不合法")
    if len(User.objects.filter(email=email)) > 0:
      return HttpResponse(u"该邮箱已被注册")

    if password != password_confirm:
      return HttpResponse(u"密码不一致")
    if len(password) < 8:
      return HttpResponse(u"密码不得少于8个字符")
    if len(password) > 50:
      return HttpResponse(u"密码不得长于50个字符")

    User.objects.create_user(username, email, password)
    return HttpResponse("success")

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
      trip = Trip.objects.create(trip_name='mingchang')

    poi_id = request.POST['poi_id']
    poi = POI.objects.get(id=poi_id)
    if len(trip.pois.all().filter(id=poi_id)) > 0:
      return HttpResponse(poi.name_cn + ' is already added to trip: '+ trip.trip_name)

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

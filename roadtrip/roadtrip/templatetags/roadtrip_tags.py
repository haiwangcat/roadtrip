# -*- coding: utf-8 -*-

from django import template
from roadtrip.data import getParkData
from roadtrip.models import *

register = template.Library()

@register.assignment_tag(takes_context=True)
def getPOIs(context, park_id):
  return POI.objects.all().filter(park_id=park_id)

@register.assignment_tag(takes_context=True)
def getTrails(context, poi_id):
  return Trail.objects.all().filter(poi_id=poi_id)

@register.assignment_tag(takes_context=True)
def getPOIPhoto(context, poi_id):
  photos = POIPhoto.objects.all().filter(poi_id=poi_id)
  if len(photos) == 0:
    return None
  return photos[0]

@register.assignment_tag(takes_context=True)
def getPOIPhotoThumbnailURL(context, poi_id):
  photos = POIPhoto.objects.all().filter(poi_id=poi_id)
  if len(photos) == 0:
    return ""
  print photos[0].image
  print dir(photos[0])
  print photos[0].get_absolute_url()
  print photos[0].get_thumnnail_url()
  return photos[0].image

@register.assignment_tag(takes_context=True)
def getParkMap(context, park_id):
  maps = ThirdPartyMap.objects.all().filter(park_id=park_id)
  if len(maps) > 0:
    return maps[0]
  else:
    return None

@register.assignment_tag(takes_context=True)
def getParks(context):
  return Park.objects.all()

@register.assignment_tag(takes_context=True)
def getPark(context, request):
  park_id = request.GET.get('park', '')
  if park_id == '':
    return None
  else:
    return Park.objects.all().filter(id=park_id)[0]

@register.assignment_tag(takes_context=True)
def processDescription(context, desc):
  return desc.split('\n')

'''
@register.simple_tag
def getTopPos(size, index):
    print dir(size)
    return index / 4 * size[1]
    
@register.simple_tag
def getLeftPos(size, index):
    print dir(size)
    return index % 4 * size[0]
    
@register.simple_tag
def showClassInfo(obj):
    print obj.placeholders.all()
    print obj.placeholders.__class__.__name__
    for ph in obj.placeholders.all():
        print ph.__unicode__()
        print ph.id
        print ph.get_plugins()
        #print dir(ph.get_plugins)
    print obj.__class__.__name__

@register.simple_tag
def mul(a, b):
    return a * b

@register.simple_tag
def plus(a, b):
    return a + b

@register.simple_tag
def minus(a, b):
    return a - b

NEWS_PERPAGE = 5

@register.assignment_tag
def isLastPage(p):
    n = len(Entry.objects.get_query_set())
    if n == 0:
        return True
    pageNum = (n - 1) / NEWS_PERPAGE
    return p == pageNum

@register.assignment_tag
def getNews(start=0):
    if start == '':
        start = 0
    start = int(start)
    news = Entry.objects.get_query_set()
    return list(news)[start * NEWS_PERPAGE : min(start + NEWS_PERPAGE, len(news))]

@register.assignment_tag
def getNewsTitle(news):
    return news.entrytitle_set.get(language='zh-cn')

@register.assignment_tag
def getNewsDate(news):
    return str(news.pub_date.year) + "年" + \
        str(news.pub_date.month) + "月" + \
        str(news.pub_date.day) + "日"

@register.assignment_tag
def processNewsContent(content):
    return content.split('\n')
    
@register.filter
def hasVideos(page):
    for ph in page.placeholders.all():
        if ph.slot == "heritage-video":
            if ph.get_plugins().count() == 0:
                return False
    return True
'''

# -*- coding: utf-8 -*-

from django import template
from roadtrip.data import getParkData

register = template.Library()

@register.assignment_tag(takes_context=True)
def getPOI(context, slug):
  return getParkData()[slug].pois

@register.assignment_tag(takes_context=True)
def getParks(context):
  return getParkData().values()

@register.assignment_tag(takes_context=True)
def getParkSlug(context, request):
  return request.GET.get('park', '')

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

# -*- coding: utf-8 -*-

"""
Django settings for roadtrip project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)

import os
gettext = lambda s: s
PROJECT_PATH = os.path.abspath(os.path.dirname(__file__))
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'h@%7&*rtjkan-l0##t7sf=pq3tl=7t(31za$6ym-=fvybp9rlc'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites', 
    'cms',
    'mptt',
    'menus',
    'south',
    'sekizai',
    'photologue',
    'roadtrip',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'cms.middleware.page.CurrentPageMiddleware',
    'cms.middleware.user.CurrentUserMiddleware',
    'cms.middleware.toolbar.ToolbarMiddleware',
    'cms.middleware.language.LanguageCookieMiddleware',
)

SESSION_SERIALIZER = 'django.contrib.sessions.serializers.JSONSerializer'

ROOT_URLCONF = 'roadtrip.urls'

WSGI_APPLICATION = 'roadtrip.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

if False:
  SOUTH_DATABASE_ADAPTERS = {'default':'south.db.mysql'} 
  DATABASES = {
      'default': {
          'ENGINE': 'google.appengine.ext.django.backends.rdbms',
          'INSTANCE': 'upheld-terminus-523:ustrip',
          'NAME': 'ustrip',
          'USER': 'root',
          'ATOMIC_REQUESTS': True,
      }
  }
else:
  DATABASES = {
      'default': {
          'ENGINE': 'django.db.backends.sqlite3',
          'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
          'ATOMIC_REQUESTS': True,
      }
  }

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'zh-cn'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

#STATIC_ROOT = os.path.join(PROJECT_PATH, "static")
STATIC_ROOT = ''
STATIC_URL = "/static/"

STATICFILES_DIRS = (
    os.path.join(PROJECT_PATH, "static"),
)

MEDIA_ROOT = os.path.join(PROJECT_PATH, "media")
MEDIA_URL = "/media/"

TEMPLATE_DIRS = (
    # The docs say it should be absolute path: PROJECT_PATH is precisely one.
    # Life is wonderful!
    os.path.join(PROJECT_PATH, "templates"),
    os.path.join(PROJECT_PATH, "../photologue/templates"),
    os.path.join(PROJECT_PATH, "../sortedm2m/templates"),
)

CMS_TEMPLATES = (
    ('park.html', 'Park'),
    ('trail.html', 'Trail'),
)

LANGUAGES = [
    ('zh-cn', 'Chinese'),
]

CMS_LANGUAGES = [
    ('zh-cn', 'Chinese'),
]

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.i18n',
    'django.core.context_processors.request',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'cms.context_processors.media',
    'sekizai.context_processors.sekizai',
)

SITE_ID = 1

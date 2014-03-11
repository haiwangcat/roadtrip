import csv

class Park:
  def __init__(self, row):
    self.park_id = row[1]
    self.name_en = row[2]
    self.name_cn = row[3]
    self.pois = []
    self.trails = []

  name_cn = ""
  name_en = ""
  park_id = ""
  pois = []
  trails = []


class Trail:
  def __init__(self, row):
    self.trail_type = row[0]
    self.park_id = row[4]
    self.name_cn = row[5]
    self.name_en = row[6]
    self.distance = row[7]
    self.duration = row[8]
    self.routes = row[9]

  trail_type = ""
  name_cn = ""
  name_en = ""
  routes = ""
  distance = 0
  duration = 0

class POI:
  def __init__(self, row):
    self.poi_type = row[0]
    self.park_id = row[1]
    self.poi_id = row[5]
    self.name_cn = row[6]
    self.name_en = row[7]
    self.gps = row[9]
    self.trails = []

  poi_type = ""
  poi_id = ""
  name_cn = ""
  name_en = ""
  gps = ""
  route = ""
  trailIDs = ""
  trails = []
  trail_bounds = []

def getParkData():
  parks = {}
  csvfile = open('roadtrip/static/park.csv', 'rb')
  csvreader = csv.reader(csvfile)
  for row in csvreader:
    if row[0] == '' or row[0] == 'TYPE':
      continue
    park_id = row[1]
    if not parks.has_key(park_id):
      parks[park_id] = Park(row)

    parks[park_id].pois.append(POI(row))
  '''
    for p in pois:
      p.addTrail(poi)
    pois.append(poi)
  '''

  csvfile = open('roadtrip/static/trail.csv', 'rb')
  csvreader = csv.reader(csvfile)
  for row in csvreader:
    if row[0] == '' or row[0] == 'TYPE':
      continue
    park_id = row[4]
    trail = Trail(row)
    parks[park_id].trails.append(trail)
    for poi in parks[park_id].pois:
      if poi.poi_id == row[1]:
        poi.trails.append(trail)

  return parks

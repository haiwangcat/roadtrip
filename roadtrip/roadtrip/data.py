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
  name_cn = ""
  name_en = ""
  routes = []

class POI:
  def __init__(self, row):
    self.poi_type = row[0]
    self.park_id = row[1]
    self.poi_id = row[5]
    self.name_cn = row[6]
    self.name_en = row[7]
    self.gps = row[9]
    self.trails = []
    #if self.poi_type == "POI":
      #self.trailIDs = row[6].split(',')
    #if self.poi_type == "TRAIL":
      #self.route = row[11];

  def addTrail(self, trail):
    if trail.poi_type != "TRAIL":
      return
    if self.trailIDs.count(trail.poi_id) > 0:
      if self.trails.count(trail) == 0:
        self.trails.append(trail)

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

  return parks

def getTrailData():
  pois = []
  csvfile = open('roadtrip/static/park.csv', 'rb')
  csvreader = csv.reader(csvfile)
  for row in csvreader:
    if row[0] == '' or row[0] == 'TYPE':
      continue

#getData()

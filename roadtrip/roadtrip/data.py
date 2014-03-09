import csv

class POI:
  def __init__(self, row):
    self.poi_type = row[0]
    self.poi_id = row[1]
    self.name = row[2]
    self.english_name = row[3]
    self.gps = row[4]
    self.trails = []
    if self.poi_type == "POI":
      self.trailIDs = row[6].split(',')
    if self.poi_type == "TRAIL":
      self.route = row[11];

  def addTrail(self, trail):
    if trail.poi_type != "TRAIL":
      return
    if self.trailIDs.count(trail.poi_id) > 0:
      print len(self.trails)
      if self.trails.count(trail) == 0:
        self.trails.append(trail)

  poi_type = ""
  poi_id = ""
  name = ""
  english_name = ""
  gps = ""
  route = ""
  trailIDs = ""
  trails = []

def getData(name):
  pois = []
  csvfile = open('roadtrip/static/' + name + '.csv', 'rb')
  csvreader = csv.reader(csvfile)
  for row in csvreader:
    if row[0] == '' or row[0] == 'TYPE':
      continue

    poi = POI(row)
    for p in pois:
      p.addTrail(poi)
    pois.append(poi)

  return pois

#getData()

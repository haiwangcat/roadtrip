import csv

class POI:
  def __init__(self, row):
    self.name = row[0]
    self.english_name = row[1]
    self.gps = row[2]

  name = ""
  english_name = ""
  gps = ""

  def getName(self):
    return self.name

def getData():
  places = []
  csvfile = open('roadtrip/static/yosemite.csv', 'rb')
  csvreader = csv.reader(csvfile)
  num = 0
  for row in csvreader:
    poi = POI(row)
    if num > 0:
      places.append(poi)
    num += 1
  return places

#getData()

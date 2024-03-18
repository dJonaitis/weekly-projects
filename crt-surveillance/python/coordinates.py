# this file generates a csv file with the columns: country_name, country_code, lat, long

from geopy.geocoders import Nominatim
import pycountry
import csv


def get_coordinates(country):
    try:
        country_obj = pycountry.countries.get(name=country)
        geolocator = Nominatim(user_agent="arms-trade-app")
        location = geolocator.geocode(country_obj.name)
        return location.latitude, location.longitude
    except AttributeError:
        return None, None


# read csv and write countries to array
countries = []

with open('data/trade-register.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        found = False
        for country in countries:
            if country[0] == row['Recipient']:
                country[1] += float(row['SIPRI_TIV_of_delivered_weapons'])
                found = True
                break
        if not found:
            countries.append([row['Recipient'], float(row['SIPRI_TIV_of_delivered_weapons'])])

print(countries)


# write array to csv with coordinates
# with open('data/usa_export_recipients.csv', 'w', newline='') as csvfile:
#     fieldnames = ['country', 'lat', 'long']
#     writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
#     writer.writeheader()
#     for country in countries:
#         lat, long = get_coordinates(country)
#         writer.writerow({'country': country, 'lat': lat, 'long': long})
    

print(get_coordinates("United States"))

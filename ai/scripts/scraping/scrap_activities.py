import csv
import json
import os
import re
from typing import Any

import requests
from bs4 import BeautifulSoup


class StravaActivityScrapper:
    def __init__(self, url: str) -> None:
        self.__url = url
        self.__distance = None
        self.__elev_gain = None
        self.__moving_time = None
        self.__calories = None
        self.__workout_type = None
        self.__avg_speed = None
        self.__avg_hr = None

    @property
    def url(self):
        return self.__url

    @url.setter
    def url(self, url: str):
        self.__url = url

    @property
    def distance(self):
        return self.__distance

    @distance.setter
    def distance(self, distance: float):
        self.__distance = distance

    @property
    def elev_gain(self):
        return self.__elev_gain

    @elev_gain.setter
    def elev_gain(self, elev_gain: float):
        self.__elev_gain = elev_gain

    @property
    def moving_time(self):
        return self.__moving_time

    @moving_time.setter
    def moving_time(self, moving_time: float):
        self.__moving_time = moving_time

    @property
    def calories(self):
        return self.__calories

    @calories.setter
    def calories(self, calories: float):
        self.__calories = calories

    @property
    def workout_type(self):
        return self.__workout_type

    @workout_type.setter
    def workout_type(self, workout_type: str):
        self.__workout_type = workout_type

    @property
    def avg_speed(self):
        return self.__avg_speed

    @avg_speed.setter
    def avg_speed(self, avg_speed: float):
        self.__avg_speed = avg_speed

    @property
    def avg_hr(self):
        return self.__avg_hr

    @avg_hr.setter
    def avg_hr(self, avg_hr: float):
        self.__avg_hr = avg_hr

    def scrape(self, xp_session_identifier: str, _strava4_session: str) -> dict[str, Any] | None:
        cookies = {
            'xp_session_identifier': xp_session_identifier,
            '_strava4_session': _strava4_session,
        }

        response = requests.get(self.url, cookies=cookies)
        soup = BeautifulSoup(response.content, 'html.parser')

        if response.status_code == 429:
            print("Too many requests")

        pattern = r'pageView\.activity\(\)\.set\(\s*(\{[\s\S]*?\})\s*\)'
        matches = re.finditer(pattern, str(soup))

        try:
            next(matches)
            second_match = next(matches)
            data_str = second_match.group(1)

            # Clean data - improved to preserve numerical and boolean values
            data_str = re.sub(r'([{,])\s*(\w+):', r'\1"\2":', data_str)
            data_str = re.sub(r':\s*\'([^\']*?)\'', r':"\1"', data_str)

            # Fix for numerical values (preserve decimal numbers)
            data_str = re.sub(r':\s*([-+]?\d+\.\d+)([,}])', r':\1\2', data_str)

            # Fix for integer values
            data_str = re.sub(r':\s*([-+]?\d+)([,}])', r':\1\2', data_str)

            # Fix for boolean values
            data_str = re.sub(r':\s*(true|false)([,}])', r':\1\2', data_str)

            # Fix for null values
            data_str = re.sub(r':\s*null([,}])', r':null\1', data_str)

            try:
                json_data = json.loads(data_str)

                # Extract data and assign them to instance variables
                self.distance = json_data.get('distance')
                self.elev_gain = json_data.get('elevation_gain') or json_data.get('elev_gain')
                self.moving_time = json_data.get('moving_time')
                self.calories = json_data.get('calories')
                self.workout_type = json_data.get('workout_type')
                self.avg_speed = json_data.get('average_speed') or json_data.get('avg_speed')
                self.avg_hr = json_data.get('average_heartrate') or json_data.get('avg_hr')

                print(f"Scraping {self.url} completed successfully. ✅")

                return {
                    'distance': self.distance,
                    'elev_gain': self.elev_gain,
                    'moving_time': self.moving_time,
                    'calories': self.calories,
                    'workout_type': self.workout_type,
                    'avg_speed': self.avg_speed,
                    'avg_hr': self.avg_hr
                }

            except json.JSONDecodeError as e:
                print(f"Error while decoding JSON: {e} ❌")
                print(f"Bad characters: {data_str} ❌")
                return None

        except StopIteration:
            print("No second match found. ❌")
            return None

    def save_to_csv(self) -> None:
        if not self.distance or not self.elev_gain or not self.moving_time or not self.calories or self.workout_type != 0:
            print("Missing data or activity is not running, cannot save to CSV. ❌")
            return

        file_exists = os.path.isfile('data/activity_data.csv')

        with open('data/activity_data.csv', mode='a', newline='') as file:
            writer = csv.writer(file)
            if not file_exists:
                writer.writerow(['Distance', 'Elevation Gain', 'Moving Time', 'Calories',
                                 'Workout Type', 'Average Speed', 'Average Heart Rate'])
            writer.writerow([self.distance, self.elev_gain, self.moving_time,
                             self.calories, self.workout_type, self.avg_speed, self.avg_hr])

        file.close()
        print("Data saved to activity_data.csv successfully. ✅")

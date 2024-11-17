import json
from typing import List, Tuple
from datetime import datetime

from functools import cache


class Config:
    required_settings = [
        "HeathrowLat",
        "HeathrowLong",
        "latOffset",
        "longOffset",
        "xLength",
        "yLength",
        "knownTimes",
        "states"
    ]

    def __init__(self, config_file_path: str):
        with open(config_file_path, "r") as f:
            self._config = json.load(f)

        for setting in self.required_settings:
            if setting not in self._config:
                raise ValueError(
                    f"Config({config_file_path}) has no value for {setting}."
                )

    @cache
    def get_known_times(self) -> List[Tuple[Tuple[datetime, datetime], int]]:
        """
        Get time ranges where we know the state.

        Returns:
            list((datetime,datetime),int): A tuple (start,end) and the state (as the index of the state)
        """
        times = []  # (datetime,datetime),value
        raw_times = self._config["knownTimes"]
        for known_time in raw_times:
            start = datetime.fromisoformat(known_time["start"])
            end = datetime.fromisoformat(known_time["end"])

            times.append(((start, end), known_time["value"]))
        return times
    
    def get_states(self):
        return self._config["states"]

    def get_heathrow_lat(self):
        return self._config["HeathrowLat"]

    def get_heathrow_long(self):
        return self._config["HeathrowLong"]

    def get_lat_offset(self):
        return self._config["latOffset"]

    def get_long_offset(self):
        return self._config["longOffset"]

    def get_x_length(self):
        return self._config["xLength"]

    def get_y_length(self):
        return self._config["yLength"]

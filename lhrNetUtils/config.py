import json


class Config:
    required_settings = ["HeathrowLat", "HeathrowLong", "latOffset", "longOffset"]

    def __init__(self, config_file_path: str):
        with open(config_file_path, "r") as f:
            self._config = json.load(f)

        for setting in self.required_settings:
            if setting not in self._config:
                raise ValueError(
                    f"Config({config_file_path}) has no value for {setting}."
                )

    def get_heathrow_lat(self):
        return self._config["HeathrowLat"]

    def get_heathrow_long(self):
        return self._config["HeathrowLong"]

    def get_lat_offset(self):
        return self._config["latOffset"]

    def get_long_offset(self):
        return self._config["longOffset"]

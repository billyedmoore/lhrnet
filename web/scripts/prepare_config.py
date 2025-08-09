from pathlib import Path
import json

def main():
    config_path = Path(__file__).parent / ".." / ".." / "config.json"
    web_config_path = Path(__file__).parent / ".." / "src" / "assets" / "prediction-config.json"

    if not config_path.is_file():
        print(config_path)
        raise ValueError("Expected `config.json` is missing.")

    with open(config_path, "r") as f:
        config = json.load(f)

    del config["knownStatesFile"]

    with open(web_config_path, "w") as f:
        json.dump(config,f,indent=4)

if __name__ == "__main__":
    main()

#!/bin/python3

import requests
import json

# URL of the API
url = "https://api.jolpi.ca/ergast/f1/2025/driverstandings.json"


def get_driver_standings():

    # Make the API call
    response = requests.get(url)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        data = response.json()
        
        # Save the JSON data to a file
        with open("driver_standings_2025.json", "w") as json_file:
            driver_standings_data = data
        print("JSON data saved to driver_standings_2025.json")
    else:
        print(f"Failed to fetch data. HTTP Status Code: {response.status_code}")

    # Open the predictions.json file
    with open("./scripts/predictions.json", "r") as predictions_file:
        predictions_data = json.load(predictions_file)
        print("Predictions data loaded successfully")


        # Access the driver standings data
        driver_standings = driver_standings_data["MRData"]["StandingsTable"]["StandingsLists"][0]["DriverStandings"]

        # Initialize a variable to store the total difference in positions
        total_position_difference = 0

        for player, predictions in predictions_data["player_predicts"].items():
            total_position_difference = 0
            for driver in driver_standings:
                driver_family_name = driver["Driver"]["familyName"]
                driver_position = int(driver["position"])
                predicted_position = predictions.index(driver_family_name) + 1
                position_difference = abs(driver_position - predicted_position)
                total_position_difference += position_difference


            print(f"Data saved to standings_and_predictions.json")
            print(f"{player}: Total difference in positions: {total_position_difference}")

        # Create a dictionary to store the data
        standings_and_predictions = {
            "current_standings": [],
            "players": {}
        }

        # Add current standings to the dictionary
        for driver in driver_standings:
            standings_and_predictions["current_standings"].append({
                "driver": driver["Driver"]["familyName"],
                "position": int(driver["position"])
            })

        # Add players' predictions and position differences to the dictionary
        for player, predictions in predictions_data["player_predicts"].items():
            standings_and_predictions["players"][player] = []
            total_position_difference = 0
            for driver in driver_standings:
                driver_family_name = driver["Driver"]["familyName"]
                driver_position = int(driver["position"])
                predicted_position = predictions.index(driver_family_name) + 1
                position_difference = abs(driver_position - predicted_position)
                total_position_difference += position_difference
                for predicted_driver in predictions:
                    for driver in driver_standings:
                        if driver["Driver"]["familyName"] == predicted_driver:
                            driver_position = int(driver["position"])
                            predicted_position = predictions.index(predicted_driver) + 1
                            position_difference = abs(driver_position - predicted_position)
                            standings_and_predictions["players"][player].append({
                                "driver": predicted_driver,
                                "predicted_position": predicted_position,
                                "actual_position": driver_position,
                                "position_difference": position_difference
                            })
                            break
            standings_and_predictions["players"][player].append({
                "total_position_difference": total_position_difference
            })

        #Save the dictionary to a JSON file
        with open("./scripts/standings_and_predictions.json", "w") as output_file:
            json.dump(standings_and_predictions, output_file, indent=4)

        print("Data saved to standings_and_predictions.json")
        # return standings_and_predictions


get_driver_standings()
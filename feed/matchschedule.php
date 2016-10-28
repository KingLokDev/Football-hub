<?php
	// ini_set('display_errors', 'On');

	createJsonFile();

	function createJsonFile() {
		$response = array();
		//$xml_content = file_get_contents('test_matchschedule.xml');
		$xml_content = file_get_contents('https://api.hkfa.com/yahoo?k=Sx2SAsmCnvt6eF7hLneWfgVas9tn3x&action=mr&lang=ch');
		if ($xml_content === false || strpos($xml_content, '<') !== 0) {
			die();
		}
		$xml = simplexml_load_string($xml_content);
		/*$xml = simplexml_load_string(file_get_contents('matchschedule.xml'));*/
		$match = xml2array($xml);

		foreach ($match as $index=>$sub_march) {
			$basic = $sub_march['Basic'];
			$event = null;
			$final_point = explode(':', $basic['final_point']);
			$half_point = explode(':', $basic['half_point']);
			$home_team = array(
				'id' => $basic['home_team_id'],
				'club_id' => $basic['home_club_id'],
				'name' => $basic['home_team'],
				'final_point' => intval($final_point[0]),
				'half_point' => intval($half_point[0])
			);
			$guest_team = array(
				'id' => $basic['guest_team_id'],
				'club_id' => $basic['guest_club_id'],
				'name' => $basic['guest_team'],
				'final_point' => intval($final_point[1]),
				'half_point' => intval($half_point[1])
			);

			if (array_key_exists('Event', $sub_march)) {
				$event = $sub_march['Event'];
			}

			if (array_key_exists('home_player', $basic) && array_key_exists('player', $basic['home_player'])) {
				$home_team['players'] = exportPlayers($basic['home_player']['player'], $event, 'home_goal', 'home_yellowcard', 'home_redcard');
			}
			if (array_key_exists('guest_player', $basic) && array_key_exists('player', $basic['guest_player'])) {
				$guest_team['players'] = exportPlayers($basic['guest_player']['player'], $event, 'guest_goal', 'guest_yellowcard', 'guest_redcard');
			}

			if ($event !== null) {
				$event = $sub_march['Event'];

				if (array_key_exists('home_goal', $event)) {
					$home_team['event_goals'] = exportEventGoal($event['home_goal']);
				}
				if (array_key_exists('guest_goal', $event)) {
					$guest_team['event_goals'] = exportEventGoal($event['guest_goal']);
				}
			}

			$response_item = array(
				'match_id' => intval($basic['match_id']),
				'status' => strtolower($basic['status']),
				'status_id' => intval($basic['status_id']),
				'date' => $basic['date'],
				'time' => date('H:i', strtotime($basic['time'])),
				'final_point' => $basic['final_point'],
				'half_point' => $basic['half_point'],
				'league' => array(
					'id' => $basic['leagueyear_id'],
					'name' => $basic['league_name']
				),
				'venue' => array(
					'id' => $basic['venue_id'],
					'name' => $basic['venue']
				),
				'round' => $basic['round'],
				'home_team' => $home_team,
				'guest_team' => $guest_team
			);


			array_push($response, $response_item);
		}

		/*header('Content-Type: application/json');
		echo json_encode($response);*/
		$matchschedule = fopen('matchschedule.json', 'w') or die('Unable to open file!');
		// $matchschedule = fopen('matchschedule_1.json', 'w') or die('Unable to open file!');
		fwrite($matchschedule, json_encode($response));
		fclose($matchschedule);
	}

	function xml2array($xml) {
		$arr = array();

		foreach ($xml as $element) {
			$tag = $element->getName();
			$e = get_object_vars($element);
			if (!empty($e)) {
				$arr[$tag] = $element instanceof SimpleXMLElement ? xml2array($element) : $e;
			} else {
				$arr[$tag] = trim($element);
			}
		}

		return $arr;
	}

	function exportPlayers($players, $event, $event_goal_index, $yellowcard_index, $redcard_index) {
		$response = array();
		$hasEvent = $event !== null;
		$hasYellowcard = array_key_exists($yellowcard_index, $event);
		$hasRedcard = array_key_exists($redcard_index, $event);

		foreach ($players as $index=>$player) {
			$item = array(
				'id' => $player['player_id'],
				'jersey' => $player['player_jersey'],
				'name' => $player['name']
			);
			$goal_count = 0;
			$yellowcard_count = 0;
			$redcard_count = 0;

			if ($hasEvent) {
				$event_goal = $event[$event_goal_index];

				foreach ($event_goal as $index=>$goal) {
					if ($player['player_id'] === $goal['player_id']) {
						$goal_count++;
					}
				}
			}
			if ($hasYellowcard) {
				$yellowcards = $event[$yellowcard_index];

				foreach ($yellowcards as $index=>$yellowcard) {
					if ($player['player_id'] === $yellowcard['player_id']) {
						$yellowcard_count++;
					}
				}
			}
			if ($hasRedcard) {
				$redcards = $event[$redcard_index];

				foreach ($redcards as $index=>$redcard) {
					if ($player['player_id'] === $redcard['player_id']) {
						$redcard_count++;
					}
				}
			}

			$item['goal'] = $goal_count;
			$item['yellowcard'] = $yellowcard_count;
			$item['redcard'] = $redcard_count;

			array_push($response, $item);
		}

		return $response;
	}

	function exportEventGoal($event_goals) {
		$response = array();

		foreach ($event_goals as $index=>$event) {
			array_push($response, array(
				'id' => $event['player_id'],
				'name' => $event['name'],
				'jersey' => $event['player_jersey'],
				'type' => $event['type'],
				'time' => $event['time']
			));
		}

		return $response;
	}
?>

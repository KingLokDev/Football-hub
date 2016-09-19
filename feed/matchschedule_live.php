<?php
	// ini_set('display_errors', 'On');

	include_once('matchschedule.php');
	include_once('matchschedule_common.php');

	$response = array();
	$data = json_decode(file_get_contents('matchschedule.json'), true);
	$match_id = null;

	if (isset($_GET['match_id']) && preg_match('/^\d+$/', $_GET['match_id']) === 1) {
		$match_id = $_GET['match_id'];
	}

	foreach ($data as $index=>$match) {
		
		if (checkMatch($match, $match_id)) {
			$response['home_team'] = array(
				'id' => $match['home_team']['id'],
				'name' => $match['home_team']['name'],
				'players' => $match['home_team']['players']
			);
			$response['guest_team'] = array(
				'id' => $match['guest_team']['id'],
				'name' => $match['guest_team']['name'],
				'players' => $match['guest_team']['players']
			);

			$home_event_goal_count = 0;
			$guest_event_goal_count = 0;

			if (array_key_exists('event_goals', $match['home_team'])) {
				countScore($match['home_team']['event_goals'], $home_event_goal_count, $guest_event_goal_count);
				// $home_event_goal_count = count($match['home_team']['event_goals']);
			}
			if (array_key_exists('event_goals', $match['guest_team'])) {
				countScore($match['guest_team']['event_goals'], $guest_event_goal_count, $home_event_goal_count);
				// $guest_event_goal_count = count($match['guest_team']['event_goals']);
			}

			$response['home_team']['score'] = $home_event_goal_count;
			$response['guest_team']['score'] = $guest_event_goal_count;

			break;
		}
	}
	
	include_once('access_control_allow_origin.php');
	header('Content-Type: application/json');
	echo json_encode($response);

	function checkMatch($match, $match_id) {
		if ($match_id !== null) {
			return $match_id == $match['match_id'];
		} else {
			return $match['status_id'] === 5;
		}

		return false;
	}
?>
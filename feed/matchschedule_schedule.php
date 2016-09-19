<?php
	include_once('matchschedule_common.php');

	$response = array();
	$data = json_decode(file_get_contents('matchschedule.json'), true);

	foreach ($data as $index=>$match) {
		$response_item = array(
			'match_date' => $match['date'],
			'match_time' => $match['time'],
			'match_id' => $match['match_id'],
			'game' => $match['league']['name'],
			'location' => $match['venue']['name'],
			'week' => $match['round'],
			'home_team' => array(
				'id' => $match['home_team']['id'],
				'name' => $match['home_team']['name']
			),
			'guest_team' => array(
				'id' => $match['guest_team']['id'],
				'name' => $match['guest_team']['name']
			)
		);

		if ($response_item['week'] === null) {
			$response_item['week'] = '-';
		}

		$home_event_goal_count = '-';
		$guest_event_goal_count = '-';

		if (array_key_exists('event_goals', $match['home_team'])) {
			countScore($match['home_team']['event_goals'], $home_event_goal_count, $guest_event_goal_count);
			// $home_event_goal_count = count($match['home_team']['event_goals']);
		} else if($match['status_id']=="1") {
			$home_event_goal_count = 0;
		}
		if (array_key_exists('event_goals', $match['guest_team'])) {
			countScore($match['guest_team']['event_goals'], $guest_event_goal_count, $home_event_goal_count);
			// $guest_event_goal_count = count($match['guest_team']['event_goals']);
		} else if($match['status_id']=="1") {
			$guest_event_goal_count = 0;
		}

		$response_item['home_team']['score'] = $home_event_goal_count;
		$response_item['guest_team']['score'] = $guest_event_goal_count;

		array_push($response, $response_item);
	}

	include_once('access_control_allow_origin.php');
	header('Content-Type: application/json');
	echo json_encode($response);
?>

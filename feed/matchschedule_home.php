<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');  
	include_once('matchschedule.php');
	include_once('matchschedule_common.php');

	$now = new DateTime(date('Y-m-d'));
	$count = 3;
	$response = array();
	$data = json_decode(file_get_contents('matchschedule.json'), true);

	foreach ($data as $index=>$match) {
		$date = new DateTime($match['date']);

		if ($date >= $now) {
			$response_item = array(
				'match_id' => $match['match_id'],
				'sys_date' => $now->format('Y-m-d'),
				'match_date' => $match['date'],
				'home_team' => array(
					'id' => $match['home_team']['id'],
					'club_id' => $match['home_team']['club_id'],
					'name' => $match['home_team']['name']
				),
				'guest_team' => array(
					'id' => $match['guest_team']['id'],
					'club_id' => $match['guest_team']['club_id'],
					'name' => $match['guest_team']['name']
				)
			);
			$response_item['status_id'] = $match['status_id'];
			$response_item['match_time'] = $match['time'];
			if ($match['status_id'] !== 5 && $match['status_id'] !== 7 && $match['status_id'] !== 1) {
				$response_item['match_time'] = $match['time'];
			} else {
				
				//if($match['status_id']===5) {
					$response_item['live'] = $match['status_id'];
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

					$response_item['home_team']['score'] = $home_event_goal_count;
					$response_item['guest_team']['score'] = $guest_event_goal_count;
				//}

			}

			array_push($response, $response_item);

			$count--;
		}

		if ($count === 0) {
			break;
		}
	}

	include_once('access_control_allow_origin.php');
	header('Content-Type: application/json');
	echo json_encode($response);
?>

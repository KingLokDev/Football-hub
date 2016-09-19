<?php
	function countScore($event_goals, &$team_1, &$team_2) {
		if (!is_int($team_1)) {
			$team_1 = 0;
		}
		if (!is_int($team_2)) {
			$team_2 = 0;
		}

		foreach ($event_goals as $goal) {
			if (strtoupper($goal['type']) !== 'OG') {
				$team_1++;
			} else {
				$team_2++;
			}
		}
	}
?>
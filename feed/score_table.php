<?php
header('Content-Type: text/json; charset=utf-8');
  $feed = "https://api.hkfa.com/yahoo?k=Sx2SAsmCnvt6eF7hLneWfgVas9tn3x&action=st&lang=ch";
 	//$feed = "https://yahoo-promotion.myguide.hk/tumblr/football-hub/feed/tmp/score_table.xml";
  function get_xml_from_feed($path) {
    $ch = curl_init();
  	curl_setopt($ch, CURLOPT_URL,$path);
  	curl_setopt($ch, CURLOPT_FAILONERROR,1);
  	//curl_setopt($ch, CURLOPT_FOLLOWLOCATION,1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
  	curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
  	//curl_setopt($ch, CURLOPT_TIMEOUT, 15);
  	$retValue = curl_exec($ch);
  	curl_close($ch);

  	return simplexml_load_string($retValue);
  }

  $xml = get_xml_from_feed($feed);
  //$xml = simplexml_load_file("tmp/score_table.xml");
  $return  = array(
    'total' => 0,
    'data' => array()
  );
  if(!empty($xml)) {
    foreach($xml AS $item) {
      if(
        isset($item->position) && !empty($item->position) &&
        isset($item->club_name) && !empty($item->club_name)
      ) {
        $return['data'][] = array(
          'position' => (string)$item->position,
          'club_name' => (string)$item->club_name,
          'club_id' => (string)$item->club_id,
          'game' => (isset($item->game) && !empty($item->game)) ? (int)$item->game :0,
          'win' => (isset($item->win) && !empty($item->win)) ? (int)$item->win :0,
          'draw' => (isset($item->draw) && !empty($item->draw)) ? (int)$item->draw :0,
          'loss' => (isset($item->loss) && !empty($item->loss)) ? (int)$item->loss :0,
          'goal_gain' => (isset($item->goal_gain) && !empty($item->goal_gain)) ? (int)$item->goal_gain :0,
          'goal_loss' => (isset($item->goal_loss) && !empty($item->goal_loss)) ? (int)$item->goal_loss :0,
          'goal_diff' => (isset($item->goal_diff) && !empty($item->goal_diff)) ? (int)$item->goal_diff :0,
          'point' => (isset($item->point) && !empty($item->point)) ? (int)$item->point :0
        );
        $return['total']++;
      }
    }
  }
  echo $_GET['callback'] . '(' . json_encode($return) . ')';
?>

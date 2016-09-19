<?php
//header('Content-Type: application/rss+xml; charset=utf-8');
  function get_xml_from_feed($path) {
    $ch = curl_init();
  	curl_setopt($ch, CURLOPT_URL,$path);
  	curl_setopt($ch, CURLOPT_FAILONERROR,1);
  	curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
  	$retValue = curl_exec($ch);
  	curl_close($ch);
  	return ($retValue);
  }
  
  $feed = "https://api.hkfa.com/yahoo?k=Sx2SAsmCnvt6eF7hLneWfgVas9tn3x&action=n&lang=ch";
  $feed_en = "https://api.hkfa.com/yahoo?k=Sx2SAsmCnvt6eF7hLneWfgVas9tn3x&action=n&lang=en";
  
  $tmp_base_url = "/home/www/promo.ynet.vicosys.com.hk/htdocs/tumblr/football-hub/feed/";
  $tmp_news_feed_dir = $tmp_base_url . "news/";
  
	$tmp = get_xml_from_feed($feed);
	if(!empty($tmp)) {
		
		
		
		// File will be pushed to production server
		$tmp_news_file = "news.xml";
		$tmp_news_feed = $tmp_news_feed_dir . $tmp_news_file;
		
		//Daily Backup Feed
		$tmp_news_bak_file = date("Y/m/");
		$tmp_news_bak_feed = $tmp_news_feed_dir . $tmp_news_bak_file . date("Ymd") . ".xml";
		
		//Create Backup Dir if not exist
		if(!file_exists(dirname($tmp_news_bak_feed))) {
			echo dirname($tmp_news_bak_feed);
			mkdir(dirname($tmp_news_bak_feed), 0775, true);
		}
		
		file_put_contents($tmp_news_bak_feed, $tmp); 
		file_put_contents($tmp_news_feed, $tmp); 
	}
  
  $tmp_en = get_xml_from_feed($feed_en);
	if(!empty($tmp_en)) {		
		// File will be pushed to production server
		$tmp_news_file_en = "news_en.xml";
		$tmp_news_feed_en = $tmp_news_feed_dir . $tmp_news_file_en;
		
		//Daily Backup Feed
		$tmp_news_bak_feed_en = $tmp_news_feed_dir . $tmp_news_bak_file . date("Ymd") . "_en.xml";
		
		file_put_contents($tmp_news_bak_feed_en, $tmp_en); 
		file_put_contents($tmp_news_feed_en, $tmp_en); 
	}
?>

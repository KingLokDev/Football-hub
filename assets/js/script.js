// Common List item VARIABLE
var cli_title_text_limit = 30;
var cli_desc_text_limit = 60;
var live_match_id = new Array();
var live_match_id_oncc = new Array();
var blog_hostname = window.location.hostname;
var tumblr_api_key = tumblr_api_key || "zipyXRiIyglyjlAnBcngTw5ifMs5T1VAsO6AUWUbik2Vz81fCz";
var tmp_api_url = "//api.tumblr.com/v2/blog/"+blog_hostname+"/posts";
var tumblr_blog_avator = "https://api.tumblr.com/v2/blog/__reblogFromName__.tumblr.com/avatar";

var max_top_post = 3;
var top_post_container_selector = "#top-posts .container-fluid .row";

var init_post_stream_lrec1 = true;
var init_post_stream_lrec2 = true;

var init_load_more_native = true;

var menu_item = {
	"nav-1":{url:"/", label:"首頁"},
	"nav-2":{url:"/live", label:"直播"},
	"nav-3":{url:"/tagged/video", label:"精華"},
	"nav-4":{url:"/schedule", label:"賽程表"},
	"nav-5":{url:"/chart", label:"積分榜"},
	"nav-6":{url:"/info", label:"球會"},
	"nav-7":{url:"/tagged/slideshow", label:"圖輯"}
};

var more_article_offset = 0;
var more_article_limit = 8;
var more_article_max = 999999999;

var allow_retrieve_post = true;	



$(document).ready(function() {
	/* Loading Menu */
	$('body').prepend('<div id="y-header" class="noselect"> <div class="nav"> <ul> <li><a href="https://hk.yahoo.com/" target="_blank"><span class="icon_home"></span>首頁</a></li><li><a href="https://hk.mail.yahoo.com/" target="_blank">Mail</a></li><li><a href="https://hk.news.yahoo.com/" target="_blank">新聞</a></li><li><a href="https://hk.finance.yahoo.com/" target="_blank">財經</a></li><li><a href="https://hk.style.yahoo.com/" target="_blank">Style</a></li><li><a href="https://hk.celebrity.yahoo.com/" target="_blank">娛樂圈</a></li><li><a href="https://movie.yahoo-leisure.hk/" target="_blank">電影</a></li><li><a href="https://hk.sports.yahoo.com/" target="_blank">體育</a></li><li><a href="http://www.flickr.com/" target="_blank">Flickr</a></li><li><a href="http://hk.dictionary.yahoo.com/" target="_blank">字典</a></li><li><a href="http://hk.auctions.yahoo.com/" target="_blank">拍賣</a></li><li><a href="http://hk.deals.yahoo.com/hong-kong/" target="_blank">團購</a></li><li class="nav_more"> <a href="#">更多<span class="icon_more"></span></a> <div class="dropdown_list"> <dl> <dd><a href="https://hk.answers.yahoo.com/" target="_blank">知識+</a></dd> <dd><a href="https://hktravelnow.yahoo.com/" target="_blank">旅遊</a></dd> <dd><a href="https://hk.finance.yahoo.com/properties/" target="_blank">地產</a></dd> <dd><a href="https://yahoo-food.myguide.hk/d/" target="_blank">新煮意</a></dd> <dd><a href="https://yahoo-education.myguide.hk/d/" target="_blank">教育學習</a></dd> </dl> </div></li></ul> </div></div>');
	init_main_nav();
	
	//if($('.load-more').length > 0) {
		
		$(window).scroll(function() {
			if(($('#club-news').length==0 || $('#club-news').hasClass('active')) && $('.load-more').length > 0 && $('.load-more').visible(true)) {
				if(window.allow_retrieve_post) {
					window.allow_retrieve_post = false;
					$('.load-more').click();
				}
			}
		});
	//}

	/* [Home Page] Top post module */
	if(window.location.pathname==="/" && $('#top-posts').length > 0) {
		var tmp_top_post_tag_name = window.top_post_tag_name;
		get_post_from_api(tmp_top_post_tag_name, 10, "", "top_post_callback");
	} else if($('#top-posts').length > 0) {
		$('#top-posts').remove();
	}

	/* [Home Page] Middle match information module */
	if(window.location.pathname==="/" && ($('#schedule-brand').length > 0 || $('#mobile-schedule-brand').length > 0)) {
	} else if(window.location.pathname!=="/") {
		//$('#schedule-brand').remove();
		//$('#mobile-schedule-brand').remove();
	}


	// Tidy up post list item
	if($('body').hasClass('index-page') && $('.post-list-container').length > 0) {
		tidy_up_articles();
	}

	if(window.location.pathname.indexOf('/post/') > -1 && $('article').length > 0) {
		tidy_up_single_post();
	}

	//(function(){
	/* var sectionCode = sectionCode || [];

  sectionCode.push("ad54e37a-8a59-433c-9a4c-b9ca495fe74c");


	  var script = document.createElement("script");
	  script.async = true;
	  script.src = "https://s.yimg.com/av/gemini/ga/gemini.js";
	  document.body.appendChild(script); */
	//})();

	getData(DARLASPACEID);

	var tmp = setInterval(function() {
		if(init_ad()!=="123") {
			clearInterval(tmp);
		}
	}, 500);


	if(window.location.pathname.indexOf("/post/") > -1 || window.location.pathname.indexOf("/info") > -1) {
		
		if(is_mobile()) {$('.right-box').remove();}
		tidy_up_articles();
		load_more_article();
		$(document).on('click', '.load-more', function() {
			var tmp_post_count = $('.post-list-container article').length;
			load_more_article();
			var remove_loadmorebtn = setTimeout(function() {
				if($('.post-list-container article').length == tmp_post_count) {
					$('.load-more').hide();
				}
			}, 1000);
		});
	} else {
		$('.load-more').click(function() {
			//var tmp_post_count = $('.post-list-container article').length;
			/* var update_post_layout = setInterval(function() {
				if($('.post-list-container article').length > tmp_post_count) {
					//tidy_up_articles();
					clearInterval(update_post_layout);
				}
			}, 500); */

			/* var remove_loadmorebtn = setTimeout(function() {
				if($('.post-list-container article').length == tmp_post_count) {
					clearInterval(update_post_layout);
					$('.load-more').hide();
				}
			}, 1000); */
		});
	}

		$.getJSON('https://yahoo-promotion.myguide.hk/tumblr/football-hub/feed/live.json', function(res) {
			$.each(res,function(iindex, matchv) {
				if(new Date(matchv.starttime) < new Date() && new Date(matchv.endtime) > new Date()) {
					$('#current-football').show();
					$('#current-football .current-txt').text("直播中 - " + matchv.team1 + " vs " + matchv.team2);
					$('#current-football a').attr({"href":matchv.videourl, 'target':"_blank"});
					$('.nav-2 > a').attr({'href':matchv.videourl, 'target':"_blank"});
				}
				
				window.live_match_id.push(matchv.matchid);

			});
		});

		$.getJSON('https://yahoo-promotion.myguide.hk/tumblr/football-hub/feed/live_oncc.json', function(res) {
			window.live_match_id_oncc = res;
		});
});


var DARLASPACEID = window.spaceID || '1197801442';
//var DARLASPACEID = "1197771850";
DARLA_CONFIG = {
  positions: {
		"DEFAULT": {
			supports: {"bg": 1,"exp-ovr": 1,"exp-push": 0,"lyr": 0,"cmsg":1}
		},
		"LREC": {dest:"yom-ad-LREC-iframe",w:300,h:250},
		"LREC-1": {dest:"yom-ad-LRECagain-iframe",w:300,h:250},
		"LREC2": {dest:"yom-ad-LREC2-iframe",w:300,h:250},
		"N": {dest:"yom-ad-N-iframe",w:728,h:90},
		"LDRB": {dest:"yom-ad-LDRB-iframe",w:728,h:90},
		"MON": {dest:"yom-ad-MON-iframe",w:300,h:600},
		"MAST": {dest:"yom-ad-MAST-iframe",w:970,h:250},
		"SPL": {
			dest:"yom-ad-SPL-iframe",
			flex:"both", //<---this is required to generate dynamic ad dimension, width and height of the ad position will be rendered as 100%
			clean:"yom-ad-SPLSizer",
		//    flex: {w: {max: 3000, min: 1280},h:{max:3000,min:533}},
			w:1440,
			h:600
			/* w:1600,
			h:400 */
		},
		"NP1": {dest:"yom-ad-NP1-iframe",w:300,h:100},
		"WPS": {dest:"yom-ad-WPS-iframe",w:300,h:50,supports:{"exp-ovr":1,"lyr":1,"exp-push":1}}
	},
	events: {
		AUTO: {
			sp:	DARLASPACEID,	//required space id
			autoRT:	15000, //default time to rotate ads
			autoStart: true,   //automatically start trying to do time based rotation (based on time intervals, at time of configuration)
			ps://required position list
			{	LREC: { autoRT: 60000, autoIV: 5000 }, NP1: { autoRT: 60000, autoIV: 5000 }	}
		},
//below is different list of ad positions for different page layout
		indexFetch: {
			sp:	DARLASPACEID,	//required space id
			ps:	"MAST,LREC,LREC2",	//required position list
			sa: {
				"magpage": "index",				// [anykey] : [anyval]
				"hashtag": ""   // [anykey] : [anyval]
			}
		},
		mobileIndexFetch: {
			sp:	DARLASPACEID,	//required space id
			ps:	"LREC,LREC2",	//required position list
			sa: {
				"magpage": "index",				// [anykey] : [anyval]
				"hashtag": ""   // [anykey] : [anyval]
			}
		},
		singlePageMastFetch: {
			sp:	DARLASPACEID,	//required space id
			ps:	"MAST",	//required position list
			sa: {
				"magpage": "post",				// [anykey] : [anyval]
				"hashtag": ""   // [anykey] : [anyval]
			}
		},
		singlePageLdrbFetch: {
			sp:	DARLASPACEID,	//required space id
			ps:	"LDRB",	//required position list
			sa: {
				"magpage": "post",				// [anykey] : [anyval]
				"hashtag": ""   // [anykey] : [anyval]
			}
		},
		subsectionFetch: {
			sp:	DARLASPACEID,	//required space id
			ps:	"MAST,LREC,LREC2",	//required position list
			sa: {
				"magpage":	"",				// [anykey] : [anyval]
				"hashtag": ""   // [anykey] : [anyval]
			}
		},
		articleFetch: {
			sp:			DARLASPACEID,	//required space id
			ps:			"LDRB,LREC,MON,SPL",	//required position list
			sa: {
				"magpage": "post",				// [anykey] : [anyval]
				"hashtag": ""   // [anykey] : [anyval]
			}
		},
		mobileArticleFetch: {
			sp:DARLASPACEID,//required space id
			ps:"LREC,LREC2",//required position list
			sa: {
				"magpage": "",				// [anykey] : [anyval]
				"hashtag": ""   // [anykey] : [anyval]
			}
		}
   }
};

DARLA_CONFIG.onPosMsg = function(cmd, posit, msg) {
	try { // onPosMsg swallows errors, so let's log them
		if (cmd === 'cmsg') {
			if(msg == 'splash-expand' || msg == 'splash-collapse' || msg == 'splash-start') {
				gMsg = msg;
				setSplashAdDimention(msg);
			}else if (cmd === 'in-view') {
				console.log(arguments);
			}
		}
	} catch(e) {
		console.error(e);
		throw e;
	}
};

function setSplashAdDimention(msg) {
	var aspectRatio = 2.4;
	if(msg && msg === 'splash-expand') {
	aspectRatio = 1.778;
	}
	var paddingTop = (100 /aspectRatio) + '%';
	var splashAdHeight = document.getElementById("yom-ad-SPLSizer").offsetWidth/aspectRatio;
	document.getElementById("sb_rel_yom-ad-SPL-iframe").style.height=splashAdHeight+"px";
	document.getElementById("yom-ad-SPLSizer").style.overflow="visible";
	document.getElementById("yom-ad-SPLSizer").style.display="inline-block";

}

/* <script id="widget" type="text/javascript" src="https://fc.yahoo.com/sdarla/php/client.php?debug=1&f="+spaceid+"&npv=1"></script> */

function getData(spaceid)
{
	var s = document.createElement("script");
	s.type = "text/javascript";
	s.src ="https://fc.yahoo.com/sdarla/php/client.php?debug=1&f="+spaceid+"&npv=1";
	s.id = "widget";
	document.getElementById("output").innerHTML = "";
	document.getElementById("output").appendChild(s);
}

function init_main_nav() {

	var tmp_container = $('#navigation');
	var tmp_mobile_container = $('#slider-nav');
	if(tmp_container.length > 0) {
		var tmp_menu_el = $('<ol class="navi" />');
		var tmp_mobile_menu_el = $('<ul />');

		$.each(menu_item, function(index, value) {
			tmp_menu_el.append('<li class="'+index+' '+(window.location.pathname===value.url ?"active" : ((window.location.pathname.indexOf("/post/") > -1 && value.url=="/tagged/video") ?"active" :""))+'"><a href="'+value.url+'"></a></li>');
			tmp_mobile_menu_el.append('<li><a href="'+value.url+'">'+value.label+'</a></li>');
		});
		tmp_container.append(tmp_menu_el);
		tmp_mobile_container.append(tmp_mobile_menu_el);
	}

}

function init_ad() {
	if (window.DARLA && typeof window.DARLA !=="undefined" &&  typeof window.DARLA.config() == "object" && window.DARLA.config()!==null && typeof window.DARLA.config().events== "object") {

		if(!is_mobile()) {
			var tmp_event = "";

			if(window.location.pathname=="/" || window.location.pathname.indexOf('/tagged/') > -1) {
				tmp_event = "indexFetch";
				if(typeof window.DARLA.config().events.indexFetch =="undefined" || typeof window.DARLA.config().events.indexFetch.sa =="undefined" || typeof window.DARLA.config().events.indexFetch.sa.magpage =="undefined") return "123";
				if(window.location.pathname=="/") {
					window.DARLA.config().events.indexFetch.sa.magpage = "index";
				} else {
					window.DARLA.config().events.indexFetch.sa.magpage = "index-tag";
					window.DARLA.config().events.indexFetch.sa.hashtag = encodeURI(window.location.pathname.replace("/tagged/", ""));

				}

			} else if(window.location.pathname.indexOf("/post/") > -1) {
				tmp_event  = "articleFetch";
				if(typeof window.DARLA.config().events.articleFetch =="undefined" || typeof window.DARLA.config().events.articleFetch.sa =="undefined" || typeof window.DARLA.config().events.articleFetch.sa.magpage =="undefined") return "123";
				window.DARLA.config().events.articleFetch.sa.magpage = "post";

				/* SH */
				var art_tags = new Array();
				if($('ol.hashtags').length > 0 && $('ol.hashtags li').length > 0) {
					$('ol.hashtags li').each(function() {
						if($(this).find('> a').text()!=="") {
							art_tags.push(encodeURI($(this).find('> a').text().replace('#','')));
						}
					});
				}
				window.DARLA.config().events.articleFetch.sa.hashtag = art_tags.join(";");
			} else {
				tmp_event = (window.location.pathname.indexOf("schedule") > -1) ?"singlePageLdrbFetch" :"singlePageMastFetch";
				if(tmp_event==="singlePageLdrbFetch") {
					if(typeof window.DARLA.config().events.singlePageLdrbFetch =="undefined" || typeof window.DARLA.config().events.singlePageLdrbFetch.sa =="undefined" || typeof window.DARLA.config().events.singlePageLdrbFetch.sa.magpage =="undefined") return "123";
					window.DARLA.config().events.singlePageLdrbFetch.sa.hashtag = encodeURI(window.location.pathname.replace("/",""));
				} else {
					if(typeof window.DARLA.config().events.singlePageMastFetch =="undefined" || typeof window.DARLA.config().events.singlePageMastFetch.sa =="undefined" || typeof window.DARLA.config().events.singlePageMastFetch.sa.magpage =="undefined") return "123";
					window.DARLA.config().events.singlePageMastFetch.sa.hashtag = encodeURI(window.location.pathname.replace("/",""));
				}

			}
			DARLA.event(tmp_event);
		} else {
			if(window.location.pathname=="/" || window.location.pathname.indexOf('/tagged/') > -1) {
				tmp_event = "mobileIndexFetch";
				if(window.location.pathname=="/") {
					window.DARLA.config().events.indexFetch.sa.magpage = "index";
				} else {
					window.DARLA.config().events.indexFetch.sa.magpage = "index-tag";
					window.DARLA.config().events.indexFetch.sa.hashtag = encodeURI(window.location.pathname.replace("/tagged/", ""));

				}
			} else if(window.location.pathname.indexOf("/post/") > -1) {

					tmp_event  = "mobileArticleFetch" ;

					window.DARLA.config().events.mobileArticleFetch.sa.magpage = "post";
					/* SH */
					var art_tags = new Array();
					if($('ol.hashtags').length > 0 && $('ol.hashtags li').length > 0) {
						$('ol.hashtags li').each(function() {
							if($(this).find('> a').text()!=="") {
								art_tags.push(encodeURI($(this).find('> a').text().replace('#','')));
							}
						});
					}
					window.DARLA.config().events.mobileArticleFetch.sa.hashtag = art_tags.join(";");
				}
			DARLA.event(tmp_event);

		}
	} else {
		return "123";
	}
}

function is_mobile(){
	return ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) ? true : false;
}

/* Global Function */
function array_to_string_query(arr) {
	return $.param(arr);
}

function loadFunction(fn_name, fn_paramenter) {
	var fn = window[fn_name];
	if(typeof fn === 'function') {
	    fn(fn_paramenter);
	}
}
/* Global Function */

function tidy_up_articles() {
	$('.post-list-container article:not(.post-ready,.article-ad)').each(function() {
		//console.log($(this));
		var tmp_reblog_title = $(this).find('span.tmp-reblog-title').text() || "";
		var tmp_reblog_name = $(this).find('span.tmp-reblog-name').text() || "";
		var tmp_reblog_link = $(this).find('span.tmp-reblog-link').text() || "";

		var tmp_title = $(this).find('span.tmp-list-title').text() || "";
		var tmp_permalink = $(this).find('span.tmp-list-permalink').text() || "";
		var tmp_content = $(this).find('span.tmp-list-content').html() || "";
		var tmp_thumbnail = $(this).find('span.tmp-list-thumbnail a:eq(0)').text() || $(this).find('span.tmp-list-thumbnail:eq(0)').text() || "";
		var tmp_note = $(this).find('span.tmp-list-note a').text() || 0;
		var tmp_reblog_btn_link = $(this).find('span.tmp-reblog-btn-link').text() || 0;
		var tmp_like_link = $(this).find('span.tmp-like-link').html() || 0;

		var invalid_post = true;

		if(tmp_title==="" && tmp_content!=="") {
			tmp_title = get_title_from_content(tmp_content);
		}
		if(tmp_thumbnail==="" && tmp_content!=="") {
			tmp_thumbnail = get_thumbnail_from_content(tmp_content);
		}
		//console.log(tmp_thumbnail + " | " + tmp_permalink + " | " + tmp_title);
		if(tmp_permalink!=="" && tmp_title!=="") {
			var template = $('#template-common-post-item').html();

			if(tmp_reblog_title!=="" && tmp_reblog_name!=="" && tmp_reblog_link!=="") {
				template = template.replace(/__authorLink__/g, tmp_reblog_link)
													 .replace(/__authorLogo__/g, '<img src="' + window.tumblr_blog_avator.replace(/__reblogFromName__/g,tmp_reblog_name) + '" alt="" />')
													 .replace(/__authorName__/g,tmp_reblog_title);
			} else {
				var tmp_el = $('<div />').html(template);
				tmp_el.find('.media-author').remove();
				template = tmp_el.html();
			}

			if(tmp_content!=="") {
				tmp_content = $('<div />').html(clear_img(tmp_content)).find('p:eq(0)').text();
			}
			tmp_title = tmp_title.substr(0,25) + (tmp_title.length > 25 ?"..." : "");
			tmp_content = tmp_content.substr(0,36) + (tmp_content.length > 36 ?"..." : "");

			var social_tools = "";
			social_tools += get_facebook_share_link(tmp_permalink, tmp_title);
			social_tools += get_mail_share_link(tmp_permalink, tmp_title);
			social_tools += get_reblog_share_link(tmp_reblog_btn_link);
			social_tools += '<li class="like">'+tmp_like_link+'</li>';

			template = template.replace(/__postPermalink__/g, tmp_permalink)
												 .replace(/__postThumbnail__/g, ((tmp_thumbnail!=='') ?'<img src="' + tmp_thumbnail + '" alt="" />' : ''))
												 .replace(/__postTitle__/g,tmp_title)
												 .replace(/__postShortDesc__/g,tmp_content)
												 .replace(/__postNote__/g,tmp_note)
												 .replace(/__socialTools__/g, social_tools);


			$(this).find('.post-content').html(template)
			$(this).addClass("post-ready");
			invalid_post = false;
		}

		if(invalid_post) {
			$(this).remove();
		}
	});

	if(window.location.pathname=="/" || window.location.pathname.indexOf("/tagged/") > -1) {
		if($('.post-list-container article.post-ready').length >= 3 && window.init_post_stream_lrec1) {
			if(!is_mobile()) {
				$('<article class="article-ad"><div class="ad-container ad-lrec-container"><div id="yom-ad-LREC-iframe" class="ad-lrec" ></div></div></article>').insertAfter(".post-list-container article.post-ready:eq(2)");
			} else {
				//$('<article class="article-ad"><div class="ad-container ad-native-container"><div class="gemini-ad-ad54e37a-8a59-433c-9a4c-b9ca495fe74c"></div></div></article>').insertAfter(".post-list-container article.post-ready:eq(2)");
			}
			window.init_post_stream_lrec1 = false;
		}

		if(!is_mobile() && $('.post-list-container article.post-ready').length >= 9 && window.init_post_stream_lrec2) {
			$('<article class="article-ad"><div class="ad-container ad-lrec2-container"><div id="yom-ad-LREC2-iframe" class="ad-lrec" ></div></div></article>').insertAfter(".post-list-container article.post-ready:eq(8)");
			window.init_post_stream_lrec2 = false;
		} else if(!is_mobile() && $('.post-list-container article.post-ready').length < 9 && window.init_post_stream_lrec2) {
			$('<article class="article-ad"><div class="ad-container ad-lrec2-container"><div id="yom-ad-LREC2-iframe" class="ad-lrec" ></div></div></article>').insertAfter(".post-list-container article.post-ready:last");
			window.init_post_stream_lrec2 = false;
		}
	}

	$('.grid').masonry('reloadItems').imagesLoaded().progress(function() {
		$('.grid').masonry('layout');
	});
}


function tidy_up_single_post() {
	var permalink_article_container = $('.article.permalink-article');
	var tmp_reblog_title = permalink_article_container.find('span.tmp-reblog-title').text() || "";
	var tmp_reblog_name = permalink_article_container.find('span.tmp-reblog-name').text() || "";
	var tmp_reblog_link = permalink_article_container.find('span.tmp-reblog-link').text() || "";

	var tmp_title = permalink_article_container.find('span.tmp-list-title').text() || "";
	var tmp_permalink = permalink_article_container.find('span.tmp-list-permalink').text() || "";
	var tmp_images = new Array();//permalink_article_container.find('span.tmp-list-thumbnail a:eq(0)').text() ||permalink_article_container.find('span.tmp-list-thumbnail:eq(0)').text() || "";
	if(permalink_article_container.find('span.tmp-list-thumbnail').length > 0) {
		permalink_article_container.find('span.tmp-list-thumbnail').each(function() {
			var timage = $(this).find('a').text() || $(this).text() || "";
			if(timage!=="") {
				tmp_images.push(timage);
			}
		});
	}
	var tmp_content = permalink_article_container.find('span.tmp-list-content').html() || "";
	var tmp_note = permalink_article_container.find('span.tmp-list-note a').text() || 0;
	var tmp_date = permalink_article_container.find('span.tmp-list-date').text() || 0;
	var tmp_reblog_btn_link = permalink_article_container.find('span.tmp-reblog-btn-link').text() || '';
	var tmp_like_link = permalink_article_container.find('span.tmp-like-link').html() || '';
	var tmp_tags = "";
	if(permalink_article_container.find('ol.hashtags').length > 0) {
		tmp_tags = permalink_article_container.find('ol.hashtags').clone();
	}

	if(tmp_title==="" && tmp_content!=="") {
		tmp_title = get_title_from_content(tmp_content);
	}
	/* Generate Article info */
	if($('#template-article-info').length > 0) {
		var article_info_template = $('#template-article-info').html();

		if(tmp_reblog_title!=="" && tmp_reblog_name!=="" && tmp_reblog_link!=="") {
			article_info_template = article_info_template.replace(/__reblogFromTitle__/g, tmp_reblog_title)
																									 .replace(/__reblogFromIcon__/g, '<img src="'+window.tumblr_blog_avator.replace(/__reblogFromName__/g,tmp_reblog_name)+'" alt="" />');
		} else {
			var tmp_el = $('<div />').html(article_info_template);
			tmp_el.find('.article-logo').remove();
			tmp_el.find('.article-logo-name').remove();
			article_info_template = tmp_el.html();
		}

		var social_tools = "";
		social_tools += get_facebook_share_link(tmp_permalink, tmp_title);
		social_tools += get_mail_share_link(tmp_permalink, tmp_title);
		social_tools += get_reblog_share_link(tmp_reblog_btn_link);
		social_tools += '<li class="like">'+tmp_like_link+'</li>';
		article_info_template = article_info_template.replace(/__articleTitle__/gi,tmp_title)
																								 .replace(/__articleDate__/gi,tmp_date)
																								 .replace(/__socialTools__/gi,social_tools);

	}
	//return false;
	var tmp_content_wrapper = $('<div class="article-main pm-60" />');

	if(!$('.permalink-article').hasClass('post-video')) {
		$.each(tmp_images,function(index, value) {
			tmp_content_wrapper.append('<img src="'+value+'" />');
		});
	}

	tmp_content_wrapper.append(tmp_content);
	//var social_add_to_this = ('<div class="a2a_kit a2a_kit_size_32 a2a_default_style addtoany-container"><ol class="share-icons pm-60"><li class="share-facebook"><a class="a2a_button_facebook"></a></li><li class="share-tumblur"><a class="a2a_button_tumblr"></a></li><li class="share-googleplus"><a class="a2a_button_google_plus"></a></li><li class="share-pinterest"><a class="a2a_button_pinterest"></a></li><li class="share-twitter"><a class="a2a_button_twitter"></a></li><li class="share-yahoo"><a class="a2a_button_yahoo_mail"></a></li></ol></div>');
	var social_add_to_this = '<ol class="share-icons tools  pm-60">';
	if(is_mobile()) {
		social_add_to_this += '<li class="whatsapp"><a href="whatsapp://send?text='+encodeURI(tmp_permalink)+'"></a></li>';
		social_add_to_this += '<li class="line"><a href="line://msg/text/'+encodeURI(tmp_permalink)+'"></a></li>';
	}
	social_add_to_this += get_facebook_share_link(tmp_permalink, tmp_title);
	social_add_to_this += get_mail_share_link(tmp_permalink, tmp_title);
	social_add_to_this += get_reblog_share_link(tmp_reblog_btn_link);
	social_add_to_this += '<li class="like">'+tmp_like_link+'</li>';

	social_add_to_this += "</ol>";
	permalink_article_container.html("").append(article_info_template).append(tmp_content_wrapper).append(tmp_tags).append(social_add_to_this).append('<div class="ad-container ad-lrec2-container"><div id="yom-ad-LREC2-iframe" class="ad-lrec2" ></div></div>');
	$('.article-main a').attr('target', '_blank');
	//if($('.article-main p').length > 0) {
	if(is_mobile()) {
		$('.article-main > *:eq(0)').append('<div class="ad-container ad-lrec-container"><div id="yom-ad-LREC-iframe" class="ad-lrec" ></div></div>');
	}
	//} else {
		//$('.article-main p:eq(0)').prepend('<div class="ad-container ad-lrec-container"><div id="yom-ad-LREC-iframe" class="ad-lrec" ></div></div>');
	//}


}

function get_facebook_share_link(plink, tmptitle) {
	var plink = plink || '';
	var tmptitle = tmptitle || '';
	return (plink!=='') ?'<li class="fb"><a href="http://facebook.com/sharer.php?u='+encodeURI(plink)+'&amp;t='+encodeURI(tmptitle)+'"></a></li>' :'';
}

function get_mail_share_link(plink, tmptitle) {
	var plink = plink || '';
	var tmptitle = tmptitle || '';
	return (plink!=='') ?'<li class="mail"><a href="mailto:?subject=Yahoo Football Hub&body='+encodeURI(tmptitle + " | " + plink) + '"></a></li>' :'';
}

function get_reblog_share_link(plink) {
	var plink = plink || '';
	return (plink!=='') ?'<li class="share"><a href="'+plink+'"></a></li>' :'';
}
function top_post_callback(data) {
	var tmp_allow_display = false;
	if(typeof data==="object" && data!==null && typeof data.posts==="object" && data.posts.length > 0) {
		var max_allow = (data.posts.length < max_top_post) ? data.posts.length : max_top_post;
		for(i=0; i<max_allow; i++) {
			var tmp_author_logo = "",
					tmp_author_title = "",
					tmp_author_permalink = "",
					tmp_author_permalink = "",
					tmp_post_id = "",
					tmp_post_reblog_key = "",
					tmp_post_permalink = "",
					tmp_post_thumbnail = "",
					tmp_post_title = "",
					tmp_post_note_count = "";

			if(typeof data.posts[i].reblogged_from_name==="string" && data.posts[i].reblogged_from_name!=="") {
				var tmp_author_name = data.posts[i].reblogged_from_name;
				tmp_author_logo = window.tumblr_blog_avator.replace("__reblogFromName__", tmp_author_name) ;
			}
			tmp_author_title = data.posts[i].reblogged_from_title || '';
			tmp_author_permalink = data.posts[i].reblogged_from_uuid || '';

			tmp_post_id = data.posts[i].id;
			tmp_post_reblog_key = data.posts[i].reblog_key;
			tmp_post_note_count = data.posts[i].note_count || 0;
			tmp_post_permalink = data.posts[i].post_url;

			if(data.posts[i].type==="text") {
				tmp_post_title = data.posts[i].title;
				tmp_post_title = (tmp_post_title==="") ? get_title_from_content(data.posts[i].body) : tmp_post_title;
				tmp_post_thumbnail = get_thumbnail_from_content(data.posts[i].body);
			} else if(data.posts[i].type==="photo") {
				tmp_post_title = get_title_from_content(data.posts[i].caption);
				tmp_post_thumbnail = get_thumbnail_from_api_array(data.posts[i].photos) || get_thumbnail_from_content(data.posts[i].caption) || ""
			}
			//console.log(tmp_author_logo + " | " + tmp_author_title + " | " + tmp_author_permalink);
			//console.log(tmp_post_permalink + " | " + tmp_post_thumbnail + " | " + tmp_post_title + " | " + tmp_post_note_count);

			if(tmp_post_title!=="" && tmp_post_thumbnail!=="" && tmp_post_permalink!=="") {
				var template = $('#template-top-post-item').html();

				if(tmp_author_logo!=="" && tmp_author_title!=="" && tmp_author_permalink!=="") {
					template = template.replace(/__authorPermalink__/g, tmp_author_permalink)
													 	 .replace(/__authorLogo__/g, '<img src="' + tmp_author_logo + '" alt="" />')
													 	 .replace(/__authorName__/g, tmp_author_title);
				} else {
					var tmp_el = $('<div />').html(template);
					tmp_el.find('.media-author').remove();
					template = tmp_el.html();
				}

				var social_tools = "";
				social_tools += get_reblog_share_link("https://www.tumblr.com/reblog/" + tmp_post_id + "/" + tmp_post_reblog_key);
				social_tools += '<li class="like"><iframe id="like_iframe_'+tmp_post_id+'" src="http://assets.tumblr.com/assets/html/like_iframe.html?_v=662afb16c40c53f44feaf453f106a197#name=hkleague&amp;post_id='+tmp_post_id+'&amp;color=black&amp;rk='+tmp_post_reblog_key+'&amp;root_id='+tmp_post_id+'" scrolling="no" width="20" height="20" frameborder="0" class="like_toggle" allowtransparency="true" name="like_iframe_'+tmp_post_id+'"></iframe></li>';

				template = template.replace(/__postThumbnail__/g, tmp_post_thumbnail)
													 .replace(/__postTitle__/g, tmp_post_title.substring(0,35) + (tmp_post_title.length > 35 ?"..." :""))
													 .replace(/__postNoteCount__/g, tmp_post_note_count + " notes")
													 .replace(/__postPermalink__/g, tmp_post_permalink)
													 .replace(/__socialTools__/g, social_tools);

				$(top_post_container_selector).append(template);
			}
		}
		tmp_allow_display = true;
	}

	if(!tmp_allow_display) {
		$('#top-posts').remove();
	}
}

/* function common_list_item(id, url, content, title, thumbnail, container) {
  var tmp_content = (desc && get_short_desc_from_content(desc, (title===""))) || "";
  var tmp_title = (title && get_title_from_content(title)) || get_title_from_content(desc) || '';
  var tmp_thumbnail = thumbnail || get_thumbnail_from_content(desc);
  if(tmp_content==="" && tmp_title==="" && tmp_title==="") return false;

} */


function clear_img(str) { return str.replace(/<img/g, "<xxx"); }
function get_title_from_content(str) {
	if(str!=="") {
		str = $("<div />").html(clear_img(str));
		var tmp_title_return = str.find('h2:eq(0)').text();
		if(tmp_title_return==="") {
			str.find('p').each(function() {
				tmp_title_return = $(this).text();
			});
		}
		return (tmp_title_return!=="") ?tmp_title_return.trim() : "";
	}
	return "";
}
function get_short_desc_from_content(str, no_title) {}

function get_thumbnail_from_content(str) {
	if(str!=="") {
		str = $("<div />").html(clear_img(str));
		if (str.find('xxx:eq(0)').attr('src') !== undefined) {
			return str.find('xxx:eq(0)').attr('src');
		}
	}
	return "";
}

function get_thumbnail_from_api_array(arr) {
	if(typeof arr==="object" && arr.length > 0) {
		for(k=0; k<arr.length; k++) {
			if(typeof arr[k].alt_sizes==="object" && arr[k].alt_sizes.length >0) {
				for(j=0; j<arr.length; j++) {
					//if(arr[k].alt_sizes[j].width >= 300 && arr[k].alt_sizes[j].width <= 600) {
						return arr[k].alt_sizes[j].url;
					//}
				}
			}
		}
	}
	return false;
}

function load_more_article() {
	//console.log(window.more_article_offset + " | " + window.more_article_limit);
	var tmp_tag = window.search_tag || "";
	if(tmp_tag!=="#") {
		get_post_from_api(tmp_tag, window.more_article_limit, window.more_article_offset, "load_more_article_callback");
	}
	window.more_article_offset += window.more_article_limit;
}

function load_more_article_callback(data) {
	var tmp_allow_display = false;
	if(typeof data==="object" && data!==null && typeof data.posts==="object" && data.posts.length > 0) {

		for(i=0; i<data.posts.length; i++) {
			var tmp_author_logo = "",
					tmp_author_title = "",
					tmp_author_name = "",
					tmp_author_permalink = "",
					tmp_post_id = "",
					tmp_post_reblog_key = "",
					tmp_post_permalink = "",
					tmp_post_thumbnail = "",
					tmp_post_title = "",
					tmp_post_content = "",
					tmp_post_note_count = "";

			if(typeof data.posts[i].reblogged_from_name==="string" && data.posts[i].reblogged_from_name!=="") {
				tmp_author_name = data.posts[i].reblogged_from_name;
				tmp_author_logo = window.tumblr_blog_avator.replace("__reblogFromName__", tmp_author_name) ;
			}
			tmp_author_title = data.posts[i].reblogged_from_title || '';
			tmp_author_permalink = data.posts[i].reblogged_from_uuid || '';

			tmp_post_id = data.posts[i].id;
			tmp_post_reblog_key = data.posts[i].reblog_key;
			tmp_post_note_count = data.posts[i].note_count || 0;
			tmp_post_permalink = data.posts[i].post_url;
			tmp_post_content = data.posts[i].caption || data.posts[i].body || ""
			if(data.posts[i].type==="text") {
				tmp_post_title = data.posts[i].title;
				tmp_post_thumbnail = get_thumbnail_from_content(tmp_post_content);
			} else if(data.posts[i].type==="photo") {
				//tmp_post_title = get_title_from_content(tmp_post_content);
				tmp_post_thumbnail = get_thumbnail_from_api_array(data.posts[i].photos) || get_thumbnail_from_content(tmp_post_content) || ""
			} else if(data.posts[i].type==="video") {
				tmp_post_thumbnail = data.posts[i].thumbnail_url || get_thumbnail_from_content(tmp_post_content) || ""
			}
			tmp_post_title = (tmp_post_title==="") ? get_title_from_content(tmp_post_content) : tmp_post_title;

			//console.log(tmp_post_title + " | " + tmp_post_permalink + " | " + tmp_post_thumbnail);
			if(tmp_post_title!=="" && tmp_post_permalink!=="") {
				var tmp_el = $('<div class="post-content" />');
				tmp_el = tmp_el.append('<span class="tmp-list-title">'+tmp_post_title+'</span>')
								 .append('<span class="tmp-list-permalink">'+tmp_post_permalink+'</span>')
								 .append('<span class="tmp-list-content">'+tmp_post_content+'</span>')
								 .append('<span class="tmp-list-thumbnail">'+tmp_post_thumbnail+'</span>')
								 .append('<span class="tmp-reblog-title">'+tmp_author_title+'</span>')
								 .append('<span class="tmp-reblog-name">'+tmp_author_name+'</span>')
								 .append('<span class="tmp-reblog-link">'+tmp_author_permalink+'</span>')
								 .append('<span class="tmp-reblog-btn-link">https://www.tumblr.com/reblog/'+tmp_post_id+'/'+tmp_post_reblog_key+'</span>')
								 .append('<span class="tmp-like-link"><iframe id="like_iframe_'+tmp_post_id+'" src="http://assets.tumblr.com/assets/html/like_iframe.html?_v=662afb16c40c53f44feaf453f106a197#name=hkleague&amp;post_id='+tmp_post_id+'&amp;color=black&amp;rk='+tmp_post_reblog_key+'&amp;root_id='+tmp_post_id+'" scrolling="no" width="20" height="20" frameborder="0" class="like_toggle" allowtransparency="true" name="like_iframe_'+tmp_post_id+'"></iframe></span>');
	      if($('.inner.more-article #flow-posts').length > 0) {
	      	$('.inner.more-article #flow-posts').append($('<article />').append(tmp_el));
	      } else {
	      	$('#flow-posts').append($('<article />').append(tmp_el));
	      }
	      

			}
			if(i==1) {
				$('.inner.more-article #flow-posts').append('<article class="article-ad"><div class="ad-container ad-native-container"><div class="gemini-ad-ad54e37a-8a59-433c-9a4c-b9ca495fe74c"></div></div></article>');
			}
		}
		tidy_up_articles();
		window.allow_retrieve_post = true;
	} else {
		$('.load-more').remove();
	}
}

/* Tumblr related function */
function get_post_from_api(tag, limit, poffset, callback) {
	//console.log(tag + " | " + limit + " | " + poffset);
	if(window.tumblr_api_key!=="") {
		//console.log("tumblr api key validated");
		var tmp_tag = tag || "";
		var tmp_limit = limit || 20;
		var tmp_offset = poffset || 0;
		var tmp_sq = ({
			"api_key" : window.tumblr_api_key,
			"tag" : tmp_tag,
			"limit" : tmp_limit,
			"offset" : poffset,
			"reblog_info" : "true",
		})
		var query_url = window.tmp_api_url + "?" + array_to_string_query(tmp_sq);
		//console.log("query url : " + query_url);
		$.ajax({
			'url' : query_url,
			'method' : "GET",
			'dataType' : "jsonp"
		}).done(function(data) {
			if(
				typeof data==="object" && typeof data.meta==="object" &&
				typeof data.meta.status==="number" && data.meta.status===200
			) {
				if(typeof data.response==="object" && typeof data.response.posts==="object" && data.response.posts.length > 0) {
					loadFunction(callback, data.response);
					return false;
				}
			}
			loadFunction(callback, false);
		}).fail(function() {
			loadFunction(callback, false);
		});

	}
}

/* Tumblr related function */

<?php
//allows anggular to access script without issues.
header('Access-Control-Allow-Origin: *');

$feedProvider = $_POST['feedProvider'];
$feedUrl = "";

//sets feed url.
if ($feedProvider == 'bbc'){
    $feedUrl = 'http://feeds.bbci.co.uk/news/world/rss.xml?edition=uk';
}else if ($feedProvider == 'cbn') {
    $feedUrl = 'http://www1.cbn.com/app_feeds/rss/news/rss.php?section=us';
}else if ($feedProvider ==  'yahoo') {
    $feedUrl = 'https://www.yahoo.com/news/rss/';
}

//creates a new Dom Document and loads xml from url.
$xmlDoc = new DOMDocument();
$xmlDoc->load($feedUrl);
$feedList = array ();
$items = $xmlDoc->getElementsByTagName('item');

//iterates through xml data and appends to an array.
foreach($items as $key => $item) {
    $itemTitle= $item->getElementsByTagName('title')->item(0)->childNodes->item(0)->nodeValue;
    $itemLink= $item->getElementsByTagName('link')->item(0)->childNodes->item(0)->nodeValue;
    $itemDesc= $item->getElementsByTagName('description')->item(0)->childNodes->item(0)->nodeValue;
    $itemPubDate = $item->getElementsByTagName('pubDate')->item(0)->childNodes->item(0)->nodeValue;
    $itemImgUrl = "";
    if ($feedProvider == 'bbc') {
        $media = $item->getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'thumbnail');
        foreach($media as $thumb) {
            $itemImgUrl = $thumb->getAttribute('url');
        }
    }else if ($feedProvider == 'cbn') {
        $itemImgUrl = $item->getElementsByTagName('thumbnail')->item(0)->childNodes->item(0)->nodeValue;
    }else if ($feedProvider ==  'yahoo') {
        $media = $item->getElementsByTagNameNS('http://search.yahoo.com/mrss/', 'thumbnail');
        foreach($media as $thumb) {
            $itemImgUrl = $thumb->getAttribute('url');
        }
    }
    $feedListItem = new stdClass();
    $feedListItem->title = $itemTitle;
    $feedListItem->description = $itemDesc;
    $feedListItem->pubDate = $itemPubDate;
    $feedListItem->link = $itemLink;
    $feedListItem->imgUrl = $itemImgUrl;
    array_push($feedList,$feedListItem);
}

//converts data to json and sends to angular.
print json_encode($feedList);
?>
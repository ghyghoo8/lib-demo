<?php
/**
 * API doc ：https://www.okcoin.com/t-1000052.html
 */

$symbol=$_GET['symbol'];

$tradesUrl='https://www.okcoin.com/api/trades.do?symbol='.$symbol.'&t='.time();

$post_data=array(
    'symbol'=>$symbol,
    'since'=>$since
);

//echo $symbol;

echo send_post($tradesUrl,$post_data);

/**
 * 发送post请求
 * @param string $url 请求地址
 * @param array $post_data post键值对数据
 * @return string
 */
function send_post($url, $post_data) {
    $postdata = http_build_query($post_data);
    $options = array(
        'http' => array(
        'method' => 'GET',
			'header' => 'Content-type:application/x-www-form-urlencoded',
			'content' => $postdata,
			'timeout' => 15 * 60 // 超时时间（单位:s）
		)
	);
	$context = stream_context_create($options);
	$result = file_get_contents($url, false, $context);

	return $result;
}

?>